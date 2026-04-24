# Frontend Shell Phase 3 (`src-shell/` post-run continuity)

Phase 3 keeps gameplay in the legacy iframe and moves more post-run authority
to the React shell. The shell is now the destination UX not just at launch,
but also after terminal run events.

## Scope delivered

- Shell now refreshes authenticated save data after embedded terminal events:
  - New store action: `refreshSessionSave()` in `src-shell/src/state/appStore.js`.
  - Re-fetches `/api/account/me` and updates:
    - `saveStatus`
    - `saveSnapshot`
    - `hasResumableSnapshot`
    - `launchPreferences`
    - `wordBank`
  - Includes short retry behavior to reduce race windows after legacy save writes.

- Terminal event handoff strengthened:
  - Legacy `lingo:gameOver` payload now includes `terminal` metadata
    (`result`, `reason`, bridge version, timestamp) while preserving `stats`.
  - Shell `GameCanvas` forwards `stats + terminal` into `reportGameOver`.

- Shell-initiated quit now goes through legacy quit semantics:
  - New bridge command: shell -> legacy `lingo:quit`.
  - Shell "Quit to Shell" requests legacy quit, which triggers save + terminal
    event emission instead of bypassing game state.

- Embedded post-run behavior now returns control to shell faster:
  - In embedded mode, legacy final-win and quit terminal screens are skipped.
  - Legacy resets to embedded wait state and emits `lingo:ready` for the next
    launch while the shell renders post-run UI.

- Shell game-over screen upgraded to transition UX:
  - Signed-in users get:
    - `Play Again` (relaunch using current launch preferences)
    - `Back to Status`
  - Guests get:
    - `Back to Title`
  - Screen shows save-refresh progress (`pending.saveRefresh`).

## Files touched in Phase 3

- `src-shell/src/state/appStore.js`
- `src-shell/src/components/GameCanvas.jsx`
- `src-shell/src/components/GameOverScreen.jsx`
- `src-shell/src/styles/shell.css`
- `src/index.html`
- `docs/frontend-shell-phase3.md`
- `README.md`

## Cutline preserved

- Legacy gameplay logic and rendering stay in `src/index.html` iframe module.
- Backend schemas and endpoints are unchanged.
- `/legacy` standalone behavior remains valid.
- `/?legacy=1` forced-legacy behavior remains valid.
