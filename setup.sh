#!/bin/bash
# Afghanistan GitHub Leaderboard - Setup Script for Linux/macOS

echo "🦅 Afghanistan GitHub Leaderboard - Setup"
echo "============================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your GITHUB_TOKEN"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "============================================"
echo "🚀 Setup Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your GitHub Token"
echo "2. Run 'npm test' to test (dry run)"
echo "3. Run 'npm start' to generate leaderboard"
echo ""
echo "For GitHub Actions:"
echo "1. Push to GitHub"
echo "2. Add GITHUB_TOKEN secret in repository settings"
echo "3. The workflow will run automatically every 24 hours"
echo ""
