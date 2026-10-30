const base = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${base}/api/auth${path}`, options);
  } catch {
    throw new Error('Cannot reach the server. Please try again later.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'The request failed. Please try again.');
  return data;
}

export const login = (email, password) => request('/login', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
export const currentUser = token => request('/me', {
  headers: { Authorization: `Bearer ${token}` },
});
