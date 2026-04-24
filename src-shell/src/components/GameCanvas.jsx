import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../state/appStore.js';

// GameCanvas embeds the legacy monolithic game (src/index.html) as an
// iframe module. This is the "keep canvas/game loop isolated from the UI
// shell" boundary — the shell never reaches into the game's DOM, it only
// observes postMessage events (future) or lifecycle callbacks.
//
// Phase 1 bridge:
// - legacy -> shell: lingo:gameOver
// - shell -> legacy: lingo:config (accent theme + sound preference)
export default function GameCanvas() {
  const iframeRef = useRef(null);
  const reportGameOver = useAppStore(s => s.reportGameOver);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const session = useAppStore(s => s.session);
  const accent = useAppStore(s => s.accent);
  const soundEnabled = useAppStore(s => s.soundEnabled);

  const pushConfigToLegacy = useCallback(() => {
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      {
        type: 'lingo:config',
        accentTheme: accent,
        sound: soundEnabled ? 'on' : 'off',
      },
      window.location.origin,
    );
  }, [accent, soundEnabled]);

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

  useEffect(() => {
    pushConfigToLegacy();
  }, [pushConfigToLegacy]);

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
        onLoad={pushConfigToLegacy}
      />
    </div>
  );
}
