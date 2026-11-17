@echo off
title Installazione dipendenze Node.js

echo.
echo ==============================
echo INSTALLAZIONE GATEWAY
echo ==============================
cd backend\gateway
call npm install

echo.
echo ==============================
echo INSTALLAZIONE AUTH-SERVICE
echo ==============================
cd ..\auth-service
call npm install

echo.
echo ==============================
echo INSTALLAZIONE PERSISTENCE-SERVICE
echo ==============================
cd ..\persistence-service
call npm install


echo.
echo ==============================
echo INSTALLAZIONE SERVICE
echo ==============================
cd ..\service
call npm install

echo.
echo ==============================
echo INSTALLAZIONE COMPLETATA
echo ==============================
echo.

pause