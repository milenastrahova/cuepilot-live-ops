@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1 || (echo Node.js 22 or newer is required. Install from https://nodejs.org/ & pause & exit /b 1)
where npm >nul 2>&1 || (echo npm was not found. & pause & exit /b 1)
echo Installing CuePilot dependencies...
call npm install || (echo Installation failed. Check your connection. & pause & exit /b 1)
echo Starting CuePilot at http://localhost:5174 ...
call npm run dev
pause
