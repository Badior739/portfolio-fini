import fs from 'fs';
import path from 'path';

const distPath = path.join(process.cwd(), 'dist', 'server');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

fs.writeFileSync(
  path.join(distPath, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2)
);

console.log('Created dist/server/package.json with type: commonjs');
