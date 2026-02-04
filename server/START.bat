@echo off
REM Quick Start Script for Finonest Backend Server
REM This script sets up and starts the server

echo.
echo ===============================================
echo   FINONEST BACKEND SERVER - QUICK START
echo ===============================================
echo.

REM Check if we're in the server directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the server directory.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo.
    echo Before starting the server, you need to:
    echo 1. Create a MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
    echo 2. Create a cluster and database user
    echo 3. Copy your connection string
    echo 4. Create .env file with your MONGODB_URI
    echo.
    echo Template (copy to .env):
    echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finonest?retryWrites=true^&w=majority
    echo PORT=5000
    echo NODE_ENV=development
    echo.
    pause
    exit /b 1
)

echo Starting server...
echo.
call npm run dev

pause
