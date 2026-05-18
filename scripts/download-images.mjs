#!/usr/bin/env node
/**
 * Downloads the hero background photos from Unsplash into /public/images/heroes/.
 *
 * Credits — Unsplash (free for commercial use under the Unsplash License,
 * premium photos under Unsplash+).
 *
 *   /about     — AI 3D concept                — lZqmEhe2if4
 *   /services  — Java code on monitor          — OqtafYT5kTw
 *   /portfolio — Digital code abstract         — KDMsC1xglWs
 *   /team      — Woman with Surface laptop     — glRqyWJgUeY
 *   /careers   — B&W keyboard                  — pfR18JNEMv8
 *   /contact   — Earth tech connection         — m2pxgGc1Yas
 *
 * Run with : `node scripts/download-images.mjs` or `npm run images:fetch`
 */

import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT  = resolve(ROOT, "public", "images", "heroes");

const images = [
  { name: "hero-services.jpg", url: "https://unsplash.com/photos/OqtafYT5kTw/download?force=true&w=2400" },
  { name: "hero-team.jpg",     url: "https://unsplash.com/photos/glRqyWJgUeY/download?force=true&w=2400" },
  { name: "hero-careers.jpg",  url: "https://unsplash.com/photos/pfR18JNEMv8/download?force=true&w=2400" },
  { name: "hero-about.jpg",     url: "https://plus.unsplash.com/premium_photo-1683120966127-14162cdd0935?fm=jpg&q=70&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "hero-portfolio.jpg", url: "https://plus.unsplash.com/premium_photo-1661963874418-df1110ee39c1?fm=jpg&q=70&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0" },
  { name: "hero-contact.jpg",   url: "https://plus.unsplash.com/premium_photo-1661878265739-da90bc1af051?fm=jpg&q=70&w=2400&auto=format&fit=crop&ixlib=rb-4.1.0" },
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

async function download({ name, url }) {
  const target = resolve(OUT, name);
  if (existsSync(target) && statSync(target).size > 50 * 1024) {
    const mb = (statSync(target).size / (1024 * 1024)).toFixed(2);
    console.log(`  ✓ ${name} déjà présent (${mb} Mo) — skip`);
    return;
  }
  process.stdout.write(`  ⇣ ${name} ...`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} en téléchargeant ${url}`);
  }
  await pipeline(res.body, createWriteStream(target));
  const mb = (statSync(target).size / (1024 * 1024)).toFixed(2);
  process.stdout.write(`  OK (${mb} Mo)\n`);
}

console.log(`🖼️  Téléchargement des images hero vers ${OUT}\n`);
for (const img of images) {
  try {
    await download(img);
  } catch (e) {
    console.error(`  ✗ ${img.name} : ${e.message}`);
    process.exitCode = 1;
  }
}
console.log("\n✅ Terminé.");
