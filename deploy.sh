#!/bin/bash

# Script to build Next.js app for GitHub Pages deployment

echo "Starting build process for GitHub Pages deployment..."

# Clean previous build
rm -rf out
rm -rf .next

# Install dependencies if needed
# npm install

# Build the Next.js app
npm run build

echo "Build completed!"
echo "The 'out' directory now contains your static site files"
echo ""
echo "To deploy to GitHub Pages:"
echo "1. Commit and push your changes to GitHub"
echo "2. GitHub Actions will automatically deploy your site"
echo "3. Visit your site at: https://dakshinrajsiva.github.io/cci/sebi-cscrf"
echo ""
echo "Note: It may take a few minutes for the deployment to complete" 