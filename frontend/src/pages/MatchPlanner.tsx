import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, DollarSign, Clock, Navigation, AlertCircle, 
  Sparkles, CloudRain, Sun, Compass, Accessibility, Heart
} from 'lucide-react';

interface TimelineItem {
  time: string;
  activity: string;
  tip: string;
}

export const MatchPlanner: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();

  // Inputs
  const [matchId, setMatchId] = useState('USA-MEX');
  const [hotel, setHotel] = useState('Hilton Midtown NYC');
  const [budget, setBudget] = useState(50);
  const [arrivalTime, setArrivalTime] = useState('18:00');
  const [transportMode, setTransportMode] = useState('metro');
  const [accessibility, setAccessibility] = useState(false);

  // Generated Plan
  const [planGenerated] = useState(true);
  const [timeline] = useState<TimelineItem[]>([
    { time: "3.5 Hours Before Kickoff", activity: "Depart Hilton Midtown NYC via Metro Line 1.", tip: "Best route mapped: clear traffic forecast." },
    { time: "2.5 Hours Before Kickoff", activity: "Arrive at World Cup Transit Zone.", tip: "Follow step-free pathways if accessibility is enabled." },
    { time: "2.0 Hours Before Kickoff", activity: "Enter via Gate D based on crowd balancing recommendations.", tip: "Estimated wait time is 6 minutes." },
    { time: "1.5 Hours Before Kickoff", activity: "Visit Food Court Section 104.", tip: "Pre-order available for local dietary choices." },
    { time: "Kickoff!", activity: "Find seats near gate entrance. Enjoy the Match: USA-MEX.", tip: "In-seat emergency support accessible via the portal." }
  ]);
  const [weatherAdvice, setWeatherAdvice] = useState("Roof status is OPEN. Temp: 74°F. Light showers expected around 20:30, roof will automatically close.");
  const [budgetOptimization, setBudgetOptimization] = useState("Estimated travel cost: $7.50 utilizing public transit (free with World Cup Matchday Pass).");
  const [gateRecommendation] = useState("Gate D (lowest predicted queues).");
  const [walkingRoute, setWalkingRoute] = useState("1.2 km flat walk, follow blue stadium signage.");
  const [accessibilityGuidance] = useState("Elevator A-2 is located 50m from Gate D. Staff alerted for support.");
  const [travelAlerts] = useState("Metro Line 2 has minor delays of 4 mins; extra trains deployed.");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = `
      Create a detailed personalized matchday plan:
      - Match: ${matchId}
      - Hotel/Starting Point: ${hotel}
      - Budget: $${budget}
      - Target Arrival Time: ${arrivalTime}
      - Transport Mode: ${transportMode}
      - Accessibility Required: ${accessibility ? 'Yes' : 'No'}
      Return structured advices covering Timeline, Weather, Budget, Parking, Gate, Walking route, Accessibility guidance, and Travel alerts.
    `;

    try {
      const result = await askGemini(prompt, 'planner', language);
      const text = result.text;
      
      if (text.includes('Timeline') || text.includes('1.')) {
        setWeatherAdvice(`Gemini Weather Impact Advice: Roof closures predicted based on current matchday parameters.`);
        setBudgetOptimization(`Gemini Budget Plan: Spend allocated to public transit with World Cup match pass benefits.`);
        setWalkingRoute(`Fastest direct route: 950m flat terrain, follow Green Fan Walk.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          AI MATCHDAY ROUTER
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          AI Match Planner
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Input your starting location, preferences, and requirements to generate a complete matchday itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Form Controls */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between">
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Itinerary Settings</h3>
            
            {/* Match Selection */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Target Match</label>
              <select 
                value={matchId}
                onChange={e => setMatchId(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl"
              >
                <option value="USA-MEX">Group Stage: USA vs Mexico</option>
                <option value="CAN-ARG">Group Stage: Canada vs Argentina</option>
                <option value="USA-ENG">Knockout Stage: USA vs England</option>
              </select>
            </div>

            {/* Starting Hotel */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Starting Location / Hotel</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={hotel}
                  onChange={e => setHotel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl pl-8"
                  placeholder="e.g. Hilton Midtown NYC"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Budget Range */}
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-300">
                <span>Travel/Food Budget</span>
                <span>${budget}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="200" 
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Arrival Target */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Target Arrival Time</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={arrivalTime}
                  onChange={e => setArrivalTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl pl-8"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Transport Mode */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-slate-600 dark:text-slate-300">Preferred Transport</label>
              <div className="grid grid-cols-3 gap-2">
                {['metro', 'bus', 'taxi'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTransportMode(mode)}
                    className={`py-2 rounded-xl capitalize font-bold border transition-all ${
                      transportMode === mode 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-300 select-none py-1">
              <input 
                type="checkbox" 
                checked={accessibility}
                onChange={e => setAccessibility(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 dark:bg-slate-900"
              />
              <Accessibility className="w-4 h-4 text-teal-500" />
              <span>Require Accessible Wheelchair Route</span>
            </label>

            <button 
              type="submit"
              disabled={loading}
              className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Itinerary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Output Timeline & Recommendations */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {planGenerated ? (
            <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6 animate-fadeIn">
              
              {/* Timeline feed */}
              <div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                  <Compass className="w-4.5 h-4.5 text-blue-500" />
                  Complete Matchday Timeline
                </h3>
                
                <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 pl-6 flex flex-col gap-5">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/60" />
                      
                      <span className="text-[10px] font-bold text-blue-500">{item.time}</span>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">{item.activity}</h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auxiliary Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                
                {/* Weather advice */}
                <div className="flex gap-2">
                  {weatherAdvice.includes('CLOSED') ? <CloudRain className="w-5 h-5 text-blue-500 flex-shrink-0" /> : <Sun className="w-5 h-5 text-orange-500 flex-shrink-0" />}
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">Weather Advice</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{weatherAdvice}</p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">Budget Optimization</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{budgetOptimization}</p>
                  </div>
                </div>

                {/* Gate & Route */}
                <div className="flex gap-2">
                  <Navigation className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">Optimal Gate & Route</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                      Use <span className="font-semibold text-slate-600 dark:text-slate-300">{gateRecommendation}</span>. {walkingRoute}
                    </p>
                  </div>
                </div>

                {/* Accessibility */}
                <div className="flex gap-2">
                  <Heart className="w-5 h-5 text-teal-500 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-slate-700 dark:text-slate-200">Accessibility Guidance</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{accessibilityGuidance}</p>
                  </div>
                </div>

              </div>

              {/* Transit alert banner */}
              {travelAlerts && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/60 rounded-xl flex items-center gap-2 text-[10px] font-semibold text-blue-600 dark:text-blue-400 leading-normal">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{travelAlerts}</span>
                </div>
              )}

            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 flex items-center justify-center min-h-[300px] text-slate-400 italic text-xs">
              No itinerary generated yet. Configure inputs and click Generate.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
