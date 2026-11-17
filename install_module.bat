@echo off
title Installazione node_modules

echo.
echo ==============================
echo INSTALLAZIONE GATEWAY
echo ==============================
cd backend\gateway
call npm install
cd ..\..

echo.
echo ==============================
echo INSTALLAZIONE AUTH-SERVICE
echo ==============================
cd backend\auth-service
call npm install
cd ..\..

echo.
echo ==============================
echo INSTALLAZIONE PERSISTENCE-SERVICE
echo ==============================
cd backend\persistence-service
call npm install mongoose
call npm install
cd ..\..

echo.
echo ==============================
echo INSTALLAZIONE SERVICE
echo ==============================
cd backend\service
call npm install
cd ..\..

echo.
echo ==============================
echo INSTALLAZIONE COMPLETATA
echo ==============================
pause