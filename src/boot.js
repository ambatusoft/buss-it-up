const controlKeys=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','ShiftLeft','ShiftRight','Space','KeyF']);
window.addEventListener('keydown',e=>{
  if(document.querySelector('dialog[open]'))return;
  if(e.code==='Escape'||e.code==='KeyP'){
    if(!e.repeat&&(g.mode==='play'||g.mode==='pause')){e.preventDefault();if(g.mode==='play')pause();else unpause();}
    return;
  }
  if(g.mode!=='play'||!controlKeys.has(e.code)||e.altKey||e.ctrlKey||e.metaKey)return;
  e.preventDefault();input.keys.add(e.code);
  if(!e.repeat){if(e.code.startsWith('Shift'))input.dash=true;if(e.code==='Space')input.buss=true;}
});
window.addEventListener('keyup',e=>input.keys.delete(e.code));
window.addEventListener('blur',()=>{if(g.mode==='play')pause();else clearInput();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&g.mode==='play')pause();});
function point(e){const r=canvas.getBoundingClientRect();input.x=(e.clientX-r.left)*W/r.width;input.y=(e.clientY-r.top)*H/r.height;}
canvas.addEventListener('pointermove',point);
canvas.addEventListener('pointerdown',e=>{
  if(g.mode!=='play'||e.button!==0)return;
  point(e);input.down=true;canvas.setPointerCapture(e.pointerId);sound.wake();
});
for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>input.down=false);
canvas.addEventListener('contextmenu',e=>e.preventDefault());
$('pause').addEventListener('click',pause);
document.addEventListener('click',event=>{
  if(!event.target.closest('button:not(:disabled)'))return;
  const waking=sound.wake();
  if(waking)waking.then(()=>sound.event('click'));
  else sound.event('click');
},true);
const resizeArena=()=>{if(g.story){syncArenaResolution();render();}};
new ResizeObserver(resizeArena).observe(canvas);
window.addEventListener('resize',resizeArena);
const stick=$('stick');
let stickId=null,fireId=null;
function stickMove(e){
  if(e.pointerId!==stickId||g.mode!=='play')return;
  const r=stick.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2, radius=r.width*.39,m=Math.max(radius,Math.hypot(x,y));
  input.dx=x/m;input.dy=y/m;stick.firstElementChild.style.transform='translate('+input.dx*radius+'px,'+input.dy*radius+'px)';
}
stick.addEventListener('pointerdown',e=>{if(stickId!==null||g.mode!=='play')return;stickId=e.pointerId;stick.setPointerCapture(e.pointerId);stickMove(e);});
stick.addEventListener('pointermove',stickMove);
for(const name of ['pointerup','pointercancel','lostpointercapture']){
  stick.addEventListener(name,e=>{if(e.pointerId!==stickId)return;stickId=null;input.dx=input.dy=0;stick.firstElementChild.style.transform='';});
  $('touch-fire').addEventListener(name,e=>{if(e.pointerId===fireId){input.touchFire=false;fireId=null;}});
}
$('touch-fire').addEventListener('pointerdown',e=>{
  if(fireId!==null||g.mode!=='play')return;
  fireId=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);input.touchFire=true;sound.wake();
});
$('touch-dash').addEventListener('pointerdown',()=>input.dash=true);
$('touch-buss').addEventListener('pointerdown',()=>input.buss=true);
let prevTime=null,accum=0;
function tick(time){
  requestAnimationFrame(tick);
  const elapsed=prevTime===null?0:Math.min(.1,(time-prevTime)/1000);prevTime=time;
  if(g.mode!=='play'){accum=0;return;}
  accum+=elapsed;
  while(accum>=1/90&&g.mode==='play'){update(1/90);accum-=1/90;}
  render();
}
requestAnimationFrame(tick);
