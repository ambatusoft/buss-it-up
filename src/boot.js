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
$('start').addEventListener('click',()=>start());
$('continue').addEventListener('click',()=>start(true));
$('pause').addEventListener('click',pause);
$('difficulty').addEventListener('click',()=>{
  difficulty=difficulty==='chill'?'arcade':'chill';storage.write('mode',difficulty);route();
});
function audioLabel(){
  $('audio').querySelector('span').textContent=sound.enabled?'SOUND ON':'SOUND OFF';
  $('audio').setAttribute('aria-pressed',String(sound.enabled));
}
$('audio').addEventListener('click',()=>{
  sound.enabled=!sound.enabled;storage.write('audio',sound.enabled);audioLabel();
  if(sound.enabled){sound.wake();sound.event('pick');}
  else if(sound.ac){sound.stopTrack();sound.stopVoices();sound.ac.suspend().catch(()=>{});}
});
function renderLore(){
  const visibleStages=stages.slice(0,furthest+1);
  const notes=furthest>=publicStageCount?communityNotes:communityNotes.slice(0,-2);
  $('lore-content').innerHTML='<p>Field notes on the edits, clips, and comment threads behind the tour.</p>'+
    visibleStages.map((s,i)=>'<article><small>'+pad(i+1)+' / '+s.name.toUpperCase()+'</small><p>'+s.theme+(s.url?' <a href="'+s.url+'" target="_blank" rel="noopener">Meme reference ↗</a>':'')+'</p></article>').join('')+
    '<h3>COMMUNITY DEEP CUTS</h3>'+notes.map(([name,description,url,original])=>{
    const link=(address,label)=>' <a href="'+address+'" target="_blank" rel="noopener">'+label+' ↗</a>';
    const sources=original?link(original,'Instagram')+link(url,'Archived copy'):link(url,'Source');
    return '<article><small>'+name.toUpperCase()+'</small><p>'+description+sources+'</p></article>';
    }).join('')+
    '<h3>AUDIO CREDITS</h3><p>Music by MintoDog (CC0). <a href="https://opengameart.org/node/171901" target="_blank" rel="noopener">Stage Select</a> · <a href="https://opengameart.org/content/8bit-action-boss-battle" target="_blank" rel="noopener">Boss Battle &amp; Climax</a> · <a href="https://opengameart.org/content/castle-stage" target="_blank" rel="noopener">Castle Stage</a>. '+
    'Voice samples from the <a href="https://www.myinstants.com/en/search/?name=dreamybull" target="_blank" rel="noopener">Dreamybull soundboard</a>.</p>'+
    '<p>In Chill mode, hits hurt less. Touch: drag the left stick and hold POP to auto-aim. Buss Burst follows your aim and clears shots in front of you.</p>';
}
let fileType='enemy';
const fileSelection={enemy:null,perk:null};
const fileQueries={enemy:'',perk:''};
const catalogSearch=$('file-search');
function displayFile(file,id){
  const detail=$('file-detail');
  detail.replaceChildren();
  const label=document.createElement('small');
  label.textContent=fileNumber(fileType,id)+' · '+(file.tier?.toUpperCase()??'ENEMY');
  const name=document.createElement('b');
  name.textContent=file.name;
  const text=document.createElement('p');
  text.textContent=file.note??file.desc;
  detail.append(label,name,text);
  if(file.max){
    const limit=document.createElement('small');
    limit.className='file-limit';
    limit.textContent='MAX '+file.max+' PER RUN';
    detail.append(limit);
  }
}
function renderCatalog(){
  const enemies=fileType==='enemy';
  const allEntries=enemies?Object.entries(enemyFiles).filter(([id])=>discovered.has(id))
    :perks.filter(perk=>seenPerks.has(perk.id)).map(perk=>[perk.id,perk]);
  const term=fileQueries[fileType].trim().toLowerCase();
  const squash=value=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
  const entries=term?allEntries.filter(([id,file])=>{
    const number=fileNumber(fileType,id).toLowerCase();
    return (file.name+' '+(file.tier??'')).toLowerCase().includes(term)
      ||(squash(term)&&squash(number).includes(squash(term)));
  }):allEntries;
  $('guide-status').textContent=discovered.size+' ENEMIES / '+seenPerks.size+' UPGRADES';
  $('enemy-tab').setAttribute('aria-pressed',String(enemies));
  $('perk-tab').setAttribute('aria-pressed',String(!enemies));
  const board=$('enemy-files'), detail=$('file-detail');
  detail.textContent=entries.length?'Select a file to inspect it.':'';
  detail.hidden=!entries.length;
  if(!entries.length){
    const message=term&&allEntries.length?'No discovered files match this search.':
      enemies?'Encounter an enemy on the tour to file its sprite here.':'Open an upgrade selection to file the cards you see.';
    board.innerHTML='<p class="empty-files">'+message+'</p>';
    return;
  }
  const columns=matchMedia('(max-width:540px)').matches?3:4;
  const rows=[];
  for(let i=0;i<entries.length;i+=columns){
    const cells=entries.slice(i,i+columns).map(([id,file])=>{
      const icon=enemies?'<canvas width="72" height="72" data-entry="'+id+'" aria-hidden="true"></canvas>':'<span class="perk-icon" aria-hidden="true">'+file.icon+'</span>';
      const tint=enemies?file.color:file.tier==='Bussted'?'#ff99c2':file.tier==='Rare'?'#67e2ec':'#d2ed90';
      return '<td><button type="button" data-id="'+id+'" style="--entry:'+tint+'" aria-pressed="'+(fileSelection[fileType]===id)+'">'+
        '<small class="file-number">'+fileNumber(fileType,id)+'</small>'+icon+'<b>'+file.name+'</b></button></td>';
    });
    while(cells.length<columns)cells.push('<td></td>');
    rows.push('<tr>'+cells.join('')+'</tr>');
  }
  board.innerHTML='<table class="file-table" aria-label="'+(enemies?'Encountered enemies':'Discovered upgrades')+'"><tbody>'+rows.join('')+'</tbody></table>';
  board.querySelectorAll('canvas').forEach(icon=>drawFilePortrait(icon,icon.dataset.entry));
  const records=new Map(entries);
  const selected=fileSelection[fileType];
  if(records.has(selected))displayFile(records.get(selected),selected);
  const cells=[...board.querySelectorAll('button')];
  cells.forEach((button,index)=>{
    button.addEventListener('click',()=>{
      board.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed','false');
      button.setAttribute('aria-pressed','true');
      fileSelection[fileType]=button.dataset.id;
      displayFile(records.get(button.dataset.id),button.dataset.id);
    });
    button.addEventListener('keydown',event=>{
      const steps={ArrowLeft:-1,ArrowRight:1,ArrowUp:-columns,ArrowDown:columns};
      if(!(event.key in steps)&&event.key!=='Home'&&event.key!=='End')return;
      const next=event.key==='Home'?0:event.key==='End'?cells.length-1:index+steps[event.key];
      event.preventDefault();
      cells[clamp(next,0,cells.length-1)].focus({preventScroll:false});
    });
  });
}
function switchCatalog(type){
  fileType=type;
  catalogSearch.value=fileQueries[type];
  renderCatalog();
}
$('enemy-tab').addEventListener('click',()=>switchCatalog('enemy'));
$('perk-tab').addEventListener('click',()=>switchCatalog('perk'));
catalogSearch.addEventListener('input',()=>{
  fileQueries[fileType]=catalogSearch.value;
  renderCatalog();
});
const resetDialog=$('reset-dialog');
$('reset-data').addEventListener('click',()=>{
  if(g.mode!=='title')return;
  resetDialog.showModal();
});
resetDialog.querySelector('form').addEventListener('submit',event=>{
  if(event.submitter?.value!=='reset')return;
  event.preventDefault();
  resetDialog.close();
  if(g.mode!=='title')return;
  for(const key of ['save','best','furthest','enemy-files','perk-files','mode','audio'])storage.erase(key);
  checkpoint=null;
  high=furthest=0;
  difficulty='arcade';
  discovered.clear();
  seenPerks.clear();
  fileSelection.enemy=fileSelection.perk=null;
  fileQueries.enemy=fileQueries.perk='';
  switchCatalog('enemy');
  sound.stopVoices();
  sound.trackOffsets={};
  sound.lastVoice={};
  sound.enabled=true;
  audioLabel();
  filesCount();
  title();
});
for(const [button,dialog,before] of [['archive','lore',renderLore],['catalog','field-guide',renderCatalog]]){
  $(button).addEventListener('click',()=>{
    lorePause=g.mode==='play';
    if(lorePause)pause();
    before?.();
    $(dialog).showModal();
  });
  $(dialog).addEventListener('close',()=>{if(lorePause&&g.mode==='pause')unpause();lorePause=false;});
}
$('practice').addEventListener('click',()=>{
  if(g.mode!=='title')return;
  const list=$('practice-list'), dialog=$('practice-dialog');
  list.replaceChildren();
  $('practice-mode').textContent=difficulty.toUpperCase();
  const addFight=(index,phase=false)=>{
    const stage=stages[index], button=document.createElement('button');
    button.className='secondary';
    button.style.setProperty('--fight',stage.color);
    button.textContent=phase?'Ambatron // Third Impact':stage.boss;
    button.addEventListener('click',()=>{dialog.close();startPractice(index,phase);});
    list.append(button);
  };
  stages.forEach((stage,index)=>{
    if(discovered.has('boss'+index))addFight(index);
    if(index===4&&discovered.has('prime'))addFight(index,true);
  });
  if(!list.childElementCount)list.textContent='Face a boss on tour to unlock it here.';
  dialog.showModal();
});
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
audioLabel();
filesCount();
$('continue').hidden=!checkpoint;
if(checkpoint)$('continue').textContent='RESUME • '+pad(checkpoint.level+1);
route();requestAnimationFrame(tick);
