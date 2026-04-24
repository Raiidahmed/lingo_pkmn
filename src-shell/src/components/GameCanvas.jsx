import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '../state/appStore.js';

// GameCanvas embeds the legacy monolithic game (src/index.html) as an
// iframe module. This is the "keep canvas/game loop isolated from the UI
// shell" boundary — the shell never reaches into the game's DOM.
//
// Bridge contract:
// - legacy -> shell: lingo:ready, lingo:startAck, lingo:gameOver
// - shell -> legacy: lingo:config, lingo:start, lingo:quit
export default function GameCanvas() {
  const iframeRef = useRef(null);
  const startAckedRef = useRef(false);
  const quitFallbackTimerRef = useRef(null);
  const reportGameOver = useAppStore(s => s.reportGameOver);
  const gotoStatus = useAppStore(s => s.gotoStatus);
  const gotoTitle = useAppStore(s => s.gotoTitle);
  const session = useAppStore(s => s.session);
  const accent = useAppStore(s => s.accent);
  const soundEnabled = useAppStore(s => s.soundEnabled);
  const launchPreferences = useAppStore(s => s.launchPreferences);
  const launchNonce = useAppStore(s => s.launchNonce);

  const startPayload = useMemo(() => ({
    mode: launchPreferences.mode === 'resume' ? 'resume' : 'restart',
    levelIndex: Math.max(0, Math.floor(Number(launchPreferences.levelIndex) || 0)),
    launchNonce,
  }), [launchNonce, launchPreferences.levelIndex, launchPreferences.mode]);

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

  const pushStartToLegacy = useCallback(() => {
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      {
        type: 'lingo:start',
        mode: startPayload.mode,
        levelIndex: startPayload.levelIndex,
        launchNonce: startPayload.launchNonce,
      },
      window.location.origin,
    );
  }, [startPayload.levelIndex, startPayload.launchNonce, startPayload.mode]);

  const pushQuitToLegacy = useCallback(() => {
    const targetWindow = iframeRef.current?.contentWindow;
    if (!targetWindow) return;
    targetWindow.postMessage(
      {
        type: 'lingo:quit',
        reason: 'shell_toolbar',
      },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
    function onMessage(e) {
      if (!iframeRef.current || e.source !== iframeRef.current.contentWindow) {
        return;
      }
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'lingo:gameOver') {
        if (quitFallbackTimerRef.current !== null) {
          window.clearTimeout(quitFallbackTimerRef.current);
          quitFallbackTimerRef.current = null;
        }
        reportGameOver(data.stats || null, data.terminal || null);
        return;
      }
      if (data.type === 'lingo:ready') {
        pushConfigToLegacy();
        pushStartToLegacy();
        return;
      }
      if (data.type === 'lingo:startAck') {
        if (
          !Number.isFinite(Number(data.launchNonce))
          || Number(data.launchNonce) === startPayload.launchNonce
        ) {
          startAckedRef.current = true;
        }
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [pushConfigToLegacy, pushStartToLegacy, reportGameOver, startPayload.launchNonce]);

  useEffect(() => () => {
    if (quitFallbackTimerRef.current !== null) {
      window.clearTimeout(quitFallbackTimerRef.current);
      quitFallbackTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    pushConfigToLegacy();
  }, [pushConfigToLegacy]);

  useEffect(() => {
    startAckedRef.current = false;
    pushStartToLegacy();
    let attempts = 0;
    const maxAttempts = 20;
    const timer = window.setInterval(() => {
      if (startAckedRef.current) {
        window.clearInterval(timer);
        return;
      }
      attempts += 1;
      pushStartToLegacy();
      if (attempts >= maxAttempts) {
        window.clearInterval(timer);
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [pushStartToLegacy, startPayload.launchNonce]);

  function handleQuitToShell() {
    pushQuitToLegacy();
    if (quitFallbackTimerRef.current !== null) {
      window.clearTimeout(quitFallbackTimerRef.current);
    }
    quitFallbackTimerRef.current = window.setTimeout(() => {
      quitFallbackTimerRef.current = null;
      if (session) gotoStatus();
      else gotoTitle();
    }, 1800);
  }

  return (
    <div className="game-host">
      <div className="game-toolbar">
        <span>IN DUNGEON — legacy module</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="hud-btn"
            onClick={handleQuitToShell}
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
        onLoad={() => {
          pushConfigToLegacy();
          pushStartToLegacy();
        }}
      />
    </div>
  );
}
