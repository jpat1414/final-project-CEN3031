import React from 'react';
import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

async function fill() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Email address'), 'adib@example.com');
  await user.type(screen.getByLabelText('Password'), 'test-password');
  return user;
}
const json = (body, ok = true) => ({ ok, json: async () => body });

test('logs in with backend contract, verifies profile, then signs out', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(json({ token: 'test-token' }))
    .mockResolvedValueOnce(json({ user: { name: 'Adib', email: 'adib@example.com' } }));
  vi.stubGlobal('fetch', fetch);
  render(<App />);
  const user = await fill();
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Welcome, Adib');
  expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
  expect(fetch.mock.calls[0][0]).toMatch(/\/api\/auth\/login$/);
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ email: 'adib@example.com', password: 'test-password' });
  expect(fetch.mock.calls[1][1].headers.Authorization).toBe('Bearer test-token');
  await user.click(screen.getByRole('button', { name: 'Sign out' }));
  expect(screen.getByLabelText('Password')).toHaveValue('');
});
test('shows rejected credentials', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ message: 'Invalid email or password' }, false)));
  render(<App />); const user = await fill();
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
});
test('shows a helpful network failure', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
  render(<App />); const user = await fill();
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server');
});
test('blocks empty submissions without calling backend', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(fetch).not.toHaveBeenCalled();
});
test('disables submission while waiting', async () => {
  vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
  render(<App />); const user = await fill();
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(screen.getByRole('button', { name: 'Signing in…' })).toBeDisabled();
});
test('does not sign in when profile verification rejects the token', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(json({ token: 'expired' }))
    .mockResolvedValueOnce(json({ message: 'Invalid or expired token' }, false)));
  render(<App />); const user = await fill();
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid or expired token');
  expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
});
