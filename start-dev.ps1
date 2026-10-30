# Avvia service, auth service e gateway in finestre PowerShell separate

$service = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/service; node src/server.js" -PassThru
$authservice = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/auth_service; node src/server.js" -PassThru
$gateway = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/gateway; node src/server.js" -PassThru

Write-Host ""
Write-Host "Service avviato su http://localhost:3000"
Write-Host "Auth service avviato su http://localhost:3001"
Write-Host "Gateway avviato su http://localhost:4000"
Write-Host ""
Write-Host "Apri nel browser: http://localhost:4000/api/v1/about"
Write-Host ""

Read-Host "Premi INVIO per fermare service, auth service e gateway"

Stop-Process -Id $service.Id -Force
Stop-Process -Id $authservice.Id -Force
Stop-Process -Id $gateway.Id -Force

Write-Host "Server fermati."
