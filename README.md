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

## Public URL

**https://lingo-dungeon.com** — served via nginx on a DigitalOcean droplet (DNS not yet live; HTTPS + Gunicorn before public launch). See `deploy/DEPLOY_HTTP.md` for the current deployment runbook.

## Note On Planned Architecture
The larger React + backend architecture is still planned and documented, but not implemented in this repo yet. The current shipped project is the static HTML/CSS/JS game/editor above.

## Frontend Shell (Phase 0-1)
A Vite + React + Zustand shell lives in `src-shell/`. It wraps the legacy
single-file game (unchanged) and exposes an explicit app state machine
for title/auth/status/settings/game-over.

Build + enable it:

```bash
npm --prefix src-shell install
npm --prefix src-shell run build
SHELL_ENABLED=1 flask --app app:create_app run --debug
```

Runtime behavior:
- `/` serves the shell only when `SHELL_ENABLED=1` and `src-shell/dist/index.html` exists.
- `/` falls back to legacy automatically when disabled or not built.
- `/legacy` always serves the untouched legacy game.
- `/?legacy=1` forces legacy even when the shell is enabled.

See [`docs/frontend-shell-phase0.md`](docs/frontend-shell-phase0.md) for
Phase 0 scope/routing, [`docs/frontend-shell-phase1.md`](docs/frontend-shell-phase1.md)
for the Phase 1 iframe bridge (game-over + settings sync), and
[`docs/frontend-shell-phase2.md`](docs/frontend-shell-phase2.md) for shell-owned
start/resume launch control into the embedded legacy runtime.
