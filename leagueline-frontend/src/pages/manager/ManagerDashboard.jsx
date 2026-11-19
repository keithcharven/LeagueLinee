import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, FileImage, Trophy, Users } from 'lucide-react';
import { getManagerDashboard } from '../../services/dashboardService.js';
import { Badge, PageHeader, Spinner } from '../../components/ui.jsx';

export default function ManagerDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['manager-dashboard'],
    queryFn: getManagerDashboard,
  });

  if (isLoading) return <Spinner label="Loading team manager portal" />;
  if (isError) {
    return (
      <div className="panel p-6 text-sm text-red-300" role="alert">
        Could not load Team Manager dashboard. Verify your backend server is running and you are signed in as a Team Manager.
      </div>
    );
  }

  const { user, stats, openLeaguesList } = data;

  const actions = [
    { to: '/manager/roster', title: 'Team & Roster', desc: 'Register your squad and manage starting players.', icon: Users },
    { to: '/manager/matches', title: 'Match Center', desc: 'Check scheduled series and opponent details.', icon: CalendarDays },
    { to: '/manager/proof', title: 'Submit Result Proof', desc: 'Upload post-match screenshots for organizer verification.', icon: FileImage },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.fullName}`}>
        <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-xs font-semibold text-volt">
          Team Manager
        </span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Leagues Open for Registration</span>
          <p className="mt-2 font-display text-3xl font-bold text-volt">{stats.openLeagues}</p>
        </div>
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Ongoing Leagues</span>
          <p className="mt-2 font-display text-3xl font-bold text-white">{stats.ongoingLeagues}</p>
        </div>
        <div className="panel p-4">
          <span className="text-xs uppercase tracking-wider text-ink-500">Account Email</span>
          <p className="mt-2 truncate text-sm font-medium text-white">{user.email}</p>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Team Manager Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {actions.map(({ to, title, desc, icon: Icon }) => (
            <Link key={to} to={to} className="panel flex flex-col gap-2 p-4 transition hover:border-volt">
              <div className="w-fit rounded-md bg-volt/10 p-2 text-volt">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-medium text-white">{title}</p>
              <p className="text-sm text-slate-400">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Trophy className="h-4 w-4 text-volt" /> Open Registration Leagues
          </h2>
          <Link to="/" className="text-xs font-semibold text-volt hover:underline">View all leagues</Link>
        </div>
        {!openLeaguesList?.length ? (
          <p className="text-sm text-ink-500">No leagues currently open for registration.</p>
        ) : (
          <ul className="divide-y divide-ink-700">
            {openLeaguesList.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-white">{l.name}</p>
                  <p className="text-xs text-ink-500">{l.game} · {l.season}</p>
                </div>
                <Badge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}