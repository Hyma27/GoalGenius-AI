import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../context/LanguageContext';
import { AIChatBot } from '../components/AIChatBot';

describe('AIChatBot Component Unit Tests', () => {
  it('renders floating trigger bubble button', () => {
    render(
      <LanguageProvider>
        <AIChatBot />
      </LanguageProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles chat modal open showing suggested prompts grid', () => {
    render(
      <LanguageProvider>
        <AIChatBot />
      </LanguageProvider>
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(screen.getByText(/GoalGenius Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Find my seat/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message World Cup Assistant/i)).toBeInTheDocument();
  });
});
