import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Clock, Leaf, DollarSign, Train, Bus, Car
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const TravelCopilot: React.FC = () => {
  const { transitLines } = useSimulation();
  const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'cheapest' | 'eco'>('fastest');

  // Chart data comparing transport modes
  const modeComparisonData = [
    { name: 'Metro', "Travel Time (min)": 28, "CO2 Impact (kg)": 0.4, cost: 2.50 },
    { name: 'Bus Link', "Travel Time (min)": 38, "CO2 Impact (kg)": 1.2, cost: 2.00 },
    { name: 'Taxi Cab', "Travel Time (min)": 45, "CO2 Impact (kg)": 8.4, cost: 38.00 },
    { name: 'Walking', "Travel Time (min)": 90, "CO2 Impact (kg)": 0.0, cost: 0.00 },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          TRANSIT INTEGRATOR
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          AI Travel Copilot
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Coordinate multimodal transit options with live capacity updates and environmental ratings.
        </p>
      </div>

      {/* Route Mode Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(
          [
            { id: 'fastest', label: 'Fastest Route', desc: 'Metro Transit via Line 1 (28m total)', icon: <Clock className="w-5 h-5 text-blue-500" /> },
            { id: 'cheapest', label: 'Cheapest Route', desc: 'Bus Link + Walk ($2.00 total)', icon: <DollarSign className="w-5 h-5 text-emerald-500" /> },
            { id: 'eco', label: 'Eco-Friendly Route', desc: 'Metro or Walking (0.0kg CO2)', icon: <Leaf className="w-5 h-5 text-teal-500" /> },
          ] as const
        ).map(route => (
          <button
            key={route.id}
            onClick={() => setSelectedRoute(route.id)}
            className={`glass-panel rounded-2xl p-4 text-left border flex items-start gap-3 transition-all ${
              selectedRoute === route.id 
                ? 'border-blue-500 scale-102 ring-1 ring-blue-500/10' 
                : 'border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900/50'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
              {route.icon}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{route.label}</h4>
              <p className="text-[10px] text-slate-400 mt-1">{route.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Comparison Chart */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">Travel Modes Metrics Comparison</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modeComparisonData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '9px' }} />
                <Bar dataKey="Travel Time (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CO2 Impact (kg)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Transit Updates */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Live Concourse Feeds</h3>
          
          <div className="flex flex-col gap-3">
            {transitLines.map(tLine => (
              <div key={tLine.line} className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {tLine.line.includes('Metro') ? <Train className="w-4 h-4 text-blue-500" /> : tLine.line.includes('Bus') ? <Bus className="w-4 h-4 text-emerald-500" /> : <Car className="w-4 h-4 text-purple-500" />}
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">{tLine.line}</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Crowd: {tLine.crowdLevel}</p>
                  </div>
                </div>
                
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tLine.status === 'NORMAL' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                }`}>
                  {tLine.status === 'NORMAL' ? 'ON TIME' : `${tLine.delayMin}m delay`}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800/80 pt-3 itialic">
            * Direct integration with World Cup Transit Authority
          </div>
        </div>

      </div>

    </div>
  );
};
