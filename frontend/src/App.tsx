import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MatchPlanner } from './pages/MatchPlanner';
import { SmartNavigation } from './pages/SmartNavigation';
import { CrowdIntelligence } from './pages/CrowdIntelligence';
import { TravelCopilot } from './pages/TravelCopilot';
import { AccessibilityAssistant } from './pages/AccessibilityAssistant';
import { OperationsCenter } from './pages/OperationsCenter';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public authentication gate */}
        <Route path="/login" element={<Login />} />

        {/* Default root path redirects to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Dashboard console layout with flat paths */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/match-planner" element={<MatchPlanner />} />
          <Route path="/navigation" element={<SmartNavigation />} />
          <Route path="/crowd-ai" element={<CrowdIntelligence />} />
          <Route path="/travel" element={<TravelCopilot />} />
          <Route path="/accessibility" element={<AccessibilityAssistant />} />
          <Route path="/operations-hub" element={<OperationsCenter />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
