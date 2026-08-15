(()=>{'use strict';
const link=document.createElement('link');link.rel='stylesheet';link.href='polish.css?v=8561758';document.head.appendChild(link);
const officialLogo=document.querySelector('.vlogo');if(officialLogo)officialLogo.src='assets/logo-vertical.svg?v=5075452';

// Official menu price reconciliation — source: approved Japanese master menu.
const fullMenuColumns=[
`<div class="col">
<div class="row"><b>究極の味噌ラーメン</b><span>¥1,100</span></div>
<div class="row"><b>塩・醤油ラーメン</b><span>各 ¥980</span></div>
<div class="row"><b>バターコーンラーメン</b><span>味噌 ¥1,400 / 塩・醤油 ¥1,300</span></div>
<div class="row"><b>チャーシュー麺</b><span>味噌 ¥1,450 / 醤油・塩 ¥1,350</span></div>
<div class="row"><b>ピリ辛ねぎラーメン</b><span>味噌 ¥1,300 / 醤油・塩 ¥1,180</span></div>
<div class="row"><b>ねぎたっぷりラーメン</b><span>味噌 ¥1,300 / 醤油・塩 ¥1,180</span></div>
<div class="row"><b>キムチラーメン</b><span>味噌 ¥1,250 / 醤油・塩 ¥1,130</span></div>
<div class="row"><b>つばさラーメン</b><span>¥2,000</span></div>
<div class="row"><b>究極の味噌＋ぎょうざセット</b><span>¥1,450 / 塩・醤油 ¥1,400</span></div>
<div class="row"><b>【期間限定】特製辛味噌ラーメン</b><span>¥1,200</span></div>
</div>`,
`<div class="col">
<div class="row"><b>チャーハン</b><span>¥800</span></div>
<div class="row"><b>餃子</b><span>¥500</span></div>
<div class="row"><b>トッピング：キムチ・わかめ・玉子</b><span>各 ¥150</span></div>
<div class="row"><b>トッピング：バター・コーン・ねぎ</b><span>各 ¥200</span></div>
<div class="row"><b>トッピング：ピリ辛ねぎ</b><span>¥200</span></div>
<div class="row"><b>トッピング：チャーシュー（3枚）</b><span>¥450</span></div>
<div class="row"><b>ハーフラーメン／味噌</b><span>¥700</span></div>
<div class="row"><b>ハーフラーメン／醤油・塩</b><span>¥650</span></div>
<div class="row"><b>ライス（大）</b><span>¥200</span></div>
<div class="row"><b>ライス（小）</b><span>¥150</span></div>
<div class="row"><b>生ビール（ジョッキ）</b><span>¥600</span></div>
<div class="row"><b>瓶ビール</b><span>¥700</span></div>
<div class="row"><b>ジュース（オレンジ・コーラ）</b><span>¥300</span></div>
<div class="row"><b>大盛り</b><span>各商品 ＋¥200</span></div>
</div>`
];
const tm=document.querySelector('.textmenu');if(tm)tm.innerHTML=fullMenuColumns.join('');
const mp=document.querySelector('.menuPanel');
if(mp){
 const h=mp.querySelector('h3');
 mp.innerHTML=(h?h.outerHTML:'<h3>味一番つばさ メニュー</h3>')+'<img id="masterMenuImage" class="masterMenuImage" src="assets/menu/menu-ja.svg" alt="味一番つばさ 日本語メニュー">'+fullMenuColumns.join('');
}
const menuImages={ja:['assets/menu/menu-ja.svg','味一番つばさ 日本語メニュー'],en:['assets/menu/menu-en.svg','AJIICHIBAN TSUBASA English Menu'],ko:['assets/menu/menu-ko.svg','아지이치방 츠바사 한국어 메뉴'],zh:['assets/menu/menu-zh.svg','味一番翼 中文菜单']};
function syncMenuImage(lang){const img=document.getElementById('masterMenuImage');const m=menuImages[lang]||menuImages.ja;if(img){img.src=m[0];img.alt=m[1];img.dataset.lang=lang;}}
document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>syncMenuImage(btn.dataset.lang)));
syncMenuImage('ja');

if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const c=document.getElementById('fluidFront');if(!c)return;const x=c.getContext('2d');if(!x)return;
let W=0,H=0,d=1,particles=[];function resize(){d=Math.min(devicePixelRatio||1,1.5);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',resize,{passive:true});
function spawn(){const mobile=W<700;const onMiso=scrollY>H*.72&&scrollY<H*2.15;if(!onMiso)return;const sx=mobile?W*.68:W*.70,sy=mobile?H*.55:H*.57;particles.push({x:sx+(Math.random()-.5)*(mobile?75:150),y:sy+Math.random()*35,r:18+Math.random()*34,a:.045+Math.random()*.05,vx:(Math.random()-.5)*.22,vy:-.28-Math.random()*.35,t:0,life:180+Math.random()*120})}
function frame(){x.clearRect(0,0,W,H);if(Math.random()<.42)spawn();for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.t++;p.x+=p.vx+Math.sin(p.t*.025+i)*.16;p.y+=p.vy;p.r+=.08;p.a*=.996;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,`rgba(245,240,232,${p.a})`);g.addColorStop(.45,`rgba(220,215,210,${p.a*.48})`);g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fill();if(p.t>p.life)particles.splice(i,1)}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();