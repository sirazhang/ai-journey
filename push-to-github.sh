#!/bin/bash

echo "🚀 Pushing AI Journey to GitHub..."
echo ""

# Check if remote exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote 'origin' is configured"
    git remote -v
else
    echo "❌ Remote 'origin' not found"
    echo "Please run: git remote add origin https://github.com/sirazhang/ai-journey.git"
    exit 1
fi

echo ""
echo "📦 Current branch and commits:"
git log --oneline -5

echo ""
echo "🔄 Attempting to push..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🌐 View your repository at: https://github.com/sirazhang/ai-journey"
else
    echo ""
    echo "❌ Push failed. Possible reasons:"
    echo "  1. Network connection issues"
    echo "  2. Authentication required"
    echo "  3. Repository doesn't exist on GitHub"
    echo ""
    echo "💡 Try these solutions:"
    echo "  - Check your internet connection"
    echo "  - Make sure the repository exists on GitHub"
    echo "  - Try using SSH instead: git remote set-url origin git@github.com:sirazhang/ai-journey.git"
    echo "  - Or try again later when network is stable"
fi
