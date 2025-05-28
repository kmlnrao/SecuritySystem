#!/bin/bash

echo "🏥 Starting Hospital Management Microservices..."

# Kill any existing services
pkill -f "node.*service" 2>/dev/null

# Start services in background
echo "🔐 Starting Auth Service on port 3001..."
cd services && node auth-service.js &
AUTH_PID=$!

sleep 2

echo "👥 Starting User Service on port 3002..."
node user-service.js &
USER_PID=$!

sleep 2

echo "📦 Starting Doc Service on port 3003..."
node doc-service.js &
DOC_PID=$!

sleep 2

echo "🔒 Starting Permission Service on port 3004..."
node perm-service.js &
PERM_PID=$!

sleep 3

echo "✅ All microservices started!"
echo "Auth Service: http://localhost:3001"
echo "User Service: http://localhost:3002"
echo "Doc Service: http://localhost:3003"
echo "Permission Service: http://localhost:3004"

# Keep script running
wait