// Thin API wrappers. The spike is served same-origin from Flask,
// so base URL is empty. Keeps boundaries clean if we ever split hosts.

const API_BASE = '';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function jsonFetch(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    const err = new Error((body && body.error) || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export function login({ name, password, intent = 'resume' }) {
  return jsonFetch('/api/account/login', {
    method: 'POST',
    body: JSON.stringify({ name, password, intent }),
  });
}

export function fetchMe(token) {
  return jsonFetch('/api/account/me', {
    headers: authHeaders(token),
  });
}

export function logout(token) {
  return jsonFetch('/api/account/logout', {
    method: 'POST',
    headers: authHeaders(token),
  });
}

export function fetchScores(limit = 20) {
  return jsonFetch(`/scores?limit=${encodeURIComponent(limit)}`);
}
