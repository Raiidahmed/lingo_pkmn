import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
from pathlib import Path
from typing import Any, Tuple

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.exceptions import BadRequest

from backend.leaderboard_api.db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError


MAX_ACCOUNT_NAME_LEN = 24
MAX_PASSWORD_LEN = 128
MAX_WORD_BANK_ITEMS = 60
DEFAULT_ACCENT_THEME_ID = "crimson"
ACCENT_THEME_IDS = ("crimson", "violet", "teal", "amber", "mint")


def _parse_limit(raw_limit: Any, default: int = 50) -> int:
    try:
        if raw_limit is None:
            return default
        return int(raw_limit)
    except (TypeError, ValueError):
        return default


def _extract_admin_token() -> str:
    provided = request.headers.get("X-Admin-Token", "")
    auth = request.headers.get("Authorization", "")
    if not provided and auth.lower().startswith("bearer "):
        provided = auth[7:].strip()
    return provided


def _require_admin(expected_token: str) -> Tuple[bool, str]:
    if not expected_token:
        return False, "Admin token is not configured on the server."
    provided = _extract_admin_token()
    if not provided:
        return False, "Missing admin token."
    if not hmac.compare_digest(provided, expected_token):
        return False, "Invalid admin token."
    return True, ""


def _account_connect(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def _init_account_db(db_path: str) -> None:
    with _account_connect(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                name_norm TEXT NOT NULL UNIQUE,
                password_salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                accent_theme TEXT NOT NULL DEFAULT 'crimson',
                session_token TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        user_cols = {str(row["name"]) for row in conn.execute("PRAGMA table_info(users)").fetchall()}
        if "accent_theme" not in user_cols:
            conn.execute(
                "ALTER TABLE users ADD COLUMN accent_theme TEXT NOT NULL DEFAULT 'crimson'"
            )
        placeholders = ",".join("?" for _ in ACCENT_THEME_IDS)
        conn.execute(
            "UPDATE users SET accent_theme = lower(trim(accent_theme)) WHERE accent_theme IS NOT NULL"
        )
        conn.execute(
            f"UPDATE users SET accent_theme = ? WHERE accent_theme IS NULL OR accent_theme = '' OR accent_theme NOT IN ({placeholders})",
            (DEFAULT_ACCENT_THEME_ID, *ACCENT_THEME_IDS),
        )
        conn.execute(
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token) WHERE session_token IS NOT NULL"
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_saves (
                user_id INTEGER PRIMARY KEY,
                snapshot_json TEXT,
                status_json TEXT,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS user_word_bank (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                word_key TEXT NOT NULL,
                text TEXT NOT NULL,
                gloss TEXT,
                source TEXT,
                added_at TEXT NOT NULL,
                UNIQUE(user_id, word_key),
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
        )


def _utc_now() -> str:
    from datetime import datetime, timezone

    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _sanitize_account_name(value: Any) -> str:
    if not isinstance(value, str):
        raise ValidationError("Invalid account name: must be a string.")
    no_tags = re.sub(r"<[^>]*>", "", value)
    printable = "".join(ch for ch in no_tags if ch.isprintable())
    collapsed = " ".join(printable.split()).strip()
    safe = "".join(ch for ch in collapsed if ch.isalnum() or ch in " _-.")
    safe = safe.strip()
    if not safe:
        raise ValidationError("Invalid account name: must contain at least one visible character.")
    return safe[:MAX_ACCOUNT_NAME_LEN]


def _normalize_account_name(name: str) -> str:
    return name.casefold()


def _sanitize_password(value: Any) -> str:
    if value is None:
        value = "0000"
    if not isinstance(value, str):
        raise ValidationError("Invalid password: must be a string.")
    value = value or "0000"
    if len(value) < 4:
        raise ValidationError("Invalid password: must be at least 4 characters.")
    if len(value) > MAX_PASSWORD_LEN:
        raise ValidationError("Invalid password: too long.")
    return value


def _hash_password(password: str, salt_hex: str | None = None) -> tuple[str, str]:
    salt = bytes.fromhex(salt_hex) if salt_hex else secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 200_000)
    return salt.hex(), digest.hex()


def _verify_password(password: str, salt_hex: str, hash_hex: str) -> bool:
    _, digest_hex = _hash_password(password, salt_hex)
    return hmac.compare_digest(digest_hex, hash_hex)


def _extract_session_token() -> str:
    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return request.headers.get("X-Session-Token", "").strip()


def _sanitize_status_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        return {}
    clean: dict[str, Any] = {}
    for key in ("storyLabel", "storyProgress", "totalXP", "wordCount", "hasActiveRun", "levelLabel", "updatedReason"):
        value = payload.get(key)
        if isinstance(value, (str, int, float, bool)) or value is None:
            clean[key] = value
    return clean


def _sanitize_snapshot_payload(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("Invalid save snapshot: expected an object.")
    return payload


def _sanitize_word_bank(payload: Any) -> list[dict[str, str]]:
    if not isinstance(payload, list):
        return []
    items: list[dict[str, str]] = []
    seen: set[str] = set()
    for raw in payload[:MAX_WORD_BANK_ITEMS]:
        if not isinstance(raw, dict):
            continue
        key = str(raw.get("key", "")).strip().lower()[:64]
        text = str(raw.get("text", "")).strip()[:48]
        gloss = str(raw.get("gloss", "")).strip()[:80]
        source = str(raw.get("source", "")).strip()[:48]
        if not key or not text or key in seen:
            continue
        seen.add(key)
        items.append({"key": key, "text": text, "gloss": gloss, "source": source})
    return items


def _normalize_stored_accent_theme(value: Any) -> str:
    theme_id = str(value or "").strip().lower()
    if theme_id in ACCENT_THEME_IDS:
        return theme_id
    return DEFAULT_ACCENT_THEME_ID


def _sanitize_accent_theme(value: Any) -> str:
    if value is None:
        return DEFAULT_ACCENT_THEME_ID
    if not isinstance(value, str):
        raise ValidationError("Invalid accent theme: must be a string.")
    theme_id = value.strip().lower()
    if theme_id not in ACCENT_THEME_IDS:
        raise ValidationError("Invalid accent theme.")
    return theme_id


def _load_account_bundle(conn: sqlite3.Connection, user_row: sqlite3.Row) -> dict[str, Any]:
    save_row = conn.execute(
        "SELECT snapshot_json, status_json, updated_at FROM user_saves WHERE user_id = ?",
        (int(user_row["id"]),),
    ).fetchone()
    word_rows = conn.execute(
        "SELECT word_key, text, gloss, source, added_at FROM user_word_bank WHERE user_id = ? ORDER BY added_at DESC, id DESC LIMIT ?",
        (int(user_row["id"]), MAX_WORD_BANK_ITEMS),
    ).fetchall()

    save_payload = None
    if save_row:
        snapshot = None
        status = {}
        if save_row["snapshot_json"]:
            try:
                snapshot = json.loads(str(save_row["snapshot_json"]))
            except json.JSONDecodeError:
                snapshot = None
        if save_row["status_json"]:
            try:
                status = json.loads(str(save_row["status_json"]))
            except json.JSONDecodeError:
                status = {}
        save_payload = {
            "snapshot": snapshot,
            "status": status,
            "updated_at": str(save_row["updated_at"]),
        }

    accent_theme = _normalize_stored_accent_theme(user_row["accent_theme"] if "accent_theme" in user_row.keys() else None)
    return {
        "profile": {
            "name": str(user_row["name"]),
            "created_at": str(user_row["created_at"]),
            "updated_at": str(user_row["updated_at"]),
        },
        "accent_theme": accent_theme,
        "save": save_payload,
        "word_bank": [
            {
                "key": str(row["word_key"]),
                "text": str(row["text"]),
                "gloss": str(row["gloss"] or ""),
                "source": str(row["source"] or ""),
                "added_at": str(row["added_at"]),
            }
            for row in word_rows
        ],
    }


def _require_user_by_session(db_path: str) -> tuple[sqlite3.Connection | None, sqlite3.Row | None, tuple[bool, str]]:
    token = _extract_session_token()
    if not token:
        return None, None, (False, "Missing session token.")
    conn = _account_connect(db_path)
    user_row = conn.execute(
        "SELECT * FROM users WHERE session_token = ?",
        (token,),
    ).fetchone()
    if not user_row:
        conn.close()
        return None, None, (False, "Invalid session token.")
    return conn, user_row, (True, "")


def _migrate_leaderboard_names_to_accounts(db_path: str) -> None:
    # Create account rows for any existing leaderboard names so /scores is account-only.
    # Uses default PIN "0000" for migrated accounts.
    now = _utc_now()
    with _account_connect(db_path) as conn:
        rows = conn.execute(
            "SELECT name_norm, MAX(name) AS name FROM scores GROUP BY name_norm"
        ).fetchall()
        for row in rows:
            name_norm = str(row["name_norm"])
            name = str(row["name"])
            if not name_norm:
                continue
            try:
                safe_name = _sanitize_account_name(name)
            except ValidationError:
                # Fall back to normalized name (still should be safe-ish).
                safe_name = name_norm[:MAX_ACCOUNT_NAME_LEN] or 'Player'

            # Ensure user exists with default PIN.
            salt_hex, hash_hex = _hash_password('0000')
            conn.execute(
                """
                INSERT OR IGNORE INTO users (name, name_norm, password_salt, password_hash, session_token, created_at, updated_at)
                VALUES (?, ?, ?, ?, NULL, ?, ?)
                """,
                (safe_name, name_norm, salt_hex, hash_hex, now, now),
            )


def create_app(test_config: dict[str, Any] | None = None) -> Flask:
    app = Flask(__name__, static_folder=None)

    db_path = os.getenv("LEADERBOARD_DB_PATH", DEFAULT_DB_PATH)
    admin_token = os.getenv("LEADERBOARD_ADMIN_TOKEN", "")

    if test_config:
        db_path = test_config.get("LEADERBOARD_DB_PATH", db_path)
        admin_token = test_config.get("LEADERBOARD_ADMIN_TOKEN", admin_token)

    db_path = str(Path(db_path))
    db_parent = Path(db_path).parent
    db_parent.mkdir(parents=True, exist_ok=True)

    leaderboard_db = LeaderboardDB(db_path)
    leaderboard_db.init_db()
    _init_account_db(db_path)
    _migrate_leaderboard_names_to_accounts(db_path)

    app.config["LEADERBOARD_DB_PATH"] = db_path
    app.config["LEADERBOARD_ADMIN_TOKEN"] = admin_token
    app.config["LEADERBOARD_DB"] = leaderboard_db

    src_dir = Path(__file__).resolve().parent / "src"

    @app.get("/")
    def game_page():
        return send_from_directory(src_dir, "index.html")

    @app.get("/editor")
    @app.get("/editor.html")
    def editor_page():
        return send_from_directory(src_dir, "editor.html")

    @app.get("/src/")
    def src_index_page():
        return send_from_directory(src_dir, "index.html")

    @app.get("/src/<path:filename>")
    def src_files(filename: str):
        return send_from_directory(src_dir, filename)

    @app.get("/health")
    def health():
        return jsonify({"ok": True, "service": "lingo_flask"})

    @app.get("/scores")
    def get_scores():
        limit = _parse_limit(request.args.get("limit"), default=50)
        scores = app.config["LEADERBOARD_DB"].get_top_scores(limit=limit)
        return jsonify(scores)

    def _ensure_account_for_leaderboard_name(db_path: str, leaderboard_name: str) -> None:
        # Any score submission should map to an account.
        now = _utc_now()
        try:
            safe_name = _sanitize_account_name(leaderboard_name)
        except ValidationError:
            safe_name = 'Player'
        name_norm = _normalize_account_name(safe_name)
        with _account_connect(db_path) as conn:
            user_row = conn.execute(
                "SELECT id FROM users WHERE name_norm = ?",
                (name_norm,),
            ).fetchone()
            if user_row:
                return
            salt_hex, hash_hex = _hash_password('0000')
            conn.execute(
                """
                INSERT INTO users (name, name_norm, password_salt, password_hash, session_token, created_at, updated_at)
                VALUES (?, ?, ?, ?, NULL, ?, ?)
                """,
                (safe_name, name_norm, salt_hex, hash_hex, now, now),
            )

    @app.post("/scores")
    def post_score():
        try:
            payload = request.get_json(force=False, silent=False)
        except BadRequest:
            return jsonify({"ok": False, "error": "Invalid JSON body."}), 400
        if payload is None:
            payload = {}
        try:
            result = app.config["LEADERBOARD_DB"].upsert_score(payload, source="api")
        except ValidationError as exc:
            return jsonify({"ok": False, "error": str(exc)}), 400

        # Ensure the player name is an account (default PIN 0000).
        try:
            _ensure_account_for_leaderboard_name(app.config["LEADERBOARD_DB_PATH"], str(result.get("name", "")))
        except Exception:
            # Don't block scoring if migration fails.
            pass

        return jsonify({"ok": True, "stored": result})

    @app.post("/admin/dedupe")
    def admin_dedupe():
        authorized, error = _require_admin(app.config["LEADERBOARD_ADMIN_TOKEN"])
        if not authorized:
            return jsonify({"ok": False, "error": error}), 403
        result = app.config["LEADERBOARD_DB"].dedupe_all()
        return jsonify({"ok": True, **result})

    @app.post("/api/account/login")
    def account_login():
        try:
            payload = request.get_json(force=False, silent=False)
        except BadRequest:
            return jsonify({"ok": False, "error": "Invalid JSON body."}), 400
        if payload is None:
            payload = {}
        try:
            name = _sanitize_account_name(payload.get("name", ""))
            password = _sanitize_password(payload.get("password", ""))
        except ValidationError as exc:
            return jsonify({"ok": False, "error": str(exc)}), 400

        intent = str(payload.get("intent", "resume")).strip().lower() or "resume"
        if intent not in {"create", "resume"}:
            intent = "resume"

        now = _utc_now()
        name_norm = _normalize_account_name(name)
        with _account_connect(app.config["LEADERBOARD_DB_PATH"]) as conn:
            conn.execute("BEGIN IMMEDIATE")
            user_row = conn.execute(
                "SELECT * FROM users WHERE name_norm = ?",
                (name_norm,),
            ).fetchone()
            created = False

            if user_row is None:
                if intent == "resume":
                    conn.rollback()
                    return jsonify({"ok": False, "error": "No save found for that name yet."}), 404
                salt_hex, hash_hex = _hash_password(password)
                cur = conn.execute(
                    """
                    INSERT INTO users (name, name_norm, password_salt, password_hash, session_token, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    (name, name_norm, salt_hex, hash_hex, None, now, now),
                )
                user_row = conn.execute(
                    "SELECT * FROM users WHERE id = ?",
                    (int(cur.lastrowid),),
                ).fetchone()
                created = True
            else:
                stored_salt = str(user_row["password_salt"])
                stored_hash = str(user_row["password_hash"])
                default_salt, default_hash = _hash_password("0000", stored_salt)
                accepts_default_pin = hmac.compare_digest(default_hash, stored_hash)
                if not _verify_password(password, stored_salt, stored_hash):
                    conn.rollback()
                    return jsonify({"ok": False, "error": "Wrong PIN for that save."}), 403
                if accepts_default_pin and password == "0000":
                    conn.execute(
                        "UPDATE users SET password_salt = ?, password_hash = ?, updated_at = ? WHERE id = ?",
                        (stored_salt, stored_hash, now, int(user_row["id"])),
                    )
                conn.execute(
                    "UPDATE users SET name = ?, updated_at = ? WHERE id = ?",
                    (name, now, int(user_row["id"])),
                )
                user_row = conn.execute(
                    "SELECT * FROM users WHERE id = ?",
                    (int(user_row["id"]),),
                ).fetchone()

            token = secrets.token_urlsafe(24)
            conn.execute(
                "UPDATE users SET session_token = ?, updated_at = ? WHERE id = ?",
                (token, now, int(user_row["id"])),
            )
            user_row = conn.execute(
                "SELECT * FROM users WHERE id = ?",
                (int(user_row["id"]),),
            ).fetchone()
            bundle = _load_account_bundle(conn, user_row)
            conn.commit()

        return jsonify({"ok": True, "created": created, "token": token, **bundle})

    @app.get("/api/account/me")
    def account_me():
        conn, user_row, state = _require_user_by_session(app.config["LEADERBOARD_DB_PATH"])
        ok, error = state
        if not ok or conn is None or user_row is None:
            return jsonify({"ok": False, "error": error}), 403
        with conn:
            bundle = _load_account_bundle(conn, user_row)
        conn.close()
        return jsonify({"ok": True, **bundle})

    @app.post("/api/account/save")
    def account_save():
        conn, user_row, state = _require_user_by_session(app.config["LEADERBOARD_DB_PATH"])
        ok, error = state
        if not ok or conn is None or user_row is None:
            return jsonify({"ok": False, "error": error}), 403

        try:
            payload = request.get_json(force=False, silent=False)
        except BadRequest:
            conn.close()
            return jsonify({"ok": False, "error": "Invalid JSON body."}), 400
        if payload is None:
            payload = {}

        try:
            snapshot = _sanitize_snapshot_payload(payload.get("snapshot", {}))
        except ValidationError as exc:
            conn.close()
            return jsonify({"ok": False, "error": str(exc)}), 400
        status_payload = _sanitize_status_payload(payload.get("status", {}))
        word_bank = _sanitize_word_bank(payload.get("word_bank", []))
        try:
            accent_theme = _sanitize_accent_theme(
                payload.get(
                    "accent_theme",
                    user_row["accent_theme"] if "accent_theme" in user_row.keys() else DEFAULT_ACCENT_THEME_ID,
                )
            )
        except ValidationError as exc:
            conn.close()
            return jsonify({"ok": False, "error": str(exc)}), 400
        now = _utc_now()

        with conn:
            conn.execute("BEGIN IMMEDIATE")
            conn.execute(
                """
                INSERT INTO user_saves (user_id, snapshot_json, status_json, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_id) DO UPDATE SET
                    snapshot_json = excluded.snapshot_json,
                    status_json = excluded.status_json,
                    updated_at = excluded.updated_at
                """,
                (int(user_row["id"]), json.dumps(snapshot), json.dumps(status_payload), now),
            )
            conn.execute("DELETE FROM user_word_bank WHERE user_id = ?", (int(user_row["id"]),))
            for item in word_bank:
                conn.execute(
                    """
                    INSERT INTO user_word_bank (user_id, word_key, text, gloss, source, added_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (
                        int(user_row["id"]),
                        item["key"],
                        item["text"],
                        item.get("gloss", ""),
                        item.get("source", ""),
                        now,
                    ),
                )
            conn.execute(
                "UPDATE users SET accent_theme = ?, updated_at = ? WHERE id = ?",
                (accent_theme, now, int(user_row["id"])),
            )
            user_row = conn.execute(
                "SELECT * FROM users WHERE id = ?",
                (int(user_row["id"]),),
            ).fetchone()
            bundle = _load_account_bundle(conn, user_row)
            conn.commit()

        conn.close()
        return jsonify({"ok": True, **bundle})

    @app.post("/api/account/set-pin")
    def account_set_pin():
        conn, user_row, state = _require_user_by_session(app.config["LEADERBOARD_DB_PATH"])
        ok, error = state
        if not ok or conn is None or user_row is None:
            return jsonify({"ok": False, "error": error}), 403

        try:
            payload = request.get_json(force=False, silent=False)
        except BadRequest:
            return jsonify({"ok": False, "error": "Invalid JSON body."}), 400
        if payload is None:
            payload = {}

        try:
            new_password = _sanitize_password(payload.get("newPassword", None))
        except ValidationError as exc:
            return jsonify({"ok": False, "error": str(exc)}), 400

        salt_hex, hash_hex = _hash_password(new_password)
        now = _utc_now()
        with conn:
            conn.execute(
                "UPDATE users SET password_salt = ?, password_hash = ?, updated_at = ? WHERE id = ?",
                (salt_hex, hash_hex, now, int(user_row["id"])),
            )
            user_row = conn.execute(
                "SELECT * FROM users WHERE id = ?",
                (int(user_row["id"]),),
            ).fetchone()
            bundle = _load_account_bundle(conn, user_row)
            conn.commit()
        conn.close()
        return jsonify({"ok": True, **bundle})

    @app.post("/api/account/logout")
    def account_logout():
        conn, user_row, state = _require_user_by_session(app.config["LEADERBOARD_DB_PATH"])
        ok, error = state
        if not ok or conn is None or user_row is None:
            return jsonify({"ok": False, "error": error}), 403
        with conn:
            conn.execute(
                "UPDATE users SET session_token = NULL, updated_at = ? WHERE id = ?",
                (_utc_now(), int(user_row["id"])),
            )
        conn.close()
        return jsonify({"ok": True})

    return app


if __name__ == "__main__":
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host=host, port=port, debug=debug)
