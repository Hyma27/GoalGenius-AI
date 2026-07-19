# Tasks

- [x] Performance & Code Quality Enhancements
  - [x] Implement `React.lazy` and `React.Suspense` route loading in `App.tsx`
  - [x] Delete deprecated pages (`Sustainability.tsx`, `CommandCenter.tsx`, `DigitalTwin.tsx`)
  - [x] Extract stadium map SVG layouts into a reusable sub-component `StadiumMap.tsx`
  - [x] Remove all `any` declarations and use strict TypeScript interfaces in components
- [x] Backend Security & Server-side Gemini Wrapper
  - [x] Add `/api/ai/generate` endpoint inside `backend/app/main.py`
  - [x] Implement security headers and rate-limiting middleware
  - [x] Update `useGemini.ts` to target local `/api/ai/generate`
- [x] Automated Testing Setup
  - [x] Setup Vitest and React Testing Library in `frontend/`
  - [x] Write unit and component tests for Login, Dashboard, and Chatbot
  - [x] Write backend pytest cases for API endpoints and Pydantic validation
- [x] DevOps & CI configuration
  - [x] Create GitHub Actions workflow `.github/workflows/ci.yml`
- [x] Validation & Final Report
  - [x] Run typescript checks, lints, and frontend production builds
  - [x] Generate the final quality report estimating updated hackathon scores
