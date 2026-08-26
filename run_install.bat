@echo off
echo Starting npm installation script via mirror...
cd /d "C:\Users\My\Desktop\Coding\AMRITA YADAV"
call npm.cmd install --registry=https://registry.npmmirror.com --no-audit --no-fund --loglevel=info
echo Finished npm installation.
