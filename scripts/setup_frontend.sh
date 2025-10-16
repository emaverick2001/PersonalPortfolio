#!/bin/bash
set -e

echo "🚀 Setting up Personal Portfolio frontend development environment..."

# Activate Python virtual environment if it exists
# shellcheck source=/dev/null
if [ -f "portfolio-app/venv/bin/activate" ]; then
    echo "🐍 Activating Python virtual environment..."
    source portfolio-app/venv/bin/activate
else
    echo "ℹ️ Virtual environment not found, continuing without it..."
fi

# Navigate to frontend directory
cd portfolio-app/frontend/ || exit

# Kill any existing processes on port 3000
echo "🔍 Checking for existing processes on port 4321..."
kill -9 "$(lsof -ti:4321)" 2>/dev/null || echo "No processes found on port 4321"

# Install dependencies if node_modules doesn't exist or is outdated
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Start development server
echo "🎉 Starting development server on port 4321..."
pnpm dev
