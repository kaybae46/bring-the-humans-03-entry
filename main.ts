// bring-the-humans-03 entrypoint (Node 24, standard library only).
//
// The TikTok video is the entry. This program hands its address to the
// house: it reads VIDEO.json out of the bot directory, checks the address
// inside it really is a TikTok video URL, and copies the file into the
// output directory where the gate reads it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TIKTOK_VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/[0-9]+$/;

function die(message: string): never {
  console.error(`bring-the-humans-03: ${message}`);
  process.exit(1);
}

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const sourcePath = join(botDir, "VIDEO.json");
const targetPath = join(outDir, "VIDEO.json");

let text: string;
try {
  text = readFileSync(sourcePath, "utf8");
} catch {
  die(`cannot read ${sourcePath}`);
}

let url: unknown;
try {
  url = (JSON.parse(text) as { url?: unknown }).url;
} catch {
  die(`${sourcePath} is not valid JSON`);
}

if (typeof url !== "string" || !TIKTOK_VIDEO_URL.test(url)) {
  die(`${sourcePath} does not name a TikTok video URL (got ${JSON.stringify(url)})`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(targetPath, text);

// Read the copy back and make sure it matches the source byte-for-byte;
// a corrupt handover must fail loudly here instead of reaching the gate.
const copied = readFileSync(targetPath, "utf8");
if (copied !== text) {
  die(`copied VIDEO.json at ${targetPath} does not match ${sourcePath}`);
}
