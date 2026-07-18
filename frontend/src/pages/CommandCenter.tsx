import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  Volume2, AlertCircle, MapPin, Navigation, Sparkles, UserCheck
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  const {
    riskLevel, emergencyAlert, gates, transitLines, incidents, volunteers
  } = useSimulation();

  const [aiReport, setAiReport] = useState<string>(
    "Stadium Risk: LOW. Gates B and E are reaching maximum density (94% and 88%). Action Recommended: Open Gate D backup turnstiles immediately. Deploy 4 volunteers to Sector 3 to direct flow. Increase safety crew presence near Sector 104 food court to manage pedestrian traffic."
  );
  
  const [activeTab, setActiveTab] = useState<'all' | 'crowd' | 'safety' | 'transit'>('all');

  // Trigger Gemini analysis to generate operational advice based on active simulation states
  const generateCopilotAdvice = async () => {
    const prompt = `
      Analyze current stadium parameters:
      - Overall Risk: ${riskLevel}
      - Emergency Alert: ${emergencyAlert || "None"}
      - Gate Wait times: ${gates.map(g => `${g.name}: ${g.waitTime}m wait`).join(', ')}
      - Transit Delays: ${transitLines.map(t => `${t.line}: ${t.status}`).join(', ')}
      - Open incidents count: ${incidents.filter(i => i.status !== 'RESOLVED').length}
      - Volunteers Standby count: ${volunteers.standby}
      Provide an operational summary, risk analysis, and bulleted recommended actions for crowd safety and travel.
    `;
    
    try {
      const response = await askGemini(prompt, 'copilot', language);
      setAiReport(response.text);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Generate advice when simulation metrics change
    generateCopilotAdvice();
  }, [riskLevel, emergencyAlert]);

  // Audio vocalizer for public broadcaster
  const speakAlert = () => {
    window.speechSynthesis.cancel();
    const textToSpeak = emergencyAlert || aiReport;
    const cleanText = textToSpeak.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const localeMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', hi: 'hi-IN', te: 'te-IN', ar: 'ar-AE'
    };
    utterance.lang = localeMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
            OPERATIONS COPILOT
          </span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
            AI Command Center
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Real-time automated incident dispatching and operational balancing.
          </p>
        </div>

        {/* Refresh button */}
        <button 
          onClick={generateCopilotAdvice}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          )}
          <span>Request Live Gemini Analysis</span>
        </button>
      </div>

      {/* Main Command Room Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Risks, Alerts & Override Broadcasts (Col 1) */}
        <div className="flex flex-col gap-6">
          
          {/* Overall Risk Card */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between min-h-[160px]">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Overall Stadium Risk</span>
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-3xl font-black ${
                  riskLevel === 'LOW' ? 'text-emerald-500' : riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-red-500 animate-pulse'
                }`}>
                  {riskLevel}
                </span>
                <span className="text-[10px] text-slate-400">• Checked 1s ago</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Gates A-F: Normal</span>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">Risk index: 12/100</span>
            </div>
          </div>

          {/* Active alerts panel */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Active System Warnings
            </h3>
            
            {emergencyAlert ? (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50 rounded-xl text-xs font-semibold leading-relaxed animate-pulse">
                {emergencyAlert}
              </div>
            ) : null}

            {incidents.filter(i => i.status !== 'RESOLVED').map(inc => (
              <div key={inc.id} className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800 rounded-xl text-xs flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-200">{inc.type}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    inc.severity === 'HIGH' || inc.severity === 'CRITICAL' 
                      ? 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400' 
                      : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  }`}>
                    {inc.severity}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">{inc.description}</p>
                <div className="text-[9px] text-slate-400 mt-1 flex gap-2">
                  <span>Loc: {inc.location}</span>
                  <span>•</span>
                  <span>Est: {inc.estResolutionTime}m</span>
                </div>
              </div>
            ))}

            {incidents.filter(i => i.status !== 'RESOLVED').length === 0 && !emergencyAlert && (
              <p className="text-xs text-slate-400 italic text-center py-6">No warnings currently active.</p>
            )}
          </div>

          {/* Voice PA Broadcast Control */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Public PA Broadcast</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Vocalize current AI recommendations over PA speakers</p>
            </div>
            
            <button 
              onClick={speakAlert}
              className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-blue-500 animate-bounce" />
              <span>Broadcast Copilot Log</span>
            </button>
          </div>

        </div>

        {/* Right columns: AI Copilot Feed (Col 2 & 3) */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between min-h-[450px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-blue-500 animate-pulse" />
                Continuous AI Command Output
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">Confidence: 99.4%</span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mb-4 text-xs font-semibold">
              {['all', 'crowd', 'safety', 'transit'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1.5 rounded-full capitalize transition-all ${
                    activeTab === tab 
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* AI Text Display */}
            <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/30 dark:border-slate-800/80 rounded-2xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap min-h-[250px]">
              {loading ? (
                <div className="flex flex-col gap-3 py-10 items-center justify-center">
                  <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-[10px] text-slate-400 animate-pulse font-sans">Compiling telemetry & generating advisories...</span>
                </div>
              ) : (
                aiReport
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-500" /> Auto-mapping Active</span>
            <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-purple-500" /> Volunteers Standby: {volunteers.standby}</span>
            <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-blue-500" /> Multi-modal Router Sync</span>
          </div>
        </div>

      </div>

    </div>
  );
};
