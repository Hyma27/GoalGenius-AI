import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, CloudRain, Sun, Users, Navigation, AlertTriangle, ShieldCheck, 
  MapPin, HelpCircle, Utensils, Heart, CheckCircle2, ChevronRight, BookOpen, Compass
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const {
    matchScore, matchMinute, weather, overallOccupancy, gates, transitLines,
    emergencyAlert, volunteers, fanExperienceScore, riskLevel, incidents, injectEvent
  } = useSimulation();

  const [activeMapFeature, setActiveMapFeature] = useState<'all' | 'gates' | 'parking' | 'food' | 'medical' | 'exits' | 'restrooms'>('all');
  
  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  // Quick Action Handlers
  const handleAction = (action: string) => {
    switch (action) {
      case 'gate':
        navigate('/navigation');
        break;
      case 'report':
        navigate('/operations-hub');
        break;
      case 'emergency':
        injectEvent('EVACUATION');
        break;
      case 'parking':
        navigate('/match-planner');
        break;
    }
  };

  return (
    <div className="flex flex-col gap-12 font-sans transition-colors duration-300">
      
      {/* ========================================================================= */}
      {/* ROW 1: WELCOME | LIVE MATCH | HERO IMAGE | WEATHER */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        
        {/* Welcome Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-44 hover:translate-y-[-2px] transition-all">
          <div className="flex items-start justify-between text-slate-400 dark:text-slate-500">
            <span className="text-[10px] tracking-wider font-extrabold uppercase bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
              CONSOLE OK
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase leading-none">FIFA Platform Director</h2>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-1 truncate">
              {user?.name || "Operations Lead"}
            </h1>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal border-t border-slate-100 dark:border-slate-800/80 pt-2">
            AI simulation loops active at NYC Venue MetLife.
          </p>
        </div>

        {/* Live Match Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-44 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-bold tracking-wider uppercase">Match day tracker</span>
            <Trophy className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              USA {matchScore.teamA} - {matchScore.teamB} MEX
            </span>
            <p className="text-[10px] text-emerald-500 dark:text-emerald-400 font-extrabold mt-0.5 animate-pulse">
              Minute {matchMinute}' • LIVE
            </p>
          </div>
          <div className="text-[9px] text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg">
            AI Predicted Outcome: USA 2 - 1 MEX (98.2% Confidence)
          </div>
        </div>

        {/* Stadium Hero Image */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-44 hover:translate-y-[-2px] transition-all relative overflow-hidden text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80')` }}
          />
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply" />
          <div className="relative z-10 flex items-start justify-between">
            <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 bg-white/20 rounded">
              METLIFE STADIUM
            </span>
          </div>
          <div className="relative z-10">
            <h3 className="font-extrabold text-sm text-slate-100">Intelligent Digital Twin</h3>
            <p className="text-[9px] text-slate-400 mt-0.5">82,500 Seat capacity telemetry</p>
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-44 hover:translate-y-[-2px] transition-all">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-[10px] font-bold tracking-wider uppercase">Concourse Weather</span>
            {weather.condition === 'Clear' ? <Sun className="w-4 h-4 text-orange-500" /> : <CloudRain className="w-4 h-4 text-blue-500" />}
          </div>
          <div>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {weather.temp}°F • {weather.condition}
            </span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Rain Risk: {weather.rainProb}%
            </p>
          </div>
          <div className="text-[9px] font-bold px-2 py-1 bg-slate-50 dark:bg-slate-950 rounded-lg text-slate-500 dark:text-slate-400">
            Retractable Roof: <span className={weather.roofState === 'CLOSED' ? 'text-amber-500' : 'text-emerald-500'}>{weather.roofState}</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 2: OVERVIEW CARDS (CROWD | TRANSIT | EMERGENCY | SATISFACTION) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Crowd Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 hover:translate-y-[-2px] transition-all">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Crowd Status</span>
          <div className="my-1">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{overallOccupancy}%</h3>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Estimated peak wait time: 12 minutes</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${overallOccupancy}%` }}></div>
          </div>
        </div>

        {/* Transportation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 hover:translate-y-[-2px] transition-all">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transportation</span>
          <div className="my-1">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 truncate">
              {transitLines[1]?.status === 'DELAYED' ? 'Line 2 Delays' : 'Metro: Normal'}
            </h3>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              Avg frequency: 6 mins. Extra trains active.
            </p>
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${
            transitLines[1]?.status === 'DELAYED' ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
          }`}>
            {transitLines[1]?.status === 'DELAYED' ? 'IMPACT DETECTED' : 'SYSTEM ON-TIME'}
          </span>
        </div>

        {/* Emergency Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 hover:translate-y-[-2px] transition-all">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Emergency Status</span>
          <div className="my-1">
            <h3 className={`text-xl font-black ${riskLevel === 'LOW' ? 'text-emerald-500' : 'text-red-500 animate-pulse'}`}>
              {emergencyAlert ? 'ALERT ACTIVE' : 'SYSTEM SECURE'}
            </h3>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">
              All fire panels, fire escapes, and medical booths synced
            </p>
          </div>
          <div className="text-[9px] text-slate-400 dark:text-slate-500">
            Open incidents: {activeIncidents.length}
          </div>
        </div>

        {/* Fan Satisfaction */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-36 hover:translate-y-[-2px] transition-all">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fan Satisfaction</span>
          <div className="my-1">
            <h3 className="text-2xl font-black text-gradient-purple bg-gradient-to-r from-blue-600 to-purple-600">
              {fanExperienceScore}%
            </h3>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Calculated composite experiences</p>
          </div>
          <span className="text-[9px] font-bold text-slate-500">
            Rating: Excellent (ADA safe)
          </span>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 3: INTERACTIVE STADIUM MAP | UPCOMING MATCH CARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Large Interactive Stadium Map */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[480px]">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Arena Interactive Routing Map</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Direct stadium blueprint. Highlight elements to plan concourse paths.</p>
              </div>
              
              {/* Feature filters */}
              <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                {[
                  { id: 'all', label: 'All features' },
                  { id: 'gates', label: 'Gates' },
                  { id: 'parking', label: 'Parking' },
                  { id: 'food', label: 'Food Court' },
                  { id: 'medical', label: 'Medical' },
                  { id: 'exits', label: 'Exits' },
                  { id: 'restrooms', label: 'Washrooms' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMapFeature(item.id as any)}
                    className={`px-2 py-1 rounded-lg border transition-all ${
                      activeMapFeature === item.id 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200/50 dark:border-slate-800/80'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stadium CSS Drawing */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div className="relative w-full max-w-[400px] aspect-[4/3] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 shadow-inner flex items-center justify-center overflow-hidden">
              
              {/* Outer Corridor Oval */}
              <div className="absolute inset-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-center p-6 bg-white dark:bg-slate-900/50">
                {/* Field */}
                <div className="w-1/2 h-1/2 bg-gradient-to-tr from-green-600 to-green-700 border-2 border-white/50 rounded-lg flex items-center justify-center shadow">
                  <span className="text-[8px] font-bold text-white/40 tracking-wider">USA-MEX PITCH</span>
                </div>
              </div>

              {/* Dynamic Path Routing line */}
              {(activeMapFeature === 'all' || activeMapFeature === 'gates') && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 60 220 L 140 220 L 140 100 L 260 100" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" className="animate-pulse" />
                  <circle cx="60" cy="220" r="5" fill="#3b82f6" />
                  <circle cx="260" cy="100" r="5" fill="#10b981" />
                </svg>
              )}

              {/* Gates A-F Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'gates') && (
                <>
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded">Gate A</div>
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-red-500 text-white rounded">Gate B</div>
                  <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded">Gate C</div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-500 text-white rounded">Gate D</div>
                </>
              )}

              {/* Parking Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'parking') && (
                <div className="absolute bottom-4 left-6 px-2 py-1 bg-blue-600 text-white rounded text-[8px] font-black shadow-sm">
                  LOT WEST (AI ROUTE START)
                </div>
              )}

              {/* Food Courts Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'food') && (
                <>
                  <div className="absolute top-10 left-12 p-1.5 rounded-lg bg-amber-500 text-white border border-white/20 shadow-md">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute bottom-10 right-12 p-1.5 rounded-lg bg-amber-500 text-white border border-white/20 shadow-md">
                    <Utensils className="w-3.5 h-3.5" />
                  </div>
                </>
              )}

              {/* Medical Center Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'medical') && (
                <div className="absolute top-10 right-14 px-2 py-1 bg-purple-600 text-white border border-white/10 rounded text-[8px] font-black shadow">
                  MED CENTER 1
                </div>
              )}

              {/* Emergency Exits Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'exits') && (
                <div className="absolute bottom-6 right-6 px-2 py-1 bg-red-600 text-white border border-white/10 rounded text-[8px] font-black shadow animate-pulse">
                  EMERGENCY EXIT
                </div>
              )}

              {/* Washrooms Overlay */}
              {(activeMapFeature === 'all' || activeMapFeature === 'restrooms') && (
                <>
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 px-1.5 py-0.5 bg-teal-500 text-white rounded text-[8px] font-bold">
                    WC-ADA
                  </div>
                  <div className="absolute top-1/2 left-12 -translate-y-1/2 px-1.5 py-0.5 bg-teal-500 text-white rounded text-[8px] font-bold">
                    WC-ADA
                  </div>
                </>
              )}

            </div>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
            <span className="flex items-center gap-1"><Compass className="w-3.5 h-3.5 text-blue-500" /> AI recommendation route mapping active</span>
            <div className="flex gap-3 font-semibold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span> Low (Wait &lt; 5m)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-500 rounded"></span> High (Wait &gt; 15m)</span>
            </div>
          </div>
        </div>

        {/* Small Upcoming Match card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between min-h-[480px]">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Upcoming Fixtures</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Group Stage Schedule</p>
          </div>

          {/* Listing */}
          <div className="flex-1 flex flex-col gap-4 mt-6">
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/20 dark:border-slate-800/80 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                <span>GROUP STAGE</span>
                <span>TOMORROW</span>
              </div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">Canada vs Argentina</h4>
              <p className="text-[9px] text-slate-400">MetLife Arena • Kickoff 18:00</p>
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-[9px] text-slate-400 dark:text-slate-500">
                Expected crowd density: 98.4%
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/20 dark:border-slate-800/80 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 dark:text-blue-400">
                <span>GROUP STAGE</span>
                <span>IN 3 DAYS</span>
              </div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100">USA vs England</h4>
              <p className="text-[9px] text-slate-400">MetLife Arena • Kickoff 20:00</p>
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-[9px] text-slate-400 dark:text-slate-500">
                Expected crowd density: 100% (VIP full)
              </div>
            </div>

          </div>

          <div className="text-[9px] text-slate-400 dark:text-slate-500 italic pt-4 border-t border-slate-100 dark:border-slate-800/80">
            * All tickets pre-booked via FIFA Portal.
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 4: RECENT ALERTS TIMELINE | QUICK ACTIONS PANEL */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Alerts Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Live Incident Timeline</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">Recent operational reports logged via staff</p>
          </div>

          {/* Timeline Feed */}
          <div className="flex flex-col gap-4 mt-6">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="flex gap-4 items-start text-xs border-b border-slate-100 dark:border-slate-800/80 pb-3 last:border-b-0 last:pb-0">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                  inc.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{inc.type}</span>
                    <span className="text-[9px] text-slate-400">{inc.time} • Loc: {inc.location}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">{inc.description}</p>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold ${
                  inc.status === 'RESOLVED' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600' : 'bg-blue-100 dark:bg-blue-950/40 text-blue-600'
                }`}>
                  {inc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[9px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
            Total recorded logged logs: {incidents.length}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-[20px] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Tactical Quick Actions</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Instant operations commands shortcuts</p>
          </div>

          {/* Buttons List */}
          <div className="flex flex-col gap-2 mt-6 flex-1 justify-center">
            
            <button 
              onClick={() => handleAction('gate')}
              className="py-3 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-left rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between group transition-colors"
            >
              <span>Find My Gate Location</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleAction('report')}
              className="py-3 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-left rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between group transition-colors"
            >
              <span>Report Concourse Incident</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleAction('parking')}
              className="py-3 px-4 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800 text-left rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between group transition-colors"
            >
              <span>Book Arena Parking Slot</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => handleAction('emergency')}
              className="py-3 px-4 bg-red-600 hover:bg-red-700 text-left rounded-xl text-xs font-bold text-white flex items-center justify-between group transition-colors shadow-sm"
            >
              <span>Trigger Emergency Broadcast</span>
              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

          <div className="text-[9px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
            Security overrides restrict parameters.
          </div>
        </div>

      </div>

    </div>
  );
};
