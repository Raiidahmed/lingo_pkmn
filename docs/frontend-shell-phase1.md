# Frontend Shell Phase 1 (`src-shell/` + legacy bridge)

Phase 1 keeps the iframe boundary from Phase 0, but makes the shell and
legacy game communicate in both directions so shell settings and game-over
state are real.

## Scope delivered

- Embedded bridge from legacy game to shell:
  - Legacy now posts `window.parent.postMessage({ type: 'lingo:gameOver', stats })`
    when run-terminal outcomes occur.
  - Implemented for:
    - quit from in-run HUD
    - quit from level-complete screen
    - final dungeon win
  - Stats payload includes:
    - `xp`
    - `challenges`
    - `time`
    - `attempts`
    - `levelLabel`
    - `result` (`"win"` or `"quit"`)
  - Posting is embedded-only (`?embedded=1` and `parent !== window`).

- Config bridge from shell to legacy iframe:
  - Shell sends `lingo:config` messages with:
    - `accentTheme`
    - `sound` (`"on"` / `"off"`)
  - Sent:
    - on iframe load
    - whenever shell accent changes
    - whenever shell sound setting changes
  - Legacy receives config in embedded mode and applies existing logic:
    - accent via existing theme application/storage path (`lingoAccentTheme`)
    - sound via existing sound/UI/storage path (`lingoSound`)

- Shell settings now use real shared preference keys:
  - Accent theme ids are aligned to legacy ids:
    - `violet`, `crimson`, `teal`, `amber`, `mint`
  - Accent persistence key: `lingoAccentTheme`
  - Sound persistence key: `lingoSound`
  - Settings screen sound toggle now updates persisted state and iframe behavior.

- Shell status screen messaging improved:
  - Uses existing save status fields to distinguish:
    - resumable saved run
    - fresh start
  - Main action label now reflects resume vs fresh intent.

## Files touched in Phase 1

- `src/index.html`
- `src-shell/src/state/appStore.js`
- `src-shell/src/components/GameCanvas.jsx`
- `src-shell/src/components/SettingsScreen.jsx`
- `src-shell/src/components/StatusScreen.jsx`
- `src-shell/src/components/GameOverScreen.jsx`
- `README.md`
- `docs/frontend-shell-phase1.md`

## Cutline preserved

- Gameplay remains fully legacy in iframe (no React gameplay port).
- Backend API/data model unchanged.
- Flask routing unchanged:
  - `/legacy` standalone still works
  - `/?legacy=1` fallback still works
  - shell remains feature-flag/build gated per Phase 0

## Deferred beyond Phase 1

- Replace iframe gameplay with modular React/ESM game runtime.
- Deep in-shell gameplay controls beyond settings + terminal state handoff.
- Richer event contract (mid-run progress events, pause/resume telemetry).
