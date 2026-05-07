@echo off
REM Quick start script for Salmon Allocation System (Windows)

echo.
echo 🐟 Salmon Allocation System - Quick Start
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i

echo ✅ Node.js version: %NODE_VERSION%
echo ✅ npm version: %NPM_VERSION%
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting development server...
echo    The app will open at http://localhost:3000
echo.
echo 💡 Tips:
echo    - Edit files in src/ to see live updates
echo    - Press Ctrl+C to stop the server
echo.
pause

call npm run dev
