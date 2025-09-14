# Railway Deployment
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Set environment variables
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=https://ocxhfuzrggbrvtcihwkp.supabase.co
railway variables set SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Deploy
railway up