import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { demoLogin, loginWithGoogle } from '../services/authService.js';
import { USE_MOCK } from '../services/api.js';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname;
  const [error, setError] = useState('');

  const go = (u) => navigate(from || (u.role === 'ORGANIZER' ? '/organizer' : '/manager'), { replace: true });
  if (user) return <Navigate to={user.role === 'ORGANIZER' ? '/organizer' : '/manager'} replace />;

  const onGoogle = async ({ credential }) => {
    try { const data = await loginWithGoogle(credential); login(data); go(data.user); }
    catch { setError('Google sign-in worked, but the server rejected it. Check that the API is running.'); }
  };
  const onDemo = (role) => { const data = demoLogin(role); login(data); go(data.user); };

  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="panel p-6">
        <h1 className="text-2xl font-semibold">Sign in to manage your league or team</h1>
        <p className="mt-2 text-sm text-ink-500">Standings, schedules and leaderboards are public. You only need an account to run a league or manage a team.</p>
        <div className="mt-6 flex justify-center"><GoogleLogin onSuccess={onGoogle} onError={() => setError('Google sign-in was cancelled or failed.')} theme="filled_black" /></div>
        {error && <p className="mt-3 text-sm text-red-300" role="alert">{error}</p>}
        {USE_MOCK && (
          <div className="mt-6 border-t border-ink-700 pt-4">
            <p className="mb-2 text-sm text-ink-500">Demo mode (no backend):</p>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1" onClick={() => onDemo('TEAM_MANAGER')}>Team manager</button>
              <button className="btn-ghost flex-1" onClick={() => onDemo('ORGANIZER')}>Organizer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
