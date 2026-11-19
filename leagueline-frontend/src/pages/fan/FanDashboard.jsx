import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { getFanDashboard } from '../../services/dashboardService.js';
import { Badge, PageHeader, Spinner } from '../../components/ui.jsx';

export default function FanDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fan-dashboard'],
    queryFn: getFanDashboard,
  });

  if (isLoading) return <Spinner label="Loading player & fan hub" />;
  if (isError) {
    return (
      <div className="panel p-6 text-sm text-red-300" role="alert">
        Could not load Fan dashboard. Verify your backend server is running.
      </div>
    );
  }

  const { user, stats, leagues } = data;

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.fullName}`}>
        <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-xs font-semibold text-volt">
          Fan / Player
        </span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Active Leagues</span>
          <p className="mt-2 font-display text-3xl font-bold text-volt">{stats.totalLeagues}</p>
        </div>
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Ongoing Tournaments</span>
          <p className="mt-2 font-display text-3xl font-bold text-white">{stats.ongoingLeagues}</p>
        </div>
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Signed in as</span>
          <p className="mt-2 truncate text-sm font-medium text-white">{user.email}</p>
        </div>
      </div>

      <section className="panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Trophy className="h-4 w-4 text-volt" /> Community & School Esports Leagues
          </h2>
          <Link to="/" className="btn-primary py-1.5 text-xs">Explore Standings & Schedules</Link>
        </div>
        {!leagues?.length ? (
          <p className="text-sm text-ink-500">No leagues available yet.</p>
        ) : (
          <ul className="divide-y divide-ink-700">
            {leagues.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3 text-sm">
                <Link to={`/leagues/${l.id}`} className="font-medium text-white hover:text-volt">
                  {l.name}
                  <span className="ml-2 text-xs font-normal text-ink-500">{l.game} · {l.season}</span>
                </Link>
                <Badge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}