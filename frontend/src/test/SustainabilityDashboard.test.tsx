import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SimulationProvider } from '../context/SimulationContext';
import { LanguageProvider } from '../context/LanguageContext';
import { SustainabilityDashboard } from '../pages/SustainabilityDashboard';

import { vi } from 'vitest';

// Mock Recharts responsive container to avoid drawing dimensions errors during test environment runs
vi.mock('recharts', async (importOriginal) => {
  const originalModule = await importOriginal<any>();
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: '100%', height: '100%' }}>{children}</div>
    ),
  };
});

const renderSustainability = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SimulationProvider>
            <SustainabilityDashboard />
          </SimulationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('SustainabilityDashboard Component Unit Tests', () => {
  it('renders sustainability headers and carbon statistics correctly', () => {
    renderSustainability();
    expect(screen.getByText(/Sustainability Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Carbon Offset Saved/i)).toBeInTheDocument();
    expect(screen.getByText(/Current Energy Draw/i)).toBeInTheDocument();
  });
});
