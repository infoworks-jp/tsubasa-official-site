import { chromium } from 'playwright';
import fs from 'node:fs';
const URL='https://infoworks-jp.github.io/tsubasa-official-site/';
const EXPECTED=['id="fluidBack"','data-lang="zh"','究極の味噌ラーメン','特製<br>辛味噌ラーメン'];
const OUT='verification-artifacts';
fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let deployed=false;
for(let i=0;i<36;i++){
  try{
    const r=await fetch(URL+'?deploy='+Date.now(),{cache:'no-store'}); const h=await r.text();
    if(r.ok&&EXPECTED.every(x=>h.includes(x))){deployed=true;break;}
  }catch{}
  await sleep(5000);
}
if(!deployed) throw Error('deploy timeout');
const browser=await chromium.launch({headless:true});
const errors=[];
async function shot(width,height,name){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'});
  const page=await ctx.newPage();
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('pageerror',e=>errors.push(String(e)));
  const responses=[]; page.on('response',r=>{if(r.status()>=400)responses.push(`${r.status()} ${r.url()}`)});
  await page.goto(URL+'?verify='+Date.now(),{waitUntil:'networkidle',timeout:90000});
  await page.waitForTimeout(1800);
  const state=await page.evaluate(()=>({
    title:document.title,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,
    back:!!document.querySelector('#fluidBack'),front:!!document.querySelector('#fluidFront'),
    langs:[...document.querySelectorAll('.langs button')].map(x=>x.textContent.trim()),
    images:[...document.images].map(i=>({src:i.currentSrc||i.src,ok:i.complete&&i.naturalWidth>0}))
  }));
  await page.screenshot({path:`${OUT}/${name}.png`,fullPage:true});
  fs.writeFileSync(`${OUT}/${name}.json`,JSON.stringify({...state,responses},null,2));
  await ctx.close(); return {...state,responses};
}
const desktop=await shot(1440,1000,'desktop-1440');
const mobile=await shot(390,844,'mobile-390');
const pass=!desktop.overflow&&!mobile.overflow&&desktop.back&&desktop.front&&mobile.back&&mobile.front&&desktop.langs.length===4&&mobile.langs.length===4&&desktop.images.every(x=>x.ok)&&mobile.images.every(x=>x.ok)&&!desktop.responses.length&&!mobile.responses.length&&!errors.length;
fs.writeFileSync(`${OUT}/verification.json`,JSON.stringify({pass,errors,desktop,mobile},null,2));
await browser.close();
if(!pass) process.exit(1);
