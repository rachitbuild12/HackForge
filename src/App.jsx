import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HackForgeProvider } from './context/HackForgeContext';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import HackathonDiscovery from './pages/HackathonDiscovery';
import HackathonDetail from './pages/HackathonDetail';
import TeamWorkspace from './pages/TeamWorkspace';
import QuestBoard from './pages/QuestBoard';
import DevelopmentActivity from './pages/DevelopmentActivity';
import AICopilot from './pages/AICopilot';
import PassportPage from './pages/PassportPage';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerControlCenter from './pages/OrganizerControlCenter';
import IntegrityMonitoring from './pages/IntegrityMonitoring';
import ProjectScopePage from './pages/ProjectScopePage';
import HackathonWizard from './pages/HackathonWizard';
import JudgeDashboard from './pages/JudgeDashboard';
import Profile from './pages/Profile';
import GamificationHub from './pages/GamificationHub';
import DemoModePage from './pages/DemoModePage';
import DemoFlowController from './components/DemoFlowController';

export default function App() {
  return (
    <HackForgeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <DemoFlowController />
          <div className="main-content">
            <Routes>
              {/* Demo Mode Hub */}
              <Route path="/demo" element={<DemoModePage />} />

              {/* Landing & Auth */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />

              {/* Participant & Team Views */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hackathons" element={<HackathonDiscovery />} />
              <Route path="/hackathons/:id" element={<HackathonDetail />} />
              <Route path="/hackathons/:id/team" element={<TeamWorkspace />} />
              <Route path="/hackathons/:id/quests" element={<QuestBoard />} />
              <Route path="/hackathons/:id/leaderboard" element={<GamificationHub />} />
              <Route path="/leaderboard" element={<GamificationHub />} />
              <Route path="/gamification" element={<GamificationHub />} />
              <Route path="/hackathons/:id/activity" element={<DevelopmentActivity />} />
              <Route path="/hackathons/:id/ai" element={<AICopilot />} />
              <Route path="/hackathons/:id/scope" element={<ProjectScopePage />} />
              <Route path="/hackathons/:id/passport" element={<PassportPage />} />

              {/* Organizer Portal */}
              <Route path="/organizer" element={<OrganizerDashboard />} />
              <Route path="/organizer/create" element={<HackathonWizard />} />
              <Route path="/organizer/hackathons/:id" element={<OrganizerControlCenter />} />
              <Route path="/organizer/hackathons/:id/integrity" element={<IntegrityMonitoring />} />
              <Route path="/organizer/hackathons/:id/scope" element={<ProjectScopePage />} />

              {/* Judge Station */}
              <Route path="/judge" element={<JudgeDashboard />} />

              {/* Public Verification Link */}
              <Route path="/verify/:passportId" element={<PassportPage isPublicVerification={true} />} />
              <Route path="/verify" element={<PassportPage isPublicVerification={true} />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </HackForgeProvider>
  );
}
