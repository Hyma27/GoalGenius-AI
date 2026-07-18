import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Accessibility, Volume2, PhoneCall, CheckCircle
} from 'lucide-react';

export const AccessibilityAssistant: React.FC = () => {
  const { language } = useLanguage();
  
  const [highContrast, setHighContrast] = useState(false);
  const [supportRequested, setSupportRequested] = useState(false);

  const vocalizeStatus = () => {
    window.speechSynthesis.cancel();
    const txt = "Accessibility guidance active. Gate D has fully accessible elevator entrance pathways. Ramps are open and staff members are standing by at all turnstiles. Press call assistance if you need manual support.";
    const utterance = new SpeechSynthesisUtterance(txt);
    const localeMap: Record<string, string> = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', pt: 'pt-BR', hi: 'hi-IN', te: 'te-IN', ar: 'ar-AE'
    };
    utterance.lang = localeMap[language] || 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleRequestSupport = () => {
    setSupportRequested(true);
    setTimeout(() => {
      setSupportRequested(false);
    }, 4000);
  };

  return (
    <div className={`flex flex-col gap-6 md:gap-8 font-sans ${highContrast ? 'bg-black text-yellow-400 p-4 rounded-3xl border-4 border-yellow-400' : ''}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className={`text-[10px] tracking-wider font-extrabold uppercase px-2.5 py-1 rounded-full ${
            highContrast ? 'bg-yellow-400 text-black' : 'bg-teal-100/60 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400'
          }`}>
            ADA COMPLIANCE ASSISTANT
          </span>
          <h1 className="text-2xl font-black tracking-tight mt-2">
            Accessibility & Assistance Portal
          </h1>
          <p className={`text-xs mt-1 ${highContrast ? 'text-yellow-400' : 'text-slate-400 dark:text-slate-500'}`}>
            Vocal announcers, step-free navigation routers, and direct volunteer call buttons.
          </p>
        </div>

        {/* Contrast Adjuster */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            highContrast 
              ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          {highContrast ? 'Disable Contrast Text' : 'Enable High Contrast'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Speech Synthesizer & Toggle options */}
        <div className={`glass-panel rounded-3xl p-5 flex flex-col justify-between min-h-[260px] ${highContrast ? 'border-2 border-yellow-400 bg-black text-yellow-400' : ''}`}>
          <div>
            <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" />
              Auditory Voice Guidance
            </h3>
            <p className="text-[10px] opacity-80 leading-normal">
              Press the broadcast button to vocalize live gate elevator conditions and boarding guides.
            </p>
          </div>

          <button 
            onClick={vocalizeStatus}
            className={`py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-6 ${
              highContrast 
                ? 'bg-yellow-400 text-black font-black border-2 border-black' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
            }`}
          >
            <Volume2 className="w-4.5 h-4.5" />
            <span>Vocalize Accessibility Updates</span>
          </button>
        </div>

        {/* Center: Support request dashboard */}
        <div className={`glass-panel rounded-3xl p-5 flex flex-col justify-between ${highContrast ? 'border-2 border-yellow-400 bg-black text-yellow-400' : ''}`}>
          <div>
            <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
              <Accessibility className="w-4.5 h-4.5" />
              Call Physical Assistant
            </h3>
            <p className="text-[10px] opacity-80 mb-4">Request a venue volunteer to assist you physically at your sector location.</p>
            
            {supportRequested ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/60 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-fadeIn py-10 justify-center flex-col">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <p className="font-bold mt-2">Volunteer Dispatched</p>
                <p className="text-[10px] text-center mt-1">A helper is coming to your coordinates.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleRequestSupport}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 text-left px-4"
                >
                  Request Wheelchair Escort
                </button>
                <button 
                  onClick={handleRequestSupport}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 text-left px-4"
                >
                  Request Blind Guide Escort
                </button>
              </div>
            )}
          </div>
          
          <a 
            href="tel:+18005552026" 
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-500 hover:underline mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Direct ADA Hotline: +1 (800) 555-2026</span>
          </a>
        </div>

        {/* Right: Step-free access status */}
        <div className={`glass-panel rounded-3xl p-5 flex flex-col gap-4 ${highContrast ? 'border-2 border-yellow-400 bg-black text-yellow-400' : ''}`}>
          <h3 className="font-bold text-sm">Step-Free Entry Points</h3>
          
          <div className="flex flex-col gap-3">
            {[
              { gate: 'Gate A Entrance', elevator: 'Elevator A-1', status: 'OPERATIONAL' },
              { gate: 'Gate D Plaza', elevator: 'Elevator D-2', status: 'OPERATIONAL' },
              { gate: 'Gate E Concourses', elevator: 'Elevator E-1', status: 'MAINTENANCE' },
            ].map(elevator => (
              <div key={elevator.gate} className="p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <h4 className="font-bold">{elevator.gate}</h4>
                  <p className="text-[10px] opacity-75 mt-0.5">{elevator.elevator}</p>
                </div>
                
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                  elevator.status === 'OPERATIONAL' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                }`}>
                  {elevator.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
