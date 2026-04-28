import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store.js';
import { TILE, MAP_W, MAP_H } from '../engine/dungeon.js';
import { getLevel as getJALevel } from '../engine/levels_ja.js';
import { getLevel as getESLevel } from '../engine/levels.js';
import { render as renderScene, drawTile as drawSingleTile } from '../engine/renderer.js';
import { preloadMouseImages } from '../engine/mouseAssets.js';

// ── constants ─────────────────────────────────────────────────────────────────

const TILE_BG = {
  [TILE.FLOOR]:   '#18182e',
  [TILE.WALL]:    '#06060c',
  [TILE.DOOR_C]:  '#5a2200',
  [TILE.DOOR_O]:  '#06060e',
  [TILE.CHEST_C]: '#5c3418',
  [TILE.CHEST_O]: '#3a1e0a',
  [TILE.STAIRS]:  '#0a1a0a',
  [TILE.RUG]:     '#1c1640',
};

const TILE_LABEL = {
  [TILE.FLOOR]: 'FLOOR', [TILE.WALL]: 'WALL',
  [TILE.DOOR_C]: 'DOOR',  [TILE.DOOR_O]: 'DOOR_O',
  [TILE.CHEST_C]: 'CHEST', [TILE.CHEST_O]: 'CHEST_O',
  [TILE.STAIRS]: 'STAIRS', [TILE.RUG]: 'RUG',
};

const PAINTABLE = [TILE.FLOOR, TILE.WALL, TILE.DOOR_C, TILE.CHEST_C, TILE.STAIRS, TILE.RUG];

const CELL = 28;
const JA_COUNT = 5;
const ES_COUNT = 10;

// ── helpers ───────────────────────────────────────────────────────────────────

function emptyMap() {
  return Array.from({ length: MAP_H }, () => Array(MAP_W).fill(TILE.FLOOR));
}

function emptyChallenge() {
  return {
    display: '', prompt: 'Which is correct?',
    choices: ['', '', '', ''], answer: 0,
    color: '#a0c4ff', hint: '', reward: "''",
    choiceStyle: undefined, imageUrl: '',
  };
}

function emptyNpc(col, row) {
  return { col, row, name: 'NPC', label: 'S', color: '#8888cc', dialogue: ['Hello!'] };
}

function toJs(val, depth = 0) {
  const p = '  '.repeat(depth);
  const n = '  '.repeat(depth + 1);
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'boolean' || typeof val === 'number') return String(val);
  if (typeof val === 'string') return `'${val.replace(/\\/g,'\\\\').replace(/'/g, "\\'")}'`;
  if (Array.isArray(val)) {
    if (!val.length) return '[]';
    if (val.every(v => typeof v === 'number')) return `[${val.join(',')}]`;
    return `[\n${val.map(v => `${n}${toJs(v, depth + 1)}`).join(',\n')}\n${p}]`;
  }
  const entries = Object.entries(val)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `'${k}'`;
      return `${n}${key}: ${toJs(v, depth + 1)}`;
    });
  return entries.length ? `{\n${entries.join(',\n')}\n${p}}` : '{}';
}

function exportLevel(levelId, levelName, language, map, locks, challenges, npcs, playerStart) {
  // Rebuild compact challenges array (only referenced ones, re-indexed)
  const usedIds = new Set(Object.values(locks).map(l => l.challengeId));
  const oldToNew = new Map();
  const newChallenges = [];
  challenges.forEach((ch, i) => {
    if (!usedIds.has(i)) return;
    oldToNew.set(i, newChallenges.length);
    const clean = {
      ...(ch.display ? { display: ch.display } : {}),
      prompt: ch.prompt || 'What is this?',
      choices: ch.choices,
      answer: ch.answer,
      color: ch.color || '#ffffff',
      ...(ch.hint ? { hint: ch.hint } : {}),
      reward: ch.reward || "''",
      ...(ch.choiceStyle ? { choiceStyle: ch.choiceStyle } : {}),
    };
    newChallenges.push(clean);
  });

  const newLocks = Object.fromEntries(
    Object.entries(locks).map(([k, v]) => [k, {
      type: v.type,
      challengeId: oldToNew.get(v.challengeId) ?? 0,
    }])
  );

  const cleanNpcs = npcs.map(({ col, row, name, label, color, dialogue }) =>
    ({ col, row, name, label, color, dialogue })
  );

  const mapLines = map.map(row => `      [${row.join(',')}]`).join(',\n');

  return `  // ─── Level ${levelId}: ${levelName} ───
  {
    id: ${levelId},
    name: '${levelName.replace(/'/g, "\\'")}',
    playerStart: { col: ${playerStart.col}, row: ${playerStart.row} },
    map: [
${mapLines},
    ],
    locks: ${toJs(newLocks, 2)},
    challenges: ${toJs(newChallenges, 2)},
    npcs: ${toJs(cleanNpcs, 2)},
  }`;
}

// ── Tile palette preview ───────────────────────────────────────────────────────

function TilePreview({ tileType, selected, onClick, size = 30, accent = '#0072ff' }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    drawSingleTile(ctx, 0, 0, tileType, { col: 0, row: 1, accent });
  }, [tileType, accent]);
  return (
    <canvas ref={ref} width={32} height={32} title={TILE_LABEL[tileType]} onClick={onClick}
      style={{
        width: size, height: size, display: 'block', imageRendering: 'pixelated',
        border: selected ? '2px solid var(--accent)' : B2,
        borderRadius: 2, cursor: 'pointer', outline: 'none',
      }} />
  );
}

// ── style primitives ──────────────────────────────────────────────────────────

const B = '1px solid rgba(0,114,255,0.18)';
const B2 = '1px solid rgba(0,114,255,0.28)';

function btn(extra = {}) {
  return {
    background: 'none', border: B2, color: '#555',
    padding: '3px 8px', cursor: 'pointer',
    fontFamily: '"Courier New", monospace', fontSize: 10,
    borderRadius: 2, whiteSpace: 'nowrap', ...extra,
  };
}
function accentBtn(extra = {}) {
  return btn({ borderColor: 'var(--accent)', color: 'var(--accent)', ...extra });
}
function inp(extra = {}) {
  return {
    background: '#f0f5ff', border: B2, color: '#111',
    padding: '3px 6px', fontFamily: '"Courier New", monospace',
    fontSize: 10, outline: 'none', borderRadius: 2, ...extra,
  };
}
function lbl(extra = {}) {
  return {
    display: 'block', fontSize: 8, color: '#888',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    marginBottom: 3, ...extra,
  };
}
function fieldWrap(extra = {}) {
  return { marginBottom: 9, ...extra };
}
function sec(extra = {}) {
  return { padding: '10px 12px', borderBottom: B, ...extra };
}
function secHead(txt) {
  return (
    <div style={{ fontSize: 8, color: '#999', textTransform: 'uppercase',
      letterSpacing: '0.14em', marginBottom: 8, paddingBottom: 5, borderBottom: B }}>
      {txt}
    </div>
  );
}
function Field({ label: l, children, style }) {
  return (
    <div style={{ ...fieldWrap(), ...style }}>
      <span style={lbl()}>{l}</span>
      {children}
    </div>
  );
}

// ── Challenge Panel ───────────────────────────────────────────────────────────

function ChallengePanel({ lockKey, lockType, challenge: ch, onUpdate, onRemoveLock, importedImages }) {
  const u = (k, v) => onUpdate({ ...ch, [k]: v });
  const uChoice = (i, v) => { const c = [...ch.choices]; c[i] = v; onUpdate({ ...ch, choices: c }); };

  return (
    <div>
      <div style={sec()}>
        {secHead(`${lockType?.toUpperCase() || 'LOCK'} CHALLENGE`)}
        <div style={{ color: '#aaa', fontSize: 8, marginBottom: 10 }}>tile: {lockKey}</div>

        <Field label="Display char (hiragana / kanji)">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input value={ch.display || ''} onChange={e => u('display', e.target.value)}
              style={inp({ width: 56, fontSize: 22, textAlign: 'center', lineHeight: 1 })}
              placeholder="あ" />
            {ch.display && (
              <span style={{ fontSize: 32, lineHeight: 1,
                fontFamily: '"Noto Sans JP", sans-serif', color: 'var(--accent)', userSelect: 'text' }}>
                {ch.display}
              </span>
            )}
          </div>
        </Field>

        <Field label="Mouse / door accent color">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="color" value={ch.color || '#a0c4ff'}
              onChange={e => u('color', e.target.value)}
              style={{ width: 32, height: 22, padding: 0, border: 'none', cursor: 'pointer', background: 'none' }} />
            <input value={ch.color || ''} onChange={e => u('color', e.target.value)}
              style={inp({ width: 76 })} placeholder="#a0c4ff" />
            <div style={{ width: 20, height: 20, borderRadius: 10, flexShrink: 0,
              background: ch.color || '#a0c4ff', border: B2 }} />
          </div>
        </Field>
      </div>

      <div style={sec()}>
        {secHead('Question')}

        <Field label="Prompt">
          <textarea value={ch.prompt || ''} onChange={e => u('prompt', e.target.value)}
            style={inp({ width: '100%', boxSizing: 'border-box', minHeight: 48,
              resize: 'vertical', lineHeight: 1.5 })}
            placeholder="Which sound is this?" />
        </Field>

        <div style={fieldWrap()}>
          <span style={lbl()}>Choices — ● marks correct answer</span>
          {ch.choices.map((choice, i) => (
            <div key={i} style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 4 }}>
              <input type="radio" name={`ans-${lockKey}`} checked={ch.answer === i}
                onChange={() => u('answer', i)}
                style={{ cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }} />
              <input value={choice} onChange={e => uChoice(i, e.target.value)}
                style={inp({ flex: 1 })} placeholder={`Option ${i + 1}`} />
              {ch.answer === i && (
                <span style={{ color: 'var(--accent)', fontSize: 9, width: 12 }}>✓</span>
              )}
            </div>
          ))}
        </div>

        <Field label="Choice style">
          <div style={{ display: 'flex', gap: 5 }}>
            {['normal', 'hiragana'].map(s => {
              const active = s === 'normal' ? !ch.choiceStyle : ch.choiceStyle === s;
              return (
                <button key={s} onClick={() => u('choiceStyle', s === 'normal' ? undefined : s)}
                  style={btn({
                    background: active ? 'rgba(0,114,255,0.08)' : 'none',
                    borderColor: active ? 'var(--accent)' : '#2a2a48',
                    color: active ? 'var(--accent)' : '#aaa',
                  })}>
                  {s.toUpperCase()}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div style={sec()}>
        {secHead('Feedback')}

        <Field label="Hint (shown after 3 wrong answers)">
          <input value={ch.hint || ''} onChange={e => u('hint', e.target.value)}
            style={inp({ width: '100%', boxSizing: 'border-box' })}
            placeholder="Think about the first vowel..." />
        </Field>

        <Field label="Reward message (on correct)">
          <input value={ch.reward || ''} onChange={e => u('reward', e.target.value)}
            style={inp({ width: '100%', boxSizing: 'border-box' })}
            placeholder="'あ' is 'a'" />
        </Field>
      </div>

      <div style={sec()}>
        {secHead('Display image (optional)')}

        <Field label="Image URL">
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <input value={ch.imageUrl || ''} onChange={e => u('imageUrl', e.target.value)}
              style={inp({ flex: 1 })} placeholder="/mice/red/red_mouse_a.png" />
            {ch.imageUrl && (
              <img src={ch.imageUrl} alt="" style={{ width: 28, height: 28,
                objectFit: 'cover', border: B2, borderRadius: 2 }} />
            )}
          </div>
        </Field>

        {importedImages.length > 0 && (
          <div>
            <span style={lbl()}>From imported images</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {importedImages.map(img => (
                <img key={img.name} src={img.url} alt={img.name} title={img.name}
                  onClick={() => u('imageUrl', img.url)}
                  style={{ width: 28, height: 28, objectFit: 'cover',
                    border: ch.imageUrl === img.url ? '2px solid var(--accent)' : B2,
                    borderRadius: 2, cursor: 'pointer' }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '8px 12px' }}>
        <button onClick={onRemoveLock}
          style={btn({ width: '100%', borderColor: '#5a1818', color: '#cc4444' })}>
          ✕ REMOVE LOCK — revert tile to floor
        </button>
      </div>
    </div>
  );
}

// ── NPC Panel ─────────────────────────────────────────────────────────────────

function NpcPanel({ npc, onUpdate, onDelete }) {
  const u = (k, v) => onUpdate({ ...npc, [k]: v });
  const uLine = (i, v) => { const d = [...npc.dialogue]; d[i] = v; u('dialogue', d); };
  const addLine = () => u('dialogue', [...npc.dialogue, '...']);
  const delLine = (i) => u('dialogue', npc.dialogue.filter((_, j) => j !== i));
  const moveLine = (i, dir) => {
    const d = [...npc.dialogue]; const j = i + dir;
    if (j < 0 || j >= d.length) return;
    [d[i], d[j]] = [d[j], d[i]]; u('dialogue', d);
  };

  return (
    <div>
      <div style={sec()}>
        {secHead('NPC')}
        <div style={{ color: '#888', fontSize: 8, marginBottom: 10 }}>
          position: ({npc.col}, {npc.row})
        </div>

        <Field label="Name">
          <input value={npc.name} onChange={e => u('name', e.target.value)}
            style={inp({ width: '100%', boxSizing: 'border-box' })} />
        </Field>

        <Field label="Type">
          <div style={{ display: 'flex', gap: 5 }}>
            {[['S', 'Sage'], ['G', 'Guard'], ['?', 'Stranger']].map(([val, lab]) => (
              <button key={val} onClick={() => u('label', val)}
                style={btn({
                  flex: 1,
                  background: npc.label === val ? 'rgba(0,114,255,0.08)' : 'none',
                  borderColor: npc.label === val ? 'var(--accent)' : 'rgba(0,114,255,0.28)',
                  color: npc.label === val ? 'var(--accent)' : '#999',
                })}>
                {val} {lab}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Robe / sprite color">
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="color" value={npc.color} onChange={e => u('color', e.target.value)}
              style={{ width: 32, height: 22, padding: 0, border: 'none', cursor: 'pointer', background: 'none' }} />
            <input value={npc.color} onChange={e => u('color', e.target.value)}
              style={inp({ width: 76 })} />
            <div style={{ width: 20, height: 20, borderRadius: 10,
              background: npc.color, border: B2, flexShrink: 0 }} />
          </div>
        </Field>
      </div>

      <div style={sec()}>
        {secHead('Dialogue Tree')}
        <div style={{ color: '#999', fontSize: 8, marginBottom: 8 }}>
          Lines play in order. Player presses Next/Close to advance.
        </div>

        {npc.dialogue.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
            <div style={{ color: '#bbb', fontSize: 8, paddingTop: 6,
              width: 14, textAlign: 'right', flexShrink: 0, fontWeight: 'bold' }}>
              {i + 1}
            </div>
            <textarea value={line} onChange={e => uLine(i, e.target.value)}
              rows={2}
              style={inp({ flex: 1, resize: 'vertical', minHeight: 34, lineHeight: 1.5 })} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => moveLine(i, -1)} disabled={i === 0}
                style={btn({ padding: '1px 5px', fontSize: 9, opacity: i === 0 ? 0.3 : 1 })}>▲</button>
              <button onClick={() => moveLine(i, 1)} disabled={i === npc.dialogue.length - 1}
                style={btn({ padding: '1px 5px', fontSize: 9, opacity: i === npc.dialogue.length - 1 ? 0.3 : 1 })}>▼</button>
              <button onClick={() => delLine(i)}
                style={btn({ padding: '1px 5px', fontSize: 9, color: '#aa3333', borderColor: '#4a1a1a' })}>✕</button>
            </div>
          </div>
        ))}

        <button onClick={addLine} style={accentBtn({ width: '100%', marginTop: 4 })}>
          + ADD LINE
        </button>
      </div>

      <div style={{ padding: '8px 12px' }}>
        <button onClick={onDelete}
          style={btn({ width: '100%', borderColor: '#5a1818', color: '#cc4444' })}>
          ✕ DELETE NPC
        </button>
      </div>
    </div>
  );
}

// ── Properties Panel ──────────────────────────────────────────────────────────

function PropertiesPanel({ levelId, levelName, language, playerStart,
  onLevelId, onLevelName, onLanguage, map, locks, npcs, challenges }) {
  const doors = Object.values(locks).filter(l => l.type === 'door').length;
  const chests = Object.values(locks).filter(l => l.type === 'chest').length;

  return (
    <div>
      <div style={sec()}>
        {secHead('Level Properties')}

        <Field label="Level ID">
          <input type="number" min={1} max={99} value={levelId}
            onChange={e => onLevelId(Number(e.target.value))}
            style={inp({ width: 56 })} />
        </Field>

        <Field label="Level Name">
          <input value={levelName} onChange={e => onLevelName(e.target.value)}
            style={inp({ width: '100%', boxSizing: 'border-box' })} />
        </Field>

        <Field label="Language">
          <div style={{ display: 'flex', gap: 5 }}>
            {['ja', 'es'].map(l => (
              <button key={l} onClick={() => onLanguage(l)}
                style={btn({
                  background: language === l ? 'rgba(0,114,255,0.08)' : 'none',
                  borderColor: language === l ? 'var(--accent)' : 'rgba(0,114,255,0.28)',
                  color: language === l ? 'var(--accent)' : '#999',
                  textTransform: 'uppercase', width: 48,
                })}>
                {l}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div style={sec()}>
        {secHead('Main Character')}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 20, color: '#22ee66' }}>▶</span>
          <div style={{ fontFamily: '"Courier New", monospace', fontSize: 10 }}>
            <span style={{ color: '#aaa' }}>col </span>
            <span style={{ color: 'var(--accent)' }}>{playerStart.col}</span>
            <span style={{ color: '#aaa' }}>  row </span>
            <span style={{ color: 'var(--accent)' }}>{playerStart.row}</span>
          </div>
        </div>
        <div style={{ fontSize: 8, color: '#aaa' }}>
          Switch to PLAYER START tool and click any walkable tile to relocate.
        </div>
      </div>

      <div style={sec()}>
        {secHead('Level Stats')}
        {[
          ['Doors',     doors],
          ['Chests',    chests],
          ['NPCs',      npcs.length],
          ['Challenges',challenges.length],
          ['Map tiles', MAP_W + '×' + MAP_H],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
            fontSize: 10, color: '#aaa', marginBottom: 4 }}>
            <span>{k}</span>
            <span style={{ color: '#555' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={sec()}>
        {secHead('Tile Legend')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
          {PAINTABLE.map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, background: TILE_BG[t],
                border: B2, borderRadius: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 8, color: '#aaa' }}>{TILE_LABEL[t]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main editor ───────────────────────────────────────────────────────────────

export default function LevelEditorPage() {
  const { setScreen } = useStore();

  const [tool,            setTool]            = useState('PAINT');
  const [selectedTile,    setSelectedTile]    = useState(TILE.WALL);
  const [map,             setMap]             = useState(emptyMap);
  const [locks,           setLocks]           = useState({});
  const [challenges,      setChallenges]      = useState([]);
  const [npcs,            setNpcs]            = useState([]);
  const [playerStart,     setPlayerStart]     = useState({ col: 1, row: 1 });
  const [levelName,       setLevelName]       = useState('New Level');
  const [levelId,         setLevelId]         = useState(6);
  const [language,        setLanguage]        = useState('ja');
  const [selectedLockKey, setSelectedLockKey] = useState(null);
  const [selectedNpcIdx,  setSelectedNpcIdx]  = useState(null);
  const [importedImages,  setImportedImages]  = useState([]);
  const [showImages,      setShowImages]      = useState(false);
  const [hoveredCell,     setHoveredCell]     = useState(null);
  const [toast,           setToast]           = useState(null);
  const [uiAssets,        setUiAssets]        = useState([]);
  const [assetCat,        setAssetCat]        = useState('environment');

  const isDragging = useRef(false);
  const fileInputRef = useRef(null);

  // Load UI asset manifest
  useEffect(() => {
    fetch('/ui_assets/manifest.json')
      .then(r => r.json())
      .then(data => setUiAssets(data.assets || []))
      .catch(() => {});
  }, []);

  const mapCanvasRef = useRef(null);

  function getCellCoords(e) {
    const canvas = mapCanvasRef.current;
    if (!canvas) return { col: 0, row: 0 };
    const rect = canvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) * (MAP_W * 32 / rect.width) / 32);
    const row = Math.floor((e.clientY - rect.top) * (MAP_H * 32 / rect.height) / 32);
    return {
      col: Math.max(0, Math.min(MAP_W - 1, col)),
      row: Math.max(0, Math.min(MAP_H - 1, row)),
    };
  }

  // Canvas render
  useEffect(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0072ff';

    if (language === 'ja') preloadMouseImages(challenges);

    renderScene(ctx, { grid: map, player: playerStart, exitOpen: false, particles: [], npcs, language, locks, challenges }, accent, 0);

    const T = 32;

    // Hover highlight
    if (hoveredCell) {
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(hoveredCell.col * T, hoveredCell.row * T, T, T);
    }

    // Selection outlines
    if (selectedLockKey) {
      const [sc, sr] = selectedLockKey.split(',').map(Number);
      ctx.strokeStyle = accent || '#0072ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(sc * T + 1, sr * T + 1, T - 2, T - 2);
    }
    if (selectedNpcIdx !== null && npcs[selectedNpcIdx]) {
      const n = npcs[selectedNpcIdx];
      ctx.strokeStyle = accent || '#0072ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(n.col * T + 1, n.row * T + 1, T - 2, T - 2);
    }
  }, [map, playerStart, npcs, locks, challenges, language, hoveredCell, selectedLockKey, selectedNpcIdx]);

  const panelMode = selectedLockKey ? 'challenge'
    : selectedNpcIdx !== null ? 'npc'
    : 'properties';

  const challengeForLock = selectedLockKey && locks[selectedLockKey]
    ? challenges[locks[selectedLockKey].challengeId] ?? null
    : null;

  // ── Level load ──────────────────────────────────────────────────────────────

  function loadLevel(num, lang) {
    try {
      const data = lang === 'ja' ? getJALevel(num) : getESLevel(num);
      if (!data) { flash('Level not found', true); return; }
      setMap(data.map.map(r => [...r]));
      setLocks({ ...data.locks });
      setChallenges([...(data.challenges || [])]);
      setNpcs([...(data.npcs || [])]);
      setPlayerStart({ ...data.playerStart });
      setLevelName(data.name);
      setLevelId(data.id);
      setLanguage(lang);
      setSelectedLockKey(null);
      setSelectedNpcIdx(null);
      flash('Loaded: ' + data.name);
    } catch (e) {
      flash('Load failed', true);
    }
  }

  function flash(msg, err = false) {
    setToast({ msg, err });
    setTimeout(() => setToast(null), 2200);
  }

  // ── Tool application ────────────────────────────────────────────────────────

  function applyTool(col, row) {
    const key = `${col},${row}`;

    if (tool === 'ERASE') {
      setMap(m => { const n = m.map(r => [...r]); n[row][col] = TILE.FLOOR; return n; });
      if (locks[key]) {
        setLocks(l => { const n = { ...l }; delete n[key]; return n; });
        if (selectedLockKey === key) setSelectedLockKey(null);
      }
      const ni = npcs.findIndex(n => n.col === col && n.row === row);
      if (ni >= 0) {
        setNpcs(ns => ns.filter((_, i) => i !== ni));
        if (selectedNpcIdx === ni) setSelectedNpcIdx(null);
      }
      return;
    }

    if (tool === 'PAINT') {
      const t = selectedTile;
      setMap(m => { const n = m.map(r => [...r]); n[row][col] = t; return n; });
      if ((t === TILE.DOOR_C || t === TILE.CHEST_C) && !locks[key]) {
        const newId = challenges.length;
        setChallenges(cs => [...cs, emptyChallenge()]);
        setLocks(l => ({ ...l, [key]: { type: t === TILE.DOOR_C ? 'door' : 'chest', challengeId: newId } }));
      }
      // Remove lock if painting over with non-lock tile
      if (t !== TILE.DOOR_C && t !== TILE.CHEST_C && locks[key]) {
        setLocks(l => { const n = { ...l }; delete n[key]; return n; });
        if (selectedLockKey === key) setSelectedLockKey(null);
      }
      return;
    }

    if (tool === 'PLAYER') {
      setPlayerStart({ col, row });
      return;
    }

    if (tool === 'NPC') {
      if (map[row][col] === TILE.WALL) return;
      const existing = npcs.findIndex(n => n.col === col && n.row === row);
      if (existing >= 0) {
        setSelectedNpcIdx(existing);
        setSelectedLockKey(null);
      } else {
        const idx = npcs.length;
        setNpcs(ns => [...ns, emptyNpc(col, row)]);
        setSelectedNpcIdx(idx);
        setSelectedLockKey(null);
      }
      return;
    }

    if (tool === 'SELECT') {
      if (locks[key]) { setSelectedLockKey(key); setSelectedNpcIdx(null); return; }
      const ni = npcs.findIndex(n => n.col === col && n.row === row);
      if (ni >= 0) { setSelectedNpcIdx(ni); setSelectedLockKey(null); return; }
      setSelectedLockKey(null);
      setSelectedNpcIdx(null);
    }
  }

  // ── Challenge & NPC updates ─────────────────────────────────────────────────

  function updateChallenge(lockKey, ch) {
    const lk = locks[lockKey];
    if (!lk) return;
    setChallenges(cs => { const n = [...cs]; n[lk.challengeId] = ch; return n; });
  }

  function removeLock(lockKey) {
    const [c, r] = lockKey.split(',').map(Number);
    setMap(m => { const n = m.map(row => [...row]); n[r][c] = TILE.FLOOR; return n; });
    setLocks(l => { const n = { ...l }; delete n[lockKey]; return n; });
    setSelectedLockKey(null);
  }

  function updateNpc(idx, npc) {
    setNpcs(ns => ns.map((n, i) => i === idx ? npc : n));
  }

  function deleteNpc(idx) {
    setNpcs(ns => ns.filter((_, i) => i !== idx));
    setSelectedNpcIdx(null);
  }

  // ── Export ──────────────────────────────────────────────────────────────────

  function doExport(asJson) {
    if (asJson) {
      const obj = { id: levelId, name: levelName, playerStart, map, locks, challenges, npcs };
      navigator.clipboard.writeText(JSON.stringify(obj, null, 2))
        .then(() => flash('JSON copied!'));
    } else {
      const js = exportLevel(levelId, levelName, language, map, locks, challenges, npcs, playerStart);
      navigator.clipboard.writeText(js).then(() => flash('JS copied!'));
    }
  }

  // ── Image import ────────────────────────────────────────────────────────────

  function trimAndScale(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
          const tmp = document.createElement('canvas');
          tmp.width = img.width; tmp.height = img.height;
          const ctx = tmp.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const px = ctx.getImageData(0, 0, img.width, img.height).data;
          let x0 = img.width, y0 = img.height, x1 = 0, y1 = 0;
          for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
              if (px[(y * img.width + x) * 4 + 3] > 8) {
                if (x < x0) x0 = x; if (y < y0) y0 = y;
                if (x > x1) x1 = x; if (y > y1) y1 = y;
              }
            }
          }
          const out = document.createElement('canvas');
          out.width = 32; out.height = 32;
          const outCtx = out.getContext('2d');
          if (x0 <= x1 && y0 <= y1) {
            outCtx.drawImage(tmp, x0, y0, x1 - x0 + 1, y1 - y0 + 1, 0, 0, 32, 32);
          } else {
            outCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 32, 32);
          }
          resolve({ name: file.name, url: out.toDataURL('image/png') });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(e) {
    const results = await Promise.all(Array.from(e.target.files || []).map(trimAndScale));
    setImportedImages(imgs => {
      const names = new Set(imgs.map(i => i.name));
      return [...imgs, ...results.filter(r => !names.has(r.name))];
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  // Build level picker options
  const levelOptions = [];
  for (let i = 1; i <= JA_COUNT; i++) {
    try { const d = getJALevel(i); if (d) levelOptions.push({ lang: 'ja', num: i, name: d.name }); }
    catch {}
  }
  for (let i = 1; i <= ES_COUNT; i++) {
    try { const d = getESLevel(i); if (d) levelOptions.push({ lang: 'es', num: i, name: d.name }); }
    catch {}
  }

  const cursorMap = {
    PAINT: 'crosshair', ERASE: 'cell', PLAYER: 'copy', NPC: 'pointer', SELECT: 'default'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', flexDirection: 'column',
      background: '#f5f8ff', color: '#333',
      fontFamily: '"Courier New", "Courier", monospace', fontSize: 11,
      overflow: 'hidden',
      zIndex: 0,
    }}>

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', background: '#fff',
        borderBottom: '2px solid var(--accent, #0072ff)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        <button onClick={() => setScreen('menu')}
          style={btn({ color: '#aaa', borderColor: 'rgba(0,114,255,0.18)', padding: '3px 10px' })}>
          ← MENU
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(0,114,255,0.15)' }} />

        <input value={levelName} onChange={e => setLevelName(e.target.value)}
          style={{
            background: 'none', border: 'none', borderBottom: '1px solid rgba(0,114,255,0.35)',
            color: 'var(--accent)', fontSize: 13, fontFamily: '"Courier New", monospace',
            fontWeight: 'bold', outline: 'none', width: 220, padding: '2px 4px',
          }}
          placeholder="Level name…" />

        <div style={{ width: 1, height: 20, background: 'rgba(0,114,255,0.15)' }} />

        <select defaultValue=""
          onChange={e => {
            if (!e.target.value) return;
            const [lang, num] = e.target.value.split('-');
            loadLevel(Number(num), lang);
            e.target.value = '';
          }}
          style={inp({ cursor: 'pointer' })}>
          <option value="">Load existing level…</option>
          {levelOptions.map(l => (
            <option key={`${l.lang}-${l.num}`} value={`${l.lang}-${l.num}`}>
              {l.lang.toUpperCase()} {l.num}: {l.name}
            </option>
          ))}
        </select>

        <button onClick={() => {
          setMap(emptyMap()); setLocks({}); setChallenges([]); setNpcs([]);
          setPlayerStart({ col: 1, row: 1 }); setLevelName('New Level');
          setSelectedLockKey(null); setSelectedNpcIdx(null);
          flash('New level');
        }} style={btn()}>NEW</button>

        <div style={{ flex: 1 }} />

        {hoveredCell && (
          <span style={{ color: '#bbb', fontSize: 9 }}>
            ({hoveredCell.col}, {hoveredCell.row}) {TILE_LABEL[map[hoveredCell.row]?.[hoveredCell.col]] || ''}
          </span>
        )}

        <button onClick={() => doExport(false)} style={accentBtn({ padding: '3px 12px' })}>
          EXPORT JS
        </button>
        <button onClick={() => doExport(true)} style={btn()}>
          COPY JSON
        </button>
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left sidebar ── */}
        <div style={{
          width: 148, flexShrink: 0, background: '#fff',
          borderRight: B, padding: '8px 6px',
          overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10,
        }}>

          {/* Tools */}
          <div>
            <div style={lbl()}>Tools</div>
            {[
              ['PAINT',  '✏', 'Paint tiles'],
              ['ERASE',  '◻', 'Erase to floor'],
              ['PLAYER', '▶', 'Set player start'],
              ['NPC',    '◉', 'Place NPC'],
              ['SELECT', '⊹', 'Select & edit'],
            ].map(([t, icon, tip]) => (
              <button key={t} onClick={() => setTool(t)} title={tip}
                style={btn({
                  display: 'flex', alignItems: 'center', gap: 6,
                  width: '100%', marginBottom: 3, textAlign: 'left',
                  background: tool === t ? 'rgba(0,114,255,0.08)' : 'none',
                  borderColor: tool === t ? 'var(--accent)' : 'rgba(0,114,255,0.18)',
                  color: tool === t ? 'var(--accent)' : '#888',
                })}>
                <span style={{ fontSize: 13, width: 14, textAlign: 'center' }}>{icon}</span>
                <span>{t}</span>
              </button>
            ))}
          </div>

          {/* Tile palette — only shown when PAINT active */}
          {tool === 'PAINT' && (
            <div>
              <div style={lbl()}>Tile type</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3, marginBottom: 4 }}>
                {PAINTABLE.map(t => (
                  <TilePreview key={t} tileType={t} selected={selectedTile === t}
                    onClick={() => setSelectedTile(t)} size={40} />
                ))}
              </div>
              <div style={{ fontSize: 8, color: '#aaa' }}>{TILE_LABEL[selectedTile]}</div>
            </div>
          )}

          {/* UI Asset Gallery */}
          <div>
            <div style={lbl()}>Assets</div>

            {/* Category tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 5 }}>
              {['environment', 'critters', 'enemies', 'items', 'ui'].map(cat => (
                <button key={cat} onClick={() => setAssetCat(cat)}
                  style={btn({
                    padding: '2px 5px', fontSize: 7, textTransform: 'uppercase',
                    background: assetCat === cat ? 'rgba(0,114,255,0.08)' : 'none',
                    borderColor: assetCat === cat ? 'var(--accent)' : 'rgba(0,114,255,0.18)',
                    color: assetCat === cat ? 'var(--accent)' : '#888',
                  })}>
                  {cat.slice(0, 3)}
                </button>
              ))}
            </div>

            {/* Asset thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {uiAssets
                .filter(a => a.category === assetCat && a.url.endsWith('.png'))
                .map(a => {
                  const alreadyAdded = importedImages.some(i => i.url === a.url);
                  return (
                    <img key={a.id} src={a.url} alt={a.name} title={a.name}
                      style={{
                        width: '100%', aspectRatio: '1/1', objectFit: 'contain',
                        cursor: 'pointer', borderRadius: 2, background: '#edf1f8',
                        border: alreadyAdded ? '2px solid var(--accent)' : B2,
                        boxSizing: 'border-box',
                      }}
                      onClick={() => {
                        if (!alreadyAdded) {
                          setImportedImages(imgs => [...imgs, { name: a.name, url: a.url }]);
                          flash(a.name);
                        }
                      }} />
                  );
                })}
              {uiAssets.filter(a => a.category === assetCat && a.url.endsWith('.png')).length === 0 && (
                <div style={{ gridColumn: '1/-1', fontSize: 8, color: '#ccc',
                  textAlign: 'center', padding: '8px 0' }}>
                  {uiAssets.length === 0 ? 'loading…' : 'none'}
                </div>
              )}
            </div>

            {/* Custom file import */}
            <div style={{ marginTop: 6 }}>
              <input ref={fileInputRef} type="file" multiple
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleFiles} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()}
                style={btn({ width: '100%', fontSize: 8, padding: '3px 6px' })}>
                + import file
              </button>
            </div>

            {/* Currently added images */}
            {importedImages.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <button onClick={() => setShowImages(s => !s)}
                  style={btn({ width: '100%', textAlign: 'left', padding: '2px 6px', fontSize: 8 })}>
                  {showImages ? '▾' : '▸'} added ({importedImages.length})
                </button>
                {showImages && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
                    {importedImages.map((img, i) => (
                      <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center',
                        border: B, borderRadius: 2, padding: '2px 4px',
                        cursor: 'pointer', background: '#f0f5ff' }}
                        title={img.name}
                        onClick={() => navigator.clipboard.writeText(img.url).then(() => flash('URL copied'))}>
                        <img src={img.url} alt="" style={{ width: 20, height: 20,
                          objectFit: 'contain', flexShrink: 0, borderRadius: 1, background: '#edf1f8' }} />
                        <span style={{ fontSize: 7, color: '#aaa', overflow: 'hidden',
                          textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {img.name}
                        </span>
                        <button onClick={e => { e.stopPropagation(); setImportedImages(imgs => imgs.filter((_, j) => j !== i)); }}
                          style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer',
                            fontSize: 10, padding: 0, lineHeight: 1 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Map canvas ── */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#edf1f8', overflow: 'auto', padding: 20,
        }}>
          <div>
            {/* Coordinate ruler top */}
            <div style={{
              display: 'grid', gridTemplateColumns: `repeat(${MAP_W}, 32px)`,
              marginBottom: 2,
            }}>
              {Array.from({ length: MAP_W }, (_, c) => (
                <div key={c} style={{ textAlign: 'center', fontSize: 7, color: '#b0bcd8',
                  fontFamily: '"Courier New", monospace' }}>{c}</div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 2 }}>
              {/* Row numbers */}
              <div style={{ display: 'flex', flexDirection: 'column',
                justifyContent: 'space-around', marginRight: 2 }}>
                {Array.from({ length: MAP_H }, (_, r) => (
                  <div key={r} style={{ height: 32, display: 'flex', alignItems: 'center',
                    justifyContent: 'flex-end', fontSize: 7, color: '#b0bcd8', width: 14 }}>
                    {r}
                  </div>
                ))}
              </div>

              {/* Canvas map */}
              <canvas
                ref={mapCanvasRef}
                width={MAP_W * 32}
                height={MAP_H * 32}
                style={{
                  display: 'block',
                  imageRendering: 'pixelated',
                  cursor: cursorMap[tool] || 'default',
                  border: '1px solid rgba(0,114,255,0.25)',
                  boxShadow: '0 4px 24px rgba(0,114,255,0.12)',
                }}
                onMouseDown={e => { isDragging.current = true; applyTool(...Object.values(getCellCoords(e))); }}
                onMouseUp={() => { isDragging.current = false; }}
                onMouseMove={e => {
                  const { col, row } = getCellCoords(e);
                  setHoveredCell({ col, row });
                  if (isDragging.current && (tool === 'PAINT' || tool === 'ERASE')) applyTool(col, row);
                }}
                onMouseLeave={() => { isDragging.current = false; setHoveredCell(null); }}
              />
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{
          width: 276, flexShrink: 0, background: '#fff',
          borderLeft: B, overflowY: 'auto', fontSize: 10,
        }}>
          {/* Panel header */}
          <div style={{
            padding: '6px 12px', borderBottom: B, display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            background: '#f5f8ff',
          }}>
            <span style={{ fontSize: 9, color: '#aaa', textTransform: 'uppercase',
              letterSpacing: '0.1em' }}>
              {panelMode === 'challenge' ? `${locks[selectedLockKey]?.type?.toUpperCase() || 'LOCK'} @ ${selectedLockKey}`
                : panelMode === 'npc' ? `NPC @ ${npcs[selectedNpcIdx]?.col},${npcs[selectedNpcIdx]?.row}`
                : 'LEVEL PROPERTIES'}
            </span>
            {(selectedLockKey || selectedNpcIdx !== null) && (
              <button onClick={() => { setSelectedLockKey(null); setSelectedNpcIdx(null); }}
                style={btn({ padding: '1px 6px', fontSize: 9 })}>✕</button>
            )}
          </div>

          {panelMode === 'challenge' && challengeForLock && (
            <ChallengePanel
              lockKey={selectedLockKey}
              lockType={locks[selectedLockKey]?.type}
              challenge={challengeForLock}
              onUpdate={ch => updateChallenge(selectedLockKey, ch)}
              onRemoveLock={() => removeLock(selectedLockKey)}
              importedImages={importedImages}
            />
          )}

          {panelMode === 'npc' && npcs[selectedNpcIdx] && (
            <NpcPanel
              npc={npcs[selectedNpcIdx]}
              onUpdate={npc => updateNpc(selectedNpcIdx, npc)}
              onDelete={() => deleteNpc(selectedNpcIdx)}
            />
          )}

          {panelMode === 'properties' && (
            <PropertiesPanel
              levelId={levelId}
              levelName={levelName}
              language={language}
              playerStart={playerStart}
              onLevelId={setLevelId}
              onLevelName={setLevelName}
              onLanguage={setLanguage}
              map={map}
              locks={locks}
              npcs={npcs}
              challenges={challenges}
            />
          )}
        </div>
      </div>

      {/* ── Status bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '2px 10px', background: '#fff', borderTop: B,
        flexShrink: 0, fontSize: 8, color: '#bbb',
      }}>
        <span>TOOL: <span style={{ color: 'var(--accent)' }}>{tool}</span></span>
        {tool === 'PAINT' && <span>TILE: <span style={{ color: 'var(--accent)' }}>{TILE_LABEL[selectedTile]}</span></span>}
        <span>LOCKS: <span style={{ color: 'var(--accent)' }}>{Object.keys(locks).length}</span></span>
        <span>NPC: <span style={{ color: 'var(--accent)' }}>{npcs.length}</span></span>
        <span>LANG: <span style={{ color: 'var(--accent)' }}>{language.toUpperCase()}</span></span>
        <span style={{ flex: 1 }} />
        <span>LINGO PKMN · LEVEL EDITOR</span>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 36, left: '50%', transform: 'translateX(-50%)',
          background: toast.err ? '#fff5f5' : '#f5fff8',
          border: `1px solid ${toast.err ? '#cc2222' : '#22aa44'}`,
          color: toast.err ? '#ff5555' : '#44cc66',
          padding: '5px 16px', borderRadius: 3, fontSize: 11,
          fontFamily: '"Courier New", monospace', zIndex: 9999, pointerEvents: 'none',
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
