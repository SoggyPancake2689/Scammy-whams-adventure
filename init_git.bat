@echo off
echo Initializing Git repository for Diamond Flappy Bird Game...
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/downloads
    echo Then run this script again
    pause
    exit /b 1
)

echo Git found! Initializing repository...
git init

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: Diamond Flappy Bird game with full features

- Complete Flappy Bird-style game with diamond character
- Multiple difficulty levels (Easy, Normal, Hard)
- 6 different obstacle themes with random selection
- Particle trail system with glow effects
- Animated background with clouds and stars
- Complete UI system with menus, countdown, and game over
- High score persistence using LocalStorage
- Smooth 60fps gameplay with delta time physics
- Canvas-based rendering (800x600)
- Cross-browser compatibility"

echo.
echo Repository initialized successfully!
echo.
echo Next steps:
echo 1. Create a GitHub repository
echo 2. Add remote origin: git remote add origin YOUR_REPO_URL
echo 3. Push to GitHub: git push -u origin main
echo.
pause

