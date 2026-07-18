import React, { useState } from 'react';
import { useGemini } from '../hooks/useGemini';
import { useLanguage } from '../context/LanguageContext';
import { useSimulation } from '../context/SimulationContext';
import { 
  FileText, Printer
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { language } = useLanguage();
  const { askGemini, loading } = useGemini();
  const { incidents, overallOccupancy, waterUsageLiters, carbonSavedKg } = useSimulation();

  const [reportType, setReportType] = useState('summary');
  const [compiledReport, setCompiledReport] = useState<string>(
    "GoalGenius AI Matchday Summary Report\nFIFA World Cup 2026 Operations\n\n- Current Occupancy: 68%\n- Total Incidents Reported: 2 (1 resolved, 1 active)\n- Sustainability Carbon Offset: 1420 kg CO2 saved\n- Water Conserved: 18500 Liters\n- Average Gate queue wait time: 9.6 minutes\n\nAI Operational Assessment: Crowd flow is balanced across Gates A, C, and D. Gate B wait queues have stabilized. Metro Line 2 congestion has been cleared by deploying extra transit marshals."
  );

  const handleGenerateReport = async (type: string) => {
    setReportType(type);
    const prompt = `
      Compile a formal matchday report for type: ${type}.
      Include current stadium metrics:
      - Occupancy: ${overallOccupancy}%
      - Carbon Offsets: ${carbonSavedKg} kg
      - Water: ${waterUsageLiters} L
      - Active incident list: ${incidents.filter(i => i.status !== 'RESOLVED').map(i => i.type).join(', ') || "None"}
      Provide an Executive Summary, Incident metrics, Volunteer distribution, and Transit delays.
    `;

    try {
      const response = await askGemini(prompt, 'sustainability', language);
      setCompiledReport(response.text);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans print:bg-white print:text-black">
      
      {/* Header - Hidden on print */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
            ANALYTICS GENERATOR
          </span>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
            AI Reports & Analytics
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Generate and export printable FIFA matchday operational records compiled by Gemini.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: report compiler selectors - Hidden on print */}
        <div className="glass-panel rounded-3xl p-5 flex flex-col gap-4 print:hidden">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">Report Builder</h3>
          
          <div className="flex flex-col gap-2">
            {[
              { id: 'summary', label: 'Executive Operations Summary' },
              { id: 'incident', label: 'Security & Incident Log' },
              { id: 'crowd', label: 'Crowd Flow & Density Audit' },
              { id: 'volunteer', label: 'Volunteer Allocation Summary' },
              { id: 'transport', label: 'Transit & Mobility Report' },
              { id: 'sustainability', label: 'Eco Footprint Audit' },
            ].map(rep => (
              <button
                key={rep.id}
                onClick={() => handleGenerateReport(rep.id)}
                className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold border transition-all ${
                  reportType === rep.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100'
                }`}
              >
                {rep.label}
              </button>
            ))}
          </div>

          <div className="text-[9px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>Complies with FIFA documentation schemas.</span>
          </div>
        </div>

        {/* Right: Compiled preview page */}
        <div className="glass-panel rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between min-h-[480px] bg-white print:border-none print:shadow-none print:p-0">
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800/80 print:border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white print:border print:border-black">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 print:text-black">GOALGENIUS AI SYSTEMS</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold print:text-slate-600">FIFA 2026 TELEMETRY</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase print:text-black">OFFICIAL COMPILATION</span>
            </div>

            {/* Document display */}
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono whitespace-pre-wrap min-h-[300px] print:text-black">
              {loading ? (
                <div className="flex flex-col gap-3 py-16 items-center justify-center print:hidden">
                  <span className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                  <span className="text-[10px] text-slate-400 animate-pulse font-sans">Compiling historical database and formatting charts...</span>
                </div>
              ) : (
                compiledReport
              )}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[9px] text-slate-400 flex justify-between print:border-slate-200 print:text-slate-600">
            <span>Authored by: Gemini Generative AI Agent</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
