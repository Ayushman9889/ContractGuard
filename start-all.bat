@echo off
echo ===================================================
echo           Starting ContractGuard Platform
echo ===================================================

echo [1/3] Starting Storage Layer (PostgreSQL & ChromaDB via Docker)...
docker-compose up -d

echo.
echo [2/3] Starting Backend Engine (Express on Port 5000)...
start "ContractGuard Backend" cmd /k "cd server && npm run dev"

echo.
echo [3/3] Starting Client Layer (Next.js on Port 3000)...
start "ContractGuard Frontend" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo ContractGuard is booting up!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo ChromaDB: http://localhost:8000
echo Postgres: localhost:5432
echo ===================================================
pause
