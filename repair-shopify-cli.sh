#!/bin/bash

echo "=== Shopify CLI Repair Tool ==="
echo "This script will attempt to repair common Shopify CLI issues"
echo

# Make the diagnostic script executable
chmod +x debug-cli-plugins.js

# Check for yarn.lock or package-lock.json to determine package manager
if [ -f "yarn.lock" ]; then
  PACKAGE_MANAGER="yarn"
  echo "Detected Yarn as your package manager"
else
  PACKAGE_MANAGER="npm"
  echo "Using NPM as your package manager"
fi

echo
echo "Step 1: Clearing node_modules"
rm -rf node_modules
echo "✅ Cleared node_modules folder"

if [ "$PACKAGE_MANAGER" == "yarn" ]; then
  echo
  echo "Step 2: Clearing Yarn cache"
  yarn cache clean
  echo "✅ Cleared Yarn cache"
else
  echo
  echo "Step 2: Clearing NPM cache"
  npm cache clean --force
  echo "✅ Cleared NPM cache"
fi

echo
echo "Step 3: Re-installing dependencies"
if [ "$PACKAGE_MANAGER" == "yarn" ]; then
  yarn install
else
  npm install
fi
echo "✅ Reinstalled dependencies"

echo
echo "Step 4: Looking for plugin configuration issues"
# Run the diagnostic script
./debug-cli-plugins.js

echo
echo "Repair process completed. Try running your Shopify CLI command again."
echo "If issues persist, try updating the global Shopify CLI:"
if [ "$PACKAGE_MANAGER" == "yarn" ]; then
  echo "  yarn global add @shopify/cli"
else
  echo "  npm install -g @shopify/cli"
fi
