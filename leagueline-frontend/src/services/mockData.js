const logo = (t, c) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="${c}"/><text x="32" y="40" font-size="22" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#0B0F19">${t}</text></svg>`
  )}`;
export const shot = (label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="640" height="360" fill="#1A2336"/><text x="320" y="180" font-size="22" fill="#64748B" font-family="sans-serif" text-anchor="middle">${label}</text></svg>`
  )}`;

export const games = ['Mobile Legends', 'Valorant', 'Dota 2'];

export const leagues = [
  { id: 1, name: 'Cebu Inter-School Cup S3', game: 'Mobile Legends', status: 'ONGOING', teams: 8 },
  { id: 2, name: 'Visayas Valorant Open', game: 'Valorant', status: 'REGISTRATION_OPEN', teams: 6 },
  { id: 3, name: 'Campus Dota Clash', game: 'Dota 2', status: 'ONGOING', teams: 6 },
];

export const teams = [
  { id: 1, name: 'Tigers Esports', logo: logo('TG', '#22D3EE') },
  { id: 2, name: 'Night Owls', logo: logo('NO', '#3B82F6') },
  { id: 3, name: 'Rift Walkers', logo: logo('RW', '#A78BFA') },
  { id: 4, name: 'Cebu Kraken', logo: logo('CK', '#34D399') },
];

export const standings = [
  { teamId: 1, team: 'Tigers Esports', logo: teams[0].logo, w: 6, l: 1, points: 18 },
  { teamId: 4, team: 'Cebu Kraken', logo: teams[3].logo, w: 5, l: 2, points: 15 },
  { teamId: 2, team: 'Night Owls', logo: teams[1].logo, w: 3, l: 4, points: 9 },
  { teamId: 3, team: 'Rift Walkers', logo: teams[2].logo, w: 1, l: 6, points: 3 },
];

export const matches = [
  { id: 11, home: 'Tigers Esports', away: 'Night Owls', format: 'Bo3', at: '2026-11-08T14:00:00', status: 'UPCOMING' },
  { id: 12, home: 'Cebu Kraken', away: 'Rift Walkers', format: 'Bo3', at: '2026-11-09T16:00:00', status: 'UPCOMING' },
  { id: 9, home: 'Tigers Esports', away: 'Cebu Kraken', format: 'Bo3', at: '2026-11-01T14:00:00', status: 'COMPLETED', score: '2-1' },
  { id: 8, home: 'Night Owls', away: 'Rift Walkers', format: 'Bo3', at: '2026-10-31T16:00:00', status: 'COMPLETED', score: '2-0' },
];

export const leaderboard = [
  { player: 'Kyuzo', team: 'Tigers Esports', role: 'Jungler', k: 8.4, d: 2.1, a: 7.9 },
  { player: 'Vanta', team: 'Cebu Kraken', role: 'Gold Lane', k: 7.1, d: 2.6, a: 6.2 },
  { player: 'Sable', team: 'Night Owls', role: 'Mid Lane', k: 6.5, d: 3.0, a: 8.8 },
  { player: 'Rook', team: 'Rift Walkers', role: 'EXP Lane', k: 5.2, d: 3.4, a: 5.1 },
];

export const roster = [
  { id: 1, ign: 'Kyuzo', realName: 'Miguel Santos', role: 'Jungler', photo: null },
  { id: 2, ign: 'Haze', realName: 'Paolo Reyes', role: 'Roamer', photo: null },
];

export const pendingResults = [
  {
    id: 101, league: 'Cebu Inter-School Cup S3', home: 'Tigers Esports', away: 'Night Owls',
    submittedBy: 'Tigers Esports', submittedAt: '2026-11-03T20:10:00', format: 'Bo3',
    games: [
      { n: 1, screenshot: shot('Game 1 result screenshot (Tigers)') },
      { n: 2, screenshot: shot('Game 2 result screenshot (Tigers)') },
    ],
    players: [
      { ign: 'Kyuzo', team: 'home', k: 9, d: 2, a: 8 },
      { ign: 'Haze', team: 'home', k: 3, d: 4, a: 14 },
      { ign: 'Sable', team: 'away', k: 6, d: 5, a: 9 },
    ],
  },
  {
    id: 102, league: 'Campus Dota Clash', home: 'Cebu Kraken', away: 'Rift Walkers',
    submittedBy: 'Cebu Kraken', submittedAt: '2026-11-04T09:30:00', format: 'Bo3',
    games: [{ n: 1, screenshot: shot('Game 1 result screenshot (Kraken)') }],
    players: [{ ign: 'Vanta', team: 'home', k: 11, d: 3, a: 6 }],
  },
];
