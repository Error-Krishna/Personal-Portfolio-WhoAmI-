import fs from 'fs';
import path from 'path';

const source = path.resolve(process.cwd(), 'content/site_config.json');
const target = path.resolve(process.cwd(), 'apps/web/src/content/site_config.json');

console.log('🔄 Synchronizing site configuration...');

if (!fs.existsSync(source)) {
  console.error(`❌ Source configuration not found: ${source}`);
  process.exit(1);
}

try {
  // Validate JSON syntax before copying
  const content = fs.readFileSync(source, 'utf-8');
  JSON.parse(content);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
  console.log(`✅ Successfully mirrored content/site_config.json -> apps/web/src/content/site_config.json`);
} catch (err) {
  console.error('❌ Failed to synchronize configuration:', err.message);
  process.exit(1);
}
