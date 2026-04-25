import os
import secrets
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
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "accent_theme": user["accent_theme"],
                    "word_bank": word_bank,
                    "levels_completed": levels_completed,
                },
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
                "user": {
                    "id": user["id"],
                    "username": user["username"],
                    "accent_theme": user["accent_theme"],
                    "word_bank": word_bank,
                    "levels_completed": levels_completed,
                },
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
        theme = str(data.get("theme", "crimson"))
        valid = {"crimson", "violet", "teal", "amber", "mint"}
        if theme not in valid:
            return jsonify({"error": "Invalid theme"}), 400
        conn = get_db()
        conn.execute(
            "UPDATE users SET accent_theme=? WHERE id=?", (theme, user["id"])
        )
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
