import { useState } from 'react';
import { api } from '../api.js';
import { useStore } from '../store.js';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tapCount, setTapCount] = useState(0);
  const [debugVisible, setDebugVisible] = useState(false);
  const [wiping, setWiping] = useState(false);
  const [wipeMsg, setWipeMsg] = useState('');
  const login = useStore(s => s.login);

  async function handleSubmit(e) {
    e.preventDefault();
    const name = username.trim();
    if (!name) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.login(name);
      login(data.user, data.token, data.save ?? null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleTitleTap() {
    const next = tapCount + 1;
    setTapCount(next);
    if (next >= 5) {
      setDebugVisible(true);
      setTapCount(0);
    }
  }

  async function handleWipe() {
    if (!window.confirm('Wipe ALL scores, saves, and level progress? This cannot be undone.')) return;
    setWiping(true);
    setWipeMsg('');
    try {
      const res = await fetch('/api/debug/wipe-scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: 'WIPE' }),
      });
      const data = await res.json();
      setWipeMsg(data.message || 'Done.');
    } catch {
      setWipeMsg('Error wiping.');
    } finally {
      setWiping(false);
    }
  }

  return (
    <div className="page" style={{ justifyContent: 'center', minHeight: '100dvh' }}>
      <div
        className="page-title"
        onClick={handleTitleTap}
        style={{ userSelect: 'none', cursor: 'default' }}
      >LINGO</div>
      <div className="page-title" style={{ fontSize: 14, color: 'var(--text)' }}>DUNGEON</div>
      <div style={{ fontSize: 7, color: '#22cc66', border: '1px solid #22cc66', borderRadius: 4, padding: '4px 10px', letterSpacing: 2 }}>STAGING ENVIRONMENT</div>
      <div className="subtitle" style={{ marginBottom: 24 }}>Learn Spanish. Survive the dungeon.</div>

      <div className="card" style={{ maxWidth: 320 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 7, color: 'var(--text-dim)' }}>ENTER YOUR NAME</label>
          <input
            className="text-input"
            type="text"
            placeholder="BORT"
            maxLength={24}
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            autoCapitalize="characters"
          />
          {error && <div style={{ fontSize: 7, color: 'var(--red-flash)' }}>{error}</div>}
          <button className="btn btn-accent" type="submit" disabled={loading || !username.trim()}>
            {loading ? '...' : 'ENTER DUNGEON'}
          </button>
        </form>
      </div>

      <div className="subtitle">Spanish • English • Adventure</div>

      {debugVisible && (
        <div className="card" style={{ maxWidth: 320, borderColor: '#ff3355', marginTop: 16 }}>
          <div className="card-title" style={{ color: '#ff3355' }}>DEBUG</div>
          <button
            className="btn"
            style={{ borderColor: '#ff3355', color: '#ff3355' }}
            onClick={handleWipe}
            disabled={wiping}
          >
            {wiping ? 'WIPING...' : 'WIPE SCORES + PROGRESS'}
          </button>
          {wipeMsg && <div style={{ fontSize: 7, color: 'var(--text-dim)', marginTop: 8 }}>{wipeMsg}</div>}
          <button
            className="btn btn-ghost"
            style={{ marginTop: 8, fontSize: 7 }}
            onClick={() => { setDebugVisible(false); setWipeMsg(''); }}
          >CLOSE</button>
        </div>
      )}
    </div>
  );
}
