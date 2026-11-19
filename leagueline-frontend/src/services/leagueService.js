import api from './api.js';

// ---- Public ----
export const getLeagues = (game) =>
  api.get('/leagues', { params: { game: game && game !== 'All' ? game : undefined } }).then((r) => r.data);

export const getStandings = (id) => api.get(`/leagues/${id}/standings`).then((r) => r.data);
export const getMatches = (id) => api.get(`/leagues/${id}/matches`).then((r) => r.data);
export const getLeaderboard = (id) => api.get(`/leagues/${id}/leaderboard`).then((r) => r.data);
export const getTeam = (id) => api.get(`/teams/${id}`).then((r) => r.data);

// ---- Team manager (Upcoming Increment 2 endpoints) ----
export const getMyRoster = () => api.get('/manager/team/players').then((r) => r.data);
export const getMyMatches = () => api.get('/manager/matches').then((r) => r.data);

export const registerTeam = (form) => {
  const fd = new FormData();
  fd.append('name', form.name);
  fd.append('leagueId', form.leagueId);
  if (form.logo) fd.append('logo', form.logo);
  return api.post('/manager/team', fd).then((r) => r.data);
};

export const addPlayer = (p) => {
  const fd = new FormData();
  ['ign', 'role', 'realName'].forEach((k) => fd.append(k, p[k]));
  if (p.photo) fd.append('photo', p.photo);
  return api.post('/manager/team/players', fd).then((r) => r.data);
};

export const removePlayer = (id) => api.delete(`/manager/team/players/${id}`).then((r) => r.data);

export const submitProof = ({ matchId, gameNo, screenshot, stats }) => {
  const fd = new FormData();
  fd.append('gameNo', gameNo);
  fd.append('screenshot', screenshot);
  fd.append('stats', JSON.stringify(stats));
  return api.post(`/manager/matches/${matchId}/proof`, fd).then((r) => r.data);
};

// ---- Organizer (Upcoming Increment 2 endpoints) ----
export const getPendingResults = () => api.get('/organizer/results/pending').then((r) => r.data);
export const publishResult = (id, payload) => api.post(`/organizer/results/${id}/publish`, payload).then((r) => r.data);