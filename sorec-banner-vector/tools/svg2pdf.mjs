// Prints an SVG to a vector PDF at its physical size: node svg2pdf.mjs in.svg out.pdf widthMM heightMM
import { createRequire } from "module";
import fs from "fs";
const { chromium } = createRequire("/home/user/remotion/package.json")("playwright");
const [svgPath, outPath, wmm, hmm] = process.argv.slice(2);
const svg = fs.readFileSync(svgPath, "utf8").replace(/width="[^"]*mm" height="[^"]*mm"/, `width="${wmm}mm" height="${hmm}mm"`);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const page = await browser.newPage();
await page.setContent(`<!doctype html><html><head><style>@page{size:${wmm}mm ${hmm}mm;margin:0}html,body{margin:0;padding:0}svg{display:block;width:${wmm}mm;height:${hmm}mm}</style></head><body>${svg}</body></html>`);
await page.waitForTimeout(500);
await page.pdf({ path: outPath, width: `${wmm}mm`, height: `${hmm}mm`, printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("wrote", outPath, fs.statSync(outPath).size, "bytes");
