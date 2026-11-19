import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HubPage from './pages/HubPage.jsx';
import TeamProfilePage from './pages/TeamProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';
import ManagerDashboard from './pages/manager/ManagerDashboard.jsx';
import RosterPage from './pages/manager/RosterPage.jsx';
import ProofPage from './pages/manager/ProofPage.jsx';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard.jsx';
import VerificationPage from './pages/organizer/VerificationPage.jsx';
import FanDashboard from './pages/fan/FanDashboard.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HubPage />} />
        <Route path="leagues/:leagueId" element={<HubPage />} />
        <Route path="teams/:teamId" element={<TeamProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Team Manager Protected Routes */}
      <Route element={<ProtectedRoute roles={['TEAM_MANAGER']} />}>
        <Route path="manager" element={<DashboardLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="roster" element={<RosterPage />} />
          <Route path="matches" element={<ComingSoon title="Match Center" note="Upcoming matches and opponent details will appear here in the next increment." />} />
          <Route path="proof" element={<ProofPage />} />
        </Route>
      </Route>

      {/* League Organizer Protected Routes */}
      <Route element={<ProtectedRoute roles={['ORGANIZER']} />}>
        <Route path="organizer" element={<DashboardLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="leagues" element={<ComingSoon title="Leagues & Seasons" note="Create leagues, pick a game, set the season format, and open or close registration." />} />
          <Route path="registrations" element={<ComingSoon title="Registrations" note="Review pending team applications and approve or reject them." />} />
          <Route path="schedule" element={<ComingSoon title="Match Scheduler" note="Create series between approved teams and dispatch notifications." />} />
          <Route path="verification" element={<VerificationPage />} />
        </Route>
      </Route>

      {/* Fan / Player Protected Routes */}
      <Route element={<ProtectedRoute roles={['FAN']} />}>
        <Route path="fan" element={<DashboardLayout />}>
          <Route index element={<FanDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}