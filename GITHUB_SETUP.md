# GitHub Setup Instructions

## Step 1: Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ai-journey` (or your preferred name)
3. Description: "An interactive educational game teaching AI concepts"
4. Choose: Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 2: Push your code to GitHub

After creating the repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/ai-journey.git

# Verify the remote was added
git remote -v

# Push your code to GitHub
git push -u origin main
```

If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/ai-journey.git
git push -u origin main
```

## Step 3: Verify on GitHub

1. Go to your repository on GitHub
2. Check that all files are there
3. Verify that `.env` is NOT in the repository (it should be ignored)
4. Check that README.md displays correctly

## Important Notes

✅ **What's included:**
- All source code
- README.md with setup instructions
- .env.example (template for environment variables)
- .gitignore (protects sensitive files)

❌ **What's NOT included (protected by .gitignore):**
- .env (contains your actual API key)
- node_modules/
- dist/
- .DS_Store and other system files

## Security Checklist

Before pushing, make sure:
- [ ] .env file is in .gitignore
- [ ] .env file is NOT staged for commit
- [ ] API keys are stored in .env, not in code
- [ ] .env.example has placeholder values only

## Next Steps

After pushing to GitHub:

1. **Add topics** to your repository:
   - react
   - vite
   - ai
   - education
   - gemini-api
   - interactive-learning

2. **Update README.md** with:
   - Your GitHub username in clone URL
   - Your contact information
   - Live demo link (if deployed)

3. **Consider adding:**
   - LICENSE file
   - CONTRIBUTING.md
   - Issue templates
   - GitHub Actions for CI/CD

## Troubleshooting

### If you accidentally committed .env:

```bash
# Remove .env from git tracking
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from tracking"

# Push the changes
git push origin main

# IMPORTANT: Regenerate your API key on Google AI Studio
# The old key is now exposed in git history!
```

### If you need to change the remote URL:

```bash
# Remove old remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/ai-journey.git
```

### If push is rejected:

```bash
# Pull first (if repository has initial commits)
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```
