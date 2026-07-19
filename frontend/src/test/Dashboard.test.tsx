import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SimulationProvider } from '../context/SimulationContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Dashboard } from '../pages/Dashboard';

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SimulationProvider>
            <Dashboard />
          </SimulationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component Unit Tests', () => {
  it('renders Row 1 operational status cards correctly', () => {
    renderDashboard();
    expect(screen.getByText(/FIFA Platform Director/i)).toBeInTheDocument();
    expect(screen.getByText(/Match day tracker/i)).toBeInTheDocument();
    expect(screen.getAllByText(/USA/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Concourse Weather/i)).toBeInTheDocument();
  });

  it('renders Row 2 capacity and system health indicators', () => {
    renderDashboard();
    expect(screen.getByText(/Crowd Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Transportation/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Fan Satisfaction/i)).toBeInTheDocument();
  });

  it('renders Row 3 Map features and upcoming fixture details', () => {
    renderDashboard();
    expect(screen.getByText(/Arena Interactive Routing Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Fixtures/i)).toBeInTheDocument();
  });
});
