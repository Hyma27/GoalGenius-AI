from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
import random

app = FastAPI(title="GoalGenius AI Backend", version="1.0.0")

# CORS middleware to allow connection from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo / hackathon deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class MatchPlanRequest(BaseModel):
    match_id: str
    hotel: str
    budget: float
    arrival_time: str
    transport_mode: str
    accessibility: bool

class IncidentReport(BaseModel):
    incident_type: str
    severity: str
    location: str
    description: str

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "GoalGenius AI Backend", "twin_simulation": "active"}

@app.post("/api/match/plan")
async def generate_match_plan(req: MatchPlanRequest):
    # Simulated Gemini response format for Match Day timeline
    return {
        "status": "success",
        "timeline": [
            {"time": "3.5 Hours Before Kickoff", "activity": f"Depart hotel: {req.hotel} via {req.transport_mode}.", "tip": "Best route mapped: clear traffic forecast."},
            {"time": "2.5 Hours Before Kickoff", "activity": "Arrive at World Cup Transit Zone.", "tip": "Follow step-free pathways if accessibility is enabled."},
            {"time": "2.0 Hours Before Kickoff", "activity": "Enter via Gate D based on crowd balancing recommendations.", "tip": "Estimated wait time is 6 minutes."},
            {"time": "1.5 Hours Before Kickoff", "activity": "Visit Food Court Section 104.", "tip": "Pre-order available for local dietary choices."},
            {"time": "Kickoff!", "activity": f"Find seats near gate entrance. Enjoy the Match: {req.match_id}.", "tip": "In-seat emergency support accessible via the portal."}
        ],
        "weather_impact": "Light showers predicted around 7 PM. Roof status will update to CLOSED. Suggest bringing light rainwear.",
        "budget_optimization": f"Estimated travel cost: ${round(req.budget * 0.15, 2)} utilizing public transit (free with World Cup Matchday Pass).",
        "parking_recommendation": "Zone Orange - pre-book online. Fully wheelchair accessible.",
        "gate_recommendation": "Gate D (lowest predicted queues).",
        "walking_route_summary": "1.2 km flat walk, follow blue stadium signage.",
        "accessibility_guidance": "Elevator A-2 is located 50m from Gate D. Staff alerted for support.",
        "travel_alerts": "Metro Line 2 has minor delays of 4 mins; extra trains deployed."
    }

@app.post("/api/incident/analyze")
async def analyze_incident(
    incident_type: str = Form(...),
    severity: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    media_file: Optional[UploadFile] = File(None)
):
    # Incident Analyzer model outputs
    resolution_times = {"LOW": 15, "MEDIUM": 30, "HIGH": 12, "CRITICAL": 8}  # In minutes
    time_est = resolution_times.get(severity.upper(), 20)
    
    required_staff = {
        "Security Alert": ["Stadium Security Team", "Sector Supervisor"],
        "Medical Emergency": ["First Aid Responders", "Stretcher Team"],
        "Facility & Spills": ["Cleaning Crew", "Maintenance Staff"],
        "Ticketing & Gate": ["Ticketing Volunteers", "Gate Operations Lead"],
        "Crowd Flow Check": ["Crowd Management Staff", "Volunteer Marshals"]
    }
    
    staff = required_staff.get(incident_type, ["Duty Officer"])
    
    return {
        "incident_type": incident_type,
        "severity": severity,
        "priority": "HIGH" if severity in ["HIGH", "CRITICAL"] else "MEDIUM" if severity == "MEDIUM" else "LOW",
        "location": location,
        "description": description,
        "suggested_response": f"Dispatch nearest {staff[0]} to {location} immediately. Broadcast route updates if blocking pathways.",
        "required_staff": staff,
        "estimated_resolution_time_min": time_est,
        "report_id": f"GG-2026-{random.randint(10000, 99999)}"
    }

@app.get("/api/predict/sustainability")
async def get_sustainability_forecast():
    return {
        "predicted_co2_offset_kg": random.randint(1500, 3000),
        "energy_consumption_kwh": {
            "hvac": random.randint(4000, 5000),
            "lighting": random.randint(2500, 3500),
            "concessions": random.randint(1500, 2000),
            "simulated_peak_demand": "9.2 MW"
        },
        "water_consumption_liters": random.randint(20000, 35000),
        "waste_generated_kg": {
            "recyclable": random.randint(1200, 1800),
            "organic": random.randint(800, 1200),
            "landfill": random.randint(300, 500)
        },
        "optimizations": [
            "Enable solar cell grid storage storage buffers from 4 PM to 7 PM.",
            "Reduce HVAC flow in under-occupied Sectors 302-308.",
            "Redirect water graywater recycling systems for field irrigation."
        ]
    }

# Configure static serving of React frontend static files
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIR):
    assets_dir = os.path.join(FRONTEND_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{rest_of_path:path}")
    async def serve_frontend(rest_of_path: str):
        # Ignore API calls or documentation
        if rest_of_path.startswith("api") or rest_of_path.startswith("docs") or rest_of_path.startswith("openapi.json") or rest_of_path.startswith("redoc"):
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join(FRONTEND_DIR, rest_of_path)
        if rest_of_path and os.path.isfile(file_path):
            return FileResponse(file_path)
            
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
