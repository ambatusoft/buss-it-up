const endlessLevel={id:'endless',name:'Endless Edging',areaIndex:5};
const endlessBossInterval=6;
const endlessActiveCap=22;
const endlessDeadline=13;
const endlessBotPool=[...Object.keys(enemyTypes),...Object.keys(campaignBotTypes)];

const endlessHealth=wave=>1+.03*Math.min(60,wave-1);
const endlessBotCount=wave=>6+Math.min(12,Math.floor((wave-1)/4));
const endlessUnlocked=profile=>profile?.cleared.includes('encore');

function startEndless(){
  const profile=refreshCampaignProfile();
  if(endlessUnlocked(profile))beginAttempt(endlessLevel,profile,false,true);
}

function endlessDeployments(wave,boss){
  const count=endlessBotCount(wave), bag=g.story.enemyBag;
  const queue=[];
  const edges=['west','east','north','south','flanks'];
  const slots=boss?Math.floor((count-6)/3):count;
  for(let index=0;index<slots;index++){
    if(!bag.length)bag.push(...endlessBotPool);
    const selection=Math.floor(Math.random()*bag.length);
    const [kind]=bag.splice(selection,1);
    const squad=Math.floor(index/4);
    queue.push({kind,edge:edges[(wave+squad)%edges.length],at:.75+squad*2.65+(index%4)*.24,squad,slot:index%4});
  }
  return queue;
}

function advanceEndless(){
  if(g.queue.length)return;
  if(isBossWave()){
    if(g.enemies.length)return;
    const next=Math.floor(Math.random()*(campaignAreas.length-1));
    g.level=next>=g.level?next+1:next;
    g.enemyPops=[];g.hazards=[];g.safeZone=null;
    g.pops=[];g.blasts=[];g.nutPulses=[];
    backdrop=null;musicTimer=0;
    openWave(g.wave+1);
    announce('WAVE '+g.wave+' · '+campaignAreas[g.level].name.toUpperCase(),1.65,'wave');
  }else if(!g.enemies.length||g.elapsed>=endlessDeadline){
    finishRegularWave();
    openWave(g.wave+1);
  }
}
