import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Globe, Sparkles, Key, CheckCircle, Sun, Moon
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gg_gemini_key') || '');
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gg_gemini_key', apiKey.trim());
    setTestResult('Key saved successfully. Fallback mode deactivated.');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) return;
    setTestingKey(true);
    setTestResult(null);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Hello" }] }] })
      });
      if (response.ok) {
        setTestResult('Connection Successful! Gemini API active.');
      } else {
        setTestResult('Connection Failed. Please check key validity and CORS policies.');
      }
    } catch (err) {
      setTestResult('Network error verifying API key.');
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          PREFERENCES CONTROL
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          System Settings & Integrations
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Adjust multilingual support parameters, customize UI themes, and input Gemini API configuration credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Language Selection */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <Globe className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
            Multilingual Options
          </h3>
          
          <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            {(
              [
                { id: 'en', label: 'English (US / UK)' },
                { id: 'es', label: 'Español (Spanish)' },
                { id: 'fr', label: 'Français (French)' },
                { id: 'pt', label: 'Português (Portuguese)' },
                { id: 'hi', label: 'हिन्दी (Hindi)' },
                { id: 'te', label: 'తెలుగు (Telugu)' },
                { id: 'ar', label: 'العربية (Arabic)' },
              ] as const
            ).map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`py-3 px-4 rounded-xl text-left border transition-all ${
                  language === lang.id 
                    ? 'bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900/40' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Theme Control & Gemini Key */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[350px]">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-4">
              <Key className="w-4.5 h-4.5 text-purple-500" />
              Generative AI Credentials (Gemini API)
            </h3>
            
            {testResult && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/60 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-4 animate-fadeIn">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{testResult}</span>
              </div>
            )}

            <form onSubmit={handleSaveKey} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Gemini Developer Key</label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save API Key
                </button>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={testingKey || !apiKey.trim()}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold disabled:opacity-50"
                >
                  {testingKey ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Toggle Theme Mode:</span>
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors text-slate-700 dark:text-slate-200"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-orange-500" /> : <Moon className="w-4 h-4 text-blue-500" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 italic text-[10px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span>If key is blank, High-Fidelity simulation responses are substituted for testing.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
