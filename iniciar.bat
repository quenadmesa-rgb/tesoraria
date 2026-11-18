@echo off
chcp 65001 >nul
title Tesouraria - servidor local
cd /d "%~dp0"
if not exist "node_modules\mysql2" call npm install --no-audit --no-fund
start "" "http://localhost:3000"
node server.js
echo.
echo O servidor parou. Carregue numa tecla para fechar.
pause >nul
