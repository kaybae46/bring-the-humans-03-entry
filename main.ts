// bring-the-humans-03 entry program (Node 24, standard library only).
// The video itself is the entry; this program only hands the house the
// video's address. It copies VIDEO.json from the bot directory into the
// output directory, where the gate reads it. Nothing else is written.

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "VIDEO.json");
const target = join(outDir, "VIDEO.json");

const tiktokVideo = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

mkdirSync(outDir, { recursive: true });

try {
  const parsed = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
  if (typeof parsed.url !== "string" || !tiktokVideo.test(parsed.url)) {
    throw new Error(`VIDEO.json does not name a TikTok video URL: ${JSON.stringify(parsed.url)}`);
  }
  copyFileSync(source, target);
} catch (error) {
  console.error(`could not hand over VIDEO.json from ${source}: ${(error as Error).message}`);
  process.exitCode = 1;
}
