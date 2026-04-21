import argparse
import hmac
import json
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Tuple
from urllib.parse import parse_qs, urlparse

try:
    from .db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError
except ImportError:  # Allow direct script execution.
    from db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError


def _parse_limit(query_string: str, default: int = 50) -> int:
    try:
        parsed = parse_qs(query_string)
        if "limit" not in parsed:
            return default
        return int(parsed["limit"][0])
    except (ValueError, TypeError, IndexError):
        return default


class LeaderboardHandler(BaseHTTPRequestHandler):
    db: LeaderboardDB = None  # type: ignore[assignment]
    admin_token: str = ""

    def do_OPTIONS(self) -> None:
        self._write_json(HTTPStatus.NO_CONTENT, None)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self._write_json(
                HTTPStatus.OK,
                {"ok": True, "service": "leaderboard_api"},
            )
            return

        if parsed.path == "/scores":
            limit = _parse_limit(parsed.query, default=50)
            scores = self.db.get_top_scores(limit=limit)
            self._write_json(HTTPStatus.OK, scores)
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/scores":
            try:
                payload = self._read_json_body()
                result = self.db.upsert_score(payload, source="api")
                self._write_json(HTTPStatus.OK, {"ok": True, "stored": result})
            except ValidationError as exc:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": str(exc)})
            except json.JSONDecodeError:
                self._write_json(HTTPStatus.BAD_REQUEST, {"ok": False, "error": "Invalid JSON body."})
            return

        if parsed.path == "/admin/dedupe":
            authorized, error = self._require_admin()
            if not authorized:
                self._write_json(HTTPStatus.FORBIDDEN, {"ok": False, "error": error})
                return
            result = self.db.dedupe_all()
            self._write_json(HTTPStatus.OK, {"ok": True, **result})
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})

    def _read_json_body(self):
        raw_length = self.headers.get("Content-Length", "0")
        try:
            length = int(raw_length)
        except ValueError as exc:
            raise ValidationError("Invalid Content-Length header.") from exc
        if length < 0 or length > 16_384:
            raise ValidationError("Request body too large.")
        raw = self.rfile.read(length) if length else b"{}"
        return json.loads(raw.decode("utf-8"))

    def _require_admin(self) -> Tuple[bool, str]:
        if not self.admin_token:
            return False, "Admin token is not configured on the server."
        provided = self.headers.get("X-Admin-Token", "")
        auth = self.headers.get("Authorization", "")
        if not provided and auth.lower().startswith("bearer "):
            provided = auth[7:].strip()
        if not provided:
            return False, "Missing admin token."
        if not hmac.compare_digest(provided, self.admin_token):
            return False, "Invalid admin token."
        return True, ""

    def _write_json(self, status: HTTPStatus, payload: Any) -> None:
        body = b"" if payload is None else json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(int(status))
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type,X-Admin-Token,Authorization")
        if body:
            self.send_header("Content-Length", str(len(body)))
        else:
            self.send_header("Content-Length", "0")
        self.end_headers()
        if body:
            self.wfile.write(body)

    def log_message(self, fmt: str, *args) -> None:
        # Keep default access logging but format consistently.
        super().log_message(fmt, *args)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the Lingo Dungeon SQLite leaderboard API.")
    parser.add_argument("--host", default=os.getenv("LEADERBOARD_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.getenv("LEADERBOARD_PORT", "8080")))
    parser.add_argument("--db-path", default=os.getenv("LEADERBOARD_DB_PATH", DEFAULT_DB_PATH))
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    db = LeaderboardDB(args.db_path)
    db.init_db()

    LeaderboardHandler.db = db
    LeaderboardHandler.admin_token = os.getenv("LEADERBOARD_ADMIN_TOKEN", "")

    server = ThreadingHTTPServer((args.host, args.port), LeaderboardHandler)
    print(
        f"Leaderboard API listening on http://{args.host}:{args.port} using SQLite at {args.db_path}",
        flush=True,
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
