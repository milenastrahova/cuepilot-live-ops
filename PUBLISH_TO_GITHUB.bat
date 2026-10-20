@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo CuePilot -- Publish to GitHub
 echo ==========================================
where git >nul 2>&1 || (echo ERROR: Git is not installed. Download from https://git-scm.com/downloads & pause & exit /b 1)
where npm >nul 2>&1 || (echo ERROR: Node.js / npm missing. & pause & exit /b 1)
echo [1/5] Installing npm packages...
call npm install || (echo Install failed. & pause & exit /b 1)
echo [2/5] Validating business rules...
call npm test || (echo Tests failed. Stop. & pause & exit /b 1)
echo [3/5] Validating TypeScript and production build...
call npm run build || (echo Build failed. Stop. & pause & exit /b 1)
echo [4/5] Creating local Git commit...
if not exist ".git" (git init || (echo git init failed. & pause & exit /b 1))
git add . || (echo git add failed. & pause & exit /b 1)
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "feat: build CuePilot live broadcast control prototype" || (echo Commit failed. Set up Git identity. & pause & exit /b 1)
)
git branch -M main || (echo Branch configuration failed. & pause & exit /b 1)
git remote get-url origin >nul 2>&1
if errorlevel 1 git remote add origin https://github.com/milenastrahova/cuepilot-live-ops.git
for /f "delims=" %%R in ('git remote get-url origin') do set REMOTE=%%R
if /i not "%REMOTE%"=="https://github.com/milenastrahova/cuepilot-live-ops.git" (echo WARNING: The existing origin is %REMOTE% & echo Confirm your destination manually before pushing. & pause & exit /b 1)
echo [5/5] Pushing to GitHub...
git push -u origin main || (echo Push failed. Verify repository exists and that you are logged in. & pause & exit /b 1)
echo.
echo SUCCESS -- CuePilot source has been published!
echo https://github.com/milenastrahova/cuepilot-live-ops
echo Next: Deploy this GitHub repository on https://vercel.com/new
pause
