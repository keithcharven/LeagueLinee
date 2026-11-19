import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Check, Eye, EyeOff, Shield, Trophy, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardPath, registerUser } from '../services/authService.js';
import { getErrorMessage } from '../services/api.js';

const ROLES = [
  {
    value: 'TEAM_MANAGER',
    title: 'Team Manager',
    desc: 'Register teams, manage rosters, and upload match proofs.',
    icon: Users,
  },
  {
    value: 'ORGANIZER',
    title: 'League Organizer',
    desc: 'Create leagues, approve teams, schedule & verify matches.',
    icon: Shield,
  },
  {
    value: 'FAN',
    title: 'Fan / Player',
    desc: 'Follow leagues, standings, match schedules, and K/D/A stats.',
    icon: Trophy,
  },
];

export default function RegisterPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'TEAM_MANAGER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [key]: '' }));
    setError('');
  };

  const passwordChecks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    digit: /\d/.test(form.password),
  };

  const validate = () => {
    const errs = {};
    if (form.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!passwordChecks.length || !passwordChecks.upper || !passwordChecks.lower || !passwordChecks.digit) {
      errs.password = 'Password must be at least 8 characters and include uppercase, lowercase, and a number.';
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const data = await registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      login(data);
      navigate(getDashboardPath(data.user.role), { replace: true });
    } catch (err) {
      const serverFieldErrors = err?.response?.data?.fieldErrors;
      if (serverFieldErrors) {
        setFieldErrors(serverFieldErrors);
      }
      setError(getErrorMessage(err, 'Could not create account. Please check your details.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-lg">
      <div className="panel p-6 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create your LeagueLine account</h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Choose your role to get access to your dedicated esports management dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              className="input"
              placeholder="e.g. Keith Canada"
              value={form.fullName}
              onChange={setField('fullName')}
              required
            />
            {fieldErrors.fullName && <p className="mt-1 text-xs text-red-300">{fieldErrors.fullName}</p>}
          </div>

          <div>
            <label className="label" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField('email')}
              required
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-300">{fieldErrors.email}</p>}
          </div>

          <fieldset>
            <legend className="label">Account role</legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {ROLES.map(({ value, title, desc, icon: Icon }) => {
                const selected = form.role === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, role: value }))}
                    className={`rounded-lg border p-3 text-left transition ${
                      selected
                        ? 'border-volt bg-volt/10 text-white'
                        : 'border-ink-700 bg-ink-950 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <Icon className={`mb-2 h-4 w-4 ${selected ? 'text-volt' : 'text-ink-500'}`} />
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{desc}</p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="input pr-10"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={setField('password')}
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
              {fieldErrors.password && <p className="mt-1 text-xs text-red-300">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="label" htmlFor="reg-confirm">Confirm password</label>
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="input"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={setField('confirmPassword')}
                required
              />
              {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-300">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          <ul className="grid grid-cols-2 gap-1.5 rounded-md border border-ink-700 bg-ink-950 p-3 text-xs">
            {[
              ['length', '8+ characters'],
              ['upper', 'Uppercase letter (A-Z)'],
              ['lower', 'Lowercase letter (a-z)'],
              ['digit', 'Number (0-9)'],
            ].map(([key, label]) => (
              <li key={key} className={`flex items-center gap-1.5 ${passwordChecks[key] ? 'text-emerald-300' : 'text-ink-500'}`}>
                <Check className="h-3.5 w-3.5" /> {label}
              </li>
            ))}
          </ul>

          {error && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            <UserPlus className="h-4 w-4" />
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 border-t border-ink-700 pt-4 text-center text-sm text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-volt hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}