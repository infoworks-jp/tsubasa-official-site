import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
const URL='https://infoworks-jp.github.io/tsubasa-official-site/';
const EXPECTED=['@keyframes logoMaterialize','@keyframes neonPulse','assets/susukino-top-20260816.png'];
const OUT='verification-artifacts';
fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let deployed=false;
for(let i=0;i<12;i++){
  try{
    const r=await fetch(URL+'?deploy='+Date.now(),{cache:'no-store',signal:AbortSignal.timeout(10000)}); const h=await r.text();
    if(r.ok&&EXPECTED.every(x=>h.includes(x))){deployed=true;break;}
  }catch{}
  await sleep(5000);
}
if(!deployed) throw Error('deploy timeout: expected public hero asset/code not visible within 60 seconds');
const browser=await chromium.launch({headless:true});
const errors=[];
async function pixelDiff(a,b){const A=await sharp(a).removeAlpha().raw().toBuffer({resolveWithObject:true});const B=await sharp(b).removeAlpha().raw().toBuffer({resolveWithObject:true});if(A.info.width!==B.info.width||A.info.height!==B.info.height)return{ratio:1,changed:-1};let changed=0,total=A.data.length/3;for(let i=0;i<A.data.length;i+=3){const d=Math.abs(A.data[i]-B.data[i])+Math.abs(A.data[i+1]-B.data[i+1])+Math.abs(A.data[i+2]-B.data[i+2]);if(d>18)changed++;}return{ratio:changed/total,changed,total};}
async function heroShot(width,height,name){const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'no-preference'});const page=await ctx.newPage();page.on('console',m=>{if(m.type()==='error')errors.push(`${name}: ${m.text()}`)});page.on('pageerror',e=>errors.push(`${name}: ${String(e)}`));const responses=[];page.on('response',r=>{if(r.status()>=400)responses.push(`${r.status()} ${r.url()}`)});await page.goto(URL+'?verify='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('.origin .vlogo',{state:'attached',timeout:10000});const start=Date.now(),times=[0,1000,3000,5000],states=[],files=[];for(const t of times){const elapsed=Date.now()-start;if(elapsed<t)await page.waitForTimeout(t-elapsed);const s=await page.evaluate(()=>{const logo=document.querySelector('.origin .vlogo'),bg=document.querySelector('.origin .bg'),before=getComputedStyle(document.querySelector('.origin'),'::before'),ls=getComputedStyle(logo),bs=getComputedStyle(bg);return{logoOpacity:parseFloat(ls.opacity),logoFilter:ls.filter,logoTransform:ls.transform,logoAnimations:logo.getAnimations().map(a=>({currentTime:a.currentTime,playState:a.playState})),bgFilter:bs.filter,neonOpacity:parseFloat(before.opacity),scrollY:scrollY};});const file=`${OUT}/${name}-hero-${t/1000}s.png`;await page.screenshot({path:file,fullPage:false});states.push({t,...s});files.push(file);}const diffs={d0_1:await pixelDiff(files[0],files[1]),d1_3:await pixelDiff(files[1],files[2]),d3_5:await pixelDiff(files[2],files[3])};const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,images:[...document.images].map(i=>({src:i.currentSrc||i.src,ok:i.complete&&i.naturalWidth>0}))}));const logoReveal=states[0].logoOpacity<0.12&&states[1].logoOpacity>states[0].logoOpacity&&states[3].logoOpacity>states[1].logoOpacity&&states[3].logoOpacity>0.85;const heroChanges=diffs.d0_1.ratio>0.0005&&diffs.d1_3.ratio>0.0005&&diffs.d3_5.ratio>0.0001;const neonAnimated=states.some((s,i)=>i&&Math.abs(s.neonOpacity-states[i-1].neonOpacity)>0.01);const result={...state,responses,states,diffs,logoReveal,heroChanges,neonAnimated};fs.writeFileSync(`${OUT}/${name}-hero.json`,JSON.stringify(result,null,2));await ctx.close();return result;}
try{const desktop=await heroShot(1440,1000,'desktop-1440');const mobile=await heroShot(390,844,'mobile-390');const pass=!desktop.overflow&&!mobile.overflow&&desktop.images.every(x=>x.ok)&&mobile.images.every(x=>x.ok)&&desktop.logoReveal&&mobile.logoReveal&&desktop.heroChanges&&mobile.heroChanges&&desktop.neonAnimated&&mobile.neonAnimated&&!desktop.responses.length&&!mobile.responses.length&&!errors.length;fs.writeFileSync(`${OUT}/verification.json`,JSON.stringify({pass,errors,desktop,mobile},null,2));if(!pass)process.exitCode=1;}finally{await browser.close();}
