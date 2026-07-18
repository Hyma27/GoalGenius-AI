import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('gg_theme');
    return (saved as Theme) || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('gg_theme', next);
      return next;
    });
  };

  useEffect(() => {
    // Add theme class to both html and body tags for 100% selector coverage
    const htmlNode = window.document.documentElement;
    const bodyNode = window.document.body;
    
    // Add transition utility class
    bodyNode.classList.add('transition-colors', 'duration-300');
    
    if (theme === 'dark') {
      htmlNode.classList.add('dark');
      bodyNode.classList.add('dark');
    } else {
      htmlNode.classList.remove('dark');
      bodyNode.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
