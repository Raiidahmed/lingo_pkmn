# Frontend Shell Phase 2 (`src-shell/` start authority)

Phase 2 keeps the iframe boundary and makes the shell authoritative for
launching gameplay. The embedded legacy runtime no longer drops users into
legacy title/status/auth screens when opened from the shell.

## Scope delivered

- New shell -> legacy launch bridge message:
  - `window.postMessage({ type: 'lingo:start', mode, levelIndex, launchNonce })`
  - `mode` is `resume` or `restart`
  - `levelIndex` is zero-based
  - `launchNonce` is a per-launch id for deduping retries

- Embedded legacy bootstrap now waits for shell launch:
  - Embedded mode (`/legacy?embedded=1`) shows a neutral wait screen.
  - Legacy auth/title/status flows are skipped in embedded mode.
  - Embedded runtime posts `lingo:ready` once bootstrapped.
  - Embedded runtime posts `lingo:startAck` after applying `lingo:start`.

- Launch semantics are routed through existing legacy logic:
  - `resume` + resumable snapshot => restores exact mid-level snapshot.
  - `restart` => fresh load of requested level with existing save semantics.
  - Existing status-screen start behavior now uses the same launch helper path.

- Shell status screen now surfaces legacy launch controls:
  - Start level selector (Level 1-10).
  - Resume vs restart toggle when a resumable snapshot exists.
  - Main CTA launches using selected mode + level and enters iframe.

- Shell store expanded for launch authority:
  - Stores snapshot metadata and resumable flags.
  - Stores launch preferences (`mode`, `levelIndex`).
  - Tracks `launchNonce` per dungeon entry to make bridge delivery robust.

- Iframe timing hardened:
  - `GameCanvas` listens for `lingo:ready` and `lingo:startAck`.
  - Shell sends `lingo:start` on load and retries briefly until ack.
  - Existing `lingo:config` bridge remains intact.

## Files touched in Phase 2

- `src-shell/src/state/appStore.js`
- `src-shell/src/components/StatusScreen.jsx`
- `src-shell/src/components/GameCanvas.jsx`
- `src-shell/src/styles/shell.css`
- `src/index.html`
- `docs/frontend-shell-phase2.md`
- `README.md`

## Cutline preserved

- Gameplay remains fully legacy in iframe (no React gameplay port).
- Backend APIs/data model are unchanged.
- `/legacy` standalone behavior is preserved.
- `/?legacy=1` forced-legacy routing is preserved.
- Phase 1 bridges remain:
  - shell -> legacy `lingo:config`
  - legacy -> shell `lingo:gameOver`
