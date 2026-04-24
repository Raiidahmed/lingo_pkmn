import { useEffect, useRef } from 'react';
import { useAppStore } from '../state/appStore.js';

// GameCanvas embeds the legacy monolithic game (src/index.html) as an
// iframe module. This is the "keep canvas/game loop isolated from the UI
// shell" boundary — the shell never reaches into the game's DOM, it only
// observes postMessage events (future) or lifecycle callbacks.
//
// To avoid modifying the legacy game at all in this spike, we do not
// require it to postMessage back. The user can use the "Quit to Shell"
// button to return. A future iteration would wire real game-over events.
export default function GameCanvas() {
  const iframeRef = useRef(null);
  const reportGameOver = useAppStore(s => s.reportGameOver);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const session = useAppStore(s => s.session);

  useEffect(() => {
    function onMessage(e) {
      // Only react to messages from our embedded iframe.
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) {
        return;
      }
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'lingo:gameOver') {
        reportGameOver(data.stats || null);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [reportGameOver]);

  return (
    <div className="game-host">
      <div className="game-toolbar">
        <span>IN DUNGEON — legacy module</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="hud-btn"
            onClick={() => (session ? gotoStatus() : gotoTitle())}
          >
            Quit to Shell
          </button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="/legacy?embedded=1"
        title="LingoDungeon legacy game"
        allow="autoplay"
      />
    </div>
  );
}
