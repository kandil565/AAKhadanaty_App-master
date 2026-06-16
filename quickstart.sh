#!/bin/bash
# Quick Start Script - سكريبت البدء السريع

echo "🚀 AAKhadanaty App - Quick Start"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js installed${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm installed${NC}"

echo ""
echo "📂 Installing dependencies..."

# Install backend dependencies
cd backend
if [ -d "node_modules" ]; then
    echo "   Backend deps already installed"
else
    echo "   Installing backend dependencies..."
    npm install
fi
cd ..

# Install frontend dependencies if needed
if [ -d "node_modules" ]; then
    echo "   Frontend deps already installed"
else
    echo "   Installing frontend dependencies..."
    npm install
fi

echo ""
echo -e "${BLUE}✨ Setup Complete!${NC}"
echo ""
echo "🎯 Available Commands:"
echo "====================="
echo ""
echo "Backend:"
echo "  npm start                    # Start backend server"
echo "  cd backend && npm run dev    # Start with nodemon"
echo "  cd backend && node testDB.js # Test DB connection"
echo ""
echo "Frontend:"
echo "  npm run dev                  # Start dev server"
echo "  npm run build                # Build for production"
echo ""
echo "Database:"
echo "  cd backend && node scripts/createAdmin.js        # Create admin"
echo "  cd backend && node scripts/checkDatabase.js      # Check DB status"
echo "  cd backend && node scripts/deleteNonAdminUsers.js # Delete non-admin users"
echo ""
echo "Testing:"
echo "  cd backend && node testAPI.js # Test API health"
echo ""
echo -e "${GREEN}Ready to go! 🎉${NC}"
