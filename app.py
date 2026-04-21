import hmac
import os
from pathlib import Path
from typing import Any, Tuple

from flask import Flask, jsonify, request, send_from_directory
from werkzeug.exceptions import BadRequest

from backend.leaderboard_api.db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError


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
        return jsonify({"ok": True, "stored": result})

    @app.post("/admin/dedupe")
    def admin_dedupe():
        authorized, error = _require_admin(app.config["LEADERBOARD_ADMIN_TOKEN"])
        if not authorized:
            return jsonify({"ok": False, "error": error}), 403
        result = app.config["LEADERBOARD_DB"].dedupe_all()
        return jsonify({"ok": True, **result})

    return app


if __name__ == "__main__":
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host=host, port=port, debug=debug)
