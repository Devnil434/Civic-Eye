# PowerShell script to deploy to Vercel with custom project name
Write-Host "Deploying Janta Seva Admin Dashboard..." -ForegroundColor Green

# Remove existing .vercel directory if it exists
if (Test-Path ".vercel") {
    Remove-Item -Path ".vercel" -Recurse -Force
    Write-Host "Removed existing .vercel directory" -ForegroundColor Yellow
}

# Deploy to production
Write-Host "Starting deployment..." -ForegroundColor Green
vercel --prod --yes

Write-Host "Deployment completed!" -ForegroundColor Green