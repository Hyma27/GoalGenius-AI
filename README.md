# GoalGenius AI - FIFA World Cup 2026 Smart Stadium Platform

**GoalGenius AI** is an advanced operational control console and fan navigation assistant custom-built for the FIFA World Cup 2026 matchdays. 

Designed for massive crowds and high-density concourses, GoalGenius AI coordinates crowd-flow models, dynamic transport links, weather changes, emergency protocols, and accessibility guidance within host arenas like MetLife Stadium.

---

## 🚀 Key Features

* **Interactive Stadium Map**: CSS/SVG-rendered concourse navigation system showing gates, parking lots, food courts, washrooms, medical centers, exits, and AI-predicted wait queues.
* **AI Travel Copilot**: Multimodal travel planner that dynamically schedules transit paths (metro, buses, walking) based on live delay statistics.
* **Accessibility Portal**: Features an auditory screen-reader synthesis announcer and high-contrast view filters matching WCAG 2.1 AA parameters.
* **ChatGPT-Style Assistant**: Floating AI Concierge supporting voice-to-text queries, suggested prompt chips, and localized multi-lingual translations.
* **AI Operations Center**: An incident analyzer that parses security memos, dispatches nearest volunteer staff squads, and logs crowd incidents.

---

## 🏗️ System Architecture

GoalGenius AI operates as a unified service:
* **Backend**: FastAPI (Python) web service handling input validation schemas, client rate-limiting, secure HTTP response headers, and hosting static assets.
* **Frontend**: React (Vite + TypeScript) Single Page Application configured with route-based lazy loading chunk splitting.
* **Generative AI Engine**: Server-side Gemini 1.5 Flash API integration shielded via backend variables to prevent API credentials leakage.

---

## 🛠️ Quick-Start Guide

### Prerequisites
* Python 3.12+
* Node.js 20+
* NPM 10+

### 1. Backend Setup & Startup
Navigate to the backend directory, install packages, and launch uvicorn:
```bash
cd backend
pip install -r requirements.txt
pip install pytest httpx python-dotenv

# Start the uvicorn development server
python -m uvicorn app.main:app --reload --port 8000
```
*Note: Create a copy of `backend/.env` and input your `GEMINI_API_KEY="..."` to enable live Gemini prompts. If empty, the server automatically defaults to the simulated high-fidelity fallback engine.*

### 2. Frontend Setup & Startup
Open a new terminal tab, navigate to the frontend directory, and start Vite:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser to view the console.

---

## 🔬 Automated Testing & Lints

GoalGenius AI features complete test coverage for operations validation.

### Run Frontend Unit Tests (Vitest)
Verifies components, route guards, translation triggers, and user interaction hooks:
```bash
cd frontend
npx vitest run
```

### Run Backend API Tests (Pytest)
Verifies endpoint health, Pydantic inputs validation, and mock response generators:
```bash
cd backend
python -m pytest
```

### Production Bundle Check
Validates compiled TypeScript codes and asset optimization builds:
```bash
cd frontend
npm run build
```

---

## 🔒 Production Security Protocols

1. **API Credentials Shielding**: The client single-page application never exposes Gemini developer tokens. All requests are proxied via `/api/ai/generate` protected by server-side env loads.
2. **CORS & Rate Limiting**: FastAPI rate limiters restrict requests per client IP to mitigate automated crawler loops or brute-force queries.
3. **Secure HTTP Headers**: Configured Content Security Policy (CSP), Strict Transport Security (HSTS), X-Frame-Options (Clickjacking block), and XSS protectors on all JSON API payloads.

---

## ⚙️ DevOps & CI Workflows

GoalGenius AI is integrated with a **GitHub Actions CI Pipeline** (`.github/workflows/ci.yml`). On every pull request, the pipeline automatically:
* Deploys Node and Python environment nodes.
* Audits frontend lints (`npm run lint`).
* Runs frontend unit test suites (`npx vitest run`).
* Compiles Vite client production bundles (`npm run build`).
* Runs backend API validation tests (`pytest`).
