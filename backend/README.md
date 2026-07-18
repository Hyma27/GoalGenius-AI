# GoalGenius AI Backend Services

GoalGenius AI Backend is built on FastAPI and leverages MongoDB (motor async client) and Google's Gemini API to power smart stadium decision telemetry, multi-modal incident reporting, and sustainability forecasting.

## Installation

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/goalgenius
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   PORT=8000
   ```

3. **Launch the FastAPI Server**:
   ```bash
   python -m uvicorn app.main:app --reload --port 8000
   ```

## API Endpoints Exposed

* **GET `/api/health`**: Health status and twin simulation loop verification.
* **POST `/api/match/plan`**: Generates full matchday itineraries utilizing travel metrics and budget optimizations.
* **POST `/api/incident/analyze`**: Accepts media attachments (images/voice recordings) and auto-populates incident severities, prioritize dispatches, and calculate resolution metrics.
* **GET `/api/predict/sustainability`**: Fetches green grids statistics, CO2 offsets, and smart solar consumption recommendations.
