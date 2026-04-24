#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

VENV_DIR="$REPO_DIR/.venv"
if [[ -f "$VENV_DIR/bin/activate" ]]; then
    source "$VENV_DIR/bin/activate"
fi

export FLASK_RUN_HOST="${FLASK_RUN_HOST:-127.0.0.1}"
export FLASK_RUN_PORT="${FLASK_RUN_PORT:-5000}"
export FLASK_DEBUG="${FLASK_DEBUG:-0}"
export LINGO_DB_PATH="${LINGO_DB_PATH:-$REPO_DIR/backend/lingo.db}"

exec flask --app backend.app run --host "$FLASK_RUN_HOST" --port "$FLASK_RUN_PORT"
