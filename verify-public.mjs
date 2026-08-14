import { chromium } from 'playwright';
import fs from 'node:fs';
import crypto from 'node:crypto';

const URL = 'https://infoworks-jp.github.io/tsubasa-official-site/';
const EXPECTED = 'steam-photo.js?v=steam-v6-f93fef4';
const OUT = 'verification-artifacts';
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForDeploy() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(URL + '?deploy=' + Date.now(), { cache: 'no-store' });
      const html = await res.text();
      if (res.ok && html.includes(EXPECTED)) return;
    } catch {}
    await sleep(5000);
  }
  throw new Error('Latest GitHub Pages deployment was not observable within 5 minutes');
}
function hash(dataUrl) { return crypto.createHash('sha256').update(dataUrl).digest('hex'); }

await waitForDeploy();
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, reducedMotion:'no-preference' });
const page = await context.newPage();
const consoleErrors=[]; const pageErrors=[];
page.on('console',m=>{if(m.type()==='error') consoleErrors.push(m.text())});
page.on('pageerror',e=>pageErrors.push(String(e)));
await page.goto(URL+'?verify='+Date.now(),{waitUntil:'networkidle',timeout:90000});
await page.waitForSelector('canvas.steam-photo[data-engine="TSUBASA_STEAM_V6"]',{timeout:30000});
await page.waitForTimeout(1500);

const ramenStability = await page.evaluate(async()=>{
  const img=document.querySelector('.ramen');
  const a=img.getBoundingClientRect();
  const s1=getComputedStyle(img).transform;
  await new Promise(r=>setTimeout(r,1800));
  const b=img.getBoundingClientRect();
  const s2=getComputedStyle(img).transform;
  return {delta:Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.width-b.width)+Math.abs(a.height-b.height), transformStable:s1===s2};
});

async function sample(tag){
 const r=await page.evaluate(()=>{const c=document.querySelector('canvas.steam-photo');if(!c||!c.width||!c.height)return null;const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height).data;let n=0,sum=0;for(let i=3;i<d.length;i+=4){if(d[i]>2)n++;sum+=d[i]}return{width:c.width,height:c.height,alphaPixels:n,alphaSum:sum,url:c.toDataURL('image/png')}});
 if(!r)throw new Error('Steam canvas missing or zero-sized');
 fs.writeFileSync(`${OUT}/${tag}.png`,Buffer.from(r.url.split(',')[1],'base64'));
 return {...r,url:undefined,hash:hash(r.url)};
}
const a=await sample('steam-t1');
await page.screenshot({path:`${OUT}/mobile-t1.png`,fullPage:false});
await page.waitForTimeout(2500);
const b=await sample('steam-t2');
await page.screenshot({path:`${OUT}/mobile-t2.png`,fullPage:false});
const moved=a.hash!==b.hash;
const visible=a.alphaPixels>150 && b.alphaPixels>150;
const photoStable=ramenStability.delta<0.5 && ramenStability.transformStable;
const cleanRuntime=consoleErrors.length===0&&pageErrors.length===0;

const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
await desktop.goto(URL+'?desktop='+Date.now(),{waitUntil:'networkidle',timeout:90000});
await desktop.waitForTimeout(1500);
await desktop.screenshot({path:`${OUT}/desktop.png`,fullPage:false});
const overflow=await desktop.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
await desktop.close();
const pass=moved&&visible&&photoStable&&cleanRuntime&&!overflow;
const report={url:URL,expected:EXPECTED,engine:'TSUBASA_STEAM_V6',moved,visible,photoStable,ramenStability,cleanRuntime,overflow,consoleErrors,pageErrors,first:a,second:b,pass,checkedAt:new Date().toISOString()};
fs.writeFileSync(`${OUT}/verification.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(!pass)process.exit(1);
