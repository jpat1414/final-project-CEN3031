import React, { useState } from 'react';
import { login, currentUser } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const result = await login(email.trim(), password);
      if (!result.token) throw new Error('The server did not return a login token.');
      const profile = await currentUser(result.token);
      if (!profile.user) throw new Error('The server did not return your profile.');
      setPassword('');
      setUser(profile.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    setUser(null);
    setEmail('');
    setPassword('');
    setError('');
  }

  if (user) {
    return <>
      <header className="site-header dashboard-header">
        <span>WeatherWindow</span>
        <div className="header-account">
          <span className="account-email">{user.email}</span>
          <button className="sign-out" onClick={signOut}>Sign out</button>
        </div>
      </header>
      <main className="dashboard" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <h1 id="dashboard-title">Dashboard</h1>
          <p role="status">Welcome, {user.name}.</p>
        </div>
      </main>
    </>;
  }

  return <><header className="site-header">WeatherWindow</header><main>
    <section aria-label="Account access" className="account-form">
      <h1>Sign in</h1><p className="form-description">Enter your account details to continue.</p>
      <form onSubmit={submit}>
        <label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="username" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} disabled={busy} required/>
        <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} disabled={busy} required/>
        {error && <p className="error" role="alert">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </section>
  </main></>;
}
