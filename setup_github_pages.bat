@echo off
echo Setting up Diamond Flappy Bird for GitHub Pages...
echo.

echo Step 1: Initializing Git repository...
git init
echo.

echo Step 2: Adding all files to Git...
git add .
echo.

echo Step 3: Making initial commit...
git commit -m "Initial commit: Diamond Flappy Bird game"
echo.

echo Step 4: Creating GitHub repository setup instructions...
echo.
echo ========================================
echo GITHUB PAGES SETUP INSTRUCTIONS
echo ========================================
echo.
echo 1. Go to https://github.com and sign in to your account
echo.
echo 2. Click the "+" button in the top right corner
echo    Select "New repository"
echo.
echo 3. Repository settings:
echo    - Repository name: diamond-flappy-bird
echo    - Description: A modern Flappy Bird-style game with a diamond character
echo    - Make it Public (required for free GitHub Pages)
echo    - DO NOT initialize with README, .gitignore, or license
echo    - Click "Create repository"
echo.
echo 4. Connect your local repository to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/diamond-flappy-bird.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 5. Enable GitHub Pages:
echo    - Go to your repository on GitHub
echo    - Click "Settings" tab
echo    - Scroll down to "Pages" section
echo    - Under "Source", select "Deploy from a branch"
echo    - Select "main" branch and "/ (root)" folder
echo    - Click "Save"
echo.
echo 6. Your game will be available at:
echo    https://YOUR_USERNAME.github.io/diamond-flappy-bird
echo.
echo ========================================
echo.
echo Git repository initialized successfully!
echo Follow the instructions above to complete GitHub Pages setup.
echo.
pause
