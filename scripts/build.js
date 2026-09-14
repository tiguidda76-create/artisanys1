import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filesToCopy = ['index.html', 'app.js', 'styles.css', 'craftBrainService.js'];
for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(publicDir, file));
  }
}

console.log('Build complete: root and public directory prepared for Vercel deployment.');
