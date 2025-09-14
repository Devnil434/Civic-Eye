# Vercel Deployment Script
echo "Setting up Vercel deployment..."

# Install Vercel CLI (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod

echo "Frontend deployed to Vercel!"