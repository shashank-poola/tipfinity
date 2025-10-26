#!/bin/bash

# Tipfinity Integration Test Script
echo "🚀 Testing Tipfinity Frontend-Backend Integration"

# Check if backend is running
echo "📡 Checking backend health..."
BACKEND_RESPONSE=$(curl -s http://localhost:3000/health || echo "FAILED")

if [[ $BACKEND_RESPONSE == *"ok"* ]]; then
    echo "✅ Backend is running and healthy"
else
    echo "❌ Backend is not responding. Please start the backend first:"
    echo "   cd tipfinity/apps/server && cargo run"
    exit 1
fi

# Check if frontend is running
echo "🌐 Checking frontend..."
FRONTEND_RESPONSE=$(curl -s http://localhost:8080 || echo "FAILED")

if [[ $FRONTEND_RESPONSE == *"html"* ]]; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend is not responding. Please start the frontend first:"
    echo "   cd tipfinity/apps/web && npm run dev"
    exit 1
fi

# Test API endpoints
echo "🧪 Testing API endpoints..."

# Test creators endpoint
echo "  - Testing creators endpoint..."
CREATORS_RESPONSE=$(curl -s http://localhost:3000/creators || echo "FAILED")
if [[ $CREATORS_RESPONSE == *"success"* ]]; then
    echo "    ✅ Creators endpoint working"
else
    echo "    ❌ Creators endpoint failed"
fi

# Test recent tips endpoint
echo "  - Testing recent tips endpoint..."
TIPS_RESPONSE=$(curl -s http://localhost:3000/tips/recent || echo "FAILED")
if [[ $TIPS_RESPONSE == *"success"* ]]; then
    echo "    ✅ Recent tips endpoint working"
else
    echo "    ❌ Recent tips endpoint failed"
fi

echo ""
echo "🎉 Integration test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:8080 in your browser"
echo "2. Try the signup flow"
echo "3. Connect a wallet"
echo "4. Create a creator profile"
echo "5. Test the tip functionality"
echo ""
echo "📚 For more details, see INTEGRATION.md"
