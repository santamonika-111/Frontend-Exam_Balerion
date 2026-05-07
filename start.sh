#!/bin/bash
# Quick start script for Salmon Allocation System

echo "🐟 Salmon Allocation System - Quick Start"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo "   The app will open at http://localhost:3000"
echo ""
echo "💡 Tips:"
echo "   - Edit files in src/ to see live updates"
echo "   - Press 'q' to quit the server"
echo "   - Press Ctrl+C to stop the server"
echo ""

npm run dev
