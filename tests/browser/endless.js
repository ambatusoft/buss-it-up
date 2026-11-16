const result=document.createElement('pre');
result.id='test-result';
result.hidden=true;
document.body.append(result);

try{
  sound.enabled=false;
  const reports=[];
  for(const seed of [1061,5133]){
    let rng=seed;
    Math.random=()=>((rng=Math.imul(rng,1664525)+1013904223|0)>>>0)/4294967296;
    const cleared=campaignLevels.map(level=>level.id);
    saveCampaignProfile({...freshCampaignProfile(),cleared});
    for(const id of ['needle','pierceNut','echo','stabilizer','frame','hush'])equipCampaignGear(id);
    for(const id of ['power','cadence','velocity','vibe','guard','grace','waveguard','hazardguard','movespeed','cooldown',
      'signal','cleansignal','bosscharge','cast','cleanheal','reverb','reach','loud','aftershock','burstheal','refill','riposte']){
      if(!purchaseCampaignSkill(id))throw new Error('Endless test build could not buy '+id);
    }
    startEndless();
    const arenas=[g.level];
    for(let tick=1;tick<=90*420&&g.mode==='play'&&g.wave<13;tick++){
      steerPlaytest(tick/90);
      update(1/90);
      if(g.level!==arenas.at(-1))arenas.push(g.level);
    }
    if(g.mode!=='play'||g.wave!==13||g.stats.bosses!==2||arenas.length!==3){
      throw new Error(`Endless seed ${seed} stalled on wave ${g.wave} with ${Math.round(g.p.hp)} Vibe.`);
    }
    reports.push({seed,waves:g.wave-1,arenas,bosses:g.stats.bosses,time:Number(g.stats.time.toFixed(2))});
  }
  result.textContent=JSON.stringify(reports);
}catch(error){result.textContent='FAIL '+error.message;}
