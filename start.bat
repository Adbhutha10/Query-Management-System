@echo off
echo Starting Query System...

echo.
echo 1. Starting Java Backend (query-system)...
cd query-system\QuerySystem
start "Java Backend" cmd /k "mvnw spring-boot:run"

timeout /t 10 /nobreak >nul

echo.
echo 2. Starting Frontend...
cd ..\..\frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo Systems started successfully!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8080
echo.
pause