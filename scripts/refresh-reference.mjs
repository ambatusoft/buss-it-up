import {readFile,writeFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {areaMusic,finalPhaseMusic,musicTracks} from '../assets/audio/tracks.mjs';

const paths=['campaign/data.js','campaign/missions.js','campaign/gear.js','campaign/foes.js','game.js','audio.js','campaign/play.js','campaign/combat.js'];
const sources=await Promise.all(paths.map(path=>readFile(new URL('../src/'+path,import.meta.url),'utf8')));
const data=runInNewContext(sources.join('\n')+`
  ({
    player:initial(), dashRules, combatRules, areaTuning, burstShapes, cleanWaveRules,
    areas:campaignAreas.map((area,index)=>({
      id:area.id,name:area.name,boss:area.boss,secondForm:index===4?enemyFiles.prime.name:index===5?enemyFiles.hellboot.name:null,
      hp:Math.round(bossHP(index)*campaignBossScale[index]),
      cap:deploymentCap(index),escorts:bossEscorts[index],
      levels:campaignLevels.filter(level=>level.areaIndex===index).map(level=>({
        id:level.id,label:levelLabel(level),side:level.side,finale:level.finale,rounds:campaignRoundCount(level),target:campaignTime(level.speedTarget*1000),
        bonusCadence:level.side?Array.from({length:level.waves.length-1},(_,wave)=>bonusWaveDuration(level,wave+1)):[],
        waves:level.waves.map((groups,wave)=>({
          groups,count:campaignWave(level,wave+1).length
        }))
      }))
    })),
    gear:campaignGear, slots:gearSlots, skills:campaignSkills, branches:skillBranches,
    enemies:enemyTypes, files:enemyFiles, variants:campaignBotTypes, recordedCues, voiceQueueSize, voiceQueueLifetime, stingers
  })`,{
  musicTracks,document:{getElementById:()=>({getContext:()=>({})})},
  matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null}
},{timeout:3000});

const pct=value=>Number((value*100).toFixed(1))+'%';
const table=(head,rows)=>[head,head.map(()=>'---'),...rows].map(row=>'| '+row.join(' | ')+' |').join('\n');
const levels=data.areas.flatMap(area=>area.levels);
const trackTitle=id=>musicTracks.find(track=>track.id===id).title;
const generated=[
  '## Player and combat tuning',
  `Starts with ${data.player.max} Vibe, ${data.player.dmg} pop power, ${data.player.rate} s per volley, ${Math.round(data.player.popSpeed*data.player.shotLife)} px shot range, ${data.player.speed} px/s movement, ${data.player.charge}% charge, and ${data.player.burstDamage} base Burst damage. A hit grants ${data.player.grace} s of protection. Dash starts at ${data.player.dashSpeed} px/s for ${data.player.dashDuration} s with a ${data.player.dashMax} s cooldown. A dash can award one Close Call for ${data.dashRules.charge} charge and ${data.dashRules.score} points before build modifiers.`,
  table(['Bot HP','Boss HP','Incoming damage','Shot speed','Wave heal','Boss heal','Vibe drop'],[['enemyHP','bossHP','damage','projectileSpeed','waveHeal','bossHeal','dropChance'].map(key=>pct(data.combatRules[key]))]),
  'Regular waves apply these area multipliers on top of the campaign rules. Deployment and hazard columns scale the time between events.',
  table(['Area','Bot HP','Damage','Shot speed','Wave recovery','Deployment','Hazard timing'],data.areaTuning.map((t,index)=>[data.areas[index].name,...['hp','damage','shot','heal','deploy','hazard'].map(key=>pct(t[key]))])),
  '## Route and bosses',
  table(['Area','Levels (total rounds)','Boss','Opening boss HP','Opening escorts','Deployment cap','Area music','Boss music'],data.areas.map((area,index)=>[area.name,area.levels.map(level=>level.label+' ('+level.rounds+(level.side?', side':'')+')').join(', '),area.secondForm?[area.boss,area.secondForm].join(' → '):area.boss,area.hp,area.escorts.join(', '),area.cap,...areaMusic[index].map(trackTitle)])),
  '## Speed Clear targets',
  'Earn the medal by clearing within the listed attempt time. Bonus waves advance immediately on a clear, or after the listed interval if the deployment queue is empty. Live threats carry over when time expires.',
  table(['Level','Target','Bonus wave deadlines (s)'],levels.map(level=>[level.label,level.target,level.side?level.bonusCadence.join(' / '):'—'])),
  '## Regular waves',
  'Numbered waves begin at 0.75 s and stagger their bots by 0.22 s. Before area multipliers, main-route gaps are 3.5 s or 3.1 s for flanks. Side gaps are 2.65 s, or 2.95 s in Area 6. The active cap can delay main-route numbered deployments. Later squads repeat their first bot from wave two onward. Every Final Wave bot deploys at 0.75 s in one surge. The `edge>bots` prefix controls the entry edge. Unprefixed squads use standard spawn points.',
  table(['Level','Wave','Bots','Squads'],levels.flatMap(level=>level.waves.map((wave,index)=>[level.label,index===level.rounds-1?'Final Wave':index+1,wave.count,wave.groups.join(' / ')]))),
  '## Enemies',
  table(['ID','Name','Base HP','Base speed','Radius','Contact damage','Specialist behavior'],Object.entries(data.enemies).map(([id,enemy])=>[id,data.files[id].name,enemy.hp,enemy.speed,enemy.radius,enemy.contact,enemy.note??'—'])),
  table(['Variant','Base bot','HP multiplier','Speed multiplier','Radius','Behavior'],Object.values(data.variants).map(bot=>[bot.name,data.files[bot.base].name,bot.hp,bot.speed,bot.radius,bot.note])),
  '## Equipment',
  table(['Slot','Item','Unlock','Effect'],Object.values(data.gear).map(item=>[data.slots[item.slot].name,item.name,levels.find(level=>level.id===item.unlock)?.label??'Starter',item.text])),
  '## Skill tree',
  table(['Branch','Node','Cost (SP)','Prerequisite','Effect'],data.skills.map(skill=>[data.branches[skill.branch].name,skill.name,skill.cost??1,data.skills.find(parent=>parent.id===skill.requires)?.name??'Root',skill.text])),
  '## Burst shapes',
  table(['Shape','Range or radius (px)','Extra geometry'],Object.entries(data.burstShapes).map(([shape,settings])=>[shape,settings.range,settings.angle?Math.round(settings.angle*180/Math.PI*10)/10+'° half-angle':settings.width?settings.width+' px half-width':settings.offset?settings.offset+' px forward center':shape==='star'?'Player-centered hexagram':'Player-centered'])),
  '## Soundtrack and narration',
  table(['Track','Creator','File','Authored gain','Source'],musicTracks.map(track=>[track.title,track.author,track.file,track.gain,'[CC0 release]('+track.url+')'])),
  `Satan’s PC - Harder and Dirtier switches to **${trackTitle(finalPhaseMusic)}** on transformation. The gameplay music mix is 1.38× each track’s authored gain. The menu uses its own quieter gain.`,
  `Narration uses complete source recordings at normal speed. The queue holds ${data.voiceQueueSize} pending cues for up to ${data.voiceQueueLifetime} seconds. Failure and revival play immediately on the foreground channel.`,
  table(['Cue','File','Cooldown (s)','Priority'],Object.entries(data.recordedCues).map(([cue,[id,,cooldown,priority]])=>[cue,id+'.mp3',cooldown,priority])),
  'Each combat event plays its authored cue with overlap compensation. Settings can turn combat chatter off. A short edit starts at the listed timestamp and ends at the first detected quiet window after its earliest end. The audio check flags any edit that falls back to a fade.',
  table(['Event','File','Start (s)','Earliest end (s)','Gain'],Object.entries(data.stingers).flatMap(([cue,options])=>options.map(([id,start,end,gain])=>[cue,id+'.mp3',start,end,gain])))
].join('\n\n');

const target=new URL('../docs/GAME-DESIGN.md',import.meta.url);
const old=(await readFile(target,'utf8')).replace(/\r\n/g,'\n');
const marker=/<!-- BEGIN GENERATED TABLES -->[\s\S]*?<!-- END GENERATED TABLES -->/;
if(!marker.test(old))throw new Error('Missing design reference markers.');
const updated=old.replace(marker,()=>`<!-- BEGIN GENERATED TABLES -->\n\n${generated}\n\n<!-- END GENERATED TABLES -->`);
if(process.argv.includes('--check')){
  if(old!==updated){console.error('Game reference is stale. Run node scripts/refresh-reference.mjs.');process.exitCode=1;}
  else console.log('Game reference matches its sources.');
}else{
  await writeFile(target,updated);
  console.log('Refreshed Story design tables.');
}
