import os
import secrets
import subprocess
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory, g

import json

from .db import (
    init_db,
    get_connection,
    upsert_user,
    set_session_token,
    get_user_by_token,
    get_user_word_bank,
    add_words,
    submit_score,
    get_leaderboard,
    save_game,
    load_save,
    mark_level_complete,
)

DEFAULT_DB = str(Path(__file__).parent / "lingo.db")
FRONTEND_DIST = str(Path(__file__).parent.parent / "frontend" / "dist")


def create_app():
    app = Flask(__name__, static_folder=None)
    db_path = os.getenv("LINGO_DB_PATH", DEFAULT_DB)

    with app.app_context():
        init_db(db_path)

    def get_db():
        if "db" not in g:
            g.db = get_connection(db_path)
        return g.db

    @app.teardown_appcontext
    def close_db(e=None):
        db = g.pop("db", None)
        if db:
            db.close()

    def require_auth():
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth[7:]
        return get_user_by_token(get_db(), token)

    def parse_json_field(raw, fallback):
        if raw is None:
            return fallback
        try:
            parsed = json.loads(raw)
        except Exception:
            return fallback
        return fallback if parsed is None else parsed

    def build_user_payload(user, word_bank, levels_completed):
        return {
            "id": user["id"],
            "username": user["username"],
            "accent_theme": user["accent_theme"],
            "ui_settings": parse_json_field(user["ui_settings_json"], {}),
            "custom_colors": parse_json_field(user["custom_colors_json"], []),
            "active_theme": parse_json_field(user["active_theme_json"], None),
            "light_mode": bool(user["light_mode"]),
            "word_bank": word_bank,
            "levels_completed": levels_completed,
        }

    @app.post("/api/login")
    def login():
        data = request.get_json(silent=True) or {}
        username = str(data.get("username", "")).strip()
        if not username or len(username) > 24:
            return jsonify({"error": "Username must be 1-24 characters"}), 400
        conn = get_db()
        user = upsert_user(conn, username)
        token = secrets.token_urlsafe(24)
        set_session_token(conn, user["id"], token)
        conn.commit()
        word_bank = get_user_word_bank(conn, user["id"])
        save = load_save(conn, user["id"])
        levels_completed = json.loads(user["levels_completed"] or "[]")
        return jsonify(
            {
                "token": token,
                "user": build_user_payload(user, word_bank, levels_completed),
                "save": {
                    "snapshot": json.loads(save["snapshot_json"]) if save and save["snapshot_json"] else None,
                    "status": json.loads(save["status_json"]) if save and save["status_json"] else {},
                },
            }
        )

    @app.post("/api/logout")
    def logout():
        user = require_auth()
        if user:
            set_session_token(get_db(), user["id"], None)
            get_db().commit()
        return jsonify({"ok": True})

    @app.get("/api/me")
    def me():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        conn = get_db()
        word_bank = get_user_word_bank(conn, user["id"])
        save = load_save(conn, user["id"])
        levels_completed = json.loads(user["levels_completed"] or "[]")
        return jsonify(
            {
                "user": build_user_payload(user, word_bank, levels_completed),
                "word_bank": word_bank,
                "save": {
                    "snapshot": json.loads(save["snapshot_json"]) if save and save["snapshot_json"] else None,
                    "status": json.loads(save["status_json"]) if save and save["status_json"] else {},
                },
            }
        )

    @app.post("/api/save")
    def save():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True) or {}
        snapshot = data.get("snapshot")
        status = data.get("status", {})
        conn = get_db()
        save_game(conn, user["id"],
                  json.dumps(snapshot) if snapshot is not None else None,
                  json.dumps(status))
        conn.commit()
        return jsonify({"ok": True})

    @app.get("/api/leaderboard")
    def leaderboard():
        rows = get_leaderboard(get_db())
        return jsonify({"scores": [dict(r) for r in rows]})

    @app.post("/api/scores")
    def post_score():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True) or {}
        level = int(data.get("level", 1))
        score = int(data.get("score", 0))
        time_ms = int(data.get("time_ms", 0))
        conn = get_db()
        submit_score(conn, user["id"], user["username"], level, score, time_ms)
        conn.commit()
        return jsonify({"ok": True})

    @app.post("/api/level-complete")
    def level_complete():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True) or {}
        level_n = int(data.get("level", 1))
        conn = get_db()
        mark_level_complete(conn, user["id"], level_n)
        conn.commit()
        return jsonify({"ok": True})

    @app.post("/api/word-bank")
    def post_words():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True) or {}
        words = data.get("words", [])
        source = str(data.get("source", ""))[:48]
        conn = get_db()
        add_words(conn, user["id"], words, source)
        conn.commit()
        return jsonify({"ok": True})

    @app.post("/api/theme")
    def set_theme():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        data = request.get_json(silent=True) or {}
        theme = str(data.get("theme", "sky"))
        valid = {"crimson", "violet", "teal", "amber", "mint", "sky"}
        if theme not in valid:
            return jsonify({"error": "Invalid theme"}), 400
        conn = get_db()
        conn.execute(
            "UPDATE users SET accent_theme=? WHERE id=?", (theme, user["id"])
        )
        conn.commit()
        return jsonify({"ok": True})

    @app.post("/api/preferences")
    def set_preferences():
        user = require_auth()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.get_json(silent=True) or {}
        updates = []
        params = []

        if "ui_settings" in data:
            ui_settings = data.get("ui_settings")
            if not isinstance(ui_settings, dict):
                return jsonify({"error": "ui_settings must be an object"}), 400
            ui_json = json.dumps(ui_settings, separators=(",", ":"))
            if len(ui_json) > 4096:
                return jsonify({"error": "ui_settings too large"}), 400
            updates.append("ui_settings_json=?")
            params.append(ui_json)

        if "custom_colors" in data:
            custom_colors = data.get("custom_colors")
            if not isinstance(custom_colors, list):
                return jsonify({"error": "custom_colors must be an array"}), 400
            if len(custom_colors) > 64:
                return jsonify({"error": "too many custom colors"}), 400
            colors_json = json.dumps(custom_colors, separators=(",", ":"))
            if len(colors_json) > 16384:
                return jsonify({"error": "custom_colors too large"}), 400
            updates.append("custom_colors_json=?")
            params.append(colors_json)

        if "active_theme" in data:
            active_theme = data.get("active_theme")
            if active_theme is not None and not isinstance(active_theme, dict):
                return jsonify({"error": "active_theme must be an object or null"}), 400
            active_json = (
                json.dumps(active_theme, separators=(",", ":"))
                if active_theme is not None
                else None
            )
            if active_json is not None and len(active_json) > 4096:
                return jsonify({"error": "active_theme too large"}), 400
            updates.append("active_theme_json=?")
            params.append(active_json)

        if "light_mode" in data:
            light_mode = data.get("light_mode")
            if not isinstance(light_mode, bool):
                return jsonify({"error": "light_mode must be boolean"}), 400
            updates.append("light_mode=?")
            params.append(1 if light_mode else 0)

        if not updates:
            return jsonify({"ok": True})

        conn = get_db()
        params.append(user["id"])
        conn.execute(f"UPDATE users SET {', '.join(updates)} WHERE id=?", params)
        conn.commit()
        return jsonify({"ok": True})

    @app.post("/api/debug/wipe-scores")
    def debug_wipe_scores():
        data = request.get_json(silent=True) or {}
        if data.get("confirm") != "WIPE":
            return jsonify({"error": "Pass confirm: WIPE"}), 400
        conn = get_db()
        conn.execute("DELETE FROM scores")
        conn.execute("DELETE FROM saves")
        conn.execute("UPDATE users SET levels_completed='[]'")
        conn.commit()
        return jsonify({"ok": True, "message": "Scores, saves, and level progress wiped."})

    @app.post("/api/admin/save-level")
    def save_level():
        data = request.get_json(silent=True)
        if not data or data.get("id") is None:
            return jsonify({"error": "missing level id"}), 400

        level_id   = data["id"]
        language   = data.get("language", "es")
        engine_dir = Path(__file__).parent.parent / "frontend" / "src" / "engine"
        frontend_dir = Path(__file__).parent.parent / "frontend"

        if language == "ja":
            levels_file = engine_dir / "levels_ja.js"
            array_var   = "LEVELS_JA"
            header      = "// Japanese levels — TILE: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7\n"
            var_decl    = "const LEVELS_JA"
            get_fn      = "\nexport function getLevel(n) {\n  return LEVELS_JA[Math.min(Math.max(n - 1, 0), LEVELS_JA.length - 1)];\n}\n"
        else:
            levels_file = engine_dir / "levels.js"
            array_var   = "LEVELS"
            header      = "// LingoDungeon — Level data ported from lingo_pkmn\n// TILE constants: FLOOR=0, WALL=1, DOOR_C=2, DOOR_O=3, CHEST_C=4, CHEST_O=5, STAIRS=6, RUG=7\n"
            var_decl    = "export const LEVELS"
            get_fn      = "\nexport function getLevel(n) {\n  return LEVELS[Math.min(Math.max(n - 1, 0), LEVELS.length - 1)];\n}\n"

        # Use Node to safely eval the existing JS array (handles both JSON and JS-object syntax)
        node_extract = (
            "const fs=require('fs');"
            f"const c=fs.readFileSync({json.dumps(str(levels_file))},'utf-8');"
            f"const m=c.match(/(?:const {array_var}|export const {array_var})\\s*=\\s*([\\s\\S]*?);\\s*\\nexport/);"
            "if(!m){console.log('[]');process.exit(0);}"
            "try{console.log(JSON.stringify((new Function('return '+m[1])).call(null)));}catch(e){console.log('[]');}"
        )
        node_result = subprocess.run(
            ["node", "-e", node_extract],
            capture_output=True, text=True, timeout=10
        )
        try:
            levels = json.loads(node_result.stdout.strip() or "[]")
        except Exception:
            levels = []

        # Replace existing level or append
        idx = next((i for i, lv in enumerate(levels) if lv.get("id") == level_id), None)
        if idx is not None:
            levels[idx] = data
        else:
            levels.append(data)

        # Write back as clean JSON-in-JS
        levels_json = json.dumps(levels, indent=2, ensure_ascii=False)
        new_content = f"{header}\n{var_decl} = {levels_json};\n{get_fn}"
        levels_file.write_text(new_content, encoding="utf-8")

        # Rebuild frontend (blocking ~5s)
        build = subprocess.run(
            ["npm", "run", "build"],
            cwd=str(frontend_dir),
            capture_output=True, text=True, timeout=120
        )
        if build.returncode != 0:
            return jsonify({"error": "build failed", "details": build.stderr[-1500:]}), 500

        return jsonify({"ok": True, "id": level_id, "language": language,
                        "total": len(levels)})

    # Serve React SPA for all non-API routes
    @app.get("/")
    @app.get("/<path:path>")
    def spa(path=""):
        dist = Path(FRONTEND_DIST)
        if path and (dist / path).exists():
            return send_from_directory(FRONTEND_DIST, path)
        if (dist / "index.html").exists():
            return send_from_directory(FRONTEND_DIST, "index.html")
        return "Frontend not built. Run: cd frontend && npm run build", 503

    return app


app = create_app()
