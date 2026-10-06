@echo off
REM ===== Oswah backend (FastAPI) =====
REM First run: creates backend\.venv, installs packages, creates backend\.env
cd /d "%~dp0backend"
if not exist ".venv\Scripts\python.exe" (
  py -3.11 -m venv .venv || (echo [!] Python 3.11 not found. Install it from https://www.python.org/downloads/ and tick "Add python.exe to PATH". & pause & exit /b 1)
)
call ".venv\Scripts\activate.bat"
python -m pip install --upgrade pip >nul
pip install -r requirements.txt || (echo [!] pip install failed. & pause & exit /b 1)
if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo [i] Created backend\.env  -  put your OPENAI_API_KEY in it, save, close Notepad, then run this file again.
  notepad ".env"
  exit /b 0
)
echo [i] Backend: http://localhost:8000/api/health   (docs: http://localhost:8000/docs)
uvicorn main:app --reload --port 8000
