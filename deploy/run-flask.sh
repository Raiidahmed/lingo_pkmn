#!/usr/bin/env bash
# Temporary run script — Flask dev server only. Not for production.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_DIR"

if [[ -f "$REPO_DIR/.venv/bin/activate" ]]; then
    # shellcheck source=/dev/null
    source "$REPO_DIR/.venv/bin/activate"
fi

export FLASK_RUN_HOST="${FLASK_RUN_HOST:-127.0.0.1}"
export FLASK_RUN_PORT="${FLASK_RUN_PORT:-5000}"
export FLASK_DEBUG="${FLASK_DEBUG:-0}"

exec python app.py
