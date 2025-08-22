#!/bin/bash

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🗑️ Clearing node_modules (optional - uncomment if needed)..."
# rm -rf node_modules
# npm install

echo "🚀 Starting development server..."
npm run dev 