# RMVS Web Services: Enterprise Digital Engineering & Verified Software Platform

**Official Company Name:** RMVS Web Services  
**Chief Executive Officer & Super Admin:** Ritesh Lingamallu (`riteshlingamallu8@gmail.com`)  
**Tagline:** BUILD • CONNECT • GROW  
**Four Pillars:** Websites • Apps • Software • Digital Solutions  
**Database:** Cloud Neon PostgreSQL (Serverless Pooled)  
**Architecture:** Decoupled Modern SPA (React 18 + TypeScript + Vite + Tailwind CSS + Liquid Glass Design) & High-Performance Asynchronous Engine (Python 3.12 + FastAPI + SQLAlchemy 2.0 + WebSockets)

---

## 🌟 Vision & Platform Highlights

**RMVS Web Services** is a premier web architecture and digital engineering company bridging visionary enterprises with verified software engineers.

1. **Strict Creator & Developer Attribution**:
   Every enterprise project features permanent lead developer and contributor attribution, directly linking to verified developer profiles (`/developers/{username}`).
2. **Neon Cloud PostgreSQL Engine**:
   Connected to high-performance, serverless Neon PostgreSQL with connection pooling, SSL/TLS security, and robust asynchronous ORM mapping.
3. **Four Core Engineering Pillars**:
   - **Websites**: Ultra high-performance responsive web applications, portals, and SaaS frontends.
   - **Apps**: Cross-platform iOS and Android mobile engineering (Flutter / React Native).
   - **Software**: Enterprise microservices, distributed backends, REST APIs, and database architecture.
   - **Digital Solutions**: Autonomous AI agent frameworks, predictive business intelligence, and cloud automation.
4. **Dynamic Centralized Branding**:
   All branding (company name, logo, favicon, tagline, contact information, social links) is centralized in `company_settings` and managed by the CEO via the Control Center (`/ceo`).
5. **Real-time WebSockets & Community Channels**:
   Live developer community channels (`#general`, `#frontend`, `#backend`, `#ai-ml`, `#devops`, etc.) with real-time broadcast and instant messaging.
6. **Executive Control Center (`/ceo`)**:
   CEO Ritesh Lingamallu possesses complete administrative control:
   - Team and developer roster management (verification, role assignment, skills).
   - Project showcase management with live landing page screenshot capturing.
   - Direct client inquiries CRM.
   - Live centralized Brand Settings.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18, TypeScript, Vite
  - Tailwind CSS with bespoke Liquid Glass aesthetic
  - React Router 6, Axios API Client with JWT Interceptors
  - Framer Motion animations & Lucide React icons
  - Dynamic `document.title` and favicon syncing via `SettingsContext`
- **Backend**:
  - Python 3.12+
  - FastAPI (Asynchronous REST API + WebSockets)
  - SQLAlchemy 2.0 (Asyncpg / Asynchronous ORM)
  - Pydantic v2 Settings & Validation
  - Argon2 / Bcrypt cryptographic password hashing & PyJWT tokens
  - Headless Chrome screenshot capture integration for project showcases
- **Database**:
  - Neon PostgreSQL (Serverless AWS us-east-2 pooler)

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Activate Python virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (Port 8000)
uvicorn app.main:app --reload --port 8000
```

Interactive API documentation will be available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (Port 5173)
npm run dev
```

The application will be live at: `http://localhost:5173`

---

## 🔑 Executive & Access Credentials

- **CEO / Super Admin Account**:
  - **Email:** `riteshlingamallu8@gmail.com`
  - **Portal:** `/login` -> Redirects to CEO Command Suite (`/ceo`)
  - **Permissions:** Full system administration, brand settings, project management, and developer approvals.
- **Client & Developer Registration**:
  - Public registration is open for Developers (`/register?type=developer`) and Clients (`/register?type=client`).
  - Admin registration is strictly protected and restricted.

---

## 🏢 Official Branding Assets

- **Company Name:** RMVS Web Services
- **Official Logo:** Circular emblem featuring modern geometric branding, coding brackets `</>`, and subtitle `WEBSITES • APPS • SOFTWARE • DIGITAL SOLUTIONS` (deployed at `/logo.png`).
- **Favicon:** `/logo.png`
- **Copyright:** © 2026 RMVS Web Services. All rights reserved.
