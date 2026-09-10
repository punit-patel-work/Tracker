/**
 * Generates the app icons as real PNGs with no image dependencies — zlib and a
 * CRC table are all a PNG needs. Run once, or after changing the mark:
 *   node scripts/make-icons.mjs
 *
 * A dumbbell on the brand gradient, drawn with 3x3 supersampling so the curves
 * are not jagged at 180px on a home screen.
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

const lerp = (a, b, t) => a + (b - a) * t;
const HEX_A = [0x7c, 0x5c, 0xff]; // brand violet
const HEX_B = [0xc0, 0x26, 0xd3]; // brand magenta

/** Rounded rectangle hit test in normalised 0..1 space. */
function inRoundRect(x, y, cx, cy, w, h, r) {
  const dx = Math.abs(x - cx) - (w / 2 - r);
  const dy = Math.abs(y - cy) - (h / 2 - r);
  if (dx <= 0 || dy <= 0) return Math.abs(x - cx) <= w / 2 && Math.abs(y - cy) <= h / 2;
  return dx * dx + dy * dy <= r * r;
}

/** The dumbbell: centre bar, inner plates, outer plates. */
function inDumbbell(x, y) {
  const cy = 0.5;
  if (inRoundRect(x, y, 0.5, cy, 0.46, 0.075, 0.032)) return true;
  if (inRoundRect(x, y, 0.335, cy, 0.095, 0.32, 0.038)) return true;
  if (inRoundRect(x, y, 0.665, cy, 0.095, 0.32, 0.038)) return true;
  if (inRoundRect(x, y, 0.225, cy, 0.07, 0.21, 0.03)) return true;
  if (inRoundRect(x, y, 0.775, cy, 0.07, 0.21, 0.03)) return true;
  return false;
}

/**
 * @param size    pixels
 * @param padded  maskable icons need the mark inside the safe zone, so the
 *                glyph shrinks and the background bleeds to the full square
 */
function render(size, { rounded, padded }) {
  const buf = Buffer.alloc(size * size * 4);
  const S = 3; // supersample grid
  const radius = 0.22; // of the square
  const scale = padded ? 0.62 : 0.82;

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let bgHits = 0;
      let fgHits = 0;
      for (let sy = 0; sy < S; sy += 1) {
        for (let sx = 0; sx < S; sx += 1) {
          const x = (px + (sx + 0.5) / S) / size;
          const y = (py + (sy + 0.5) / S) / size;
          if (!rounded || inRoundRect(x, y, 0.5, 0.5, 1, 1, radius)) bgHits += 1;
          // Glyph coordinates, scaled about the centre.
          const gx = (x - 0.5) / scale + 0.5;
          const gy = (y - 0.5) / scale + 0.5;
          if (inDumbbell(gx, gy)) fgHits += 1;
        }
      }
      const total = S * S;
      const bgA = bgHits / total;
      const fgA = fgHits / total;

      // Diagonal brand gradient.
      const t = (px / size + py / size) / 2;
      const r = lerp(HEX_A[0], HEX_B[0], t);
      const g = lerp(HEX_A[1], HEX_B[1], t);
      const b = lerp(HEX_A[2], HEX_B[2], t);

      // White glyph composited over the gradient, both clipped by the shape.
      const out = px * 4 + py * size * 4;
      buf[out] = Math.round(lerp(r, 255, fgA));
      buf[out + 1] = Math.round(lerp(g, 255, fgA));
      buf[out + 2] = Math.round(lerp(b, 255, fgA));
      buf[out + 3] = Math.round(255 * bgA);
    }
  }
  return encodePng(size, size, buf);
}

const files = [
  ['icon-192.png', render(192, { rounded: true, padded: false })],
  ['icon-512.png', render(512, { rounded: true, padded: false })],
  ['icon-maskable-512.png', render(512, { rounded: false, padded: true })],
  // iOS applies its own mask and does not support transparency here.
  ['apple-touch-icon.png', render(180, { rounded: false, padded: false })],
  ['favicon-32.png', render(32, { rounded: true, padded: false })],
];

for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data);
  console.log(`wrote public/${name}  ${(data.length / 1024).toFixed(1)} kB`);
}
