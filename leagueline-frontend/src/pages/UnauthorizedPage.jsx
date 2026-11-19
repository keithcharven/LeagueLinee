import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getDashboardPath, getRoleLabel } from '../services/authService.js';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const home = user ? getDashboardPath(user.role) : '/login';

  return (
    <div className="mx-auto mt-12 max-w-md text-center">
      <div className="panel p-8">
        <ShieldAlert className="mx-auto h-10 w-10 text-red-400" />
        <h1 className="mt-4 text-2xl font-bold">Access Restricted</h1>
        <p className="mt-2 text-sm text-slate-400">
          {user
            ? `Your account role (${getRoleLabel(user.role)}) does not have permission to view that page.`
            : 'Please sign in with an authorized account to continue.'}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={home} className="btn-primary">
            {user ? 'Go to my dashboard' : 'Sign in'}
          </Link>
          <Link to="/" className="btn-ghost">Public Hub</Link>
        </div>
      </div>
    </div>
  );
}