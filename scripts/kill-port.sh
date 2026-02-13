#!/bin/bash

# Kill process on port 3000 (macOS compatible)
PORT=3000

echo "Checking for processes on port $PORT..."

# Find and kill process using lsof (macOS)
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✓ Port $PORT is free"
else
  echo "✗ Port $PORT is in use by process $PID"
  echo "Killing process $PID..."
  kill -9 $PID
  sleep 1
  echo "✓ Port $PORT is now free"
fi
