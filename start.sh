#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Starting Lingo SMT ==="

# Backend
cd "$ROOT"
if [ ! -d .venv ]; then
  python3 -m venv .venv
  .venv/bin/pip install -q -r backend/requirements.txt
fi

LINGO_DB_PATH="$ROOT/backend/lingo.db" \
FLASK_APP=backend.app \
FLASK_RUN_PORT=5001 \
FLASK_RUN_HOST=127.0.0.1 \
  .venv/bin/python -m flask run &
FLASK_PID=$!
echo "Flask started (PID $FLASK_PID) on :5001"

# Frontend
cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  npm install -q
fi
npm run dev &
VITE_PID=$!
echo "Vite started (PID $VITE_PID) on :5173"

echo ""
echo "Game running at: http://localhost:5173"
echo "Press Ctrl+C to stop"

trap "kill $FLASK_PID $VITE_PID 2>/dev/null" EXIT INT
wait
