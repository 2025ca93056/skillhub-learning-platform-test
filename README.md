# UserSkillHub — Fullstack Learning Platform

A complete fullstack platform with user registration/login, course listings, session requests, and instructor acceptance/rejection. Built with Node.js + Express + React + PostgreSQL.

## Features
- Email + password authentication (JWT)
- User profiles with role-based access (student/instructor)
- Visible user directory
- Course catalog
- Session request workflow (students request, instructors accept/reject)
- Docker + docker-compose for local development
- CI/CD with GitHub Actions
- Free-tier cloud deployment (Render + Netlify)

## Local Development

### Prerequisites
- Docker & Docker Compose (recommended), or Node.js 20+, PostgreSQL 16+

### Quick Start (Docker Compose)
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit backend/.env: set JWT_SECRET to a random value
docker compose up --build
```
Open http://localhost:3000 (frontend) and http://localhost:4000 (backend API).

### Local Development (Node)
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### Run Tests
```bash
cd backend
npm test
```

## Free-Tier Cloud Deployment

### Frontend: Deploy to Netlify (Free)
1. **Connect:** Push repo to GitHub, then go to [Netlify](https://netlify.com) → "New site from Git" → select repo.
2. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `build`
3. **Environment variables:** In Netlify Site Settings → Environment → add:
   - `REACT_APP_API_URL=<your-backend-render-url>` (e.g., `https://skillhub-api.onrender.com`)
4. **Deploy:** Netlify auto-deploys on `git push main`.

Alternatively, use `netlify.toml` (included) for automatic config.

### Backend + Database: Deploy to Render (Free Tier)

**Free Tier Limits:**
- 1 web service (128 MB RAM, shared CPU, scales to 0 when idle)
- 1 PostgreSQL database (512 MB)
- Auto-deploy on GitHub push

#### Option 1: Use Render Blueprint (Fastest)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repo
4. Select this repo and choose the `render.yaml` blueprint
5. Render automatically provisions backend + database and deploys
6. Get the backend URL (e.g., `https://skillhub-api.onrender.com`) and paste into Netlify env var

#### Option 2: Manual Setup
1. **Database:**
   - Render Dashboard → **"New +"** → **"PostgreSQL"**
   - Name: `skillhub-db`
   - Region: choose closest
   - Create
   - Copy the internal connection string (e.g., `postgres://...`)

2. **Backend Service:**
   - Render Dashboard → **"New +"** → **"Web Service"**
   - Connect GitHub repo
   - Name: `skillhub-api`
   - Environment: `Node`
   - Build command: `cd backend && npm install`
   - Start command: `node backend/src/index.js`
   - Add environment variables:
     - `DATABASE_URL`: paste from database step
     - `JWT_SECRET`: generate random string (e.g., `openssl rand -base64 32`)
   - Deploy
   - Copy service URL and add to Netlify frontend config

### Update Frontend API URL
After backend is deployed, update Netlify environment:
- Go to Netlify Site Settings → Environment
- Add/update `REACT_APP_API_URL=https://skillhub-api.onrender.com` (replace with your Render URL)

### Monitor & Logs
- **Render:** Dashboard → service → Logs (watch for startup issues)
- **Netlify:** Site settings → Deploys (view build/deploy logs)

## CI/CD Workflow
Push to `main` triggers GitHub Actions to:
1. Run backend tests (jest)
2. Build Docker images for backend & frontend
3. (Optional) Push to ECR / deploy to AWS ECS (requires AWS credentials in secrets)

For free-tier, Render + Netlify auto-deploy on GitHub push — no additional CI setup needed.

## Directory Structure
```
├── backend/
│   ├── src/
│   │   ├── index.js          # Express app
│   │   ├── sequelize.js      # DB connection
│   │   ├── models/           # User, Course, SessionRequest
│   │   ├── routes/           # /auth, /api
│   │   └── controllers/
│   ├── tests/                # Jest test suite
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── services/
│   │   │   └── api.js        # API client wrapper
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── render.yaml               # Render blueprint (free tier)
├── netlify.toml              # Netlify config (free tier)
└── .github/workflows/ci-cd.yml
```

## License
MIT