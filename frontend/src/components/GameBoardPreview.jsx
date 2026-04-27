import { useMemo } from 'react';
import { loadLevel } from '../engine/dungeon.js';
import { render, getCanvasSize } from '../engine/renderer.js';

function buildPreviewSrc({ accent, language, canvasTint }) {
  if (typeof document === 'undefined') return '';

  const level = loadLevel(1, language);
  const { width, height } = getCanvasSize();
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  render(
    ctx,
    {
      grid: level.grid,
      player: level.playerStart,
      solvedLocks: new Set(),
      exitOpen: false,
      particles: [],
      npcs: level.npcs || [],
    },
    accent,
    canvasTint
  );

  return canvas.toDataURL('image/png');
}

export default function GameBoardPreview({ accent, language, canvasTint }) {
  const previewSrc = useMemo(
    () => buildPreviewSrc({ accent, language, canvasTint }),
    [accent, language, canvasTint]
  );

  return (
    <div className="board-preview-wrap" aria-hidden="true">
      <img className="board-preview-img" src={previewSrc} alt="" />
    </div>
  );
}
