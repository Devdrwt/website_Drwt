#!/usr/bin/env node
/**
 * Downloads the hero background videos from Pexels into /public/videos/.
 * Source credits :
 *   - hero-portrait.mp4 : Darlene Alderson — https://www.pexels.com/video/4359114/
 *   - hero-circuit.mp4  : Pexels         — https://www.pexels.com/video/11041433/
 *   - hero-cpu.mp4      : Pexels         — https://www.pexels.com/video/7140928/
 *
 * Pexels content is free to use under the Pexels License.
 * Run with : `node scripts/download-videos.mjs` or `npm run videos:fetch`
 */

import { createWriteStream, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT  = resolve(ROOT, "public", "videos");

const videos = [
  {
    name: "hero-portrait.mp4",
    url:  "https://videos.pexels.com/video-files/4359114/4359114-hd_1080_1920_25fps.mp4",
  },
  {
    name: "hero-circuit.mp4",
    url:  "https://videos.pexels.com/video-files/11041433/11041433-hd_1920_1080_30fps.mp4",
  },
  {
    name: "hero-cpu.mp4",
    url:  "https://www.pexels.com/download/video/7140928/",
  },
];

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

async function download({ name, url }) {
  const target = resolve(OUT, name);
  if (existsSync(target)) {
    const mb = (statSync(target).size / (1024 * 1024)).toFixed(1);
    console.log(`  ✓ ${name} déjà présent (${mb} Mo) — skip`);
    return;
  }
  process.stdout.write(`  ⇣ ${name} ...`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`HTTP ${res.status} en téléchargeant ${url}`);
  }
  await pipeline(res.body, createWriteStream(target));
  const mb = (statSync(target).size / (1024 * 1024)).toFixed(1);
  process.stdout.write(`  OK (${mb} Mo)\n`);
}

console.log(`🎬 Téléchargement des vidéos hero vers ${OUT}\n`);
for (const v of videos) {
  try {
    await download(v);
  } catch (e) {
    console.error(`  ✗ ${v.name} : ${e.message}`);
    process.exitCode = 1;
  }
}
console.log("\n✅ Terminé.");
