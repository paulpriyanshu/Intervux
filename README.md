# IntervuX — AI-Powered Real-Time Interview Companion

**IntervuX** is a real-time, multimodal AI-powered mock interview platform designed to help candidates prepare for and excel in technical and behavioral interviews. Instead of simply evaluating static text answers, IntervuX combines **Computer Vision**, **Speech & Vocalics Analysis**, and **Structured LLM Evaluation** through a dedicated **Multimodal Fusion Engine** to generate holistic, contextual coaching feedback.

---

## 1. Project Overview

Preparing for modern technical and behavioral interviews requires more than memorizing algorithms and rehearsing STAR answers. Delivery matters: eye contact, composure, speaking pace, pauses, and filler words play a decisive role in interviewer perception.

IntervuX solves this by simulating an authentic interview environment where:
- Candidates see dynamic questions and an interactive webcam preview.
- Observable video features (eye contact, head orientation, posture stability, hand gestures) are captured and measured.
- Audio signals (speaking rate in WPM, pauses, filler words, audio volume) are calculated in real time.
- Spoken responses are transcribed and evaluated by an LLM for relevance, depth, structure, and grammar.
- The **Multimodal Fusion Engine** correlates these disparate signals to provide balanced, actionable recommendations.

---

## 2. Features

- **Multimodal AI Signal Processing**: Simultaneous visual poise, vocal acoustics, and semantic language scoring.
- **4 Dedicated Interview Modes**:
  - **Technical Interview**: Questions covering DSA, Operating Systems, DBMS, Computer Networks, OOP, and System Design.
  - **HR & Behavioral Interview**: Leadership, Conflict resolution, Teamwork, Handling Failure, and Career Goals.
  - **Practice Mode**: Live real-time coaching tips during the interview (e.g. *"Tip: Try slowing your speaking pace slightly"* or *"Tip: Re-center your gaze toward the camera lens"*).
  - **Simulation Mode**: Formal exam environment with zero interruptions, producing an extensive final diagnostic report.
- **Real-Time WebSocket Streaming**: Instantaneous audio/video metrics exchange and live feedback dispatch.
- **Interactive Camera & Audio Interface**: Real-time webcam viewfinder with centering guides, speech listening indicators, live volume meter, and instant WPM telemetry.
- **Comprehensive Analytics Dashboard**: Historical tracking, composite readiness scores, Recharts radar breakdowns, and session progression trends.
- **Extensive Post-Interview Reports**: Granular question-by-question diagnostic review including candidate transcript, LLM strengths/suggestions, and cross-signal recommendations.
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing and user-isolated interview records.
- **Dockerized & Local Deployment**: Production-ready Docker Compose setup (Frontend, Backend, PostgreSQL) with automatic SQLite fallback for zero-dependency local runs.

---

## 3. Architecture

```text
 Candidate Webcam & Microphone
              │
              ▼
   React + TypeScript Frontend
   (Vite, Tailwind, Recharts)
              │
        WebSocket / REST API
              │
              ▼
    FastAPI Backend Server
   ┌──────────┴──────────┐
   ▼                     ▼
Computer Vision      Speech Processing
 (OpenCV / MediaPipe)   (Whisper / WebAudio)
   │                     │
   └──────────┬──────────┘
              ▼
     LLM Answer Evaluator
   (OpenAI GPT-4o / Mock Engine)
              │
              ▼
  Multimodal Fusion Engine
 (Deterministic cross-signal scoring)
              │
              ▼
PostgreSQL / SQLite Database ───► Analytics Dashboard & Diagnostic Report
```

---

## 4. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Audio/Video APIs**: Web Audio API, Canvas 2D API, Web Speech API

### Backend
- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.11 / 3.14
- **ORM**: SQLAlchemy 2.0
- **Database**: PostgreSQL (with SQLite zero-dependency local fallback)
- **Computer Vision**: OpenCV (`cv2`), MediaPipe Tasks Vision
- **Speech Processing**: OpenAI Whisper, SoundFile, NumPy
- **LLM Evaluation**: OpenAI SDK + Heuristic Mock Provider abstraction
- **Security**: Python-Jose (JWT), Bcrypt password hashing, OAuth2

---

## 5. Folder Structure

```text
intelligent-bell/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application setup & lifecycle
│   │   ├── config.py                   # Environment configuration & settings
│   │   ├── database/
│   │   │   └── connection.py           # SQLAlchemy engine & session management
│   │   ├── models/                     # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── interview.py
│   │   │   ├── question.py
│   │   │   ├── response.py
│   │   │   └── metrics.py
│   │   ├── schemas/                    # Pydantic v2 validation schemas
│   │   │   ├── auth.py
│   │   │   ├── interview.py
│   │   │   ├── question.py
│   │   │   ├── response.py
│   │   │   └── report.py
│   │   ├── services/                   # Modular AI services
│   │   │   ├── vision_service.py       # OpenCV & MediaPipe visual analysis
│   │   │   ├── speech_service.py       # Whisper transcription & audio telemetry
│   │   │   ├── llm_service.py          # Structured LLM answer evaluation
│   │   │   ├── fusion_engine.py        # Multimodal fusion scoring & coaching
│   │   │   └── interview_service.py    # Question bank & session orchestration
│   │   ├── api/                        # REST API routers
│   │   │   ├── auth.py
│   │   │   ├── interviews.py
│   │   │   ├── questions.py
│   │   │   └── reports.py
│   │   └── websocket/
│   │       └── interview_socket.py     # Real-time WebSocket connection manager
│   ├── tests/                          # Automated backend test suite
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── CameraPreview.tsx
│   │   │   ├── InterviewQuestion.tsx
│   │   │   ├── LiveMetrics.tsx
│   │   │   ├── FeedbackCard.tsx
│   │   │   ├── ScoreCard.tsx
│   │   │   └── Charts.tsx
│   │   ├── pages/                      # Application route pages
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── InterviewSetup.tsx
│   │   │   ├── InterviewRoom.tsx
│   │   │   ├── Report.tsx
│   │   │   └── History.tsx
│   │   ├── hooks/                      # Hardware & networking custom hooks
│   │   │   ├── useCamera.ts
│   │   │   ├── useMicrophone.ts
│   │   │   └── useInterviewSocket.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 6. Installation

### Prerequisites
- Python 3.10+ (Python 3.11 recommended, Python 3.14 compatible)
- Node.js 18+ & npm
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd intelligent-bell
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

---

## 7. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL or SQLite connection URI | `sqlite:///./intervux.db` |
| `JWT_SECRET` | Secret key used to sign JWT authentication tokens | `intervux-super-secret-key-2026` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiration window for auth tokens | `1440` (24 hours) |
| `OPENAI_API_KEY` | OpenAI API key for live GPT-4o evaluation | *Optional* (falls back to Mock Mode) |
| `WHISPER_MODEL` | Whisper model size (`tiny`, `base`, `small`) | `base` |
| `BACKEND_URL` | Backend HTTP URL | `http://localhost:8000` |
| `FRONTEND_URL` | Frontend client URL | `http://localhost:3000` |

---

## 8. Running Locally

### Start Backend
```bash
# In the backend directory:
cd backend
source venv/bin/activate  # or: python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API and Swagger docs will be accessible at `http://localhost:8000/docs`.

### Start Frontend
```bash
# In a separate terminal, inside the frontend directory:
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 9. Docker Instructions

Run the entire full-stack application (Postgres + Backend + Frontend) with a single command:

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL: Port `5432`

---

## 10. API Documentation

### Authentication
- `POST /api/auth/register` — Create a new candidate account.
- `POST /api/auth/login` — Sign in and obtain JWT bearer token.
- `GET /api/auth/me` — Retrieve authenticated user profile.

### Interviews
- `GET /api/interviews` — List authenticated user's mock interviews.
- `POST /api/interviews` — Create a new interview session and initialize sequential questions.
- `GET /api/interviews/{id}` — Get interview details and question sequence.
- `POST /api/interviews/{id}/complete` — Finalize session and trigger multimodal fusion scoring.
- `DELETE /api/interviews/{id}` — Delete an interview record.

### Questions & Responses
- `GET /api/questions/bank` — Retrieve structured question bank filtered by category or difficulty.
- `POST /api/responses` — Submit candidate spoken answer, calculate speech metrics, and run LLM evaluation.

### Analytics Reports
- `GET /api/reports/{interview_id}` — Generate comprehensive post-interview diagnostic report with radar and timeline data.

### Real-Time WebSocket
- `WS /ws/interview/{interview_id}` — Bi-directional event streaming for live visual frame sampling, interim speech updates, and practice coaching tips.

---

## 11. AI Pipeline

### Computer Vision (`vision_service.py`)
- Employs OpenCV and MediaPipe Tasks Vision.
- Analyzes skin tone spatial contours, bounding box geometry, and frame differencing.
- Observable metrics:
  - **Estimated Eye Contact**: Alignment factor between facial orientation and webcam lens.
  - **Head Orientation**: `Mostly centered`, `Looking slightly left/right`, or `Looking down`.
  - **Posture Stability**: Head height alignment and upper-frame symmetry.
  - **Gesture Activity**: Motion delta in lower third of the frame.
- *Strict Honesty*: Does **not** infer hidden psychological states or emotions.

### Speech Processing (`speech_service.py`)
- Uses OpenAI Whisper for speech-to-text.
- Analyzes audio acoustics:
  - **Speaking Speed**: Words Per Minute (WPM) calibrated against standard interview rates (130-165 WPM).
  - **Filler Word Detection**: Regex detection for patterns like *"um"*, *"uh"*, *"like"*, *"you know"*, *"actually"*, *"basically"*.
  - **Pause Duration**: Silence spacing between phrases.
  - **Volume Consistency**: RMS energy monitoring.

### LLM Answer Evaluation (`llm_service.py`)
- Provider abstraction (`OpenAIProvider` and `MockProvider`).
- Output JSON guarantees:
  - `relevance` (0-100)
  - `clarity` (0-100)
  - `technical_depth` (0-100)
  - `structure` (0-100)
  - `grammar` (0-100)
  - `confidence` (0-100)
  - `overall_answer_score` (0-100)
  - `strengths`: list of strings
  - `weaknesses`: list of strings
  - `suggestions`: list of concrete coaching points

### Multimodal Fusion Engine (`fusion_engine.py`)
- Correlates visual, speech, and semantic language signals deterministically:
  - **Body Language Score**: Weighted eye contact (35%), posture (30%), visibility (20%), gestures (15%).
  - **Speech Score**: Weighted pace (35%), filler words penalty (25%), pauses (20%), volume (20%).
  - **Answer Quality Score**: Weighted relevance (30%), clarity (25%), structure (20%), grammar (15%), confidence (10%).
  - **Communication Score**: Weighted clarity, eye contact, pace factor, and low filler density.
  - **Cross-Signal Contextual Recommendations**: Generates tailored advice when signals conflict (e.g. strong technical substance delivered at high speed with low eye contact).

---

## 12. Database Schema

### `users`
- `id` (Integer, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `created_at` (DateTime)

### `interviews`
- `id` (Integer, Primary Key)
- `user_id` (ForeignKey -> `users.id`)
- `type` (String: `technical`, `hr`)
- `mode` (String: `practice`, `simulation`)
- `difficulty` (String: `easy`, `medium`, `hard`)
- `status` (String: `in_progress`, `completed`)
- `started_at` / `ended_at` (DateTime)
- `overall_score`, `communication_score`, `technical_score`, `body_language_score`, `speech_score`, `answer_quality_score` (Float)

### `questions`
- `id` (Integer, Primary Key)
- `interview_id` (ForeignKey -> `interviews.id`)
- `question_text` (Text)
- `category` (String)
- `difficulty` (String)
- `order_number` (Integer)

### `responses`
- `id` (Integer, Primary Key)
- `question_id` (ForeignKey -> `questions.id`, Unique)
- `transcript` (Text)
- `duration` (Float)
- `speaking_speed` (Float, WPM)
- `pause_duration` (Float)
- `filler_count` (Integer)
- `volume_score` (Float)

### `vision_metrics`
- `id` (Integer, Primary Key)
- `response_id` (ForeignKey -> `responses.id`, Unique)
- `eye_contact` (Float, %)
- `face_visibility` (Float, %)
- `head_orientation` (String)
- `posture_score` (Float)
- `gesture_score` (Float)

### `answer_evaluations`
- `id` (Integer, Primary Key)
- `response_id` (ForeignKey -> `responses.id`, Unique)
- `relevance`, `clarity`, `technical_depth`, `structure`, `grammar`, `confidence`, `overall_score` (Float)
- `feedback` (Text/JSON: strengths, weaknesses, suggestions)

### `recommendations`
- `id` (Integer, Primary Key)
- `interview_id` (ForeignKey -> `interviews.id`)
- `category` (String)
- `recommendation` (Text)
- `priority` (String: `high`, `medium`, `low`)

---

## 13. WebSocket Architecture

```text
Client (React Browser)                      Server (FastAPI WebSocket)
        │                                              │
        │────── Connect (/ws/interview/{id}) ─────────►│
        │◄───── event: "interview_started" ────────────│
        │◄───── event: "question_started" ─────────────│
        │                                              │
        │────── event: "video_frame" (sampled 1.5s) ──►│ (OpenCV analysis)
        │◄───── event: "video_metrics" ────────────────│
        │                                              │
        │────── event: "audio_chunk" (WPM/Volume) ────►│
        │◄───── event: "speech_update" ────────────────│
        │                                              │
        │ [Practice Mode Condition Met]                │
        │◄───── event: "feedback" (live tip) ──────────│
        │                                              │
        │────── event: "question_completed" ──────────►│ (LLM & Fusion evaluation)
        │◄───── event: "question_feedback" ────────────│
        │◄───── event: "question_started" (next Q) ────│
        │                                              │
        │────── (All questions completed) ─────────────│
        │◄───── event: "interview_completed" ──────────│
```

---

## 14. Testing

### Run Backend Tests
The backend test suite covers authentication, interview creation, question bank retrieval, score calculations, fusion engine rules, and API endpoints.

```bash
cd backend
venv/bin/pytest tests/ -v
```

All 10 test suites pass with 100% success rate:
- `test_root_and_health_endpoints` — PASSED
- `test_question_bank_retrieval` — PASSED
- `test_unauthorized_access_protection` — PASSED
- `test_register_and_login` — PASSED
- `test_invalid_login` — PASSED
- `test_body_language_scoring` — PASSED
- `test_speech_scoring` — PASSED
- `test_fusion_signals_synthesis` — PASSED
- `test_live_coaching_tips` — PASSED
- `test_full_interview_lifecycle` — PASSED

### Run Frontend Build Verification
```bash
cd frontend
npm run build
```
Compiles Vite bundle with TypeScript verification with zero errors.

---

## 15. Limitations

- **Webcam Lighting & Framing**: Accuracy of OpenCV facial segmentation depends on reasonable front lighting and standard webcam positioning.
- **Microphone Hardware Differences**: Automatic Gain Control (AGC) on built-in laptop microphones may compress volume ranges.
- **Offline / Mock Mode**: When `OPENAI_API_KEY` is not provided, the system utilizes the transparent heuristic mock engine. Scores in mock mode evaluate structure and keywords rather than deep generative reasoning.

---

## 16. Future Enhancements

- **Adaptive Question Generation**: Dynamically generating personalized follow-up questions based on the candidate's previous answer using live LLM chains.
- **Audio Pitch / Intonation Tracking**: Incorporating pitch variability (F0 fundamental frequency) to measure vocal inflection and avoid monotone delivery.
- **Resume-Tailored Questions**: Uploading candidate PDF resumes to generate custom job-specific technical interview rounds.
- **Peer & Mentor Review Sharing**: Shareable public web links for human interview coaches to annotate candidate mock recording timelines.
