from fastapi.testclient import TestClient
from app.main import app
import pytest

client = TestClient(app)

def get_auth_headers():
    """Helper to log in and get a valid JWT header."""
    login_payload = {
        "email": "director@worldcup2026.org",
        "password": "valid_password"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    token = response.json()["token"]
    return {"Authorization": f"Bearer {token}"}

def test_health_endpoint():
    """Verify that the system health check returns active simulation coordinates."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "GoalGenius AI Backend"

def test_unauthenticated_fails():
    """Verify that accessing protected endpoints without JWT returns 403 / 401."""
    good_payload = {
        "match_id": "USA-MEX",
        "hotel": "Hilton Times Square",
        "budget": 200.0,
        "arrival_time": "17:00",
        "transport_mode": "Metro Train",
        "accessibility": True
    }
    response = client.post("/api/match/plan", json=good_payload)
    assert response.status_code == 401  # HTTPBearer returns 401 if header missing

def test_match_plan_validation():
    """Validate that Pydantic enforces schema structures for planning requests."""
    # Invalid missing parameters
    bad_payload = {
        "match_id": "USA-MEX",
        "hotel": "",
        "budget": -10.0  # Invalid budget < 0
    }
    headers = get_auth_headers()
    response = client.post("/api/match/plan", json=bad_payload, headers=headers)
    assert response.status_code == 422  # Unprocessable Entity

def test_match_plan_generation():
    """Verify matchday timeline generation for valid passenger telemetry details."""
    good_payload = {
        "match_id": "USA-MEX",
        "hotel": "Hilton Times Square",
        "budget": 200.0,
        "arrival_time": "17:00",
        "transport_mode": "Metro Train",
        "accessibility": True
    }
    headers = get_auth_headers()
    response = client.post("/api/match/plan", json=good_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert len(data["timeline"]) > 0
    assert "parking_recommendation" in data

def test_ai_generate_endpoint():
    """Verify backend generative completions mock fallback responses."""
    payload = {
        "prompt": "Find my seat in Section 202",
        "context_type": "chat",
        "language": "en"
    }
    headers = get_auth_headers()
    response = client.post("/api/ai/generate", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "text" in data
    assert "confidence" in data
