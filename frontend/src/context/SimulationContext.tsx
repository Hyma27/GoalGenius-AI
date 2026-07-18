import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export interface GateInfo {
  name: string;
  occupancy: number; // percentage
  waitTime: number; // minutes
  status: 'OPEN' | 'WARNING' | 'CLOSED';
}

export interface TransitInfo {
  line: string;
  status: 'NORMAL' | 'DELAYED' | 'SUSPENDED';
  delayMin: number;
  crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SecurityIncident {
  id: string;
  time: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  description: string;
  status: 'OPEN' | 'ASSIGNED' | 'RESOLVED';
  suggestedResponse: string;
  requiredStaff: string[];
  estResolutionTime: number; // in mins
}

interface SimulationState {
  matchScore: { teamA: number; teamB: number };
  matchMinute: number;
  matchActive: boolean;
  weather: { temp: number; condition: string; rainProb: number; roofState: 'OPEN' | 'CLOSED' };
  overallOccupancy: number; // total percentage
  gates: GateInfo[];
  transitLines: TransitInfo[];
  emergencyAlert: string | null;
  volunteers: { total: number; active: number; standby: number };
  carbonSavedKg: number;
  energyUsageKw: number;
  waterUsageLiters: number;
  wasteGeneratedKg: { recyclables: number; organics: number; landfill: number };
  fanExperienceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  aiConfidence: {
    crowd: number;
    route: number;
    emergency: number;
    travel: number;
    weather: number;
    accessibility: number;
  };
  simulationSpeed: number;
  incidents: SecurityIncident[];
}

interface SimulationContextType extends SimulationState {
  setSimulationSpeed: (speed: number) => void;
  injectEvent: (eventType: 'GOAL' | 'HALFTIME' | 'EVACUATION' | 'METRO_DELAY' | 'STORM') => void;
  reportIncident: (incident: Omit<SecurityIncident, 'id' | 'time' | 'status'>) => void;
  resolveIncident: (id: string) => void;
  assignVolunteer: (incidentId: string) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [speed, setSpeed] = useState<number>(1);
  const [minute, setMinute] = useState<number>(24);
  const [matchScore, setMatchScore] = useState({ teamA: 1, teamB: 0 });
  const [weather, setWeather] = useState<{ temp: number; condition: string; rainProb: number; roofState: 'OPEN' | 'CLOSED' }>({
    temp: 74,
    condition: 'Clear',
    rainProb: 15,
    roofState: 'OPEN'
  });
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  
  // Dynamic metrics
  const [overallOccupancy, setOverallOccupancy] = useState(68);
  const [carbonSaved, setCarbonSaved] = useState(1420);
  const [energyUsage, setEnergyUsage] = useState(4820);
  const [waterUsage, setWaterUsage] = useState(18500);
  const [wasteGenerated] = useState({ recyclables: 820, organics: 540, landfill: 180 });
  
  // State elements
  const [gates, setGates] = useState<GateInfo[]>([
    { name: 'Gate A', occupancy: 42, waitTime: 4, status: 'OPEN' },
    { name: 'Gate B', occupancy: 94, waitTime: 18, status: 'WARNING' },
    { name: 'Gate C', occupancy: 85, waitTime: 15, status: 'OPEN' },
    { name: 'Gate D', occupancy: 30, waitTime: 3, status: 'OPEN' },
    { name: 'Gate E', occupancy: 88, waitTime: 16, status: 'WARNING' },
    { name: 'Gate F', occupancy: 15, waitTime: 2, status: 'OPEN' },
  ]);

  const [transitLines, setTransitLines] = useState<TransitInfo[]>([
    { line: 'Metro Line 1', status: 'NORMAL', delayMin: 0, crowdLevel: 'MEDIUM' },
    { line: 'Metro Line 2', status: 'NORMAL', delayMin: 0, crowdLevel: 'HIGH' },
    { line: 'Express Shuttle A', status: 'NORMAL', delayMin: 0, crowdLevel: 'LOW' },
    { line: 'Stadium Bus Hub', status: 'NORMAL', delayMin: 0, crowdLevel: 'MEDIUM' },
  ]);

  const [volunteers, setVolunteers] = useState({ total: 420, active: 310, standby: 110 });

  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: 'INC-01',
      time: '19:40',
      type: 'Facility & Spills',
      severity: 'LOW',
      location: 'Section 104 Food Court',
      description: 'Soda spill causing slippery floor near hot dog stall.',
      status: 'ASSIGNED',
      suggestedResponse: 'Dispatch nearest cleaning crew. Place caution signage.',
      requiredStaff: ['Cleaning Crew'],
      estResolutionTime: 10
    },
    {
      id: 'INC-02',
      time: '19:55',
      type: 'Security Alert',
      severity: 'MEDIUM',
      location: 'Gate B Entrance',
      description: 'Crowd cluster forming. Two turnstiles jammed.',
      status: 'OPEN',
      suggestedResponse: 'Open Gate D backup entry lanes. Deploy 4 volunteer marshals to direct traffic.',
      requiredStaff: ['Stadium Security Team', 'Volunteer Marshals'],
      estResolutionTime: 18
    }
  ]);

  // AI Decision Confidence metrics (slightly fluctuates based on time to simulate live feed)
  const [aiConfidence, setAiConfidence] = useState({
    crowd: 99.1,
    route: 98.8,
    emergency: 99.4,
    travel: 98.5,
    weather: 97.9,
    accessibility: 99.3,
  });

  // Calculate fan experience index dynamically based on parameters
  const getFanExperienceScore = () => {
    let base = 96;
    // Deduct for delays
    const highDelays = transitLines.filter(t => t.status !== 'NORMAL').length;
    base -= highDelays * 3;
    // Deduct for long gate lines
    const badGates = gates.filter(g => g.waitTime > 10).length;
    base -= badGates * 2;
    // Deduct for critical weather
    if (weather.condition === 'Heavy Rain') base -= 4;
    // Deduct for open alerts
    if (emergencyAlert) base -= 10;
    return Math.max(70, Math.min(99, base));
  };

  // Clock effect running the Digital Twin simulation state
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const tickTime = 3000 / speed; // Milliseconds per simulated minute
    
    intervalRef.current = setInterval(() => {
      // 1. Advance game minute
      setMinute(prev => {
        if (prev >= 90) return 1;
        return prev + 1;
      });

      // 2. Fluctuatings stats slightly
      setOverallOccupancy(prev => {
        const delta = Math.sin(Date.now() / 100000) * 0.5;
        return Math.max(10, Math.min(100, Math.round((prev + delta) * 10) / 10));
      });

      // Fluctuate gate queues
      setGates(prev => 
        prev.map(g => {
          let change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          let wait = Math.max(1, g.waitTime + change);
          let occ = Math.max(5, Math.min(100, g.occupancy + change * 4));
          let status: 'OPEN' | 'WARNING' | 'CLOSED' = g.status;
          if (status !== 'CLOSED') {
            status = wait > 12 ? 'WARNING' : 'OPEN';
          }
          return { ...g, waitTime: wait, occupancy: occ, status };
        })
      );

      // Fluctuate carbon/energy indicators
      setCarbonSaved(c => c + Math.floor(Math.random() * 3) + 1);
      setEnergyUsage(e => e + Math.floor(Math.random() * 10) - 4);
      setWaterUsage(w => w + Math.floor(Math.random() * 20) + 5);
      
      // Update AI scores
      setAiConfidence(prev => ({
        crowd: Math.round((99.1 + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        route: Math.round((98.8 + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        emergency: Math.round((99.4 + (Math.random() * 0.2 - 0.1)) * 10) / 10,
        travel: Math.round((98.5 + (Math.random() * 0.6 - 0.3)) * 10) / 10,
        weather: Math.round((97.9 + (Math.random() * 0.4 - 0.2)) * 10) / 10,
        accessibility: Math.round((99.3 + (Math.random() * 0.2 - 0.1)) * 10) / 10,
      }));

    }, tickTime);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed]);

  const injectEvent = (eventType: 'GOAL' | 'HALFTIME' | 'EVACUATION' | 'METRO_DELAY' | 'STORM') => {
    switch (eventType) {
      case 'GOAL':
        setMatchScore(prev => ({ ...prev, teamA: prev.teamA + 1 }));
        setOverallOccupancy(o => Math.min(100, o + 2));
        break;
      case 'HALFTIME':
        setMinute(45);
        setGates(g => g.map(gate => ({ ...gate, waitTime: gate.waitTime + 10, occupancy: Math.min(100, gate.occupancy + 15) })));
        break;
      case 'EVACUATION':
        setEmergencyAlert('SYSTEM ACTIVE: SECURITY INITIATED EVACUATION DRILL. PROCEED TO NEAREST EMERGENCY EXIT.');
        setGates(g => g.map(gate => ({ ...gate, status: 'CLOSED', waitTime: 0 })));
        setVolunteers(v => ({ ...v, active: v.total, standby: 0 }));
        break;
      case 'METRO_DELAY':
        setTransitLines(lines => 
          lines.map(line => 
            line.line === 'Metro Line 2' 
              ? { ...line, status: 'DELAYED', delayMin: 22, crowdLevel: 'HIGH' } 
              : line
          )
        );
        break;
      case 'STORM':
        setWeather({ temp: 62, condition: 'Heavy Rain', rainProb: 95, roofState: 'CLOSED' });
        break;
    }
  };

  const reportIncident = (newInc: Omit<SecurityIncident, 'id' | 'time' | 'status'>) => {
    const incId = `INC-${Math.floor(Math.random() * 90) + 10}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const fullInc: SecurityIncident = {
      ...newInc,
      id: incId,
      time: timeStr,
      status: 'OPEN'
    };

    setIncidents(prev => [fullInc, ...prev]);
    if (newInc.severity === 'CRITICAL' || newInc.severity === 'HIGH') {
      setEmergencyAlert(`AI RISK ALERT: ${newInc.type} at ${newInc.location}. Severity: ${newInc.severity}.`);
    }
  };

  const resolveIncident = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'RESOLVED' } : inc));
    // Clear alerts if corresponding incident resolved
    setIncidents(prev => {
      const remainingCritical = prev.filter(inc => inc.id !== id && inc.status !== 'RESOLVED' && (inc.severity === 'CRITICAL' || inc.severity === 'HIGH'));
      if (remainingCritical.length === 0) {
        setEmergencyAlert(null);
      }
      return prev;
    });
  };

  const assignVolunteer = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'ASSIGNED' } : inc));
  };

  const riskLevel = emergencyAlert ? 'HIGH' : incidents.filter(i => i.status !== 'RESOLVED').length > 2 ? 'MEDIUM' : 'LOW';

  return (
    <SimulationContext.Provider value={{
      matchScore,
      matchMinute: minute,
      matchActive: true,
      weather,
      overallOccupancy,
      gates,
      transitLines,
      emergencyAlert,
      volunteers,
      carbonSavedKg: carbonSaved,
      energyUsageKw: energyUsage,
      waterUsageLiters: waterUsage,
      wasteGeneratedKg: wasteGenerated,
      fanExperienceScore: getFanExperienceScore(),
      riskLevel,
      aiConfidence,
      simulationSpeed: speed,
      incidents,
      setSimulationSpeed: setSpeed,
      injectEvent,
      reportIncident,
      resolveIncident,
      assignVolunteer
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
