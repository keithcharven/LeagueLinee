import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardPath, getRoleLabel } from '../services/authService.js';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const home = user ? getDashboardPath(user.role) : '/login';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <Trophy className="h-5 w-5 text-volt" /> LeagueLine
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'text-volt' : 'text-slate-300 hover:text-white')}>
              Leagues
            </NavLink>
            {user ? (
              <>
                <Link to={home} className="text-slate-300 hover:text-white">Dashboard</Link>
                <span className="rounded-full border border-ink-700 bg-ink-900 px-3 py-1 text-xs text-volt">
                  {user.fullName || user.name} · {getRoleLabel(user.role)}
                </span>
                <button className="btn-ghost py-1" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost py-1.5">Sign in</Link>
                <Link to="/register" className="btn-primary py-1.5">Create account</Link>
              </>
            )}
          </nav>
          <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="flex flex-col gap-3 border-t border-ink-700 px-4 py-3 text-sm md:hidden" onClick={() => setOpen(false)}>
            <Link to="/">Leagues</Link>
            {user ? (
              <>
                <Link to={home}>Dashboard ({getRoleLabel(user.role)})</Link>
                <button className="text-left text-red-300" onClick={handleLogout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link to="/register" className="text-volt">Create account</Link>
              </>
            )}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
    </div>
  );
}