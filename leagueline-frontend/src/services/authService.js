import api from './api.js';

export async function registerUser({ fullName, email, password, role }) {
  const { data } = await api.post('/auth/register', { fullName, email, password, role });
  return data;
}

export async function loginWithCredentials({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function loginWithGoogle(credential) {
  const { data } = await api.post('/auth/google', { idToken: credential });
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logoutUser() {
  await api.post('/auth/logout');
}

export function getDashboardPath(role) {
  if (role === 'ORGANIZER') return '/organizer';
  if (role === 'TEAM_MANAGER') return '/manager';
  if (role === 'FAN') return '/fan';
  return '/';
}

export function getRoleLabel(role) {
  if (role === 'ORGANIZER') return 'League Organizer';
  if (role === 'TEAM_MANAGER') return 'Team Manager';
  if (role === 'FAN') return 'Fan / Player';
  return role;
}