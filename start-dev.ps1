# Avvia service, api server e gateway in finestre PowerShell separate

$service = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/service; node src/server.js" -PassThru
$apiserver = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/apiserver; node src/server.js" -PassThru
$gateway = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/gateway; node src/server.js" -PassThru

Write-Host ""
Write-Host "Service avviato su http://localhost:3000"
Write-Host "API server avviato su http://localhost:5000"
Write-Host "Gateway avviato su http://localhost:4000"
Write-Host ""
Write-Host "Apri nel browser: http://localhost:4000/api/v1/about"
Write-Host ""

Read-Host "Premi INVIO per fermare service, api server e gateway"

Stop-Process -Id $service.Id -Force
Stop-Process -Id $apiserver.Id -Force
Stop-Process -Id $gateway.Id -Force

Write-Host "Server fermati."
