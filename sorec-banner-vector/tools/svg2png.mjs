// Renders SVG files to PNG with Chromium: node svg2png.mjs width out.png in.svg [in2.svg ...] (one png per svg, suffix -N)
import { createRequire } from "module";
const { chromium } = createRequire("/home/user/remotion/package.json")("playwright");
import fs from "fs";
import path from "path";
const [width, outBase, ...svgs] = process.argv.slice(2);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const page = await browser.newPage();
for (let i = 0; i < svgs.length; i++) {
  const svg = fs.readFileSync(svgs[i], "utf8");
  const m = svg.match(/viewBox="([\d.\s-]+)"/) || svg.match(/width="([\d.]+)"\s+height="([\d.]+)"/);
  let w = 1000, h = 1000;
  if (m && m[2] !== undefined && !svg.match(/viewBox=/)) { w = Number(m[1]); h = Number(m[2]); }
  else if (m) { const v = m[1].trim().split(/[\s,]+/).map(Number); w = v[2]; h = v[3]; }
  const W = Number(width), H = Math.round((h / w) * W);
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(`<html><body style="margin:0;background:#888"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}" style="width:${W}px;height:${H}px;display:block"></body></html>`);
  await page.waitForTimeout(300);
  const out = svgs.length === 1 ? outBase : outBase.replace(/\.png$/, `-${i}.png`);
  await page.screenshot({ path: out });
  console.log("wrote", out, W, H);
}
await browser.close();
