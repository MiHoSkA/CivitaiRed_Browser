@echo off
chcp 65001 >nul
title Civitai Red Browser
cd /d "%~dp0"
node "%~dp0server.js"
pause
