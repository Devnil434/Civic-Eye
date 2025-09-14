# Heroku Deployment Script
echo "Setting up Heroku deployment..."

# Install Heroku CLI (if not installed)
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create Heroku app
heroku create janta-seva-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=https://ocxhfuzrggbrvtcihwkp.supabase.co
heroku config:set SUPABASE_ANON_KEY=your_supabase_anon_key
heroku config:set PORT=5003

# Deploy
git add .
git commit -m "Deploy backend to Heroku"
git push heroku main

echo "Backend deployed to Heroku!"
echo "URL: https://janta-seva-backend.herokuapp.com"