import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { SimulationProvider } from '../context/SimulationContext';
import { LanguageProvider } from '../context/LanguageContext';
import { StadiumCopilot } from '../pages/StadiumCopilot';

const renderCopilot = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SimulationProvider>
            <StadiumCopilot />
          </SimulationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('StadiumCopilot Component Unit Tests', () => {
  it('renders copilot header and risk assessed telemetries correctly', () => {
    renderCopilot();
    expect(screen.getByText(/AI Stadium Copilot/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Assessed Risk/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Copilot Terminal/i)).toBeInTheDocument();
  });
});
