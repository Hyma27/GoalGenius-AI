import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Users, Timer, HelpCircle, ShieldCheck, ArrowRightLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const CrowdIntelligence: React.FC = () => {
  const { gates, overallOccupancy } = useSimulation();

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
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">AI Crowd Insights</h3>
            <p className="text-[10px] text-slate-400 mb-4">Dynamic redirections recommended by Gemini</p>
            
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/60 rounded-xl text-xs flex gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Gate B Imbalance</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                    Wait is {gates[1]?.waitTime}m. Redirect upcoming metro traffic to Gate D (3m wait).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 rounded-xl text-xs flex gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">Turnstile Optimization</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                    Turnstiles at Gate C operating at 95% capacity. Maintain staff levels.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            Intake algorithms updated 4s ago.
          </div>
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
