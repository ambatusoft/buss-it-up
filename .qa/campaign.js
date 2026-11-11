const result=document.createElement('pre');result.id='test-result';document.body.append(result);
const check=(b,m)=>{if(!b)throw new Error(m);};
function playtest(mode,seed){
  let rng=seed;Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223|0)>>>0)/4294967296;
  furthest=0;storage.erase('furthest');
  difficulty=mode;$('start').click();
  const rounds=new Set(), bosses=[], bossMoves=new Map(), checkpointTests=[];
  const stageTimes=Array(stages.length).fill(0), stageDamage=Array(stages.length).fill(0);
  let lastBoss=null,picks=0,t=0,retries=0,minimum=100;
  const failures=[];
  for(let it=0;it<90*1500;it++){
    if(g.mode==='win'){
      check(rounds.size===28,'Missing rounds');check(bosses.length===6,'Missing bosses');
      check(g.stats.waves===22&&g.stats.bosses===6&&g.stats.bots>200&&g.stats.hits<=g.stats.shots&&g.stats.upgrades===12,'Final stats');
      check($('overlay').querySelectorAll('.run-stats dd').length===12,'Final report');
      check(bossMoves.size===6&&[...bossMoves.values()].every(n=>n>=1),'Every boss must attack');
      check(!storage.read('save',null)&&storage.read('best',0)>=g.score,'Victory persistence');
      return{mode,seed,rounds:rounds.size,bosses,attackCycles:[...bossMoves.values()],picks,retries,minimum,
        closeCalls:g.stats.closeCalls,cleanWaves:g.stats.cleanWaves,stageTimes:stageTimes.map(n=>Math.round(n)),stageDamage,
        score:g.score,seconds:Math.round(it/90),checkpointTests,failures};}
    if(g.mode==='fail'){
      const boss=g.enemies.find(e=>e.kind==='boss');
      failures.push({level:g.level+1,wave:g.wave,bossPercent:boss?Math.round(100*boss.hp/boss.max):null,prime:g.primeForm});
      if(++retries>5)throw new Error('Survival check failed on '+mode+' seed '+seed+' '+JSON.stringify(failures)+' build '+JSON.stringify(g.p.loadout));
      const stage=g.level;$('overlay').querySelector('button').click();check(g.level===stage&&g.wave===1&&g.p.hp===g.p.max,'Retry checkpoint');continue;
    }
    if(g.mode==='pick'){
      const choices=[...document.querySelectorAll('.pick-list button')];
      check(choices.length===3&&choices.every(c=>['Common','Rare','Bussted'].includes(c.dataset.tier)),'Upgrade rarity cards');
      check(isBossWave()||g.wave===2,'Upgrade timing');
      if(g.level===4&&isBossWave()){
        check($('route-list').children.length===6&&furthest===5,'Secret stage unlocked after Ambatron');
      }else if(g.level<5)check($('route-list').children.length===5,'Secret stage never shown early');
      const offense=['spread','clip','sax','thesis','burst','highQualityRip','pierce','echoCast','power','rate','candidCut'];
      const defense=['cameo','dash','freeBird','tank','speed','seatbelt','aftershock'];
      const priority=seed===20261111&&g.stats.upgrades%2===0
        ?[...defense,...offense]
        :[...offense,...defense];
      choices.sort((a,b)=>priority.indexOf(a.dataset.perk)-priority.indexOf(b.dataset.perk));
      choices[0].click();picks++;
      if(g.wave===1){check(g.level===storage.read('save',null).level,'Checkpoint stage');checkpointTests.push(g.level+1);}
      continue;
    }
    check(g.mode==='play','Unexpected mode '+g.mode);
    rounds.add(g.level+':'+g.wave);t+=1/90;
    if(isBossWave()&&lastBoss!==g.level){bosses.push(stages[g.level].boss);lastBoss=g.level;}
    const boss=g.enemies.find(e=>e.kind==='boss');
    if(boss)bossMoves.set(g.level,Math.max(bossMoves.get(g.level)||0,boss.pattern));
    const p=g.p;
    const active=g.enemies.filter(e=>!e.dead&&e.spawn<=0);
    const nearest=[...active].sort((a,b)=>dist(p,a)-dist(p,b));
    const target=nearest.find(e=>e.kind==='primePod')||nearest[0];
    minimum=Math.min(minimum,Math.ceil(p.hp));input.down=!!target;
    if(target){input.x=target.x;input.y=target.y;}
    if(p.charge>=100&&target&&dist(target,p)<310&&(active.length>=3||isBossWave()))input.buss=true;
    let dx=0,dy=0, best=-Infinity;
    for(let k=0;k<20;k++){
      const a=k*TAU/20, vx=Math.cos(a),vy=Math.sin(a), x=p.x+vx*58,y=p.y+vy*58;
      if(x<52||x>908||y<90||y>484)continue;
      const next={x,y};
      const nt=nearest[0]?dist(next,nearest[0]):200;
      let value=-(Math.abs(nt-(isBossWave()?266:177)))*.3-Math.hypot(x-480,y-285)*.035;
      value+=Math.cos(a-t*.7)*3;
      for(const e of nearest){
        const d=dist(e,next);
        if(d<130)value-=(130-d)*(d<62?1.8:1);
        if(e.kind==='charger'&&e.wind>0){
          const end={x:e.x+Math.cos(e.lunge)*180,y:e.y+Math.sin(e.lunge)*180};
          if(lineDist(x,y,e,end)<31)value-=85;
        }
      }
      for(const b of g.enemyPops){
        const a2={x:b.x,y:b.y},b2={x:b.x+Math.cos(b.a)*b.s*.37,y:b.y+Math.sin(b.a)*b.s*.37};
        const d=lineDist(x,y,a2,b2);if(d<42)value-=(42-d)*2.3;
      }
      for(const h of g.hazards){
        if(h.type==='line'){const d=lineDist(x,y,h.a,h.b);if(d<h.width*.5+25)value-=150;}
        else if(dist(h,next)<h.r+26)value-=145;
      }
      if(g.safeZone){
        const point=g.safeZone.vertical?x:y;
        if(point<g.safeZone.min+15||point>g.safeZone.max-15)value-=420;
      }
      if(value>best){best=value;dx=vx;dy=vy;}
    }
    input.dx=dx;input.dy=dy;
    if(p.dashCd<=0&&(best<-51||target&&dist(target,p)<49))input.dash=true;
    const damageBefore=g.stats.damage;
    update(1/90);
    stageTimes[g.level]+=1/90;
    stageDamage[g.level]+=g.stats.damage-damageBefore;
    if(it%31===0)render();
  }
  throw new Error('Run timed out at '+g.level+':'+g.wave);
}
try{
  if(sound.enabled)$('audio').click();
  $('archive').click();check($('lore').open&&!$('lore').textContent.includes('The Burnt Server'),'Archive hides secret stage');$('lore').close();
  check($('route-list').children.length===5&&[...$('route-list').querySelectorAll('li b')].slice(1).every(b=>b.textContent==='???'),'Locked route');
  check($('catalog').parentElement.classList.contains('route'),'Files belongs under the map');
  $('catalog').click();check($('field-guide').open&&$('enemy-files').querySelectorAll('button').length===0,'Unencountered enemies absent');$('field-guide').close();
  $('practice').click();check($('practice-dialog').open&&$('practice-list').children.length===0,'Practice requires an encounter');$('practice-dialog').close();
  const rolls=Array.from({length:1000},(_,i)=>rollRarity((i+.5)/1000));
  check(['Common','Rare','Bussted'].every((tier,i)=>rolls.filter(roll=>roll===tier).length===[600,300,100][i]),'60/30/10 rarity thresholds');
  check([1,2,3,4].map(w=>planWave(2,w,'arcade').length).join(',')==='16,16,21,25','Club squad counts');
  $('difficulty').click();check(difficulty==='chill','Difficulty button');
  $('start').click();check(g.mode==='play'&&!$('hud').hidden,'Start button');
  const hp=g.p.hp, y=g.p.y;
  dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW'}));update(1/90);dispatchEvent(new KeyboardEvent('keyup',{code:'KeyW'}));
  check(g.p.y<y,'Keyboard movement');
  $('pause').click();check(g.mode==='pause'&&!$('overlay').inert,'Pause button');$('overlay').querySelector('button').click();check(g.mode==='play'&&$('overlay').inert,'Resume pause');
  g.p.inv=0;hurt(hp*3);check(g.mode==='fail'&&$('overlay').querySelectorAll('.run-stats dd').length===12,'Defeat report');
  $('overlay').querySelectorAll('button')[1].click();check(g.mode==='title'&&!$('continue').hidden,'Title checkpoint');
  $('continue').click();check(g.mode==='play'&&g.wave===1&&g.p.hp===hp,'Resume saved tour');
  enemy('runner',100,100);check(storage.read('enemy-files',[]).includes('runner'),'Catalog discovery persists');
  renderCatalog();
  const firstFile=$('enemy-files').querySelector('table button');
  check(firstFile&&$('enemy-files').querySelectorAll('canvas').length===1,'Catalog shows just the encountered sprite');
  firstFile.click();check($('file-detail').textContent.includes(enemyFiles.runner.note)&&firstFile.textContent.includes('E-01'),'Numbered catalog entry');
  const search=$('file-search');
  search.value='E01';search.dispatchEvent(new Event('input'));
  check($('enemy-files').querySelectorAll('button').length===1,'Catalog number search');
  search.value='xyzxyz';search.dispatchEvent(new Event('input'));
  check($('enemy-files').querySelectorAll('button').length===0,'Catalog search miss');
  search.value='';search.dispatchEvent(new Event('input'));
  g.p.loadout.cameo=1;g.p.inv=0;hurt(hp*3);check(g.mode==='play'&&g.cameoUsed&&g.p.hp>0,'Bussted Cameo saves a lethal hit');
  g.p.aim=0;g.p.charge=100;
  const front={x:g.p.x+124,y:g.p.y,r:6,kind:'runner',hp:210,max:210,spawn:0};
  const rear={...front,x:g.p.x-124};
  g.enemies=[front,rear];g.enemyPops=[{...front},{...rear}];
  buzz();
  check(front.hp<210&&rear.hp===210&&g.enemyPops.length===1&&g.enemyPops[0].x===rear.x&&g.stats.bursts===1,'Directional burst');
  g.p.charge=40;g.p.closeCalls=0;g.p.loadout.freeBird=1;g.p.loadout.highQualityRip=1;
  const projectiles=Array.from({length:4},()=>({x:g.p.x,y:g.p.y,life:1}));
  const before=g.stats.shots;
  projectiles.forEach(closeCall);
  check(g.p.charge===64&&g.stats.closeCalls===3&&g.stats.shots-before===3&&projectiles.every(p=>p.life===0),'Close call cap, charge and reflected shots');
  g.enemies=[];g.enemyPops=[];g.pops=[];
  g.p.dashCd=.09;input.dash=true;
  for(let j=0;j<12;j++)update(1/90);
  check(g.p.dashing>0,'Buffered dash fires when cooldown clears');
  openLevel(3);g.queue=[];
  enemy('camerabot',300,280,0);const camera=g.enemies[0];camera.cd=0;
  update(1/90);check(g.hazards.length===2&&g.hazards.every(h=>h.owner===camera),'Camerabot telegraphs');
  damage(camera,camera.hp);update(1/90);
  check(g.hazards.length===0,'Defeating Camerabot cancels pending shots');
  openLevel(4);
  for(let i=0;i<deploymentCap(4,difficulty);i++)enemy('runner',100+i*24,100);
  g.elapsed=3;g.p.inv=2;
  const queued=g.queue.length;update(1/90);
  check(g.queue.length===queued,'Wave queue waits at deployment cap');
  g.enemies.pop();update(1/90);
  check(g.queue.length===queued-1,'One deployment fills an open slot');
  g.wave=2;
  requestUpgrade(false);
  const oldOffer=$('overlay').querySelector('.pick-list button');
  $('overlay').querySelector('.encore').click();
  check(g.p.encores===0&&!oldOffer.isConnected&&!$('overlay').querySelector('.encore'),'Encore replaces offer once');
  oldOffer.click();check(g.mode==='pick','Removed offer cannot be picked');
  $('overlay').querySelector('.pick-list button').click();
  check(g.wave===3&&g.stats.upgrades===1,'Reroll preserves one upgrade pick');
  for(let i=0;i<stages.length;i++){
    openLevel(i);openWave(waveCounts[i]+1);
    const boss=g.enemies[0];
    check(boss.max===Math.round(stages[i].bossHP*bossHealthScale*.76),'Boss health scaling');
    boss.spawn=0;damage(boss,boss.max*.53);
    if(i===4){
      const firstHealth=boss.max;
      check(!g.primeForm,'Prime retains Phase I until empty');
      damage(boss,boss.hp);
      check(g.primeForm&&boss.hp===boss.max&&boss.max===Math.round(firstHealth*.82)&&boss.transform>0&&!damage(boss,10),'Ambatron full Phase II health bar');
    }
    const seen=new Set();
    for(let j=0;j<15*90;j++){
      g.p.inv=2;update(1/90);
      if(g.hazards.some(h=>h.type==='line'))seen.add('line');
      if(g.hazards.some(h=>h.type==='spot'))seen.add('spot');
      if(g.safeZone)seen.add('safe');
      if(boss.charge>0)seen.add('charge');
      g.enemyPops.forEach(b=>seen.add(b.type));
      if(g.enemies.some(e=>e.kind!=='boss'&&e.kind!=='primePod'))seen.add('adds');
    }
    const required=[['line','charge','plate'],['line','charge','ticket'],['note'],['spot','adds'],['line','plasma','spot','adds'],['line','spot','ember','safe','adds']][i];
    check(boss.pattern>=4&&required.every(k=>seen.has(k)),'Boss patterns for '+stages[i].boss+': '+[...seen]);
    if(i===4){
      const health=boss.hp;
      damage(boss,100);check(Math.abs(health-boss.hp-32)<.01,'Prime pod shield');
      boss.pods.forEach(pod=>damage(pod,pod.max));
      const exposed=boss.hp;damage(boss,100);
      check(exposed-boss.hp===100&&$('toast').textContent==='CORE EXPOSED','Prime core exposure');
    }
  }
  const saved=JSON.stringify(storage.read('save',null)), bestBefore=storage.read('best',0);
  title();$('practice').click();
  const practiceButton=[...$('practice-list').querySelectorAll('button')].find(b=>b.textContent.includes('Third Impact'));
  check(practiceButton,'Phase II practice unlocks');practiceButton.click();
  check(g.practice?.phaseTwo&&g.primeForm&&isBossWave(),'Practice enters Phase II');
  const practiceBoss=g.enemies[0];practiceBoss.transform=0;
  practiceBoss.pods.forEach(pod=>damage(pod,pod.max));damage(practiceBoss,practiceBoss.hp);
  for(let j=0;j<130;j++)update(1/90);
  check(g.mode==='practice-report'&&saved===JSON.stringify(storage.read('save',null))&&bestBefore===storage.read('best',0),'Practice does not overwrite campaign save or high score');
  const runs=[playtest('chill',5042),playtest('arcade',1337),playtest('arcade',20261111)];
  check(discovered.size===Object.keys(enemyFiles).length,'Full bestiary');
  title();$('catalog').click();
  $('enemy-tab').click();check($('enemy-files').querySelectorAll('canvas').length===Object.keys(enemyFiles).length,'All enemy portraits render');
  const fileButtons=$('enemy-files').querySelectorAll('table button');
  fileButtons[0].focus();
  fileButtons[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight'}));
  check(document.activeElement===fileButtons[1],'Arrow moves between file cards');
  fileButtons[1].dispatchEvent(new KeyboardEvent('keydown',{key:'End'}));
  check(document.activeElement===fileButtons[fileButtons.length-1],'End moves to the last file card');
  $('perk-tab').click();check($('enemy-files').querySelectorAll('button').length===storage.read('perk-files',[]).length,'Upgrade discoveries in Files');
  check(Object.keys(bundledAudio).length===18,'Bundled music and fourteen distinct clips');
  check(new Set(Object.values(recordedCues).map(cue=>cue[0])).size===14,'Each voice clip assigned to gameplay');
  $('field-guide').close();
  $('start').click();check($('reset-data').hidden,'Reset is available only from the menu');
  title();
  const previousSave=storage.read('save',null), previousBest=high;
  $('reset-data').click();
  check(resetDialog.open&&document.activeElement.value==='cancel','Reset dialog focuses Cancel');
  resetDialog.querySelector('[value="cancel"]').click();
  check(!resetDialog.open&&storage.read('save',null).level===previousSave.level&&high===previousBest,'Cancel preserves progress');
  $('reset-data').click();$('confirm-reset').click();
  check(!resetDialog.open&&$('continue').hidden&&$('best').textContent==='000000'&&$('catalog-count').textContent==='0','Reset refreshes the main menu');
  check($('route-list').children.length===5&&[...$('route-list').querySelectorAll('li b')].slice(1).every(b=>b.textContent==='???'),'Reset relocks the route');
  check(['save','best','furthest','enemy-files','perk-files','mode','audio'].every(key=>storage.read(key,null)===null),'Reset clears stored game data');
  result.textContent=JSON.stringify(runs);
}catch(e){result.textContent='FAIL '+e.message+' '+e.stack.replace(/\s+/g,' ').slice(0,480);}
