const finalWaveSquads=[
  ['north>stapler stamper runner','south>timecard guard thrower','flanks>skater guard charger'],
  ['west>headlight inspector faregate','east>faregate skater inspector','south>charger thrower guard','north>headlight'],
  ['flanks>tuningfork choir repeater','south>feedback speaker choir','north>repeater skater guard','east>choir tuningfork'],
  ['east>clapper cutout lighting','west>lighting camerabot clapper','north>clapper charger guard','south>cutout lighting'],
  ['north>induction scout cutter','south>cutter popup firewall','east>scout induction guard','west>charger cutter induction'],
  ['north>ash ghost backup','south>choir firewall backup','east>ash ash backup ghost','west>ghost firewall']
];
const finalWaveSideBots=['east>stamper stapler','north>inspector faregate','west>tuningfork choir','flanks>clapper lighting','south>cutter induction','flanks>ash firewall'];
const speedTargets=[
  [45,50,45,70,80],
  [60,60,55,80,100],
  [70,70,65,85,100],
  [80,85,75,95,115],
  [100,105,85,140,135],
  [105,105,115,175,130]
];

function finalWaveFor(areaIndex,position){
  const squads=finalWaveSquads[areaIndex];
  const offset=position%squads.length;
  const ordered=[...squads.slice(offset),...squads.slice(0,offset)];
  if(position===4)ordered.push(finalWaveSideBots[areaIndex]);
  return ordered;
}

const campaignLevels=campaignAreas.flatMap((area,areaIndex)=>{
  const [first,second,third,finale]=area.levels;
  const previousFinale=campaignAreas[areaIndex-1]?.levels[3];
  const nextArea=campaignAreas[areaIndex+1]?.levels[0];
  const prerequisites=[previousFinale?.id,first.id,second.id,third.id,second.id];
  const destinations=[second.id,third.id,finale.id,nextArea?.id,third.id];
  return area.levels.map((level,position)=>({
    ...level,waves:position===3?level.waves:[...level.waves,finalWaveFor(areaIndex,position)],area,areaIndex,position,
    number:`${areaIndex+1}-${position===4?'X':position+1}`,speedTarget:speedTargets[areaIndex][position],
    finale:position===3,side:position===4,requires:prerequisites[position],next:destinations[position]
  }));
}).map((level,index)=>({...level,index}));

const campaignLevelById=new Map(campaignLevels.map(level=>[level.id,level]));
const levelLabel=level=>`${level.number}: ${level.name}`;
const campaignRoundCount=level=>level.waves.length+Number(level.finale);
const clearSkillPoints=level=>level.finale||level.side?2:1;

function parseSquad(group){
  const [edge,bots]=group.includes('>')?group.split('>'):['any',group];
  return {edge,bots:bots.split(' ')};
}
