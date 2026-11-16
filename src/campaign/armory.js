let armoryTab='gear';
let armorySlot='popper';
let armorySkill=campaignSkills[0].id;
let skillPan=null;

function popPowerLabel(p){
  const groups=new Map();
  const power=p.dmg*(p.nut?.scale??1);
  const pattern=p.pattern==='overdrive'?shotPatterns.fan:shotPatterns[p.pattern]??shotPatterns.single;
  for(const [,scale] of pattern){
    const damage=(power*scale).toFixed(1);
    groups.set(damage,(groups.get(damage)??0)+1);
  }
  const volley=[...groups].map(([damage,count])=>pattern.length>1?damage+'×'+count:damage).join(' + ');
  return p.pattern==='overdrive'?power.toFixed(1)+' / '+volley:volley;
}

function renderCampaignGear(profile){
  const p=campaignPlayer(profile);
  const stats=[
    [['♥','Max Vibe',p.max,'#78efb8'],['⬟','Damage taken',Math.round(Math.max(.76,p.incoming)*100)+'%','#ffa895']],
    [['✦','Pop power',popPowerLabel(p),'#d9fc70','volley-power'],['»','Volleys / second',(1/p.rate).toFixed(1),'#ffcb81'],
      ['↔','Range',Math.round(p.popSpeed*(p.shotLife+(p.nut?.extraLife??0)))+' px','#add1ff']],
    [['➝','Move speed',Math.round(p.speed)+' px/s','#8ddfff'],['ϟ','Dash cooldown',p.dashMax.toFixed(2)+' s','#a8b4ff']],
    [['◎','Burst damage',Math.round(p.burstDamage),'#ff91cc'],['◈','Starting charge',p.charge+'%','#e9baff']]
  ];
  $('campaign-content').innerHTML=`<section class="armory">
    <header class="campaign-heading"><h2 id="campaign-heading" tabindex="-1">Upgrades</h2><strong class="armory-points">${campaignPoints(profile)} SP</strong></header>
    <nav class="armory-tabs" aria-label="Upgrade views"><button class="secondary" data-armory="gear" aria-pressed="${armoryTab==='gear'}">Equipment</button><button class="secondary" data-armory="skills" aria-pressed="${armoryTab==='skills'}">Skill tree</button>
    ${armoryTab==='skills'?`<button class="secondary refund-button" data-refund="skills" ${Object.keys(profile.skills).length?'':'disabled'}>Refund skills</button>`:''}</nav>
    <div class="armory-body">
      <aside class="armory-stats" aria-label="Build stats">${stats.map(group=>`<dl class="stat-group">${group.map(([icon,label,value,color,valueClass=''])=>`<div class="stat-row" style="--stat:${color}"><dt><span aria-hidden="true">${icon}</span>${label}</dt><dd class="${valueClass}">${value}</dd></div>`).join('')}</dl>`).join('')}</aside>
      <div class="armory-panel">${armoryTab==='gear'?equipmentView(profile):skillTreeView(profile)}</div>
    </div></section>`;
  if(armoryTab==='skills')bindSkillPan();
}

function equipmentView(profile){
  const owned=campaignOwned(profile);
  const tabs=Object.entries(gearSlots).map(([id,slot])=>{
    const equipped=campaignGear[profile.equipped[id]];
    return `<button class="slot-tab" data-slot="${id}" aria-pressed="${id===armorySlot}" style="--slot:${slot.color}">${gearIcon(equipped.icon)}<span><b>${slot.name}</b><small>${equipped.name}</small></span></button>`;
  }).join('');
  const gearOrder=item=>campaignLevelById.get(item.unlock)?.index??-1;
  const items=Object.entries(campaignGear).filter(([,item])=>item.slot===armorySlot)
    .sort(([,a],[,b])=>gearOrder(a)-gearOrder(b)).map(([id,item])=>{
    const equipped=profile.equipped[item.slot]===id, unlocked=owned.has(id);
    const gate=campaignLevelById.get(item.unlock);
    const visible=!gate||gate.areaIndex<campaignVisibleAreas(profile);
    if(!visible)return '';
    const label=equipped?'Equipped':unlocked?'Equip':`Clear ${levelLabel(gate)}`;
    const state=equipped?'equipped':unlocked?'available':'locked';
    const badge=equipped?'◆ Equipped':unlocked?'◇ Owned':'▣ Locked';
    return `<article class="gear-item ${state}" style="--slot:${gearSlots[item.slot].color}"><div class="gear-icon">${gearIcon(item.icon)}</div><div><small class="gear-state">${badge}</small><h3>${item.name}</h3><p>${unlocked?item.text:'???'}</p></div><button class="secondary" data-equip="${id}" ${equipped||!unlocked?'disabled':''}>${label}</button></article>`;
  }).join('');
  return `<nav class="slot-tabs" aria-label="Equipment slots">${tabs}</nav><div class="gear-grid menu-scroll" data-scroll-key="${armorySlot}">${items}</div>`;
}

function skillTreeView(profile){
  const selected=campaignSkills.find(node=>node.id===armorySkill);
  const branches=Object.values(skillBranches).map(item=>`<span style="--branch:${item.color}"><i></i>${item.name}</span>`).join('');
  const lines=campaignSkills.map(node=>{
    const parent=campaignSkills.find(other=>other.id===node.requires)??{x:50,y:49};
    return `<line x1="${parent.x}" y1="${parent.y}" x2="${node.x}" y2="${node.y}" stroke="${skillBranches[node.branch].color}" class="${profile.skills[node.id]?'linked':''}" vector-effect="non-scaling-stroke"/>`;
  }).join('');
  const nodes=campaignSkills.map(node=>{
    const bought=profile.skills[node.id];
    const ready=!campaignSkillStatus(node,profile);
    return `<button class="skill-node ${bought?'bought':ready?'ready':'locked'}" style="--x:${node.x}%;--y:${node.y}%;--branch:${skillBranches[node.branch].color}" data-skill-node="${node.id}" aria-label="${node.name} · ${skillCost(node)} SP${bought?' · purchased':ready?' · available':' · locked'}" title="${node.name}" aria-pressed="${selected===node}">${node.icon}<small aria-hidden="true">${bought?'✓':skillCost(node)}</small></button>`;
  }).join('');
  return `<div class="skill-layout"><div class="skill-map"><div class="skill-legend">${branches}<span class="pan-hint">Drag to pan</span></div><div class="skill-pan" tabindex="0" aria-label="Pannable skill tree"><div class="skill-board">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>
    <span class="skill-root" title="Starting point" aria-hidden="true">✦</span>${nodes}</div></div></div>
    <article class="skill-detail" aria-live="polite">${skillDetails(selected,profile)}</article></div>`;
}

function skillDetails(skill,profile){
  const branch=skillBranches[skill.branch], status=campaignSkillStatus(skill,profile);
  return `<div style="--branch:${branch.color}"><div class="skill-detail-icon" aria-hidden="true">${skill.icon}</div><small>${branch.name} · ${skillCost(skill)} SP</small><h3>${skill.name}</h3><p>${skill.text}</p><button class="primary" data-buy="${skill.id}" ${status?'disabled':''}>${status||`Unlock · ${skillCost(skill)} SP`}</button>${status?'':'<p class="skill-shortcut">Double-click the node to unlock</p>'}</div>`;
}

function selectSkillNode(button){
  armorySkill=button.dataset.skillNode;
  const selected=campaignSkills.find(node=>node.id===armorySkill);
  const content=$('campaign-content');
  content.querySelector('[data-skill-node][aria-pressed="true"]')?.setAttribute('aria-pressed','false');
  button.setAttribute('aria-pressed','true');
  content.querySelector('.skill-detail').innerHTML=skillDetails(selected,campaignProfile);
}

function bindSkillPan(){
  const viewport=document.querySelector('.skill-pan');
  if(!viewport)return;
  viewport.scrollLeft=skillPan?.x??(viewport.scrollWidth-viewport.clientWidth)/2;
  viewport.scrollTop=skillPan?.y??(viewport.scrollHeight-viewport.clientHeight)/2;
  const remember=()=>{skillPan={x:viewport.scrollLeft,y:viewport.scrollTop};};
  viewport.addEventListener('scroll',remember);
  let drag=null,suppressClick=false;
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0||!event.isPrimary)return;
    suppressClick=false;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
  });
  viewport.addEventListener('pointermove',event=>{
    if(drag?.id!==event.pointerId)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!suppressClick&&Math.hypot(dx,dy)<5)return;
    if(!suppressClick){
      suppressClick=true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('panning');
    }
    viewport.scrollLeft=drag.left-dx;viewport.scrollTop=drag.top-dy;remember();
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(type,event=>{
    if(drag?.id!==event.pointerId)return;
    drag=null;viewport.classList.remove('panning');
  });
  viewport.addEventListener('pointerleave',()=>{if(!suppressClick)drag=null;});
  viewport.addEventListener('click',event=>{
    if(!suppressClick)return;
    suppressClick=false;event.stopPropagation();event.preventDefault();
  },true);
}

function handleArmoryButton(button){
  const {armory,slot,equip,skillNode,buy,refund}=button.dataset;
  if(refund){
    refundCampaignSkills();
    renderCampaign();
    $('campaign-content').querySelector('[data-armory="skills"]').focus({preventScroll:true});
    return;
  }
  if(armory)armoryTab=armory;
  else if(slot)armorySlot=slot;
  else if(equip)equipCampaignGear(equip);
  else if(skillNode){selectSkillNode(button);return;}
  else if(buy)purchaseCampaignSkill(buy);
  else return;
  renderCampaign();
  const match=buy?`[data-skill-node="${buy}"]`:equip?`[data-slot="${armorySlot}"]`:`[${button.getAttributeNames().find(name=>name.startsWith('data-'))}="${armory??slot??skillNode}"]`;
  $('campaign-content').querySelector(match)?.focus({preventScroll:true});
}

$('campaign-content').addEventListener('dblclick',event=>{
  const node=event.target.closest('[data-skill-node]');
  if(!node||!purchaseCampaignSkill(node.dataset.skillNode))return;
  armorySkill=node.dataset.skillNode;
  renderCampaign();
  $('campaign-content').querySelector(`[data-skill-node="${armorySkill}"]`)?.focus({preventScroll:true});
});
