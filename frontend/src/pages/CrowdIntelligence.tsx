import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { Users, Timer, HelpCircle, ShieldCheck, ArrowRightLeft, Sparkles, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const CrowdIntelligence: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  const { gates, overallOccupancy } = useSimulation();

  const [aiCrowdInsight, setAiCrowdInsight] = useState(
    "AI Recommendation: Gate B is currently congested (94% capacity). Reroute Sector 2 traffic via Concourse Walk to Gate D (30% capacity, wait time < 3 mins) to restore intake flow rates."
  );

  const fetchCrowdInsight = async () => {
    const prompt = `
      Analyze this stadium crowd distribution:
      ${gates.map(g => `- ${g.name}: wait ${g.waitTime}m, capacity ${g.occupancy}%`).join('\n')}
      Overall stadium seat occupancy is ${overallOccupancy}%.
      Provide a highly precise dynamic crowd flow redirection recommendation. Keep it under two sentences.
    `;
    try {
      const response = await askGemini(prompt, 'crowd', language);
      setAiCrowdInsight(response.text);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCrowdInsight();
  }, []);

  // Predicted wait times over matchday timelines
  const crowdPredictionData = [
    { time: 'T-3h', GateB: 5, GateD: 2, GateE: 3 },
    { time: 'T-2h', GateB: 12, GateD: 4, GateE: 8 },
    { time: 'T-1h', GateB: 28, GateD: 6, GateE: 22 },
    { time: 'Kickoff', GateB: 15, GateD: 3, GateE: 10 },
    { time: 'HalfTime', GateB: 35, GateD: 10, GateE: 28 },
    { time: 'Exit', GateB: 45, GateD: 15, GateE: 38 },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
            CROWD TELEMETRY
          </span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
            Crowd Intelligence & Forecasts
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Predict future queue bottlenecks and optimize entry flow ratios dynamically.
          </p>
        </div>

        <button 
          onClick={fetchCrowdInsight}
          disabled={loading}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Insights</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Average Wait Time</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">
            {Math.round(gates.reduce((sum, g) => sum + g.waitTime, 0) / gates.length)} mins
          </span>
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Stadium Density Index</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{overallOccupancy}%</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Intake Flow State</span>
          <span className="text-2xl font-black text-emerald-500 mt-2">STABLE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Future Queue prediction chart */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Queue Delay Forecast Timeline</h3>
              <p className="text-[10px] text-slate-400">Predicted wait times (min) for major gates</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-bold">
              <span className="text-blue-500">Gate B</span>
              <span className="text-purple-500">Gate E</span>
              <span className="text-teal-500">Gate D</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crowdPredictionData}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} unit="m" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="GateB" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="GateE" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="GateD" stroke="#14b8a6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Load balancing recommendations */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              AI Crowd Flow Suggestions
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Dynamic redirections recommended by Gemini</p>
            
            <div className="p-4 bg-blue-50/40 dark:bg-slate-900/40 border border-blue-100/55 dark:border-blue-900/40 rounded-2xl text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
              {loading ? (
                <div className="flex items-center gap-2 py-4 justify-center">
                  <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-[9px] text-slate-400 animate-pulse">Running crowd flow calculations...</span>
                </div>
              ) : (
                aiCrowdInsight
              )}
            </div>
          </div>

          <div className="text-[9px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            Flow optimization engine active.
          </div>
        </div>

      </div>

      {/* Crowd Heatmap Layout Section */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Real-time Crowd Heatmap</h3>
          <p className="text-[10px] text-slate-400 mb-4">Visual density representation of stadium concourses and entry plazas.</p>
          
          <div className="flex flex-col gap-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> High Congestion (&gt; 80% Occupancy)</span>
              <span className="font-bold text-red-500">Gate B, Gate E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Moderate Intake (40% - 80% Occupancy)</span>
              <span className="font-bold text-amber-500">Gate C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Free Flowing (&lt; 40% Occupancy)</span>
              <span className="font-bold text-emerald-500">Gate A, Gate D, Gate F</span>
            </div>
          </div>
        </div>

        {/* Heatmap Graphic Area */}
        <div className="w-full max-w-[360px] aspect-[4/3] relative border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-900 p-4 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-4 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center">
            {/* Field */}
            <div className="w-1/2 h-1/2 bg-emerald-850 rounded border border-white/20 flex items-center justify-center">
              <span className="text-[8px] text-white/20 uppercase font-extrabold tracking-wider">MetLife Pitch</span>
            </div>
          </div>

          {/* Sector Highlight Overlays (Heatmap Color Nodes) */}
          {/* Top (Gate A) - Green */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-8 bg-emerald-500/25 border border-emerald-400 rounded-full blur-[2px] flex items-center justify-center text-[8px] text-emerald-400 font-bold uppercase">A: 42%</div>
          
          {/* Left (Gate B) - Red */}
          <div className="absolute top-1/2 left-2 -translate-y-1/2 w-14 h-8 bg-red-500/35 border border-red-500 rounded-full blur-[2px] flex items-center justify-center text-[8px] text-red-400 font-bold uppercase animate-pulse">B: 94%</div>
          
          {/* Right (Gate C) - Yellow */}
          <div className="absolute top-1/2 right-2 -translate-y-1/2 w-14 h-8 bg-amber-500/25 border border-amber-400 rounded-full blur-[2px] flex items-center justify-center text-[8px] text-amber-400 font-bold uppercase">C: 85%</div>
          
          {/* Bottom (Gate D) - Green */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-8 bg-emerald-500/25 border border-emerald-400 rounded-full blur-[2px] flex items-center justify-center text-[8px] text-emerald-400 font-bold uppercase">D: 30%</div>

          {/* Gate E - Red */}
          <div className="absolute top-12 right-12 w-14 h-8 bg-red-500/35 border border-red-500 rounded-full blur-[2px] flex items-center justify-center text-[8px] text-red-400 font-bold uppercase animate-pulse">E: 88%</div>
        </div>
      </div>

      {/* Grid listing all Gates */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {gates.map(gate => (
          <div key={gate.name} className="glass-panel rounded-2xl p-3 flex flex-col justify-between min-h-[110px]">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">{gate.name}</span>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ml-1.5 ${gate.status === 'OPEN' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
            
            <div className="my-2">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{gate.waitTime}m wait</span>
              <p className="text-[9px] text-slate-400 mt-0.5">Capacity: {gate.occupancy}%</p>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${gate.occupancy}%` }}></div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
