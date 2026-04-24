/**
 * LingoDungeon Game Engine — Phase 4 Native Canvas
 *
 * Replaces the iframe+postMessage approach with a module that mounts
 * directly into a container element in the React shell.
 *
 * Usage:
 *   import { mountGameEngine } from './engine/game-engine.js';
 *   const ctrl = mountGameEngine(containerEl, {
 *     accent:       'crimson',
 *     soundEnabled: true,
 *     playerName:   'Hero',
 *     token:        'jwt...',
 *     apiBase:      '',
 *     onReady:      () => {},
 *     onGameOver:   (stats, terminal) => {},
 *   });
 *   ctrl.start({ mode: 'restart', levelIndex: 0, launchNonce: 1 });
 *   ctrl.quit();
 *   ctrl.setAccent('violet');
 *   ctrl.setSound(false);
 *   ctrl.destroy();
 */

import { LEVELS } from './levels.js';

// ============================================================
//  TILE CONSTANTS
// ============================================================
const TILE = 32;
const T = { FLOOR:0, WALL:1, DOOR_C:2, DOOR_O:3, CHEST_C:4, CHEST_O:5, STAIRS:6, RUG:7 };
const COLORS = {
  0:'#1c1c1c', 1:'#000', WALL_TOP:'#252525', WALL_EDGE:'#3a3a3a',
  2:'#666', 3:'#222', 4:'#bbb', 5:'#3a3a3a', 6:'#2a2a2a', 7:'#161616'
};
const MAP_W = 15, MAP_H = 13;
const WORD_BANK_LIMIT = 10;
const ACCENT_THEME_KEY = 'lingoAccentTheme';
const ACCENT_THEMES = [
  { id: 'crimson', accent: '#cc0033', dark: '#7a001f' },
  { id: 'violet',  accent: '#5b2fb0', dark: '#35156f' },
  { id: 'teal',    accent: '#0f8f8f', dark: '#075959' },
  { id: 'amber',   accent: '#c68400', dark: '#7b4f00' },
  { id: 'mint',    accent: '#0f9d73', dark: '#076348' },
];
const DEFAULT_ACCENT_THEME_ID = 'crimson';
const LOCK_TARGETS_BY_LEVEL = [4, 5, 6, 7, 7, 7, 7, 7, 8, 9];
const MOVE_COOLDOWN = 100;

// ============================================================
//  HTML TEMPLATE
// ============================================================
function buildGameHTML() {
  return `
<div class="ld-hud">
  <span class="ld-title">LINGO DUNGEON</span>
  <span class="ld-xp">XP: <span class="ld-xp-val">0</span></span>
  <div style="display:flex;gap:4px;align-items:center">
    <button class="ld-hud-btn ld-sound-btn">SFX ON</button>
    <button class="ld-hud-btn ld-quit-btn">QUIT</button>
  </div>
</div>

<div class="ld-game-wrap">
  <canvas class="ld-canvas"></canvas>
  <div class="ld-toast"></div>

  <div class="ld-dialogue" tabindex="-1">
    <div class="ld-dlg-speaker"></div>
    <div class="ld-dlg-text"></div>
    <div class="ld-dlg-choices"></div>
    <button class="ld-continue-btn" type="button" style="display:none">Continue ▶</button>
  </div>

  <!-- LEVEL COMPLETE SCREEN -->
  <div class="ld-screen ld-screen-levelcomplete">
    <h1 class="ld-lc-title">LEVEL COMPLETE!</h1>
    <div class="ld-level-badge ld-lc-levelname">The Entrance Hall</div>
    <div class="ld-stat-grid">
      <div class="ld-stat-box"><div class="ld-val ld-lc-xp">0</div><div class="ld-lbl">XP EARNED</div></div>
      <div class="ld-stat-box"><div class="ld-val ld-lc-challenges">0</div><div class="ld-lbl">CHALLENGES PASSED</div></div>
      <div class="ld-stat-box"><div class="ld-val ld-lc-time">0s</div><div class="ld-lbl">TIME</div></div>
      <div class="ld-stat-box"><div class="ld-val ld-lc-attempts">0</div><div class="ld-lbl">TOTAL ATTEMPTS</div></div>
    </div>
    <button class="ld-big-btn ld-nextlevel-btn">Next Level ▶</button>
    <button class="ld-ghost-btn ld-lc-quit-btn">Quit to Title</button>
  </div>
</div>

<div class="ld-mobile-controls">
  <div class="ld-dpad">
    <div></div>
    <div class="ld-dpad-btn ld-btn-up">▲</div>
    <div></div>
    <div class="ld-dpad-btn ld-btn-left">◀</div>
    <div class="ld-dpad-btn center"></div>
    <div class="ld-dpad-btn ld-btn-right">▶</div>
    <div></div>
    <div class="ld-dpad-btn ld-btn-down">▼</div>
    <div></div>
  </div>
  <div class="ld-action-btn">TALK</div>
</div>

<!-- AUDIO GATE MODAL -->
<div class="ld-modal ld-audio-gate" aria-hidden="true" role="dialog">
  <div class="ld-modal-box">
    <h2>Sound?</h2>
    <p>This dungeon is better with its haunting melodies.</p>
    <div class="ld-modal-actions">
      <button class="ld-big-btn ld-audio-enable-btn" type="button">Enable Sound ▶</button>
      <button class="ld-ghost-btn ld-audio-mute-btn" type="button">Play Muted</button>
    </div>
  </div>
</div>

<!-- INSTALL HELPER MODAL -->
<div class="ld-modal ld-install-helper" aria-hidden="true" role="dialog">
  <div class="ld-modal-box">
    <h2>Install on iPhone</h2>
    <p>Tap Safari's Share button, then choose Add to Home Screen, then tap Add.</p>
    <div class="ld-modal-actions">
      <button class="ld-big-btn ld-install-helper-close" type="button">Got It</button>
    </div>
  </div>
</div>
`.trim();
}

// ============================================================
//  ENGINE FACTORY
// ============================================================
export function mountGameEngine(container, config = {}) {
  const {
    accent: initialAccent = DEFAULT_ACCENT_THEME_ID,
    soundEnabled: initialSoundEnabled = true,
    playerName: initialPlayerName = 'Hero',
    token: initialToken = '',
    apiBase: initialApiBase = '',
    onReady = () => {},
    onGameOver = () => {},
  } = config;

  // Inject HTML
  container.classList.add('ld-game-host');
  container.innerHTML = buildGameHTML();

  // ---- scoped query helper ----
  const $ = sel => container.querySelector(sel);
  const $$ = sel => Array.from(container.querySelectorAll(sel));

  // ---- DOM refs ----
  const canvasEl       = $('.ld-canvas');
  const ctx            = canvasEl.getContext('2d');
  const gameWrap       = $('.ld-game-wrap');
  const toastEl        = $('.ld-toast');
  const dlgEl          = $('.ld-dialogue');
  const dlgSpeaker     = $('.ld-dlg-speaker');
  const dlgText        = $('.ld-dlg-text');
  const dlgChoices     = $('.ld-dlg-choices');
  const continueBtn    = $('.ld-continue-btn');
  const soundBtn       = $('.ld-sound-btn');
  const quitBtn        = $('.ld-quit-btn');
  const xpValEl        = $('.ld-xp-val');
  const audioGate      = $('.ld-audio-gate');
  const audioEnableBtn = $('.ld-audio-enable-btn');
  const audioMuteBtn   = $('.ld-audio-mute-btn');
  const installHelper  = $('.ld-install-helper');
  const installHelperCloseBtn = $('.ld-install-helper-close');
  const mobileControls = $('.ld-mobile-controls');
  const actionBtn      = $('.ld-action-btn');

  // ---- accent helpers ----
  function getAccentTheme(name) {
    const normalized = typeof name === 'string' ? name.trim().toLowerCase() : '';
    return ACCENT_THEMES.find(t => t.id === normalized)
      || ACCENT_THEMES.find(t => t.id === DEFAULT_ACCENT_THEME_ID)
      || ACCENT_THEMES[0];
  }

  function applyAccentTheme(name) {
    const theme = getAccentTheme(name);
    activeAccentTheme = theme.id;
    // Apply to host element (inherits to children via CSS vars)
    container.style.setProperty('--accent', theme.accent);
    container.style.setProperty('--accent-dark', theme.dark);
    return theme;
  }

  // ---- state ----
  let API = (typeof initialApiBase === 'string') ? initialApiBase : '';
  let accountToken = initialToken || '';
  let playerName = initialPlayerName || 'Hero';
  let activeAccentTheme = DEFAULT_ACCENT_THEME_ID;
  let wordBank = [];
  let currentLevelIdx = 0;
  let mapState = [];
  let locksState = {};
  let currentNPCs = [];
  let currentChallenges = [];
  let player = { col: 7, row: 10 };
  let xp = 0;
  let totalXP = 0;
  let challengesPassed = 0;
  let totalAttempts = 0;
  let levelStartTime = 0;
  let sessionStartTime = 0;
  let dialogueOpen = false;
  let pendingLock = null;
  let pendingNPC = null;
  let npcDialogueIdx = 0;
  let selectedChoiceIdx = -1;
  let attemptCounts = {};
  let missedChallengeQueue = [];
  let missedChallengeCursor = 0;
  let lockChallengeOverrides = {};
  let scoreSubmitWarned = false;
  let pendingStartName = '';
  let deferredInstallPrompt = null;

  const keys = {};
  let rafId = null;
  let lastTime = 0;
  let destroyed = false;
  let pendingAudioStart = null; // callback waiting on audio gate

  // ---- apply initial theme ----
  applyAccentTheme(initialAccent);

  // ---- helpers ----
  function remainingLocks() {
    return Object.values(locksState).filter(l => !l.unlocked).length;
  }

  function queueMissedChallenge(challengeId) {
    if (!Number.isInteger(challengeId)) return;
    if (missedChallengeQueue.includes(challengeId)) return;
    if (Object.values(lockChallengeOverrides).includes(challengeId)) return;
    missedChallengeQueue.push(challengeId);
  }

  function maybeAssignRevisitChallenge(lockKey) {
    if (Object.prototype.hasOwnProperty.call(lockChallengeOverrides, lockKey)) {
      return lockChallengeOverrides[lockKey];
    }
    if (remainingLocks() > 2 || !missedChallengeQueue.length) return null;
    const queueIdx = missedChallengeCursor % missedChallengeQueue.length;
    const challengeId = missedChallengeQueue[queueIdx];
    if (!Number.isInteger(challengeId)) return null;
    lockChallengeOverrides[lockKey] = challengeId;
    missedChallengeCursor++;
    attemptCounts[lockKey] = 0;
    return challengeId;
  }

  function getChallengeForLock(lockKey) {
    const lock = locksState[lockKey];
    if (!lock) return null;
    const revisitId = maybeAssignRevisitChallenge(lockKey);
    const challengeId = Number.isInteger(revisitId) ? revisitId : lock.challengeId;
    const challenge = currentChallenges[challengeId];
    if (!challenge) return null;
    return { ...challenge, baseId: challengeId, revisit: Number.isInteger(revisitId) };
  }

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    if (s < 60) return s + 's';
    return Math.floor(s / 60) + 'm ' + (s % 60) + 's';
  }

  function safeStorageGet(key) {
    try { return localStorage.getItem(key) || ''; } catch (e) { return ''; }
  }

  function safeStorageSet(key, value) {
    try {
      if (!value) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (e) {}
  }

  function defaultWordBank() {
    return [
      { key: 'hola',    text: 'hola',    gloss: 'hello',  source: 'starter pack' },
      { key: 'gracias', text: 'gracias', gloss: 'thanks', source: 'starter pack' },
      { key: 'puerta',  text: 'puerta',  gloss: 'door',   source: 'starter pack' },
    ];
  }

  function mergeWordBankWithChallenge(ch) {
    const next = Array.isArray(wordBank) ? [...wordBank] : [];
    if (!ch || typeof ch.prompt !== 'string') return next.slice(0, WORD_BANK_LIMIT);
    const prompt = ch.prompt.replace(/\s+/g, ' ').trim();
    const reward = typeof ch.reward === 'string' ? ch.reward.replace(/\s+/g, ' ').trim() : '';
    const words = [];
    const quoted = reward.match(/"([^"]+)"|"([^"]+)"|'([^']+)'/g);
    if (quoted && quoted.length) {
      quoted.forEach(fragment => {
        const clean = fragment.replace(/["""']/g, '').trim();
        if (clean) words.push(clean);
      });
    }
    if (!words.length) {
      const vocabish = prompt.match(/\b[a-záéíóúñü]{3,}\b/ig) || [];
      vocabish.slice(0, 2).forEach(word => words.push(word.toLowerCase()));
    }
    words.forEach((word, idx) => {
      const key = word.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/gi, '_').slice(0, 32);
      if (!key) return;
      if (next.some(item => item.key === key)) return;
      next.unshift({
        key, text: word,
        gloss: idx === 0 ? 'recent pickup' : 'useful phrase',
        source: LEVELS[currentLevelIdx] ? LEVELS[currentLevelIdx].name : 'dungeon',
      });
    });
    return next.slice(0, WORD_BANK_LIMIT);
  }

  function authHeaders() {
    return accountToken ? { Authorization: 'Bearer ' + accountToken } : {};
  }

  function currentStoryLabel() {
    if (LEVELS[currentLevelIdx]) return LEVELS[currentLevelIdx].name;
    return 'New run';
  }

  function currentStatusPayload(reason = 'manual') {
    return {
      storyLabel: currentStoryLabel(),
      storyProgress: currentLevelIdx + 1,
      totalXP,
      wordCount: Array.isArray(wordBank) ? wordBank.length : 0,
      hasActiveRun: currentLevelIdx > 0 || totalXP > 0 || challengesPassed > 0,
      levelLabel: LEVELS[currentLevelIdx] ? LEVELS[currentLevelIdx].name : 'The Entrance Hall',
      updatedReason: reason,
    };
  }

  function currentSnapshotPayload() {
    const playerCopy = (player && typeof player === 'object')
      ? { col: player.col, row: player.row, dir: Number.isInteger(player.dir) ? player.dir : 0 }
      : { col: 7, row: 10, dir: 0 };
    const safeMapState = Array.isArray(mapState) ? mapState.map(r => Array.isArray(r) ? r.slice() : []) : [];
    const safeLocksState = {};
    try {
      Object.entries(locksState || {}).forEach(([k, v]) => {
        if (v && typeof v === 'object') safeLocksState[k] = { ...v };
      });
    } catch (e) {}
    return {
      playerName, currentLevelIdx, totalXP, xp, challengesPassed, totalAttempts,
      player: playerCopy, mapState: safeMapState, locksState: safeLocksState,
      attemptCounts: { ...(attemptCounts || {}) },
      missedChallengeQueue: Array.isArray(missedChallengeQueue) ? missedChallengeQueue.slice() : [],
      missedChallengeCursor: Number.isInteger(missedChallengeCursor) ? missedChallengeCursor : 0,
      lockChallengeOverrides: { ...(lockChallengeOverrides || {}) },
      levelElapsedMs: Math.max(0, Date.now() - (levelStartTime || Date.now())),
      levelName: LEVELS[currentLevelIdx] ? LEVELS[currentLevelIdx].name : 'The Entrance Hall',
      savedAt: new Date().toISOString(),
    };
  }

  async function saveAccountProgress(reason = 'manual') {
    if (!accountToken) return null;
    try {
      const response = await fetch(API + '/api/account/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          snapshot: currentSnapshotPayload(),
          status: currentStatusPayload(reason),
          word_bank: wordBank,
          accent_theme: getAccentTheme(activeAccentTheme).id,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload && payload.error ? payload.error : 'Could not save progress.');
      if (Array.isArray(payload.word_bank)) wordBank = payload.word_bank;
      return payload;
    } catch (err) {
      console.warn('Save progress failed:', err);
      return null;
    }
  }

  async function postScore(level) {
    try {
      const response = await fetch(API + '/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName, score: totalXP,
          level: level + 1, time: Date.now() - sessionStartTime,
        }),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
    } catch (e) {
      if (!scoreSubmitWarned) {
        scoreSubmitWarned = true;
        showToast('Could not submit score to leaderboard.');
      }
      console.warn('Leaderboard score POST failed:', e);
    }
  }

  // ============================================================
  //  CANVAS + RENDERING
  // ============================================================
  function resizeCanvas() {
    const viewW = MAP_W * TILE;
    const viewH = MAP_H * TILE;
    const wrapStyles = getComputedStyle(gameWrap);
    const padX = parseFloat(wrapStyles.paddingLeft) + parseFloat(wrapStyles.paddingRight);
    const padY = parseFloat(wrapStyles.paddingTop) + parseFloat(wrapStyles.paddingBottom);
    const availW = Math.max(1, gameWrap.clientWidth - padX);
    const availH = Math.max(1, gameWrap.clientHeight - padY);
    const raw = Math.min(availW / viewW, availH / viewH);
    const s = raw >= 1 ? Math.min(raw, 2) : Math.max(raw, 0.4);
    canvasEl.width  = viewW;
    canvasEl.height = viewH;
    canvasEl.style.width  = Math.round(viewW * s) + 'px';
    canvasEl.style.height = Math.round(viewH * s) + 'px';
  }

  function drawTile(col, row, type) {
    const x = col * TILE, y = row * TILE;
    if (type === T.WALL) {
      ctx.fillStyle = COLORS[1]; ctx.fillRect(x, y, TILE, TILE);
      ctx.fillStyle = COLORS.WALL_TOP; ctx.fillRect(x, y, TILE, 6);
      ctx.strokeStyle = COLORS.WALL_EDGE; ctx.lineWidth = 1;
      ctx.strokeRect(x+.5, y+.5, TILE-1, TILE-1);
      return;
    }
    ctx.fillStyle = COLORS[0]; ctx.fillRect(x, y, TILE, TILE);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
    ctx.strokeRect(x+.5, y+.5, TILE-1, TILE-1);
    if (type === T.DOOR_C || type === T.DOOR_O) {
      const open = type === T.DOOR_O;
      ctx.fillStyle = open ? COLORS[3] : COLORS[2];
      ctx.fillRect(x+4, y+4, TILE-8, TILE-8);
      if (!open) {
        ctx.strokeStyle='#333'; ctx.lineWidth=2;
        ctx.strokeRect(x+4, y+4, TILE-8, TILE-8);
        ctx.fillStyle='#fff'; ctx.beginPath();
        ctx.arc(x+TILE/2, y+TILE/2, 3, 0, Math.PI*2); ctx.fill();
        ctx.font='10px Courier New'; ctx.textAlign='center';
        ctx.fillText('L', x+TILE/2, y+10);
      } else {
        ctx.strokeStyle='#222'; ctx.lineWidth=2;
        ctx.strokeRect(x+4, y+4, TILE-8, TILE-8);
      }
      return;
    }
    if (type === T.CHEST_C || type === T.CHEST_O) {
      const open = type === T.CHEST_O;
      ctx.fillStyle = open ? COLORS[5] : COLORS[4];
      ctx.fillRect(x+4, y+10, TILE-8, TILE-14);
      if (!open) {
        ctx.fillStyle='#555'; ctx.fillRect(x+4, y+10, TILE-8, 6);
        ctx.fillStyle='#ddd'; ctx.beginPath();
        ctx.arc(x+TILE/2, y+16, 3, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.fillStyle='#333'; ctx.fillRect(x+4, y+6, TILE-8, 5);
        ctx.font='12px sans-serif'; ctx.textAlign='center';
        ctx.fillStyle='#fff'; ctx.fillText('*', x+TILE/2, y+TILE-4);
      }
      return;
    }
    if (type === T.STAIRS) {
      const gated = remainingLocks() > 0;
      ctx.fillStyle = gated ? '#1a1a1a' : COLORS[6];
      ctx.fillRect(x+3, y+3, TILE-6, TILE-6);
      ctx.fillStyle = gated ? '#111' : '#333';
      for (let i=0; i<3; i++) ctx.fillRect(x+5+i*6, y+8+i*5, TILE-14, 4);
      ctx.fillStyle = gated ? '#555' : '#ddd';
      ctx.font='10px Courier New'; ctx.textAlign='center';
      ctx.fillText(gated ? '??' : '>>', x+TILE/2, y+TILE-4);
      return;
    }
    if (type === T.RUG) {
      ctx.fillStyle = COLORS[7]; ctx.fillRect(x+2, y+2, TILE-4, TILE-4);
    }
  }

  function drawNPC(npc) {
    const x = npc.col*TILE, y = npc.row*TILE;
    ctx.fillStyle='rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(x+TILE/2, y+TILE-5, 9, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle=npc.color; ctx.fillRect(x+10, y+14, 12, 13);
    ctx.fillStyle='#ccc'; ctx.fillRect(x+9, y+6, 14, 12);
    ctx.fillStyle='#000'; ctx.fillRect(x+12, y+9, 3, 3); ctx.fillRect(x+18, y+9, 3, 3);
    ctx.fillStyle='#fff'; ctx.font='bold 9px Courier New'; ctx.textAlign='center';
    ctx.fillText(npc.label, x+TILE/2, y+4);
  }

  function drawPlayer() {
    const x = player.col*TILE, y = player.row*TILE;
    const accentColor = container.style.getPropertyValue('--accent') || '#cc0033';
    const accentDark  = container.style.getPropertyValue('--accent-dark') || '#7a001f';
    ctx.fillStyle='rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.ellipse(x+TILE/2, y+TILE-4, 9, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle=accentDark; ctx.fillRect(x+9, y+14, 14, 14);
    ctx.fillStyle='#ccc';     ctx.fillRect(x+10, y+6, 12, 11);
    ctx.fillStyle=accentColor; ctx.fillRect(x+10, y+5, 12, 4);
    ctx.fillStyle='#000'; ctx.fillRect(x+12, y+10, 3, 3); ctx.fillRect(x+17, y+10, 3, 3);
    ctx.fillStyle=accentDark; ctx.fillRect(x+23, y+10, 3, 14);
    ctx.fillStyle=accentColor; ctx.fillRect(x+21, y+14, 7, 3);
  }

  function render() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    for (let row=0; row<MAP_H; row++)
      for (let col=0; col<MAP_W; col++)
        drawTile(col, row, mapState[row][col]);
    currentNPCs.forEach(drawNPC);
    drawPlayer();
    Particles.draw();
  }

  // ============================================================
  //  TOAST + PARTICLES
  // ============================================================
  function showToast(msg, dur=2200) {
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.style.opacity = '0'; }, dur);
  }

  const Particles = {
    list: [],
    add(x, y, text, color, vy=-1.5) {
      this.list.push({ x, y, text, color, vy, life: 60 });
    },
    update() {
      for (let i = this.list.length - 1; i >= 0; i--) {
        const p = this.list[i];
        p.y += p.vy; p.life--;
        if (p.life <= 0) this.list.splice(i, 1);
      }
    },
    draw() {
      ctx.save();
      ctx.font = 'bold 14px Courier New';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const p of this.list) {
        ctx.globalAlpha = p.life / 60;
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.restore();
    },
  };

  function addXP(amount) {
    xp += amount; totalXP += amount;
    xpValEl.textContent = xp;
    showToast('+' + amount + ' XP!');
    if (amount >= 20) Sound.correct();
    else if (amount > 0) Sound.click();
    const px = player.col * TILE + TILE/2;
    const py = player.row * TILE + TILE/2;
    Particles.add(px, py, '+' + amount + ' XP', '#fff');
  }

  // ============================================================
  //  SCREENS (level complete only — shell owns title/status/game-over)
  // ============================================================
  function showScreen(id) {
    $$('.ld-screen').forEach(s => {
      s.scrollTop = 0;
      s.classList.remove('active');
    });
    if (!id) return;
    const target = container.querySelector('.' + id);
    if (!target) return;
    target.classList.add('active');
    target.scrollTop = 0;
  }

  // ============================================================
  //  LEVEL LOADING
  // ============================================================
  function loadLevel(idx) {
    currentLevelIdx = idx;
    const lvl = LEVELS[idx];
    player = { ...lvl.playerStart };
    mapState = lvl.map.map(r => [...r]);
    locksState = {};
    const lockEntries = Object.entries(lvl.locks);
    const targetLockCount = Math.min(
      lockEntries.length,
      Number.isInteger(LOCK_TARGETS_BY_LEVEL[idx]) ? LOCK_TARGETS_BY_LEVEL[idx] : lockEntries.length
    );
    lockEntries.forEach(([k, v], lockIdx) => {
      const [col, row] = k.split(',').map(Number);
      if (lockIdx < targetLockCount) {
        locksState[k] = { ...v, unlocked: false };
        return;
      }
      if (Number.isInteger(row) && Number.isInteger(col) && mapState[row] && typeof mapState[row][col] !== 'undefined') {
        mapState[row][col] = T.FLOOR;
      }
    });
    currentNPCs = lvl.npcs;
    currentChallenges = lvl.challenges;
    xp = 0;
    challengesPassed = 0;
    totalAttempts = 0;
    attemptCounts = {};
    missedChallengeQueue = [];
    missedChallengeCursor = 0;
    lockChallengeOverrides = {};
    dialogueOpen = false;
    pendingLock = null;
    pendingNPC = null;
    levelStartTime = Date.now();
    xpValEl.textContent = '0';
    dlgEl.style.display = 'none';
    showScreen(null);
    resizeCanvas();
    render();
    showToast('Level ' + (idx+1) + ': ' + lvl.name, 3000);
  }

  function applyMidLevelSnapshot(snapshot) {
    try {
      if (Array.isArray(snapshot.mapState) && snapshot.mapState.length) {
        mapState = snapshot.mapState.map(r => Array.isArray(r) ? r.slice() : []);
      }
      if (snapshot.locksState && typeof snapshot.locksState === 'object') {
        locksState = {};
        Object.entries(snapshot.locksState).forEach(([k, v]) => {
          if (v && typeof v === 'object') locksState[k] = { ...v };
        });
      }
      if (snapshot.player && typeof snapshot.player === 'object') {
        player = { col: snapshot.player.col || 7, row: snapshot.player.row || 10 };
      }
      if (Number.isFinite(Number(snapshot.xp))) xp = Math.max(0, Math.floor(Number(snapshot.xp)));
      if (Number.isFinite(Number(snapshot.totalXP))) totalXP = Math.max(0, Math.floor(Number(snapshot.totalXP)));
      if (Number.isFinite(Number(snapshot.challengesPassed))) challengesPassed = Math.max(0, Math.floor(Number(snapshot.challengesPassed)));
      if (Number.isFinite(Number(snapshot.totalAttempts))) totalAttempts = Math.max(0, Math.floor(Number(snapshot.totalAttempts)));
      if (snapshot.attemptCounts && typeof snapshot.attemptCounts === 'object') {
        attemptCounts = { ...snapshot.attemptCounts };
      }
      if (Array.isArray(snapshot.missedChallengeQueue)) {
        missedChallengeQueue = snapshot.missedChallengeQueue.filter(Number.isInteger);
      }
      if (Number.isInteger(snapshot.missedChallengeCursor)) {
        missedChallengeCursor = snapshot.missedChallengeCursor;
      }
      if (snapshot.lockChallengeOverrides && typeof snapshot.lockChallengeOverrides === 'object') {
        lockChallengeOverrides = { ...snapshot.lockChallengeOverrides };
      }
      const elapsed = Number.isFinite(Number(snapshot.levelElapsedMs)) ? Number(snapshot.levelElapsedMs) : 0;
      levelStartTime = Date.now() - elapsed;
      xpValEl.textContent = String(xp);
      dlgEl.style.display = 'none';
      showScreen(null);
      resizeCanvas();
      render();
    } catch (e) {
      console.warn('applyMidLevelSnapshot error:', e);
    }
  }

  function resumeIntoGame(snapshot) {
    if (snapshot && snapshot.mapState && snapshot.locksState && snapshot.player && LEVELS[snapshot.currentLevelIdx]) {
      loadLevel(snapshot.currentLevelIdx);
      applyMidLevelSnapshot(snapshot);
    } else {
      const idx = snapshot && Number.isInteger(snapshot.currentLevelIdx) ? snapshot.currentLevelIdx : 0;
      loadLevel(Math.max(0, Math.min(LEVELS.length - 1, idx)));
    }
  }

  // ============================================================
  //  DIALOGUE + CHALLENGE
  // ============================================================
  function getChoiceButtons() {
    return Array.from(dlgChoices.querySelectorAll('.ld-choice-btn'));
  }

  function syncDialogueSelection() {
    const btns = getChoiceButtons();
    btns.forEach((btn, idx) => {
      const selected = idx === selectedChoiceIdx && !btn.disabled;
      btn.classList.toggle('selected', selected);
    });
    focusDialogueControl();
  }

  function focusDialogueControl() {
    requestAnimationFrame(() => {
      const btns = getChoiceButtons();
      if (selectedChoiceIdx >= 0 && btns[selectedChoiceIdx] && !btns[selectedChoiceIdx].disabled) {
        btns[selectedChoiceIdx].focus({ preventScroll: true });
        return;
      }
      if (!btns.length && continueBtn.style.display !== 'none') {
        continueBtn.focus({ preventScroll: true });
        return;
      }
      dlgEl.focus({ preventScroll: true });
    });
  }

  function setDialogueSelection(idx) {
    const btns = getChoiceButtons();
    if (!btns.length) { selectedChoiceIdx = -1; syncDialogueSelection(); return; }
    const enabled = btns.map((btn, i) => btn.disabled ? -1 : i).filter(i => i >= 0);
    if (!enabled.length) { selectedChoiceIdx = -1; syncDialogueSelection(); return; }
    if (!Number.isInteger(idx) || idx < 0 || idx >= btns.length || btns[idx].disabled) {
      selectedChoiceIdx = enabled[0];
    } else {
      selectedChoiceIdx = idx;
    }
    syncDialogueSelection();
  }

  function moveDialogueSelection(delta) {
    const btns = getChoiceButtons();
    const enabled = btns.map((btn, i) => btn.disabled ? -1 : i).filter(i => i >= 0);
    if (!enabled.length) return;
    const currentPos = enabled.indexOf(selectedChoiceIdx);
    const startPos = currentPos >= 0 ? currentPos : 0;
    const nextPos = (startPos + delta + enabled.length) % enabled.length;
    selectedChoiceIdx = enabled[nextPos];
    syncDialogueSelection();
  }

  function activateDialogueSelection() {
    const btns = getChoiceButtons();
    if (btns.length && selectedChoiceIdx >= 0 && btns[selectedChoiceIdx] && !btns[selectedChoiceIdx].disabled) {
      btns[selectedChoiceIdx].click();
      return true;
    }
    if (continueBtn.style.display !== 'none') {
      continueBtn.click();
      return true;
    }
    return false;
  }

  function handleDialogueKeydown(e) {
    if (!dialogueOpen) return false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { moveDialogueSelection(-1); return true; }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { moveDialogueSelection(1); return true; }
    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
      const idx = Number(e.key) - 1;
      const btns = getChoiceButtons();
      if (btns[idx] && !btns[idx].disabled) { setDialogueSelection(idx); btns[idx].click(); return true; }
    }
    if ('abcd'.includes(e.key.toLowerCase()) && e.key.length === 1) {
      const idx = e.key.toLowerCase().charCodeAt(0) - 97;
      const btns = getChoiceButtons();
      if (btns[idx] && !btns[idx].disabled) { setDialogueSelection(idx); btns[idx].click(); return true; }
    }
    if (e.key === 'Enter' || e.key === ' ') { return activateDialogueSelection(); }
    if (e.key === 'Escape' && continueBtn.style.display !== 'none') { continueBtn.click(); return true; }
    return false;
  }

  function openNPCDialogue(npc) {
    pendingNPC = npc; npcDialogueIdx = 0; dialogueOpen = true;
    showNPCLine();
  }

  function showNPCLine() {
    dlgSpeaker.textContent = pendingNPC.name.toUpperCase();
    dlgText.textContent = pendingNPC.dialogue[npcDialogueIdx];
    dlgChoices.innerHTML = '';
    selectedChoiceIdx = -1;
    continueBtn.style.display = 'block';
    continueBtn.textContent = npcDialogueIdx < pendingNPC.dialogue.length-1 ? 'Next ▶' : 'Close X';
    dlgEl.style.display = 'block';
    syncDialogueSelection();
  }

  function openChallenge(lockKey) {
    const ch = getChallengeForLock(lockKey);
    if (!ch) return;
    pendingLock = lockKey;
    dialogueOpen = true;
    if (!attemptCounts[lockKey]) attemptCounts[lockKey] = 0;
    if (ch.revisit) showToast('Pop quiz. The dungeon remembered something you missed earlier.', 2200);
    renderChallenge(ch, lockKey);
  }

  function renderChallenge(ch, lockKey) {
    const attempts = attemptCounts[lockKey] || 0;
    const lockType = locksState[lockKey].type === 'door' ? 'DOOR' : 'CHEST';
    dlgSpeaker.textContent = ch.revisit ? 'REVIEW ' + lockType : 'LOCKED ' + lockType;
    let promptText = ch.prompt;
    if (ch.revisit) promptText = 'The dungeon saved this one for a late review.\n\n' + promptText;
    if (attempts >= 3) promptText += '\n\nHint: ' + ch.hint;
    dlgText.textContent = promptText;
    continueBtn.style.display = 'none';
    dlgChoices.innerHTML = '';
    selectedChoiceIdx = -1;
    const wrongIndices = ch.choices.map((_,i) => i).filter(i => i !== ch.answer);
    let eliminated = [];
    if (attempts >= 5) eliminated = wrongIndices.slice(0, 2);
    else if (attempts >= 3) eliminated = wrongIndices.slice(0, 1);
    ch.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'ld-choice-btn';
      btn.type = 'button';
      if (eliminated.includes(i)) { btn.className += ' eliminated'; btn.disabled = true; }
      btn.textContent = ['A','B','C','D'][i] + ') ' + c;
      btn.addEventListener('click', () => handleAnswer(i, ch, lockKey));
      btn.addEventListener('focus', () => { if (!btn.disabled) { selectedChoiceIdx = i; btn.classList.add('selected'); } });
      btn.addEventListener('mouseenter', () => { if (!btn.disabled) setDialogueSelection(i); });
      dlgChoices.appendChild(btn);
    });
    dlgEl.style.display = 'block';
    setDialogueSelection(0);
  }

  function handleAnswer(idx, ch, lockKey) {
    Sound.select();
    selectedChoiceIdx = -1;
    const btns = dlgChoices.querySelectorAll('.ld-choice-btn');
    btns.forEach(b => b.disabled = true);
    syncDialogueSelection();
    totalAttempts++;
    if (idx === ch.answer) {
      btns[idx].classList.add('correct');
      dlgText.textContent = ch.revisit
        ? ch.reward + '\n\nThe dungeon grudgingly admits you learned it this time.'
        : ch.reward;
      addXP(20);
      wordBank = mergeWordBankWithChallenge(ch);
      challengesPassed++;
      Sound.doorOpen();
      if (locksState[lockKey].type === 'chest') Sound.chest();
      const [col, row] = lockKey.split(',').map(Number);
      locksState[lockKey].unlocked = true;
      mapState[row][col] = locksState[lockKey].type === 'door' ? T.DOOR_O : T.CHEST_O;
      const tx = col * TILE + TILE/2;
      const ty = row * TILE + TILE/2;
      Particles.add(tx, ty, '★', '#fff', -0.8);
      render();
      continueBtn.style.display = 'block';
      continueBtn.textContent = 'Continue ▶';
      dlgChoices.innerHTML = '';
      pendingLock = null; pendingNPC = null;
      syncDialogueSelection();
      saveAccountProgress('challenge_cleared');
    } else {
      const challengeId = Number.isInteger(ch.baseId) ? ch.baseId : locksState[lockKey].challengeId;
      if (!ch.revisit) queueMissedChallenge(challengeId);
      attemptCounts[lockKey] = (attemptCounts[lockKey] || 0) + 1;
      const attempts = attemptCounts[lockKey];
      btns[idx].classList.add('wrong');
      Sound.wrong();
      const px = player.col * TILE + TILE/2;
      const py = player.row * TILE + TILE/2;
      Particles.add(px, py, '✗', '#aaa', -1);
      let msg = ch.revisit
        ? 'Nope. The dungeon kept the receipt, so this question is back on your desk.'
        : 'Nope. The door just did the disappointed language-teacher sigh.';
      if (attempts >= 3) msg = ch.revisit
        ? 'Still not it. A hint appeared because even cursed architecture believes in office hours.'
        : 'Still not it. A hint popped up because the dungeon is smug, not cruel.';
      if (attempts >= 5) msg = ch.revisit
        ? 'Another wrong answer is gone. Even the dungeon wants this review session to end.'
        : 'Another wrong answer got removed. The chest would like everyone to pass and go home.';
      dlgText.textContent = msg;
      addXP(2);
      setTimeout(() => { renderChallenge(ch, lockKey); }, 1000);
    }
  }

  function closeDialogue() {
    dlgEl.style.display = 'none';
    dialogueOpen = false;
    pendingLock = null; pendingNPC = null;
    selectedChoiceIdx = -1;
  }

  // ============================================================
  //  INTERACTION + MOVEMENT
  // ============================================================
  function interact() {
    if (dialogueOpen) return;
    const dirs = [[0,0],[0,-1],[0,1],[-1,0],[1,0]];
    for (const [dc,dr] of dirs) {
      const tc = player.col+dc, tr = player.row+dr;
      if (tc<0||tr<0||tc>=MAP_W||tr>=MAP_H) continue;
      const key = tc+','+tr;
      if (locksState[key] && !locksState[key].unlocked) { openChallenge(key); return; }
      if (mapState[tr][tc] === T.STAIRS) { handleStairs(); return; }
    }
    for (const npc of currentNPCs) {
      if (Math.abs(npc.col-player.col)+Math.abs(npc.row-player.row) <= 1) {
        openNPCDialogue(npc); return;
      }
    }
    showToast('Nothing here. Try moving closer to doors or NPCs.');
  }

  function handleStairs() {
    const remaining = remainingLocks();
    if (remaining > 0) {
      showToast(`The stairs are sealed! Unlock all doors and chests first. (${remaining} still locked)`, 3500);
      return;
    }
    const elapsed = fmtTime(Date.now() - levelStartTime);
    $('.ld-lc-levelname').textContent = LEVELS[currentLevelIdx].name;
    $('.ld-lc-xp').textContent = xp;
    $('.ld-lc-challenges').textContent = challengesPassed;
    $('.ld-lc-time').textContent = elapsed;
    $('.ld-lc-attempts').textContent = totalAttempts;
    Sound.level();
    postScore(currentLevelIdx);

    if (currentLevelIdx >= LEVELS.length - 1) {
      // Final win — hand off to shell
      saveAccountProgress('game_won').finally(() => {
        const stats = {
          xp: totalXP,
          challenges: challengesPassed,
          time: fmtTime(Date.now() - sessionStartTime),
          attempts: totalAttempts,
          levelLabel: LEVELS[currentLevelIdx] ? LEVELS[currentLevelIdx].name : 'The Entrance Hall',
        };
        onGameOver(stats, { result: 'win', reason: 'all_levels_complete', bridge: 'phase4' });
      });
    } else {
      saveAccountProgress('level_complete');
      $('.ld-lc-title').textContent = 'LEVEL COMPLETE!';
      $('.ld-nextlevel-btn').style.display = 'block';
      showScreen('ld-screen-levelcomplete');
    }
  }

  function tryMove(dc, dr) {
    if (dialogueOpen) return;
    const nc = player.col+dc, nr = player.row+dr;
    if (nc<0||nr<0||nc>=MAP_W||nr>=MAP_H) return;
    const tile = mapState[nr][nc];
    if (tile===T.WALL||tile===T.DOOR_C||tile===T.CHEST_C) return;
    for (const npc of currentNPCs) if (npc.col===nc&&npc.row===nr) return;
    Sound.step();
    player.col=nc; player.row=nr;
  }

  // ============================================================
  //  SOUND MANAGER
  // ============================================================
  const Sound = {
    enabled: initialSoundEnabled,
    ctx: null,
    unlocked: false,
    ready: false,
    _pending: [],
    _stepEnd: 0,
    init() {
      if (!this.ctx) {
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) { this.ctx = null; }
      }
      return this.ctx;
    },
    _drain() {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const queue = this._pending; this._pending = [];
      for (let i = 0; i < queue.length; i++) {
        try { queue[i](this.ctx); } catch(e) {}
      }
    },
    _schedule(fn) {
      if (!this.enabled) return;
      if (!this.ctx) { try { this.init(); } catch(e) {} }
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === 'running') { try { fn(ctx); } catch(e) {} return; }
      if (this._pending.length < 8) this._pending.push(fn);
      if (typeof ctx.resume === 'function') {
        try {
          const p = ctx.resume();
          if (p && typeof p.then === 'function') p.then(() => this._drain()).catch(() => {});
        } catch(e) {}
        if (ctx.state === 'running') this._drain();
      }
    },
    play(freq, duration, type='sine', vol=0.08) {
      this._schedule(ctx => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
      });
    },
    unlock() {
      if (this.unlocked) return;
      if (!this.ctx) { try { this.init(); } catch(e) {} }
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        try {
          const p = ctx.resume();
          if (p && typeof p.then === 'function') {
            p.then(() => { this.unlocked = true; this.ready = true; this._drain(); }).catch(() => {});
          }
        } catch(e) {}
      } else if (ctx.state === 'running') {
        this.unlocked = true; this.ready = true; this._drain();
      }
    },
    step()    { const now = Date.now(); if (now < this._stepEnd) return; this._stepEnd = now + 120; this.play(180, 0.06, 'sine', 0.04); },
    click()   { this.play(440, 0.08, 'sine', 0.06); },
    correct() { this.play(660, 0.08); setTimeout(() => this.play(880, 0.12), 80); setTimeout(() => this.play(1100, 0.18), 160); },
    wrong()   { this.play(220, 0.15, 'sawtooth', 0.08); setTimeout(() => this.play(180, 0.2, 'sawtooth', 0.06), 100); },
    doorOpen(){ this.play(523, 0.1); setTimeout(() => this.play(659, 0.12), 60); setTimeout(() => this.play(784, 0.15), 120); },
    chest()   { this.play(440, 0.08); setTimeout(() => this.play(550, 0.1), 80); setTimeout(() => this.play(660, 0.12), 160); setTimeout(() => this.play(880, 0.2), 240); },
    level()   { [523,659,784,1047].forEach((f,i) => setTimeout(() => this.play(f, 0.18), i*100)); },
    select()  { this.play(330, 0.06, 'sine', 0.04); },
  };

  function syncSoundButton() {
    soundBtn.textContent = Sound.enabled ? 'SFX ON' : 'SFX OFF';
    soundBtn.style.color = Sound.enabled ? '' : '#555';
  }
  syncSoundButton();

  // ============================================================
  //  iOS / INSTALL HELPERS
  // ============================================================
  function isLikelyIOS() {
    const ua = navigator.userAgent || '';
    return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }

  function shouldRequireAudioGate() {
    return Sound.enabled && isLikelyIOS() && !Sound.ready;
  }

  function isStandaloneWebApp() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function canShowInstallButton() {
    return !isStandaloneWebApp() && (isLikelyIOS() || !!deferredInstallPrompt);
  }

  function openAudioGate(onConfirm) {
    pendingAudioStart = onConfirm;
    audioGate.classList.add('active');
    audioGate.setAttribute('aria-hidden', 'false');
    audioEnableBtn.focus({ preventScroll: true });
  }

  function closeAudioGate() {
    audioGate.classList.remove('active');
    audioGate.setAttribute('aria-hidden', 'true');
  }

  function openInstallHelper() {
    if (!installHelper) return;
    installHelper.classList.add('active');
    installHelper.setAttribute('aria-hidden', 'false');
    if (installHelperCloseBtn) installHelperCloseBtn.focus({ preventScroll: true });
  }

  function closeInstallHelper() {
    if (!installHelper) return;
    installHelper.classList.remove('active');
    installHelper.setAttribute('aria-hidden', 'true');
  }

  function confirmAudioAndStart() {
    Sound.enabled = true;
    syncSoundButton();
    try { localStorage.setItem('lingoSound', 'on'); } catch(e) {}
    Sound.unlock();
    Sound.ready = true;
    Sound.click();
    closeAudioGate();
    if (typeof pendingAudioStart === 'function') {
      const cb = pendingAudioStart;
      pendingAudioStart = null;
      cb();
    }
  }

  function continueMutedStart() {
    Sound.enabled = false;
    Sound.ready = false;
    syncSoundButton();
    try { localStorage.setItem('lingoSound', 'off'); } catch(e) {}
    closeAudioGate();
    if (typeof pendingAudioStart === 'function') {
      const cb = pendingAudioStart;
      pendingAudioStart = null;
      cb();
    }
  }

  // ============================================================
  //  QUIT — emits onGameOver
  // ============================================================
  function doQuit(reason = 'quit_to_menu') {
    const elapsed = fmtTime(Date.now() - levelStartTime);
    saveAccountProgress(reason).finally(() => {
      const stats = {
        xp: totalXP,
        challenges: challengesPassed,
        time: elapsed,
        attempts: totalAttempts,
        levelLabel: LEVELS[currentLevelIdx] ? LEVELS[currentLevelIdx].name : 'The Entrance Hall',
      };
      const terminal = { result: 'quit', reason, bridge: 'phase4' };
      postScore(currentLevelIdx);
      onGameOver(stats, terminal);
    });
  }

  // ============================================================
  //  GAME LOOP
  // ============================================================
  function loop(ts) {
    if (destroyed) return;
    const dt = ts - lastTime;
    if (dt > MOVE_COOLDOWN) {
      lastTime = ts;
      if (keys['ArrowUp'])    tryMove(0,-1);
      if (keys['ArrowDown'])  tryMove(0, 1);
      if (keys['ArrowLeft'])  tryMove(-1,0);
      if (keys['ArrowRight']) tryMove( 1,0);
    }
    Particles.update();
    render();
    rafId = requestAnimationFrame(loop);
  }

  // ============================================================
  //  EVENT LISTENERS
  // ============================================================
  function handleTouchMenuNav(keyName) {
    if (audioGate.classList.contains('active')) return true;
    if (!dialogueOpen) return false;
    if (keyName === 'ArrowUp' || keyName === 'ArrowLeft') { moveDialogueSelection(-1); return true; }
    if (keyName === 'ArrowDown' || keyName === 'ArrowRight') { moveDialogueSelection(1); return true; }
    return false;
  }

  function dpadBind(el, keyName) {
    if (!el) return;
    const press = e => {
      e.preventDefault();
      Sound.unlock();
      if (handleTouchMenuNav(keyName)) return;
      keys[keyName] = true;
    };
    const release = e => { e.preventDefault(); keys[keyName] = false; };
    el.addEventListener('touchstart',  press,   { passive: false });
    el.addEventListener('touchend',    release, { passive: false });
    el.addEventListener('touchcancel', release, { passive: false });
    el.addEventListener('mousedown',   press);
    el.addEventListener('mouseup',     release);
    el.addEventListener('mouseleave',  release);
  }
  dpadBind($('.ld-btn-up'),    'ArrowUp');
  dpadBind($('.ld-btn-down'),  'ArrowDown');
  dpadBind($('.ld-btn-left'),  'ArrowLeft');
  dpadBind($('.ld-btn-right'), 'ArrowRight');

  function handleActionPress(e) {
    if (e) e.preventDefault();
    Sound.unlock();
    Sound.click();
    if (audioGate.classList.contains('active')) { confirmAudioAndStart(); return; }
    if (dialogueOpen) { activateDialogueSelection(); return; }
    interact();
  }
  actionBtn.addEventListener('touchstart', handleActionPress, { passive: false });
  actionBtn.addEventListener('click', handleActionPress);

  // Keyboard — scoped to document but check if container is active context
  const onKeydown = e => {
    if (destroyed) return;
    if (audioGate.classList.contains('active')) {
      if (e.key === 'Escape') { e.preventDefault(); continueMutedStart(); }
      return;
    }
    if (dialogueOpen && handleDialogueKeydown(e)) { e.preventDefault(); e.stopPropagation(); return; }
    keys[e.key] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    if (!dialogueOpen && (e.key===' '||e.key==='Enter')) { e.preventDefault(); interact(); }
  };
  const onKeyup = e => { if (!destroyed) keys[e.key] = false; };
  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('keyup',   onKeyup,   true);

  // Audio unlock on any gesture
  const unlockAudio = () => Sound.unlock();
  document.addEventListener('touchstart',     unlockAudio, { passive: true });
  document.addEventListener('touchend',       unlockAudio, { passive: true });
  document.addEventListener('pointerdown',    unlockAudio, { passive: true });
  document.addEventListener('click',          unlockAudio);
  document.addEventListener('keydown',        unlockAudio);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) Sound.unlock(); });

  const onResize = () => resizeCanvas();
  window.addEventListener('resize', onResize);

  // HUD buttons
  soundBtn.addEventListener('touchstart', () => Sound.unlock(), { passive: true });
  soundBtn.addEventListener('click', () => {
    Sound.unlock();
    Sound.enabled = !Sound.enabled;
    if (!Sound.enabled) { Sound.ready = false; closeAudioGate(); }
    try { localStorage.setItem('lingoSound', Sound.enabled ? 'on' : 'off'); } catch(e) {}
    syncSoundButton();
    if (Sound.enabled) {
      if (!isLikelyIOS()) Sound.ready = true;
      Sound.unlock(); Sound.click();
    }
  });

  quitBtn.addEventListener('touchstart', () => Sound.unlock(), { passive: true });
  quitBtn.addEventListener('click', () => {
    Sound.unlock(); Sound.click();
    doQuit('quit_to_menu');
  });

  // Level complete buttons
  $('.ld-nextlevel-btn').addEventListener('click', () => {
    Sound.click();
    loadLevel(currentLevelIdx + 1);
  });
  $('.ld-lc-quit-btn').addEventListener('click', () => {
    Sound.click();
    doQuit('quit_from_level_complete');
  });

  // Dialogue
  continueBtn.type = 'button';
  continueBtn.addEventListener('focus', () => { selectedChoiceIdx = -1; });
  continueBtn.addEventListener('click', () => {
    Sound.click();
    if (pendingNPC) {
      npcDialogueIdx++;
      if (npcDialogueIdx < pendingNPC.dialogue.length) { showNPCLine(); return; }
    }
    closeDialogue();
  });

  // Audio gate
  audioEnableBtn.addEventListener('touchstart', e => { e.preventDefault(); confirmAudioAndStart(); }, { passive: false });
  audioEnableBtn.addEventListener('click', () => confirmAudioAndStart());
  audioMuteBtn.addEventListener('touchstart', e => { e.preventDefault(); continueMutedStart(); }, { passive: false });
  audioMuteBtn.addEventListener('click', () => continueMutedStart());

  // Install helper
  if (installHelperCloseBtn) {
    installHelperCloseBtn.addEventListener('click', () => closeInstallHelper());
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  // ============================================================
  //  iOS obscured bottom
  // ============================================================
  (function initIOSObscuredBottom() {
    try {
      const vv = window.visualViewport;
      if (!isLikelyIOS() || !vv) return;
      let pending = false;
      const isKeyboardEditing = () => {
        const el = document.activeElement;
        if (!el || el.disabled || el.readOnly) return false;
        const tag = el.tagName;
        if (tag === 'TEXTAREA') return true;
        if (tag === 'INPUT') {
          const t = (el.type || 'text').toLowerCase();
          return !['button','checkbox','color','file','hidden','image','radio','range','reset','submit'].includes(t);
        }
        return !!el.isContentEditable;
      };
      const set = () => {
        if (isKeyboardEditing()) return;
        const cut = Math.max(0, window.innerHeight - vv.height);
        const capped = Math.min(220, cut);
        container.style.setProperty('--ios-obscured-bottom', `${capped}px`);
      };
      const schedule = () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => { pending = false; set(); });
      };
      schedule();
      vv.addEventListener('resize', schedule);
      window.addEventListener('orientationchange', schedule);
      window.addEventListener('scroll', schedule, { passive: true });
    } catch (e) {}
  })();

  // ============================================================
  //  PUBLIC API
  // ============================================================

  /**
   * start({ mode, levelIndex, snapshot, launchNonce })
   * Called by the shell when ready to begin the game.
   */
  function start({ mode = 'restart', levelIndex = 0, snapshot = null, launchNonce = null } = {}) {
    scoreSubmitWarned = false;
    sessionStartTime = Date.now();

    function doStart() {
      if (mode === 'resume' && snapshot) {
        totalXP = snapshot && Number.isFinite(Number(snapshot.totalXP)) ? Math.max(0, Math.floor(Number(snapshot.totalXP))) : 0;
        resumeIntoGame(snapshot);
      } else {
        totalXP = (snapshot && Number.isFinite(Number(snapshot.totalXP))) ? Math.max(0, Math.floor(Number(snapshot.totalXP))) : 0;
        loadLevel(Math.max(0, Math.min(LEVELS.length - 1, Number(levelIndex) || 0)));
      }
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
      onReady(launchNonce);
    }

    if (shouldRequireAudioGate()) {
      openAudioGate(doStart);
    } else {
      doStart();
    }
  }

  /**
   * quit() — shell-initiated quit (e.g. "Quit to Shell" toolbar button).
   */
  function quit() {
    doQuit('shell_toolbar');
  }

  /**
   * setAccent(themeId) — update accent color in real time.
   */
  function setAccent(themeId) {
    applyAccentTheme(themeId);
  }

  /**
   * setSound(enabled) — toggle sound on/off from shell settings.
   */
  function setSound(enabled) {
    Sound.enabled = Boolean(enabled);
    if (!Sound.enabled) { Sound.ready = false; }
    syncSoundButton();
  }

  /**
   * setPlayerName(name) + setToken(token) — update session info mid-game.
   */
  function setPlayerName(name) { playerName = name || 'Hero'; }
  function setToken(token) { accountToken = token || ''; }

  /**
   * destroy() — clean up DOM, RAF, and event listeners.
   */
  function destroy() {
    destroyed = true;
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    document.removeEventListener('keydown', onKeydown, true);
    document.removeEventListener('keyup',   onKeyup,   true);
    document.removeEventListener('touchstart',  unlockAudio, { passive: true });
    document.removeEventListener('touchend',    unlockAudio, { passive: true });
    document.removeEventListener('pointerdown', unlockAudio, { passive: true });
    document.removeEventListener('click',       unlockAudio);
    document.removeEventListener('keydown',     unlockAudio);
    window.removeEventListener('resize', onResize);
    if (Sound.ctx) {
      try { Sound.ctx.close(); } catch(e) {}
      Sound.ctx = null;
    }
    container.innerHTML = '';
    container.classList.remove('ld-game-host');
  }

  // Initial render (canvas needs to be sized before onReady fires)
  resizeCanvas();

  return { start, quit, setAccent, setSound, setPlayerName, setToken, destroy };
}
