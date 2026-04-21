import argparse
import json
import os
import urllib.error
import urllib.request

try:
    from .db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError
except ImportError:  # Allow direct script execution.
    from db import DEFAULT_DB_PATH, LeaderboardDB, ValidationError


DEFAULT_SOURCE_URL = "https://lingo-dungeon-api.raiidahmed.workers.dev/scores"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import leaderboard scores from Cloudflare Worker into SQLite.")
    parser.add_argument("--url", default=DEFAULT_SOURCE_URL, help="Source leaderboard endpoint.")
    parser.add_argument("--db-path", default=os.getenv("LEADERBOARD_DB_PATH", DEFAULT_DB_PATH))
    parser.add_argument("--timeout", type=float, default=20.0)
    return parser.parse_args()


def fetch_scores(url: str, timeout: float):
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "lingo-leaderboard-import/1.0 (+https://raiidahmed.github.io/lingo_pkmn/)",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:  # noqa: S310 - explicit trusted import source
        data = resp.read()
    parsed = json.loads(data.decode("utf-8"))
    if not isinstance(parsed, list):
        raise ValueError("Source response was not a JSON array.")
    return parsed


def main() -> None:
    args = parse_args()
    db = LeaderboardDB(args.db_path)
    db.init_db()

    try:
        items = fetch_scores(args.url, args.timeout)
    except urllib.error.URLError as exc:
        raise SystemExit(f"Failed to fetch source scores: {exc}") from exc
    except ValueError as exc:
        raise SystemExit(f"Invalid source response: {exc}") from exc

    inserted = 0
    updated = 0
    kept = 0
    deduped = 0
    skipped = 0

    for item in items:
        try:
            result = db.upsert_score(item, source="worker_import")
            deduped += int(result.get("deduped", 0))
            action = result.get("action")
            if action == "inserted":
                inserted += 1
            elif action == "updated":
                updated += 1
            else:
                kept += 1
        except ValidationError:
            skipped += 1

    print(
        f"Import complete from {args.url}\n"
        f"- processed: {len(items)}\n"
        f"- inserted:  {inserted}\n"
        f"- updated:   {updated}\n"
        f"- kept:      {kept}\n"
        f"- deduped:   {deduped}\n"
        f"- skipped:   {skipped}\n"
        f"- db:        {args.db_path}"
    )


if __name__ == "__main__":
    main()
