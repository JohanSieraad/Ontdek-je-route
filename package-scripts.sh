#!/bin/bash

# RouteParel Database Setup Script
echo "🏰 RouteParel Database Setup"
echo "=================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo "   Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
    echo "   nano .env"
    exit 1
fi

echo "✅ .env file found"

# Install Node.js dependencies
echo "📦 Installing dependencies..."
npm install

# Setup database schema
echo "🗄️  Setting up database schema..."
npm run db:push

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "🚀 Ready to start development:"
    echo "   npm run dev"
    echo ""
    echo "📊 Optional - View database:"
    echo "   npm run db:studio"
else
    echo "❌ Database setup failed. Please check your .env configuration."
    exit 1
fi