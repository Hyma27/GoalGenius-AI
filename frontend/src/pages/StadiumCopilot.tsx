import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  Compass, AlertTriangle, ShieldCheck, Thermometer, CloudRain, Sun, 
  Users, Activity, Sparkles, Send, RefreshCw, Layers
} from 'lucide-react';

export const StadiumCopilot: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  const {
    weather, overallOccupancy, riskLevel, emergencyAlert, volunteers,
    injectEvent, gates
  } = useSimulation();

  const [command, setCommand] = useState('');
  const [copilotResponses, setCopilotResponses] = useState<string[]>([
    "Stadium Copilot System Active. All gates monitored. Standard intake flows predicted."
  ]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || loading) return;

    const prompt = `
      You are the AI Stadium Copilot operator. Analyze and respond to this command:
      - Command: "${command}"
      - Current Occupancy: ${overallOccupancy}%
      - Risk Level: ${riskLevel}
      - Roof State: ${weather.roofState}
      - Temp: ${weather.temp}°F
      Provide immediate action items or analysis. Keep it concise (1-3 sentences).
    `;

    try {
      const response = await askGemini(prompt, 'copilot', language);
      setCopilotResponses(prev => [response.text, ...prev]);
      setCommand('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          AI OPERATIONAL STEWARD
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          AI Stadium Copilot
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Real-time AI telemetry analysis, predictive crowd anomalies, and automated safety overrides.
        </p>
      </div>

      {/* Grid: Live Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Risk Level Card */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">AI Assessed Risk</span>
            <AlertTriangle className={`w-4 h-4 ${riskLevel === 'HIGH' ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div>
            <span className={`text-2xl font-black ${
              riskLevel === 'HIGH' ? 'text-red-500 animate-pulse' : riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
            }`}>
              {riskLevel} RISK
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">Based on active gate queues</p>
          </div>
        </div>

        {/* Roof & Weather Status */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Roof Status</span>
            {weather.condition === 'Clear' ? <Sun className="w-4 h-4 text-orange-400" /> : <CloudRain className="w-4 h-4 text-blue-500" />}
          </div>
          <div>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">
              {weather.roofState} ({weather.temp}°F)
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">{weather.condition} • Rain Prob: {weather.rainProb}%</p>
          </div>
        </div>

        {/* Live Occupancy Index */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Seat Density</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {overallOccupancy}%
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">MetLife seats occupied</p>
          </div>
        </div>

        {/* Volunteers on Shift */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[9px] font-bold uppercase tracking-wider">Active Staff Roster</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {volunteers.active} / {volunteers.total}
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5">{volunteers.standby} staff standby reservists</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Direct Command Override Console */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[420px]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">AI Copilot Terminal</h3>
                <p className="text-[10px] text-slate-400">Query systems or request manual dispatch overrides</p>
              </div>
            </div>

            {/* Interactive list of response feeds */}
            <div className="flex flex-col gap-3 mt-4 h-64 overflow-y-auto pr-2 scrollbar-thin">
              {copilotResponses.map((res, index) => (
                <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  <span className="text-blue-500 font-bold block mb-1">STADIUM COPILOT &gt;&gt;</span>
                  {res}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleCommandSubmit} className="flex gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-2">
            <input 
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              placeholder="Input tactical directive (e.g. 'Deploy backup cleaners to Sec 104' or 'Check Metro line 2')"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100"
              required
            />
            <button 
              type="submit"
              disabled={loading || !command.trim()}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center disabled:opacity-50 shadow-md shadow-blue-500/10"
              aria-label="Send directive command"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>

        {/* Right: Operations Event Injector Controls */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Simulate Concourse Events</h3>
            <p className="text-[10px] text-slate-400 mb-4">Trigger weather or delay alerts to test AI response times</p>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => injectEvent('STORM')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 hover:dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 text-left px-4 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span>Trigger Sudden Rain Storm</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-600">STORM</span>
              </button>

              <button 
                onClick={() => injectEvent('METRO_DELAY')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 hover:dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 text-left px-4 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span>Simulate Metro Line 2 Delay</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600">DELAY</span>
              </button>

              <button 
                onClick={() => injectEvent('GOAL')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 hover:dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 text-left px-4 flex items-center justify-between transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span>Register Stadium Goal Event</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">GOAL</span>
              </button>

              <button 
                onClick={() => injectEvent('EVACUATION')}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold rounded-xl text-white text-left px-4 flex items-center justify-between transition-colors shadow-sm"
              >
                <span>Initiate Evacuation Drill</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 text-white font-extrabold">DRILL</span>
              </button>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center gap-1 mt-4">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span>Evacuation drills trigger sirens and close standard entrances.</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};
