#!/bin/bash

# Quick Start Script for Finonest Backend Server
# This script sets up and starts the server

echo ""
echo "==============================================="
echo "  FINONEST BACKEND SERVER - QUICK START"
echo "==============================================="
echo ""

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    echo "Please run this script from the server directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo "Dependencies installed successfully!"
    echo ""
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "WARNING: .env file not found!"
    echo ""
    echo "Before starting the server, you need to:"
    echo "1. Create a MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)"
    echo "2. Create a cluster and database user"
    echo "3. Copy your connection string"
    echo "4. Create .env file with your MONGODB_URI"
    echo ""
    echo "Template (copy to .env):"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finonest?retryWrites=true&w=majority"
    echo "PORT=5000"
    echo "NODE_ENV=development"
    echo ""
    exit 1
fi

echo "Starting server..."
echo ""
npm run dev
