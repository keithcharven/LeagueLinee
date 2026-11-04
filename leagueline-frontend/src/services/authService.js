import api, { USE_MOCK } from './api.js';

// Exchange the Google ID token for the backend's JWT + profile ({ token, user: { name, email, role } }).
export async function loginWithGoogle(credential) {
  const { data } = await api.post('/auth/google', { idToken: credential });
  return data;
}

// Dev-only sign-in so dashboards can be explored without Google or a backend.
export const demoLogin = (role) =>
  USE_MOCK
    ? { token: 'demo-token', user: { name: role === 'ORGANIZER' ? 'Alex Organizer' : 'Mika Captain', email: 'demo@leagueline.dev', role } }
    : null;
