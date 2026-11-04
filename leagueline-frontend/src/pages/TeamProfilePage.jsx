import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserRound } from 'lucide-react';
import { getTeam } from '../services/leagueService.js';
import { Spinner, fmtDate } from '../components/ui.jsx';

export default function TeamProfilePage() {
  const { teamId } = useParams();
  const { data: team, isLoading } = useQuery({ queryKey: ['team', teamId], queryFn: () => getTeam(teamId) });
  if (isLoading) return <Spinner />;
  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <img src={team.logo} alt="" className="h-16 w-16 rounded-lg" />
        <h1 className="text-3xl font-bold">{team.name}</h1>
      </div>
      <h2 className="mb-3 text-lg">Roster</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {team.roster.map((p) => (
          <div key={p.id} className="panel flex items-center gap-3 p-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-ink-800 text-ink-500">
              {p.photo ? <img src={p.photo} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}
            </span>
            <div><p className="font-semibold text-white">{p.ign}</p><p className="text-sm text-ink-500">{p.role}</p></div>
          </div>
        ))}
      </div>
      <h2 className="mb-3 text-lg">Match history</h2>
      <ul className="panel divide-y divide-ink-700">
        {team.history.map((m) => (
          <li key={m.id} className="flex justify-between p-3 text-sm">
            <span className="text-white">{m.home} vs {m.away}</span>
            <span className="text-ink-500"><span className="mr-3 font-display text-volt">{m.score}</span>{fmtDate(m.at)}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
