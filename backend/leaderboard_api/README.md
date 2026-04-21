# SQLite Leaderboard API (Droplet)

Pure-Python leaderboard backend for `lingo_pkmn` using only the standard library (`http.server` + `sqlite3`).

## Endpoints

- `GET /health` -> `{ "ok": true, ... }`
- `GET /scores` -> JSON array sorted by score descending (optional `?limit=50`)
- `POST /scores` -> upsert one score, dedupe by case-insensitive name, keep best score per normalized name
- `POST /admin/dedupe` -> collapse accidental duplicates globally (requires admin token header)

Admin auth headers accepted:
- `X-Admin-Token: <token>`
- `Authorization: Bearer <token>`

## Frontend API Override

`src/index.html` now defaults to same-origin (`/scores`) in the Flask app, and still supports runtime override:

- `window.LINGO_LEADERBOARD_API_BASE` (highest priority)
- query param `?leaderboardApi=https://your-api.example.com`
- `localStorage.setItem('lingoLeaderboardApiBase', 'https://your-api.example.com')`

If none are set, it uses same-origin API calls.

## Local Run

From repo root:

```bash
python3 backend/leaderboard_api/app.py --host 127.0.0.1 --port 8080 --db-path backend/leaderboard_api/leaderboard.db
```

Environment variables:

- `LEADERBOARD_HOST` (default: `0.0.0.0`)
- `LEADERBOARD_PORT` (default: `8080`)
- `LEADERBOARD_DB_PATH` (default: `backend/leaderboard_api/leaderboard.db`)
- `LEADERBOARD_ADMIN_TOKEN` (required for `/admin/dedupe`)

## Import Existing Worker Scores (Legacy — one-time migration only)

The Cloudflare Worker leaderboard is retired; migration to SQLite is complete. This section is retained for historical context only.

```bash
python3 backend/leaderboard_api/import_from_worker.py \
  --url https://lingo-dungeon-api.raiidahmed.workers.dev/scores \
  --db-path backend/leaderboard_api/leaderboard.db
```

## Droplet Deployment Notes

1. Copy/pull repo to droplet (example path: `/opt/lingo_pkmn`)
2. Create writable data dir:
   ```bash
   sudo mkdir -p /var/lib/lingo-leaderboard
   sudo chown -R $USER:$USER /var/lib/lingo-leaderboard
   ```
3. *(Legacy — skip for new deployments; migration already done.)* If restoring from the retired Cloudflare Worker, see the **Import Existing Worker Scores** section below.
4. Run API:
   ```bash
   LEADERBOARD_DB_PATH=/var/lib/lingo-leaderboard/leaderboard.db \
   LEADERBOARD_PORT=8080 \
   LEADERBOARD_ADMIN_TOKEN='replace-me' \
   python3 backend/leaderboard_api/app.py
   ```
5. Put Nginx/Caddy in front with TLS and route `/scores`, `/health`, `/admin/dedupe` to this app.

## Example systemd Service

`/etc/systemd/system/lingo-leaderboard.service`

```ini
[Unit]
Description=Lingo Dungeon SQLite Leaderboard API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/lingo_pkmn
Environment=LEADERBOARD_HOST=127.0.0.1
Environment=LEADERBOARD_PORT=8080
Environment=LEADERBOARD_DB_PATH=/var/lib/lingo-leaderboard/leaderboard.db
Environment=LEADERBOARD_ADMIN_TOKEN=replace-with-strong-token
ExecStart=/usr/bin/python3 /opt/lingo_pkmn/backend/leaderboard_api/app.py
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now lingo-leaderboard.service
sudo systemctl status lingo-leaderboard.service
```
