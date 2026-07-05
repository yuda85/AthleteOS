// Regenerates PWA icons from the brand logo. Run: node scripts/generate-icons.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const source = resolve(root, '../public/logo.png');
const outDir = resolve(root, '../public/icons');
mkdirSync(outDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: '#FFFFFF' })
    .flatten({ background: '#FFFFFF' })
    .png()
    .toFile(resolve(outDir, `icon-${size}x${size}.png`));
  console.log(`icon-${size}x${size}.png`);
}
