function activeWaveCount(){return campaignRoundCount(g.story.level);}
function activeBossName(){return g.story.level.area.boss;}
function isBossWave(){return g.story.level.finale&&g.wave===activeWaveCount();}
function isFinalWave(){return !g.story.level.finale&&g.wave===activeWaveCount();}
const campaignBossScale=[.85,.99,.97,.94,.65,.86];
const bossEscorts=[
  ['stamper','stapler'],['headlight','faregate'],['tuningfork','choir'],
  ['clapper','lighting'],['induction','cutter'],['firewall','backup']
];

function campaignWave(level,n){
  const finale=!level.finale&&n===level.waves.length;
  const speed=areaTuning[level.areaIndex].deploy;
  let timing=.75;
  return level.waves[n-1].flatMap((group,squad)=>{
    const {edge,bots}=parseSquad(group);
    if(finale)return bots.map((kind,slot)=>({kind,edge,squad,slot,at:.75}));
    if(squad>0&&n>1)bots.push(bots[0]);
    const arrival=timing;
    const sideGap=level.areaIndex===5?2.95:2.65;
    timing+=(level.side?sideGap:edge==='flanks'?3.1:3.5)*speed;
    return bots.map((kind,slot)=>({kind,edge,squad,slot,at:arrival+.22*slot}));
  });
}

function bonusWaveDuration(level,wave){
  return [11,12,12,12,13,13][level.areaIndex]+(wave===1?0:1);
}

function updateCampaignDeployment(){
  if(!g.queue.length||g.queue[0].at>g.elapsed)return;
  const surge=isFinalWave();
  if(!surge&&(g.elapsed-g.lastDeployment<deploymentSpacing||(!g.story.level.side&&g.enemies.length>=deploymentCap(g.level))))return;
  const ready=g.queue.splice(0,surge?g.queue.length:1);
  g.lastDeployment=g.elapsed;
  if(surge||g.squad!==ready[0].squad+1)sound.event('squad');
  g.squad=ready.at(-1).squad+1;
  for(const deployment of ready){
    const point=campaignSpawn(deployment);
    deployCampaignBot(deployment.kind,point.x,point.y);
  }
}

function campaignSpawn({edge,squad,slot}){
  if(edge==='any')return spawnPoint();
  if(edge==='flanks')edge=slot%2===0?'west':'east';
  const offset=(slot*149+squad*211)%540;
  const point=edge==='west'||edge==='east'
    ?{x:edge==='west'?64:896,y:110+offset*.64}
    :{x:210+offset,y:edge==='north'?94:472};
  return dist(point,g.p)>185?point:spawnPoint();
}

function startCampaignLevel(id,rematch=false){
  const level=campaignLevelById.get(id), profile=refreshCampaignProfile();
  if(!level || !profile || !campaignUnlocked(level,profile))return;
  if(rematch && (!level.finale || !profile.cleared.includes(level.id)))return;
  if(!rematch)saveCampaignProfile({...profile,selected:id});
  sound.stopAttemptAudio();
  sound.wake();
  g={mode:'play',level:level.areaIndex,wave:1,score:0,p:motion(campaignPlayer(profile)),
    stats:freshStats(),story:{level,profileId:profile.id,rematch},...empty()};
  openLevel(level.areaIndex,rematch?campaignRoundCount(level):1);
  $('pause').focus({preventScroll:true});
}

function campaignResults(survived){
  const {level,profileId,rematch}=g.story;
  setMode(survived?'story-clear':'story-fail');
  if(rematch){
    if(!survived)sound.event('fail');
    const box=panel('BOSS REMATCH',survived?'Boss cleared':'Signal lost',
      `${level.area.boss} · ${campaignTime(Math.round(g.stats.time*1000),true)} · ${pad(g.score,6)} pts`,[
        ...(survived?[]:[['Retry',()=>startCampaignLevel(level.id,true)]]),[survived?'Next':'Map',()=>showCampaign('map',level.id)]
      ]);
    decorateResults(box,survived);
    return;
  }
  if(!survived){
    sound.event('fail');
    const box=panel(levelLabel(level),'Signal lost','“You tappin’ out?”',[
      ['RETRY',()=>startCampaignLevel(level.id)],['MAP',()=>showCampaign('map',level.id)]
    ]);
    decorateResults(box,false);
    return;
  }
  const result=recordCampaignClear(level,profileId,g.stats,g.score);
  const next=result?.next;
  const finale=level.id==='encore';
  if(finale)sound.event('victory');
  const box=panel(levelLabel(level),finale?'Clean Slate':'Level Clear',
    level.quote??level.dispatch??'', [['Next',()=>showCampaign('map',result?.first&&next?next.id:level.id)]]);
  decorateResults(box,true);
  const actions=box.querySelector('.actions');
  const stats=document.createElement('dl');
  stats.className='result-stats';
  stats.innerHTML=`<div><dt>Clear time</dt><dd>${campaignTime(Math.round(g.stats.time*1000),true)}</dd>
    <small>Medal: ${campaignTime(level.speedTarget*1000)}</small></div>
    <div><dt>Score</dt><dd>${g.score.toLocaleString()}</dd></div>`;
  box.insertBefore(stats,actions);
  if(result)box.insertBefore(campaignMedals(result.medals,false,level),actions);
  if(result?.first)box.insertBefore(firstClearRewards(level),actions);
  if(!result){
    const notice=document.createElement('p');
    notice.textContent='This story profile changed in another tab.';
    box.insertBefore(notice,actions);
  }
  if(campaignSaveNotice){
    const notice=document.createElement('p');notice.textContent=campaignSaveNotice;box.insertBefore(notice,actions);
  }
}

function firstClearRewards(level){
  const points=clearSkillPoints(level);
  const items=Object.values(campaignGear).filter(gear=>gear.unlock===level.id);
  const rewards=document.createElement('section');
  rewards.className='result-rewards';
  rewards.innerHTML=`<h3>First clear rewards</h3><ul>
    <li class="result-reward-points" style="--slot:var(--lime)"><span class="gear-icon" aria-hidden="true">✦</span>
      <b>+${points} skill point${points===1?'':'s'}</b></li>
    ${items.map(item=>{
      const slot=gearSlots[item.slot];
      return `<li class="result-reward-gear" style="--slot:${slot.color}"><span class="gear-icon">${gearIcon(item.icon)}</span>
        <span><small>${slot.name}</small><b>${item.name}</b></span></li>`;
    }).join('')}</ul>`;
  return rewards;
}

function campaignTime(milliseconds,precise=false){
  const seconds=Math.floor(milliseconds/1000);
  const fraction=precise?'.'+pad(Math.floor(milliseconds%1000/10)):'';
  return `${Math.floor(seconds/60)}:${pad(seconds%60)}${fraction}`;
}

const campaignArenaEvents={
  pressure(p){spot(clamp(p.x,85,875),clamp(p.y,110,465),54,.92,13);},
  traffic(p,k){arenaLane(k%2===0,k%2===0?clamp(p.x,125,835):clamp(p.y,145,430),73,.95,17);},
  backbeat(p){
    for(const offset of [-105,105])spot(clamp(p.x+offset,85,875),clamp(p.y,112,466),57,.85,15);
  },
  retake(p){
    spot(clamp(p.x,85,875),clamp(p.y,112,466),62,.93,16);
    spot(clamp(W-p.x,85,875),clamp(H-p.y,112,466),60,1.16,16);
  },
  targeting(p,k){
    const x=clamp(p.x,100,860),y=clamp(p.y,125,460);
    spot(x,y,75,1,18);
    for(const offset of [-107,107])spot(clamp(x+offset,85,875),clamp(y+(k%2===0?-75:75),112,466),44,1.18,16);
  },
  firewall(p,k){
    const vertical=k%2===0, pos=vertical?p.x:p.y;
    const min=vertical?100:127,max=vertical?860:445;
    const lane=clamp(pos,min,max);
    const offset=(k%4<2?1:-1)*(vertical?166:125);
    arenaLane(vertical,lane,102,1.02,21);
    arenaLane(vertical,clamp(lane+offset,min,max),75,1.25,18);
  }
};

function updateCampaignArena(){
  const {level}=g.story;
  if(isBossWave() || g.elapsed<g.storyHazardAt || !g.enemies.length)return;
  if(level.index===0)return;
  if(level.side&&level.areaIndex===5&&g.enemies.length>=7){
    g.storyHazardAt=g.elapsed+.8;
    return;
  }
  const start=g.hazards.length;
  campaignArenaEvents[level.area.modifier](g.p,g.storyHazards++);
  for(const hazard of g.hazards.slice(start))hazard.theme=level.area.modifier;
  const hazardNames={pressure:'FORM CHECK',traffic:'BUS LANE',backbeat:'BACKBEAT',retake:'RETAKE',targeting:'RED CIRCLE',firewall:'FIREWALL'};
  announce(hazardNames[level.area.modifier],.74,level.area.modifier);
  const cadence=level.side?5.25:7.1;
  g.storyHazardAt=g.elapsed+cadence*areaTuning[level.areaIndex].hazard;
  sound.event('warn');
}

function campaignBossPattern(e, aim, phase, k){
  const {area}=g.story.level;
  if(k%4!==3)return false;
  const p=g.p;
  if(area.id==='district'){
    announce('LAST SET',.85,'pressure');
    for(const offset of [-108,0,108])spot(clamp(p.x+offset,90,870),clamp(p.y,115,463),59,.86+Math.abs(offset)/400,19,e);
  }else if(area.id==='terminal'){
    announce('EXPRESS',.85,'traffic');
    const lane=clamp(p.y,166,403);
    for(const offset of [-86,86])arenaLane(false,lane+offset,62,.94,19);
    fan(e,aim,phase?11:7,.25,215,'ticket');
  }else if(area.id==='radio'){
    announce('DOUBLE TIME',.85,'backbeat');
    for(const offset of [-.38,.38])fan(e,aim+offset,7,.19,210,'note');
    spot(p.x,p.y,58,1,17,e);
  }else if(area.id==='studio'){
    announce('SPLIT SCREEN',.85,'retake');
    campaignArenaEvents.retake(p);
    if(g.enemies.length<4){const q=spawnPoint();enemy('camerabot',q.x,q.y,.65);}
  }else if(area.id==='core'){
    announce('RED CIRCLE',.85,'targeting');
    campaignArenaEvents.targeting(p,k);
    fan(e,aim,phase?11:7,.16,244,'plasma');
  }else return false;
  e.storySpecial=k;
  sound.event('warn');e.cd=1.25;
  return true;
}

const campaignBotTypes={
  stamper:{base:'guard',name:'Gym Floor Monitor',note:'Stops at arm’s length to stamp a warning zone at your feet.',glyph:'!',accent:'#dbfb70',radius:24,hp:1.05,speed:.84,steer:(e,a,d)=>[a,d>218?1:0],attack(e){
    spot(clamp(g.p.x,90,870),clamp(g.p.y,115,463),48,1.02,13,e);
  }},
  faregate:{base:'thrower',name:'Tentacle Faregate',note:'Patrols the grid and telegraphs a beam on each side of its aim.',glyph:'¤',accent:'#ffbd72',radius:19,hp:1.23,speed:.87,steer:square,attack(e){
    const aim=angle(e,g.p);
    for(const offset of [-.57,.57])aimBeam(e,aim+offset,27,.98,13,e);
  }},
  repeater:{base:'speaker',name:'High Quality Repeater',note:'Circles close to you and releases a five-note fan.',glyph:'♪',accent:'#f88fcc',radius:15,hp:.95,speed:1.25,steer:flank,attack(e){
    fan(e,angle(e,g.p),5,.26,185,'note',11);
  }},
  cutout:{base:'skater',name:'Classy Stunt Double',note:'Skates in wide loops and drops a timed spotlight as it passes.',glyph:'▣',accent:'#73f3cf',radius:11,hp:.90,speed:1.08,steer:(e,a,d)=>[a+e.turn*(d<204?1.8:.82),1],attack(e){
    spot(e.x,e.y,54,.70,14,e);
  }},
  scout:{base:'guard',name:'Sungut Lele Scout',note:'Bounces away at midrange and tracks your last position with a narrow beam.',glyph:'⌬',accent:'#8fb9ff',radius:16,hp:.73,speed:1.46,steer:retreat,attack(e){
    aimBeam(e,angle(e,g.p),33,1.03,15,e);
  }},
  backup:{base:'popup',name:'Wordington Backup',note:'Drifts erratically between its laser and slow ember rings.',glyph:'!',accent:'#ff886f',radius:20,hp:1.16,speed:1.08,steer:(e,a,d)=>e.focus>0?[a,0]:[a+Math.sin(e.walk*.48)*1.23,d>155?.9:.2],attack(e){
    ring(e,8,g.clock*.55,138,'ember',11);
  }}
};

function deployCampaignBot(kind,x,y,materialize=.42){
  const variant=campaignBotTypes[kind];
  const bot=enemy(variant?.base??kind,x,y,materialize,kind);
  if(!variant)return;
  bot.storyKind=kind;
  bot.r=variant.radius;
  bot.max=Math.round(bot.max*variant.hp);
  bot.hp=bot.max;
  bot.speed*=variant.speed;
  bot.storyAttack=1.7;
  floater(x,y-18,variant.name.toUpperCase(),variant.accent);
}

function updateCampaignBot(bot,dt){
  bot.storyAttack-=dt;
  if(bot.storyAttack>0)return;
  bot.storyAttack=3.8;
  campaignBotTypes[bot.storyKind].attack(bot);
}
