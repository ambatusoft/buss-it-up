let campaignView='map';
let campaignSelection=campaignProfile?.selected??campaignLevels[0].id;
let campaignAreaIndex=campaignLevelById.get(campaignSelection).areaIndex;
let campaignPageDirection=0;
let campaignFileSelection=null;
let campaignFileQuery='';
let pendingTutorial=null;
const campaignTabs=[['map','map'],['gear','gear'],['files','files'],['settings','settings']];

const medalTypes={
  clear:{name:'Clear',text:'Finish the level',color:'#ffca74',icon:'M4 4h16v4c0 6-8 9-8 9S4 14 4 8zM9 19h6v3H9zM4 6H2v4l3 2m15-6h2v4l-3 2'},
  clean:{name:'No Hit',text:'Finish without losing Vibe',color:'#8ff7c2',icon:'M12 2l8 4v6c0 5-8 9-8 9s-8-4-8-9V6zM8 12l3 3 5-6'},
  speed:{name:'Speed Clear',text:'Finish within the target time',color:'#ffa0da',icon:'M9 2h6m-3 2v2m6 1 2 2M12 6a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 4v4l3 2'}
};

function campaignMedals(earned,includeLocked=false,level=null){
  const group=document.createElement('div');
  group.className='medal-row';
  group.setAttribute('aria-label','Medals');
  group.innerHTML=Object.entries(medalTypes).filter(([id])=>includeLocked||earned.includes(id)).map(([id,medal])=>
    `<span class="medal ${earned.includes(id)?'earned':'unearned'}" style="--medal:${medal.color}" title="${medal.name} · ${id==='speed'&&level?'Finish in '+campaignTime(level.speedTarget*1000)+' or less':medal.text}" aria-label="${medal.name}${earned.includes(id)?' earned':' locked'}">${gearIcon(medal.icon)}<b>${medal.name}</b></span>`).join('');
  return group;
}

function campaignVisibleAreas(profile){
  return profile?.cleared.includes('third-impact')?campaignAreas.length:campaignAreas.length-1;
}

function updateCampaignEntry(){
  $('story-entry').disabled=false;
  const hasSave=campaignSlots.some(slot=>campaignSessionProfiles.has(slot)||readCampaignProfile(slot,false));
  $('story-entry').textContent=hasSave?'Continue':'Start';
}

function showCampaign(view='map',id=campaignSelection){
  const profile=refreshCampaignProfile();
  if(!profile)return;
  const level=campaignLevelById.get(id)??campaignLevels[0];
  if(level.areaIndex<campaignVisibleAreas(profile)){
    campaignSelection=level.id;
    campaignAreaIndex=level.areaIndex;
  }
  campaignView=view;
  g.story=null;
  setMode('campaign');
  renderCampaign();
  $('campaign-heading').focus({preventScroll:true});
  campaignMenuMusic();
}

function campaignMenuMusic(){
  if(g.mode!=='campaign'||!sound.enabled)return;
  Promise.all([sound.wake(),sound.loadClip('dispatch')]).then(()=>{
    if(g.mode==='campaign')sound.playTrack('dispatch');
  });
  const level=campaignLevelById.get(campaignSelection);
  if(campaignView==='map'&&level&&campaignUnlocked(level,campaignProfile))preloadAreaMusic(level);
}

function preloadAreaMusic(level){
  const [area,boss]=areaMusic[level.areaIndex];
  sound.loadClip(area);
  if(level.finale)sound.loadClip(boss);
  if(level.id==='encore')sound.loadClip(finalPhaseMusic);
}

function renderCampaign(){
  const oldGearList=$('campaign-content').querySelector('.gear-grid');
  const gearScroll=oldGearList?.scrollTop;
  for(const [id,view] of campaignTabs){
    $('campaign-'+id).setAttribute('aria-pressed',String(campaignView===view));
  }
  $('campaign-notice').hidden=!campaignSaveNotice;
  $('campaign-notice').textContent=campaignSaveNotice;
  if(campaignView==='gear')renderCampaignGear(campaignProfile);
  else if(campaignView==='files')renderCampaignFiles(campaignProfile);
  else if(campaignView==='settings')renderCampaignSettings(campaignProfile);
  else renderCampaignMap(campaignProfile);
  const gearList=$('campaign-content').querySelector('.gear-grid');
  if(gearList&&gearList.dataset.scrollKey===oldGearList?.dataset.scrollKey)gearList.scrollTop=gearScroll;
}

function renderCampaignMap(profile){
  const area=campaignAreas[campaignAreaIndex];
  const levels=campaignLevels.filter(level=>level.area===area);
  const selected=levels.find(level=>level.id===campaignSelection)??levels[0];
  const available=campaignUnlocked(selected,profile);
  const cleared=profile.cleared.includes(selected.id);
  const totalAreas=campaignVisibleAreas(profile);
  const mapRoute=area.map.slice(0,4).join(' ');
  const sideRoute=[area.map[1],area.map[4]].join(' ');
  const rewards=campaignRewards(selected.id,profile);
  const record=profile.records[selected.id];
  const nodes=levels.map((level,index)=>{
    const [x,y]=area.map[index],done=profile.cleared.includes(level.id);
    const unlocked=campaignUnlocked(level,profile);
    return `<button class="map-node ${done?'cleared':''} ${level.side?'side-node':''}" data-level="${level.id}" style="--x:${x}%;--y:${y}%" ${unlocked?'':'disabled'} aria-pressed="${level===selected}" aria-label="${levelLabel(level)} · ${done?'Cleared':unlocked?'Available':'Locked'}"><b>${level.side?'X':index+1}</b><span aria-hidden="true">${level.name}</span>${done?'<i aria-hidden="true">✓</i>':''}</button>`;
  }).join('');
  const transition=campaignPageDirection===1?'slide-next':campaignPageDirection===-1?'slide-prev':'';
  campaignPageDirection=0;
  $('campaign-content').innerHTML=`<section class="campaign-main map-browser" style="--area-accent:${area.accent}">
    <header class="campaign-heading map-heading"><div><small>Area ${pad(campaignAreaIndex+1)}</small><h2 id="campaign-heading" tabindex="-1">${area.name}</h2></div><span class="area-glyph" aria-hidden="true">${area.symbol}</span></header>
    <div class="map-carousel">
      <button class="map-arrow" data-page="-1" aria-label="Previous area" ${campaignAreaIndex===0?'disabled':''}>‹</button>
      <div class="campaign-map map-${area.id} ${transition}">
        <svg class="map-drawing" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g class="map-infrastructure">${area.art}</g><polyline class="map-route" points="${mapRoute}" vector-effect="non-scaling-stroke"/><polyline class="map-route side-route" points="${sideRoute}" vector-effect="non-scaling-stroke"/></svg>
        ${nodes}
      </div>
      <button class="map-arrow" data-page="1" aria-label="Next area" ${campaignAreaIndex>=totalAreas-1?'disabled':''}>›</button>
    </div>
    <div class="map-position" aria-hidden="true">${Array.from({length:totalAreas},(_,index)=>`<i class="${index===campaignAreaIndex?'current':''}"></i>`).join('')}</div>
    <article class="dispatch-card"><div class="map-dispatch-summary"><div class="map-dispatch-heading"><h3><span>${selected.number}:</span> ${selected.name}</h3></div>
      ${record?`<p class="story-record">${record.score.toLocaleString()} pts · <strong title="Best time / Speed Clear target">${campaignTime(record.milliseconds,true)} / ${campaignTime(selected.speedTarget*1000)}</strong>${record.legacy?' · Previous rules':''}</p>`:''}
      <div class="map-dispatch-badges"><div id="level-medals"></div>${available&&!cleared?`<div class="first-clear"><b>+${clearSkillPoints(selected)} SP</b>${rewards.map(item=>`<span title="${item.name}" aria-label="${item.name}" style="color:${gearSlots[item.slot].color}">${gearIcon(item.icon)}</span>`).join('')}</div>`:''}</div></div>
      <div class="dispatch-actions"><button class="primary" data-start-level="${selected.id}" ${available?'':'disabled'}>${cleared?'Replay level':available?'Start level':'Locked'}</button>
      ${cleared&&selected.finale?`<button class="secondary" data-rematch="${selected.id}">Boss rematch</button>`:''}</div>
    </article></section>`;
  if(available)$('level-medals').append(campaignMedals(profile.medals[selected.id]??[],true,selected));
  if(sound.enabled&&sound.ac&&available)preloadAreaMusic(selected);
}

function campaignFileEntries(){
  const records=new Map();
  const add=(id,index)=>{
    if(records.has(id))return;
    const variant=campaignBotTypes[id], boss=id.startsWith('boss');
    const area=campaignAreas[index];
    const file=variant?{name:variant.name,note:variant.note}:enemyFiles[id];
    if(file)records.set(id,{id,area,index,name:boss?area.boss:file.name,note:file.note});
  };
  campaignAreas.forEach((area,index)=>{
    for(const level of campaignLevels.filter(level=>level.area===area))for(const wave of level.waves)for(const group of wave)for(const id of parseSquad(group).bots)add(id,index);
    add('boss'+index,index);
    if(index===4){add('prime',index);add('primePod',index);}
    if(index===5)add('hellboot',index);
  });
  return [...records.values()];
}

const campaignFiles=campaignFileEntries();
function renderCampaignFiles(profile){
  const scroll=$('campaign-content').querySelector('.enemy-list')?.scrollTop??0;
  const entries=campaignFiles.filter(file=>file.index<campaignVisibleAreas(profile)&&profile.files.includes(file.id));
  const term=campaignFileQuery.trim().toLowerCase();
  const visible=entries.filter(file=>file.name.toLowerCase().includes(term));
  const selected=visible.find(file=>file.id===campaignFileSelection)??visible[0];
  const groups=campaignAreas.slice(0,campaignVisibleAreas(profile)).map((area,index)=>{
    const cards=visible.filter(file=>file.index===index);
    if(!cards.length)return '';
    return `<section class="enemy-group" style="--area-accent:${area.accent}"><h3>${area.name}</h3><div class="enemy-grid">${cards.map(file=>
      `<button data-file="${file.id}" aria-pressed="${file===selected}"><canvas width="72" height="72" data-portrait="${file.id}" aria-hidden="true"></canvas><b>${file.name}</b></button>`).join('')}</div></section>`;
  }).join('');
  const emptyMessage=entries.length?'No encountered enemies match.':'Encounter enemies to add them to Files.';
  $('campaign-content').innerHTML=`<section class="armory files-view"><header class="campaign-heading"><div><small>${entries.length} ENCOUNTERED</small><h2 id="campaign-heading" tabindex="-1">Enemy files</h2></div><label><span class="sr-only">Search enemies</span><input id="campaign-file-search" type="search" placeholder="Find enemy…" autocomplete="off"></label></header><div class="enemy-layout"><div class="enemy-list menu-scroll">${groups||`<p>${emptyMessage}</p>`}</div>${selected?`<aside class="enemy-detail" style="--area-accent:${selected.area.accent}"><canvas width="72" height="72" data-portrait="${selected.id}" aria-hidden="true"></canvas><small>${selected.area.name}</small><h3>${selected.name}</h3><p>${selected.note}</p></aside>`:''}</div></section>`;
  const search=$('campaign-file-search');
  search.value=campaignFileQuery;
  search.addEventListener('input',()=>{
    campaignFileQuery=search.value;
    $('campaign-content').querySelector('.enemy-list').scrollTop=0;
    renderCampaignFiles(profile);$('campaign-file-search').focus({preventScroll:true});
  });
  $('campaign-content').querySelector('.enemy-list').scrollTop=scroll;
  $('campaign-content').querySelectorAll('[data-portrait]').forEach(node=>drawFilePortrait(node,node.dataset.portrait));
}

function pageCampaignMap(delta){
  const next=clamp(campaignAreaIndex+delta,0,campaignVisibleAreas(campaignProfile)-1);
  if(next===campaignAreaIndex)return;
  campaignPageDirection=delta;
  campaignAreaIndex=next;
  const levels=campaignLevels.filter(level=>level.areaIndex===next);
  campaignSelection=(levels.find(level=>!campaignProfile.cleared.includes(level.id)&&campaignUnlocked(level,campaignProfile))??levels[0]).id;
  renderCampaign();
  const arrow=$('campaign-content').querySelector(`[data-page="${delta}"]:not(:disabled)`);
  (arrow??$('campaign-heading')).focus({preventScroll:true});
}

function launchFromMap(id){
  const level=campaignLevelById.get(id);
  const profile=refreshCampaignProfile();
  if(!profile||!level||!campaignUnlocked(level,profile))return;
  const bonus=level.side&&!profile.bonusTutorial;
  if(bonus||level.index===0&&!profile.tutorial){
    pendingTutorial=id;
    const touch=usesTouchControls();
    $('controls-title').textContent=bonus?'Bonus waves':'Before your first shift';
    $('keyboard-controls').hidden=bonus||touch;
    $('touch-controls').hidden=bonus||!touch;
    $('bonus-instructions').hidden=!bonus;
    $('controls-dialog').showModal();
  }else startCampaignLevel(id);
}

$('controls-dialog').querySelector('form').addEventListener('submit',event=>{
  if(event.submitter?.value!=='play'||!pendingTutorial)return;
  event.preventDefault();
  const id=pendingTutorial;
  pendingTutorial=null;
  $('controls-dialog').close();
  const profile=refreshCampaignProfile();
  const key=campaignLevelById.get(id).side?'bonusTutorial':'tutorial';
  saveCampaignProfile({...profile,[key]:true});
  startCampaignLevel(id);
});
$('controls-dialog').addEventListener('close',()=>{pendingTutorial=null;});

const campaignResetDialog=$('campaign-reset-dialog');
function showCampaignSlots(){
  $('story-slot-list').innerHTML=campaignSlots.map(slot=>{
    const profile=campaignSessionProfiles.get(slot)??readCampaignProfile(slot,false);
    const last=profile&&campaignLevels.findLast(level=>!level.side&&profile.cleared.includes(level.id));
    return `<button class="story-slot secondary" data-story-slot="${slot}"><b>Save ${slot}</b><span>${profile?'Continue':'New story'}</span><small>${last?'Main route · '+levelLabel(last):profile?'No clears yet':'Empty slot'}</small></button>`;
  }).join('');
  $('story-slots').showModal();
}
$('story-slot-list').addEventListener('click',event=>{
  const card=event.target.closest('[data-story-slot]');
  if(!card)return;
  $('story-slots').close();
  const profile=selectCampaignSlot(Number(card.dataset.storySlot));
  if(profile)showCampaign('map',profile.selected);
  else createStoryInSlot();
});
function askStoryReset(){
  $('new-story-warning').textContent=`Starting over replaces Save ${campaignSlot}.`;
  campaignResetDialog.showModal();
}
function createStoryInSlot(){
  campaignFileSelection=null;campaignFileQuery='';
  saveCampaignProfile(freshCampaignProfile());
  showCampaign('map',campaignLevels[0].id);
}
$('story-entry').addEventListener('click',showCampaignSlots);
$('campaign-home').addEventListener('click',title);
for(const [id,view] of campaignTabs){
  $('campaign-'+id).addEventListener('click',()=>showCampaign(view,campaignSelection));
}
campaignResetDialog.querySelector('form').addEventListener('submit',event=>{
  if(event.submitter?.value!=='reset')return;
  event.preventDefault();campaignResetDialog.close();
  createStoryInSlot();
});
$('campaign-content').addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button||button.disabled)return;
  const {level,page,startLevel,rematch,file,setting,newStory,switchStory}=button.dataset;
  if(setting){toggleCampaignSetting(setting);return;}
  if(newStory){askStoryReset();return;}
  if(switchStory){title();showCampaignSlots();return;}
  if(startLevel){launchFromMap(startLevel);return;}
  if(rematch){startCampaignLevel(rematch,true);return;}
  if(page){pageCampaignMap(Number(page));return;}
  if(level){campaignSelection=level;renderCampaign();$('campaign-content').querySelector(`[data-level="${level}"]`).focus({preventScroll:true});return;}
  if(file){
    campaignFileSelection=file;renderCampaign();$('campaign-content').querySelector(`[data-file="${file}"]`).focus({preventScroll:true});
    return;
  }
  handleArmoryButton(button);
});
$('campaign-screen').addEventListener('keydown',event=>{
  if(event.target.matches('input,textarea'))return;
  if(campaignView==='map'&&['ArrowLeft','ArrowRight'].includes(event.key)){
    event.preventDefault();pageCampaignMap(event.key==='ArrowLeft'?-1:1);
  }
});
window.addEventListener('storage',event=>{
  if(event.key!==campaignSlotKey(campaignSlot))return;
  refreshCampaignProfile();updateCampaignEntry();
  if(g.mode!=='campaign')return;
  if(campaignAreaIndex>=campaignVisibleAreas(campaignProfile))showCampaign('map',campaignProfile.selected);
  else renderCampaign();
});
updateCampaignEntry();
