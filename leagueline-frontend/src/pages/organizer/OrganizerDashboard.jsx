import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, ClipboardCheck, Settings2, Shield, Trophy, UserPlus, Users } from 'lucide-react';
import { getOrganizerDashboard } from '../../services/dashboardService.js';
import { getRoleLabel } from '../../services/authService.js';
import { PageHeader, Spinner, fmtDate } from '../../components/ui.jsx';

export default function OrganizerDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['organizer-dashboard'],
    queryFn: getOrganizerDashboard,
  });

  if (isLoading) return <Spinner label="Loading organizer console" />;
  if (isError) {
    return (
      <div className="panel p-6 text-sm text-red-300" role="alert">
        Could not load organizer dashboard data. Verify your backend server is running and you are signed in as an Organizer.
      </div>
    );
  }

  const { user, stats, recentUsers } = data;

  const cards = [
    { label: 'Total Accounts', value: stats.totalUsers, icon: Users },
    { label: 'Team Managers', value: stats.teamManagers, icon: Shield },
    { label: 'Active Leagues', value: stats.totalLeagues, icon: Trophy },
    { label: 'Open Registration', value: stats.openRegistrationLeagues, icon: UserPlus },
  ];

  const actions = [
    { to: '/organizer/leagues', title: 'Leagues & Seasons', desc: 'Create leagues and manage tournament status.', icon: Settings2 },
    { to: '/organizer/registrations', title: 'Team Registrations', desc: 'Approve or reject incoming team applications.', icon: UserPlus },
    { to: '/organizer/schedule', title: 'Match Scheduler', desc: 'Schedule and update official match series.', icon: CalendarDays },
    { to: '/organizer/verification', title: 'Result Verification', desc: 'Inspect screenshots and publish official scores.', icon: ClipboardCheck },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${user.fullName}`}>
        <span className="rounded-full border border-volt/40 bg-volt/10 px-3 py-1 text-xs font-semibold text-volt">
          League Organizer
        </span>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel p-4">
            <div className="flex items-center justify-between text-ink-500">
              <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
              <Icon className="h-4 w-4 text-volt" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Organizer Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {actions.map(({ to, title, desc, icon: Icon }) => (
            <Link key={to} to={to} className="panel flex items-start gap-3 p-4 transition hover:border-volt">
              <div className="rounded-md bg-volt/10 p-2 text-volt">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-white">{title}</p>
                <p className="mt-0.5 text-sm text-slate-400">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="border-b border-ink-700 px-4 py-3">
          <h2 className="text-base font-semibold">Recently Registered Accounts (Live Database)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-ink-950/60 text-xs uppercase text-ink-500">
              <tr>
                <th className="p-3">Full Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-t border-ink-700">
                  <td className="p-3 font-medium text-white">{u.fullName}</td>
                  <td className="p-3 text-slate-300">{u.email}</td>
                  <td className="p-3">
                    <span className="rounded bg-ink-800 px-2 py-0.5 text-xs font-medium text-volt">
                      {getRoleLabel(u.role)}
                    </span>
                  </td>
                  <td className="p-3 text-ink-500">{u.createdAt ? fmtDate(u.createdAt) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}