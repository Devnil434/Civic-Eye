# Privacy and Security Guidelines for Git

## 🔒 Critical Files to NEVER Commit

### Environment Files (Contains API Keys & Credentials)
- `.env`
- `.env.local`
- `.env.development`
- `.env.production`
- `.env.test`

### Deployment Credentials
- `.vercel/`
- `.netlify/`
- `.railway/`
- Heroku config files

### Database Files
- `*.db`
- `*.sqlite`
- Local database dumps

## ✅ Safe Practice Checklist

### Before `git push -u origin main`:

1. **Check .gitignore exists**: ✅ Created
2. **Verify .env files are ignored**: ✅ Added to .gitignore
3. **Use .env.example instead**: ✅ Created template files
4. **Remove any hardcoded credentials**: ✅ Use environment variables

### Commands to Verify:
```bash
# Check what files will be committed
git status

# Check if sensitive files are being tracked
git ls-files | grep -E "\\.env|\\.key|\\.pem"

# Should return empty (no sensitive files)
```

## 🔧 Setup Instructions

### 1. Copy Environment Templates
```bash
# Backend
cp backend\.env.example backend\.env

# Frontend  
cp frontend\.env.example frontend\.env
```

### 2. Fill in Your Actual Credentials
Edit the `.env` files with your real values:
- Supabase URL and API keys
- Database connection strings
- API endpoints

### 3. Verify Files Are Ignored
```bash
# These should NOT appear in git status
git status
# Should not show .env files
```

## 🚨 Emergency: If Credentials Were Already Committed

### Remove from Git History:
```bash
# Remove .env from tracking
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git commit -m "Remove environment files from tracking"

# For complete history removal (if needed):
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch backend/.env frontend/.env' --prune-empty --tag-name-filter cat -- --all
```

### Change All Compromised Credentials:
1. **Regenerate Supabase API keys**
2. **Update database passwords**
3. **Revoke any exposed tokens**

## 📋 Safe Git Workflow

```bash
# 1. Check status before committing
git status

# 2. Add only safe files
git add .

# 3. Review what's being committed
git diff --cached

# 4. Commit safely
git commit -m "Add feature without exposing credentials"

# 5. Push to origin
git push -u origin main
```

## 🛡️ Additional Security Measures

### Use Git Hooks (Optional)
Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
# Check for potential secrets
if git diff --cached --name-only | grep -E "\\.env$|\\.key$|\\.pem$"; then
    echo "❌ ERROR: Attempting to commit sensitive files!"
    echo "Please check your .gitignore"
    exit 1
fi
```

### Environment Variable Validation
```bash
# Check if .env files exist but aren't tracked
ls -la backend/.env frontend/.env 2>/dev/null && echo "✅ Environment files exist locally"
git ls-files | grep "\.env$" && echo "❌ ERROR: .env files are tracked!" || echo "✅ .env files are properly ignored"
```

---

**Remember**: The `.gitignore` file protects your credentials automatically. Always use `.env.example` templates for sharing configuration structure without exposing actual values.