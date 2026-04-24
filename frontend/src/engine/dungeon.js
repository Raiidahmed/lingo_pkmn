import { getLevel } from './levels.js';

export const TILE = {
  FLOOR:   0,
  WALL:    1,
  DOOR_C:  2,   // locked challenge door
  DOOR_O:  3,   // opened door
  CHEST_C: 4,   // locked challenge chest
  CHEST_O: 5,   // opened chest
  STAIRS:  6,   // exit (locked until all challenges solved)
  RUG:     7,   // decorative floor
};
export const MAP_W = 15;
export const MAP_H = 13;

export function loadLevel(levelN) {
  const data = getLevel(levelN);
  // Deep copy map so we can mutate door states
  const grid = data.map.map(row => [...row]);
  return {
    grid,
    playerStart: { ...data.playerStart },
    locks: { ...data.locks },          // "col,row" -> { type, challengeId }
    npcs: data.npcs,
    challenges: data.challenges,
    name: data.name,
    numLocks: Object.keys(data.locks).length,
  };
}

export function tryMove(grid, player, dx, dy, exitOpen) {
  const nc = player.col + dx;
  const nr = player.row + dy;
  if (nr < 0 || nr >= MAP_H || nc < 0 || nc >= MAP_W) return player;
  const t = grid[nr][nc];
  if (t === TILE.WALL) return player;
  if (t === TILE.DOOR_C) return player;
  if (t === TILE.CHEST_C) return player;
  if (t === TILE.STAIRS && !exitOpen) return player;
  return { col: nc, row: nr };
}

export function isChallengeTile(t) {
  return t === TILE.DOOR_C || t === TILE.CHEST_C;
}

export function isAdjacentTo(player, col, row) {
  return Math.abs(player.col - col) + Math.abs(player.row - row) <= 1;
}
