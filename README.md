# Lingo Dungeon (`lingo_pkmn`)

Lingo Dungeon is a browser dungeon-crawler language game. You move through tile-based levels, talk to NPCs, and unlock doors/chests by answering Spanish challenges.

## Play
- Game: https://raiidahmed.github.io/lingo_pkmn/src/
- Level editor: https://raiidahmed.github.io/lingo_pkmn/src/editor.html

## Current Stack
- Frontend: plain HTML, CSS, and vanilla JavaScript (single-page files, no build step)
- Rendering/UI: Canvas + DOM overlays
- Data authoring: in-browser level editor (`localStorage` + JSON export)
- Leaderboard API: external Cloudflare Worker endpoint used by the game client

## Repo Structure
```text
lingo_pkmn/
├── src/
│   ├── index.html      # Playable game
│   └── editor.html     # Level/data editor
├── docs/               # Project docs
├── .agent/             # Agent notes/logs
├── BOOT.md             # Internal project context
├── CLAUDE.md           # Agent guidance
└── README.md
```

## Note On Planned Architecture
The larger React + backend architecture is still planned and documented, but not implemented in this repo yet. The current shipped project is the static HTML/CSS/JS game/editor above.
