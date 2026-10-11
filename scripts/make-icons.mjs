/**
 * Generates the app icons as real PNGs with no image dependencies — zlib and a
 * CRC table are all a PNG needs. Run once, or after changing the mark:
 *   node scripts/make-icons.mjs
 *
 * Studio Athletic Barbell & Progressive Overload Apex Peak icon.
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

const lerp = (a, b, t) => a + (b - a) * t;

// Studio Athletic Theme Colors
const COLOR_BG_START = [0x14, 0x17, 0x22]; // Deep Obsidian Surface
const COLOR_BG_END   = [0x09, 0x0a, 0x0f]; // Pure Canvas
const COLOR_EMERALD  = [0x00, 0xe5, 0x99]; // Electric Emerald
const COLOR_WHITE    = [0xff, 0xff, 0xff]; // Crisp White Peak

/** Rounded rectangle hit test in normalised 0..1 space. */
function inRoundRect(x, y, cx, cy, w, h, r) {
  const dx = Math.abs(x - cx) - (w / 2 - r);
  const dy = Math.abs(y - cy) - (h / 2 - r);
  if (dx <= 0 || dy <= 0) return Math.abs(x - cx) <= w / 2 && Math.abs(y - cy) <= h / 2;
  return dx * dx + dy * dy <= r * r;
}

/** Distance from point (px, py) to line segment (x1, y1)-(x2, y2). */
function distToSegment(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
}

/** Check if inside the barbell plates and shaft. */
function inBarbell(x, y) {
  const cy = 0.5;
  // Left outer plate
  if (inRoundRect(x, y, 0.17, cy, 0.06, 0.32, 0.03)) return true;
  // Left inner plate
  if (inRoundRect(x, y, 0.27, cy, 0.08, 0.52, 0.04)) return true;
  // Left collar
  if (inRoundRect(x, y, 0.35, cy, 0.045, 0.24, 0.02)) return true;
  // Central shaft
  if (inRoundRect(x, y, 0.50, cy, 0.26, 0.08, 0.04)) return true;
  // Right collar
  if (inRoundRect(x, y, 0.65, cy, 0.045, 0.24, 0.02)) return true;
  // Right inner plate
  if (inRoundRect(x, y, 0.73, cy, 0.08, 0.52, 0.04)) return true;
  // Right outer plate
  if (inRoundRect(x, y, 0.83, cy, 0.06, 0.32, 0.03)) return true;
  return false;
}

/** Check if inside the progressive overload peak chevron. */
function inChevron(x, y, thickness = 0.024) {
  const d1 = distToSegment(x, y, 0.38, 0.41, 0.50, 0.27);
  const d2 = distToSegment(x, y, 0.50, 0.27, 0.62, 0.41);
  return Math.min(d1, d2) <= thickness;
}

/**
 * @param size    pixels
 * @param rounded whether squircle container is clipped
 * @param padded  maskable safe zone padding
 */
function render(size, { rounded, padded }) {
  const buf = Buffer.alloc(size * size * 4);
  const S = size <= 48 ? 4 : 3; // supersample grid: 4x4 for favicons, 3x3 for large icons
  const radius = 0.24; // of squircle
  const scale = padded ? 0.64 : 0.82;

  for (let py = 0; py < size; py += 1) {
    for (let px = 0; px < size; px += 1) {
      let bgHits = 0;
      let borderHits = 0;
      let barbellHits = 0;
      let chevronHits = 0;

      for (let sy = 0; sy < S; sy += 1) {
        for (let sx = 0; sx < S; sx += 1) {
          const x = (px + (sx + 0.5) / S) / size;
          const y = (py + (sy + 0.5) / S) / size;

          const inBg = !rounded || inRoundRect(x, y, 0.5, 0.5, 0.94, 0.94, radius);
          if (inBg) {
            bgHits += 1;
            // Border check (outer 3% rim)
            const inInner = inRoundRect(x, y, 0.5, 0.5, 0.90, 0.90, radius * 0.95);
            if (!inInner) borderHits += 1;
          }

          // Glyph coordinates scaled about centre
          const gx = (x - 0.5) / scale + 0.5;
          const gy = (y - 0.5) / scale + 0.5;

          if (inChevron(gx, gy)) {
            chevronHits += 1;
          } else if (inBarbell(gx, gy)) {
            barbellHits += 1;
          }
        }
      }

      const total = S * S;
      const bgA = bgHits / total;
      const borderA = borderHits / total;
      const barbellA = barbellHits / total;
      const chevronA = chevronHits / total;

      // Vertical background gradient
      const t = py / size;
      let r = lerp(COLOR_BG_START[0], COLOR_BG_END[0], t);
      let g = lerp(COLOR_BG_START[1], COLOR_BG_END[1], t);
      let b = lerp(COLOR_BG_START[2], COLOR_BG_END[2], t);

      // Composite emerald border
      if (borderA > 0) {
        const borderIntensity = 0.55 * borderA;
        r = lerp(r, COLOR_EMERALD[0], borderIntensity);
        g = lerp(g, COLOR_EMERALD[1], borderIntensity);
        b = lerp(b, COLOR_EMERALD[2], borderIntensity);
      }

      // Composite emerald barbell
      if (barbellA > 0) {
        r = lerp(r, COLOR_EMERALD[0], barbellA);
        g = lerp(g, COLOR_EMERALD[1], barbellA);
        b = lerp(b, COLOR_EMERALD[2], barbellA);
      }

      // Composite white peak chevron
      if (chevronA > 0) {
        r = lerp(r, COLOR_WHITE[0], chevronA);
        g = lerp(g, COLOR_WHITE[1], chevronA);
        b = lerp(b, COLOR_WHITE[2], chevronA);
      }

      const out = px * 4 + py * size * 4;
      buf[out] = Math.round(r);
      buf[out + 1] = Math.round(g);
      buf[out + 2] = Math.round(b);
      buf[out + 3] = Math.round(255 * bgA);
    }
  }
  return encodePng(size, size, buf);
}

const files = [
  ['icon-192.png', render(192, { rounded: true, padded: false })],
  ['icon-512.png', render(512, { rounded: true, padded: false })],
  ['icon-maskable-512.png', render(512, { rounded: false, padded: true })],
  ['apple-touch-icon.png', render(180, { rounded: false, padded: false })],
  ['favicon-32.png', render(32, { rounded: true, padded: false })],
];

for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data);
  console.log(`wrote public/${name}  ${(data.length / 1024).toFixed(1)} kB`);
}
