# DevConnect: Developer Community & Digital Services Platform

**Platform Version:** 1.0  
**Primary Admin / CEO:** Ritesh Lingamallu (`ritesh-lingamallu`)  
**Managing Director:** M. Shiva Gopi (`m-shiva-gopi`)  
**Architecture:** Modern Decoupled SPA (React + TypeScript + Vite + Tailwind CSS) & Asynchronous REST + WebSocket Engine (Python 3.12 + FastAPI + SQLAlchemy)

---

## 🌟 Product Vision & Concept

DevConnect is a unified technology platform powered by an elite community of verified software engineers. Unlike generic freelance bidding sites, DevConnect operates as a cohesive technology company where:

1. **Every Project has Enforced Attribution**:
   Every published project displays **"Built by [Lead Developer]"** and associated team contributors, linking directly to their public, indexable developer portfolio (`/developers/{username}`).
2. **Critical Business Rule (PRD Section 36)**:
   Every project must have at least one verified developer associated with it before publication.
3. **Direct Client Collaboration**:
   Clients discover real software products, identify who built them, and send direct project inquiries into developer CRM inboxes.
4. **Real-time Developer Community**:
   10 authenticated developer community channels (`#general`, `#frontend`, `#backend`, `#ai-ml`, `#mobile`, `#database`, `#devops`, `#projects`, `#help`, `#opportunities`) powered by live WebSockets.
5. **Executive Governance**:
   CEO Ritesh Lingamallu & MD M. Shiva Gopi review and approve developer applications through an intuitive Admin Control Center (`/admin`).

---

## 🛠️ Technology Stack

- **Backend**:
  - Python 3.12+
  - FastAPI (Asynchronous REST API + WebSockets)
  - SQLAlchemy 2.0 (Dual Engine: Zero-config SQLite out of the box, switchable to PostgreSQL via `DATABASE_URL`)
  - Pydantic v2 & Pydantic-Settings
  - JWT Authentication (PyJWT + Passlib Bcrypt)
- **Frontend**:
  - React 18+ & TypeScript
  - Vite 8
  - Tailwind CSS 3
  - Lucide React & Custom Brand Icons
  - React Router 6
  - Axios with Auth Interceptors
  - WebSocket Connection Hub

---

## 🚀 Quickstart Guide

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies (already installed in venv)
pip install -r requirements.txt

# Start the FastAPI server (Port 8000)
# Tables and seed data auto-initialize on startup!
uvicorn app.main:app --reload --port 8000
```

FastAPI Interactive Docs will be accessible at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Start the Vite development server (Port 5173)
npm run dev
```

The application will be live at: `http://localhost:5173`  
(API requests to `/api` and WebSockets to `/ws` are automatically proxied to backend port 8000).

---

## 🔑 Pre-Seeded Evaluation Accounts

For rapid evaluation, the platform includes 1-click login buttons on the `/login` page:

| Role | Name | Email / Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin / CEO** | **Ritesh Lingamallu** | `ritesh@devconnect.io` / `ritesh-lingamallu` | `Admin@1234` | Full platform control, project creator, approval power |
| **Managing Director** | **M. Shiva Gopi** | `shiva@devconnect.io` / `m-shiva-gopi` | `Admin@1234` | Enterprise lead, application review, project architect |
| **Verified Developer** | **Priya Sharma** | `priya@devconnect.io` / `priya-sharma` | `Dev@1234` | Senior AI Engineer, project contributor |
| **Pending Developer** | **Alex Vance** | `alex@innovatetech.com` / `alex-vance` | `Dev@1234` | Appears in Admin Approval Queue for live demonstration |
| **Client Account** | **Sarah Jenkins** | `client@nexus.com` / `nexus-global` | `Client@1234` | Nexus Global Enterprises (Inquiries sender) |

---

## 📂 Project Structure

```text
devconnect/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py          # Dual registration, login, current user
│   │   │   │   │   ├── developers.py    # Directory, profiles, views tracking
│   │   │   │   │   ├── projects.py      # Projects + Section 36 attribution
│   │   │   │   │   ├── inquiries.py     # Client contact CRM pipeline
│   │   │   │   │   ├── community.py     # 10 Developer channels
│   │   │   │   │   ├── conversations.py # Direct 1-on-1 private messaging
│   │   │   │   │   ├── notifications.py # User notifications
│   │   │   │   │   └── admin.py         # Approvals, stats & moderation
│   │   │   │   └── router.py
│   │   │   └── websockets/
│   │   │       ├── hub.py               # Real-time connection manager
│   │   │       └── routes.py            # /ws endpoint with topic pub-sub
│   │   ├── core/
│   │   │   ├── config.py                # Environment configuration
│   │   │   ├── security.py              # Bcrypt hashing & JWT creation
│   │   │   └── database.py              # Async SQLAlchemy session engine
│   │   ├── models/                      # SQLAlchemy relational models
│   │   ├── schemas/                     # Pydantic v2 validation models
│   │   ├── db/
│   │   │   └── seed.py                  # Initial seed data script
│   │   └── main.py                      # FastAPI lifespan & app entry
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/client.ts                # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── common/Icons.tsx         # Custom brand SVG icons
│   │   │   ├── layout/Navbar.tsx        # Navigation with live notifications
│   │   │   ├── layout/Footer.tsx        # Leadership & governance footer
│   │   │   ├── projects/ProjectCard.tsx # Project card with attribution
│   │   │   ├── projects/AttributionBadge.tsx # "Built by [Developer]" badge
│   │   │   ├── developers/DeveloperCard.tsx  # Developer directory card
│   │   │   └── inquiries/ContactDeveloperModal.tsx # Project inquiry modal
│   │   ├── pages/
│   │   │   ├── public/                  # Home, About, Services, Developers, Projects, Contact
│   │   │   ├── auth/                    # Login, Dual Register
│   │   │   ├── dashboard/               # Workspace, My Projects, CRM, Community, DMs
│   │   │   └── admin/                   # Executive Control Center
│   │   ├── context/
│   │   │   ├── AuthContext.tsx          # User state & persistence
│   │   │   └── WebSocketContext.tsx     # Real-time WebSocket pub/sub
│   │   ├── types/index.ts               # TypeScript data definitions
│   │   ├── App.tsx                      # Master application router
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

---

## 📜 Core Features Implemented

- [x] **Home & Brand Showcase**: High-impact hero, services breakdown, featured developers, featured projects, process steps, client CTA.
- [x] **Developer Directory (`/developers`)**: Real-time search, skill filter chips, availability filters, verified developer checkmarks.
- [x] **Developer Portfolio (`/developers/:username`)**: Individual portfolio displaying bio, skills, profile views, contact actions, and attributed projects.
- [x] **Project Attribution Engine (`/projects/:slug`)**: Permanent "Built by [Developer]" team attribution linking to author profiles.
- [x] **Client Inquiry System (`/dashboard/inquiries`)**: Full CRM pipeline (New, Contacted, In Discussion, Proposal, In Progress, Completed, Closed).
- [x] **Real-time Community Chat (`/community`)**: 10 live channels (#general, #ai-ml, etc.) with real-time WebSocket pub/sub broadcasts.
- [x] **1-on-1 Direct Messaging (`/messages`)**: Private developer-to-developer and client-to-developer conversations.
- [x] **Executive Admin Center (`/admin`)**: Metric cards and 1-click Developer Approval Queue for CEO Ritesh Lingamallu and MD M. Shiva Gopi.
