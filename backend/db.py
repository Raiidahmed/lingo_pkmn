import sqlite3
from datetime import datetime, timezone


def init_db(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            username     TEXT NOT NULL,
            username_norm TEXT UNIQUE NOT NULL,
            accent_theme TEXT NOT NULL DEFAULT 'crimson',
            session_token TEXT UNIQUE,
            levels_completed TEXT NOT NULL DEFAULT '[]',
            created_at   TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS scores (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id    INTEGER NOT NULL REFERENCES users(id),
            username   TEXT NOT NULL,
            level      INTEGER NOT NULL,
            score      INTEGER NOT NULL,
            time_ms    INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS word_bank (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id  INTEGER NOT NULL REFERENCES users(id),
            word_es  TEXT NOT NULL,
            word_en  TEXT NOT NULL,
            source   TEXT NOT NULL DEFAULT '',
            added_at TEXT NOT NULL,
            UNIQUE(user_id, word_es)
        );

        CREATE TABLE IF NOT EXISTS saves (
            user_id       INTEGER PRIMARY KEY,
            snapshot_json TEXT,
            status_json   TEXT,
            updated_at    TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)
    conn.commit()
    conn.close()


def get_connection(db_path):
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def upsert_user(conn, username):
    canonical = username.strip().upper()
    norm = canonical.casefold()
    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        """
        INSERT INTO users (username, username_norm, created_at)
        VALUES (?, ?, ?)
        ON CONFLICT(username_norm) DO NOTHING
        """,
        (canonical, norm, now),
    )
    return conn.execute(
        "SELECT * FROM users WHERE username_norm=?", (norm,)
    ).fetchone()


def set_session_token(conn, user_id, token):
    conn.execute(
        "UPDATE users SET session_token=? WHERE id=?", (token, user_id)
    )


def get_user_by_token(conn, token):
    if not token:
        return None
    return conn.execute(
        "SELECT * FROM users WHERE session_token=?", (token,)
    ).fetchone()


def get_user_word_bank(conn, user_id):
    rows = conn.execute(
        "SELECT word_es, word_en, source, added_at FROM word_bank WHERE user_id=? ORDER BY added_at DESC",
        (user_id,),
    ).fetchall()
    return [dict(r) for r in rows]


def add_words(conn, user_id, words, source):
    now = datetime.now(timezone.utc).isoformat()
    for w in words:
        es = str(w.get("es", "")).strip()
        en = str(w.get("en", "")).strip()
        if not es or not en:
            continue
        conn.execute(
            """
            INSERT INTO word_bank (user_id, word_es, word_en, source, added_at)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, word_es) DO UPDATE SET word_en=excluded.word_en, source=excluded.source, added_at=excluded.added_at
            """,
            (user_id, es, en, source, now),
        )


def submit_score(conn, user_id, username, level, score, time_ms):
    now = datetime.now(timezone.utc).isoformat()
    existing = conn.execute(
        "SELECT id, score FROM scores WHERE user_id=?", (user_id,)
    ).fetchone()
    if existing is None:
        conn.execute(
            "INSERT INTO scores (user_id, username, level, score, time_ms, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, username, level, score, time_ms, now),
        )
    elif score > existing["score"]:
        conn.execute(
            "UPDATE scores SET username=?, level=?, score=?, time_ms=?, created_at=? WHERE user_id=?",
            (username, level, score, time_ms, now, user_id),
        )


def save_game(conn, user_id, snapshot, status):
    now = datetime.now(timezone.utc).isoformat()
    conn.execute(
        """
        INSERT INTO saves (user_id, snapshot_json, status_json, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            snapshot_json=excluded.snapshot_json,
            status_json=excluded.status_json,
            updated_at=excluded.updated_at
        """,
        (user_id, snapshot, status, now),
    )


def load_save(conn, user_id):
    row = conn.execute(
        "SELECT snapshot_json, status_json FROM saves WHERE user_id=?", (user_id,)
    ).fetchone()
    if row is None:
        return None
    return dict(row)


def mark_level_complete(conn, user_id, level_n):
    import json
    row = conn.execute("SELECT levels_completed FROM users WHERE id=?", (user_id,)).fetchone()
    completed = json.loads(row["levels_completed"] or "[]") if row else []
    if level_n not in completed:
        completed.append(level_n)
        completed.sort()
        conn.execute("UPDATE users SET levels_completed=? WHERE id=?", (json.dumps(completed), user_id))


def get_leaderboard(conn, limit=20):
    rows = conn.execute(
        """
        SELECT id, username, level, score, time_ms, created_at
        FROM scores
        ORDER BY score DESC, created_at ASC
        LIMIT ?
        """,
        (limit,),
    ).fetchall()
    return rows
