# Quick Start — 5 Minutes

Get UserSkillHub running locally in seconds.

## Prerequisites
- **Docker** (easiest) or **Node 20 + PostgreSQL 16**

## Option 1: Docker Compose (Recommended)

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd skillhub-learning-platform-test

# 2. Start services
docker compose up --build

# 3. Seed demo data (new terminal)
docker compose exec backend npm run seed

# 4. Open app
# Frontend: http://localhost:3000
# API: http://localhost:4000
```

Login with demo credentials:
- **Instructor:** alice@example.com / password
- **Instructor:** bob@example.com / password
- **Student:** student1@example.com / password

---

## Option 2: Local Node + PostgreSQL

### Setup database:
```bash
# macOS (brew)
brew install postgresql@16
brew services start postgresql@16
createdb skillhub
createuser skillhub_user -P  # Set password: password

# Or set DATABASE_URL with your connection string
export DATABASE_URL="postgres://skillhub_user:password@localhost:5432/skillhub"
```

### Start backend:
```bash
cd backend
cp .env.example .env
npm install
npm run seed  # Load demo data
npm run dev   # Starts on :4000
```

### Start frontend (new terminal):
```bash
cd frontend
cp .env.example .env
npm install
npm start     # Starts on :3000
```

---

## What to Try

1. **Register:** Sign up as a new student/instructor
2. **View Users:** Left sidebar shows all registered users
3. **View Courses:** Main area lists courses with instructor info
4. **Request Session:** Pick a course and enter an instructor ID, then click "Request"
5. **Accept/Reject:** Switch to an instructor account to manage session requests

---

## Troubleshooting

### Port 3000 or 4000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### PostgreSQL connection error
```bash
# Check connection string in backend/.env
DATABASE_URL=postgres://skillhub_user:password@localhost:5432/skillhub

# Verify database exists
psql -l

# Verify user can connect
psql -U skillhub_user -d skillhub -c "SELECT 1"
```

### API not loading in frontend
- Check REACT_APP_API_URL in frontend/.env (should be http://localhost:4000)
- Ensure backend is running on :4000
- Check browser console for CORS errors

---

## Next Steps

- Explore [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Render + Netlify (free tier)
- Review code in [backend/src](./backend/src) and [frontend/src](./frontend/src)
- Run tests: `cd backend && npm test`
