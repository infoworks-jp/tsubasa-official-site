(()=>{'use strict';
const link=document.createElement('link');link.rel='stylesheet';link.href='polish.css?v=8561758';document.head.appendChild(link);

// Official vertical logo, rasterized directly from the approved PDF with transparency preserved.
const officialLogo=document.querySelector('.vlogo');
if(officialLogo){
  officialLogo.src='data:image/png;base64,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';
  officialLogo.style.display='block';
}

// Mobile QA hardening: never allow menu rows, media or decorative layers to widen the page.
const qaStyle=document.createElement('style');
qaStyle.textContent=`
html,body{width:100%;max-width:100%;overflow-x:hidden}
main,footer,.scene,.section,.limited,.menus,.menuPanel,.textmenu,.col,.grid,.triptych,.access{min-width:0;max-width:100%}
img,object,svg,canvas{max-width:100%}
.masterMenuImage{display:block;width:100%;max-width:100%;height:auto}
.row{min-width:0;flex-wrap:wrap}
.row b{min-width:0;overflow-wrap:anywhere}
.row span{max-width:100%;white-space:normal;text-align:right;overflow-wrap:anywhere}
.marquee{width:100%;max-width:100vw}
@media(max-width:820px){
  .menuPanel,.menus,.section{width:100%;max-width:100%}
  .menuPanel{overflow:hidden}
  .textmenu{width:100%}
  .col{width:100%}
  footer{max-width:100vw;overflow:hidden}
}
`;
document.head.appendChild(qaStyle);

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