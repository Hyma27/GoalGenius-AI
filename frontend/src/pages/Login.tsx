import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Trophy, Sun, Moon, ArrowRight, Shield, Globe, Users, 
  MapPin, HeartHandshake, Sparkles, AlertCircle
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsGuest, loginWithGoogle, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. For Operations use: director@worldcup2026.org');
      }
    } catch (err) {
      setError('An authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden font-sans p-4 md:p-8 lg:p-12">
      
      {/* FULL-SCREEN BACKGROUND STADIUM IMAGE */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-out scale-102 animate-kenburns pointer-events-none"
        style={{ backgroundImage: `url('/stadium.jpg')` }}
      />
      
      {/* 40-50% OPACITY DARK OVERLAY */}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
        theme === 'dark' ? 'bg-slate-950/65' : 'bg-slate-950/45'
      }`} />
      
      {/* BLUE-PURPLE GRADIENT OVERLAY (WITH 3PX BLUR FOR READABILITY) */}
      <div className={`absolute inset-0 pointer-events-none backdrop-blur-[3px] transition-all duration-300 bg-gradient-to-tr ${
        theme === 'dark' 
          ? 'from-blue-950/50 via-transparent to-purple-950/50' 
          : 'from-blue-900/35 via-transparent to-purple-900/35'
      }`} />

      {/* TOP RIGHT THEME TOGGLER */}
      <div className="absolute top-6 right-6 z-30">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 dark:bg-slate-950/40 hover:bg-white/20 dark:hover:bg-slate-900/60 text-white border border-white/20 dark:border-slate-800 transition-colors shadow-lg"
          title="Toggle UI Mode"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-orange-400" /> : <Moon className="w-5 h-5 text-blue-300" />}
        </button>
      </div>

      {/* DYNAMIC GRID CONTROLLER FOR RESPONSIVENESS */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
        {/* ========================================== */}
        {/* LEFT PANEL - BRAND & BADGES (60% W on desktop, stacked on tablet, hidden on mobile) */}
        {/* ========================================== */}
        <div className="hidden md:flex w-full lg:w-[58%] flex-col justify-between min-h-[460px] text-white">
          
          {/* Brand header */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-black text-base tracking-widest text-slate-100 uppercase">
                GoalGenius <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-extrabold border border-blue-500/30 ml-1">AI</span>
              </span>
            </div>
            
            <div className="mt-6">
              <span className="text-[10px] tracking-wider font-extrabold text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 w-fit block">
                SMARTER STADIUMS. BETTER MATCHDAYS.
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-white mt-3 leading-tight">
                Generative AI Stadium Intelligence Platform
              </h1>
              <p className="text-xs text-slate-300 max-w-lg mt-2 leading-relaxed">
                FIFA World Cup 2026 smart operations venue pilot. Orchestrating digital twins, pedestrian flows, transit integrations, and safety dispatches.
              </p>
            </div>
          </div>

          {/* Badges Grid (Glass cards) */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
            {[
              { title: "Live Match Intelligence", desc: "Predictive forecasts", icon: "⚽", delay: "animate-float-1" },
              { title: "Crowd Prediction", desc: "Density heatmaps", icon: "👥", delay: "animate-float-2" },
              { title: "Smart Navigation", desc: "Dynamic route safety", icon: "🗺️", delay: "animate-float-3" },
              { title: "Emergency Response", desc: "Instant announcements", icon: "🚨", delay: "animate-float-1" },
              { title: "AI Assistant", desc: "ChatGPT voice replies", icon: "🤖", delay: "animate-float-2" },
              { title: "Multi-language Support", desc: "7 Native locales", icon: "🌍", delay: "animate-float-3" },
            ].map((badge) => (
              <div 
                key={badge.title}
                className={`p-4 rounded-2xl bg-white/10 dark:bg-slate-950/30 border border-white/10 dark:border-slate-800/40 backdrop-blur-md shadow-sm transition-all hover:scale-102 flex gap-3 items-center ${badge.delay}`}
              >
                <span className="text-xl flex-shrink-0">{badge.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{badge.title}</h4>
                  <p className="text-[9px] text-slate-400 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>Powered by Generative AI</span>
          </div>

        </div>

        {/* ========================================== */}
        {/* RIGHT PANEL - LOGIN CARD (40% W on desktop, centered on mobile) */}
        {/* ========================================== */}
        <div className="w-full max-w-md lg:w-[38%] flex items-center justify-center p-1.5">
          
          <div className={`w-full p-6 md:p-8 rounded-[24px] border backdrop-blur-[18px] transition-all duration-300 shadow-2xl ${
            theme === 'dark' 
              ? 'bg-slate-950/45 border-slate-800/50 text-slate-100' 
              : 'bg-white/12 border-white/20 text-white'
          }`}>
            
            {/* Form Headers */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-black tracking-tight">Welcome Back</h2>
              <p className={`text-[10px] mt-1 ${
                theme === 'dark' ? 'text-slate-400' : 'text-white/70'
              }`}>Sign in to continue to the intelligence panel</p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-xl text-xs font-bold flex items-center gap-2 border bg-red-500/10 border-red-500/20 text-red-400 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
              
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold tracking-wide">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  className={`px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:bg-slate-950 focus:border-purple-500' 
                      : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400'
                  }`}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold tracking-wide">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`px-4 py-2.5 rounded-xl border focus:outline-none transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900/50 border-slate-800 text-slate-100 placeholder-slate-500 focus:bg-slate-950 focus:border-purple-500' 
                      : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/20 focus:border-blue-400'
                  }`}
                />
              </div>

              {/* Remember & Forgot options */}
              <div className="flex items-center justify-between text-[10px] font-bold mt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 dark:border-slate-800 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-transparent"
                  />
                  <span>Remember Me</span>
                </label>
                <button 
                  type="button" 
                  onClick={() => setError('Password resets disabled in sandbox.')}
                  className="hover:underline text-blue-400"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                
                {/* Submit Sign-in */}
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1 text-xs"
                >
                  {loading ? 'Verifying...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-xs ${
                    theme === 'dark' 
                      ? 'bg-slate-900/40 hover:bg-slate-800/50 border-slate-800 text-slate-200' 
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                >
                  <span>Continue with Google</span>
                </button>

                {/* Guest Sign-in */}
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className={`py-3 rounded-xl font-bold border transition-all flex items-center justify-center gap-2 text-xs ${
                    theme === 'dark' 
                      ? 'bg-slate-900/20 hover:bg-slate-850 border-slate-800/40 text-slate-300' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/90'
                  }`}
                >
                  <span>Continue as Guest</span>
                </button>

              </div>

            </form>

            <div className="text-center text-[10px] mt-6 border-t border-white/10 dark:border-slate-800/40 pt-4">
              <span className={theme === 'dark' ? 'text-slate-400' : 'text-white/60'}>Don't have an account? </span>
              <button 
                type="button"
                onClick={() => setError('Account registration disabled in sandbox.')}
                className="font-bold hover:underline text-blue-400"
              >
                Sign Up
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
