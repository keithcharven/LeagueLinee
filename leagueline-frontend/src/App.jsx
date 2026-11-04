import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HubPage from './pages/HubPage.jsx';
import TeamProfilePage from './pages/TeamProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RosterPage from './pages/manager/RosterPage.jsx';
import ProofPage from './pages/manager/ProofPage.jsx';
import VerificationPage from './pages/organizer/VerificationPage.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<HubPage />} />
        <Route path="leagues/:leagueId" element={<HubPage />} />
        <Route path="teams/:teamId" element={<TeamProfilePage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>

      {/* Team Manager */}
      <Route element={<ProtectedRoute roles={['TEAM_MANAGER']} />}>
        <Route path="manager" element={<DashboardLayout />}>
          <Route index element={<Navigate to="roster" replace />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="matches" element={<ComingSoon title="Match Center" note="Upcoming matches and opponent details will list here." />} />
          <Route path="proof" element={<ProofPage />} />
        </Route>
      </Route>

      {/* Organizer */}
      <Route element={<ProtectedRoute roles={['ORGANIZER']} />}>
        <Route path="organizer" element={<DashboardLayout />}>
          <Route index element={<Navigate to="verification" replace />} />
          <Route path="leagues" element={<ComingSoon title="Leagues & seasons" note="Create leagues, pick a game, set the season format, and open or close registration." />} />
          <Route path="registrations" element={<ComingSoon title="Registrations" note="Review pending team applications and approve or reject them." />} />
          <Route path="schedule" element={<ComingSoon title="Match scheduler" note="Create series between approved teams. Rescheduling triggers the email notification." />} />
          <Route path="verification" element={<VerificationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
