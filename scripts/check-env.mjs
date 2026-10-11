import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Checking environment requirements...');

// Check Node version
const nodeVersion = process.versions.node;
const majorNode = parseInt(nodeVersion.split('.')[0], 10);
if (majorNode < 20) {
  console.error(`❌ Node.js 20 or higher is required. Found: v${nodeVersion}`);
  process.exit(1);
}
console.log(`✅ Node.js version: v${nodeVersion}`);

// Check .env file
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.warn('⚠️ No .env file found in root. Copying from .env.example...');
  const examplePath = path.resolve(process.cwd(), '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Created .env from .env.example');
  }
} else {
  console.log('✅ .env file present');
}

console.log('🎉 Environment check passed!');
