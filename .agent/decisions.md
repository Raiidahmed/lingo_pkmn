## [2026-04-21T01:16:00Z] Cycle 1: Add sound effects for interactions
Chose: Add subtle sound effects for door unlocks, chest opens, correct/wrong answers, and level complete
Because: Audio feedback significantly improves game feel and engagement, especially for a learning game. Currently silent.
Alternatives considered: Adding particle effects (requires canvas changes), adding more NPC dialogue (content-heavy), adding a settings menu (complex).

## [2026-04-21T01:22:00Z] Cycle 2: Add visual feedback for correct/wrong answers
Chose: Add subtle particle effects (floating +XP numbers, sparkles) when answering correctly/wrong
Because: Visual reinforcement complements sound, makes learning feedback more engaging and clear.
Alternatives considered: Adding animations to NPCs (complex), adding a progress bar (UI clutter), adding more Spanish content (content-heavy).

## [2026-04-21T01:28:00Z] Cycle 3: Add a hint system for stuck players
Chose: Add a "Hint" button that appears after 2 wrong attempts on same challenge, reveals a clue
Because: Reduces frustration, supports learning without giving away answer. Complements existing hint text.
Alternatives considered: Adding a skip option (breaks learning), adding a dictionary sidebar (complex UI), adding more NPC hints (content-heavy).

## [2026-04-24T02:00:00Z] Frontend shell spike: Vite + React + Zustand wrapping legacy game as iframe
Chose: Build `src-spike/` as a Vite + React + Zustand SPA shell that owns title/auth/status/settings/game-over screens and an explicit state machine; embed the existing `src/index.html` game via `<iframe src="/legacy">`. Flask now serves the shell at `/` and the legacy game at `/legacy` (falls back to legacy at `/` when `src-spike/dist/` is unbuilt).
Because: Moves architecture forward without touching 6,000+ lines of gameplay JS. Preserves full A/B comparison on the same branch. Isolates the canvas/game loop from the UI shell as the proposal requires. Reversible — deleting `src-spike/` auto-falls-back.
Alternatives considered: Porting the whole game into React (far too large for a spike); leaving legacy at `/` and adding shell at `/spike` only (less honest demo of the target UX); web-component mount instead of iframe (needs legacy rewrite as ES modules — deferred).
