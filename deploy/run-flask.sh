#!/usr/bin/env bash
# Temporary run script — Flask dev server only. Not for production.
set -euo pipefail

DEFAULT_REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
APP_DIR="${LINGO_APP_DIR:-/tmp/lingo_pkmn_phase3}"
if [[ ! -d "$APP_DIR" ]]; then
    APP_DIR="$DEFAULT_REPO_DIR"
fi
cd "$APP_DIR"

VENV_DIR="${LINGO_VENV_DIR:-$DEFAULT_REPO_DIR/.venv}"
if [[ -f "$VENV_DIR/bin/activate" ]]; then
    # shellcheck source=/dev/null
    source "$VENV_DIR/bin/activate"
fi

export FLASK_RUN_HOST="${FLASK_RUN_HOST:-127.0.0.1}"
export FLASK_RUN_PORT="${FLASK_RUN_PORT:-5000}"
export FLASK_DEBUG="${FLASK_DEBUG:-0}"
export SHELL_ENABLED="${SHELL_ENABLED:-1}"

exec flask --app app:create_app run --host "$FLASK_RUN_HOST" --port "$FLASK_RUN_PORT"
