import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Sparkles
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DigitalTwin: React.FC = () => {
  const {
    gates, riskLevel, injectEvent
  } = useSimulation();

  const [selectedSection, setSelectedSection] = useState<string | null>('Section 104 - Lower Bowl');
  const [sectionOccupancy, setSectionOccupancy] = useState<number>(85);

  const handleSectionClick = (sectionName: string, occ: number) => {
    setSelectedSection(sectionName);
    setSectionOccupancy(occ);
  };

  // Convert gates wait times to Recharts format
  const gateChartData = gates.map(g => ({
    name: g.name,
    "Wait Time (min)": g.waitTime,
    "Capacity (%)": g.occupancy
  }));

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
            REAL-TIME DIGITAL TWIN
          </span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
            AI Stadium Twin Visualizer
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Predictive crowd dynamics model running on the AI Digital Twin Simulation Engine.
          </p>
        </div>

        {/* Global twin status */}
        <div className="flex gap-2">
          <div className="glass-panel text-xs px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${riskLevel === 'LOW' ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Twin Integrity: 100%</span>
          </div>
        </div>
      </div>

      {/* Main Core Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Visual Stadium Grid map - Column Span 2 */}
        <div className="glass-panel rounded-3xl p-5 xl:col-span-2 flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Interactive Stadium Grid</h3>
            <p className="text-[10px] text-slate-400 mb-6">Select sections below to analyze live AI occupancy levels</p>
          </div>

          {/* Interactive CSS Stadium Drawing */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[450px] aspect-square rounded-full border-2 border-slate-200/50 dark:border-slate-800/80 p-8 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/30">
              
              {/* Outer Ring - Upper Bowl */}
              <div className="absolute inset-4 rounded-full border border-dashed border-slate-300 dark:border-slate-800 pointer-events-none" />
              
              {/* Upper Bowl Left */}
              <button 
                onClick={() => handleSectionClick('Upper Bowl - West Wing', 64)}
                className="absolute top-1/2 left-6 -translate-y-1/2 w-10 h-28 rounded-l-full bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/40 transition-colors flex items-center justify-center text-[9px] font-black text-blue-600 dark:text-blue-400"
              >
                WEST
              </button>
              
              {/* Upper Bowl Right */}
              <button 
                onClick={() => handleSectionClick('Upper Bowl - East Wing', 92)}
                className="absolute top-1/2 right-6 -translate-y-1/2 w-10 h-28 rounded-r-full bg-red-500/20 dark:bg-red-500/10 border border-red-500/40 hover:bg-red-500/40 transition-colors flex items-center justify-center text-[9px] font-black text-red-600 dark:text-red-400"
              >
                EAST
              </button>

              {/* Upper Bowl Top */}
              <button 
                onClick={() => handleSectionClick('Upper Bowl - North End', 45)}
                className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-10 rounded-t-full bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-500/40 hover:bg-emerald-500/40 transition-colors flex items-center justify-center text-[9px] font-black text-emerald-600 dark:text-emerald-400"
              >
                NORTH
              </button>

              {/* Upper Bowl Bottom */}
              <button 
                onClick={() => handleSectionClick('Upper Bowl - South End', 78)}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-10 rounded-b-full bg-blue-500/20 dark:bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/40 transition-colors flex items-center justify-center text-[9px] font-black text-blue-600 dark:text-blue-400"
              >
                SOUTH
              </button>

              {/* Inner Circle - Lower Bowl */}
              <div className="w-64 h-64 rounded-full border border-slate-300 dark:border-slate-800 p-8 flex items-center justify-center bg-slate-100/40 dark:bg-slate-900/60 shadow-inner relative">
                
                {/* Lower Bowl Sections */}
                <button 
                  onClick={() => handleSectionClick('Section 104 - Lower Bowl', 94)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-red-500/30 dark:bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 rounded-lg text-[8px] font-bold text-red-700 dark:text-red-400"
                >
                  SEC 104
                </button>

                <button 
                  onClick={() => handleSectionClick('Section 202 - Lower Bowl', 32)}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-8 bg-emerald-500/30 dark:bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500/40 rounded-lg text-[8px] font-bold text-emerald-700 dark:text-emerald-400"
                >
                  SEC 202
                </button>

                <button 
                  onClick={() => handleSectionClick('Section VIP - Club Suite', 50)}
                  className="absolute top-1/2 left-2 -translate-y-1/2 w-14 h-16 bg-blue-500/30 dark:bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/40 rounded-lg text-[8px] font-bold text-blue-700 dark:text-blue-400"
                >
                  VIP CLUB
                </button>

                <button 
                  onClick={() => handleSectionClick('Section 108 - Lower Bowl', 87)}
                  className="absolute top-1/2 right-2 -translate-y-1/2 w-14 h-16 bg-red-500/30 dark:bg-red-500/20 border border-red-500/50 hover:bg-red-500/40 rounded-lg text-[8px] font-bold text-red-700 dark:text-red-400"
                >
                  SEC 108
                </button>

                {/* Central Playing Field (The Pitch) */}
                <div className="w-24 h-36 bg-gradient-to-b from-green-600 to-green-700 border-2 border-white/50 rounded-md flex items-center justify-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40" />
                  <div className="w-10 h-10 rounded-full border border-white/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <span className="text-[8px] font-bold text-white/50 rotate-90">PITCH</span>
                </div>
              </div>

              {/* External Gates markers */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase">Gate A</div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase">Gate C</div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 uppercase">Gate D</div>
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-[9px] font-bold text-slate-400 uppercase">Gate B</div>

            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <span>* Red sections specify high congestion (density &gt; 80%)</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Normal</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500"></span> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500"></span> Heavy</span>
            </div>
          </div>
        </div>

        {/* Side Panel: Analysis, Simulation Injectors & Charts */}
        <div className="flex flex-col gap-6">
          
          {/* Interactive Inspection Sidebox */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase text-slate-400">Live AI Section Inspector</span>
                <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              </div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
                {selectedSection || "Select a Section"}
              </h3>
              
              {selectedSection ? (
                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-semibold">Live Occupancy</span>
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{sectionOccupancy}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-semibold">AI Risk Status</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold mt-1 ${
                      sectionOccupancy > 80 
                        ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400' 
                        : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {sectionOccupancy > 80 ? 'HIGH SURGE ALERT' : 'OPTIMAL DENSITY'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-6 italic">Click on the visual map sections to populate metrics.</p>
              )}
            </div>
            
            <div className="text-[9px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              Data streams synthesized by Gemini Decision Agent.
            </div>
          </div>

          {/* Event Injectors */}
          <div className="glass-panel rounded-3xl p-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Inject Simulation Events</h3>
            <p className="text-[10px] text-slate-400 mb-4">Trigger stadium stress scenarios to verify AI response loops</p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => injectEvent('HALFTIME')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-center"
              >
                Half-Time Surge
              </button>
              <button 
                onClick={() => injectEvent('METRO_DELAY')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-center"
              >
                Metro Delays
              </button>
              <button 
                onClick={() => injectEvent('STORM')}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-center"
              >
                Storm Forecast
              </button>
              <button 
                onClick={() => injectEvent('EVACUATION')}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-center col-span-2 shadow-sm"
              >
                Initiate Evacuation Drill
              </button>
            </div>
          </div>

          {/* Gate Utilization Chart */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">Gate Wait Times</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gateChartData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} unit="m" />
                  <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                  <Bar dataKey="Wait Time (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
