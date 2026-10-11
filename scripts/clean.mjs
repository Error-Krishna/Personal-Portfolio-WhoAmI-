import fs from 'fs';
import path from 'path';

const targets = [
  'dist',
  'build',
  '.turbo',
  'apps/web/dist',
  'apps/api/dist',
  'packages/contracts/dist',
];

console.log('🧹 Cleaning build artifacts...');

for (const target of targets) {
  const fullPath = path.resolve(process.cwd(), target);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Deleted: ${target}`);
  }
}

console.log('✨ Clean complete.');
