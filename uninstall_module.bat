@echo off
title Rimozione node_modules

cd /d "%~dp0"

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
echo RIMOZIONE SERVICE
echo ==============================
rmdir /s /q backend\service\node_modules

echo.
echo ==============================
echo RIMOZIONE COMPLETATA
echo ==============================

pause

