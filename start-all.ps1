Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "          Starting ContractGuard Platform          " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Starting Storage Layer (PostgreSQL & ChromaDB via Docker)..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "`n[2/3] Starting Backend Engine (Express on Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

Write-Host "`n[3/3] Starting Client Layer (Next.js on Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "`n===================================================" -ForegroundColor Green
Write-Host "ContractGuard is booting up!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "ChromaDB: http://localhost:8000" -ForegroundColor Green
Write-Host "Postgres: localhost:5432" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
