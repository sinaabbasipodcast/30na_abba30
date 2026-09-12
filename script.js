
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const paperGrid=$("#paperGrid"), moreBtn=$("#moreBtn"), reader=$("#reader"), searchPanel=$("#searchPanel");
let visibleCount=9, current=0, bestIndex=0;

function persianNum(n){return String(n).replace(/\d/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d])}
function renderPapers(){
  paperGrid.innerHTML="";
  poems.forEach((p,i)=>{
    const el=document.createElement("article");
    el.className="paper reveal"+(i>=visibleCount?" hidden":"");
    el.style.setProperty("--r", `${[-1.2,.8,-.5,.9,-.7,.4][i%6]}deg`);
    el.innerHTML=`<div class="paperTitle">${shortTitles[i]}</div><div class="paperExcerpt">${escapeHtml(p.excerpt||"").replace(/\n/g,"<br>")}</div><div class="paperNo">${persianNum(i+1)}</div>`;
    el.addEventListener("click",()=>openPoem(i));
    paperGrid.appendChild(el);
    setTimeout(()=>reveal(el),40+i*35);
  });
  moreBtn.style.display=visibleCount>=poems.length?"none":"block";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function reveal(el){requestAnimationFrame(()=>el.classList.add("visible"))}
moreBtn.onclick=()=>{visibleCount=poems.length;renderPapers()};

function openPoem(i){
  current=(i+poems.length)%poems.length;
  const p=poems[current];
  $("#readerTitle").textContent=shortTitles[current];
  $("#readerText").textContent=p.full||"";
  $("#readerNo").textContent=`/ ${persianNum(current+1)}`;
  reader.classList.add("open");reader.setAttribute("aria-hidden","false");
  history.replaceState(null,"",`#poem-${current+1}`);
}
function closeReader(){reader.classList.remove("open");reader.setAttribute("aria-hidden","true");}
$("#readerClose").onclick=closeReader;
$("#prevPoem").onclick=()=>openPoem(current-1);
$("#nextPoem").onclick=()=>openPoem(current+1);
$("#copyPoem").onclick=async()=>{
  try{await navigator.clipboard.writeText(poems[current].full);toast("شعر کپی شد");}catch{toast("کپی خودکار ممکن نیست؛ متن را انتخاب کن.");}
};
$("#sharePoem").onclick=async()=>{
  const url=location.href.split("#")[0]+`#poem-${current+1}`;
  if(navigator.share){try{await navigator.share({title:shortTitles[current],text:poems[current].excerpt,url})}catch{}}
  else {await navigator.clipboard.writeText(url);toast("لینک شعر کپی شد");}
};

const bestLines=[
  poems[1]?.excerpt, poems[4]?.excerpt, poems[0]?.excerpt, poems[11]?.excerpt,
  poems[13]?.excerpt, poems[17]?.excerpt, poems[20]?.excerpt
].filter(Boolean);
function renderBest(){
  $("#bestNo").textContent=persianNum(bestIndex+1);
  const box=$("#bestPoem");box.classList.remove("in");void box.offsetWidth;
  box.textContent=bestLines[bestIndex];box.classList.add("in");
}
$("#bestPrev").onclick=()=>{bestIndex=(bestIndex-1+bestLines.length)%bestLines.length;renderBest()};
$("#bestNext").onclick=()=>{bestIndex=(bestIndex+1)%bestLines.length;renderBest()};
renderBest();setInterval(()=>{bestIndex=(bestIndex+1)%bestLines.length;renderBest()},10000);

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(e=>io.observe(e));

const cursor=$("#cursorLight");
if(matchMedia("(pointer:fine)").matches){
  addEventListener("mousemove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";cursor.style.opacity=".95"});
  addEventListener("mouseleave",()=>cursor.style.opacity="0");
}

const audio=$("#audio"),record=$("#record"),playBtn=$("#playBtn");
audio.src=track;audio.volume=.65;
function startAudio(){
  audio.play().then(()=>{record.classList.add("playing");playBtn.textContent="توقف"}).catch(()=>{});
}
playBtn.onclick=()=>audio.paused?(audio.play(),record.classList.add("playing"),playBtn.textContent="توقف"):(audio.pause(),record.classList.remove("playing"),playBtn.textContent="پخش");
$("#volume").oninput=e=>audio.volume=+e.target.value;
window.addEventListener("load",()=>setTimeout(startAudio,350));
["pointerdown","keydown","touchstart"].forEach(ev=>window.addEventListener(ev,()=>{if(audio.paused)startAudio()},{once:true,passive:true}));

$("#searchBtn").onclick=()=>{searchPanel.classList.add("open");$("#searchInput").focus()};
$("#searchClose").onclick=()=>searchPanel.classList.remove("open");
$("#searchInput").oninput=e=>{
  const q=e.target.value.trim();
  $("#searchResults").innerHTML=poems.map((p,i)=>({p,i})).filter(x=>!q||`${x.p.title} ${x.p.full}`.includes(q))
  .map(x=>`<div class="searchResult" data-i="${x.i}"><b>${shortTitles[x.i]}</b><br><small>${escapeHtml(x.p.excerpt||"")}</small></div>`).join("");
  $$(".searchResult").forEach(x=>x.onclick=()=>{searchPanel.classList.remove("open");openPoem(+x.dataset.i)});
};

if(location.hash.startsWith("#poem-")){const n=parseInt(location.hash.slice(6));if(n>=1&&n<=poems.length)setTimeout(()=>openPoem(n-1),300)}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",()=>{}));

function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
