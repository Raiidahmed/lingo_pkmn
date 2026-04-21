import datetime as _dt
import sqlite3
import re
from typing import Any, Dict, Iterable, List


DEFAULT_DB_PATH = "backend/leaderboard_api/leaderboard.db"
MAX_NAME_LEN = 16
MAX_SCORE = 2_147_483_647
MAX_LEVEL = 9_999
MAX_TIME_MS = 31_536_000_000  # 1 year


class ValidationError(ValueError):
    pass


def utc_now_iso() -> str:
    return _dt.datetime.now(_dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _coerce_int(value: Any, field_name: str, default: int, min_value: int, max_value: int) -> int:
    if value is None:
        return default
    try:
        num = int(value)
    except (TypeError, ValueError) as exc:
        raise ValidationError(f"Invalid {field_name}: must be an integer.") from exc
    if num < min_value:
        return min_value
    if num > max_value:
        return max_value
    return num


def sanitize_name(value: Any) -> str:
    if not isinstance(value, str):
        raise ValidationError("Invalid name: must be a string.")

    # Remove tags/control characters, normalize spacing, and keep safe visible chars.
    no_tags = re.sub(r"<[^>]*>", "", value)
    printable = "".join(ch for ch in no_tags if ch.isprintable())
    collapsed = " ".join(printable.split()).strip()
    safe = "".join(ch for ch in collapsed if ch.isalnum() or ch in " _-.")
    safe = safe.strip()
    if not safe:
        raise ValidationError("Invalid name: must contain at least one visible character.")
    return safe[:MAX_NAME_LEN]


def normalize_name(name: str) -> str:
    return name.casefold()


def validate_score_payload(payload: Any) -> Dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("Invalid payload: expected a JSON object.")
    if "score" not in payload:
        raise ValidationError("Invalid score: this field is required.")

    name = sanitize_name(payload.get("name", ""))
    score = _coerce_int(payload.get("score"), "score", default=0, min_value=0, max_value=MAX_SCORE)
    level = _coerce_int(payload.get("level", 1), "level", default=1, min_value=1, max_value=MAX_LEVEL)
    time_ms = _coerce_int(
        payload.get("time_ms", payload.get("time", 0)),
        "time",
        default=0,
        min_value=0,
        max_value=MAX_TIME_MS,
    )
    return {
        "name": name,
        "name_norm": normalize_name(name),
        "score": score,
        "level": level,
        "time_ms": time_ms,
    }


class LeaderboardDB:
    def __init__(self, db_path: str = DEFAULT_DB_PATH):
        self.db_path = db_path

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=30.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        conn.execute("PRAGMA synchronous=NORMAL")
        return conn

    def init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    name_norm TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    level INTEGER NOT NULL DEFAULT 1,
                    time_ms INTEGER NOT NULL DEFAULT 0,
                    source TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_scores_name_norm ON scores(name_norm)"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_scores_score_updated ON scores(score DESC, updated_at ASC, id ASC)"
            )

    def get_top_scores(self, limit: int = 50) -> List[Dict[str, Any]]:
        if limit < 1:
            limit = 1
        if limit > 200:
            limit = 200

        query = """
            SELECT s.name, s.score, s.level, s.time_ms
            FROM scores AS s
            WHERE s.id = (
                SELECT s2.id
                FROM scores AS s2
                WHERE s2.name_norm = s.name_norm
                ORDER BY s2.score DESC, s2.updated_at ASC, s2.id ASC
                LIMIT 1
            )
            ORDER BY s.score DESC, s.updated_at ASC, s.id ASC
            LIMIT ?
        """
        with self._connect() as conn:
            rows = conn.execute(query, (limit,)).fetchall()
        return [
            {
                "name": row["name"],
                "score": int(row["score"]),
                "level": int(row["level"]),
                "time": int(row["time_ms"]),
            }
            for row in rows
        ]

    def upsert_score(self, payload: Any, source: str = "api") -> Dict[str, Any]:
        data = validate_score_payload(payload)
        now = utc_now_iso()

        with self._connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            existing = conn.execute(
                """
                SELECT id, name, score, level, time_ms, updated_at
                FROM scores
                WHERE name_norm = ?
                ORDER BY score DESC, updated_at ASC, id ASC
                """,
                (data["name_norm"],),
            ).fetchall()

            deduped = 0
            action = "kept"
            stored_name = data["name"]
            stored_score = data["score"]
            stored_level = data["level"]
            stored_time_ms = data["time_ms"]
            if not existing:
                cur = conn.execute(
                    """
                    INSERT INTO scores (name, name_norm, score, level, time_ms, source, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        data["name"],
                        data["name_norm"],
                        data["score"],
                        data["level"],
                        data["time_ms"],
                        source,
                        now,
                        now,
                    ),
                )
                kept_id = int(cur.lastrowid)
                action = "inserted"
            else:
                best = existing[0]
                kept_id = int(best["id"])
                stored_name = str(best["name"])
                stored_score = int(best["score"])
                stored_level = int(best["level"])
                stored_time_ms = int(best["time_ms"])
                if data["score"] > int(best["score"]):
                    conn.execute(
                        """
                        UPDATE scores
                        SET name = ?, score = ?, level = ?, time_ms = ?, source = ?, updated_at = ?
                        WHERE id = ?
                        """,
                        (
                            data["name"],
                            data["score"],
                            data["level"],
                            data["time_ms"],
                            source,
                            now,
                            kept_id,
                        ),
                    )
                    action = "updated"
                    stored_name = data["name"]
                    stored_score = data["score"]
                    stored_level = data["level"]
                    stored_time_ms = data["time_ms"]

                if len(existing) > 1:
                    stale_ids = [int(row["id"]) for row in existing[1:]]
                    deduped = self._delete_ids(conn, stale_ids)

            conn.commit()

        return {
            "id": kept_id,
            "name": stored_name,
            "score": stored_score,
            "level": stored_level,
            "time": stored_time_ms,
            "action": action,
            "deduped": deduped,
        }

    def dedupe_all(self) -> Dict[str, int]:
        with self._connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            rows = conn.execute(
                """
                SELECT id, name_norm
                FROM scores
                ORDER BY name_norm ASC, score DESC, updated_at ASC, id ASC
                """
            ).fetchall()

            keep_norms = set()
            stale_ids: List[int] = []
            for row in rows:
                name_norm = row["name_norm"]
                row_id = int(row["id"])
                if name_norm in keep_norms:
                    stale_ids.append(row_id)
                else:
                    keep_norms.add(name_norm)

            removed = self._delete_ids(conn, stale_ids)
            remaining = conn.execute("SELECT COUNT(*) FROM scores").fetchone()[0]
            conn.commit()

        return {"removed": removed, "remaining": int(remaining), "distinct_names": len(keep_norms)}

    @staticmethod
    def _delete_ids(conn: sqlite3.Connection, row_ids: Iterable[int]) -> int:
        ids = list(row_ids)
        if not ids:
            return 0
        removed = 0
        for i in range(0, len(ids), 500):
            batch = ids[i : i + 500]
            placeholders = ",".join("?" for _ in batch)
            cur = conn.execute(f"DELETE FROM scores WHERE id IN ({placeholders})", batch)
            removed += cur.rowcount
        return removed
