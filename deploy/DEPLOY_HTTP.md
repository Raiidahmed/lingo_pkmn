# Temporary HTTP Deployment — Lingo Dungeon

> **WARNING: Temporary setup only.**
> This uses the Flask development server over plain HTTP with no TLS.
> Suitable for personal/demo testing only.
> Before going public on lingo-dungeon.com: point DNS → droplet, run Certbot for HTTPS, swap Flask for Gunicorn.

---

## 1. Install nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
```

---

## 2. Create the virtualenv and install deps

```bash
cd /home/claude-agent/lingo_pkmn
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

---

## 3. Set a real admin token in the service file

```bash
# Generate a token
python3 -c "import secrets; print(secrets.token_hex(32))"

# Edit the service file and replace "changeme" with the generated token
nano /home/claude-agent/lingo_pkmn/deploy/lingo-dungeon.service
```

---

## 4. Install and start the systemd service

```bash
sudo cp /home/claude-agent/lingo_pkmn/deploy/lingo-dungeon.service \
        /etc/systemd/system/lingo-dungeon.service

sudo systemctl daemon-reload
sudo systemctl enable lingo-dungeon
sudo systemctl start  lingo-dungeon
sudo systemctl status lingo-dungeon   # should show "active (running)"
```

---

## 5. Configure nginx

```bash
sudo cp /home/claude-agent/lingo_pkmn/deploy/nginx-lingo-dungeon.conf \
        /etc/nginx/sites-available/lingo-dungeon

sudo ln -sf /etc/nginx/sites-available/lingo-dungeon \
            /etc/nginx/sites-enabled/lingo-dungeon

# Remove the default site so this becomes the only listener on :80
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t                   # must print "syntax is ok"
sudo systemctl reload nginx
```

---

## 6. Verify

```bash
# From the droplet
curl -s http://127.0.0.1:5000/health   # Flask direct
curl -s http://127.0.0.1/health        # via nginx

# From your laptop — use droplet IP until DNS is live, then lingo-dungeon.com
curl -s http://<DROPLET_IP>/health
# Once DNS is active:
curl -s http://lingo-dungeon.com/health
```

Expected: `{"ok": true, "service": "lingo_flask"}`

---

## Day-to-day commands

| Action | Command |
|--------|---------|
| View logs | `sudo journalctl -u lingo-dungeon -f` |
| Restart after code change | `sudo systemctl restart lingo-dungeon` |
| Reload nginx config | `sudo systemctl reload nginx` |
| Stop app | `sudo systemctl stop lingo-dungeon` |

---

## Limitations

- **No HTTPS** — traffic is plaintext over the network.
- **Flask dev server** — single-threaded, not hardened for real load.
- **SQLite** — fine for solo/demo; not for concurrent writes under load.
- **No process isolation** — app runs as `claude-agent` with full home-dir access.
