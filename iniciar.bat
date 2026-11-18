@echo off
chcp 65001 >nul
title Tesouraria - servidor local
cd /d "%~dp0"
if not exist node_modules (
  echo A instalar o que falta (so na primeira vez)...
  call npm install --no-audit --no-fund
)
start "" http://localhost:3000
node server.js
pause
