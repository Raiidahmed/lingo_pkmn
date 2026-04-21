# BOOT.md - Project Context for Lingo 🐁

## What Is This?
`lingo_pkmn` is a web-based RPG for language learning — targeting absolute beginners in Spanish and French. Think dungeon crawler meets language tutor: players talk to NPCs, solve puzzles, and progress through a story — all in the target language.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Plain HTML + CSS + Vanilla JS (no build step) |
| Rendering | Canvas + DOM overlays |
| Backend | Flask (`app.py`) — serves frontend + same-origin leaderboard API |
| Leaderboard DB | SQLite via `backend/leaderboard_api/db.py` |
| Reverse proxy | nginx on DigitalOcean droplet `pkmn-lingoduel` |
| Hosting | Droplet `pkmn-lingoduel` (HTTP for now; HTTPS + Gunicorn before public launch) |

Note: Elasticsearch and React are planned for a later phase; not yet implemented.

## Repo Structure
```
lingo_pkmn/
├── app.py                    # Flask entry point (pages + API)
├── src/
│   ├── index.html            # Playable dungeon game
│   ├── editor.html           # Level/data editor
│   └── favicon.svg           # Browser icon
├── backend/
│   └── leaderboard_api/      # SQLite leaderboard (db.py, standalone app.py)
├── deploy/
│   ├── DEPLOY_HTTP.md        # Deployment runbook (current setup)
│   ├── lingo-dungeon.service # systemd unit
│   ├── nginx-lingo-dungeon.conf  # nginx reverse proxy
│   └── run-flask.sh          # Flask startup script
├── requirements.txt          # Flask only
├── .agent/                   # Agent notes & decisions log
├── BOOT.md                   # ← you are here
├── CLAUDE.md                 # Context for coding agents
└── README.md                 # Public-facing project README
```

## Live URLs (target)
- **Public:** https://lingo-dungeon.com  *(DNS + Certbot not yet active)*
- **Local dev:** http://127.0.0.1:5000/

## Key Design Decisions
- Beginner-focused — assume zero prior knowledge of the target language
- Story/dialogue-driven — language learning happens through NPC interactions
- Dungeon crawler format — language challenges = puzzles/encounters
- Mobile-friendly — touch support required
- Same-origin API — frontend calls `/scores` on the same Flask host; no CORS needed

## Current Status (2026-04-21)
- Shipped: 3-level Spanish dungeon game with leaderboard, sound effects, mobile controls
- Backend: Flask + SQLite running on droplet behind nginx, plain HTTP
- GitHub Pages: retired (was an earlier static-hosting approach, no longer used)
- Cloudflare Worker leaderboard: retired (migration to SQLite complete)
- Domain: lingo-dungeon.com — nginx is configured, DNS not yet pointed

## What's Next
- [ ] Point lingo-dungeon.com DNS → droplet IP
- [ ] Run Certbot for HTTPS on lingo-dungeon.com
- [ ] Swap Flask dev server for Gunicorn in systemd service
- [ ] Expand language content (French challenges, more levels)
- [ ] React component layer (planned, not started)

## Agent Notes
- Managed by Lingo 🐁 on droplet `pkmn-lingoduel`
- Decisions logged in `.agent/decisions.md`
- Raiid is direct — no fluff, ship things
