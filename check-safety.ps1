# Pre-commit Safety Check
Write-Host "🔒 JANTA SEVA - GIT SAFETY CHECK" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check 1: Verify .gitignore exists
if (Test-Path ".gitignore") {
    Write-Host "✅ .gitignore file exists" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: .gitignore file missing!" -ForegroundColor Red
    exit 1
}

# Check 2: Verify sensitive files are ignored
$sensitiveFiles = @("backend\.env", "frontend\.env", "backend\.env.production", "frontend\.env.production")
$foundSensitive = $false

foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        $ignored = git check-ignore $file 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $file exists but is properly ignored" -ForegroundColor Green
        } else {
            Write-Host "❌ WARNING: $file exists and might be tracked!" -ForegroundColor Red
            $foundSensitive = $true
        }
    }
}

# Check 3: Verify no sensitive files are staged
Write-Host "`n🔍 Checking staged files for sensitive content..."
$stagedFiles = git diff --cached --name-only
$hasSensitiveStaged = $false

foreach ($file in $stagedFiles) {
    if ($file -match "\.env$|\.key$|\.pem$|password|secret|credential") {
        Write-Host "❌ SENSITIVE FILE STAGED: $file" -ForegroundColor Red
        $hasSensitiveStaged = $true
    } else {
        Write-Host "✅ Safe: $file" -ForegroundColor Green
    }
}

# Check 4: Final summary
Write-Host "`n📋 FINAL SAFETY SUMMARY:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

if ($foundSensitive -or $hasSensitiveStaged) {
    Write-Host "❌ UNSAFE TO PUSH - Please fix issues above!" -ForegroundColor Red
    Write-Host "`nRecommended actions:"
    Write-Host "1. Remove sensitive files from staging: git restore --staged <file>"
    Write-Host "2. Ensure .env files are in .gitignore"
    Write-Host "3. Run this check again"
    exit 1
} else {
    Write-Host "✅ SAFE TO PUSH! No sensitive data found." -ForegroundColor Green
    Write-Host "`nFiles that will be committed:"
    git diff --cached --name-only | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    
    Write-Host "`n🚀 You can now safely run: git push -u origin main" -ForegroundColor Green
    Write-Host "`n💡 Tip: Your actual credentials should be in:"
    Write-Host '  - backend.env (ignored by Git)'
    Write-Host '  - frontend.env (ignored by Git)'
    Write-Host '  - Deployment platform environment variables'
}

Write-Host "`n🔐 Privacy Protection: ACTIVE" -ForegroundColor Magenta