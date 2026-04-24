# Frontend Shell Phase 4 (`src-shell/` native canvas)

Phase 4 removes the iframe boundary. The game engine runs directly in the
React shell's DOM — no iframe, no postMessage bridge.

## What Changed

- `src-shell/src/engine/game-engine.js` — new ES module that contains the
  entire game runtime (tile rendering, movement, dialogue, challenges, level
  loading, sound, particles). It accepts a container element and config object
  and returns a controller.
- `src-shell/src/engine/game-engine.css` — game-specific styles scoped to
  `.ld-game-host`. The shell's `--accent` / `--accent-dark` CSS vars are
  inherited automatically.
- `src-shell/src/engine/levels.js` — level data extracted from `src/index.html`
  as an ES module (`export const LEVELS = [...]`).
- `src-shell/src/components/GameCanvas.jsx` — rewritten. Replaced `<iframe>`
  with a `<div ref={containerRef}>` into which the engine mounts itself.
  postMessage listeners and retry loops are gone.

## Engine API

```js
import { mountGameEngine } from './engine/game-engine.js';

const ctrl = mountGameEngine(containerEl, {
  accent:       'crimson',         // accent theme id
  soundEnabled: true,              // initial sound state
  playerName:   'Hero',            // from shell session
  token:        'jwt...',          // from shell session (for /api/account/save)
  apiBase:      '',                // same-origin by default
  onReady:      (launchNonce) => {},
  onGameOver:   (stats, terminal) => {},
});

// Shell calls these:
ctrl.start({ mode, levelIndex, snapshot, launchNonce });
ctrl.quit();           // shell-initiated quit
ctrl.setAccent(id);    // theme changed in shell settings
ctrl.setSound(bool);   // sound toggled in shell settings
ctrl.setPlayerName(n); // session update
ctrl.setToken(tok);    // session token update
ctrl.destroy();        // cleanup (called by React on unmount)
```

## Bridge Removed

Phases 1–3 communicated via `postMessage`:

| Old (iframe)            | New (native)                     |
|-------------------------|----------------------------------|
| `lingo:config`          | `ctrl.setAccent()` / `setSound()`|
| `lingo:start`           | `ctrl.start()`                   |
| `lingo:quit`            | `ctrl.quit()`                    |
| `lingo:ready`           | `config.onReady` callback        |
| `lingo:startAck`        | removed (synchronous now)        |
| `lingo:gameOver`        | `config.onGameOver` callback     |

## What the Engine Owns (in-host DOM)

The engine injects and manages:

- HUD bar (title, XP counter, SFX toggle, Quit button)
- `<canvas>` element for tile + player + NPC rendering
- Toast notifications + particle system overlay
- Dialogue / challenge panel (in-canvas overlay div)
- Level-complete screen (rendered inside the host, not the full shell)
- Mobile d-pad + action button
- Audio gate modal (iOS sound unlock)
- Install helper modal (PWA)

## What the Shell Owns

All screens *outside* the game are React components unchanged from Phase 3:

- Title / auth screen (`TitleScreen.jsx` / `AuthPanel.jsx`)
- Status / launch screen (`StatusScreen.jsx`)
- Settings screen (`SettingsScreen.jsx`)
- Game-over / post-run screen (`GameOverScreen.jsx`)
- Leaderboard panel (`LeaderboardPanel.jsx`)
- HUD component (`Hud.jsx`)
- Post-run save refresh (`appStore.refreshSessionSave`)

## Files Touched in Phase 4

- `src-shell/src/engine/game-engine.js`   ← NEW
- `src-shell/src/engine/game-engine.css`  ← NEW
- `src-shell/src/engine/levels.js`        ← NEW
- `src-shell/src/components/GameCanvas.jsx`
- `src-shell/src/styles/shell.css`
- `docs/frontend-shell-phase4.md`
- `README.md`

## Cutline Preserved

- `src/index.html` (legacy game) is untouched and still fully functional.
- `/legacy` standalone route remains valid.
- `/?legacy=1` forced-legacy still works.
- The `SHELL_ENABLED` feature flag + build gate from Phase 0 still apply.
- Backend APIs and data model are unchanged.

## Level Data Sync

`src-shell/src/engine/levels.js` is a copy of the LEVELS array from
`src/index.html`. If you add/change levels in the legacy file, update
`levels.js` as well (or extract via a build script in the future).
