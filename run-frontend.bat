@echo off
REM ===== Oswah frontend (Next.js) =====
cd /d "%~dp0frontend"
where node >nul 2>nul || (echo [!] Node.js not found. Install Node.js 20 LTS from https://nodejs.org & pause & exit /b 1)
if not exist ".env.local" copy ".env.local.example" ".env.local" >nul
if not exist "node_modules" (
  call npm install || (echo [!] npm install failed. & pause & exit /b 1)
)
echo [i] Open http://localhost:3000   (connection check: http://localhost:3000/api/health)
call npm run dev
