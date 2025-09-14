# Janta Seva - Production Deployment Guide

## Prerequisites
- Git repository set up
- Heroku account (for backend)
- Vercel account (for frontend)
- Supabase database configured and running

## 🗄️ Step 1: Database Setup (If not done)
1. Go to Supabase Dashboard
2. Run the SQL script from `database/setup-supabase.sql`
3. Verify tables are created with sample data

## 🔧 Step 2: Backend Deployment (Heroku)

### Using Command Line:
```bash
# 1. Navigate to project root
cd /path/to/Janta-Seva

# 2. Install Heroku CLI (if not installed)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# 3. Login to Heroku
heroku login

# 4. Create Heroku app
heroku create janta-seva-backend

# 5. Set production environment variables
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=https://ocxhfuzrggbrvtcihwkp.supabase.co
heroku config:set SUPABASE_ANON_KEY=your_actual_supabase_anon_key

# 6. Add and commit files
git add .
git commit -m "Prepare backend for deployment"

# 7. Create Heroku remote (if not exists)
heroku git:remote -a janta-seva-backend

# 8. Deploy backend
git subtree push --prefix=backend heroku main
# OR if above doesn't work:
cd backend
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a janta-seva-backend
git push heroku main
```

### Using Heroku Dashboard:
1. Go to heroku.com → New → Create new app
2. Name: `janta-seva-backend`
3. Connect to GitHub repository
4. Set Config Vars in Settings:
   - NODE_ENV: production
   - SUPABASE_URL: https://ocxhfuzrggbrvtcihwkp.supabase.co
   - SUPABASE_ANON_KEY: your_actual_key
5. Deploy from main branch

**Backend URL:** `https://janta-seva-backend.herokuapp.com`

## 🌐 Step 3: Frontend Deployment (Vercel)

### Using Command Line:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install Vercel CLI
npm install -g vercel

# 3. Login to Vercel
vercel login

# 4. Update environment variables in .env.production
# VITE_API_URL=https://janta-seva-backend.herokuapp.com/api

# 5. Deploy to Vercel
vercel --prod

# 6. Follow prompts:
# - Link to existing project? N
# - What's your project's name? janta-seva-frontend
# - In which directory is your code located? ./
```

### Using Vercel Dashboard:
1. Go to vercel.com → Import Project
2. Connect GitHub repository
3. Select frontend folder as root directory
4. Set Environment Variables:
   - VITE_API_URL: https://janta-seva-backend.herokuapp.com/api
   - VITE_ML_API_URL: your-ml-service-url
5. Deploy

**Frontend URL:** `https://janta-seva-frontend.vercel.app`

## ✅ Step 4: Verification

### Test Backend:
```bash
# Health check
curl https://janta-seva-backend.herokuapp.com/api/health

# Test mobile API
curl -X POST https://janta-seva-backend.herokuapp.com/api/mobile/reports \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Report","description":"Test deployment"}'
```

### Test Frontend:
1. Visit your Vercel URL
2. Check if dashboard loads correctly
3. Test dark mode toggle
4. Verify API connections work

## 🔧 Step 5: Update Mobile App URLs

Update your mobile app configuration:
```javascript
// Mobile app config
const API_BASE_URL = 'https://janta-seva-backend.herokuapp.com/api';

// Submit report
fetch(`${API_BASE_URL}/mobile/reports`, { ... });

// Check status  
fetch(`${API_BASE_URL}/mobile/reports/${id}`, { ... });
```

## 🛠️ Troubleshooting

### Backend Issues:
- Check Heroku logs: `heroku logs --tail`
- Verify environment variables: `heroku config`
- Test database connection from Heroku console

### Frontend Issues:
- Check Vercel function logs
- Verify build output in Vercel dashboard
- Test API calls from browser network tab

### Database Issues:
- Verify Supabase project is active
- Check API keys are correct
- Test database connection locally first

## 🔄 Continuous Deployment

### Auto-deploy Backend:
1. In Heroku dashboard → Deploy tab
2. Connect to GitHub
3. Enable "Automatic deploys" from main branch

### Auto-deploy Frontend:
1. Vercel automatically deploys on git push
2. Configure in Vercel dashboard → Git Integration

## 📊 Monitoring

### Backend:
- Heroku metrics dashboard
- Application logs via `heroku logs`
- Uptime monitoring with external services

### Frontend:
- Vercel analytics dashboard  
- Performance monitoring
- Error tracking (consider Sentry)

## 💰 Cost Considerations

### Free Tier Limits:
- **Heroku**: 550-1000 free dyno hours/month
- **Vercel**: 100GB bandwidth, unlimited deployments
- **Supabase**: 500MB database, 2GB bandwidth

### Scaling Options:
- Heroku: Upgrade to Hobby ($7/month) or higher
- Vercel: Pro plan for team features
- Supabase: Pro plan for larger databases

---

**Your Janta Seva system is now live and ready for mobile app integration!** 🎉