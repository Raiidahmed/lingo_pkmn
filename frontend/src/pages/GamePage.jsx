import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store.js';
import { api } from '../api.js';
import { loadLevel, tryMove, TILE, MAP_W, MAP_H } from '../engine/dungeon.js';
import { render, getCanvasSize } from '../engine/renderer.js';

const MAX_HEARTS = 3;
const MOVE_COOLDOWN = 120;

export default function GamePage() {
  const { startLevel, resumeMode, save, endGame, user, theme, language, lightMode, ui, updateWordBank, setScreen } = useStore();

  // --- Mutable game state (refs, no re-render) ---
  const levelRef        = useRef(startLevel);
  const levelDataRef    = useRef(null);   // { grid, playerStart, locks, npcs, challenges, name, numLocks }
  const gridRef         = useRef(null);
  const playerRef       = useRef(null);
  const solvedLocksRef  = useRef(new Set()); // "col,row" strings of solved locks
  const scoreRef        = useRef(0);
  const heartsRef       = useRef(MAX_HEARTS);
  const startTimeRef    = useRef(Date.now());
  const learnedWordsRef = useRef([]);
  const particlesRef    = useRef([]);
  const keysRef         = useRef(new Set());
  const rafRef          = useRef(null);
  const lastMoveRef     = useRef(0);
  const challengeActiveRef = useRef(false);
  const dialogueActiveRef  = useRef(false);
  const gameOverRef        = useRef(false);
  const choiceTimerRef     = useRef(null);  // cleared on unmount to prevent state updates after teardown
  const ctxRef             = useRef(null);  // canvas context cached once at mount

  // --- React state (triggers re-render) ---
  const [hearts,       setHearts]       = useState(MAX_HEARTS);
  const [score,        setScore]        = useState(0);
  const [levelName,    setLevelName]    = useState('');
  const [levelN,       setLevelN]       = useState(startLevel);
  const [elapsed,      setElapsed]      = useState(0);
  const [challenge,    setChallenge]    = useState(null);  // { prompt, choices, answer(idx), hint, lockKey, lockType }
  const [choiceResult, setChoiceResult] = useState(null);  // 'correct'|'wrong'|null
  const [showHint,     setShowHint]     = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [dialogue,     setDialogue]     = useState(null);  // { npc, lineIndex }

  const canvasRef    = useRef(null);
  const containerRef = useRef(null);

  // Keep a ref to dialogue so advanceDialogue can read current state from the RAF keydown handler
  const dialogueRef = useRef(null);
  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);

  // --- Level loading ---
  function initLevel(n, snapshot = null) {
    const data = loadLevel(n, language);
    levelDataRef.current = data;
    // Deep copy grid so mutations don't affect the source
    gridRef.current = data.grid.map(row => [...row]);
    solvedLocksRef.current = new Set();

    if (snapshot && snapshot.levelIndex === n) {
      // Restore from snapshot
      playerRef.current = snapshot.playerPos;
      scoreRef.current  = snapshot.score;
      heartsRef.current = snapshot.hearts;
      startTimeRef.current = Date.now() - (snapshot.elapsedMs || 0);
      // Re-open solved locks
      for (const key of (snapshot.solvedLocks || [])) {
        solvedLocksRef.current.add(key);
        const [c, r] = key.split(',').map(Number);
        const lockInfo = data.locks[key];
        if (lockInfo) {
          gridRef.current[r][c] = lockInfo.type === 'chest' ? TILE.CHEST_O : TILE.DOOR_O;
        }
      }
      setHearts(snapshot.hearts);
      setScore(snapshot.score);
    } else {
      playerRef.current = { ...data.playerStart };
      scoreRef.current  = 0;
      heartsRef.current = MAX_HEARTS;
      startTimeRef.current = Date.now();
      setHearts(MAX_HEARTS);
      setScore(0);
    }

    levelRef.current = n;
    setLevelN(n);
    setLevelName(data.name);
  }

  function isExitOpen() {
    return solvedLocksRef.current.size >= levelDataRef.current.numLocks;
  }

  function addParticle(col, row, text, color) {
    particlesRef.current.push({
      x: (col * 32 + 16),
      y: (row * 32),
      text, color, alpha: 1, vy: -1.2, life: 60,
    });
  }

  // --- Save helpers ---
  function buildSnapshot() {
    return {
      levelIndex:   levelRef.current,
      solvedLocks:  [...solvedLocksRef.current],
      playerPos:    { ...playerRef.current },
      score:        scoreRef.current,
      hearts:       heartsRef.current,
      elapsedMs:    Date.now() - startTimeRef.current,
    };
  }
  function buildStatus() {
    return {
      levelIndex:  levelRef.current,
      levelName:   levelDataRef.current?.name ?? '',
      score:       scoreRef.current,
      wordCount:   learnedWordsRef.current.length,
    };
  }

  // --- Challenge trigger ---
  function tryOpenChallenge(targetCol, targetRow) {
    const key = `${targetCol},${targetRow}`;
    if (solvedLocksRef.current.has(key)) return;
    const lockInfo = levelDataRef.current.locks[key];
    if (!lockInfo) return;
    const ch = levelDataRef.current.challenges[lockInfo.challengeId];
    if (!ch) return;
    challengeActiveRef.current = true;
    setAttemptCount(0);
    setShowHint(false);
    setChoiceResult(null);
    setChallenge({ ...ch, lockKey: key, lockType: lockInfo.type });
  }

  // --- NPC interaction ---
  function tryTalkNPC(player) {
    const npc = levelDataRef.current?.npcs?.find(n =>
      Math.abs(n.col - player.col) + Math.abs(n.row - player.row) <= 1
    );
    if (!npc) return false;
    dialogueActiveRef.current = true;
    const dlg = { npc, lineIndex: 0 };
    dialogueRef.current = dlg;
    setDialogue(dlg);
    return true;
  }

  // --- Shared move execution (keyboard and D-pad both route here) ---
  function applyMove(dx, dy) {
    const now = performance.now();
    if (now - lastMoveRef.current < MOVE_COOLDOWN) return;
    if (challengeActiveRef.current || dialogueActiveRef.current) return;

    const target = {
      col: playerRef.current.col + dx,
      row: playerRef.current.row + dy,
    };
    if (target.row < 0 || target.row >= MAP_H || target.col < 0 || target.col >= MAP_W) return;
    const targetTile = gridRef.current[target.row][target.col];

    if (targetTile === TILE.DOOR_C || targetTile === TILE.CHEST_C) {
      tryOpenChallenge(target.col, target.row);
      lastMoveRef.current = now;
      return;
    }

    const newPos = tryMove(gridRef.current, playerRef.current, dx, dy, isExitOpen());
    if (newPos.col === playerRef.current.col && newPos.row === playerRef.current.row) return;
    playerRef.current = newPos;
    lastMoveRef.current = now;

    if (gridRef.current[newPos.row][newPos.col] === TILE.STAIRS && isExitOpen()) {
      const completedLevel = levelRef.current;
      const nextN = completedLevel + 1;
      api.markLevelComplete(completedLevel).catch(e => console.warn('markLevelComplete', e));
      scoreRef.current += 200;
      setScore(scoreRef.current);
      api.submitScore(completedLevel, scoreRef.current, Date.now() - startTimeRef.current)
        .catch(e => console.warn('submitScore', e));
      if (nextN > 10) {
        finishGame(true);
      } else {
        learnedWordsRef.current = [];
        api.saveGame(null, {}).catch(e => console.warn('saveGame', e));
        initLevel(nextN);
      }
    }
  }

  // --- Input processing (keyboard polling, runs every RAF tick) ---
  function processInput() {
    let dx = 0, dy = 0;
    if (keysRef.current.has('ArrowLeft')  || keysRef.current.has('a')) dx = -1;
    if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) dx =  1;
    if (keysRef.current.has('ArrowUp')    || keysRef.current.has('w')) dy = -1;
    if (keysRef.current.has('ArrowDown')  || keysRef.current.has('s')) dy =  1;
    if (!dx && !dy) return;
    applyMove(dx, dy);
  }

  // --- Challenge answer ---
  function handleChoice(choiceText, choiceIdx) {
    if (!challenge || choiceResult) return;
    const correct = choiceIdx === challenge.answer;
    setChoiceResult(correct ? 'correct' : 'wrong');

    choiceTimerRef.current = setTimeout(() => {
      if (correct) {
        // Open the tile
        const [c, r] = challenge.lockKey.split(',').map(Number);
        gridRef.current[r][c] = challenge.lockType === 'chest' ? TILE.CHEST_O : TILE.DOOR_O;
        solvedLocksRef.current.add(challenge.lockKey);
        scoreRef.current += 100;
        setScore(scoreRef.current);
        addParticle(c, r, '+100', '#22cc66');
        // Extract word pair: first quoted = Spanish, second quoted or correct choice = English
        const rewardMatches = (challenge.reward || '').match(/'([^']+)'|"([^"]+)"/g) || [];
        const word_es = rewardMatches[0]?.replace(/['"]/g, '') || null;
        const word_en = rewardMatches[1]?.replace(/['"]/g, '') || challenge.choices[challenge.answer] || null;
        // Only store if they differ (skip reverse-translation challenges where answer is the Spanish word)
        if (word_es && word_en && word_es.toLowerCase() !== word_en.toLowerCase() && word_es.length <= 32) {
          learnedWordsRef.current.push({ word_es, word_en });
          api.addWords([{ es: word_es, en: word_en }], `Level ${levelRef.current}`)
            .catch(e => console.warn('addWords', e));
        }
        // Auto-save after correct answer
        api.saveGame(buildSnapshot(), buildStatus()).catch(e => console.warn('saveGame', e));
      } else {
        const newCount = attemptCount + 1;
        setAttemptCount(newCount);
        if (newCount >= 3) setShowHint(true);
        scoreRef.current = Math.max(0, scoreRef.current - 25);
        setScore(scoreRef.current);
        const [c, r] = challenge.lockKey.split(',').map(Number);
        addParticle(c, r, '-25', '#ff3355');
        const newH = heartsRef.current - 1;
        heartsRef.current = newH;
        setHearts(newH);
        if (newH <= 0) {
          challengeActiveRef.current = false;
          setChallenge(null);
          setChoiceResult(null);
          finishGame(false);
          return;
        }
      }
      challengeActiveRef.current = false;
      setChallenge(null);
      setChoiceResult(null);
      setShowHint(false);
      setAttemptCount(0);
    }, 600);
  }

  // --- Dialogue advance ---
  function advanceDialogue() {
    const dlg = dialogueRef.current;
    if (!dlg) return;
    const lines = dlg.npc.dialogue;
    if (dlg.lineIndex + 1 < lines.length) {
      const next = { ...dlg, lineIndex: dlg.lineIndex + 1 };
      dialogueRef.current = next;
      setDialogue(next);
    } else {
      dialogueActiveRef.current = false;
      dialogueRef.current = null;
      setDialogue(null);
    }
  }

  // --- Game over / finish ---
  function finishGame(won) {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    const time_ms = Date.now() - startTimeRef.current;
    const level   = levelRef.current;
    const finalScore = scoreRef.current;
    api.submitScore(level, finalScore, time_ms).catch(e => console.warn('submitScore', e));
    api.saveGame(null, {}).catch(e => console.warn('saveGame', e));
    // Refresh user data (word bank already submitted per-answer, just sync store)
    api.me().then(d => updateWordBank(d.user?.word_bank ?? [])).catch(() => {});
    endGame({ level, score: finalScore, time_ms, wordsPassed: learnedWordsRef.current.length });
  }

  // --- D-pad: move exactly once per tap, delegates to shared applyMove ---
  function moveDir(dx, dy) {
    applyMove(dx, dy);
  }

  // --- Render loop ---
  function renderFrame() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    particlesRef.current = particlesRef.current
      .map(p => ({ ...p, y: p.y + p.vy, alpha: p.alpha - 0.016, life: p.life - 1 }))
      .filter(p => p.life > 0);
    render(ctx, {
      grid: gridRef.current,
      player: playerRef.current,
      solvedLocks: solvedLocksRef.current,
      exitOpen: isExitOpen(),
      particles: particlesRef.current,
      npcs: levelDataRef.current?.npcs ?? [],
    }, theme.accent, (() => { const s = useStore.getState(); return s.lightMode ? (s.ui?.canvasTint ?? 0.58) : 0; })());
  }

  // --- Mount ---
  useEffect(() => {
    const snapshot = (resumeMode && save?.snapshot) ? save.snapshot : null;
    initLevel(resumeMode && snapshot ? snapshot.levelIndex : startLevel, snapshot);
    learnedWordsRef.current = [];
    gameOverRef.current = false;

    // Cache canvas context — valid for the lifetime of this canvas element
    ctxRef.current = canvasRef.current.getContext('2d');

    function scaleCanvas() {
      const canvas = canvasRef.current;
      const cont   = containerRef.current;
      if (!canvas || !cont) return;
      const { width: cw, height: ch } = getCanvasSize();
      const scale = Math.min(cont.clientWidth / cw, cont.clientHeight / ch, 2);
      canvas.style.width  = `${cw * scale}px`;
      canvas.style.height = `${ch * scale}px`;
      canvas.width  = cw;
      canvas.height = ch;
    }
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    function onKeyDown(e) {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','s','d','w'].includes(e.key)) {
        e.preventDefault();
        keysRef.current.add(e.key);
      }
      if ((e.key === 'Enter' || e.key === ' ') && dialogueActiveRef.current) {
        advanceDialogue();
      }
      if (e.key === 'e' || e.key === 'E') {
        if (!challengeActiveRef.current && !dialogueActiveRef.current) {
          tryTalkNPC(playerRef.current);
        }
      }
    }
    function onKeyUp(e) { keysRef.current.delete(e.key); }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000)), 1000);

    function loop() {
      processInput();
      renderFrame();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(choiceTimerRef.current);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('resize', scaleCanvas);
      clearInterval(timer);
    };
  }, []);

  function fmtTime(s) {
    return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  }

  return (
    <div className="game-wrap">
      {/* HUD */}
      <div className="hud">
        <div className="hud-left">
          <div className="hud-level">{levelName || `LEVEL ${levelN}`}</div>
          <div className="hud-score">{score} XP</div>
        </div>
        <div className="hearts">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`heart${i >= hearts ? ' empty' : ''}`}>♥</span>
          ))}
        </div>
        <div className="hud-right">
          <div className="hud-timer">{fmtTime(elapsed)}</div>
          <button
            style={{ fontSize: 6, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
            onClick={() => {
              api.saveGame(buildSnapshot(), buildStatus()).catch(e => console.warn('saveGame', e));
              api.submitScore(levelRef.current, scoreRef.current, Date.now() - startTimeRef.current).catch(e => console.warn('submitScore', e));
              api.me().then(d => updateWordBank(d.user?.word_bank ?? [])).catch(() => {});
              cancelAnimationFrame(rafRef.current);
              setScreen('menu');
            }}
          >QUIT</button>
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-area" ref={containerRef}>
        <canvas id="dungeon" ref={canvasRef} />
      </div>

      {/* Controls — dpad left, action button right */}
      <div className="controls-bar">
        <div className="dpad">
          <button className="dpad-btn dpad-up"    onPointerDown={() => moveDir(0,-1)}>▲</button>
          <button className="dpad-btn dpad-left"  onPointerDown={() => moveDir(-1,0)}>◀</button>
          <div className="dpad-center" />
          <button className="dpad-btn dpad-right" onPointerDown={() => moveDir(1,0)}>▶</button>
          <button className="dpad-btn dpad-down"  onPointerDown={() => moveDir(0,1)}>▼</button>
        </div>
        <button
          className="action-btn"
          style={{ marginRight: '8px' }}
          onPointerDown={() => {
            if (!challengeActiveRef.current && !dialogueActiveRef.current)
              tryTalkNPC(playerRef.current);
          }}
        >
          <span className="talk-bubble">
            <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
              <rect x="2" y="2" width="68" height="40" rx="9" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M12 42 L10 61 L30 42" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="talk-bubble-text">ACTION</span>
          </span>
        </button>
      </div>

      {/* NPC Dialogue modal */}
      {dialogue && (
        <div className="challenge-overlay">
          <div className="challenge-box">
            <div className="challenge-label" style={{ color: dialogue.npc.color }}>
              {dialogue.npc.name}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text)', lineHeight: 1.8, minHeight: 60 }}>
              {dialogue.npc.dialogue[dialogue.lineIndex]}
            </div>
            <button className="btn btn-accent" onClick={advanceDialogue}>
              {dialogue.lineIndex + 1 < dialogue.npc.dialogue.length ? 'Next ▶' : 'Close ✕'}
            </button>
          </div>
        </div>
      )}

      {/* Challenge modal */}
      {challenge && (
        <div className="challenge-overlay">
          <div className="challenge-box">
            <div className="challenge-label">⚡ CHALLENGE ⚡</div>
            {challenge.display && (
              <div style={{
                fontSize: 56,
                textAlign: 'center',
                fontFamily: 'var(--font-ja)',
                color: 'var(--accent)',
                textShadow: '0 0 16px var(--accent-glow)',
                lineHeight: 1.1,
              }}>
                {challenge.display}
              </div>
            )}
            <div style={{ fontSize: 9, color: 'var(--text)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {challenge.prompt}
            </div>
            {showHint && (
              <div style={{ fontSize: 7, color: '#c8a020', fontStyle: 'italic' }}>
                💡 {challenge.hint}
              </div>
            )}
            <div className="choices">
              {challenge.choices.map((c, i) => (
                <button
                  key={i}
                  className={`choice-btn${
                    choiceResult && i === challenge.answer ? ' correct' :
                    choiceResult === 'wrong' && i !== challenge.answer ? ' wrong' : ''
                  }`}
                  style={challenge.choiceStyle === 'hiragana'
                    ? { fontSize: 22, fontFamily: 'var(--font-ja)', padding: '10px 4px' }
                    : undefined}
                  onClick={() => handleChoice(c, i)}
                  disabled={!!choiceResult}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
