/* Drop-in feature module. Requires elements:
#scratchCard #scratchCanvas #scratchProgressBar #scratchStatus
#days #hours #minutes #seconds #particleCanvas
*/
(function(){
const card=document.querySelector('#scratchCard'), canvas=document.querySelector('#scratchCanvas');
if(!card||!canvas)return;
const ctx=canvas.getContext('2d',{willReadFrequently:true}); let drawing=false,done=false,last=null;
function size(){const r=card.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);cover(r.width,r.height)}
function cover(w,h){ctx.globalCompositeOperation='source-over';const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#80613a');g.addColorStop(.5,'#c6a66a');g.addColorStop(1,'#70512d');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<800;i++){ctx.fillStyle='rgba(255,255,255,'+(Math.random()*.08)+')';ctx.fillRect(Math.random()*w,Math.random()*h,1,1)}}
function point(e){const r=canvas.getBoundingClientRect(),t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top}}
function erase(a,b){ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=window.innerWidth<600?52:64;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.restore();check()}
function check(){const s=70,o=document.createElement('canvas');o.width=o.height=s;o.getContext('2d').drawImage(canvas,0,0,s,s);const d=o.getContext('2d',{willReadFrequently:true}).getImageData(0,0,s,s).data;let z=0;for(let i=3;i<d.length;i+=4)if(d[i]<80)z++;const p=Math.round(z/(s*s)*100);const bar=document.querySelector('#scratchProgressBar'),st=document.querySelector('#scratchStatus');if(bar)bar.style.width=p+'%';if(st)st.textContent=p+'% revealed';if(p>=58)finish()}
function start(e){if(done)return;e.preventDefault();drawing=true;last=point(e);erase(last,last)}
function move(e){if(!drawing||done)return;e.preventDefault();const p=point(e);erase(last,p);last=p}
function end(){drawing=false;last=null}
canvas.addEventListener('pointerdown',start,{passive:false});canvas.addEventListener('pointermove',move,{passive:false});addEventListener('pointerup',end);addEventListener('pointercancel',end);new ResizeObserver(size).observe(card);size();
function finish(){if(done)return;done=true;card.classList.add('scratched');canvas.style.transition='opacity .7s';canvas.style.opacity=0;const c=document.querySelector('#countdown');if(c){c.classList.add('revealed');setTimeout(()=>c.scrollIntoView({behavior:'smooth',block:'start'}),850)}}
/* Countdown: change this ISO date if needed. */
const target=new Date('2027-02-27T00:00:00+05:30');
function countdown(){let n=Math.max(0,target-Date.now())/1000;let d=Math.floor(n/86400);n%=86400;let h=Math.floor(n/3600);n%=3600;let m=Math.floor(n/60),s=Math.floor(n%60);[['days',d],['hours',h],['minutes',m],['seconds',s]].forEach(([id,v])=>{const e=document.getElementById(id);if(e)e.textContent=String(v).padStart(2,'0')})}countdown();setInterval(countdown,1000);
/* Persistent decorative canvas. */
const pc=document.querySelector('#particleCanvas');if(!pc)return;const pctx=pc.getContext('2d');let W,H,items=[];const types=['petal','leaf','butterfly','spark'];function resize(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;pc.width=W*d;pc.height=H*d;pc.style.width=W+'px';pc.style.height=H+'px';pctx.setTransform(d,0,0,d,0,0);items=Array.from({length:innerWidth<600?18:30},()=>make(true))}function make(randomY){return{t:types[Math.floor(Math.random()*types.length)],x:Math.random()*W,y:randomY?Math.random()*H:-20,sz:5+Math.random()*9,v:.25+Math.random()*.55,dx:.2+Math.random()*.5,a:.25+Math.random()*.45,r:Math.random()*6.28,rs:(Math.random()-.5)*.02,q:Math.random()*6.28}}
function draw(p){pctx.save();pctx.translate(p.x,p.y);pctx.rotate(p.r);pctx.globalAlpha=p.a;if(p.t==='petal'){pctx.fillStyle='#e3b6b8';pctx.beginPath();pctx.ellipse(0,0,p.sz*.55,p.sz,0,0,Math.PI*2);pctx.fill()}else if(p.t==='leaf'){pctx.fillStyle='#9aa66f';pctx.beginPath();pctx.moveTo(0,-p.sz);pctx.quadraticCurveTo(p.sz*1.1,0,0,p.sz);pctx.quadraticCurveTo(-p.sz*1.1,0,0,-p.sz);pctx.fill();}else if(p.t==='butterfly'){let f=.55+.45*Math.sin(p.q*2);pctx.fillStyle='#c79ab2';pctx.beginPath();pctx.ellipse(-p.sz*.5,0,p.sz*f,p.sz*.75,0,0,6.28);pctx.fill();pctx.beginPath();pctx.ellipse(p.sz*.5,0,p.sz*f,p.sz*.75,0,0,6.28);pctx.fill();pctx.fillStyle='#4f2c3d';pctx.fillRect(-.8,-p.sz*.55,1.6,p.sz*1.1)}else{pctx.strokeStyle='#d8b370';pctx.lineWidth=.8;pctx.beginPath();pctx.moveTo(-p.sz,0);pctx.lineTo(p.sz,0);pctx.moveTo(0,-p.sz);pctx.lineTo(0,p.sz);pctx.stroke()}pctx.restore()}
function loop(){pctx.clearRect(0,0,W,H);items.forEach(p=>{p.q+=.03;p.y+=p.v;p.x+=Math.sin(p.q)*p.dx;p.r+=p.rs;if(p.y>H+25)Object.assign(p,make(false));draw(p)});requestAnimationFrame(loop)}resize();addEventListener('resize',resize);loop();
})();
