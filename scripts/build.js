import fs from 'node:fs';
import path from 'node:path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const filesToCopy = ['index.html', 'app.js', 'styles.css', 'craftBrainService.js', 'catalogData.js'];
for (const file of filesToCopy) {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(publicDir, file));
  }
}

// Mirror catalog images to public/catalog
const srcCatalog = path.resolve('catalog');
const dstCatalog = path.join(publicDir, 'catalog');
if (fs.existsSync(srcCatalog)) {
  if (!fs.existsSync(dstCatalog)) {
    fs.mkdirSync(dstCatalog, { recursive: true });
  }
  fs.cpSync(srcCatalog, dstCatalog, { recursive: true });
}

console.log('Build complete: root, public directory and catalog prepared for Vercel deployment.');
