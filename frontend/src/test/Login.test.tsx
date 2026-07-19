import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { Login } from '../pages/Login';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Login />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

describe('Login Component Unit Tests', () => {
  it('renders brand layout and headers correctly', () => {
    renderLogin();
    expect(screen.getByText(/GoalGenius/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/director@worldcup2026.org/i)).toBeInTheDocument();
  });

  it('renders alternative auth action buttons', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue as Guest/i })).toBeInTheDocument();
  });
});
