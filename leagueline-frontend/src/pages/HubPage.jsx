import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, getLeagues, getMatches, getStandings } from '../services/leagueService.js';
import { games } from '../services/mockData.js';
import { Badge, Empty, Spinner, fmtDate } from '../components/ui.jsx';

const TABS = ['Standings', 'Schedule', 'Leaderboards'];

function Standings({ id }) {
  const { data, isLoading } = useQuery({ queryKey: ['standings', id], queryFn: () => getStandings(id) });
  if (isLoading) return <Spinner />;
  if (!data?.length) return <Empty title="No standings yet" hint="Standings appear after the first result is published." />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="text-ink-500">
          <tr><th className="p-3">Rank</th><th>Team</th><th>W-L</th><th>Series pts</th><th>Win rate</th></tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={r.teamId} className="border-t border-ink-700">
              <td className={`p-3 font-display text-lg ${i === 0 ? 'text-volt' : ''}`}>{i + 1}</td>
              <td>
                <Link to={`/teams/${r.teamId}`} className="flex items-center gap-3 font-medium text-white hover:text-volt">
                  <img src={r.logo} alt="" className="h-8 w-8 rounded" /> {r.team}
                </Link>
              </td>
              <td>{r.w}-{r.l}</td>
              <td className="font-semibold text-white">{r.points}</td>
              <td>{Math.round((r.w / Math.max(r.w + r.l, 1)) * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Schedule({ id }) {
  const { data, isLoading } = useQuery({ queryKey: ['matches', id], queryFn: () => getMatches(id) });
  if (isLoading) return <Spinner />;
  const group = (s) => data.filter((m) => m.status === s);
  const Section = ({ title, items }) => (
    <section className="mb-6">
      <h3 className="mb-2 text-base">{title}</h3>
      {items.length === 0 ? <p className="text-sm text-ink-500">Nothing here yet.</p> : (
        <ul className="divide-y divide-ink-700 rounded-md border border-ink-700">
          {items.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
              <span className="font-medium text-white">{m.home} <span className="text-ink-500">vs</span> {m.away}</span>
              <span className="flex items-center gap-3 text-ink-500">
                {m.score && <span className="font-display text-base text-volt">{m.score}</span>}
                {m.format} · {fmtDate(m.at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
  return <><Section title="Upcoming" items={group('UPCOMING')} /><Section title="Completed" items={group('COMPLETED')} /></>;
}

function Leaderboards({ id }) {
  const { data, isLoading } = useQuery({ queryKey: ['lb', id], queryFn: () => getLeaderboard(id) });
  if (isLoading) return <Spinner />;
  if (!data?.length) return <Empty title="No player stats yet" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="text-ink-500"><tr><th className="p-3">#</th><th>Player</th><th>Team</th><th>Avg K</th><th>Avg D</th><th>Avg A</th><th>KDA</th></tr></thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={p.player} className="border-t border-ink-700">
              <td className="p-3">{i + 1}</td>
              <td className="font-medium text-white">{p.player} <span className="text-xs text-ink-500">{p.role}</span></td>
              <td>{p.team}</td><td>{p.k}</td><td>{p.d}</td><td>{p.a}</td>
              <td className="font-semibold text-volt">{((p.k + p.a) / Math.max(p.d, 1)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HubPage() {
  const { leagueId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState('All');
  const [tab, setTab] = useState('Standings');
  const { data: leagues, isLoading } = useQuery({ queryKey: ['leagues', game], queryFn: () => getLeagues(game) });
  const selected = leagues?.find((l) => String(l.id) === leagueId) || leagues?.[0];

  useEffect(() => { if (!leagueId && selected) navigate(`/leagues/${selected.id}`, { replace: true }); }, [leagueId, selected, navigate]);

  return (
    <>
      <section className="mb-8">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">Every match, every score, in one place.</h1>
        <p className="mt-3 max-w-xl text-slate-400">Follow community and school esports leagues. Check standings, see when your team plays, and find the top players.</p>
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by game">
          {['All', ...games].map((g) => (
            <button key={g} onClick={() => { setGame(g); navigate('/'); }} aria-pressed={game === g}
              className={`rounded-full border px-4 py-1.5 text-sm ${game === g ? 'border-volt bg-volt/10 text-volt' : 'border-ink-700 text-slate-300 hover:bg-ink-800'}`}>
              {g}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? <Spinner /> : !leagues?.length ? <Empty title={`No ${game} leagues yet`} hint="Try another game." /> : (
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <ul className="space-y-2">
            {leagues.map((l) => (
              <li key={l.id}>
                <Link to={`/leagues/${l.id}`} className={`panel block p-4 ${selected?.id === l.id ? 'border-volt' : 'hover:bg-ink-800'}`}>
                  <p className="font-display font-semibold text-white">{l.name}</p>
                  <p className="mt-1 text-sm text-ink-500">{l.game} · {l.teams} teams</p>
                  <div className="mt-2"><Badge status={l.status} /></div>
                </Link>
              </li>
            ))}
          </ul>

          <section className="panel min-w-0">
            <div className="flex gap-1 border-b border-ink-700 px-2" role="tablist">
              {TABS.map((t) => (
                <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                  className={`border-b-2 px-4 py-3 text-sm font-medium ${tab === t ? 'border-volt text-volt' : 'border-transparent text-slate-400 hover:text-white'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="p-2 sm:p-4">
              {selected && tab === 'Standings' && <Standings id={selected.id} />}
              {selected && tab === 'Schedule' && <Schedule id={selected.id} />}
              {selected && tab === 'Leaderboards' && <Leaderboards id={selected.id} />}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
