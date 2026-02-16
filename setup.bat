@echo off
REM Afghanistan GitHub Leaderboard - Setup Script for Windows

echo 🦅 Afghanistan GitHub Leaderboard - Setup
echo ===========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env >nul
    echo ⚠️  Please edit .env and add your GITHUB_TOKEN
) else (
    echo ✅ .env file already exists
)

echo.
echo ===========================================
echo 🚀 Setup Complete!
echo ===========================================
echo.
echo Next steps:
echo 1. Edit .env and add your GitHub Token
echo 2. Run 'npm test' to test (dry run)
echo 3. Run 'npm start' to generate leaderboard
echo.
echo For GitHub Actions:
echo 1. Push to GitHub
echo 2. Add GITHUB_TOKEN secret in repository settings
echo 3. The workflow will run automatically every 24 hours
echo.
pause
