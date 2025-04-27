#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating direct patch for the config.plugins.map error...');

// Path to the error-handler.js file mentioned in the stack trace
const errorHandlerPath = path.join(
  __dirname,
  'node_modules',
  '@shopify',
  'cli-kit',
  'dist',
  'public',
  'node',
  'error-handler.js',
);

if (!fs.existsSync(errorHandlerPath)) {
  console.error(`❌ Error handler file not found at: ${errorHandlerPath}`);
  console.log('Make sure you have installed the dependencies with npm install');
  process.exit(1);
}

try {
  console.log(`📄 Reading ${errorHandlerPath}...`);
  const content = fs.readFileSync(errorHandlerPath, 'utf8');

  // Look for the issue around line 124 as indicated in stack trace
  const lines = content.split('\n');

  // Find the problematic line that's trying to call .map on config.plugins
  let lineIndex = -1;
  let problematicLine = '';

  for (let i = 100; i < 150 && i < lines.length; i++) {
    if (lines[i].includes('config.plugins') && lines[i].includes('.map')) {
      lineIndex = i;
      problematicLine = lines[i];
      break;
    }
  }

  if (lineIndex === -1) {
    console.log(
      '❓ Could not find the exact problematic line. Looking for another approach...',
    );

    // Try to find the registerCleanBugsnagErrorsFromWithinPlugins function
    const functionStartIndex = content.indexOf(
      'function registerCleanBugsnagErrorsFromWithinPlugins',
    );

    if (functionStartIndex !== -1) {
      console.log(
        '✅ Found the registerCleanBugsnagErrorsFromWithinPlugins function',
      );

      // Extract the function content
      let braceCount = 0;
      let endIndex = functionStartIndex;
      let startFound = false;

      for (let i = functionStartIndex; i < content.length; i++) {
        if (content[i] === '{') {
          braceCount++;
          startFound = true;
        } else if (content[i] === '}') {
          braceCount--;
        }

        if (startFound && braceCount === 0) {
          endIndex = i + 1;
          break;
        }
      }

      const functionContent = content.substring(functionStartIndex, endIndex);

      // Create a patched version that checks if config.plugins is an array before calling .map
      const patchedFunction = functionContent.replace(
        /config\.plugins\.map/g,
        '(Array.isArray(config.plugins) ? config.plugins : []).map',
      );

      if (patchedFunction !== functionContent) {
        // Create the patched file
        const patchedContent = content.replace(
          functionContent,
          patchedFunction,
        );
        fs.writeFileSync(errorHandlerPath, patchedContent);
        console.log('✅ Successfully patched the error handler file');
      } else {
        console.log(
          '⚠️ Could not find the exact code to patch in the function',
        );
      }
    } else {
      console.log(
        '❌ Could not find the registerCleanBugsnagErrorsFromWithinPlugins function',
      );
    }
  } else {
    console.log(
      `🔍 Found problematic line ${lineIndex + 1}: ${problematicLine}`,
    );

    // Fix the line by ensuring config.plugins is an array
    const fixedLine = problematicLine.replace(
      /config\.plugins\.map/g,
      '(Array.isArray(config.plugins) ? config.plugins : []).map',
    );

    lines[lineIndex] = fixedLine;

    // Save the patched file
    fs.writeFileSync(errorHandlerPath, lines.join('\n'));
    console.log('✅ Successfully patched the error handler file');
  }
} catch (error) {
  console.error(`❌ Error while patching: ${error.message}`);
}

console.log('\n✅ Patch attempt complete.');
console.log('Try running your app again with:');
console.log('npm run dev');
console.log('\nIf the issue persists, run the more comprehensive fix script:');
console.log('./fix-hydrogen-config.js');
