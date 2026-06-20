#!/bin/bash

# Exit on error
set -e

echo "=== Starting StockSync Local Setup ==="

# 1. Setup Backend
echo "Setting up Python virtual environment and installing backend packages..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ..

# 2. Setup Frontend
echo "Installing frontend package dependencies..."
cd frontend
npm install
cd ..

echo "=== Setup complete! ==="
echo "To run the backend locally, execute:"
echo "  cd backend && source .venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "To run the frontend locally, execute:"
echo "  cd frontend && npm run dev"
echo ""
echo "Or run the entire system with Docker Compose:"
echo "  docker-compose up --build"
