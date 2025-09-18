Write-Host "Setting up new Vercel project with name 'civic-eye-admin'..." -ForegroundColor Green

# Answer the prompts automatically
$env:VERCEL_PROJECT_NAME = "civic-eye-admin"

# Use echo to pipe responses to vercel
"Y`ncivic-eye-admin`n" | vercel --prod

Write-Host "Deployment completed with new project name!" -ForegroundColor Green