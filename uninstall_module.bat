@echo off
title Rimozione node_modules

echo.
echo ==============================
echo RIMOZIONE GATEWAY
echo ==============================
rmdir /s /q backend\gateway\node_modules

echo.
echo ==============================
echo RIMOZIONE AUTH-SERVICE
echo ==============================
rmdir /s /q backend\auth-service\node_modules

echo.
echo ==============================
echo RIMOZIONE AUTH-SERVICE
echo ==============================
rmdir /s /q backend\persistence-service\node_modules

echo.
echo ==============================
echo RIMOZIONE SERVICE
echo ==============================
rmdir /s /q backend\service\node_modules

echo.
echo ==============================
echo RIMOZIONE COMPLETATA
echo ==============================

echo.
echo ==============================
echo CREAZIONE ZIP
echo ==============================

set "PROJECT_DIR=%CD%"

for %%I in ("%PROJECT_DIR%") do set "PROJECT_NAME=%%~nxI"

for %%I in ("%PROJECT_DIR%") do set "PARENT_DIR=%%~dpI"

cd /d "%PARENT_DIR%"

tar -a -c -f "%PROJECT_NAME%.zip" "%PROJECT_NAME%"

echo ==============================
echo ZIP CREATO
echo ==============================
pause