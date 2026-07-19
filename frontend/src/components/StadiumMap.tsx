import React from 'react';
import { Utensils } from 'lucide-react';

interface StadiumMapProps {
  activeMapFeature: 'all' | 'gates' | 'parking' | 'food' | 'medical' | 'exits' | 'restrooms';
}

/**
 * StadiumMap Component - Renders the SVG and CSS layouts of the MetLife Stadium Arena.
 * Optimized for WCAG 2.1 contrast guidelines and screen-reader accessibility labels.
 */
export const StadiumMap: React.FC<StadiumMapProps> = ({ activeMapFeature }) => {
  return (
    <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-inner flex items-center justify-center overflow-hidden">
      
      {/* Outer Corridor Oval */}
      <div 
        className="absolute inset-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center p-6 bg-white dark:bg-slate-900/50"
        role="region"
        aria-label="Stadium Arena Seating Corridors"
      >
        {/* Field */}
        <div className="w-1/2 h-1/2 bg-gradient-to-tr from-green-600 to-green-700 border-2 border-white/50 rounded-lg flex items-center justify-center shadow">
          <span className="text-[8px] font-bold text-white/40 tracking-wider">USA-MEX PITCH</span>
        </div>
      </div>

      {/* Dynamic Path Routing line */}
      {(activeMapFeature === 'all' || activeMapFeature === 'gates') && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M 60 220 L 140 220 L 140 100 L 260 100" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" className="animate-pulse" />
          <circle cx="60" cy="220" r="5" fill="#3b82f6" />
          <circle cx="260" cy="100" r="5" fill="#10b981" />
        </svg>
      )}

      {/* Gates A-F Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'gates') && (
        <>
          <div 
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded"
            aria-label="Gate A - Congestion Low"
          >
            Gate A
          </div>
          <div 
            className="absolute top-1/2 -left-1.5 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-red-500 text-white rounded"
            aria-label="Gate B - Congestion High"
          >
            Gate B
          </div>
          <div 
            className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded"
            aria-label="Gate C - Congestion Low"
          >
            Gate C
          </div>
          <div 
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded"
            aria-label="Gate D - Congestion Low"
          >
            Gate D
          </div>
        </>
      )}

      {/* Parking Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'parking') && (
        <div 
          className="absolute bottom-4 left-6 px-2 py-1 bg-blue-600 text-white rounded text-[8px] font-black shadow-sm"
          aria-label="Lot West - Recommended Parking Area"
        >
          LOT WEST (AI ROUTE START)
        </div>
      )}

      {/* Food Courts Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'food') && (
        <>
          <div 
            className="absolute top-10 left-12 p-1.5 rounded-lg bg-amber-500 text-white border border-white/20 shadow-md"
            aria-label="Food Court Section 104"
          >
            <Utensils className="w-3.5 h-3.5" />
          </div>
          <div 
            className="absolute bottom-10 right-12 p-1.5 rounded-lg bg-amber-500 text-white border border-white/20 shadow-md"
            aria-label="Food Court Section 202"
          >
            <Utensils className="w-3.5 h-3.5" />
          </div>
        </>
      )}

      {/* Medical Center Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'medical') && (
        <div 
          className="absolute top-10 right-14 px-2 py-1 bg-purple-600 text-white border border-white/10 rounded text-[8px] font-black shadow"
          aria-label="First Aid Medical Station 1"
        >
          MED CENTER 1
        </div>
      )}

      {/* Emergency Exits Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'exits') && (
        <div 
          className="absolute bottom-6 right-6 px-2 py-1 bg-red-600 text-white border border-white/10 rounded text-[8px] font-black shadow animate-pulse"
          aria-label="Emergency Fire Exit Pathway"
        >
          EMERGENCY EXIT
        </div>
      )}

      {/* Washrooms Overlay */}
      {(activeMapFeature === 'all' || activeMapFeature === 'restrooms') && (
        <>
          <div 
            className="absolute top-1/2 right-12 -translate-y-1/2 px-1.5 py-0.5 bg-teal-500 text-white rounded text-[8px] font-bold"
            aria-label="Accessible Washroom WC ADA"
          >
            WC-ADA
          </div>
          <div 
            className="absolute top-1/2 left-12 -translate-y-1/2 px-1.5 py-0.5 bg-teal-500 text-white rounded text-[8px] font-bold"
            aria-label="Accessible Washroom WC ADA"
          >
            WC-ADA
          </div>
        </>
      )}

    </div>
  );
};
