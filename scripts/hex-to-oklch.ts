#!/usr/bin/env bun
// Rewrites every hex color in the given files to oklch(), in place.
// Usage: bun scripts/hex-to-oklch.ts src/app.css

const lin = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

/** #rgb / #rrggbb -> oklch() string. Alpha hex is not handled. */
export function hexToOklch(hex: string): string {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) =>
    lin(Number.parseInt(full.slice(i, i + 2), 16) / 255),
  );

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.hypot(A, B);
  const H = C < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  const n = (x: number, d = 3) => +x.toFixed(d);
  return `oklch(${n(L)} ${n(C)} ${n(H)})`;
}

if (import.meta.main) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("usage: bun scripts/hex-to-oklch.ts <file...>");
    process.exit(1);
  }
  for (const file of files) {
    const src = await Bun.file(file).text();
    let count = 0;
    const out = src.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (m) => {
      count++;
      return hexToOklch(m);
    });
    await Bun.write(file, out);
    console.log(`${file}: ${count} colors converted`);
  }
}
