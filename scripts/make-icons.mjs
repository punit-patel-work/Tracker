/**
 * Generates the app icons as real PNGs with no image dependencies — zlib and a
 * CRC table are all a PNG needs. Run once, or after changing the mark:
 *   node scripts/make-icons.mjs
 *
 * Flat barbell mark on the training journal green background.
 * Drawn with supersampling for crisp edges at all sizes.
 */
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------- PNG */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0; // filter: none
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ---------------------------------------------------------------- drawing */
const BACKGROUND = [38, 115, 79];
const FOREGROUND = [255, 255, 255];
const segments = [[8,12,16,12],[5,8,5,16],[8,6,8,18],[16,6,16,18],[19,8,19,16],[3,12,5,12],[19,12,21,12]];
function distance(x, y, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - x1 - t * dx, y - y1 - t * dy);
}
function insideBackground(x, y) {
  const dx = Math.max(0, Math.abs(x - 0.5) - 0.27);
  const dy = Math.max(0, Math.abs(y - 0.5) - 0.27);
  return dx * dx + dy * dy <= 0.2 * 0.2;
}
function render(size, { rounded, padded }) {
  const buffer = Buffer.alloc(size * size * 4);
  const samples = size <= 48 ? 4 : 3;
  const scale = padded ? 0.52 : 0.65;
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    let background = 0, glyph = 0;
    for (let sy = 0; sy < samples; sy++) for (let sx = 0; sx < samples; sx++) {
      const x = (px + (sx + 0.5) / samples) / size, y = (py + (sy + 0.5) / samples) / size;
      if (!rounded || insideBackground(x, y)) background++;
      const gx = ((x - 0.5) / scale + 0.5) * 24, gy = ((y - 0.5) / scale + 0.5) * 24;
      if (segments.some(([x1,y1,x2,y2]) => distance(gx,gy,x1,y1,x2,y2) <= 0.9)) glyph++;
    }
    const alpha = glyph / (samples * samples), offset = (py * size + px) * 4;
    for (let c = 0; c < 3; c++) buffer[offset + c] = Math.round(BACKGROUND[c] * (1 - alpha) + FOREGROUND[c] * alpha);
    buffer[offset + 3] = Math.round(255 * background / (samples * samples));
  }
  return encodePng(size, size, buffer);
}
for (const [name, size, rounded, padded] of [
  ['icon-192.png',192,true,false], ['icon-512.png',512,true,false], ['icon-maskable-512.png',512,false,true],
  ['apple-touch-icon.png',180,false,false], ['favicon-32.png',32,true,false],
]) {
  const data = render(size, { rounded, padded });
  writeFileSync(join(OUT, name), data);
  console.log(`wrote public/${name} (${data.length} bytes)`);
}
