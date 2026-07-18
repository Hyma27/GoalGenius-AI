import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ClipboardList, AlertTriangle, CheckCircle2
} from 'lucide-react';

export const VolunteerCenter: React.FC = () => {
  const { reportIncident, volunteers } = useSimulation();
  
  // Incident submission form
  const [incType, setIncType] = useState('Facility & Spills');
  const [severity, setSeverity] = useState('LOW');
  const [location, setLocation] = useState('Concourse Section 202');
  const [description, setDescription] = useState('');
  
  const [submitted, setSubmitted] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([
    { id: 1, task: "Station near Gate B to direct turnstile crowd overflow to Gate D.", done: false },
    { id: 2, task: "Assist Spanish-speaking fans at Info Booth 3.", done: true },
    { id: 3, task: "Verify step-free path route signage is clear on Level 1 West.", done: false }
  ]);

  const toggleTask = (id: number) => {
    setAssignedTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    reportIncident({
      type: incType,
      severity: severity as any,
      location,
      description,
      suggestedResponse: `AI Automated response dispatch nearest ${incType} squad to ${location}.`,
      requiredStaff: incType === 'Medical Emergency' ? ['First Aid'] : ['Cleaners'],
      estResolutionTime: severity === 'HIGH' ? 12 : 20
    });

    setDescription('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-wider font-extrabold text-blue-500 uppercase px-2.5 py-1 bg-blue-100/60 dark:bg-blue-900/40 rounded-full">
          VOLUNTEER PORTAL
        </span>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight mt-2">
          Volunteer Hub
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Access your AI assigned checklists, log concourse incidents, and view shift timetables.
        </p>
      </div>

      {/* Roster overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">On-duty Volunteers</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{volunteers.active} / {volunteers.total}</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Standby Reservists</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2">{volunteers.standby} staff</span>
        </div>
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Active AI Task Dispatch Rate</span>
          <span className="text-2xl font-black text-emerald-500 mt-2">98.2%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Task recommendations checklist */}
        <div className="glass-panel rounded-3xl p-5 lg:col-span-2 flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <ClipboardList className="w-4.5 h-4.5 text-blue-500" />
            AI Task Allocation List
          </h3>
          
          <div className="flex flex-col gap-2">
            {assignedTasks.map(task => (
              <label 
                key={task.id} 
                className={`p-4 border rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                  task.done 
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800 opacity-60 line-through' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-500'
                }`}
              >
                <input 
                  type="checkbox" 
                  checked={task.done} 
                  onChange={() => toggleTask(task.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                />
                <span className="text-xs text-slate-700 dark:text-slate-200 font-semibold">{task.task}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Log incident form */}
        <div className="glass-panel rounded-3xl p-5">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
            Report Arena Incident
          </h3>
          <p className="text-[10px] text-slate-400 mb-4">AI immediately dispatches help crews and adjusts routing advice</p>
          
          {submitted ? (
            <div className="p-4 bg-emerald-100/60 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50 rounded-2xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-fadeIn py-10 justify-center flex-col">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="font-bold mt-2">Incident Logged successfully</p>
              <p className="text-[10px] text-center mt-1">Telemetry broadcasted to Operations Command.</p>
            </div>
          ) : (
            <form onSubmit={handleIncidentSubmit} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Incident Category</label>
                <select 
                  value={incType}
                  onChange={e => setIncType(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl"
                >
                  <option value="Facility & Spills">Facility & Spills</option>
                  <option value="Security Alert">Security Alert</option>
                  <option value="Medical Emergency">Medical Emergency</option>
                  <option value="Ticketing & Gate">Ticketing & Gate</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Severity</label>
                <select 
                  value={severity}
                  onChange={e => setSeverity(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl"
                >
                  <option value="LOW">Low - General cleanup/fix</option>
                  <option value="MEDIUM">Medium - Flow disruption</option>
                  <option value="HIGH">High - Medical dispatch/safety hazards</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl"
                  placeholder="e.g. Concourse Section 202"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-600 dark:text-slate-300">Incident Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-xl min-h-[70px] resize-none"
                  placeholder="Provide precise details of spill or crowd clustering..."
                  required
                />
              </div>

              <button 
                type="submit"
                className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md hover:shadow-red-500/10 active:scale-95 transition-all text-center mt-2"
              >
                File & Broadcast Report
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
