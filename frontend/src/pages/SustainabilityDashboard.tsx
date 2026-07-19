import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  Leaf, Zap, Droplet, Trash2, Sparkles, RefreshCw, BarChart3, TrendingDown 
} from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie } from 'recharts';

export const SustainabilityDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  const {
    carbonSavedKg, energyUsageKw, waterUsageLiters, wasteGeneratedKg
  } = useSimulation();

  const [aiTip, setAiTip] = useState(
    "To save 120kg CO2, recommend shifting concourse fan zones to auxiliary standby mode between minutes 30 and 70."
  );

  const handleFetchRecommendation = async () => {
    const prompt = `
      Analyze this stadium sustainability snapshot:
      - Carbon Saved: ${carbonSavedKg} kg CO2
      - Energy Consumed: ${energyUsageKw} kW
      - Water Conserved: ${waterUsageLiters} Liters
      - Waste sorted: Recyclables ${wasteGeneratedKg.recyclables}kg, Organics ${wasteGeneratedKg.organics}kg, Landfill ${wasteGeneratedKg.landfill}kg.
      Provide a highly precise dynamic recommendation to minimize carbon emissions or energy load during this match. Keep it to one paragraph.
    `;
    try {
      const response = await askGemini(prompt, 'sustainability', language);
      setAiTip(response.text);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleFetchRecommendation();
  }, []);

  // Format waste data for PieChart
  const wastePieData = [
    { name: 'Recyclables', value: wasteGeneratedKg.recyclables, color: '#10b981' },
    { name: 'Organics', value: wasteGeneratedKg.organics, color: '#f59e0b' },
    { name: 'Landfill Waste', value: wasteGeneratedKg.landfill, color: '#ef4444' }
  ];

  // Energy & Water consumption over hours
  const consumptionTrendData = [
    { hour: '16:00', Energy: 2200, Water: 4500 },
    { hour: '17:00', Energy: 3100, Water: 8900 },
    { hour: '18:00', Energy: 4200, Water: 14200 },
    { hour: '19:00', Energy: 4800, Water: 18500 },
    { hour: '20:00', Energy: 4950, Water: 19100 },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-wider font-extrabold text-emerald-500 uppercase px-2.5 py-1 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-full">
            ECO INTEGRATION PANEL
          </span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
            Sustainability Dashboard
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Track resource footprints, sorting efficiencies, and carbon offsets compiled by smart sensors.
          </p>
        </div>

        <button 
          onClick={handleFetchRecommendation}
          disabled={loading}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Guidance</span>
        </button>
      </div>

      {/* Roster Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Carbon Offset Saved</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{carbonSavedKg} kg CO2</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Current Energy Draw</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{energyUsageKw} kW</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex items-center gap-4 hover:translate-y-[-2px] transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Water Conserved</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{waterUsageLiters} Liters</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Resource Consumption Chart (Trend) */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[320px]">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
            <BarChart3 className="w-4.5 h-4.5 text-blue-500" />
            Energy & Water Consumption Trend
          </h3>
          
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionTrendData}>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#94a3b8" fontSize={9} />
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                <Bar dataKey="Energy" fill="#eab308" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Water" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste sorting breakdown */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between min-h-[320px]">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1.5">
            <Trash2 className="w-4.5 h-4.5 text-emerald-500" />
            Solid Waste Sorting Audit
          </h3>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={wastePieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={70} 
                  dataKey="value"
                >
                  {wastePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-800 dark:text-slate-100">
                {wastePieData.reduce((sum, item) => sum + item.value, 0)}kg
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">Total Logged</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-[9px] font-bold mt-2">
            {wastePieData.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </span>
                <span className="text-slate-800 dark:text-slate-200">{item.value} kg</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Recommendation highlight block */}
      <div className="glass-panel rounded-3xl p-5 border border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1">
              AI Sustainability Recommendation
            </h3>
            <p className="text-[10px] text-slate-400">Generative carbon mitigation guidelines</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-200 font-semibold leading-relaxed">
          {loading ? (
            <div className="flex items-center gap-2 py-4 justify-center">
              <span className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
              <span className="text-[10px] text-slate-400 animate-pulse">Running carbon mitigation analysis...</span>
            </div>
          ) : (
            aiTip
          )}
        </div>
      </div>

    </div>
  );
};
