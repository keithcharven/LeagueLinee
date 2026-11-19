import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ClipboardCheck,
  FileImage,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  Shield,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getRoleLabel } from '../services/authService.js';

const NAV = {
  ORGANIZER: [
    { to: '/organizer', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/organizer/leagues', label: 'Leagues & seasons', icon: Settings2 },
    { to: '/organizer/registrations', label: 'Registrations', icon: UserPlus },
    { to: '/organizer/schedule', label: 'Match scheduler', icon: CalendarDays },
    { to: '/organizer/verification', label: 'Result verification', icon: ClipboardCheck },
  ],
  TEAM_MANAGER: [
    { to: '/manager', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/manager/roster', label: 'Team & roster', icon: Users },
    { to: '/manager/matches', label: 'Match center', icon: CalendarDays },
    { to: '/manager/proof', label: 'Submit result proof', icon: FileImage },
  ],
  FAN: [
    { to: '/fan', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/', label: 'Public League Hub', icon: Trophy, end: true },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const links = NAV[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/" className="flex h-14 items-center gap-2 border-b border-ink-700 px-4 font-display text-lg font-bold text-white">
        <Trophy className="h-5 w-5 text-volt" /> LeagueLine
      </Link>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                isActive ? 'bg-volt/10 text-volt' : 'text-slate-300 hover:bg-ink-800'
              }`
            }
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-ink-700 p-3">
        <p className="flex items-center gap-2 px-3 text-sm font-medium text-white">
          <Shield className="h-4 w-4 shrink-0 text-volt" />
          <span className="truncate">{user?.fullName || user?.name}</span>
        </p>
        <p className="truncate px-3 text-xs text-ink-500">{user?.email}</p>
        <p className="mb-3 mt-1 px-3 text-xs font-semibold uppercase tracking-wider text-volt">
          {getRoleLabel(user?.role)}
        </p>
        <button
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-ink-800"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 border-r border-ink-700 bg-ink-900 md:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-ink-900">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex h-14 items-center justify-between border-b border-ink-700 px-4 md:hidden">
          <button aria-label="Open menu" onClick={() => setOpen(true)}>
            {open ? <X /> : <Menu />}
          </button>
          <span className="font-display text-sm font-semibold text-volt">{getRoleLabel(user?.role)}</span>
        </div>
        <main className="mx-auto max-w-5xl p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}