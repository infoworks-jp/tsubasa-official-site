import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const URL = 'https://infoworks-jp.github.io/tsubasa-official-site/';
const OUT = 'verification-artifacts';
fs.mkdirSync(OUT, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForDeploy() {
  let last = '';
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(URL, { cache: 'no-store' });
      last = await res.text();
      if (res.ok && last.includes('steam-photo.js?v=steam-v5-cfd24f4')) return last;
    } catch {}
    await sleep(10000);
  }
  throw new Error('Latest GitHub Pages deployment was not observable within 5 minutes');
}

function hash(dataUrl) {
  return crypto.createHash('sha256').update(dataUrl).digest('hex');
}

await waitForDeploy();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: 'no-preference'
});
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', err => pageErrors.push(String(err)));

await page.goto(URL + '?verify=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForSelector('canvas.steam-photo[data-engine="TSUBASA_STEAM_V5"]', { timeout: 30000 });
await page.waitForTimeout(1200);

async function sample(tag) {
  const result = await page.evaluate(() => {
    const c = document.querySelector('canvas.steam-photo');
    if (!c || !c.width || !c.height) return null;
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let alphaPixels = 0;
    let alphaSum = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 2) alphaPixels++;
      alphaSum += data[i];
    }
    return {
      width: c.width,
      height: c.height,
      alphaPixels,
      alphaSum,
      url: c.toDataURL('image/png')
    };
  });
  if (!result) throw new Error('Steam canvas missing or zero-sized');
  const file = `${OUT}/${tag}.png`;
  fs.writeFileSync(file, Buffer.from(result.url.split(',')[1], 'base64'));
  return { ...result, url: undefined, hash: hash(result.url), file };
}

const a = await sample('steam-t1');
await page.screenshot({ path: `${OUT}/page-t1.png`, fullPage: false });
await page.waitForTimeout(2500);
const b = await sample('steam-t2');
await page.screenshot({ path: `${OUT}/page-t2.png`, fullPage: false });

const moved = a.hash !== b.hash;
const visible = a.alphaPixels > 500 && b.alphaPixels > 500;
const cleanRuntime = consoleErrors.length === 0 && pageErrors.length === 0;
const pass = moved && visible && cleanRuntime;

const report = {
  url: URL,
  engine: 'TSUBASA_STEAM_V5',
  viewport: '390x844@2x',
  first: a,
  second: b,
  moved,
  visible,
  consoleErrors,
  pageErrors,
  pass,
  checkedAt: new Date().toISOString()
};
fs.writeFileSync(`${OUT}/verification.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
if (!pass) process.exit(1);
