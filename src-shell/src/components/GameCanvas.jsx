import { useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../state/appStore.js';
import { mountGameEngine } from '../engine/game-engine.js';
import '../engine/game-engine.css';

// GameCanvas mounts the LingoDungeon game engine directly into a native div
// in the React shell — no iframe, no postMessage bridge.
//
// Engine API:
//   const ctrl = mountGameEngine(containerEl, config)
//   ctrl.start({ mode, levelIndex, snapshot, launchNonce })
//   ctrl.quit()
//   ctrl.setAccent(theme)
//   ctrl.setSound(bool)
//   ctrl.destroy()
//
// Shell → engine:  direct JS method calls
// Engine → shell:  onReady() and onGameOver(stats, terminal) callbacks
export default function GameCanvas() {
  const containerRef = useRef(null);
  const engineRef    = useRef(null);

  const reportGameOver       = useAppStore(s => s.reportGameOver);
  const gotoStatus           = useAppStore(s => s.gotoStatus);
  const gotoTitle            = useAppStore(s => s.gotoTitle);
  const session              = useAppStore(s => s.session);
  const accent               = useAppStore(s => s.accent);
  const soundEnabled         = useAppStore(s => s.soundEnabled);
  const launchPreferences    = useAppStore(s => s.launchPreferences);
  const launchNonce          = useAppStore(s => s.launchNonce);
  const saveSnapshot         = useAppStore(s => s.saveSnapshot);

  // Build stable config refs so the engine mount only fires once
  const accentRef         = useRef(accent);
  const soundRef          = useRef(soundEnabled);
  const sessionRef        = useRef(session);
  const snapshotRef       = useRef(saveSnapshot);
  const launchPrefsRef    = useRef(launchPreferences);
  const launchNonceRef    = useRef(launchNonce);
  const reportGameOverRef = useRef(reportGameOver);

  useEffect(() => { accentRef.current = accent; }, [accent]);
  useEffect(() => { soundRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { snapshotRef.current = saveSnapshot; }, [saveSnapshot]);
  useEffect(() => { launchPrefsRef.current = launchPreferences; }, [launchPreferences]);
  useEffect(() => { launchNonceRef.current = launchNonce; }, [launchNonce]);
  useEffect(() => { reportGameOverRef.current = reportGameOver; }, [reportGameOver]);

  // ---- Mount / unmount engine ----
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctrl = mountGameEngine(el, {
      accent:       accentRef.current,
      soundEnabled: soundRef.current,
      playerName:   sessionRef.current?.profile?.name || 'Hero',
      token:        sessionRef.current?.token || '',
      apiBase:      '',
      onReady: (nonce) => {
        // Engine is ready and the game loop has started.
        // Could be used for analytics / timing if needed.
        void nonce;
      },
      onGameOver: (stats, terminal) => {
        reportGameOverRef.current(stats || null, terminal || null);
      },
    });
    engineRef.current = ctrl;

    // Start the game immediately with current launch prefs
    const prefs    = launchPrefsRef.current;
    const mode     = prefs?.mode === 'resume' ? 'resume' : 'restart';
    const levelIdx = Math.max(0, Math.floor(Number(prefs?.levelIndex) || 0));
    ctrl.start({
      mode,
      levelIndex: levelIdx,
      snapshot:   snapshotRef.current || null,
      launchNonce: launchNonceRef.current,
    });

    return () => {
      ctrl.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount once per GameCanvas lifecycle

  // ---- Sync accent when shell setting changes ----
  useEffect(() => {
    engineRef.current?.setAccent(accent);
  }, [accent]);

  // ---- Sync sound when shell setting changes ----
  useEffect(() => {
    engineRef.current?.setSound(soundEnabled);
  }, [soundEnabled]);

  // ---- Sync token if session changes mid-game ----
  useEffect(() => {
    engineRef.current?.setToken(session?.token || '');
    engineRef.current?.setPlayerName(session?.profile?.name || 'Hero');
  }, [session]);

  // ---- Shell-initiated quit (toolbar button) ----
  const handleQuitToShell = useCallback(() => {
    const ctrl = engineRef.current;
    if (ctrl) {
      ctrl.quit();
    } else {
      // Fallback: no engine, just navigate
      if (session) gotoStatus();
      else gotoTitle();
    }
  }, [session, gotoStatus, gotoTitle]);

  return (
    <div className="game-host phase4">
      {/* Toolbar sits above the engine container */}
      <div className="game-toolbar">
        <span>IN DUNGEON</span>
        <button
          type="button"
          className="hud-btn"
          onClick={handleQuitToShell}
        >
          Quit to Shell
        </button>
      </div>
      {/* Engine mounts its own DOM inside this div */}
      <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }} />
    </div>
  );
}
