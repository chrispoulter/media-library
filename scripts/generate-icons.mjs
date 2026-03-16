import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import png2icons from 'png2icons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svgPath = join(root, 'resources', 'icon.svg');
const pngPath = join(root, 'resources', 'icon.png');
const buildPngPath = join(root, 'build', 'icon.png');
const icoPath = join(root, 'build', 'icon.ico');
const icnsPath = join(root, 'build', 'icon.icns');

// Ensure build directory exists
mkdirSync(join(root, 'build'), { recursive: true });

console.log('Rendering SVG → PNG (512×512)...');
await sharp(svgPath).resize(512, 512).png().toFile(pngPath);
await sharp(svgPath).resize(512, 512).png().toFile(buildPngPath);
console.log('  Written: resources/icon.png');
console.log('  Written: build/icon.png');

console.log('Converting PNG → ICO (multi-size)...');
const icoSizes = [16, 24, 32, 48, 64, 128, 256];
const icoBuffers = await Promise.all(
    icoSizes.map((size) => sharp(svgPath).resize(size, size).png().toBuffer())
);
const icoBuffer = await pngToIco(icoBuffers);
writeFileSync(icoPath, icoBuffer);
console.log('  Written: build/icon.ico');

console.log('Converting PNG → ICNS...');
const pngBuffer = readFileSync(pngPath);
const icnsBuffer = png2icons.createICNS(pngBuffer, png2icons.BILINEAR, 0);
writeFileSync(icnsPath, icnsBuffer);
console.log('  Written: build/icon.icns');

console.log('Done!');
