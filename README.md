# Lingo Dungeon (`lingo_pkmn`)

Lingo Dungeon is a browser dungeon-crawler language game. You move through tile-based levels, talk to NPCs, and unlock doors/chests by answering Spanish challenges.

## Local Development (Flask + SQLite)

Use the existing virtualenv from repo root:

```bash
source .venv/bin/activate
pip install -r requirements.txt
flask --app app:create_app run --debug
```

Then open:

- Game: `http://127.0.0.1:5000/`
- Level editor: `http://127.0.0.1:5000/editor`

## Current Stack
- Frontend: plain HTML, CSS, and vanilla JavaScript (single-page files, no build step)
- Rendering/UI: Canvas + DOM overlays
- Data authoring: in-browser level editor (`localStorage` + JSON export)
- Backend: Flask app (`app.py`) serving frontend + same-origin leaderboard API
- Leaderboard storage: SQLite via reused logic in `backend/leaderboard_api/db.py`

## Repo Structure
```text
lingo_pkmn/
├── app.py              # Flask app entrypoint (pages + API)
├── backend/
│   └── leaderboard_api/ # Stdlib Python + SQLite leaderboard API
├── requirements.txt    # Python deps for local Flask run
├── src/
│   ├── index.html      # Playable game
│   └── editor.html     # Level/data editor
├── docs/               # Project docs
├── .agent/             # Agent notes/logs
├── BOOT.md             # Internal project context
├── CLAUDE.md           # Agent guidance
└── README.md
```

## API Endpoints (Same Origin)
- `GET /health`
- `GET /scores`
- `POST /scores`
- `POST /admin/dedupe` (requires `LEADERBOARD_ADMIN_TOKEN`)

Default SQLite path is `backend/leaderboard_api/leaderboard.db`.
Override with `LEADERBOARD_DB_PATH=/path/to/leaderboard.db`.

## Note On Planned Architecture
The larger React + backend architecture is still planned and documented, but not implemented in this repo yet. The current shipped project is the static HTML/CSS/JS game/editor above.
