#!/bin/bash

echo "🚀 Starting Mates HR Development Environment..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    # Use a simple database URL for development
    echo "DATABASE_URL=\"postgresql://postgres:password@localhost:5432/mates_hr?schema=public\"" >> .env
fi

echo ""
echo "✨ Starting servers..."
echo ""

# Start both backend and frontend in parallel
echo "🔹 Backend will run on: http://localhost:3001"
echo "🔹 Frontend will run on: http://localhost:3000"
echo "🔹 API Docs will be at: http://localhost:3001/api/docs"
echo ""
echo "📝 Default Login Credentials:"
echo "   Email: admin@mates-hr.com"
echo "   Password: Admin@123"
echo ""
echo "⏳ Starting in 3 seconds..."
sleep 3

# Run the development servers
npm run dev
