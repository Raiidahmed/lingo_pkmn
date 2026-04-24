import { TILE, MAP_W, MAP_H } from './dungeon.js';

const T = 32;

// Deterministic tile variation hash
function tvar(col, row) {
  return (((col * 73856093) ^ (row * 19349663)) * 2654435761 >>> 0) / 4294967296;
}

// ─── Tile drawers ─────────────────────────────────────────────────────────────

function drawFloor(ctx, x, y, col, row) {
  const alt = (col + row) % 2 === 0;
  ctx.fillStyle = alt ? '#18182e' : '#141428';
  ctx.fillRect(x, y, T, T);

  // Stone seams
  ctx.fillStyle = '#0e0e1e';
  ctx.fillRect(x, y + T / 2, T, 1);
  const off = (row % 2 === 0) ? 0 : T / 2;
  ctx.fillRect(x + off, y, 1, T / 2);
  ctx.fillRect(x + (off + T / 2) % T, y + T / 2, 1, T / 2);

  // Occasional crack
  const r = tvar(col, row);
  if (r > 0.78) {
    ctx.strokeStyle = '#202038';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    const cx = x + 6 + r * 14;
    ctx.moveTo(cx, y + 8); ctx.lineTo(cx - 3, y + 16); ctx.lineTo(cx + 2, y + 22);
    ctx.stroke();
  }
}

function drawWall(ctx, x, y, col, row) {
  ctx.fillStyle = '#08080e';
  ctx.fillRect(x, y, T, T);

  const stag = (col % 2 === 0) ? 0 : T / 4;
  ctx.fillStyle = '#0e0e1c';
  ctx.fillRect(x + 1, y + 1, T - 2, T / 2 - 1);
  ctx.fillRect(x + 1, y + T / 2, T - 2, T / 2 - 1);

  // Mortar
  ctx.fillStyle = '#050510';
  ctx.fillRect(x, y + T / 2 - 1, T, 2);
  ctx.fillRect(x + stag, y, 1, T / 2 - 1);
  ctx.fillRect(x + (stag + T / 2) % T, y + T / 2, 1, T / 2 - 1);

  // 3D bevel
  ctx.fillStyle = '#16162a';
  ctx.fillRect(x, y, T, 1);
  ctx.fillRect(x, y, 1, T);
  ctx.fillStyle = '#020206';
  ctx.fillRect(x, y + T - 1, T, 1);
  ctx.fillRect(x + T - 1, y, 1, T);
}

function drawDoorClosed(ctx, x, y, accent) {
  ctx.fillStyle = '#0c0c1a';
  ctx.fillRect(x, y, T, T);

  // Stone frame
  ctx.fillStyle = '#181828';
  ctx.fillRect(x + 1, y, 3, T);
  ctx.fillRect(x + T - 4, y, 3, T);
  ctx.fillRect(x + 1, y, T - 2, 3);

  // Wood planks
  ctx.fillStyle = '#3e2812';
  ctx.fillRect(x + 4, y + 3, T - 8, T - 3);
  ctx.fillStyle = '#2c1c0a';
  for (let py = y + 4; py < y + T; py += 9) ctx.fillRect(x + 4, py, T - 8, 1);
  ctx.fillStyle = '#4a3018';
  ctx.fillRect(x + 8,  y + 5,  2, 8);
  ctx.fillRect(x + 19, y + 14, 2, 8);
  ctx.fillRect(x + 11, y + 23, 2, 5);

  // Metal bands
  ctx.fillStyle = '#606070';
  ctx.fillRect(x + 4, y + 11, T - 8, 3);
  ctx.fillRect(x + 4, y + 20, T - 8, 3);
  ctx.fillStyle = '#8888a0';
  ctx.fillRect(x + 5,     y + 12, 2, 2);
  ctx.fillRect(x + T - 7, y + 12, 2, 2);
  ctx.fillRect(x + 5,     y + 21, 2, 2);
  ctx.fillRect(x + T - 7, y + 21, 2, 2);

  // Lock
  ctx.fillStyle = '#9090a8';
  ctx.fillRect(x + 12, y + 14, 8, 6);
  ctx.fillStyle = '#0c0c1a';
  ctx.fillRect(x + 14, y + 15, 4, 5);
  ctx.fillStyle = '#9090a8';
  ctx.fillRect(x + 15, y + 17, 2, 3);

  // Accent glow border
  ctx.strokeStyle = accent + 'cc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 1.5, y + 1.5, T - 3, T - 3);
}

function drawDoorOpen(ctx, x, y) {
  ctx.fillStyle = '#060610';
  ctx.fillRect(x, y, T, T);

  ctx.fillStyle = '#0e0e1c';
  ctx.fillRect(x, y, 3, T);
  ctx.fillRect(x + T - 3, y, 3, T);
  ctx.fillRect(x, y, T, 3);

  ctx.fillStyle = '#09091a';
  ctx.fillRect(x + 3, y + 3, T - 6, T - 3);
  ctx.fillStyle = '#030308';
  ctx.fillRect(x + 3, y + 3, T - 6, 3);
  ctx.fillRect(x + 3, y + 3, 3, T - 3);
}

function drawChestClosed(ctx, x, y, accent) {
  drawFloor(ctx, x, y, 0, 0);

  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(x + 5, y + 26, T - 10, 4);

  ctx.fillStyle = '#5c3418';
  ctx.fillRect(x + 4, y + 17, T - 8, 10);

  ctx.fillStyle = '#6e4020';
  ctx.fillRect(x + 4, y + 13, T - 8, 5);
  ctx.fillStyle = '#7e4e28';
  ctx.fillRect(x + 5, y + 12, T - 10, 3);
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(x + 6, y + 11, T - 12, 2);

  ctx.fillStyle = '#3a2010';
  ctx.fillRect(x + 4, y + 17, T - 8, 1);

  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x + 4, y + 18, T - 8, 2);
  ctx.fillRect(x + 4, y + 23, T - 8, 2);
  ctx.fillRect(x + 14, y + 12, 2, 15);

  ctx.fillStyle = '#d4b030';
  ctx.fillRect(x + 11, y + 16, 10, 5);
  ctx.fillStyle = '#5c3418';
  ctx.fillRect(x + 13, y + 17, 6, 4);
  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x + 14, y + 18, 4, 2);

  ctx.fillStyle = '#d4b030';
  for (const [sx, sy] of [[5,12],[T-7,12],[5,23],[T-7,23]]) {
    ctx.fillRect(x + sx, y + sy, 2, 2);
  }

  ctx.strokeStyle = '#c8a02066';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3.5, y + 10.5, T - 7, 17);
}

function drawChestOpen(ctx, x, y) {
  drawFloor(ctx, x, y, 0, 0);

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 5, y + 27, T - 10, 3);

  ctx.fillStyle = '#5c3418';
  ctx.fillRect(x + 4, y + 19, T - 8, 9);

  ctx.fillStyle = '#6e4020';
  ctx.fillRect(x + 4, y + 10, T - 8, 6);
  ctx.fillStyle = '#4a2c14';
  ctx.fillRect(x + 5, y + 9, T - 10, 3);

  ctx.fillStyle = '#1a0c04';
  ctx.fillRect(x + 5, y + 20, T - 10, 7);

  ctx.fillStyle = '#ffd700';
  ctx.fillRect(x + 9,  y + 22, 2, 2);
  ctx.fillRect(x + 16, y + 21, 2, 2);
  ctx.fillRect(x + 21, y + 23, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 12, y + 21, 1, 1);
  ctx.fillRect(x + 19, y + 24, 1, 1);

  ctx.fillStyle = '#c8a020';
  ctx.fillRect(x + 4, y + 19, T - 8, 2);
  ctx.fillRect(x + 14, y + 10, 2, 14);
}

function drawStairs(ctx, x, y, exitOpen) {
  ctx.fillStyle = exitOpen ? '#1a2e1a' : '#10101e';
  ctx.fillRect(x, y, T, T);

  const step   = exitOpen ? '#2e4e2e' : '#1c1c30';
  const lite   = exitOpen ? '#3a6a3a' : '#242438';
  const shade  = exitOpen ? '#162616' : '#0a0a16';

  for (const [sx, sy, sw] of [
    [x + 4, y + 22, 24],
    [x + 7, y + 17, 18],
    [x + 10, y + 12, 12],
    [x + 13, y + 7,  6],
  ]) {
    ctx.fillStyle = step;  ctx.fillRect(sx, sy,     sw, 4);
    ctx.fillStyle = lite;  ctx.fillRect(sx, sy,     sw, 1);
    ctx.fillStyle = shade; ctx.fillRect(sx, sy + 3, sw, 1);
  }

  if (exitOpen) {
    ctx.strokeStyle = '#44cc6644';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 2, y + 2, T - 4, T - 4);
  } else {
    ctx.strokeStyle = 'rgba(180,40,40,0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 6, y + 6); ctx.lineTo(x + T - 6, y + T - 6);
    ctx.moveTo(x + T - 6, y + 6); ctx.lineTo(x + 6, y + T - 6);
    ctx.stroke();
  }
}

function drawRug(ctx, x, y, col, row) {
  ctx.fillStyle = '#14142a';
  ctx.fillRect(x, y, T, T);
  ctx.fillStyle = '#1c1640';
  ctx.fillRect(x + 2, y + 2, T - 4, T - 4);

  ctx.strokeStyle = '#3a2870';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 3, y + 3, T - 6, T - 6);
  ctx.strokeStyle = '#2a1c58';
  ctx.strokeRect(x + 5, y + 5, T - 10, T - 10);

  ctx.fillStyle = '#281e50';
  ctx.fillRect(x + 13, y + 8,  6, 16);
  ctx.fillRect(x + 8,  y + 13, 16, 6);

  ctx.fillStyle = '#3a2870';
  for (const [cx, cy] of [[6,6],[T-9,6],[6,T-9],[T-9,T-9]]) {
    ctx.fillRect(x + cx, y + cy, 3, 3);
  }
  ctx.fillStyle = '#4a3888';
  ctx.fillRect(x + 15, y + 15, 2, 2);
}

// ─── NPC sprites ──────────────────────────────────────────────────────────────

function drawGuard(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x + 8, y + T - 5, T - 16, 3);

  ctx.fillStyle = '#4a4a6c';
  ctx.fillRect(x + 9, y + 15, 14, 11);
  ctx.fillStyle = '#6a6a8e';
  ctx.fillRect(x + 11, y + 16, 10, 6);
  ctx.fillStyle = '#4a4a6c';
  ctx.fillRect(x + 15, y + 16, 2, 6);
  ctx.fillStyle = '#5a5a7e';
  ctx.fillRect(x + 7,      y + 15, 3, 5);
  ctx.fillRect(x + T - 10, y + 15, 3, 5);

  ctx.fillStyle = '#3c3c5a';
  ctx.fillRect(x + 10, y + 25, 5, 5);
  ctx.fillRect(x + 17, y + 25, 5, 5);
  ctx.fillStyle = '#28283e';
  ctx.fillRect(x + 9,  y + 28, 6, 3);
  ctx.fillRect(x + 17, y + 28, 6, 3);

  ctx.fillStyle = '#5a5a7e';
  ctx.fillRect(x + 10, y + 7, 12, 9);
  ctx.fillRect(x + 9,      y + 9, 2, 6);
  ctx.fillRect(x + T - 11, y + 9, 2, 6);
  ctx.fillStyle = '#18183a';
  ctx.fillRect(x + 11, y + 10, 10, 3);
  ctx.fillStyle = '#cc4444';
  ctx.fillRect(x + 14, y + 5, 4, 3);

  ctx.fillStyle = '#7a5e38';
  ctx.fillRect(x + T - 7, y + 4, 2, 22);
  ctx.fillStyle = '#c8c8d8';
  ctx.fillRect(x + T - 8, y + 2, 4, 4);
  ctx.fillStyle = '#e8e8f0';
  ctx.fillRect(x + T - 7, y + 1, 2, 2);
}

function drawSage(ctx, x, y, color) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x + 8, y + T - 5, T - 16, 3);

  ctx.fillStyle = color;
  ctx.fillRect(x + 8, y + 14, 16, 12);
  ctx.fillRect(x + 7, y + 22, 18, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(x + 15, y + 14, 2, 12);

  ctx.fillStyle = color;
  ctx.fillRect(x + 5,      y + 15, 5, 8);
  ctx.fillRect(x + T - 10, y + 15, 5, 8);
  ctx.fillStyle = '#c8a070';
  ctx.fillRect(x + 5,      y + 22, 4, 3);
  ctx.fillRect(x + T - 9,  y + 22, 4, 3);

  ctx.fillStyle = '#7a5a30';
  ctx.fillRect(x + 4, y + 6, 2, 20);
  ctx.fillStyle = '#4a4a9a';
  ctx.fillRect(x + 2, y + 3, 6, 5);
  ctx.fillStyle = '#7878cc';
  ctx.fillRect(x + 3, y + 4, 4, 3);
  ctx.fillStyle = '#aaaae8';
  ctx.fillRect(x + 4, y + 4, 2, 1);

  ctx.fillStyle = '#c8a070';
  ctx.fillRect(x + 11, y + 8, 10, 8);
  ctx.fillStyle = color;
  ctx.fillRect(x + 10, y + 6, 12, 5);
  ctx.fillRect(x + 9,      y + 8, 2, 6);
  ctx.fillRect(x + T - 11, y + 8, 2, 6);
  ctx.fillStyle = '#e8e0d0';
  ctx.fillRect(x + 12, y + 13, 8, 3);
  ctx.fillRect(x + 13, y + 16, 6, 2);
  ctx.fillStyle = '#2a1a08';
  ctx.fillRect(x + 12, y + 10, 2, 2);
  ctx.fillRect(x + 18, y + 10, 2, 2);
  ctx.fillStyle = '#ffffc0';
  ctx.fillRect(x + 12, y + 10, 1, 1);
  ctx.fillRect(x + 18, y + 10, 1, 1);
}

function drawStranger(ctx, x, y, color) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x + 8, y + T - 5, T - 16, 3);

  ctx.fillStyle = '#1c1c2e';
  ctx.fillRect(x + 7, y + 13, 18, 13);
  ctx.fillRect(x + 8, y + 23, 16, 4);

  ctx.fillStyle = '#24243a';
  ctx.fillRect(x + 9, y + 7, 14, 9);
  ctx.fillRect(x + 7,      y + 9, 2, 7);
  ctx.fillRect(x + T - 9,  y + 9, 2, 7);
  ctx.fillStyle = '#2c2c40';
  ctx.fillRect(x + 8, y + 6, 16, 4);

  ctx.fillStyle = '#0a0a14';
  ctx.fillRect(x + 11, y + 9, 10, 7);

  ctx.fillStyle = color;
  ctx.fillRect(x + 12, y + 11, 3, 2);
  ctx.fillRect(x + 17, y + 11, 3, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 13, y + 11, 1, 1);
  ctx.fillRect(x + 18, y + 11, 1, 1);

  ctx.fillStyle = '#14141e';
  ctx.fillRect(x + 10, y + 15, 2, 9);
  ctx.fillRect(x + 20, y + 15, 2, 9);

  ctx.fillStyle = '#161626';
  ctx.fillRect(x + 10, y + 26, 5, 3);
  ctx.fillRect(x + 17, y + 26, 5, 3);
}

function drawNPC(ctx, x, y, npc) {
  const label = (npc.label || '?').toUpperCase();
  if      (label === 'G') drawGuard(ctx, x, y);
  else if (label === 'S') drawSage(ctx, x, y, npc.color || '#8888cc');
  else                    drawStranger(ctx, x, y, npc.color || '#aaaacc');
}

// ─── Player ───────────────────────────────────────────────────────────────────

function drawPlayer(ctx, x, y, accent) {
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.38)';
  ctx.fillRect(x + 7, y + T - 5, T - 14, 4);

  // Back leg + boot
  ctx.fillStyle = '#2a2050'; ctx.fillRect(x + 17, y + 24, 5, 6);
  ctx.fillStyle = '#1a1030'; ctx.fillRect(x + 17, y + 28, 6, 3);

  // Front leg + boot
  ctx.fillStyle = '#2a2050'; ctx.fillRect(x + 10, y + 24, 5, 6);
  ctx.fillStyle = '#1a1030'; ctx.fillRect(x + 9,  y + 28, 6, 3);

  // Belt + buckle
  ctx.fillStyle = '#8a6030'; ctx.fillRect(x + 9,  y + 23, 14, 2);
  ctx.fillStyle = '#c8a020'; ctx.fillRect(x + 14, y + 22, 4, 3);

  // Body / cloak
  ctx.fillStyle = accent;
  ctx.fillRect(x + 9, y + 14, 14, 11);
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 9, y + 20, 14, 5);

  // Arms
  ctx.fillStyle = accent;
  ctx.fillRect(x + 6,      y + 15, 4, 8);
  ctx.fillRect(x + T - 10, y + 15, 4, 8);
  ctx.fillStyle = '#d4a070';
  ctx.fillRect(x + 6,      y + 22, 4, 3);
  ctx.fillRect(x + T - 10, y + 22, 4, 3);

  // Collar
  ctx.fillStyle = accent;
  ctx.fillRect(x + 11, y + 13, 10, 3);

  // Neck
  ctx.fillStyle = '#d4a070'; ctx.fillRect(x + 13, y + 11, 6, 4);

  // Head
  ctx.fillStyle = '#e0b080'; ctx.fillRect(x + 10, y + 6, 12, 10);

  // Hair / hood
  ctx.fillStyle = accent;
  ctx.fillRect(x + 10, y + 5, 12, 3);
  ctx.fillRect(x + 9,      y + 6, 2, 6);
  ctx.fillRect(x + T - 11, y + 6, 2, 6);

  // Brow
  ctx.fillStyle = '#c09060'; ctx.fillRect(x + 10, y + 8, 12, 1);

  // Eyes (white + iris + shine)
  ctx.fillStyle = '#1a1020';
  ctx.fillRect(x + 11, y + 9, 3, 3);
  ctx.fillRect(x + 18, y + 9, 3, 3);
  ctx.fillStyle = '#4466cc';
  ctx.fillRect(x + 12, y + 9, 2, 2);
  ctx.fillRect(x + 19, y + 9, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(x + 12, y + 9, 1, 1);
  ctx.fillRect(x + 19, y + 9, 1, 1);

  // Mouth
  ctx.fillStyle = '#a07050';
  ctx.fillRect(x + 13, y + 13, 6, 1);
  ctx.fillRect(x + 14, y + 14, 4, 1);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function render(ctx, state, accentColor) {
  const { grid, player, exitOpen, particles, npcs } = state;

  ctx.clearRect(0, 0, MAP_W * T, MAP_H * T);

  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      const t = grid[r][c];
      const x = c * T, y = r * T;
      switch (t) {
        case TILE.FLOOR:   drawFloor(ctx, x, y, c, r); break;
        case TILE.WALL:    drawWall(ctx, x, y, c, r); break;
        case TILE.DOOR_C:  drawDoorClosed(ctx, x, y, accentColor); break;
        case TILE.DOOR_O:  drawDoorOpen(ctx, x, y); break;
        case TILE.CHEST_C: drawChestClosed(ctx, x, y, accentColor); break;
        case TILE.CHEST_O: drawChestOpen(ctx, x, y); break;
        case TILE.STAIRS:  drawStairs(ctx, x, y, exitOpen); break;
        case TILE.RUG:     drawRug(ctx, x, y, c, r); break;
        default:           drawFloor(ctx, x, y, c, r);
      }
    }
  }

  if (npcs) {
    for (const npc of npcs) drawNPC(ctx, npc.col * T, npc.row * T, npc);
  }

  if (player) drawPlayer(ctx, player.col * T, player.row * T, accentColor);

  if (particles) {
    for (const p of particles) {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }
}

export function getCanvasSize() {
  return { width: MAP_W * T, height: MAP_H * T };
}
