import { useState } from 'react';
import { useAppStore } from '../state/appStore.js';

export default function AuthPanel() {
  const login = useAppStore(s => s.login);
  const pending = useAppStore(s => s.pending.auth);
  const authMessage = useAppStore(s => s.authMessage);
  const setAuthMessage = useAppStore(s => s.setAuthMessage);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPin, setShowPin] = useState(false);

  const canSubmit = name.trim().length > 0 && !pending;

  function handleSubmit(intent) {
    const trimmed = name.trim();
    if (!trimmed) {
      setAuthMessage('Enter a save name to continue.');
      return;
    }
    const pin = password.length > 0 ? password : '0000';
    if (pin.length < 4) {
      setAuthMessage('PIN must be at least 4 characters.');
      return;
    }
    login({ name: trimmed, password: pin, intent });
  }

  return (
    <div className="ui-panel">
      <h3>Enter Thy Name</h3>
      <p>
        Sign in to resume your save or create a new one. Word bank, story
        progress, and run state travel with you.
      </p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        maxLength={24}
        placeholder="SAVE NAME"
        autoComplete="username"
        spellCheck={false}
        disabled={pending}
      />
      {showPin && (
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          maxLength={24}
          placeholder="PIN (default 0000)"
          autoComplete="current-password"
          spellCheck={false}
          disabled={pending}
        />
      )}
      <div className="auth-actions">
        <button
          type="button"
          className="big-btn"
          onClick={() => handleSubmit('resume')}
          disabled={!canSubmit}
        >
          {pending ? 'Working...' : 'Resume Save ▶'}
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => handleSubmit('create')}
          disabled={!canSubmit}
        >
          Create Save
        </button>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShowPin(v => !v)}
          disabled={pending}
        >
          {showPin ? 'Hide PIN' : 'Set / change PIN'}
        </button>
      </div>
      <p className="auth-msg" role="status" aria-live="polite">
        {authMessage}
      </p>
    </div>
  );
}
