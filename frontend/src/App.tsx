import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Sign-in route
import { Login } from './pages/Login';

// Lazily load route views for bundle code-splitting
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.Dashboard })));
const MatchPlanner = lazy(() => import('./pages/MatchPlanner').then(module => ({ default: module.MatchPlanner })));
const SmartNavigation = lazy(() => import('./pages/SmartNavigation').then(module => ({ default: module.SmartNavigation })));
const CrowdIntelligence = lazy(() => import('./pages/CrowdIntelligence').then(module => ({ default: module.CrowdIntelligence })));
const TravelCopilot = lazy(() => import('./pages/TravelCopilot').then(module => ({ default: module.TravelCopilot })));
const AccessibilityAssistant = lazy(() => import('./pages/AccessibilityAssistant').then(module => ({ default: module.AccessibilityAssistant })));
const OperationsCenter = lazy(() => import('./pages/OperationsCenter').then(module => ({ default: module.OperationsCenter })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));

// Loading skeleton fallback boundary
const SkeletonLoader: React.FC = () => (
  <div className="w-full flex flex-col gap-6 animate-pulse p-4">
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      ))}
    </div>
    <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl w-full"></div>
  </div>
);

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
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <Dashboard />
              </Suspense>
            } 
          />
          <Route 
            path="/match-planner" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <MatchPlanner />
              </Suspense>
            } 
          />
          <Route 
            path="/navigation" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <SmartNavigation />
              </Suspense>
            } 
          />
          <Route 
            path="/crowd-ai" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <CrowdIntelligence />
              </Suspense>
            } 
          />
          <Route 
            path="/travel" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <TravelCopilot />
              </Suspense>
            } 
          />
          <Route 
            path="/accessibility" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <AccessibilityAssistant />
              </Suspense>
            } 
          />
          <Route 
            path="/operations-hub" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <OperationsCenter />
              </Suspense>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <Reports />
              </Suspense>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Suspense fallback={<SkeletonLoader />}>
                <Settings />
              </Suspense>
            } 
          />
        </Route>

        {/* Fallback route redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
