# Frontend Shell Phase 0 (`src-shell/`)

Ported from the `spike/frontend-react-shell` branch. The `main` branch is
unchanged by this work beyond `app.py` serving routes — the legacy game
in `src/index.html` is **not modified**, so you can A/B the two shells on
the same Flask server.

## What this Phase 0 shell demonstrates

- Vite + React + Zustand SPA shell (`src-shell/`).
- Explicit app state machine covering every screen from the proposal:
  `booting → anonymous_title → authenticating → authenticated_title`
  `→ status → settings → in_game → game_over`.
- Componentised UI: `TitleScreen`, `AuthPanel`, `LeaderboardPanel`,
  `StatusScreen`, `SettingsScreen`, `GameCanvas`, `GameOverScreen`, `Hud`.
- Single source of truth (`useAppStore`) holds auth/session,
  save/status, accent theme, current screen, and loading flags.
- Gameplay code stays isolated — `GameCanvas.jsx` mounts the legacy game
  via `<iframe src="/legacy">` instead of porting 6,000+ lines of canvas
  code. The React shell never touches game DOM; a `postMessage`-based
  channel is wired (listening for `{ type: 'lingo:gameOver', stats }`)
  so a future iteration can surface real game-over events.

## Routes

| Route | Served by Flask | What it is |
|-------|-----------------|------------|
| `/` | `src-shell/dist/index.html` only when `SHELL_ENABLED=1` and built, else `src/index.html` | Shell (or legacy fallback) |
| `/shell`, `/shell/<asset>` | `src-shell/dist/` | Shell bundle + assets |
| `/legacy` | `src/index.html` | Untouched legacy game (also used by the iframe) |
| `/editor` | `src/editor.html` | Untouched level editor |
| `/scores`, `/api/account/*` | Flask APIs | Unchanged |

`/` always supports `?legacy=1` to force the legacy page even when the
shell is enabled and built.

If `src-shell/dist/` has no build output, or `SHELL_ENABLED` is not
truthy, Flask serves the legacy game at `/`, so the branch is never
broken.

## How to run locally

One-time setup (from repo root):

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Build the shell and start Flask:

```bash
# build the React shell
cd src-shell
npm install
npm run build
cd ..

# run Flask — serves the shell at / when enabled
SHELL_ENABLED=1 flask --app app:create_app run --debug
```

Open:

- Shell: http://127.0.0.1:5000/
- Legacy game (for comparison): http://127.0.0.1:5000/legacy
- Forced legacy override: http://127.0.0.1:5000/?legacy=1
- Editor: http://127.0.0.1:5000/editor

### Dev workflow with hot reload

Run Flask on 5000 as above, then in another terminal:

```bash
cd src-shell
npm run dev  # serves on :5173 with proxy to Flask for /scores, /api, /legacy
```

Open http://127.0.0.1:5173/. The Vite config proxies API and `/legacy`
requests to the Flask backend so the shell works end-to-end.

## Directory layout

```
src-shell/
├── index.html                    Vite entry
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  React bootstrap
    ├── App.jsx                   Screen state-machine router
    ├── state/
    │   ├── appStore.js           Zustand store + SCREENS enum + actions
    │   └── api.js                Fetch wrappers for same-origin Flask APIs
    ├── components/
    │   ├── Hud.jsx
    │   ├── TitleScreen.jsx
    │   ├── AuthPanel.jsx
    │   ├── LeaderboardPanel.jsx
    │   ├── StatusScreen.jsx
    │   ├── SettingsScreen.jsx
    │   ├── GameCanvas.jsx        (iframe host)
    │   └── GameOverScreen.jsx
    └── styles/
        └── shell.css
```

## State machine

States live in `state/appStore.js` as `SCREENS`, and transitions are the
only way state changes:

| Transition | Action |
|------------|--------|
| `booting → anonymous_title` | `boot()` with no stored token |
| `booting → authenticated_title` | `boot()` with valid stored token (via `/api/account/me`) |
| `anonymous_title → authenticating → authenticated_title` or `status` | `login({ name, password, intent })` |
| any → `status` | `gotoStatus()` |
| any → `settings` | `gotoSettings()` |
| any → title | `gotoTitle()` (picks anon/auth based on session) |
| `status → in_game` | `enterDungeon()` |
| `in_game → game_over` | `reportGameOver(stats)` (called from iframe via `postMessage`) |
| `game_over → status` / `title` | via `resetGameOver()` + `gotoStatus/Title` |
| `→ logged out` | `logout()` |

All side effects (localStorage for token/accent, fetch for login/me/
scores/logout) are inside the store actions so components stay pure.

## Why iframe for the game

- Zero-churn boundary: legacy `src/index.html` is untouched.
- Matches the "keep canvas/game loop isolated from the UI shell"
  proposal guidance.
- Easy to iterate — once the shell is proven, we can replace the iframe
  with a React-mounted game module by extracting the legacy JS into
  ES modules. That refactor is explicitly out of scope for Phase 0.

## Known Phase 0 limitations

- Game-over events are not posted from the legacy game yet. The shell
  is ready to receive them (`window.postMessage({ type: 'lingo:gameOver',
  stats: { xp, challenges, time, attempts, levelLabel } })`), but the
  legacy game still handles its own end-of-run screens inside the
  iframe. Users can use the "Quit to Shell" button to return.
- Settings sound toggle is visual-only — audio is inside the iframe.
- Accent theme is applied to the shell only; the legacy game still
  reads its own theme key from `localStorage`.
- Status screen shows a read-only snapshot and does not yet start a
  specific level; launching jumps straight into the legacy game at
  whatever level it was on.

These are deliberate cutlines to keep Phase 0 small and reversible.

## Reverting

Nothing about the shell is load-bearing for existing users. Options:

1. Keep both (current behaviour): shell at `/` behind `SHELL_ENABLED=1`, legacy at `/legacy`.
2. Set `SHELL_ENABLED=0` (or unset) to send `/` to the legacy game.
3. Delete `src-shell/` entirely — Flask falls back to legacy automatically
   when no `dist/` exists.
