# 🔥 Namaste Anime

Anime streaming website built with Next.js 15, PostgreSQL, and Tailwind CSS.

---

## 📋 Requirements

- **Node.js** 18+ (recommended 20+)
- **PostgreSQL** 14+
- **npm** or **yarn**
- **Git**

---

## 🖥️ Local Setup — Ubuntu/Linux

```bash
# 1. Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. Create database
sudo -u postgres psql -c "CREATE USER namaste WITH PASSWORD 'namaste123';"
sudo -u postgres psql -c "CREATE DATABASE namaste_anime OWNER namaste;"

# 4. Clone project
git clone https://github.com/your-username/namaste-anime.git
cd namaste-anime

# 5. Install dependencies
npm install

# 6. Setup environment
cp .env.example .env
# Edit .env file:
# DATABASE_URL=postgresql://namaste:namaste123@127.0.0.1:5432/namaste_anime

# 7. Push database schema
npx drizzle-kit push

# 8. Initial data sync (fetch anime data from AniList → save to DB)
npm run build
npm run start &
# Wait 5 seconds, then:
curl http://localhost:3000/api/sync?force=true
# This fetches all categories from AniList and saves to PostgreSQL

# 9. Open in browser
# http://localhost:3000
```

---

## 🪟 Local Setup — Windows

```powershell
# 1. Install Node.js
# Download from https://nodejs.org (LTS version)

# 2. Install PostgreSQL
# Download from https://www.postgresql.org/download/windows/
# During install: set password, remember port (default 5432)

# 3. Create database (open pgAdmin or psql)
# Open SQL Shell (psql):
CREATE USER namaste WITH PASSWORD 'namaste123';
CREATE DATABASE namaste_anime OWNER namaste;
# Exit with: \q

# 4. Clone project
git clone https://github.com/your-username/namaste-anime.git
cd namaste-anime

# 5. Install dependencies
npm install

# 6. Setup environment
copy .env.example .env
# Edit .env in notepad:
# DATABASE_URL=postgresql://namaste:namaste123@127.0.0.1:5432/namaste_anime

# 7. Push database schema
npx drizzle-kit push

# 8. Build and start
npm run build
npm run start

# 9. Initial sync (open new terminal)
curl http://localhost:3000/api/sync?force=true
# Or open this URL in browser

# 10. Open http://localhost:3000
```

---

## 🍎 Local Setup — macOS

```bash
# 1. Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install Node.js and PostgreSQL
brew install node postgresql@16
brew services start postgresql@16

# 3. Create database
createuser namaste
createdb namaste_anime -O namaste
psql namaste_anime -c "ALTER USER namaste WITH PASSWORD 'namaste123';"

# 4. Clone project
git clone https://github.com/your-username/namaste-anime.git
cd namaste-anime

# 5. Install dependencies
npm install

# 6. Setup environment
cp .env.example .env
# Edit: DATABASE_URL=postgresql://namaste:namaste123@127.0.0.1:5432/namaste_anime

# 7. Push schema + build + start
npx drizzle-kit push
npm run build
npm run start &

# 8. Initial sync
curl http://localhost:3000/api/sync?force=true

# 9. Open http://localhost:3000
```

---

## 🌐 Deploy to Production (Vercel)

```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Namaste Anime v1"
git remote add origin https://github.com/your-username/namaste-anime.git
git push -u origin main

# 2. Go to https://vercel.com
# - Import your GitHub repo
# - Framework: Next.js (auto-detected)

# 3. Add environment variable in Vercel dashboard:
# DATABASE_URL = your-production-postgresql-connection-string
# (Use Vercel Postgres, Neon, Supabase, or Railway for hosted PostgreSQL)

# 4. Deploy!
# Vercel will auto build and deploy

# 5. Setup cron job for auto-sync
# Create vercel.json in project root:
```

```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

```bash
# This calls /api/sync every 6 hours automatically
# Keeps anime data fresh without hitting AniList rate limits
```

---

## 🐘 Free PostgreSQL Hosting Options

| Service | Free Tier | URL |
|---------|-----------|-----|
| **Neon** | 512MB, always free | https://neon.tech |
| **Supabase** | 500MB, 2 projects | https://supabase.com |
| **Vercel Postgres** | 256MB | https://vercel.com/storage/postgres |
| **Railway** | $5 credit/month | https://railway.app |

---

## 🆓 100% Free Hosting Guide (Step by Step)

### Option 1: Vercel + Neon (RECOMMENDED — Easiest)

```bash
# Step 1: Create free Neon database
# Go to https://neon.tech → Sign up free → Create project
# Copy connection string: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require

# Step 2: Push code to GitHub
git init
git add .
git commit -m "Namaste Anime v1"
# Create new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/namaste-anime.git
git branch -M main
git push -u origin main

# Step 3: Deploy on Vercel (FREE)
# Go to https://vercel.com → Sign up with GitHub → Import your repo
# Add Environment Variable:
#   Name: DATABASE_URL
#   Value: postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
# Click Deploy!

# Step 4: After deploy, initial data sync
# Open in browser: https://your-app.vercel.app/api/sync?force=true
# Wait 30 seconds — this fetches anime data from AniList

# Step 5: Auto-sync every 6 hours (add vercel.json)
```

Create `vercel.json` in project root:
```json
{
  "crons": [
    {
      "path": "/api/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

```bash
git add vercel.json
git commit -m "Add cron job"
git push
# Vercel auto-deploys!
```

**Done! Your anime site is live for FREE** 🎉

### Option 2: Railway (One-Click — includes PostgreSQL)

```bash
# Step 1: Go to https://railway.app → Sign up free
# Step 2: New Project → Deploy from GitHub
# Step 3: Add PostgreSQL plugin (click + → Database → PostgreSQL)
# Step 4: Railway auto-sets DATABASE_URL
# Step 5: Deploy!
# Step 6: Open https://your-app.up.railway.app/api/sync?force=true
```

### Option 3: Render + Neon

```bash
# Step 1: Neon for database (same as above)
# Step 2: Go to https://render.com → Sign up free
# Step 3: New Web Service → Connect GitHub repo
# Step 4: Settings:
#   Build Command: npm install && npm run build
#   Start Command: npm run start
#   Environment: DATABASE_URL = your neon connection string
# Step 5: Deploy (free tier spins down after 15 min inactivity)
```

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sync` | GET | Sync stale categories from AniList to DB |
| `/api/sync?force=true` | GET | Force sync all categories |
| `/api/sync?category=trending` | GET | Sync single category |
| `/api/search?q=naruto&type=anime` | GET | Search anime/character/studio |
| `/api/bookmarks` | GET/POST | Get or toggle bookmarks |
| `/api/watch-history` | GET/POST | Watch history |
| `/api/continue-watching` | GET | Continue watching list |
| `/api/dub-check?id=16498` | GET | Check if anime has English dub |
| `/api/embed/justanime` | GET | Internal video player embed |
| `/api/stream/media` | GET | Media proxy (HLS/MP4/subtitles) |
| `/api/stream/9anime` | GET | 9anime runtime resolver |

---

## 🔄 How Data Sync Works

```
First visit:
  User → Page → DB empty → AniList API (1 call) → Save to DB → Serve

After sync:
  User → Page → DB has data → Serve directly (0 API calls)

Cron job (every 6 hours):
  /api/sync → Check each category age → If > 6hr → Fetch from AniList → Update DB
  
Anime detail:
  User → /anime/16498 → Check DB cache → If cached < 24hr → Serve from DB
  If not cached → AniList (1 call) → Save to DB → Serve
```

**Result: 1000 users = 0 AniList calls (all from DB)**

---

## 🎬 Streaming Architecture

```
Sub servers: Server 1, Server 2, Server 3, Neko, Momo, Gigl, Pain, Cero, Xoro
Hard Sub:    Neko, Pain, Cero, Xoro
Dub:         English Dub 1-3, Neko, Momo, Gigl, Pain, Cero, Xoro
             (only shown if anime has confirmed English dub)
```

Dub is checked at runtime via JustAnime core API.

---

## 📁 Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

---

## 🛠️ Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run typecheck    # TypeScript check
npx drizzle-kit push # Push schema to database
```

---

## 📄 License

MIT

---

Built with ❤️ by Namaste Anime Team
