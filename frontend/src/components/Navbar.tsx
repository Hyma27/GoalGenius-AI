import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useSimulation } from '../context/SimulationContext';
import { 
  Trophy, Sun, Moon, Bell, Search, LogOut, ChevronDown, User,
  Calendar, MapPin, Users, Navigation, ShieldAlert, FileText, Settings, Sparkles, Menu, X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { emergencyAlert, incidents } = useSimulation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  const isActive = (path: string) => {
    return location.pathname === path 
      ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/30' 
      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400';
  };

  const closeAll = () => {
    setShowNotifications(false);
    setShowProfileMenu(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/copilot', label: 'Stadium Copilot' },
    { path: '/match-planner', label: 'Match Planner' },
    { path: '/navigation', label: 'Smart Navigation' },
    { path: '/crowd-ai', label: 'Crowd Intelligence' },
    { path: '/travel', label: 'Smart Travel' },
    { path: '/accessibility', label: 'Accessibility' },
    { path: '/sustainability', label: 'Sustainability' },
    { path: '/volunteer-allocation', label: 'Volunteer Roster' },
    { path: '/operations-hub', label: 'Operations Hub' },
    { path: '/reports', label: 'Reports' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/80 px-4 md:px-8 py-3.5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand/Logo */}
        <Link to="/dashboard" onClick={closeAll} className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
            <Trophy className="w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100">
              GoalGenius <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-extrabold ml-0.5">AI</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium tracking-wider">FIFA WORLD CUP 2026</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={closeAll} 
              className={`transition-all px-3 py-2 rounded-xl ${isActive(link.path)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="w-40 lg:w-48 bg-slate-100/60 dark:bg-slate-800/60 text-xs px-3 py-2 pl-8 rounded-xl border border-slate-200/40 dark:border-slate-700/40 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-950 text-slate-700 dark:text-slate-200 transition-all duration-300"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm border border-slate-200/20 dark:border-slate-700/20"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* System Alerts */}
          <div className="relative">
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors relative shadow-sm border border-slate-200/20 dark:border-slate-700/20"
            >
              <Bell className="w-4 h-4" />
              {(emergencyAlert || activeIncidents.length > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-2 transition-colors duration-300">
                <span className="font-semibold text-xs text-slate-400 dark:text-slate-500">LIVE SYSTEM ALERTS</span>
                
                {emergencyAlert && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs flex gap-2">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Emergency Active</p>
                      <p className="mt-0.5 leading-relaxed">{emergencyAlert}</p>
                    </div>
                  </div>
                )}

                {activeIncidents.length > 0 ? (
                  activeIncidents.map(inc => (
                    <div key={inc.id} className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs flex gap-2 transition-colors">
                      <span className={`w-1.5 h-1.5 mt-1.5 rounded-full ${inc.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : inc.severity === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{inc.type}</p>
                        <p className="text-[10px] text-slate-400">{inc.location} • {inc.time}</p>
                      </div>
                    </div>
                  ))
                ) : !emergencyAlert ? (
                  <p className="text-center py-4 text-xs text-slate-400">All systems operating within normal parameters.</p>
                ) : null}
              </div>
            )}
          </div>

          {/* User profile avatar / logout dropdown */}
          {user && (
            <div className="relative">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 text-xs focus:outline-none"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm border border-white dark:border-slate-800 uppercase">
                  {user.name.charAt(0)}
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xl z-50 flex flex-col gap-1 transition-colors duration-300">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80">
                    <p className="font-semibold text-xs text-slate-700 dark:text-slate-200 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                    <span className="inline-block text-[9px] mt-1.5 font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      closeAll();
                    }}
                    className="flex items-center gap-2 w-full p-2 text-left text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hamburger Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/20 dark:border-slate-700/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </div>

      {/* Mobile Nav Menu Drawer */}
      {mobileMenuOpen && (
        <nav className="xl:hidden mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-1.5 text-xs font-semibold">
          {navLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              onClick={closeAll} 
              className={`transition-all px-4 py-3 rounded-xl ${isActive(link.path)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};
