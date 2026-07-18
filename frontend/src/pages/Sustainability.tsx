import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Leaf, Lightbulb, Droplet, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Sustainability: React.FC = () => {
  const { carbonSavedKg, energyUsageKw, waterUsageLiters, wasteGeneratedKg } = useSimulation();

  // Pie chart data for waste allocation
  const wastePieData = [
    { name: 'Recyclable', value: wasteGeneratedKg.recyclables, color: '#3b82f6' },
    { name: 'Organic', value: wasteGeneratedKg.organics, color: '#14b8a6' },
    { name: 'Landfill', value: wasteGeneratedKg.landfill, color: '#a855f7' },
  ];

  // Bar chart data for weekly/daily energy draw
  const energyDrawData = [
    { name: 'HVAC Air', draw: 4400 },
    { name: 'LED Lights', draw: 2800 },
    { name: 'Kitchens', draw: 1600 },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          GREEN INITIATIVE
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          Sustainability & Resource Optimizer
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Predict future power consumption, carbon offset benchmarks, and waste processing outputs.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Carbon Offset</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">{carbonSavedKg} kg CO₂</h4>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Water Conserved</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">{waterUsageLiters} Liters</h4>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Power Consumption</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">{energyUsageKw} kW</h4>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Stadium Eco Score</span>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">A+ (Optimal)</h4>
          </div>
        </div>

      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Waste allocation donut chart */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Waste Recycled Metrics</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Breakdown of organic vs recyclable plastics</p>
          </div>
          
          <div className="flex items-center justify-center h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wastePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {wastePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Labels */}
          <div className="flex justify-center gap-6 text-[10px] font-bold mt-2">
            {wastePieData.map(entry => (
              <span key={entry.name} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}: {entry.value}kg</span>
              </span>
            ))}
          </div>
        </div>

        {/* Energy usage bar chart */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Live Power Allocation</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time load split indicators</p>
          </div>
          
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyDrawData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} unit=" kW" />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                <Bar dataKey="draw" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Advice list */}
      <div className="glass-panel rounded-3xl p-5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1">
          <Leaf className="w-4 h-4 text-emerald-500 animate-pulse" />
          AI Energy Saver Optimization Advice
        </h3>
        
        <div className="flex flex-col gap-3 text-xs text-slate-600 dark:text-slate-300">
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500" />
            <span>Enable solar storage battery discharge during the 5 PM kickoff peak to bypass grid tariffs.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500" />
            <span>Scale back HVAC fan speeds in empty luxury boxes on Concourse Level 3.</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-500" />
            <span>Deploy automated waste reminders to smart disposal cans in Section 202 to sort compostables.</span>
          </p>
        </div>
      </div>

    </div>
  );
};
