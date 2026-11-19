import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardPath, loginWithCredentials, loginWithGoogle } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const HAS_GOOGLE_OAUTH = Boolean(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('your-google-client-id'));

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const redirectAfterLogin = (profile) => {
    const fallback = getDashboardPath(profile.role);
    navigate(from && from !== '/login' && from !== '/register' ? from : fallback, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await loginWithCredentials({ email: email.trim(), password });
      login(data);
      redirectAfterLogin(data.user);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async ({ credential }) => {
    setError('');
    try {
      const data = await loginWithGoogle(credential);
      login(data);
      redirectAfterLogin(data.user);
    } catch (err) {
      setError(getErrorMessage(err, 'Google sign-in failed. Please try email and password.'));
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md">
      <div className="panel p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Sign in to LeagueLine</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Access your role-based dashboard to manage leagues, rosters, or follow tournaments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="login-password">Password</label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="input pr-10"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            <LogIn className="h-4 w-4" />
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {HAS_GOOGLE_OAUTH && (
          <div className="mt-6">
            <div className="relative mb-4 flex items-center justify-center">
              <div className="w-full border-t border-ink-700" />
              <span className="bg-ink-900 px-3 text-xs uppercase text-ink-500">or</span>
              <div className="w-full border-t border-ink-700" />
            </div>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogle}
                onError={() => setError('Google sign-in was cancelled or failed.')}
                theme="filled_black"
              />
            </div>
          </div>
        )}

        <p className="mt-6 border-t border-ink-700 pt-4 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-volt hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}