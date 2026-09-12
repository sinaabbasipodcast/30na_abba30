(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const data=window.poems||[];
const initial=12; let shown=Math.min(initial,data.length); let current=0, verseIndex=0;
const selected=[
 ["ای ماهیِ بیچاره که خوشحالی و سرمست\nآنچه بغلت کرده به تنگی، نخِ تور است",17],
 ["خودت بهتر خبر داری که با قلبم چه‌ها کردی\nتو هرشب ذرّه‌ای از سینه‌ی من را جدا کردی",3],
 ["مهمان دلم شو که ببینی پرِ خون است!\nبعد از تو تمام غزل‌م وصف جنون است!",2],
 ["دچار شرم واژه‌ام و اهل عشق بی‌صدا\nکم از سکوت عاشقانه‌ی دلم چشیده‌ای؟",1],
 ["شاعران وارث آب و خرد و روشنی‌اند",1]
];
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function renderPoems(){
 const grid=$('#poemGrid'); grid.innerHTML=''; data.slice(0,shown).forEach((p,i)=>{
   const card=document.createElement('article'); card.className='poemCard reveal'; card.dataset.index=i;
   const ex=(p.excerpt||p.full||'').split('\n').filter(Boolean).slice(0,2).join('\n');
   card.innerHTML=`<div class="paperNumber">${String(i+1).padStart(2,'0')}</div><div class="paperTitle">${escapeHtml(p.title)}</div><div class="paperExcerpt">${escapeHtml(ex)}</div><div class="paperFooter"><span>غزل ${i+1}</span><b>خواندن ↗</b></div>`;
   card.onclick=()=>openReader(i); grid.appendChild(card);
 }); observe(); $('#morePoems').style.display=shown>=data.length?'none':'inline-flex';
}
$('#morePoems').onclick=()=>{shown=Math.min(shown+12,data.length);renderPoems()};
function openReader(i){current=(i+data.length)%data.length;const p=data[current];$('#readerTitle').textContent=p.title;$('#readerText').textContent=p.full||p.excerpt||'';$('#readerIndex').textContent=`غزل ${current+1}`;$('#readerEyebrow').textContent='غزل';$('#reader').classList.add('open');document.body.classList.add('modalOpen');}
$('#closeReader').onclick=()=>{$('#reader').classList.remove('open');document.body.classList.remove('modalOpen')};
$('#readerPrev').onclick=()=>openReader(current-1); $('#readerNext').onclick=()=>openReader(current+1);
$('#reader').addEventListener('click',e=>{if(e.target.id==='reader'){$('#closeReader').click()}});
function renderVerse(){const v=selected[verseIndex];$('#verseText').textContent=v[0];$('#verseMeta').textContent=`غزل ${v[1]}`;$('#verseOpen').onclick=()=>openReader(v[1]-1);}
$('#prevVerse').onclick=()=>{verseIndex=(verseIndex-1+selected.length)%selected.length;renderVerse()};$('#nextVerse').onclick=()=>{verseIndex=(verseIndex+1)%selected.length;renderVerse()};setInterval(()=>{verseIndex=(verseIndex+1)%selected.length;renderVerse()},10000);renderVerse();
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12}); function observe(){$$('.reveal:not(.visible)').forEach(x=>obs.observe(x))} observe();
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});function cursor(){cx+=(mx-cx)*.12;cy+=(my-cy)*.12;$('#cursorLight').style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(cursor)}cursor();
function clock(){const now=new Date();$('#heroTime').textContent=new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(now);$('#heroDate').textContent=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(now)}clock();setInterval(clock,1000);
const thoughts=['بنویسید بچه‌ها! کم‌رنگ‌ترین جوهرها از قوی‌ترین حافظه‌ها ماندگارترند.','آدمی‌زاد به دغدغه زنده است! اصلاً فرق آدم و گاو همین است.','بی‌حساب و کتاب، کتاب بخوانید!','یا در حد تلاشت آرزو کن یا در حد آرزوهایت تلاش کن.','شاعران وارث آب و خرد و روشنی‌اند!','قلم توتم من، توتم ما، توتم قبیله‌ی ماست!','و من بنده‌ی خدایی هستم که به قلم قسم می‌خورد.'];let ti=0;setInterval(()=>{$('#thought').classList.add('fadeOut');setTimeout(()=>{$('#thought').textContent=thoughts[ti=(ti+1)%thoughts.length];$('#thought').classList.remove('fadeOut')},350)},6500);
let phase=0;function windowCycle(){phase=(phase+1)%4;const labels=['باران','نیمه‌روشن','شب','سپیده'];document.body.dataset.phase=phase;$('#weatherText').textContent=labels[phase];}setInterval(windowCycle,9000);
let lamp=0;$('#ambient').addEventListener('click',()=>{});const lampEl=document.createElement('button');lampEl.className='floatingLamp';lampEl.setAttribute('aria-label','چراغ');lampEl.innerHTML='✦';document.body.appendChild(lampEl);lampEl.onclick=()=>{lamp=1-lamp;document.body.classList.toggle('bright',!!lamp)};
$('#searchBtn').onclick=()=>{$('#searchPanel').classList.add('open');$('#searchInput').focus()};$('#closeSearch').onclick=()=>$('#searchPanel').classList.remove('open');
$('#searchInput').addEventListener('input',e=>{const q=e.target.value.trim();const box=$('#searchResults');box.innerHTML='';if(!q)return;data.forEach((p,i)=>{if((p.title+' '+(p.full||'')).includes(q)){const r=document.createElement('div');r.className='result';r.textContent=p.title;r.onclick=()=>{$('#searchPanel').classList.remove('open');openReader(i)};box.appendChild(r)}})});
let audio=null,gain=null,playing=false,muted=false,track=0,timer=null;const tracks=['شبِ کتابخانه · بی‌کلام I','شبِ کتابخانه · بی‌کلام II','شبِ کتابخانه · بی‌کلام III'];
function audioStart(){if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();gain=audio.createGain();gain.gain.value=.48;gain.connect(audio.destination)} if(audio.state==='suspended')audio.resume();if(playing)return;playing=true;$('#playTrack').textContent='Ⅱ';$('.record').style.animationPlayState='running';playPattern();}
function playPattern(){if(timer)clearInterval(timer);const notes=[[196,246.94,293.66],[174.61,220,261.63],[146.83,196,246.94]][track];let t=audio.currentTime+.03;for(let i=0;i<32;i++){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=notes[i%3];g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+2.4);o.connect(g);g.connect(gain);o.start(t);o.stop(t+2.45);t+=2.5}timer=setTimeout(()=>{track=(track+1)%tracks.length;$('#trackName').textContent=tracks[track];if(playing)playPattern()},80000)}
function stopAudio(){playing=false;if(timer)clearTimeout(timer);$('.record').style.animationPlayState='paused';$('#playTrack').textContent='▶'}
$('#playTrack').onclick=()=>playing?stopAudio():audioStart();$('#nextTrack').onclick=()=>{track=(track+1)%tracks.length;$('#trackName').textContent=tracks[track];if(playing)playPattern();else audioStart()};$('#prevTrack').onclick=()=>{track=(track-1+tracks.length)%tracks.length;$('#trackName').textContent=tracks[track];if(playing)playPattern();else audioStart()};$('#muteTrack').onclick=()=>{muted=!muted;if(gain)gain.gain.value=muted?0:Number($('#volume').value);$('#muteTrack').textContent=muted?'○':'◖'};$('#volume').oninput=e=>{if(gain&&!muted)gain.gain.value=Number(e.target.value)};
window.addEventListener('load',()=>{setTimeout(()=>{try{audioStart()}catch(e){}},700)});['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{if(!playing)try{audioStart()}catch(e){}},{once:true}));
$('#readingDemo').onclick=()=>{try{audioStart();document.querySelector('#reading').scrollIntoView({behavior:'smooth'})}catch(e){}};
})();
