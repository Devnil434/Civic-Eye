Write-Host "Setting up new Vercel project with name 'janta-seva-admin'..." -ForegroundColor Green

# Answer the prompts automatically
$env:VERCEL_PROJECT_NAME = "janta-seva-admin"

# Use echo to pipe responses to vercel
"Y`njanta-seva-admin`n" | vercel --prod

Write-Host "Deployment completed with new project name!" -ForegroundColor Green