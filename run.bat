@echo off

cd /d "%~dp0"

start "Auth Service" cmd /k "cd backend\auth-service && node src\authserver.js"

start "Service" cmd /k "cd backend\service && node src\server.js"

start "Persistence Service" cmd /k "cd backend\persistence-service && node src\persistenceserver.js"

start "Wanted Service" cmd /k "cd backend\wanted-service && python server.py"

start "Gateway" cmd /k "cd backend\gateway && node src\gateway.js"

pause