import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  isGuest: boolean;
  role: 'admin' | 'fan' | 'volunteer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Basic verification for demo/hackathon deployment
    if (email && password) {
      const isOps = email.includes('ops') || email.includes('admin');
      const isVol = email.includes('volunteer');
      const displayName = email.split('@')[0];

      const newUser: User = {
        email,
        name: isOps
          ? "FIFA Stadium Director"
          : isVol
          ? "Voluntario Carlos"
          : displayName,
        isGuest: false,
        role: isOps ? 'admin' : isVol ? 'volunteer' : 'fan'
      };
      setUser(newUser);
      localStorage.setItem('gg_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      email: "guest@worldcup2026.org",
      name: "Guest Fan",
      isGuest: true,
      role: 'fan'
    };
    setUser(guestUser);
    localStorage.setItem('gg_user', JSON.stringify(guestUser));
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      email: "google.user@gmail.com",
      name: "Sam Wilson",
      isGuest: false,
      role: 'fan'
    };
    setUser(googleUser);
    localStorage.setItem('gg_user', JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gg_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsGuest, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
