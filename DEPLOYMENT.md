# Deployment Guide

This guide covers deploying UserSkillHub to free-tier cloud platforms.

## Quick Summary

| Component | Platform | Tier | Auto-Deploy | Cost |
|-----------|----------|------|------------|------|
| Frontend | Netlify | Free | Yes (GitHub) | Free |
| Backend API | Render | Free | Yes (GitHub) | Free |
| Database | Render | Free | N/A | Free |

**Total:** Completely free for small demos and learning!

---

## Step 1: Deploy Render Backend + Database

### Method A: Blueprint (Auto-provisioning) — FASTEST
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **+ New** → **Blueprint**
3. Connect your GitHub repository
4. Select this repo and confirm the `render.yaml` blueprint
5. Review the services (API + PostgreSQL) and click **Deploy**
6. Wait for success (5-10 minutes)
7. Copy the **Backend URL** from the service page (e.g., `https://skillhub-api-abc123.onrender.com`)

### Method B: Manual Setup
#### Create PostgreSQL Database
1. **Render Dashboard** → **+ New** → **PostgreSQL**
2. Fill in:
   - Name: `skillhub-db`
   - Region: Pick your region (closer = faster)
3. Click **Create Database**
4. Copy the **Internal Database URL** (looks like `postgres://user:pass@host:5432/db`)

#### Create Web Service (Backend)
1. **Render Dashboard** → **+ New** → **Web Service**
2. Connect your GitHub repo
3. Fill in:
   - Name: `skillhub-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `node backend/src/index.js`
4. Click **Advanced** and add environment variables:
   - `DATABASE_URL`: Paste the internal URL from database step
   - `JWT_SECRET`: Generate a random string (e.g., run `openssl rand -base64 32` locally)
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
5. Select **Free** plan
6. Click **Deploy**
7. Wait for success (~5 minutes)
8. Copy the **Service URL** (public URLS shown at top of service page)

---

## Step 2: Deploy Netlify Frontend

### Method A: GUI (Fast)
1. Go to [Netlify](https://netlify.com) and sign in with GitHub
2. Click **New site from Git**
3. Select your GitHub repo (`skillhub-learning-platform-test`)
4. Configure build:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click **Advanced** → **New Variable** and add:
   - Key: `REACT_APP_API_URL`
   - Value: `https://skillhub-api-abc123.onrender.com` (replace with your Render backend URL from Step 1)
6. Click **Deploy site**
7. Wait for build (~3-5 minutes)
8. Your site URL appears (e.g., `https://skillhub-app.netlify.app`)

### Method B: Using netlify.toml (Auto-detected)
`netlify.toml` is already in the repo. Netlify reads it automatically. Just connect repo and add `REACT_APP_API_URL` env var.

---

## Step 3: Enable CORS on Backend

Edit `backend/src/index.js` and add CORS headers (replace with your Netlify URL):

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-netlify-url.netlify.app', 'http://localhost:3000'],
  credentials: true,
}));
```

Then update `backend/package.json` to add `cors` dependency:
```
npm install cors
```

---

## Step 4: Test Deployment

1. Open your Netlify frontend URL
2. Register a new account or login with demo credentials (if you ran seed)
3. View users and courses
4. Test session request workflow

Monitor logs if issues occur:
- **Render:** Service → Logs
- **Netlify:** Site → Deploys → logs

---

## Updating Code

After code changes, simply:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Both Render and Netlify auto-deploy. Check deploy logs in their dashboards.

---

## Local Development Before Deployment

```bash
# Terminal 1: Start database + services
docker compose up

# Terminal 2: (Optional) Seed demo data
cd backend
npm install
npm run seed
```

Then open http://localhost:3000 and test locally before pushing.

---

## Troubleshooting

### "Connection refused" when frontend calls API
- Check Render backend URL is correctly set in Netlify `REACT_APP_API_URL`
- Verify backend service is running (check Render Logs)
- Test backend API directly: `curl https://your-render-url.onrender.com/api/courses`

### Database connection error on Render
- Verify `DATABASE_URL` is set correctly
- Check Render PostgreSQL database is running
- Ensure "Internal Database URL" is used (not external connection string)

### Netlify build fails
- Check build logs in Netlify → Deploys
- Ensure `npm run build` works locally first: `cd frontend && npm install && npm run build`
- Check all env vars are set

### "Unauthorized" on API calls
- Ensure `JWT_SECRET` matches on Render backend
- Token expires after 7 days (re-login if needed)

---

## Scaling Beyond Free Tier

When you need more resources:
- **Render:** Paid plans start at $7/month for web + $15/month for PostgreSQL
- **Netlify:** Paid plans for more bandwidth/build minutes ($19+/month)
- **Database:** Consider AWS RDS, Supabase, or MongoDB Atlas for larger scale

---

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Enable HTTPS (auto-enabled on Netlify & Render)
- [ ] Set `NODE_ENV=production` on backend
- [ ] Monitor logs regularly (Render + Netlify dashboards)
- [ ] Plan DB backups (RDS for production)
- [ ] Add monitoring/alerts (Render has built-in uptime monitoring)
