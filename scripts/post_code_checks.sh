#!/bin/bash
set -e

echo "🚀 Running post-code checks..."
echo ""

# Get the root directory (parent of scripts directory)
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)" || exit 1

# Navigate to the application directory
cd "$ROOT_DIR/application" || exit 1

# 1. Type checking with TypeScript
echo "📋 Type checking with TypeScript..."
pnpm typecheck
echo "✅ Type checking passed"
echo ""

# 2. Linting with ESLint
echo "🔍 Linting with ESLint..."
pnpm lint
echo "✅ Linting passed"
echo ""

# 3. Formatting with Prettier
echo "✨ Formatting with Prettier..."
pnpm format
echo "✅ Formatting passed"
echo ""

# 4. Run pre-commit hooks
echo "🪝 Running pre-commit hooks..."
cd "$ROOT_DIR" || exit 1
pre-commit run --all-files
echo "✅ Pre-commit checks passed"
echo ""

echo "🎉 All post-code checks passed!"
