import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldAlert, Sparkles, CheckCircle2, UserCheck, FileUp, Mic
} from 'lucide-react';

export const OperationsCenter: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading: analyzing } = useGemini();
  const {
    incidents, resolveIncident, assignVolunteer, reportIncident
  } = useSimulation();

  // Incident Analyzer State
  const [inputText, setInputText] = useState('Medical spill alert. Visual confirm water/soda slick in Sector 104.');
  const [mediaSelected, setMediaSelected] = useState<string | null>(null);
  
  // Analyzer Output State
  const [analyzedOutput, setAnalyzedOutput] = useState<{
    type: string;
    severity: string;
    priority: string;
    location: string;
    response: string;
    staff: string[];
    time: number;
  } | null>({
    type: "Facility & Spills",
    severity: "LOW",
    priority: "LOW",
    location: "Section 104 Concourse",
    response: "Dispatch nearest cleaning crew with slip signs.",
    staff: ["Cleaning Crew"],
    time: 10
  });

  const handleSimulateMedia = (type: 'photo' | 'audio') => {
    if (type === 'photo') {
      setMediaSelected('stadium_floor_slick.png');
      setInputText('Photo analysis requested: Liquid slick on concrete near hotdog stand.');
    } else {
      setMediaSelected('audio_memo_tran.wav');
      setInputText('Audio Transcript: "Attention operations, we have a minor crowd bottleneck forming near Gate B turnstile, request marshalling assistance."');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const prompt = `
      Perform multi-modal incident analysis on the following security telemetry:
      - Media Attachment: ${mediaSelected || "None"}
      - Description/Transcript: ${inputText}
      Identify the Incident Type, Severity, Priority, Location, Suggested Response, Required Staff, and Estimated Resolution Time.
    `;

    try {
      const response = await askGemini(prompt, 'incident', language);
      
      const text = response.text;
      const isMed = text.toLowerCase().includes('medical') || text.toLowerCase().includes('hurt') || inputText.toLowerCase().includes('medical');
      const isSec = text.toLowerCase().includes('security') || text.toLowerCase().includes('crowd') || inputText.toLowerCase().includes('bottleneck');
      
      setAnalyzedOutput({
        type: isMed ? "Medical Emergency" : isSec ? "Security Alert" : "Facility & Spills",
        severity: isMed ? "HIGH" : isSec ? "MEDIUM" : "LOW",
        priority: isMed ? "HIGH" : isSec ? "MEDIUM" : "LOW",
        location: isSec ? "Gate B Entrance" : "Concourse Section 104",
        response: isMed ? "Dispatch First Aid Responders. Inform EMT standby." : isSec ? "Open backup turnstiles. Deploy volunteers." : "Dispatch cleaners.",
        staff: isMed ? ["Medics"] : isSec ? ["Security", "Volunteers"] : ["Cleaners"],
        time: isMed ? 12 : isSec ? 18 : 10
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishIncident = () => {
    if (!analyzedOutput) return;

    reportIncident({
      type: analyzedOutput.type,
      severity: analyzedOutput.severity as any,
      location: analyzedOutput.location,
      description: `Gemini Analyzed: ${inputText}`,
      suggestedResponse: analyzedOutput.response,
      requiredStaff: analyzedOutput.staff,
      estResolutionTime: analyzedOutput.time
    });

    setMediaSelected(null);
    setInputText('');
    setAnalyzedOutput(null);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          ENTERPRISE CONTROLLER
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          Operations Center Dashboard
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Coordinate emergency dispatches, assign volunteers to incidents, and run files through the AI Incident Analyzer.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Incident lists & Resources (Col 1 & 2) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Active incidents queue */}
          <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
              Arena Dispatch Queue ({incidents.filter(i => i.status !== 'RESOLVED').length} active)
            </h3>
            
            <div className="flex flex-col gap-3">
              {incidents.map(inc => (
                <div 
                  key={inc.id} 
                  className={`p-4 border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    inc.status === 'RESOLVED' 
                      ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/80 opacity-60' 
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 ${
                      inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'bg-red-500 animate-pulse' : inc.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{inc.type}</span>
                        <span className="text-[9px] text-slate-400">ID: {inc.id}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{inc.description}</p>
                      <p className="text-[9px] text-blue-500 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1">
                        <span>Staff: {inc.requiredStaff.join(', ')}</span>
                        <span>•</span>
                        <span>Time Left: {inc.estResolutionTime}m</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  {inc.status !== 'RESOLVED' && (
                    <div className="flex gap-2 text-xs font-semibold self-end md:self-center">
                      {inc.status === 'OPEN' && (
                        <button
                          onClick={() => assignVolunteer(inc.id)}
                          className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-200 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Dispatch Staff</span>
                        </button>
                      )}
                      <button
                        onClick={() => resolveIncident(inc.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </div>
                  )}

                  {inc.status === 'RESOLVED' && (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-full self-end md:self-center">
                      RESOLVED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources listing status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">First Aid Teams</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">12 Active / 2 Standby</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Security Officers</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">45 Active / 5 Standby</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Cleaning Crews</span>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">18 Active / 4 Standby</span>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: AI Incident Analyzer (Col 3) */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col justify-between min-h-[500px]">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4.5 h-4.5 text-purple-500" />
              AI Incident Analyzer
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Gemini analyzes uploads (photo/audio) to auto-populate tickets</p>
            
            {/* Attachment options */}
            <div className="flex gap-2 mb-4 text-xs font-semibold">
              <button 
                type="button"
                onClick={() => handleSimulateMedia('photo')}
                className={`flex-1 py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mediaSelected?.includes('png') 
                    ? 'bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-900/40' 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200'
                }`}
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Mock Photo</span>
              </button>
              <button 
                type="button"
                onClick={() => handleSimulateMedia('audio')}
                className={`flex-1 py-2 px-3 border rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  mediaSelected?.includes('wav') 
                    ? 'bg-purple-100 border-purple-300 text-purple-600 dark:bg-purple-900/40' 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Mock Voice</span>
              </button>
            </div>

            {/* Input field */}
            <form onSubmit={handleAnalyze} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">File Description / Speech Transcription</label>
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl min-h-[90px] resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={analyzing}
                className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md hover:shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {analyzing ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Analyze via Gemini API</span>
                  </>
                )}
              </button>
            </form>

            {/* Structured AI Analysis Outputs */}
            {analyzedOutput && (
              <div className="mt-4 p-3 bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800 rounded-xl text-xs flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-200">
                  <span>{analyzedOutput.type}</span>
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-[9px] rounded-full">
                    {analyzedOutput.severity} PRIORITY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Loc: {analyzedOutput.location}</p>
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Suggested AI Action</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-0.5">{analyzedOutput.response}</p>
                </div>
                <div className="text-[9px] text-slate-400 flex justify-between mt-1">
                  <span>Staff: {analyzedOutput.staff.join(', ')}</span>
                  <span>Est Res: {analyzedOutput.time}m</span>
                </div>
              </div>
            )}
          </div>

          {analyzedOutput && (
            <button 
              onClick={handlePublishIncident}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all text-center mt-3 shadow-md hover:shadow-emerald-500/10"
            >
              Publish to Arena Dispatch Queue
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
