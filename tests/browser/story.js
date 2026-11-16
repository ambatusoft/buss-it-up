const result=document.createElement('pre');
result.id='test-result';
result.hidden=true;
document.body.append(result);
const check=(condition,message)=>{if(!condition)throw new Error(message);};
const button=selector=>$('campaign-content').querySelector(selector);

function selectAndStart(level){
  showCampaign('map',level.id);
  check(button(`[data-level="${level.id}"]`).getAttribute('aria-pressed')==='true','Map selection '+level.id);
  button(`[data-start-level="${level.id}"]`).click();
  if($('controls-dialog').open)$('controls-start').click();
  check(g.mode==='play' && g.story.level===level && g.wave===1,'Start story level '+level.id);
}

function playStoryLevel(level){
  selectAndStart(level);
  const rounds=new Set();
  const challenges=new Set();
  let ticks=0, retries=0, phases=0, bossPatterns=0,minVibe=100;
  const failedWaves=[];
  while(ticks<90*1020){
    if(g.mode==='story-clear')return {rounds:rounds.size,phases,bossPatterns,hazards:challenges.size,retries,score:g.score,minVibe,time:Number(g.stats.time.toFixed(2)),speed:campaignProfile.medals[level.id].includes('speed')};
    if(g.mode==='story-fail'){
      failedWaves.push(g.wave+(g.enemies.some(bot=>bot.satanPhase)?' (second form)':''));
      check(++retries<=5,`Failed ${level.id} at waves ${failedWaves.join(', ')} (${Math.round(ticks/90)} seconds)`);
      $('overlay').querySelector('button').click();
      check(g.story.level===level&&g.wave===1&&g.p.hp===g.p.max,'Retry starts from wave one');
      continue;
    }
    check(g.mode==='play','Unexpected story mode '+g.mode);
    rounds.add(g.wave);
    minVibe=Math.min(minVibe,Math.round(g.p.hp/g.p.max*100));
    if(g.storyHazards)challenges.add(g.wave);
    const boss=g.enemies.find(e=>e.kind==='boss');
    if(boss)bossPatterns=Math.max(bossPatterns,boss.pattern);
    if(g.primeForm||boss?.satanPhase)phases=2;
    if(isBossWave())phases=Math.max(phases,1);
    steerPlaytest(++ticks/90);
    update(1/90);
    if(ticks%143===0)render();
  }
  throw new Error(`Timed out at ${level.id} wave ${g.wave} with ${g.enemies.length} enemies, ${g.queue.length} queued, ${Math.round(g.p.hp)} Vibe. Retries at waves ${failedWaves.join(', ')}`);
}

function playStory(seed){
  let rng=seed;
  Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223|0)>>>0)/4294967296;
  saveCampaignProfile(freshCampaignProfile());
  const reports=[];
  for(const level of campaignLevels){
    check(campaignUnlocked(level,campaignProfile),'Unlocked '+level.id);
    const next=campaignLevelById.get(level.next);
    if(next&&!level.side)check(!campaignUnlocked(next,campaignProfile),'Next main level stays locked until clear');
    const stats=playStoryLevel(level);
    check(stats.rounds===campaignRoundCount(level),'Expected wave count for '+level.id);
    check(level.finale?stats.phases>0&&stats.bossPatterns>0:stats.phases===0,'Boss belongs to area finale');
    if(['third-impact','encore'].includes(level.id))check(stats.phases===2,'Second form in '+level.id);
    check(campaignProfile.cleared.length===level.index+1,'Exactly one first clear saved');
    check(readCampaignProfile().cleared.includes(level.id),'First clear is reloadable');
    check($('overlay').textContent.includes('+'+clearSkillPoints(level)+' skill point'),'First clear shows correct points');
    const unlocks=Object.values(campaignGear).filter(gear=>gear.unlock===level.id);
    const rewardRows=[...$('overlay').querySelectorAll('.result-reward-gear')];
    check(rewardRows.length===unlocks.length&&rewardRows.every((row,index)=>{
      const gear=unlocks[index];
      return row.querySelector('b').textContent===gear.name&&row.querySelector('path').getAttribute('d')===gear.icon&&
        row.style.getPropertyValue('--slot')===gearSlots[gear.slot].color;
    }),'First clear lists all unlocked gear with its icon and color');
    if(level.id==='ambatunut'){
      const viewport=$('viewport');
      viewport.style.width='390px';
      const card=$('overlay').querySelector('.result-card');
      check(card.scrollHeight<=card.clientHeight,'All three gear rewards and the Next button fit on a narrow clear screen');
      viewport.style.width='';
    }
    const loadout={interview:['snowNut'],donut:['spread'],anger:['shock'],transfer:['quickstep'],driver:['rapid'],'bus-edit':['plate','beam'],dreamyfantasia:['needle','pierceNut'],thesis:['echo'],candid:['stabilizer'],'final-cut':['cameo'],'lost-take':['coldest','toxinNut'],sungut:['frame'],'red-tag':['cameo'],encore:['overdub','toxinNut']};
    for(const id of loadout[level.id]??[]){
      check(campaignOwned(campaignProfile).has(id),'Gear unlocked for '+level.id);
      check(equipCampaignGear(id),'Unlocked gear equips');
    }
    const priority=['power','vibe','cadence','guard','reverb','waveguard','movespeed','cooldown','signal','cleansignal','bosscharge','pierce','reach','loud','aftershock','burstheal','close','cast','grace','refill','cleanheal','hazardguard'];
    for(const id of priority)if(purchaseCampaignSkill(id))break;
    if(level.index===0)check(campaignProfile.skills.power===true&&!purchaseCampaignSkill('power'),'First skill purchases once');
    check(campaignVisibleAreas(campaignProfile)===(campaignProfile.cleared.includes('third-impact')?6:5),'Hidden area reveal timing');
    check($('overlay').querySelector('.result-win .result-face')&&$('overlay').querySelector('.actions').children.length===1&&$('overlay').querySelector('.actions button').textContent==='Next','Win portrait and Next-only result');
    if(level.id==='encore'){
      check($('overlay').textContent.includes('Clean Slate'),'Story ending displayed');
      check(readCampaignProfile().records.encore.score===g.score,'Level record persisted');
    }
    $('overlay').querySelector('.actions button').click();
    check(g.mode==='campaign'&&campaignSelection===(next?.id??level.id),'Next returns to the map on the expected level');
    reports.push([level.id,stats]);
  }
  const points=campaignPoints(campaignProfile);
  playStoryLevel(campaignLevels[0]);
  check(campaignPoints(campaignProfile)===points&&campaignProfile.cleared.length===30,'Replay gives no duplicate skill point');
  check(!$('overlay').querySelector('.result-rewards'),'Replay omits first clear rewards');
  return {seed,reports,replayPoints:points};
}

function verifyTouchControls(){
  const match=window.matchMedia.bind(window), stick=$('stick'), fire=$('touch-fire');
  window.matchMedia=query=>query==='(pointer:coarse)'?{matches:true}:match(query);
  stick.setPointerCapture=fire.setPointerCapture=()=>{};
  const pointer=(node,type,id,clientX=0,clientY=0)=>node.dispatchEvent(new PointerEvent(type,{pointerId:id,pointerType:'touch',clientX,clientY}));
  try{
    selectAndStart(campaignLevels[0]);
    check(!$('touch').hidden,'Touch controls visible in coarse pointer mode');
    const bounds=stick.getBoundingClientRect();
    const x=g.p.x;
    pointer(stick,'pointerdown',1,bounds.right,bounds.top+bounds.height/2);
    update(1/90);
    check(g.p.x>x,'Touch stick moves player');
    pointer(stick,'pointercancel',1);
    check(input.dx===0,'Touch stick releases on cancellation');
    const target=enemy('runner',g.p.x+95,g.p.y,0);
    pointer(fire,'pointerdown',2);
    update(1/90);
    check(g.stats.shots===1&&Math.abs(g.p.aim-angle(g.p,target))<.04,'Touch pop aims at nearest bot');
    pointer(fire,'pointerup',2);
    check(!input.touchFire,'Touch fire releases');
    g.p.charge=100;
    pointer($('touch-dash'),'pointerdown',3);
    pointer($('touch-buss'),'pointerdown',4);
    update(1/90);
    check(g.stats.dashes===1&&g.stats.bursts===1,'Touch dash and Burst activate');
  }finally{
    window.matchMedia=match;
    delete stick.setPointerCapture;delete fire.setPointerCapture;
    showCampaign('map','interview');
  }
}

function verifyHudLayout(){
  const viewport=$('viewport');
  const title=$('level-name'), originalTitle=title.textContent;
  g.p.charge=100;g.combo=12;g.comboT=2;hud();
  title.textContent=campaignLevels.map(levelLabel).reduce((longest,label)=>label.length>longest.length?label:longest,'');
  for(const width of ['', '390px', '320px']){
    viewport.style.width=width;
    const vibe=$('vibe-meter').getBoundingClientRect();
    const dash=$('dash-meter').getBoundingClientRect();
    const buss=$('buss-meter').getBoundingClientRect();
    const streak=$('combo-status').getBoundingClientRect();
    const ready=$('buss-status').getBoundingClientRect();
    check(vibe.width===dash.width&&dash.width===buss.width&&vibe.height>dash.height&&dash.height===buss.height,'Meters align and Vibe is thicker');
    check(streak.left>vibe.right&&ready.left>vibe.right&&streak.bottom<=ready.top,'HUD labels sit in separate rows outside the meters');
    const statusRight=Math.max(streak.right,ready.right);
    const titleLeft=title.getBoundingClientRect().left;
    check(statusRight<titleLeft,'Status labels leave the level title clear at '+(width||'desktop')+' ('+statusRight+' vs '+titleLeft+')');
    const records=document.querySelector('.hud-records').getBoundingClientRect();
    const timer=$('speed-clock').getBoundingClientRect();
    const target=$('speed-medal-target').getBoundingClientRect();
    const score=$('score').getBoundingClientRect();
    check(title.getBoundingClientRect().right<records.left,'Level title leaves the timer and score clear at '+(width||'desktop'));
    check(score.right<timer.left&&timer.bottom<=target.top&&records.right<$('pause').getBoundingClientRect().left,'Time and target fit next to the score at '+(width||'desktop'));
  }
  check(getComputedStyle($('dash-fill')).animationName==='none','Full Dash stays steady');
  const fill=getComputedStyle($('buss-fill')),label=getComputedStyle($('buss-status'));
  check(fill.animationIterationCount==='infinite'&&fill.animationName===label.animationName&&fill.animationDuration===label.animationDuration,'Full Buss bar and label pulse together');
  check(['hp-fill','dash-fill','buss-fill'].every(id=>getComputedStyle($(id)).backgroundImage==='none'),'The three meter fills are solid colors');
  title.textContent=originalTitle;
  viewport.style.width='';
  g.p.charge=48;g.combo=0;g.comboT=0;hud();
}

function verifyBuildEffects(){
  const profile=freshCampaignProfile();
  saveCampaignProfile(profile);
  showCampaign('gear','interview');
  button('[data-armory="gear"]').click();
  button('[data-slot="nut"]').click();
  const nutDescription=id=>button('[data-equip="'+id+'"]').closest('.gear-item').querySelector('p').textContent;
  check(nutDescription('toxinNut')==='???'&&button('[data-equip="toxinNut"]').disabled&&
    nutDescription('plainNut')===campaignGear.plainNut.text,'Locked gear hides the description while starter gear shows it');
  saveCampaignProfile({...profile,cleared:campaignLevels.map(level=>level.id),tutorial:true});
  renderCampaign();
  check(nutDescription('toxinNut')===campaignGear.toxinNut.text&&!button('[data-equip="toxinNut"]').disabled,'Unlocking gear reveals its description');
  button('[data-slot="popper"]').click();
  button('[data-armory="skills"]').click();button('[data-skill-node="power"]').click();button('[data-buy="power"]').click();
  check(campaignPlayer(campaignProfile).dmg>initial().dmg&&campaignPoints(campaignProfile)===41,'Node purchase changes the build');
  const cadence=button('[data-skill-node="cadence"]');
  cadence.click();cadence.click();
  check(button('[data-skill-node="cadence"]')===cadence&&button('[data-buy="cadence"]').textContent.includes('2 SP'),'Node stays mounted for double-click and shows cost');
  cadence.dispatchEvent(new MouseEvent('dblclick',{bubbles:true}));
  check(campaignProfile.skills.cadence&&campaignPoints(campaignProfile)===39&&!purchaseCampaignSkill('cadence'),'Double-click purchases once at the displayed cost');
  const pan=button('.skill-pan');
  check(pan.scrollHeight>pan.clientHeight&&pan.scrollWidth>pan.clientWidth,'Tree extends beyond its bordered viewport');
  pan.setPointerCapture=()=>{};
  for(const [type,clientX,clientY] of [['pointerdown',0,0],['pointermove',-5000,-5000],['pointerup',-5000,-5000]]){
    pan.dispatchEvent(new PointerEvent(type,{pointerId:8,isPrimary:true,clientX,clientY}));
  }
  check(Math.abs(pan.scrollLeft-(pan.scrollWidth-pan.clientWidth))<1&&Math.abs(pan.scrollTop-(pan.scrollHeight-pan.clientHeight))<1,'Pointer pan stops at tree borders');
  button('[data-armory="gear"]').click();
  check($('campaign-content').querySelectorAll('[data-slot]').length===6&&button('[data-slot="nut"]'),'Six gear slots including Nut Effect');
  const statGroups=[...$('campaign-content').querySelectorAll('.stat-group')];
  check(statGroups.length===4&&statGroups.map(group=>group.children.length).join()==='2,3,2,2'&&statGroups.every((group,index)=>!index||group.offsetTop>statGroups[index-1].offsetTop),'Build stats form four vertical groups');
  check(statGroups[3].textContent.includes('Burst damage')&&!statGroups[3].querySelector('dd').textContent.includes('%'),'Burst damage is shown as hit damage');
  const popHeight=button('.volley-power').parentElement.getBoundingClientRect().height;
  for(const id of ['cluster','overdrive','playback','twin','standard']){
    equipCampaignGear(id);renderCampaign();
    const value=button('.volley-power'),row=value.parentElement;
    check(getComputedStyle(value).textAlign==='right'&&row.getBoundingClientRect().height===popHeight&&value.scrollWidth<=value.clientWidth&&
      value.getBoundingClientRect().bottom<=row.getBoundingClientRect().bottom,'Pop power fits the fixed box for '+id);
  }
  const gates=[...$('campaign-content').querySelectorAll('[data-equip]')].map(node=>campaignLevelById.get(campaignGear[node.dataset.equip].unlock)?.index??-1);
  check(gates.every((gate,index)=>!index||gate>=gates[index-1]),'Equipment follows unlock order');
  button('[data-equip="twin"]').click();
  startCampaignLevel('interview');g.p.aim=0;fire();
  check(g.pops.length===2&&Math.abs(g.pops[0].y-g.pops[1].y)>15,'Twin gear fires separated shots');
  check(g.pops.every(pop=>pop.d===g.p.dmg)&&popPowerLabel(g.p).endsWith('×2'),'Twin shot damage lives on the equipped pop power');
  const twinDps=g.pops.reduce((sum,pop)=>sum+pop.d,0)/g.p.rate;
  equipCampaignGear('rapid');startCampaignLevel('interview');fire();
  check(g.pops[0].d/g.p.rate>twinDps*1.12,'Repeater beats Double Take at point blank');
  equipCampaignGear('spread');startCampaignLevel('interview');fire();
  check(g.pops.length===3&&g.pops.every(pop=>pop.d===g.p.dmg)&&Math.abs(g.p.dmg*3/(initial().dmg*1.12)-1.96)<1e-8,'Scatter splits its old volley damage equally');
  equipCampaignGear('bounce');startCampaignLevel('interview');g.p.aim=.1;fire();
  check(g.pops.length===8&&g.pops.every((pop,index)=>pop.d===g.p.dmg&&pop.a===index*Math.PI/4)&&
    Math.abs(g.p.dmg-initial().dmg*.35*1.12)<1e-8,'Eight-Way Cut fires in the fixed compass directions at 35% power');
  const bass=initial(),needle=initial(),compass=initial(),boots=initial(),plate=initial();
  campaignGear.lob.apply(bass);campaignGear.needle.apply(needle);campaignGear.bounce.apply(compass);
  campaignGear.driftSoles.apply(boots);campaignGear.plate.apply(plate);
  check(Math.abs(bass.dmg-initial().dmg*2.15*1.05)<1e-8&&Math.abs(bass.rate-initial().rate*1.4/.85)<1e-8&&
    needle.popSpeed===initial().popSpeed*1.6&&compass.rate===initial().rate*.88,'Revised Popper damage, cadence and travel speed');
  check(boots.dashSprint===.45&&boots.dashSprintTime===1.5&&plate.incoming===.86&&plate.speed===initial().speed*.92,'Revised Drift Soles and Bouncer Plate tuning');
  equipCampaignGear('driftSoles');startCampaignLevel('interview');
  input.dash=true;update(1/90);
  check(Math.abs(g.p.sprintUntil-g.clock-g.p.dashDuration-1.5)<1e-8,'Drift Soles boost movement for 1.5 seconds after the dash');
  equipCampaignGear('longstep');startCampaignLevel('interview');
  check(g.p.dashDuration===initial().dashDuration*1.55&&g.p.dashMax===initial().dashMax,'Stretch This extends the dash at the normal cooldown');
  equipCampaignGear('stabilizer');startCampaignLevel('interview');
  const dashMeter=$('dash-meter');
  check(g.p.dashMax===initial().dashMax*1.35&&readyDashes(g.p)===2&&dashMeter.classList.contains('two-charges')&&
    dashMeter.getAttribute('aria-valuetext')==='2 of 2 dashes ready','Classy Stabilizer starts with two longer-recharging charges and a split meter');
  input.dash=true;update(1/90);
  check(readyDashes(g.p)===1&&g.stats.dashes===1,'One dash spends one charge');
  check(getComputedStyle($('dash-fill')).transitionDuration==='0s'&&
    Math.abs($('dash-fill').getBoundingClientRect().width/dashMeter.getBoundingClientRect().width-.5)<.01,
    'Spending one of two charges immediately drops the meter to half');
  for(let i=0;i<17;i++)update(1/90);
  const firstRecharge=g.p.dashCd;
  input.dash=true;update(1/90);
  check(g.stats.dashes===2&&readyDashes(g.p)===0&&Math.abs(g.p.dashCd-(firstRecharge-1/90+g.p.dashMax))<1e-8,
    'The second dash preserves the first charge’s recharge progress');
  for(let i=0;i<17;i++)update(1/90);
  input.dash=true;update(1/90);
  check(g.stats.dashes===2,'A third dash waits for a charge');
  g.p.dashCd=g.p.dashMax+.005;
  update(1/90);
  check(g.stats.dashes===3&&readyDashes(g.p)===0,'A buffered dash spends the next charge as soon as it returns');
  g.p.dashCd=g.p.dashMax+.005;
  update(1/90);
  check(readyDashes(g.p)===1&&dashMeter.getAttribute('aria-valuetext')==='1 of 2 dashes ready','First charge returns by itself');
  g.p.dashCd=.005;
  update(1/90);
  check(readyDashes(g.p)===2,'Last charge returns after its own cooldown');
  equipCampaignGear('stock');startCampaignLevel('interview');
  check(!dashMeter.classList.contains('two-charges')&&!dashMeter.hasAttribute('aria-valuetext'),'Single-dash builds reset the meter');
  input.dash=true;update(1/90);
  check($('dash-fill').getBoundingClientRect().width===0,'Spending a single charge immediately empties the meter');
  equipCampaignGear('overdrive');startCampaignLevel('interview');g.volley=3;fire();
  check(g.pops.length===6&&g.pops.every(pop=>pop.d===g.p.dmg*.68),'Overdrive fourth volley fires six equal-strength pellets');
  equipCampaignGear('playback');startCampaignLevel('interview');g.p.aim=0;fire();
  check(g.pops.length===2&&g.pops[0].d===g.p.dmg*.8&&g.pops[1].d===g.p.dmg*1.8&&
    Math.cos(g.pops[0].a)>.99&&Math.cos(g.pops[1].a)<-.99,'Reverse Playback uses the correct directional damage');
  equipCampaignGear('cluster');startCampaignLevel('interview');fire();
  check(g.pops.length===5&&g.pops.every(pop=>!pop.effect),'Nut Cracker spreads five plain pellets');
  equipCampaignGear('splashNut');startCampaignLevel('interview');fire();
  check(g.pops.length===5&&g.pops.every(pop=>pop.effect?.splash>0),'Nut Effect adds splash independently');
  check(g.p.revive===0&&!campaignSkills.some(skill=>skill.id==='rescue'),'Skill tree has no revive');
  equipCampaignGear('cameo');startCampaignLevel('interview');
  check(g.p.revive===.30,'Cameo pendant grants revive');
  g.p.inv=0;hurt(999);
  check(g.mode==='play'&&g.p.hp===Math.ceil(g.p.max*.30)&&g.p.inv===3&&g.reviveEffect>1&&g.cameoUsed,'Cameo revives once with two extra seconds of protection');
  g.p.inv=0;hurt(999);
  check(g.mode==='story-fail','A second lethal hit ends the attempt');
  equipCampaignGear('capacitor');startCampaignLevel('interview');
  check(g.p.charge===80,'Paza Capacitor starts with 80 charge');
  g.p.charge=19;
  openWave(2);
  check(g.p.charge===54,'Paza Capacitor adds 35 charge at each later wave');
  equipCampaignGear('token');
  equipCampaignGear('firstFrame');startCampaignLevel('interview');
  check(g.p.inv===6.7,'Red Tag Guard grants 6.7 seconds at wave start');
  equipCampaignGear('frame');startCampaignLevel('interview');
  g.p.inv=0;hurt(5);
  check(g.p.inv===3.5,'Core Padding adds 2.5 seconds to the base second of hit protection');
  equipCampaignGear('vest');
  check(equipCampaignGear('ricochetNut'),'Equip rebound');
  startCampaignLevel('interview');
  playerPop({x:941,y:260},0,30,0,'#fff',0,0,true,g.p.nut);updatePlayerPops(1/90);
  check(g.pops[0].bounces===0&&Math.cos(g.pops[0].a)<-.9&&Math.abs(g.pops[0].life-(g.p.shotLife+.8-1/90))<1e-8,'Rebound duration bonus is applied exactly once');
  check(equipCampaignGear('snowNut'),'Equip Cold Open Nut Effect');
  startCampaignLevel('interview');
  const target=enemy('guard',g.p.x+42,g.p.y,0);
  playerPop(g.p,0,12,0,'#fff',26,0,true,g.p.nut);
  for(let i=0;i<5;i++)updatePlayerPops(1/90);
  check(target.slow>0,'Freeze shot slows a regular bot');
  const elite={kind:'boss'};
  applyNutEffect(elite,{effect:{slow:1.25}});
  check(elite.slow>0&&elite.slow<target.slow&&elite.slowPower<target.slowPower,'Boss takes reduced projectile slow');
  applyNutEffect(elite,{effect:{stun:.55}});
  check(elite.slow===.625&&elite.slowPower===.18&&elite.stun===.275&&Math.abs(conditionStep(elite,.1)-.03)<.0001,'Boss slow and stun have exact resistance');
  equipCampaignGear('coldest');startCampaignLevel('anger',true);
  const slowed=g.enemies[0];slowed.spawn=0;g.p.charge=100;g.p.aim=Math.PI/2;buzz();
  check(slowed.stun===2.5&&g.coldFlash>0,'Coldest Moment heavily slows bosses outside Burst');
  const frozen=enemy('runner',850,380,0);g.p.charge=100;buzz();
  check(frozen.stun===5&&conditionStep(frozen,.1)===0,'Coldest Moment freezes a regular enemy outside Burst');
  equipCampaignGear('toxinNut');startCampaignLevel('interview');
  const poisoned=enemy('guard',780,350,0);
  poisoned.hp=poisoned.max=500;
  const poisonedBoss={kind:'boss',hp:500,max:500,spawn:0};
  applyNutEffect(poisoned,{effect:g.p.nut});
  applyNutEffect(poisonedBoss,{effect:g.p.nut});
  for(let tick=0;tick<180;tick++){
    conditionStep(poisoned,1/90);
    conditionStep(poisonedBoss,1/90);
  }
  check(!poisoned.poison&&!poisonedBoss.poison&&[poisoned,poisonedBoss].every(target=>Math.abs(500-target.hp-g.p.dmg*2)<1e-8),
    'Poison deals 100% pop power per second for two seconds to bots and bosses');
  equipCampaignGear('nutCharm');startCampaignLevel('anger',true);
  const charmBoss=g.enemies[0];
  charmBoss.spawn=0;g.p.hp=25;
  const hitCharmBoss=()=>{playerPop(charmBoss,0,1,0,'#fff',0);updatePlayerPops(1/90);};
  for(let i=0;i<9;i++)hitCharmBoss();
  check(g.p.hp===25,'I Need That Nut waits through the ninth boss hit');
  hitCharmBoss();
  check(g.p.hp===27,'I Need That Nut heals two Vibe on the tenth boss hit');
  for(const id of ['signal','cleansignal','bosscharge','cast','cleanheal','vibe','waveguard']){
    check(purchaseCampaignSkill(id),'Skill prerequisite order for '+id);
  }
  equipCampaignGear('hush');equipCampaignGear('pazaRunners');startCampaignLevel('interview');
  const firstBot=enemy('guard',780,350,0),secondBot=enemy('guard',780,250,0);
  firstBot.hp=firstBot.max=secondBot.hp=secondBot.max=1000;
  g.p.inv=0;g.p.charge=0;
  const incoming=()=>[{x:20,y:60,life:6},{x:925,y:495,life:6}];
  g.enemyPops=incoming();
  hurt(5);
  check(g.p.charge===5&&g.enemyPops.every(shot=>shot.life===0)&&[firstBot,secondBot].every(bot=>Math.abs(bot.max-bot.hp-3*g.p.dmg)<1e-8),
    'Batu Khan clears the entire field, charges Burst, and stacks with Bass Echo');
  g.enemyPops=incoming();hurt(5);
  check(g.p.charge===5&&g.enemyPops.every(shot=>shot.life===6),'An invulnerable hit cannot trigger retaliation');
  g.p.inv=0;hurt(5,'hazard');
  check(g.p.charge===10&&g.enemyPops.every(shot=>shot.life===0)&&Math.abs(firstBot.max-firstBot.hp-6*g.p.dmg)<1e-8,
    'Batu Khan also retaliates against hazards and can trigger twice in a wave');
  g.p.dashCd=1;
  damage(firstBot,1000);
  check(g.p.dashCd===0&&g.comboT===2.5,'Paza Runners reset dash cooldown and a pop starts the base streak timer');
  g.enemies=[];g.p.hp=20;g.p.charge=0;g.waveHit=false;
  finishRegularWave();
  check(g.p.hp===40&&g.p.charge===100,'Reset the Set heals 20 Vibe and Clean Plate fills Burst');
  equipCampaignGear('token');startCampaignLevel('interview');
  g.p.charge=0;
  const intercepted=Array.from({length:3},()=>({x:g.p.x,y:g.p.y,life:1}));
  intercepted.forEach(closeCall);
  check(intercepted.every(bullet=>bullet.life===0)&&g.stats.closeCalls===1&&g.p.charge===5&&g.score===25,
    'Every intercepted projectile is cleared but only one counts for charge and score');
  input.dash=true;update(1/90);
  closeCall({x:g.p.x,y:g.p.y});
  check(g.p.charge===10&&g.stats.closeCalls===2,'Close Call is available again on the next dash');
  equipCampaignGear('rip');equipCampaignGear('fareback');startCampaignLevel('interview');
  g.p.dashCd=1.4;
  intercepted.forEach(closeCall);
  check(Math.abs(g.p.dashCd-.9)<1e-8&&g.pops.length===1,'Night Return and High Quality Rip trigger once');
  equipCampaignGear('echoCast');startCampaignLevel('interview');
  const popped=enemy('guard',300,280,0);
  const near=enemy('guard',380,280,0),behind=enemy('guard',445,280,0);
  near.hp=near.max=behind.hp=behind.max=1000;
  damage(popped,1000);
  for(let i=0;i<30;i++)updatePlayerPops(1/90);
  check(near.hp<near.max&&behind.hp===behind.max,'Amboutabass Echo hits only one target');
  check(purchaseCampaignSkill('riposte'),'Standing Ovation is available under Ambasing Choir');
  startCampaignLevel('interview');
  damage(enemy('guard',780,350,0),1000);
  check(g.comboT===4,'Standing Ovation extends the streak to four seconds');
  equipCampaignGear('cutoff');startCampaignLevel('interview');g.p.aim=0;g.p.charge=100;g.p.inv=0;
  g.enemyPops=[40,60,80].map(distance=>({x:g.p.x+distance,y:g.p.y,r:5}));
  buzz();
  check(g.p.inv===1&&g.enemyPops.length===0,'Censor Bar earns one second of protection after erasing three shots');
  for(const [id,multiplier,near,far] of [
    ['nova',1.4,{x:-95,y:0},{x:220,y:0}],
    ['beam',1.15,{x:455,y:15},{x:220,y:100}],
    ['remote',1.3,{x:230,y:0},{x:0,y:0}],
    ['switchback',1.05,{x:-305,y:0},{x:10,y:140}]
  ]){
    equipCampaignGear(id);startCampaignLevel('interview');g.p.aim=0;g.p.charge=100;buzz();
    check(g.p.burstDamage===initial().burstDamage*multiplier,'Burst damage multiplier '+id);
    const position=point=>({x:g.p.x+point.x,y:g.p.y+point.y,r:1});
    check(inBurst(g.echoAt,position(near))&&!inBurst(g.echoAt,position(far)),'Burst geometry '+id);
  }
  equipCampaignGear('echo');startCampaignLevel('interview');g.p.x=480;g.p.y=280;g.p.aim=Math.PI/4;g.p.charge=100;
  g.enemyPops=[{x:30,y:280},{x:920,y:485},{x:480,y:75}];
  buzz();
  check(g.p.burstDamage===initial().burstDamage*.90&&g.enemyPops.length===1&&g.enemyPops[0].x===30,
    'Six-Point Signal reaches far corners, includes a notch, and stays fixed while aiming elsewhere');
  equipCampaignGear('overdub');startCampaignLevel('anger',true);g.p.charge=100;
  const burstBoss=g.enemies[0];
  Object.assign(burstBoss,{x:g.p.x,y:g.p.y-35,spawn:0,hp:1500,max:1500});
  const innerTarget=enemy('guard',g.p.x+35,g.p.y,0),outerTarget=enemy('guard',g.p.x+150,g.p.y,0);
  innerTarget.hp=innerTarget.max=outerTarget.hp=outerTarget.max=600;
  buzz();
  const firstHit=[innerTarget,outerTarget,burstBoss].map(target=>target.hp);
  for(let i=0;i<134;i++)updateBlasts(1/90);
  check([innerTarget,outerTarget,burstBoss].every((target,index)=>target.hp===firstHit[index]),'Bootleg Overdub waits the full 1.5 s');
  updateBlasts(1/90);
  check(Math.abs(firstHit[0]-innerTarget.hp-.70*(600-firstHit[0]))<1e-8&&
    Math.abs(firstHit[2]-burstBoss.hp-.70*(1500-firstHit[2]))<1e-8&&outerTarget.hp===firstHit[1],
    'The smaller aftershock deals 70% of the first blast to a bot and a boss');
  for(const id of ['reverb','reach','loud'])check(purchaseCampaignSkill(id),'Bass Boost prerequisite '+id);
  startCampaignLevel('encore',true);
  const satan=g.enemies[0];
  satan.spawn=0;
  const beforeHit=satan.hp;
  damage(satan,100);
  check(Math.abs(beforeHit-satan.hp-100*.53*1.2)<1e-8,'Bass Boost applies through first-phase boss defenses');
  transformSatan(satan);
  satan.transform=0;
  check(g.serverGlass.stage===0,'The second phase begins with intact glass');
  satan.hp=satan.max*.75+1;
  damage(satan,5);
  check(g.serverGlass.stage===1&&!serverPortraitAt(g.serverGlass,g.clock),'First crack appears at 75% health with no portrait');
  satan.hp=satan.max*.5;
  const half=satan.hp;
  damage(satan,100);
  const afterHalf=satan.hp;
  damage(satan,100);
  check(Math.abs(half-afterHalf-100*.77*1.2)<1e-8&&Math.abs(afterHalf-satan.hp-100*.77)<1e-8,
    'Bass Boost uses the active boss phase health and stops below half');
  check(g.serverGlass.stage===2,'Second crack appears at 50% health');
  const portraitStart=g.serverGlass.portraitsAt;
  check(serverPortraitAt(g.serverGlass,portraitStart+.16)?.index===0&&!serverPortraitAt(g.serverGlass,portraitStart+.65)&&
    serverPortraitAt(g.serverGlass,portraitStart+1.34)?.index===1,'Portraits pulse and cycle in the background at half health');
  const frames=new Set();
  for(let i=0;i<6;i++){
    satan.cd=0;
    hellbootUpdate(satan,1/90);
    frames.add(satan.monitorFrame);
  }
  check($('toast').textContent==='THAT PC BELONGS TO SATAN','Transformation uses its distinct warning');
  check(frames.size===6&&satan.monitorUntil>g.clock,'Second-form attacks use all six monitor frames');
  satan.hp=satan.max*.25+1;
  damage(satan,5);
  check(g.serverGlass.stage===3&&g.serverGlass.portraitsAt===portraitStart,'Third crack leaves the portrait cycle running');
  const particles=g.fx.length;
  damage(satan,1e7);
  check(satan.dead&&g.serverGlass.stage===4&&g.fx.length>particles+160&&g.finishTime===g.stats.time,
    'Lethal hit shatters the glass with an explosion and stops the timer');
  check(!serverPortraitAt(g.serverGlass,portraitStart+.16),'Power loss stops the portraits');
  showCampaign('map','interview');
}

try{
  sound.enabled=false;
  check(campaignLevels.length===30&&campaignLevelById.size===30,'Unique story levels');
  check(campaignLevels.every(level=>level.speedTarget%5===0),'Medal targets are in five-second steps');
  check(campaignAreas.every(area=>!area.boss.includes('//')),'Boss names have no suffix separators');
  check(!document.querySelector('[name="difficulty"]'),'Single campaign ruleset');
  check(!document.querySelector('.route,.control-strip,#start,#continue'),'Only the story menu and arena are present');
  check(campaignLevels.flatMap(level=>level.waves).length===166,'Regular wave count');
  for(const [index,area] of campaignAreas.entries()){
    const route=campaignLevels.filter(level=>level.areaIndex===index);
    check(area.map.length===route.length&&route.length===5&&route[3].finale&&route[4].side&&route[4].requires===route[1].id&&route[1].next===route[2].id&&campaignArenaEvents[area.modifier]&&stages[index],'Area content and optional branch');
    for(const level of route)for(const wave of level.waves){
      check(campaignRoundCount(level)===[4,5,5,6,6,6][index]+(level.side?2:0)&&wave.length>=2&&wave.flatMap(group=>parseSquad(group).bots).every(kind=>enemyTypes[kind]||enemyTypes[campaignBotTypes[kind]?.base]),'Wave structure in '+level.id);
    }
    const specialists=new Set(route.flatMap(level=>level.waves.flatMap(wave=>wave.flatMap(group=>parseSquad(group).bots))).filter(id=>specialFoes[id]));
    check(specialists.size===2&&route[4].number===(index+1)+'-X','Two specialist enemies and an X branch in '+area.name);
  }
  check(Object.values(campaignGear).every(gear=>gear.icon&&gearSlots[gear.slot]&&(!gear.unlock||campaignLevelById.has(gear.unlock))),'Equipment metadata');
  check(new Set(Object.values(campaignGear).map(gear=>gear.icon)).size===Object.keys(campaignGear).length,'Unique gear icons');
  check(Object.keys(campaignGear).length===50&&['orbit','frost','crumbNut','deepFreeze','deadAir','freebird'].every(id=>!campaignGear[id]),'Removed gear is absent from the roster');
  check(document.title==='Buss it Up! - Dreamybull Shooter'&&$('story-entry').textContent==='Start','Release title and first-run Start label');
  $('story-entry').click();
  check($('story-slots').open&&$('story-slot-list').children.length===3,'Three Story slots');
  $('story-slot-list').querySelector('[data-story-slot="1"]').click();
  check(!$('campaign-reset-dialog').open,'An empty slot starts without a difficulty prompt');
  check(!$('campaign-screen').hidden&&campaignVisibleAreas(campaignProfile)===5,'Fresh map only shows five areas');
  check($('campaign-heading').textContent===campaignAreas[0].name,'Level selection shows the area name');
  check(!button('.map-dispatch-heading small')&&!button('.story-record'),'Fresh map card omits wave and time counts');
  check(button('.map-dispatch-heading h3').textContent==='1-1: Ambatu Interview'&&button('[data-level="interview"] span').textContent==='Ambatu Interview','Level selection shows mission names');
  check(document.documentElement.scrollHeight===innerHeight&&$('campaign-settings').offsetTop>=0,'Map fits the viewport');
  check(button('[data-level="donut"]').disabled&&!equipCampaignGear('spread'),'Locked level and gear are unavailable');
  const original=campaignProfile;
  const launchHeight=button('.dispatch-card').getBoundingClientRect().height;
  saveCampaignProfile({...original,cleared:['interview'],records:{interview:{score:350,milliseconds:3600}}});
  showCampaign('map','interview');
  check(button('[data-start-level="interview"]').textContent==='Replay level'&&button('.dispatch-card').getBoundingClientRect().height===launchHeight,'Start and replay cards have identical height');
  check(button('.story-record strong').textContent==='0:03.60 / 0:45','Best time is paired with medal target');
  check(readCampaignProfile().medals.interview.includes('speed'),'An existing current-rules time earns the relaxed medal');
  saveCampaignProfile(original);showCampaign('map','interview');
  for(let i=0;i<4;i++)button('[data-page="1"]').click();
  check(campaignAreaIndex===4&&button('[data-page="1"]').disabled&&!$('campaign-content').textContent.includes('Burnt Server'),'No sixth page before Core clear');
  for(let i=0;i<4;i++)button('[data-page="-1"]').click();
  check(campaignAreaIndex===0&&button('[data-page="-1"]').disabled,'Carousel pages both directions');
  button('[data-start-level="interview"]').click();
  check($('controls-dialog').open&&g.mode==='campaign','Controls appear before first attempt');
  $('controls-start').click();
  check(g.mode==='play'&&readCampaignProfile().tutorial,'Tutorial acknowledgment persists');
  check($('wave-name').textContent==='WAVE 1 / 4'&&$('toast').dataset.kind==='wave','Opening HUD includes final round in total');
  check($('level-name').textContent==='1-1: Ambatu Interview','HUD shows the mission name above the wave count');
  verifyHudLayout();
  openWave(4);
  check($('wave-name').textContent==='FINAL WAVE'&&$('toast').dataset.kind==='final','Final surge label omits the total');
  const surge=g.queue.length;
  check(surge>1&&g.queue.every(item=>item.at===g.queue[0].at),'Final Wave has a single deployment time');
  g.elapsed=g.queue[0].at-.01;updateCampaignDeployment();
  check(g.enemies.length===0,'Nothing deploys before the surge');
  g.elapsed+=.02;updateCampaignDeployment();
  check(g.enemies.length===surge&&g.queue.length===0&&new Set(g.enemies.map(bot=>bot.spawn)).size===1,'Every Final Wave bot arrives and materializes together');
  const finalTime=g.stats.time;
  for(const bot of g.enemies){bot.spawn=0;damage(bot,bot.max);}
  check(g.finishTime===finalTime,'Last regular enemy stamps the finish time');
  for(let i=0;i<80;i++)update(1/90);
  check(g.mode==='play'&&g.stats.time===finalTime,'Final wave timer stays frozen during the clear animation');
  for(let i=0;i<60;i++)update(1/90);
  check(g.mode==='story-clear'&&readCampaignProfile().records.interview.milliseconds===Math.round(finalTime*1000),'Saved time excludes the final animation');
  startCampaignLevel('interview');
  const arena=$('viewport').getBoundingClientRect();
  check(getComputedStyle(document.body).overflow==='hidden'&&arena.left>=0&&arena.top>=0&&arena.right<=innerWidth&&arena.bottom<=innerHeight,'Arena fits without visible scroll');
  const rect=canvas.getBoundingClientRect();
  check(devicePixelRatio>=2&&Math.abs(canvas.width-rect.width*devicePixelRatio)<1&&Math.abs(canvas.height-rect.height*devicePixelRatio)<1,'Arena bitmap matches fullscreen device pixels');
  verifyTouchControls();
  const migrated=normalizeCampaignProfile({version:1,id:original.id,cleared:['interview','donut','anger'],medals:{interview:['clear']},skills:{bussiness:2},equipped:{popper:'spread',module:'shock'}});
  check(migrated.cleared.length===3&&migrated.equipped.armor==='shock'&&migrated.equipped.popper==='spread'&&campaignPoints(migrated)===4,'Legacy story migration includes boss point and legal equipment');
  verifyBuildEffects();
  const v2=normalizeCampaignProfile({version:2,id:original.id,cleared:['interview','donut','anger'],skills:{vibe:true,rescue:true},records:{interview:{nightmare:{score:10,milliseconds:20}}}});
  check(!('difficulty' in v2)&&campaignPoints(v2)===3&&!v2.skills.rescue&&!v2.records.interview,'Version 2 drops difficulty and refunds retired revive');
  const v3=normalizeCampaignProfile({version:3,id:original.id,difficulty:'normal',cleared:['interview','donut'],medals:{donut:['clear','burst']},records:{donut:{normal:{score:450,milliseconds:10000}}}});
  check(v3.cleared.includes('donut')&&v3.records.donut.score===450&&v3.records.donut.legacy&&v3.medals.donut.join()==='clear','Version 3 marks records as previous rules');
  const v4=normalizeCampaignProfile({version:4,id:original.id,cleared:['interview','paza'],skills:{power:true,cadence:true},equipped:{popper:'lob'}});
  check(!Object.keys(v4.skills).length&&campaignPoints(v4)===2&&v4.equipped.nut==='splashNut','Unaffordable legacy build refunds and migrates its Nut Effect');
  const oldBuild=normalizeCampaignProfile({version:6,id:original.id,cleared:campaignLevels.map(level=>level.id),
    equipped:{popper:'bounce'},skills:{movespeed:true,cooldown:true,dashrefund:true,dashpulse:true,reverb:true,reach:true,aftershock:true}});
  check(oldBuild.equipped.popper==='bounce'&&oldBuild.skills.dashpulse&&!oldBuild.skills.aftershock&&campaignPoints(oldBuild)===33,
    'Existing builds keep legal purchases and refund disconnected nodes');
  const retired={version:6,id:original.id,equipped:{popper:'orbit',nut:'deepFreeze',burst:'echo',armor:'deadAir',pendant:'freebird'}};
  const replacements=normalizeCampaignProfile({...retired,cleared:campaignLevels.map(level=>level.id)});
  check(replacements.equipped.popper==='needle'&&replacements.equipped.nut==='snowNut'&&replacements.equipped.burst==='echo'&&
    replacements.equipped.armor==='frame'&&replacements.equipped.pendant==='capacitor','Retired gear migrates to owned replacements');
  const early=normalizeCampaignProfile({...retired,cleared:['interview','transfer']});
  check(early.equipped.popper==='standard'&&early.equipped.nut==='snowNut'&&early.equipped.armor==='vest'&&early.equipped.pendant==='token',
    'Retired gear falls back to starters when replacements are locked');
  const reports=[playStory(1061),playStory(5133)];
  title();$('story-entry').click();
  check($('story-slot-list').children[0].textContent.includes('6-4: Rate This PC'),'Replay and later bonus clear leave the save at the furthest main level');
  $('story-slots').close();
  const storyBefore=JSON.stringify(readCampaignProfile());
  showCampaign('map','anger');button('[data-rematch="anger"]').click();
  check(g.story.rematch&&isBossWave()&&g.stats.waves===0,'Story boss rematch skips regular waves');
  check($('wave-name').textContent==='BOSS','Boss label omits the total');
  for(let i=0;i<12;i++)update(1/90);
  const boss=g.enemies[0],rematchFinish=g.stats.time;
  boss.spawn=0;damage(boss,boss.max);
  for(let i=0;i<130;i++)update(1/90);
  check(g.stats.time===rematchFinish,'Boss rematch stops the timer on the lethal hit');
  check(g.mode==='story-clear'&&$('overlay').textContent.includes('BOSS REMATCH'),'Rematch has a results panel');
  check(JSON.stringify(readCampaignProfile())===storyBefore,'Rematch leaves progress and records intact');
  const gearBefore=JSON.stringify(campaignProfile.equipped);
  showCampaign('gear');button('[data-armory="skills"]').click();
  check(button('.skill-root')&&$('campaign-content').querySelectorAll('[data-skill-node]').length===campaignSkills.length,'Radial skill tree renders every node');
  button('[data-skill-node="dashpulse"]').click();
  check(button('[data-buy="dashpulse"]').disabled&&button('.skill-detail h3').textContent==='Last Flare','Locked skill details remain selectable');
  button('[data-refund="skills"]').click();
  check(campaignPoints(campaignProfile)===42&&button('[data-refund="skills"]').disabled&&
    !document.querySelector('dialog[open]')&&JSON.stringify(campaignProfile.equipped)===gearBefore,'Refund immediately returns all 42 points and preserves gear');
  showCampaign('files','interview');
  check($('campaign-content').querySelectorAll('.enemy-group').length===6&&button('[data-file="faregate"]'),'Enemy files grouped across all six areas');
  button('[data-file="faregate"]').click();
  check(button('.enemy-detail h3').textContent==='Tentacle Faregate','Enemy details and variants are selectable');
  const bonus=campaignLevelById.get('ambatunut');
  selectAndStart(bonus);
  const leftover=enemy('guard',230,210,0);
  g.queue=[];g.elapsed=bonusWaveDuration(bonus,1);
  const stray={x:90,y:100,a:0,s:15,life:6,r:5,dmg:1};
  g.enemyPops.push(stray);
  update(1/90);
  check(g.wave===2&&g.enemies.includes(leftover)&&g.enemyPops.includes(stray),'Timed bonus waves preserve enemies and shots');
  damage(leftover,1000);
  update(1/90);
  check(g.wave===2,'A bonus wave cannot skip bots still queued for deployment');
  g.queue=[];
  update(1/90);
  check(g.wave===3&&g.elapsed===0,'Bonus waves advance immediately after an early clear');
  const donut=campaignLevelById.get('donut');
  const legacy=normalizeCampaignProfile({version:5,id:campaignProfile.id,cleared:['interview','donut','anger','driver','bootleg-mix'],skills:{signal:true,bosscharge:true,relays:true},medals:{donut:['clear','clean','burst']},records:{donut:{score:100,milliseconds:1000}},equipped:{boots:'relaySteps'}});
  check(legacy.equipped.boots==='pazaRunners'&&legacy.skills.cleansignal&&legacy.medals.donut.join()==='clear,clean'&&legacy.records.donut.legacy,'Version 5 preserves compatible equipment and retires Remix and old records');
  saveCampaignProfile({...campaignProfile,medals:{...campaignProfile.medals,donut:[]},records:{...campaignProfile.records,donut:{score:0,milliseconds:(donut.speedTarget+1)*1000}}});
  check(!recordCampaignClear(donut,campaignProfile.id,{...freshStats(),time:donut.speedTarget+.01},0).medals.includes('speed'),'Late clear misses speed medal');
  check(recordCampaignClear(donut,campaignProfile.id,{...freshStats(),time:donut.speedTarget},0).medals.includes('speed')&&readCampaignProfile().medals.donut.includes('speed'),'Speed medal is earned at the target and persists');
  check(!document.querySelector('#campaign-archive'),'Archive is absent');
  showCampaign('settings','interview');
  check(!button('select')&&!button('[name="difficulty"]'),'Settings show no difficulty controls');
  button('[data-new-story]').click();$('campaign-confirm-reset').click();
  check(campaignProfile.cleared.length===0&&!campaignProfile.tutorial&&campaignProfile.files.length===0&&!('difficulty' in readCampaignProfile()),'New Story resets the selected slot');
  for(const tab of ['map','gear','files','settings']){
    $('campaign-'+tab).click();
    check(document.documentElement.scrollHeight===innerHeight&&$('campaign-content').getBoundingClientRect().bottom<=innerHeight,'Page fits without scrolling in '+tab);
  }
  title();$('story-entry').click();$('story-slot-list').querySelector('[data-story-slot="2"]').click();
  const slotTwo=campaignProfile.id;
  recordCampaignClear(campaignLevels[0],slotTwo,freshStats(),20);
  title();$('story-entry').click();
  check($('story-slot-list').children[0].textContent.includes('No clears')&&$('story-slot-list').children[1].textContent.includes('1-1: Ambatu Interview')&&$('story-slot-list').children[2].textContent.includes('Empty slot'),'Slots show last clear and empty state');
  $('story-slot-list').querySelector('[data-story-slot="1"]').click();
  check(campaignProfile.id!==slotTwo&&campaignProfile.cleared.length===0&&readCampaignProfile(2).cleared.includes('interview'),'Save slots preserve separate progress');
  result.textContent=JSON.stringify(reports.map(({seed,reports})=>({seed,levels:reports.length,rounds:reports.reduce((sum,[,stats])=>sum+stats.rounds,0),retries:reports.reduce((sum,[,stats])=>sum+stats.retries,0),clearTimes:reports.map(([id,stats])=>[id,stats.time,stats.retries]),speedMedals:reports.filter(([,stats])=>stats.speed).length,lowestVibeByArea:campaignAreas.map((_,i)=>Math.min(...reports.slice(i*5,i*5+5).map(([,stats])=>stats.minVibe)))})));
}catch(error){result.textContent='FAIL '+error.message+' '+error.stack.replace(/\s+/g,' ').slice(0,500);}
