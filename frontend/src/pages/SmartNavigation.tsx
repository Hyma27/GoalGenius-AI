import React, { useState } from 'react';
import { 
  Compass, Utensils
} from 'lucide-react';

export const SmartNavigation: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = useState<'fastest' | 'exits' | 'restrooms' | 'food' | 'medical'>('fastest');

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          INDOOR ROUTING SYSTEM
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          Smart Indoor Navigation
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Select overlays to navigate washrooms, food courts, medical centers, and emergency pathways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left selector menu */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Navigation Toggles</h3>
          
          <div className="flex flex-col gap-2">
            {(
              [
                { id: 'fastest', label: 'AI Fastest Route to Seat', color: 'bg-blue-600 text-white border-blue-600' },
                { id: 'exits', label: 'Emergency Exit Paths', color: 'bg-red-600 text-white border-red-600' },
                { id: 'restrooms', label: 'Accessible Washrooms', color: 'bg-teal-600 text-white border-teal-600' },
                { id: 'food', label: 'Food Courts & Stalls', color: 'bg-amber-600 text-white border-amber-600' },
                { id: 'medical', label: 'First Aid & Medical', color: 'bg-purple-600 text-white border-purple-600' },
              ] as const
            ).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveOverlay(item.id)}
                className={`w-full py-3.5 px-4 rounded-xl text-left text-xs font-bold border transition-all ${
                  activeOverlay === item.id 
                    ? `${item.color} shadow-sm scale-102` 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/30 dark:border-blue-900/40 rounded-xl text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed font-semibold">
            <Compass className="w-4 h-4 mb-1 text-blue-500 animate-spin-slow" />
            <span>AI Suggestion: Head to Gate D rather than Gate B. Pedestrian route clear. Wait time: 3 mins.</span>
          </div>
        </div>

        {/* Map visualizer */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[450px]">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Stadium Concourses Map</h3>
            <p className="text-[10px] text-slate-400">Level 1 - Main Stadium Concourse</p>
          </div>

          {/* Interactive Concourse Map Layout */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 overflow-hidden shadow-inner">
              
              {/* Outer boundary corridors */}
              <div className="absolute inset-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center">
                
                {/* Concourse inner core */}
                <div className="w-2/3 h-2/3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg flex items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-300 tracking-wider">STADIUM FIELD AREA</span>
                </div>

              </div>

              {/* Dynamic Path Routing lines overlay */}
              {activeOverlay === 'fastest' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 250 L 150 250 L 150 120 L 250 120" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" className="animate-pulse" />
                  <circle cx="50" cy="250" r="6" fill="#3b82f6" />
                  <circle cx="250" cy="120" r="6" fill="#10b981" />
                </svg>
              )}

              {activeOverlay === 'exits' && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 120 180 L 50 180 M 340 180 L 410 180" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 2" />
                  <circle cx="50" cy="180" r="6" fill="#ef4444" />
                  <circle cx="410" cy="180" r="6" fill="#ef4444" />
                </svg>
              )}

              {/* Node highlights */}
              {/* Washrooms (WC) */}
              <div className={`absolute top-8 left-1/4 w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                activeOverlay === 'restrooms' ? 'bg-teal-500 border-teal-600 text-white scale-110 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
              }`}>
                WC
              </div>
              <div className={`absolute bottom-8 right-1/4 w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                activeOverlay === 'restrooms' ? 'bg-teal-500 border-teal-600 text-white scale-110 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
              }`}>
                WC
              </div>

              {/* Food Courts */}
              <div className={`absolute top-1/2 left-8 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                activeOverlay === 'food' ? 'bg-amber-500 border-amber-600 text-white scale-110 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
              }`}>
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <div className={`absolute top-1/3 right-8 w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                activeOverlay === 'food' ? 'bg-amber-500 border-amber-600 text-white scale-110 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
              }`}>
                <Utensils className="w-3.5 h-3.5" />
              </div>

              {/* Medical Centers */}
              <div className={`absolute top-8 right-12 w-8 h-8 rounded-full border flex items-center justify-center text-[9px] font-bold transition-all shadow-sm ${
                activeOverlay === 'medical' ? 'bg-purple-500 border-purple-600 text-white scale-110 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200'
              }`}>
                AID
              </div>

              {/* User Pointer */}
              <div className="absolute bottom-12 left-10 flex flex-col items-center gap-1">
                <span className="text-[8px] font-black px-1.5 py-0.5 bg-blue-600 text-white rounded-full uppercase shadow-md leading-none">You</span>
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-white animate-ping"></span>
              </div>

            </div>
          </div>

          <div className="text-[10px] text-slate-400 mt-4 flex items-center justify-between">
            <span>* Paths calculated based on structural wait sensors</span>
            <div className="flex gap-2">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Start</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> End Target</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
