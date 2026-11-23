'use strict';
const W=960,H=544, TAU=Math.PI*2, bounds={l:32,r:928,t:69,b:505};
const $=id=>document.getElementById(id), clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const pad=(n,len=2)=>String(n).padStart(len,'0'), rand=(a,b)=>a+Math.random()*(b-a);
const canvas=$('arena'), cx=canvas.getContext('2d'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stages=[
  {color:'#ddff64',floor:'#232039',tile:'#272440',line:'#3b3453',bossHP:470,tip:'Move sideways out of the charge lane and avoid the stamp marks.'},
  {color:'#ffbf66',floor:'#252425',tile:'#2a292b',line:'#443b32',bossHP:635,tip:'The bus announces its lane before each pass. Step out and pop it as it drives by.'},
  {color:'#ff7bc4',floor:'#2d162e',tile:'#321a36',line:'#552952',bossHP:750,tip:'Keep your distance and thread the gaps between notes.'},
  {color:'#79f4cf',floor:'#122b29',tile:'#16312e',line:'#28504a',bossHP:850,tip:'Move out of the marked camera spots and clear the stunt doubles.'},
  {color:'#8fbcff',floor:'#131f36',tile:'#182741',line:'#2a4169',bossHP:1350,tip:'Watch for the beam markers. Save a Buss Burst to clear the spiral.'},
  {color:'#ff7663',floor:'#1c1018',tile:'#29141d',line:'#5f2730',bossHP:2440,tip:'Get into the green safe lane. The chassis shrugs off shots until the screen glows OVERHEAT.'}
];
const bossHealthScale=6.8;
const enemyHealthScale=[1.16,1.69,3.38,4.26,5.12,6.3];
const stageAmp=[1,1.23,1.55,1.94,2.40,3.05];
const deploymentCaps=[10,12,11,12,13,15], deploymentSpacing=.16;
const deploymentCap=level=>deploymentCaps[level];
const enemyFiles={
  ...specialFoes,
  runner:{name:'Bussiness Rep',mark:'↗',color:'#ef9d66',note:'A gym regular stuck on the same lap. Feints sideways on approach, then cuts in close.'},
  thrower:{name:'Transfer Clerk',mark:'▰',color:'#ffd478',note:'Circles at midrange. Terminal tickets bend, while later clerks widen their spread.'},
  guard:{name:'Classy Bouncer',mark:'⬢',color:'#ba80e8',note:'A slow shield carrier. Later bouncers plant their feet before a shove.'},
  skater:{name:'Ambatufish',mark:'◈',color:'#58d3c3',note:'Zigzags on fast skates like a fish on a line. Lead your shots.'},
  charger:{name:'Ambatuexplode',mark:'⚡',color:'#ff7f9f',note:'A pink dash line shows where this hothead is about to charge.'},
  speaker:{name:'Ambatusax Cabinet',mark:'♫',color:'#89aaff',note:'An amp on wheels. It drops rings of notes when it gets close.'},
  primePod:{name:'Base Form Pod',mark:'◇',color:'#ff9cd9',note:'Orbits the Third Impact chassis. Shoot both pods to break its shield.'},
  prime:{name:'Ambatron - Third Impact',mark:'✸',color:'#ff9cd9',note:'Destroy both pods to clear the projectiles, restore Vibe, and expose the core.'},
  hellboot:{name:'Satan’s PC - Harder and Dirtier',mark:'ϟ',color:'#ff784e',note:'Break the second chassis through safe lanes, converging beams, and dense ember rings. Hit the exposed green core.'},
  choir:{name:'Angelic Kam Choir',mark:'♫',color:'#ffad8d',note:'A flying trio on one chassis. It swerves at you and sings a short fan of embers.'},
  popup:{name:'Sentient Pop-up',mark:'▣',color:'#f4d280',note:'Stops to paint a crosshair before it fires a long laser. Move off the line.'},
  firewall:{name:'Wordington Firewall',mark:'♜',color:'#ff6859',note:'An armored tower that tries to hem you in with slow ember rings.'},
  ...Object.fromEntries(stages.map((stage,i)=>['boss'+i,{name:campaignAreas[i].boss,mark:'◆',color:stage.color,note:stage.tip}])),
  camerabot:{name:'Candid Camerabot',mark:'▦',color:'#a5ffe9',note:'A floating camera that projects two bright marks before the stage lights hit. Attack while it lines up the shot.'}
};
const enemyTypes={
  ...specialFoes,
  runner:{hp:32,speed:131,radius:13,contact:12},
  thrower:{hp:40,speed:90,radius:15,contact:12},
  guard:{hp:78,speed:70,radius:21,contact:19},
  skater:{hp:35,speed:157,radius:12,contact:12},
  charger:{hp:62,speed:104,radius:17,contact:12},
  speaker:{hp:48,speed:77,radius:16,contact:12},
  choir:{hp:43,speed:154,radius:16,contact:12},
  popup:{hp:51,speed:80,radius:17,contact:12},
  firewall:{hp:91,speed:68,radius:22,contact:24},
  camerabot:{hp:56,speed:82,radius:17,contact:12}
};
const bossRadii=[35,42,31,34,40,51];
const combatRules={enemyHP:1.26,bossHP:1.22,damage:1.36,projectileSpeed:1.15,waveHeal:.12,bossHeal:.43,dropChance:.09};
const areaTuning=[
  {hp:1.06,damage:1.04,shot:1,heal:1,deploy:.97,hazard:1},
  {hp:1.21,damage:1.17,shot:1.055,heal:.86,deploy:.87,hazard:.82},
  {hp:1,damage:1,shot:1,heal:1,deploy:1,hazard:1},
  {hp:1,damage:1.17,shot:1.025,heal:.85,deploy:1,hazard:.94},
  {hp:1.19,damage:1.12,shot:1.045,heal:.81,deploy:.94,hazard:.90},
  {hp:1.28,damage:1.24,shot:1.085,heal:.71,deploy:.86,hazard:.76}
];
function enemyStats(kind,level){
  const entry=enemyTypes[kind];
  return {
    hp:Math.round(entry.hp*(1+level*.16)*enemyHealthScale[level]*combatRules.enemyHP*areaTuning[level].hp),
    speed:entry.speed+level*5,
    radius:entry.radius,
    contact:entry.contact
  };
}
const bossHP=level=>Math.round(stages[level].bossHP*bossHealthScale*combatRules.bossHP);
const storage={
  read(key,fallback){try{return JSON.parse(localStorage.getItem('buss-v1-'+key))??fallback;}catch{return fallback;}},
  write(key,val){try{localStorage.setItem('buss-v1-'+key,JSON.stringify(val));}catch{}},
  erase(key){try{localStorage.removeItem('buss-v1-'+key);}catch{}}
};
const initialPopPower=17;
const initial=()=>({x:480,y:390,r:15,hp:100,max:100,dmg:initialPopPower,rate:.164,speed:265,dashMax:1.48,popSpeed:730,pierce:0,charge:40,
  dashSpeed:dashRules.speed,dashDuration:dashRules.duration,dashCapacity:1,dashPulse:0,dashRefund:0,incoming:1,refillHealing:1,pickupHealing:1,grace:1,revive:0,
  waveGuard:0,hazardGuard:1,killHeal:0,
  pattern:'single',shotLife:1.28,nut:null,burstShape:'cone',burstDamage:86,burstReach:1,aftershock:0,
  burstHeal:0,closeCharge:0,killCharge:0,bossCharge:0,echoKill:0,reflect:false,
  opener:0,streakPower:0,finisher:0,quickDraw:0,dashCover:0,nearHeal:0,burstRefund:0,
  waveStartCharge:0,bossVibe:0,streakTime:0});
const motion=p=>Object.assign(p,{x:480,y:397,aim:-Math.PI/2,vx:0,vy:0,inv:.4,dashing:0,dashCd:0,dashBuffer:0,closeCallUsed:false,fireCd:0,recoil:0,walk:0});
const dashRules={speed:785,duration:.17,buffer:.14,charge:5,score:25};
const readyDashes=p=>p.dashCapacity-Math.ceil(p.dashCd/p.dashMax);
const cleanWaveRules={points:240,pointsPerStage:80,charge:10};
const input={keys:new Set(),x:480,y:280,down:false,touchFire:false,dx:0,dy:0,dash:false,buss:false};
const empty=()=>({enemies:[],pops:[],hazards:[],enemyPops:[],fx:[],floaters:[],items:[],queue:[],blasts:[],nutPulses:[]});
const freshStats=()=>({
  time:0,waves:0,bosses:0,bots:0,streak:0,shots:0,hits:0,damage:0,dashes:0,closeCalls:0,cleanWaves:0,bursts:0
});
let g={mode:'title',level:0,wave:1,score:0,p:motion(initial()),...empty()};
let backdrop=null,musicTimer=0;
function clearInput(){
  input.keys.clear();input.down=false;input.touchFire=false;
  input.dx=input.dy=0;input.dash=input.buss=false;g.p.dashBuffer=0;
  clearTouchPointers();
}
const usesTouchControls=()=>matchMedia('(pointer:coarse)').matches||matchMedia('(pointer:none)').matches;
function setMode(mode){
  const menu=mode==='title'||mode==='campaign';
  if(menu&&g.mode!=='title'&&g.mode!=='campaign')sound.stopAttemptAudio();
  g.mode=mode;
  document.body.dataset.mode=mode;
  $('title-screen').hidden=mode!=='title';$('hud').hidden=mode==='title'||mode==='campaign';
  $('campaign-screen').hidden=mode!=='campaign';
  const modal=mode!=='play'&&mode!=='title'&&mode!=='campaign';
  $('overlay').classList.toggle('is-open',modal);
  $('overlay').inert=!modal;
  $('touch').hidden=mode!=='play'||!usesTouchControls();
  if(mode!=='play'){$('toast').hidden=true;clearInput();}
  if(mode!=='play'&&mode!=='campaign')sound.stopTrack();
}
function panel(label,title,body,actions=[]){
  const el=$('overlay');el.innerHTML='<div class="modal-card"><small>'+label+'</small><h2>'+title+'</h2><p>'+body+'</p><div class="actions"></div></div>';
  for(const [txt,fn] of actions){
    const b=document.createElement('button');b.className='primary'+(el.querySelector('.actions').childElementCount?' ghost':'');b.textContent=txt;b.addEventListener('click',fn);
    el.querySelector('.actions').append(b);
  }
  const first=el.querySelector('button');if(first)first.focus({preventScroll:true});
  return el.querySelector('.modal-card');
}
function title(){
  g.story=null;
  updateCampaignEntry();
  setMode('title');$('story-entry').focus({preventScroll:true});
}
function openLevel(i,firstWave=1){
  g.level=i;g.p=motion(g.p);g.p.hp=g.p.max;
  g.devil=g.p.devil?{x:g.p.x-40,y:g.p.y-16,cd:0,recoil:0}:null;
  g.combo=0;g.comboT=0;g.clock=0;g.shake=0;g.flash=0;g.echo=0;g.gap=null;g.banner=0;g.primeForm=false;
  g.cameoUsed=false;g.volley=0;g.blasts=[];
  g.reviveEffect=0;
  g.coldFlash=0;
  g.enemies=[];
  g.safeZone=null;
  musicTimer=0;backdrop=null;
  setMode('play');syncArenaResolution();openWave(firstWave);
}
function announce(text,time=1.45,kind='cue'){
  const toast=$('toast');
  toast.textContent=text;toast.dataset.kind=kind;toast.hidden=false;g.banner=time;
}
function spawnPoint(){
  for(let i=0;i<20;i++){const edge=(Math.random()*4)|0;const v=edge===0?{x:rand(92,868),y:94}:edge===1?{x:rand(92,868),y:472}:edge===2?{x:64,y:rand(125,445)}:{x:896,y:rand(125,445)};if(dist(v,g.p)>205)return v;}
  return{x:g.p.x>480?88:872,y:110};
}
function enemy(kind,x,y,materialize=.42,fileId=kind){
  const stats=enemyStats(kind,g.level);
  if(g.story.level.side){stats.hp=Math.round(stats.hp*1.20);stats.speed*=1.08;}
  const bot={kind,x,y,r:stats.radius,hp:stats.hp,max:stats.hp,speed:stats.speed,cd:rand(.65,1.75),
    spawn:materialize,aim:0,turn:Math.random()<.5?1:-1,walk:rand(0,TAU),hit:0,variant:Math.floor(rand(0,3))};
  g.enemies.push(bot);
  discover(fileId);
  return bot;
}
function openWave(n){
  const {level}=g.story;
  const continuous=level.side&&n>1;
  g.wave=n;g.gap=null;g.queue=[];g.squad=0;
  if(!continuous){
    g.pops=[];g.enemyPops=[];g.hazards=[];g.items=[];g.blasts=[];g.nutPulses=[];
    g.safeZone=null;
  }
  g.p.wardReady=!!g.p.projectileWard;
  g.waveHit=false;g.lastDeployment=-Infinity;
  g.p.inv=Math.max(g.p.inv,g.p.waveGuard);
  if(n>1&&!g.story.rematch)g.p.charge=Math.min(100,g.p.charge+g.p.waveStartCharge);
  g.storyHazards=0;g.storyHazardAt=(level.side?3.9:5.7)*areaTuning[g.level].hazard;
  if(isBossWave()){
    const hp=Math.round(bossHP(g.level)*campaignBossScale[g.level]);
    g.enemies=[{kind:'boss',x:480,y:154,r:bossRadii[g.level],hp,max:hp,spawn:1.22,cd:.53,pattern:0,walk:0,hit:0,aim:Math.PI/2,charge:0}];
    discover('boss'+g.level);
    for(const [slot,kind] of bossEscorts[g.level].entries()){
      const point=campaignSpawn({edge:slot?'east':'west',squad:1,slot});
      deployCampaignBot(kind,point.x,point.y,1.65);
    }
    healPlayer(g.p.max*combatRules.bossHeal,true);
    announce('BOSS',1.5,'boss');sound.event('bossIntro');
  }else{
    g.queue=campaignWave(level,n);
    if(n>1){
      healPlayer(g.p.max*combatRules.waveHeal*areaTuning[g.level].heal*(continuous?.65:1),true);
    }
    announce(isFinalWave()?'FINAL WAVE':'WAVE '+n,1.05,isFinalWave()?'final':'wave');
  }
  g.elapsed=0;hud();
}
function pause(){
  if(g.mode!=='play')return;setMode('pause');
  const level=g.story.level;
  panel(levelLabel(level),'Paused','',[['Resume',unpause],['Leave attempt',()=>showCampaign('map',level.id)]]);
}
function unpause(){if(g.mode==='pause'){sound.wake();setMode('play');}}
function setHudText(id,value){
  const node=$(id);
  if(node.textContent!==value)node.textContent=value;
}
function hudMeter(id,fill,value){
  const percent=Math.round(clamp(value,0,1)*100);
  const meter=$(id);
  const full=String(value>=1);
  if(meter.getAttribute('aria-valuenow')===String(percent)&&meter.dataset.full===full)return;
  meter.setAttribute('aria-valuenow',percent);
  meter.dataset.full=full;
  $(fill).style.width=percent+'%';
}
function hud(){
  const p=g.p,b=g.enemies.find(e=>e.kind==='boss');
  hudMeter('vibe-meter','hp-fill',p.hp/p.max);
  const {level:storyLevel,rematch}=g.story;
  setHudText('level-name',levelLabel(storyLevel));
  const waveText=isBossWave()?'BOSS':isFinalWave()?'FINAL WAVE':`WAVE ${g.wave} / ${activeWaveCount()}`;
  setHudText('wave-name',waveText);
  const medalTarget=$('speed-medal-target');
  const elapsed=Math.round(g.stats.time*1000);
  medalTarget.hidden=rematch;
  setHudText('speed-clock',campaignTime(elapsed));
  medalTarget.classList.toggle('over-target',elapsed>storyLevel.speedTarget*1000);
  setHudText('speed-medal-target','Medal: '+campaignTime(storyLevel.speedTarget*1000));
  const roundIndex=storyLevel.id+'-'+g.wave;
  if($('wave-track').dataset.round!==roundIndex){
    const track=$('wave-track');
    track.dataset.round=roundIndex;
    const position=g.wave-1;
    track.innerHTML=Array.from({length:activeWaveCount()},(_,i)=>'<i class="'+(i<position?'done':i===position?'now':'')+'"></i>').join('');
  }
  setHudText('score',pad(g.score,6));
  $('buss-status').hidden=p.charge<100;
  const dashMeter=$('dash-meter');
  hudMeter('dash-meter','dash-fill',1-p.dashCd/(p.dashMax*p.dashCapacity));
  dashMeter.classList.toggle('two-charges',p.dashCapacity===2);
  const dashStatus=p.dashCapacity===2?`${readyDashes(p)} of 2 dashes ready`:null;
  if(dashStatus===null)dashMeter.removeAttribute('aria-valuetext');
  else if(dashMeter.getAttribute('aria-valuetext')!==dashStatus)dashMeter.setAttribute('aria-valuetext',dashStatus);
  hudMeter('buss-meter','buss-fill',p.charge/100);
  $('combo-status').hidden=g.comboT<=0||g.combo<2;
  setHudText('combo-status','×'+g.combo+' STREAK');
  $('boss-hud').hidden=!b;
  if(b){
    setHudText('boss-name',(b.satanPhase?enemyFiles.hellboot.name:g.primeForm?enemyFiles.prime.name:activeBossName()).toUpperCase());
    $('boss-fill').style.width=(b.transform>0?100*(1-b.transform/primeEntrance):clamp(b.hp/b.max*100,0,100))+'%';
    $('boss-hud').classList.toggle('overclocked',g.primeForm||!!b.satanPhase);
    $('boss-hud').classList.toggle('overheat',b.hot>0);
  }
}
function particle(x,y,color,n=10,v=130,shape=0,direction=0,width=TAU){
  for(let i=0;i<n;i++){const a=direction+rand(-width/2,width/2),speed=rand(v*.24,v);const life=rand(.18,.62);g.fx.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,color,life,max:life,s:rand(2,6),spin:rand(-8,8),a,shape});}
}
function floater(x,y,label,color='#d9ff58',loud=false){g.floaters.push({x,y,label,color,life:.74,loud});}
function kill(e,source='pop'){
  e.hp=0;e.dead=true;
  g.combo=g.comboT>0?g.combo+1:1;g.comboT=2.5+g.p.streakTime;
  g.stats.streak=Math.max(g.stats.streak,g.combo);
  if(e.kind==='boss')g.stats.bosses++;
  else{
    g.stats.bots++;
    if(g.p.killHeal&&g.stats.bots%4===0)healPlayer(g.p.killHeal);
  }
  const mult=Math.min(5,1+Math.floor((g.combo-1)/3)), value=(e.kind==='boss'?1000:e.kind==='guard'?160:100)*mult;
  g.score+=value;g.p.charge=Math.min(100,g.p.charge+(e.kind==='boss'?31:7+g.p.killCharge));
  const color=e.kind==='boss'?stages[g.level].color:'#c491ff';
  particle(e.x,e.y,color,e.kind==='boss'?65:17,e.kind==='boss'?270:154,1);
  particle(e.x,e.y,'#faffc7',e.kind==='boss'?21:7,157);
  const popCalls=['POPPED!','YEK!','AMBASING!','GOT THAT NUT!'];
  const call=e.kind==='boss'?'BOSS POPPED!':source==='burst'?'BUSSED!':source==='nut'?'NUTTED!':g.stats.bots%5===0?popCalls[g.stats.bots%4]:popCalls[0];
  floater(e.x,e.y-18,call,source==='burst'?'#99e4ff':source==='nut'?'#b9a4ff':'#f0eaff',true);
  floater(e.x,e.y+5,'+'+value+(mult>1?' ×'+mult:''),color);
  if(e.kind!=='boss'&&Math.random()<combatRules.dropChance)g.items.push({x:e.x,y:e.y,life:9});
  sound.event('down');
  if(e.kind==='boss'){
    for(const other of g.enemies)if(other!==e&&!other.dead){other.dead=true;particle(other.x,other.y,color,13);}
    g.enemyPops=[];g.hazards=[];
    g.shake=Math.max(g.shake,11);sound.event('bossDown');
  }
  else{
    if(g.p.popDashReset)g.p.dashCd=0;
    if(g.p.echoKill){
      const next=g.enemies.filter(bot=>!bot.dead&&bot.spawn<=0&&dist(e,bot)<400)
        .sort((a,b)=>dist(e,a)-dist(e,b))[0];
      if(next)playerPop(e,angle(e,next),g.p.dmg*stageAmp[g.level]*g.p.echoKill,0,'#7dfff4');
    }
  }
  if((isBossWave()||isFinalWave())&&!g.queue.length&&g.enemies.every(enemy=>enemy.dead)){
    g.finishTime=g.stats.time;
    g.enemyPops=[];
    g.hazards=[];
  }
}
function damage(e,amount,source){
  if(e.dead||e.spawn>0||e.transform>0)return false;
  if(e.kind==='primePod'&&e.owner.transform>0)return false;
  if(e.kind==='boss'&&g.primeForm&&e.pods.some(pod=>!pod.dead))amount*=.32;
  if(e.kind==='boss'&&g.level===5)amount*=e.hot>0?1.55:e.satanPhase?.77:.53;
  if(source!=='companion'&&g.p.highVibeDamage&&e.kind!=='primePod'&&e.hp>=e.max*.5)amount*=1+g.p.highVibeDamage;
  e.hp-=amount;e.hit=.09;
  if(e.satanPhase)updateServerGlass(e);
  if(e.kind==='boss'&&g.level===4&&!g.primeForm&&e.hp<=0){
    transformPrime(e);
  }else if(e.kind==='boss'&&g.level===5&&!e.satanPhase&&e.hp<=0){
    transformSatan(e);
  }else if(e.hp<=0)kill(e,source);
  if(e.kind==='primePod'&&e.dead&&e.owner.pods.every(pod=>pod.dead)){
    if(!g.p.noHealing)g.p.hp=Math.min(g.p.max,g.p.hp+g.p.max*.34);
    g.p.inv=Math.max(g.p.inv,.8);
    g.enemyPops=[];
    announce('CORE EXPOSED',1.2);sound.event('warn');
  }
  return true;
}
function hurt(n,source='enemy'){
  const p=g.p;if(p.inv>0||p.dashing>0||g.mode!=='play')return;
  if(source==='projectile'&&p.wardReady){
    p.wardReady=false;
    g.nutPulses.push({x:p.x,y:p.y,life:.28,max:.28});
    floater(p.x,p.y-24,'BLOCKED','#adeaff');
    sound.event('pick');return;
  }
  const side=g.story.level.side?(g.level===5?1.07:1.14):1;
  const hazard=source==='hazard'?p.hazardGuard??1:1;
  const pressure=isBossWave()?(g.level===5?1.07:1):areaTuning[g.level].damage;
  const taken=Math.max(1,Math.round(n*combatRules.damage*Math.max(.76,p.incoming)*side*hazard*pressure));
  g.waveHit=true;
  g.stats.damage+=Math.min(Math.ceil(p.hp),taken);
  p.hp=Math.max(0,p.hp-taken);p.inv=p.grace;g.shake=7;g.flash=.19;g.combo=0;g.comboT=0;
  let retaliation=p.hitEcho??0;
  if(p.revengeDamage){
    p.charge=Math.min(100,p.charge+15);
    retaliation+=p.revengeDamage;
    for(const shot of g.enemyPops)shot.life=0;
    g.nutPulses.push({x:p.x,y:p.y,life:.38,max:.38,r:420});
  }
  if(p.scrub){
    for(const shot of g.enemyPops)if(dist(p,shot)<200)shot.life=0;
    p.inv+=1;
    g.nutPulses.push({x:p.x,y:p.y,life:.3,max:.3,r:200});
  }
  particle(p.x,p.y,'#ff86ae',13,147);
  sound.event('hurt');
  if(p.hp<=0&&p.revive&&!p.noHealing&&!g.cameoUsed){
    g.cameoUsed=true;p.hp=Math.ceil(p.max*p.revive);p.inv+=2;
    g.reviveEffect=1.65;
    particle(p.x,p.y,'#fff4b7',44,228,1);
    announce('TAKE TWO',1.4);sound.event('revive');
  }
  const defeated=p.hp<=0;
  if(retaliation&&(!defeated||p.revengeDamage)){
    const power=retaliation*p.dmg*stageAmp[g.level];
    for(const enemy of [...g.enemies]){
      if(damage(enemy,power,'nut')&&!enemy.dead&&p.revengeDamage)stunEnemy(enemy,.8);
    }
  }
  if(defeated){p.hp=0;hud();campaignResults(false);}
}
function updateBlasts(dt){
  for(const effect of g.blasts){
    if(effect.wait>0){
      effect.wait-=dt;
      if(effect.wait<=1e-8){
        effect.wait=0;
        for(const e of g.enemies){
          if(dist(e,effect)>=effect.r+e.r)continue;
          if(effect.source==='burst')hitBurst(e,effect.power);
          else damage(e,effect.power);
        }
        g.enemyPops=g.enemyPops.filter(b=>dist(b,effect)>effect.r);
        particle(effect.x,effect.y,effect.color,19,190,1);
        sound.tone(188,.18,.10,'triangle',72);
      }
    }else effect.life-=dt;
  }
  g.blasts=g.blasts.filter(effect=>effect.life>0);
}
function shot(x,y,a,s=240,dmg=12,type='orb',turn=0){
  const speed=isBossWave()?(g.level===5?1.045:1):areaTuning[g.level].shot;
  g.enemyPops.push({x,y,a,s:s*combatRules.projectileSpeed*speed,dmg,r:type==='note'?7:6,life:6,type,turn});
}
function fan(e,a,count,spread,s,type='orb',dmg=13){
  for(let j=0;j<count;j++)shot(e.x,e.y,a+(j-(count-1)/2)*spread,s,dmg,type);
}
function ring(e,n,offset,s,type='orb',damage=13){
  for(let i=0;i<n;i++)shot(e.x,e.y,offset+TAU*i/n,s,damage,type);
}
function move(e,x,y){e.x=clamp(e.x+x,bounds.l+e.r,bounds.r-e.r);e.y=clamp(e.y+y,bounds.t+e.r,bounds.b-e.r);}
function beam(a,b,width,delay,dur,action,dmg=0,owner=null){
  g.hazards.push({type:'line',a,b,width,wait:delay,max:delay,live:dur,dmg,action,owner});
  sound.event('warn');
}
function spot(x,y,r,delay,dmg,owner=null,action=null){
  g.hazards.push({type:'spot',x,y,r,wait:delay,max:delay,live:.34,dmg,owner,action});
}
function lineDist(x,y,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-a.x-dx*t,y-a.y-dy*t);}
const primeEntrance=2.4;
function arenaLane(vertical,position,width,delay,dmg,action=null){
  beam(vertical?{x:position,y:52}:{x:0,y:position},
    vertical?{x:position,y:520}:{x:960,y:position},width,delay,.36,action,dmg);
}
function aimBeam(from,a,width,delay,dmg,owner=null){
  const target={x:from.x+Math.cos(a)*1250,y:from.y+Math.sin(a)*1250};
  beam({x:from.x,y:from.y},target,width,delay,.37,null,dmg,owner);
}
function quarantineLanes(p,vertical,critical){
  const min=vertical?32:69, max=vertical?928:505;
  const half=critical?53:77, center=clamp((vertical?p.x:p.y)+(Math.random()<.5?-1:1)*104,min+half+18,max-half-18);
  const before=center-half, after=center+half, delay=critical?.96:1.07;
  g.safeZone={vertical,min:before,max:after,time:delay+.38};
  arenaLane(vertical,(min+before)/2,before-min,delay,35);
  arenaLane(vertical,(max+after)/2,max-after,delay,35);
}
function firewallWall(vertical,reverse,gap,critical){
  const start=vertical?48:85,end=vertical?910:490,step=critical?26:33;
  const dir=vertical?(reverse?-Math.PI/2:Math.PI/2):(reverse?Math.PI:0);
  for(let point=start;point<=end;point+=step){
    if(Math.abs(point-gap)<(critical?68:80))continue;
    const x=vertical?point:reverse?957:3, y=vertical?reverse?519:61:point;
    shot(x,y,dir,critical?205:183,20,'ember');
  }
}
function transformSatan(e){
  e.satanPhase=true;e.max=Math.round(e.max*1.248);e.hp=e.max;e.transform=primeEntrance;
  g.serverGlass={stage:0,at:g.clock,x:e.x,y:e.y,portraitsAt:null};
  e.hot=0;e.cd=.55;e.pattern=0;e.r=59;e.hit=0;
  e.slow=e.stun=e.stunLock=0;e.poison=null;
  g.enemyPops=[];g.hazards=[];g.safeZone=null;g.shake=13;g.flash=.22;
  for(const bot of g.enemies)if(bot!==e)bot.dead=true;
  healPlayer(g.p.max*.27);
  if(!g.p.noHealing)g.p.hp=Math.max(g.p.hp,Math.ceil(g.p.max*.56));
  discover('hellboot');
  g.p.inv=Math.max(g.p.inv,1.9);
  particle(e.x,e.y,'#ff7161',62,280,1);
  announce('THAT PC BELONGS TO SATAN',2.1,'boss');
  sound.event('overload');musicTimer=0;
}

function updateServerGlass(e){
  const glass=g.serverGlass;
  const stage=e.hp<=0?4:Math.min(3,Math.floor(4*(1-e.hp/e.max)));
  if(stage<=glass.stage)return;
  Object.assign(glass,{stage,at:g.clock,x:e.x,y:e.y});
  if(stage>=2&&stage<4&&glass.portraitsAt===null)glass.portraitsAt=g.clock;
  g.shake=Math.max(g.shake,stage===4?24:5+stage*2);
  if(stage===4){
    g.safeZone=null;
    g.floaters=[];
    particle(e.x,e.y,'#ffd79b',80,500,1);
    particle(e.x,e.y,'#ff674b',56,385,1);
    particle(e.x,e.y,'#a8ffde',30,420,1);
    sound.event('overload');
  }
}

function hellbootUpdate(e,dt){
  if(e.transform>0){e.transform=Math.max(0,e.transform-dt);return;}
  const p=g.p;
  e.walk+=dt*9;e.hot=Math.max(0,e.hot-dt);e.cd-=dt;
  const x=480+Math.sin(e.walk*.122)*291,y=235+Math.sin(e.walk*.162)*106;
  const moveAim=angle(e,{x,y});
  if(dist(e,{x,y})>12)move(e,Math.cos(moveAim)*dt*178,Math.sin(moveAim)*dt*178);
  if(e.cd>0)return;
  const k=e.pattern++,a=angle(e,p),pattern=k%5;
  e.monitorFrame=k%monitorFrames.length;
  e.monitorUntil=g.clock+.78;
  e.cd=1.13;
  if(pattern===0){
    quarantineLanes(p,k%2===0,true);
    e.hot=1.52;e.cd=1.42;
  }else if(pattern===1){
    const gap=a+(k%2===0?.23:-.23);
    spot(e.x,e.y,76,.36,0,e,()=>{
      for(let j=2;j<28;j++)shot(e.x,e.y,gap+j*TAU/29,225,23,'ember');
      for(let j=2;j<19;j++)shot(e.x,e.y,gap+j*TAU/20,161,20,'ember',k%2===0?.12:-.12);
    });
    spot(clamp(p.x,98,862),clamp(p.y,108,466),64,.91,26,e);
  }else if(pattern===2){
    const horizontal=k%2===0;
    for(const offset of [-125,0,125])arenaLane(!horizontal,clamp((horizontal?p.y:p.x)+offset,horizontal?117:96,horizontal?465:864),59,.76+Math.abs(offset)/570,29);
    e.hot=1.31;
  }else if(pattern===3){
    for(const offset of [-.58,0,.58])aimBeam(e,a+offset,49,.68+Math.abs(offset)*.47,31,e);
    fan(e,a+Math.PI,9,.22,221,'ember',22);
  }else{
    const vertical=k%2===0;
    firewallWall(vertical,k%3===0,vertical?p.x:p.y,true);
    fan(e,a,9,.20,198,'ember',21);
    e.hot=.92;
  }
  sound.event('warn');
}

function pcUpdate(e,dt){
  if(e.satanPhase){hellbootUpdate(e,dt);return;}
  const p=g.p, ratio=e.hp/e.max, critical=ratio<.34, heavy=ratio<.7;
  e.walk+=dt*6;
  e.hot=Math.max(0,(e.hot||0)-dt);
  if(critical&&!e.critical){
    e.critical=true;g.shake=12;
    sound.event('overload');
    particle(e.x,e.y,'#ff684d',34,225,1);
  }
  const x=480+Math.sin(g.clock*(critical?.64:.47))*238;
  const y=232+Math.cos(g.clock*.72)*74;
  const direction=angle(e,{x,y});
  if(dist(e,{x,y})>9)move(e,Math.cos(direction)*dt*108,Math.sin(direction)*dt*108);
  e.cd-=dt;
  if(e.cd>0)return;
  const k=e.pattern++, a=angle(e,p);
  if(k%5===0){
    quarantineLanes(p,k%2===0,critical);
    e.hot=critical?1.22:1.94;e.cd=2.08;
    e.hot+=.45;
  }else if(k%5===1){
    fan(e,a,critical?17:13,.16,234,'ember',20);
    for(const turret of [{x:70,y:106},{x:890,y:435}]){
      fan(turret,angle(turret,p),heavy?8:5,.21,178,'ember',17);
    }
    e.cd=heavy?1.46:1.75;
  }else if(k%5===2){
    const vertical=k%2===0;
    firewallWall(vertical,k%4>=2,vertical?p.x:p.y,critical);
    ring(e,heavy?21:15,g.clock*.68,148,'ember');
    e.cd=critical?1.52:1.83;
  }else if(k%5===3){
    spot(p.x,p.y,critical?96:78,.77,30);
    for(let j=0;j<4;j++){
      const dir=j*Math.PI/2+.44;
      spot(clamp(p.x+Math.cos(dir)*154,94,866),clamp(p.y+Math.sin(dir)*122,120,452),heavy?71:57,.93+j*.08,24);
    }
    if(heavy)aimBeam(e,a+.38,44,1.21,26);
    e.hot=critical?1.26:1.8;e.cd=2;
  }else{
    for(const off of [-.65,0,.65])aimBeam(e,a+off,critical?55:40,.82+Math.abs(off)*.3,29);
    ring(e,heavy?24:18,-g.clock*.42,124,'ember');
    if(g.enemies.length<3){const q=spawnPoint();enemy(critical?'popup':'choir',q.x,q.y,.66);}
    e.cd=1.89;
  }
}
function transformPrime(e){
  g.primeForm=true;
  g.enemyPops=[];g.hazards=[];
  e.max=Math.round(e.max*.82);e.hp=e.max;
  e.transform=primeEntrance;e.origin={x:e.x,y:e.y};e.pattern=0;e.cd=.54;
  e.r=52;
  e.slow=e.stun=0;e.poison=null;
  const hp=1060;
  e.pods=[0,1].map(slot=>({kind:'primePod',owner:e,slot,x:e.x,y:e.y,r:15,hp,max:hp,hit:0,spawn:0}));
  for(const pod of e.pods)positionPod(pod);
  g.enemies.push(...e.pods);
  healPlayer(g.p.max*.49);
  g.p.charge=100;
  g.shake=12;
  discover('prime');discover('primePod');
  particle(e.x,e.y,'#ffaeef',44,268,1);
  announce('THIRD IMPACT',primeEntrance+.45,'boss');sound.event('transform');
}
function positionPod(pod){
  const e=pod.owner, a=e.walk*.24+pod.slot*Math.PI;
  pod.x=e.x+Math.cos(a)*114;
  pod.y=e.y+Math.sin(a)*83;
}
function primeUpdate(e,dt){
  const p=g.p;
  if(e.transform>0){
    e.transform=Math.max(0,e.transform-dt);
    const t=1-(e.transform/primeEntrance)**2;
    e.x=lerp(e.origin.x,480,t);e.y=lerp(e.origin.y,228,t);
    e.aim+=dt*(2.2+e.transform*.8);
    if(e.transform===0){g.shake=16;particle(e.x,e.y,'#ff70d3',70,280,1);}
    return;
  }
  e.aim=angle(e,p);
  const center={x:480+Math.sin(e.walk*.093)*216,y:278+Math.sin(e.walk*.16)*113};
  const a=angle(e,center);
  if(dist(e,center)>7)move(e,Math.cos(a)*116*dt,Math.sin(a)*116*dt);
  e.cd-=dt;
  if(e.cd>0)return;
  const k=e.pattern++, pods=e.pods.filter(pod=>!pod.dead);
  if(k%5===0){
    const aim=angle(e,p);
    for(const [index,offset] of [-.92,-.46,0,.46,.92].entries())
      aimBeam(e,aim+offset,49,.76+Math.abs(index-2)*.14,29);
    e.cd=1.65;
  }else if(k%5===1){
    for(const [i,pod] of pods.entries())ring(pod,16,e.walk*.28+i*.31,158,'plasma');
    ring(e,23,-e.walk*.18,222,'plasma');ring(e,15,e.walk*.21+.16,114,'plasma');
    e.cd=1.42;
  }else if(k%5===2){
    const x=clamp(p.x,102,858), y=clamp(p.y,127,451);
    spot(x,y,86,.78,28);
    for(const offset of [-1,1]){
      spot(clamp(x+offset*137,90,870),clamp(y+offset*90,120,450),77,1.01,24);
      spot(clamp(x+offset*147,90,870),clamp(y-offset*106,120,450),69,1.22,24);
    }
    e.cd=1.58;
  }else if(k%5===3){
    const x=clamp(p.x,160,800),y=clamp(p.y,154,406);
    arenaLane(true,x,66,.79,30);
    arenaLane(false,y,64,.94,29);
    arenaLane(true,x-124,49,1.17,25);
    arenaLane(true,x+124,49,1.17,25);
    e.cd=1.7;
  }else{
    for(const pod of pods)fan(pod,angle(pod,p),7,.19,290,'plasma',17);
    fan(e,angle(e,p),11,.18,265,'plasma',17);
    if(g.enemies.length<5){
      const q=spawnPoint();enemy(k%2===0?'charger':'speaker',q.x,q.y);
    }
    e.cd=1.05;
  }
}
const saxRules={
  wind:.46, ring:[16,20], innerRing:10, ringSpeed:164, innerSpeed:101,
  duet:[6,8], lead:6, duetSpeed:190, leadSpeed:241, floorRadius:[58,72],
  floorDelay:1.02, noteDamage:12, floorDamage:17
};
function saxAttack(e,k,aim,phase){
  const late=Number(phase), p=g.p;
  if(k%3===2){
    for(const x of [240,480,720])spot(x,p.y,saxRules.floorRadius[late],saxRules.floorDelay,saxRules.floorDamage);
    ring(e,13,g.clock*.35,126,'note',saxRules.noteDamage);
    sound.event('warn');e.cd=1.72;
    return;
  }
  const amp=k%3===1?{x:k%2===0?112:848,y:k%4<2?125:446}:null;
  e.solo={
    left:saxRules.wind,total:saxRules.wind,amp,
    fire(){
      if(amp){
        fan(amp,e.solo.ampAim,saxRules.duet[late],.235,saxRules.duetSpeed,'note',saxRules.noteDamage);
        fan(e,aim,saxRules.lead,.20,saxRules.leadSpeed,'note',saxRules.noteDamage);
      }else{
        ring(e,saxRules.ring[late],g.clock*.43,saxRules.ringSpeed,'note',saxRules.noteDamage);
        ring(e,saxRules.innerRing,g.clock*.5+.18,saxRules.innerSpeed,'note',saxRules.noteDamage);
      }
    }
  };
  if(amp)e.solo.ampAim=angle(amp,p);
  sound.event('warn');
  e.cd=amp?1.59:phase?1.40:1.70;
}
function bossUpdate(e,dt){
  const p=g.p,i=g.level, a=angle(e,p), d=dist(e,p), phase=e.hp/e.max<.5;
  if(i===5){pcUpdate(e,dt);return;}
  if(g.primeForm){e.walk+=dt*8;primeUpdate(e,dt);return;}
  if(phase&&!e.phase){e.phase=true;sound.event('warn');}
  e.walk+=dt*(phase?8:5);
  if(e.charge>0){e.charge-=dt;e.cd=Math.max(.34,e.cd-dt);const v=e.vel;
    if(i===1){e.x+=v.x*dt;e.y+=v.y*dt;if(e.charge<=0){e.x=clamp(e.x,72,888);e.y=clamp(e.y,121,456);ring(e,phase?17:12,Math.PI/12,142,'ticket');}}
    else move(e,v.x*dt,v.y*dt);
    return;
  }
  if(i>=2){
    e.aim=a;
    const target=i===2
      ?{x:480+Math.sin(g.clock*.77)*248,y:267+Math.cos(g.clock*.9)*128}
      :i===3?{x:clamp(960-p.x,174,786),y:clamp(544-p.y,138,408)}
        :{x:480+Math.sin(g.clock*.53)*205,y:214+Math.sin(g.clock*1.06)*80};
    const q=angle(e,target), speed=i===4?112:i===3?92:83;
    if(dist(e,target)>12)move(e,Math.cos(q)*dt*speed,Math.sin(q)*dt*speed);
  }else if(!e.wind){
    e.aim=a;
    if(d>(i===0?102:230)){
      const heading=i===0?a+Math.sin(g.clock*1.2)*.54:a;
      move(e,Math.cos(heading)*dt*70,Math.sin(heading)*dt*70);
    }
  }
  if(e.solo&&(e.solo.left-=dt)<=0){
    e.solo.fire();e.solo=null;
  }
  if(e.primeVolley&&(e.primeVolley.left-=dt)<=0){
    fan(e,e.primeVolley.aim,13,.14,279);
    e.primeVolley=null;
  }
  e.cd-=dt;if(e.cd>0)return;
  const k=e.pattern++;
  if(campaignBossPattern(e,a,phase,k))return;
  if(i===0){
    if(k%2===0){
      const end={x:e.x+Math.cos(a)*540,y:e.y+Math.sin(a)*540};e.wind=true;e.aim=a;
      beam({x:e.x,y:e.y},end,70,.78,.32,()=>{e.wind=false;e.charge=.58;e.vel={x:Math.cos(a)*675,y:Math.sin(a)*675};});
      if(phase)aimBeam(e,a+(k%4===0?.47:-.47),43,.99,16);
      e.cd=phase?1.68:2.12;
    }else if(k%4===1){
      fan(e,a,phase?9:7,.23,246,'plate',15);e.cd=1.15;
    }else{
      ring(e,phase?17:12,g.clock*.33,170,'plate');
      spot(p.x,p.y,phase?81:60,.81,20);e.cd=1.34;
    }
  }else if(i===1){
    if(k%4===1){
      fan(e,a,phase?13:9,.22,231,'ticket');e.cd=1.35;
    }else{
      const vertical=k%4===2, sign=k%3===0?1:-1;
      const lane=vertical?clamp(p.x,148,812):clamp(p.y,153,434);
      e.wind=true;e.aim=vertical?sign*Math.PI/2:sign===1?0:Math.PI;
      e.x=vertical?lane:sign>0?46:914;e.y=vertical?sign>0?73:495:lane;
      arenaLane(vertical,lane,vertical?103:101,.87,0,()=>{
        e.wind=false;e.charge=vertical?.58:1.19;
        e.vel=vertical?{x:0,y:sign*725}:{x:sign*727,y:0};
      });
      if(phase||k%4===3){
        const ghost=lane+(lane<(vertical?480:288)?1:-1)*(vertical?166:108);
        arenaLane(vertical,ghost,74,1.03,18);
      }
      e.cd=phase?2.19:2.57;
    }
  }else if(i===2){
    saxAttack(e,k,a,phase);
  }else if(i===3){
    if(k%3===0){
      spot(p.x,p.y,75,.87,21);
      const marks=phase?5:4;
      for(let j=0;j<marks;j++){
        const dir=TAU*j/marks+.3;
        spot(clamp(p.x+Math.cos(dir)*155,85,875),clamp(p.y+Math.sin(dir)*137,112,466),62,1.02+j*.08,18);
      }
      sound.event('warn');e.cd=phase?1.68:1.88;
    }else if(k%3===1){
      const count=Math.min(phase?3:2,Math.max(0,6-g.enemies.length));
      for(let j=0;j<count;j++){const q=spawnPoint();enemy('skater',q.x,q.y,.60);}
      fan(e,a,8,.23,239);e.cd=1.45;
    }else{
      const x=clamp(p.x,138,822),y=clamp(p.y,126,457);
      arenaLane(true,x,59,.86,21);arenaLane(false,y,59,.99,21);e.cd=1.65;
    }
  }else{
    if(k%3===0){
      const vertical=k%2===0,n=phase?3:2;
      for(let j=0;j<n;j++){
        const x=clamp(p.x+(j===0?0:(j===1?-132:150)),85,875),y=clamp(p.y+(j===0?0:(j===1?99:-106)),110,470);
        beam(vertical?{x,y:52}:{x:0,y},vertical?{x,y:520}:{x:960,y},50,.78+j*.11,.36,null,22);
      }
      e.cd=1.52;
    }else if(k%3===1){
      ring(e,phase?22:17,g.clock*.82,199);
      ring(e,phase?16:12,-g.clock*.38,119);
      e.cd=phase?1.24:1.30;
    }else{
      if(phase){
        e.primeVolley={left:.27,aim:a};
        sound.event('warn');
        if(g.enemies.length<3&&k%6===2){const q=spawnPoint();enemy('guard',q.x,q.y,.59);}
      }else fan(e,a,9,.14,279);
      e.cd=phase?1.30:1.17;
    }
  }
}
const rangedAttacks={
  thrower:{range:440,wind:.31,rest:[1.45,2.3],fire(e,a){
    if(g.level===1){shot(e.x,e.y,a+e.turn*.24,248,12,'ticket',-e.turn*.83);e.turn*=-1;}
    else fan(e,a,g.level>=2?3:1,.15,243+g.level*10,'ticket',12);
  }},
  speaker:{range:375,wind:.42,rest:[2.1,2.8],fire:e=>ring(e,8,e.walk*.25,171,'note')},
  choir:{range:350,wind:.33,rest:[2.25,3.05],fire:(e,a)=>fan(e,a,4,.27,193,'ember',15)},
  firewall:{range:420,wind:.48,rest:[3,3.75],fire(e,a){
    if(g.level===5&&Math.floor(e.walk)%2===0)for(const off of [-.65,0,.65])fan(e,a+off,2,.15,181,'ember',13);
    else ring(e,10,e.walk*.29,145,'ember');
  }}
};
function rangedWindup(e,dt,distToPlayer,aim){
  const attack=rangedAttacks[e.kind];
  if(!attack)return false;
  if(e.attackWind>0){
    e.attackWind-=dt;
    e.aim=e.attackAim;
    if(e.attackWind<=0){
      attack.fire(e,e.attackAim);
      e.cd=rand(...attack.rest)-(e.kind==='thrower'?g.level*.08:0);
      sound.event('enemyAttack');
    }
    return true;
  }
  e.cd-=dt;
  if(e.cd>0||distToPlayer>attack.range)return false;
  e.attackWind=attack.wind;e.attackAim=aim;
  return true;
}
function enemyUpdate(e,dt){
  e.hit=Math.max(0,e.hit-dt);
  if(e.spawn>0){e.spawn-=dt;return;}
  dt=conditionStep(e,dt);
  if(e.dead||dt===0)return;
  if(e.kind==='boss'){
    bossUpdate(e,dt);
    if(!e.transform&&dist(e,g.p)<e.r+g.p.r)hurt(e.charge>0?26:g.level===2?17:20);
    return;
  }
  if(e.kind==='primePod'){positionPod(e);return;}
  if(specialFoes[e.kind]){specialistUpdate(e,dt,specialFoes[e.kind]);return;}
  if(e.storyKind)updateCampaignBot(e,dt);
  const p=g.p,a=angle(e,p),d=dist(e,p);
  e.aim=a;e.walk+=dt*(e.kind==='skater'?16:10);
  let vx=Math.cos(a),vy=Math.sin(a);
  if(e.kind==='runner'&&d>59){
    const feint=Math.sin(e.walk*.49)*.44;
    vx=Math.cos(a+feint);vy=Math.sin(a+feint);
  }else if(e.kind==='choir'){
    vx=Math.cos(a+Math.sin(e.walk*.6)*.92);vy=Math.sin(a+Math.sin(e.walk*.6)*.92);
  }else if(e.kind==='popup'||e.kind==='camerabot'){
    const direction=d>245?1:d<177?-1:0;
    vx*=direction;vy*=direction;
    e.cd-=dt;e.focus=Math.max(0,(e.focus||0)-dt);
    if(e.focus>0){vx=0;vy=0;e.aim=e.focusAim;}
    if(e.cd<0&&d<440){
      e.focusAim=a;
      if(e.kind==='popup'){
        e.focus=.82;e.cd=rand(3.2,4.2);
        aimBeam(e,a,24,.82,18,e);
      }else{
        e.focus=.87;e.cd=rand(3.4,4.4);
        spot(p.x,p.y,47,.87,16,e);
        const side=a+Math.PI/2*e.turn;
        spot(clamp(p.x+Math.cos(side)*91,84,876),clamp(p.y+Math.sin(side)*91,106,466),43,1.12,14,e);
      }
      sound.event('enemyAttack');
    }
  }
  if(e.kind==='thrower'||e.kind==='speaker'){
    const speaker=e.kind==='speaker';
    const dir=d>(speaker?218:252)?1:d<151?-1:0;
    vx=vx*dir+Math.cos(a+Math.PI/2)*e.turn*.55;vy=vy*dir+Math.sin(a+Math.PI/2)*e.turn*.55;
  }
  if(rangedWindup(e,dt,d,a)){vx*=.36;vy*=.36;}
  if(e.kind==='guard'&&!e.storyKind&&(g.level===1||g.level>=3)){
    e.cd-=dt;
    if(e.cd<=0&&d<135){
      const target={x:e.x+Math.cos(a)*100,y:e.y+Math.sin(a)*100};
      beam({x:e.x,y:e.y},target,50,.66,.23,null,17,e);
      e.cd=4.4;e.focus=.66;
    }
    if(e.focus>0){e.focus-=dt;vx*=.22;vy*=.22;}
  }
  if(e.kind==='charger'){
    if(e.charge>0){
      e.charge-=dt;e.aim=e.lunge;
      move(e,Math.cos(e.lunge)*dt*420,Math.sin(e.lunge)*dt*420);
      if(dist(e,p)<e.r+p.r)hurt(18);
      return;
    }
    if(e.wind>0){
      e.wind-=dt;e.aim=e.lunge;
      if(e.wind<=0)e.charge=.42;
      return;
    }
    e.cd-=dt;
    if(e.cd<0&&d<265){
      e.lunge=a;e.wind=.52;e.cd=rand(1.3,1.8);
      sound.event('enemyAttack');
      return;
    }
  }
  if(e.kind==='skater'){vx=Math.cos(a+Math.sin(e.walk*.57)*.74);vy=Math.sin(a+Math.sin(e.walk*.57)*.74);}
  if(e.storyKind){
    const [heading,stride]=campaignBotTypes[e.storyKind].steer(e,a,d);
    const activity=e.attackWind>0?.36:1;
    vx=Math.cos(heading)*stride*activity;vy=Math.sin(heading)*stride*activity;
  }
  for(const o of g.enemies){if(o===e||o.dead)continue;const d2=dist(e,o),sum=e.r+o.r+6;if(d2>0&&d2<sum){const f=(sum-d2)/sum*1.34;vx+=(e.x-o.x)/d2*f;vy+=(e.y-o.y)/d2*f;}}
  const speed=e.speed;
  move(e,vx*dt*speed,vy*dt*speed);
  if(d<p.r+e.r)hurt(enemyTypes[e.kind].contact);
}
function closeCall(bullet){
  const p=g.p;
  bullet.life=0;
  particle(bullet.x,bullet.y,'#84ffec',5,105,1);
  if(p.closeCallUsed)return;
  p.closeCallUsed=true;g.stats.closeCalls++;
  p.charge=Math.min(100,p.charge+dashRules.charge+p.closeCharge);
  if(p.dashRefund)p.dashCd=Math.max(0,p.dashCd-p.dashRefund);
  g.score+=dashRules.score;
  if(p.nearHeal)healPlayer(p.nearHeal);
  floater(p.x,p.y-18,'CLOSE CALL','#a5ffea');sound.tone(840,.12,.07,'triangle',1250);
  if(p.reflect){
    playerPop(p,p.aim,p.dmg*stageAmp[g.level]*p.reflect,p.pierce+1,'#81fff5',16);
  }
}
function finishRegularWave(){
  const p=g.p;
  g.stats.waves++;
  sound.event('clear');
  if(p.waveClearHeal)healPlayer(p.waveClearHeal);
  if(g.waveHit)return;
  const points=cleanWaveRules.points+g.level*cleanWaveRules.pointsPerStage;
  g.stats.cleanWaves++;g.score+=points;
  sound.event('clean');
  p.charge=p.cleanBurst?100:Math.min(100,p.charge+cleanWaveRules.charge);
  floater(p.x,p.y-24,'+'+points+' CLEAN WAVE','#adffe8');
}

function update(dt){
  if(g.mode!=='play')return;
  g.clock+=dt;g.elapsed+=dt;g.stats.time=g.finishTime??g.clock;music(dt);g.comboT-=dt;
  g.reviveEffect=Math.max(0,g.reviveEffect-dt);
  g.coldFlash=Math.max(0,g.coldFlash-dt);
  for(const pulse of g.nutPulses)pulse.life-=dt;
  g.nutPulses=g.nutPulses.filter(pulse=>pulse.life>0);
  if(g.safeZone&&(g.safeZone.time-=dt)<=0)g.safeZone=null;
  g.shake=Math.max(0,g.shake-dt*39);g.flash=Math.max(0,g.flash-dt);g.echo=Math.max(0,g.echo-dt);
  if(g.banner>0){g.banner-=dt;if(g.banner<=0)$('toast').hidden=true;}
  const p=g.p,K=input.keys;
  const mx=Number(K.has('KeyD')||K.has('ArrowRight'))-Number(K.has('KeyA')||K.has('ArrowLeft'))+input.dx;
  const my=Number(K.has('KeyS')||K.has('ArrowDown'))-Number(K.has('KeyW')||K.has('ArrowUp'))+input.dy;
  const len=Math.hypot(mx,my);
  if(input.touchFire){
    const e=g.enemies.filter(e=>!e.dead&&e.spawn<=0).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(e)p.aim=angle(p,e);
  }else if(!usesTouchControls()||input.down)p.aim=Math.atan2(input.y-p.y,input.x-p.x);
  else if(len>.2)p.aim=Math.atan2(my,mx);
  p.inv=Math.max(0,p.inv-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.fireCd=Math.max(0,p.fireCd-dt);
  if(p.quickDrawWindow>0)p.quickDrawWindow-=dt;
  p.recoil=Math.max(0,p.recoil-dt*13);
  p.dashBuffer=input.dash?dashRules.buffer:Math.max(0,p.dashBuffer-dt);
  if(p.dashBuffer>0&&readyDashes(p)>0&&p.dashing<=0){
    g.stats.dashes++;p.dashCd+=p.dashMax;p.dashing=p.dashDuration;p.closeCallUsed=false;p.dashBuffer=0;
    const a=len>.1?Math.atan2(my,mx):p.aim;
    p.vx=Math.cos(a)*p.dashSpeed;p.vy=Math.sin(a)*p.dashSpeed;sound.event('dash');
    if(p.dashCover)p.inv=Math.max(p.inv,p.dashing+p.dashCover);
    if(p.quickDraw)p.quickDrawWindow=1;
    if(p.dashSprint)p.sprintUntil=g.clock+p.dashDuration+p.dashSprintTime;
    if(p.dashPulse){
      g.blasts.push({x:p.x,y:p.y,r:110,wait:.24,life:.39,power:initialPopPower*stageAmp[g.level]*p.dashPulse,color:'#9be8ff'});
    }
  }
  input.dash=false;
  if(p.dashing>0){
    const travel=Math.min(dt,p.dashing);
    p.dashing-=travel;
    move(p,p.vx*travel,p.vy*travel);
    particle(p.x,p.y,'#b787ff',2,72,1);
  }
  else if(len>0){
    const speed=p.speed*(p.sprintUntil>g.clock?1+p.dashSprint:1);
    move(p,mx/Math.max(1,len)*speed*dt,my/Math.max(1,len)*speed*dt);p.walk+=dt*12;
  }
  else p.walk*=Math.max(0,1-dt*10);
  if(input.down||input.touchFire||K.has('KeyF'))fire();
  if(input.buss)buzz();input.buss=false;
  updateBlasts(dt);
  updateCampaignArena();
  updateCampaignDeployment();
  updateDevil(dt);
  for(const e of g.enemies){if(!e.dead)enemyUpdate(e,dt);if(g.mode!=='play')return;}
  updatePlayerPops(dt);
  for(const h of g.hazards){
    if(h.owner?.dead&&h.wait>0){h.live=0;continue;}
    if(h.wait>0){h.wait-=dt;if(h.wait<=0){h.action?.();if(h.type==='spot'){particle(h.x,h.y,'#ff925c',14,177);sound.tone(216,.14,.07,'square',69);}}}
    else{h.live-=dt;if(h.dmg&&((h.type==='line'&&lineDist(p.x,p.y,h.a,h.b)<h.width/2+p.r*.6)||(h.type==='spot'&&dist(p,h)<h.r+p.r*.6)))hurt(h.dmg,'hazard');}
    if(g.mode!=='play')return;
  }
  g.hazards=g.hazards.filter(h=>h.live>0);
  for(const b of g.enemyPops){if(b.life<=0)continue;const prev={x:b.x,y:b.y};b.a+=(b.turn??0)*dt;b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;b.life-=dt;
    if(lineDist(p.x,p.y,prev,b)<p.r+b.r){
      if(p.dashing>0)closeCall(b);
      else{b.life=0;hurt(b.dmg,'projectile');}
    }
    if(g.mode!=='play')return;
  }
  g.enemyPops=g.enemyPops.filter(b=>b.life>0&&b.x>-18&&b.x<W+18&&b.y>45&&b.y<H+14);
  for(const o of g.items){o.life-=dt;const d=dist(o,p);if(d<80&&d>0){o.x+=(p.x-o.x)/d*dt*180;o.y+=(p.y-o.y)/d*dt*180;}
    if(d<24){
      o.life=0;
      if(healPlayer(19*p.pickupHealing,true)>0){floater(p.x,p.y-17,'+ VIBE','#aaffcf');sound.event('pick');}
    }}
  g.items=g.items.filter(o=>o.life>0);
  for(const f of g.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=160*dt;f.a+=f.spin*dt;f.life-=dt;}
  g.fx=g.fx.filter(f=>f.life>0);
  for(const f of g.floaters){f.life-=dt;f.y-=dt*44;}
  g.floaters=g.floaters.filter(f=>f.life>0);
  g.enemies=g.enemies.filter(e=>!e.dead);
  if(g.story.level.side&&!isFinalWave()){
    if(!g.queue.length&&(!g.enemies.length||g.elapsed>=bonusWaveDuration(g.story.level,g.wave))){
      finishRegularWave();
      openWave(g.wave+1);
    }
  }else if(!g.enemies.length&&!g.queue.length){
    if(g.gap===null){
      g.gap=isBossWave()?1.28:1.35;g.enemyPops=[];g.hazards=[];
      if(!isBossWave()){
        announce('WAVE CLEAR',1.3,'clear');
        finishRegularWave();
      }
    }
    g.gap-=dt;
    if(g.gap<=0){
      if(isBossWave()||isFinalWave())campaignResults(true);
      else openWave(g.wave+1);
    }
  }
  hud();
}
