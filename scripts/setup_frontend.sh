#!/bin/bash
set -e
# ...existing code...

echo "🚀 Setting up Personal Portfolio frontend development environment..."

# Ensure pnpm is available first
if ! command -v pnpm >/dev/null 2>&1; then
  echo "❌ pnpm not found in PATH. Install globally: npm install -g pnpm  OR brew install pnpm"
  exit 1
fi

# Move to frontend folder (relative to repo root)
cd "$(dirname "$0")/../frontend" || exit

# Install frontend deps if needed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  pnpm install
else
  echo "✅ Frontend dependencies already installed"
fi

# Kill any existing dev server on Astro's default port
echo "🔍 Checking for existing processes on port 4321..."
kill -9 "$(lsof -ti:4321)" 2>/dev/null || echo "No processes found on port 4321"

# Start the frontend dev server
echo "🎉 Starting frontend development server on port 4321..."
pnpm dev

# OPTIONAL: If you need a Python venv for backend work, activate it AFTER Node steps.
# Activate Python virtual environment (only if you need it for backend)
# shellcheck source=/dev/null
# VENV_PATH="$(dirname "$0")/../portfolio-app/venv/bin/activate"
# if [ -f "$VENV_PATH" ]; then
#   echo "🐍 Activating Python virtual environment..."
#   # shellcheck disable=SC1091
#   source "$VENV_PATH"
# else
#   echo "ℹ️ Python virtual environment not found at $VENV_PATH — skipping"
# fi

# # ...existing code...
