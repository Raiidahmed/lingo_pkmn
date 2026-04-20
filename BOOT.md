# BOOT.md - Project Context for Lingo 🐁

## What Is This?
`lingo_pkmn` is a web-based RPG for language learning — targeting absolute beginners in Spanish and French. Think dungeon crawler meets language tutor: players talk to NPCs, solve puzzles, and progress through a story — all in the target language.

## Stack
| Layer | Tech |
|---|---|
| Frontend | HTML + CSS + JS + React components |
| Backend | Python |
| Content DB | Elasticsearch (vocab, dialogue, challenges) |
| User DB | SQL (accounts, progress, game state) |
| Hosting | GitHub Pages (frontend) · Droplet `pkmn-lingoduel` (backend, TBD) |

## Repo Structure
```
lingo_pkmn/
├── src/           # Frontend source (HTML, CSS, JS)
├── docs/          # Documentation
├── .agent/        # Agent notes & decisions log
├── BOOT.md        # ← you are here (context for Lingo)
├── CLAUDE.md      # Context for coding agents
└── README.md      # Public-facing project README
```

## Live URLs
- **Frontend:** https://raiidahmed.github.io/lingo_pkmn/src/
- **Backend:** TBD

## Key Design Decisions
- Beginner-focused — assume zero prior knowledge of the target language
- Story/dialogue-driven — language learning happens through NPC interactions
- Dungeon crawler format — language challenges = puzzles/encounters
- Mobile-friendly — touch support required

## Current Status
- Repo created, GitHub Pages live
- `src/index.html` exists (currently Neon Copter — placeholder game)
- Stack chosen, architecture not yet built

## What's Next
- [ ] Design core game loop (first dungeon, first NPC dialogue)
- [ ] Build frontend scaffolding (React components, routing)
- [ ] Set up Python backend (API endpoints)
- [ ] Integrate Elasticsearch for vocab/content
- [ ] Integrate SQL DB for user progress

## Agent Notes
- Managed by Lingo 🐁 on droplet `pkmn-lingoduel`
- Decisions logged in `.agent/decisions.md`
- Raiid is direct — no fluff, ship things
