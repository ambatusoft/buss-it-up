const campaignSaveKey = 'buss-story-profile';
const campaignVersion = 7;
const campaignVersions=[1,2,3,4,5,6,campaignVersion];
const campaignSlots=[1,2,3];
const campaignSlotKey=slot=>slot===1?campaignSaveKey:campaignSaveKey+'-'+slot;
let campaignSlot=1;
let campaignSaveNotice = '';

function freshCampaignProfile(id=globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random()}`) {
  return {
    version:campaignVersion,id,
    cleared:[], medals:{}, records:{}, files:[], tutorial:false, bonusTutorial:false, keptGear:[], skills:{}, equipped:{...campaignStarter}, selected:campaignLevels[0].id
  };
}

function campaignUnlocked(level, profile) {
  return !level.requires||profile.cleared.includes(level.id)||profile.cleared.includes(level.requires);
}

function campaignOwned(profile) {
  return new Set(Object.entries(campaignGear).filter(([id,gear])=>!gear.unlock||profile.cleared.includes(gear.unlock)||profile.keptGear.includes(id)).map(([id])=>id));
}

const campaignRewards=(id,profile)=>Object.entries(campaignGear).filter(([key,gear])=>
  gear.unlock===id&&!profile.keptGear.includes(key)
).map(([,gear])=>gear);

const skillCost=skill=>skill.cost??1;
const earnedCampaignPoints=profile=>profile.cleared.reduce((total,id)=>total+clearSkillPoints(campaignLevelById.get(id)),0);
const spentCampaignPoints=profile=>campaignSkills.reduce((total,skill)=>total+(profile.skills[skill.id]?skillCost(skill):0),0);
const campaignPoints=profile=>earnedCampaignPoints(profile)-spentCampaignPoints(profile);
const retiredGear={orbit:'needle',frost:'twin',crumbNut:'splashNut',deepFreeze:'snowNut',deadAir:'frame',freebird:'capacitor'};
const migratedNutGear={cluster:'splashNut',lob:'splashNut',needle:'pierceNut',orbit:'homingNut',bounce:'ricochetNut',frost:'snowNut'};
const previousGearGates={twin:'anger',playback:'dead-air',longstep:'sleepy',nova:'donut',recovery:'paza',echoCast:'dreamyfantasia',homingNut:'candid',rip:'red-circle',firstFrame:'red-tag',scrubVest:'hell',sparkstep:'hell',cutoff:'lost-take'};

function normalizeCampaignProfile(value) {
  if(!campaignVersions.includes(value?.version)||typeof value.id!=='string')return freshCampaignProfile();
  const profile=freshCampaignProfile(value.id);
  const completed = new Set(Array.isArray(value.cleared)?value.cleared:[]);
  for(const level of campaignLevels){
    if(!completed.has(level.id))continue;
    profile.cleared.push(level.id);
    const medals=value.medals?.[level.id];
    if(Array.isArray(medals))profile.medals[level.id]=['clear','clean',...(value.version>=6?['speed']:[])].filter(medal=>medals.includes(medal));
    const saved=value.records?.[level.id];
    const record=value.version<5?saved?.[value.difficulty]??saved?.nutmare??saved?.normal:saved;
    if(Number.isSafeInteger(record?.score)&&record.score>=0&&Number.isSafeInteger(record.milliseconds)&&record.milliseconds>=0){
      profile.records[level.id]={score:record.score,milliseconds:record.milliseconds,legacy:value.version<6||record.legacy===true};
      if(!profile.records[level.id].legacy&&record.milliseconds<=level.speedTarget*1000){
        const earned=profile.medals[level.id]??=[];
        if(!earned.includes('speed'))earned.push('speed');
      }
    }
  }
  profile.tutorial=value.tutorial===true||profile.cleared.length>0;
  profile.bonusTutorial=value.bonusTutorial===true||campaignLevels.some(level=>level.side&&completed.has(level.id));
  const retained=new Set(Array.isArray(value.keptGear)?value.keptGear:[]);
  profile.keptGear=Object.entries(previousGearGates).filter(([id,gate])=>
    (retained.has(id)||value.version<7&&completed.has(gate))&&!completed.has(campaignGear[id].unlock)
  ).map(([id])=>id);
  if(Array.isArray(value.files))profile.files=[...new Set(value.files.filter(id=>typeof id==='string'))].slice(0,100);
  for(const skill of campaignSkills){
    if(skill.requires && !profile.skills[skill.requires])continue;
    const savedSkill=value.version<6&&skill.id==='cleansignal'?'relays':skill.id;
    if(value.version>=2&&value.skills?.[savedSkill]===true&&(value.version<5||campaignPoints(profile)>=skillCost(skill)))profile.skills[skill.id]=true;
  }
  if(campaignPoints(profile)<0)profile.skills={};
  const owned=campaignOwned(profile);
  for(const slot of Object.keys(campaignStarter)){
    const savedGear=value.equipped?.[slot];
    const id=value.version<6&&savedGear==='relaySteps'?'pazaRunners':retiredGear[savedGear]??savedGear;
    if(owned.has(id) && campaignGear[id].slot===slot)profile.equipped[slot]=id;
  }
  if(value.version===1){
    const savedGear=value.equipped?.module;
    const id=retiredGear[savedGear]??savedGear;
    if(owned.has(id))profile.equipped[campaignGear[id].slot]=id;
  }
  const oldPopper=value.equipped?.popper;
  const oldEffect=migratedNutGear[oldPopper];
  const ownsOldPopper=owned.has(retiredGear[oldPopper]??oldPopper);
  if(value.version<5&&ownsOldPopper&&owned.has(oldEffect))profile.equipped.nut=oldEffect;
  const selection=campaignLevelById.get(value.selected);
  if(selection && campaignUnlocked(selection,profile))profile.selected=selection.id;
  return profile;
}

function readCampaignProfile(slot=campaignSlot,report=true) {
  let raw;
  try { raw=localStorage.getItem(campaignSlotKey(slot)); }
  catch { if(report)campaignSaveNotice='Browser storage is unavailable. Progress lasts for this session.';return null; }
  if(raw===null)return null;
  try {
    const value=JSON.parse(raw);
    if(value?.version>campaignVersion){
      if(report)campaignSaveNotice='This story save was made by a newer build. Progress lasts for this session.';
      return null;
    }
    if(campaignVersions.includes(value?.version) && typeof value.id==='string'){
      if(report)campaignSaveNotice='';
      return normalizeCampaignProfile(value);
    }
  }catch{}
  if(report)campaignSaveNotice='The saved story could not be read. Start a story to create a fresh profile.';
  return null;
}

let campaignProfile = readCampaignProfile();
let campaignMemoryOnly = false;
const campaignSessionProfiles=new Map();

function selectCampaignSlot(slot){
  campaignSlot=slot;
  campaignSaveNotice='';
  campaignMemoryOnly=campaignSessionProfiles.has(slot);
  campaignProfile=campaignSessionProfiles.get(slot)??readCampaignProfile(slot);
  return campaignProfile;
}

function refreshCampaignProfile() {
  if(campaignMemoryOnly)return campaignProfile;
  const stored=readCampaignProfile();
  if(stored)campaignProfile=stored;
  return campaignProfile;
}

function saveCampaignProfile(profile) {
  campaignProfile=profile;
  try {
    const key=campaignSlotKey(campaignSlot);
    const raw=localStorage.getItem(key);
    let previous;
    try { previous=JSON.parse(raw); } catch {}
    if(previous?.version>campaignVersion){campaignMemoryOnly=true;campaignSessionProfiles.set(campaignSlot,profile);return;}
    localStorage.setItem(key,JSON.stringify(profile));
    campaignSessionProfiles.delete(campaignSlot);
    campaignSaveNotice='';
    campaignMemoryOnly=false;
  }catch{
    campaignMemoryOnly=true;
    campaignSessionProfiles.set(campaignSlot,profile);
    campaignSaveNotice='Browser storage is unavailable. Progress lasts for this session.';
  }
}

function recordCampaignClear(level, profileId, stats, score) {
  const profile=refreshCampaignProfile();
  if(profile?.id!==profileId || !campaignUnlocked(level,profile))return null;
  const first=!profile.cleared.includes(level.id);
  const medals=new Set(profile.medals[level.id]);
  medals.add('clear');
  if(stats.damage===0)medals.add('clean');
  const next=campaignLevelById.get(level.next);
  const saved=profile.records[level.id];
  const previous=saved?.legacy?null:saved;
  const milliseconds=Math.round(stats.time*1000);
  if(milliseconds<=level.speedTarget*1000)medals.add('speed');
  const record={score:Math.max(previous?.score??0,score),milliseconds:Math.min(previous?.milliseconds??Infinity,milliseconds)};
  saveCampaignProfile({
    ...profile, cleared:first?[...profile.cleared,level.id]:profile.cleared,
    selected:first?(next?.id??level.id):profile.selected, medals:{...profile.medals,[level.id]:[...medals]},
    records:{...profile.records,[level.id]:record}
  });
  return {first,next,medals:[...medals],rewards:first?campaignRewards(level.id,profile):[]};
}

function refundCampaignSkills(){
  const profile=refreshCampaignProfile();
  if(profile)saveCampaignProfile({...profile,skills:{}});
}

function campaignSkillStatus(skill, profile) {
  if(profile.skills[skill.id])return 'Purchased';
  if(skill.requires && !profile.skills[skill.requires])return 'Requires '+campaignSkills.find(node=>node.id===skill.requires).name;
  if(campaignPoints(profile)<skillCost(skill))return `Need ${skillCost(skill)} SP`;
  return '';
}

function purchaseCampaignSkill(id) {
  const profile=refreshCampaignProfile(), skill=campaignSkills.find(node=>node.id===id);
  if(!profile || !skill || campaignSkillStatus(skill,profile))return false;
  saveCampaignProfile({...profile,skills:{...profile.skills,[id]:true}});
  return true;
}

function equipCampaignGear(id) {
  const profile=refreshCampaignProfile();
  if(!profile || !campaignOwned(profile).has(id))return false;
  const gear=campaignGear[id];
  saveCampaignProfile({...profile,equipped:{...profile.equipped,[gear.slot]:id}});
  return true;
}

function campaignPlayer(profile) {
  const player=initial();
  for(const id of Object.values(profile.equipped))campaignGear[id].apply?.(player);
  for(const skill of campaignSkills){
    if(profile.skills[skill.id])skill.apply(player);
  }
  player.nut=campaignGear[profile.equipped.nut]?.effect??null;
  player.max=Math.round(player.max*(player.maxVibeScale??1));
  player.charge=Math.min(100,player.charge);
  return player;
}

function discover(id){
  if(!g.story||campaignProfile?.files.includes(id))return;
  const profile=refreshCampaignProfile();
  if(profile?.id===g.story.profileId&&!profile.files.includes(id))saveCampaignProfile({...profile,files:[...profile.files,id]});
}
