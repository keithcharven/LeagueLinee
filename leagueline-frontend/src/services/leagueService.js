import api, { USE_MOCK } from './api.js';
import * as mock from './mockData.js';

const wait = (data, ms = 250) => new Promise((r) => setTimeout(() => r(structuredClone(data)), ms));
let pending = [...mock.pendingResults];
let myRoster = [...mock.roster];

// ---- Public ----
export const getLeagues = (game) =>
  USE_MOCK
    ? wait(game && game !== 'All' ? mock.leagues.filter((l) => l.game === game) : mock.leagues)
    : api.get('/leagues', { params: { game: game !== 'All' ? game : undefined } }).then((r) => r.data);

export const getStandings = (id) => (USE_MOCK ? wait(mock.standings) : api.get(`/leagues/${id}/standings`).then((r) => r.data));
export const getMatches = (id) => (USE_MOCK ? wait(mock.matches) : api.get(`/leagues/${id}/matches`).then((r) => r.data));
export const getLeaderboard = (id) => (USE_MOCK ? wait(mock.leaderboard) : api.get(`/leagues/${id}/leaderboard`).then((r) => r.data));
export const getTeam = (id) =>
  USE_MOCK
    ? wait({ ...(mock.teams.find((t) => t.id === Number(id)) || mock.teams[0]), roster: mock.roster, history: mock.matches.filter((m) => m.status === 'COMPLETED') })
    : api.get(`/teams/${id}`).then((r) => r.data);

// ---- Team manager ----
export const getMyRoster = () => (USE_MOCK ? wait(myRoster) : api.get('/manager/team/players').then((r) => r.data));
export const getMyMatches = () => (USE_MOCK ? wait(mock.matches.filter((m) => m.status === 'UPCOMING')) : api.get('/manager/matches').then((r) => r.data));

export const registerTeam = (form) => {
  // multipart: backend uploads the logo to Cloudinary
  if (USE_MOCK) return wait({ ok: true }, 600);
  const fd = new FormData();
  fd.append('name', form.name);
  fd.append('leagueId', form.leagueId);
  if (form.logo) fd.append('logo', form.logo);
  return api.post('/manager/team', fd).then((r) => r.data);
};

export const addPlayer = (p) => {
  if (USE_MOCK) {
    myRoster = [...myRoster, { id: Date.now(), ign: p.ign, realName: p.realName, role: p.role, photo: p.photoPreview || null }];
    return wait({ ok: true }, 400);
  }
  const fd = new FormData();
  ['ign', 'role', 'realName'].forEach((k) => fd.append(k, p[k]));
  if (p.photo) fd.append('photo', p.photo);
  return api.post('/manager/team/players', fd).then((r) => r.data);
};

export const removePlayer = (id) => {
  if (USE_MOCK) { myRoster = myRoster.filter((p) => p.id !== id); return wait({ ok: true }, 200); }
  return api.delete(`/manager/team/players/${id}`).then((r) => r.data);
};

export const submitProof = ({ matchId, gameNo, screenshot, stats }) => {
  if (USE_MOCK) return wait({ ok: true }, 600);
  const fd = new FormData();
  fd.append('gameNo', gameNo);
  fd.append('screenshot', screenshot);
  fd.append('stats', JSON.stringify(stats));
  return api.post(`/manager/matches/${matchId}/proof`, fd).then((r) => r.data);
};

// ---- Organizer ----
export const getPendingResults = () => (USE_MOCK ? wait(pending) : api.get('/organizer/results/pending').then((r) => r.data));

export const publishResult = (id, payload) => {
  if (USE_MOCK) { pending = pending.filter((p) => p.id !== id); return wait({ ok: true }, 500); }
  return api.post(`/organizer/results/${id}/publish`, payload).then((r) => r.data);
};
