const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const grid=$('#poemGrid');
const archive=$('#archive');
const moreBtn=$('#moreBtn');
const cursor=$('#cursorGlow');
let activePoem=null;

function faNum(n){return String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);}
function excerpt(text){return text.split(/\n\s*\n/).slice(0,2).join('\n');}
function makeCards(){
  POEMS.forEach((p,i)=>{
    const card=document.createElement('article');
    card.className='poem-card'+(i>8?' hidden-poem':'');
    card.dataset.index=i;
    card.innerHTML=`<span class="poem-index">${String(i+1).padStart(2,'0')}</span><h3>${p.title}</h3><p>${excerpt(p.full)}</p>`;
    card.addEventListener('click',()=>openPoem(i));
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*8).toFixed(2)}deg) rotateZ(${(x*1.8).toFixed(2)}deg) translateY(-12px) scale(1.025)`;
    });
    card.addEventListener('pointerleave',()=>card.style.transform='');
    grid.appendChild(card);
  });
}
makeCards();
moreBtn.addEventListener('click',()=>{archive.classList.add('expanded');$$('.hidden-poem').forEach((el,i)=>{el.style.display='block';el.style.animationDelay=`${i*55}ms`});moreBtn.remove();});

const quotes=[
 ['مهمان دلم باش ، دلم جای بدی نیست','این خانه به غیر از تو سرای احدی نیست'],
 ['خودت بهتر خبر داری که با قلبم چه‌ ها کردی','تو هرشب ذرّه‌ای از سینه‌ی من را جدا کردی'],
 ['سپاه فاتح چشمت، تصاحب کرده قلبم را','بدون جنگ و خونریزی، چه ساده کودتا کردی!'],
 ['در ذهن خود مشغول رزم و جنگ و پیکارم','در روز می‌خندم ولی شب گریه می‌بارم'],
 ['ما چله‌‌نشین شب تنهایی خویشیم!','ما معتکف کعبه‌ی یکتایی خویشیم!'],
 ['در میان واژگان بی شمار این زبان ،','هیچ یک قافیه‌ای بر عین و شین و قاف نیست'],
 ['کسی پرسید شاعر کیست؟ پاسخ دادم‌ش یعنی','خدا با بی‌قراری و جنون او را بنا کرده'],
 ['شعر تنها همنشین زخم های بی رفوست','بی تو هرشب کاغذی را غرق جوهر میکنم']
];
const quoteLines=$('#quoteLines'),quoteMeta=$('#quoteMeta'),quoteDots=$('#quoteDots');
let qi=0;
function renderQuote(n,animate=true){qi=(n+quotes.length)%quotes.length;quoteLines.style.opacity=animate?'0':'1';quoteLines.style.transform=animate?'translateY(8px)':'';setTimeout(()=>{quoteLines.innerHTML=`${quotes[qi][0]}\n${quotes[qi][1]}`;quoteMeta.textContent=`${faNum(qi+1)} / ${faNum(quotes.length)}`;quoteLines.style.transition='opacity .65s ease,transform .65s ease';quoteLines.style.opacity='1';quoteLines.style.transform='none';$$('#quoteDots button').forEach((b,i)=>b.classList.toggle('active',i===qi));},animate?180:0)}
quotes.forEach((_,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',`شاه‌بیت ${i+1}`);b.onclick=()=>renderQuote(i);quoteDots.appendChild(b)});
renderQuote(0,false);setInterval(()=>renderQuote(qi+1),10000);$('#quoteNext').onclick=()=>renderQuote(qi+1);

function openPoem(i){
  activePoem=i; const p=POEMS[i];
  $('#bookNumber').textContent=faNum(i+1); $('#bookTitle').textContent=p.title; $('#bookText').textContent=p.full;
  $('#copyStatus').textContent=''; $('#bookModal').classList.add('open'); $('#bookModal').setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  history.pushState({poem:i},'',`${location.pathname}${location.search}#poem-${String(i+1).padStart(2,'0')}`);
}
function closePoem(){ $('#bookModal').classList.remove('open'); $('#bookModal').setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
$('#closeBook').onclick=closePoem; $$('[data-close]').forEach(x=>x.onclick=closePoem); window.addEventListener('popstate',()=>{if(!location.hash.startsWith('#poem-'))closePoem()});
$('#copyPoem').onclick=async()=>{try{await navigator.clipboard.writeText(POEMS[activePoem].full);$('#copyStatus').textContent='کپی شد ✓';}catch{ $('#copyStatus').textContent='کپی خودکار در دسترس نیست؛ متن را انتخاب کنید.';}};
$('#sharePoem').onclick=async()=>{const url=location.href;if(navigator.share){try{await navigator.share({title:POEMS[activePoem].title,text:excerpt(POEMS[activePoem].full),url});}catch{}}else{try{await navigator.clipboard.writeText(url);$('#copyStatus').textContent='لینک شعر کپی شد ✓';}catch{}}};
function hashOpen(){const m=location.hash.match(/poem-(\d+)/);if(m){const i=Number(m[1])-1;if(i>=0&&i<POEMS.length)openPoem(i)}}
hashOpen();

// Reveal sections as they enter the viewport.
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>io.observe(el));

// Warm fingertip-sized halo cursor on desktop; no replacement cursor on touch.
window.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;cursor.style.opacity='1';cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});window.addEventListener('pointerleave',()=>cursor.style.opacity='0');

// Search
const searchModal=$('#searchModal'),searchInput=$('#searchInput'),results=$('#searchResults');
function showSearch(q=''){const needle=q.trim().toLowerCase();const found=needle?POEMS.map((p,i)=>({p,i})).filter(x=>(x.p.title+' '+x.p.full).toLowerCase().includes(needle)).slice(0,8):POEMS.slice(0,8).map((p,i)=>({p,i}));results.innerHTML=found.length?found.map(x=>`<div class="result" data-i="${x.i}"><strong>${x.p.title}</strong><br><small>${excerpt(x.p.full).replace(/\n/g,' — ')}</small></div>`).join(''):'<div class="result">چیزی پیدا نشد.</div>';$$('.result[data-i]').forEach(x=>x.onclick=()=>{searchModal.classList.remove('open');openPoem(Number(x.dataset.i))})}
$('#searchBtn').onclick=()=>{searchModal.classList.add('open');searchInput.focus();showSearch()};$('#closeSearch').onclick=()=>searchModal.classList.remove('open');$$('[data-search-close]').forEach(x=>x.onclick=()=>searchModal.classList.remove('open'));searchInput.addEventListener('input',e=>showSearch(e.target.value));

// Audio: six original/generated ambience loops. Browsers may block sound autoplay; we try, then offer one-tap start.
const tracks=[
 ['کتابخانه‌ی نیمه‌شب','assets/audio/library-midnight.wav'],
 ['قفسه‌های مه‌آلود','assets/audio/misty-shelves.wav'],
 ['شمع و کاغذ','assets/audio/candle-and-paper.wav'],
 ['راهروی خیال','assets/audio/fantasy-hall.wav'],
 ['چای نیمه‌شب','assets/audio/midnight-tea.wav'],
 ['قصه‌ی دور','assets/audio/distant-tale.wav']
];
const audio=$('#audio'),trackName=$('#trackName'),soundStatus=$('#soundStatus'),hint=$('#audioHint');let ti=0;
function loadTrack(i,play=false){ti=(i+tracks.length)%tracks.length;trackName.textContent=tracks[ti][0];audio.src=tracks[ti][1];audio.volume=Number($('#volume').value);if(play)audio.play().then(()=>{soundStatus.textContent='در حال پخش';hint.textContent='موسیقی به‌صورت خودکار میان قطعه‌ها جابه‌جا می‌شود.'}).catch(()=>{soundStatus.textContent='آماده‌ی پخش';hint.textContent='مرورگر پخش خودکار را بسته؛ روی ▶ بزن تا موسیقی آغاز شود.'})}
loadTrack(0,true);audio.addEventListener('ended',()=>loadTrack(ti+1,true));$('#playBtn').onclick=()=>{if(audio.paused){audio.play();soundStatus.textContent='در حال پخش'}else{audio.pause();soundStatus.textContent='مکث'}};$('#prevTrack').onclick=()=>loadTrack(ti-1,true);$('#nextTrack').onclick=()=>loadTrack(ti+1,true);$('#volume').oninput=e=>audio.volume=Number(e.target.value);
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{if(audio.paused && audio.currentTime===0)audio.play().catch(()=>{})},{once:true,passive:true}));
