function drawCampaignFloor(c,area){
  const accent=area.accent;
  const tint=accent+'32';
  c.save();
  c.beginPath();c.rect(15,55,930,465);c.clip();
  if(area.id==='district'){
    for(const x of [196,764])for(const y of [165,402]){
      rect(c,x-36,y-27,72,54,'#141222',tint,8);
      rect(c,x-21,y-17,42,34,'#262039',tint,5);
      line(c,[x-28,y-8,x+28,y-8],tint,4);
      for(const end of [-1,1])rect(c,x+end*23-4,y-17,8,18,'#433154',tint,2);
    }
    for(const x of [376,480,584]){
      rect(c,x-45,81,90,23,'#34364b',tint,3);
      line(c,[x-33,99,x-12,85,x+7,85,x-14,99],'#b6c3dd38',2);
    }
  }else if(area.id==='terminal'){
    for(const y of [190,374]){
      rect(c,18,y-29,924,58,'#11131a66');
      c.setLineDash([19,13]);line(c,[18,y,943,y],tint,2);c.setLineDash([]);
      for(const x of [157,749])for(let i=0;i<5;i++)rect(c,x+i*14,y-28,6,56,tint);
    }
  }else if(area.id==='radio'){
    for(const x of [132,828]){
      rect(c,x-41,153,82,229,'#201327',tint,8);
      for(let i=0;i<3;i++){disk(c,x,192+i*72,26,null,tint);disk(c,x,192+i*72,13,null,tint);}
    }
    c.setLineDash([3,8]);for(const r of [116,145,190])disk(c,480,283,r,null,tint,r*.68);c.setLineDash([]);
  }else if(area.id==='studio'){
    for(const x of [116,844])for(const y of [132,428]){
      line(c,[x-28,y,x-28,y-23,x-5,y-23],tint,3);
      line(c,[x+28,y,x+28,y+23,x+5,y+23],tint,3);
      disk(c,x,y,4,accent+'55');
    }
    c.setLineDash([4,10]);line(c,[480,80,480,505],tint,2);c.setLineDash([]);
  }else if(area.id==='core'){
    for(const [x,y] of [[212,179],[745,386]]){
      disk(c,x,y,67,'#441a302e','#ff737d50');disk(c,x,y,49,null,'#ff737d4e');
      line(c,[x-78,y,x-38,y],'#ff737d62',2);line(c,[x+38,y,x+78,y],'#ff737d62',2);
    }
  }else{
    for(const x of [127,833]){
      rect(c,x-35,221,70,123,'#170f18',tint,5);
      for(let i=0;i<6;i++)rect(c,x-24,232+i*16,48,10,i%2?'#361923':'#452128',tint,1);
    }
  }
  c.restore();
}

function drawCampaignBoss(e,c=cx,area=campaignAreas[g.level],primeForm=g.primeForm){
  const ink='#171121', paper='#f9e3c2';
  const color=e.hit>0?'#fff4dc':area.accent;
  if(primeForm){
    drawPrime(e,c);
    return;
  }
  if(area.id==='server'){
    if(e.satanPhase){drawHellboot(c,e);return;}
    drawPC(e,c);
    const glow=e.hot>0?'#cfff84':'#ff886f';
    c.save();c.translate(e.x,e.y);c.lineWidth=2;
    for(const sign of [-1,1]){
      poly(c,[sign*39,-27,sign*61,-22,sign*65,16,sign*55,27,sign*39,21],'#321927',ink);
      for(let row=0;row<4;row++)line(c,[sign*47,-13+row*8,sign*56,-13+row*8],glow,2);
    }
    rect(c,-37,-48,74,13,'#201423',glow,3);
    const lit=e.hot>0?7:e.critical?5:3;
    for(let i=0;i<7;i++)rect(c,-31+i*9,-44,6,5,i<lit?glow:'#52313b',null,1);
    c.restore();
    return;
  }
  disk(c,e.x,e.y+13,e.r*1.31,'#090615b0',null,e.r*.66);
  if(e.wind||e.charge>0){c.lineWidth=2;disk(c,e.x,e.y,e.r+12,null,'#ffd98d');}
  if(e.solo?.amp){
    const {x,y}=e.solo.amp, r=20+12*(1-e.solo.left/e.solo.total);
    disk(c,x,y,r,'#ff9c7b2d','#ffd2a7');caption(c,'♪',x,y,23,'#ffe5af');
  }
  if(e.primeVolley){
    const a=e.primeVolley.aim;
    disk(c,e.x+Math.cos(a)*47,e.y+Math.sin(a)*47,6,'#ffcba3','#ffdabb');
  }
  c.save();c.translate(e.x,e.y);c.lineWidth=3;
  if(area.id==='district'){
    c.rotate(e.aim);
    for(const y of [-31,31]){
      rect(c,-31,y-10,45,20,'#5a5178',ink,5);
      rect(c,4,y-13,28,26,color,ink,4);
      line(c,[14,y-7,14,y+7],ink,3);
    }
    rect(c,-32,-22,56,44,'#5c476f',ink,7);
    rect(c,-25,-17,43,34,paper,ink,4);
    for(let i=0;i<4;i++)line(c,[-17,-9+i*6,5,-9+i*6],'#635272',2);
    poly(c,[9,-12,20,-12,25,0,20,12,9,12,15,0],color,ink);
  }else if(area.id==='terminal'){
    if(e.wind||e.charge>0)c.rotate(e.aim);
    else if(Math.cos(e.aim)<0)c.scale(-1,1);
    for(const x of [-33,33])for(const y of [-22,22])rect(c,x-9,y-6,18,12,'#30242e',ink,3);
    poly(c,[-50,-18,-43,-26,29,-26,48,-15,51,0,48,15,29,26,-43,26,-50,18],color,ink);
    for(const y of [-17,12])for(const x of [-39,-23,-7,9])rect(c,x,y,12,6,'#454265',ink,1);
    rect(c,28,-16,15,32,'#364460',ink,4);
    for(const y of [-13,13])disk(c,48,y,3,'#fff5b7');
    rect(c,-26,-8,43,16,'#301e2e',ink,3);
    caption(c,'BUS × 2',-5,0,10,paper);
  }else if(area.id==='radio'){
    c.rotate(Math.sin(e.walk*.58)*.20);
    rect(c,-36,-27,72,54,'#593259',ink,10);
    for(const x of [-22,22]){
      disk(c,x,5,14,'#211631',ink);
      disk(c,x,5,8,null,color);disk(c,x,5,3,paper);
      rect(c,x-4,-21,8,6,color,ink,1);
    }
    line(c,[13,-25,12,-12,14,11,6,26,-6,27,-16,20,-17,10],ink,10);
    line(c,[13,-25,12,-12,14,11,6,26,-6,27,-16,20,-17,10],color,5);
    disk(c,-18,8,8,'#ffc77b',ink,5);
  }else if(area.id==='studio'){
    c.rotate(e.aim);
    rect(c,-33,-27,57,54,'#326655',ink,7);
    rect(c,-28,-21,31,42,'#17252c',ink,5);
    for(const y of [-11,11]){
      poly(c,[1,y-6,32,y-10,40,y-10,40,y+10,32,y+10,1,y+6],color,ink);
      rect(c,36,y-8,8,16,'#304d49',ink,2);
    }
    disk(c,-18,0,7,'#ff847d',ink);
    line(c,[-20,-27,-14,-36,8,-36,17,-27],color,4);
  }else{
    c.rotate(e.aim);
    for(const side of [-1,1]){
      poly(c,[-36,side*19,-18,side*39,9,side*32,26,side*21,14,side*10],'#5271b5',ink);
      line(c,[-22,side*24,-3,side*25,17,side*17],color,3);
    }
    poly(c,[-34,-19,-18,-28,17,-24,37,-10,37,10,17,24,-18,28,-34,19],'#7397c9',ink);
    rect(c,-20,-15,48,30,'#263958',ink,6);
    disk(c,7,0,13,'#8b274a',ink);
    disk(c,7,0,8,'#ff7484',ink);
    disk(c,7,0,3,paper);
  }
  c.restore();
}

const monitorImages=monitorFrames.map(url=>{
  const photo=new Image();
  photo.src=url;
  return photo;
});

function serverPortraitAt(glass,clock){
  if(glass.stage===4||glass.portraitsAt===null)return null;
  const age=Math.max(0,clock-glass.portraitsAt), interval=1.18;
  const pulse=age%interval;
  if(!reduced&&pulse>=.34)return null;
  const index=reduced?0:Math.floor(age/interval)%monitorImages.length;
  return {index,alpha:reduced?.55:Math.min(1,pulse/.09,(.34-pulse)/.14)};
}

function drawServerPortrait(c,glass){
  const frame=serverPortraitAt(glass,g.clock);
  const photo=monitorImages[frame?.index];
  if(!photo?.naturalWidth)return;
  const overscan=reduced?0:Math.ceil(g.shake);
  const x=15-overscan,y=55-overscan,w=930+2*overscan,h=465+2*overscan;
  const scale=Math.max(w/photo.naturalWidth,h/photo.naturalHeight);
  const sourceW=w/scale,sourceH=h/scale;
  const left=(photo.naturalWidth-sourceW)/2,top=(photo.naturalHeight-sourceH)/2;
  c.save();
  c.globalAlpha=frame.alpha;
  c.drawImage(photo,left,top,sourceW,sourceH,x,y,w,h);
  rect(c,x,y,w,h,'#1b091b78');
  for(let sy=y;sy<y+h;sy+=6)rect(c,x,sy,w,2,'#12071995');
  c.restore();
}

const serverCracks=[
  [
    [0,137,89,168,144,163,168,199,222,211,248,262,317,288,368,350,420,365],
    [144,163,153,125,193,110,212,54], [222,211,266,197,297,222,353,205],
    [248,262,218,298,221,328,169,376,167,434,125,520], [89,168,53,222,0,244],
    [221,328,276,365,281,398]
  ],[
    [712,54,670,108,696,157,656,204,682,231,644,287,658,321,620,371,631,429,593,520],
    [696,157,753,148,782,116,833,110,875,54], [656,204,600,180,566,191,507,156,451,165],
    [682,231,730,236,754,272,829,288,865,325,960,343], [644,287,584,288,547,324,497,312],
    [829,288,864,257,906,266,960,238]
  ],[
    [0,462,74,436,125,449,167,434,211,456,288,441,325,460,390,435,420,365,463,351,497,312,514,257,566,191],
    [390,435,414,478,400,520], [420,365,471,414,544,427,591,413,631,429,678,409,714,433,767,409,825,439,960,405],
    [497,312,455,268,411,267,378,226,353,205,354,148,313,123,294,54],
    [767,409,747,455,789,490,806,520], [463,351,478,379,516,387,544,427,520,468,545,520]
  ]
];
const glassImpacts=[[222,211],[656,204],[497,312]];

function drawGlassImpact(c,x,y,stage){
  const t=stage*.9;
  for(let i=0;i<8;i++){
    const a=i*TAU/8+t, r=17+(i*13)%30;
    const dx=Math.cos(a),dy=Math.sin(a);
    line(c,[x,y,x+dx*r*.48-dy*6,y+dy*r*.48+dx*6,x+dx*r,y+dy*r],'#e0f4ff',1.35);
  }
  disk(c,x,y,5,'#fff0d7','#17141c');
}

function drawServerGlass(c,glass){
  const {stage,at,x,y}=glass;
  if(stage===0)return;
  const age=g.clock-at;
  c.save();
  if(stage<4){
    for(let i=0;i<stage;i++){
      c.globalAlpha=i===stage-1?.96:.72;
      for(const path of serverCracks[i]){
        line(c,path,'#140916',6);
        c.save();c.translate(1.7,-1.2);
        line(c,path,i===2?'#ffcab1':'#c2f1ff',1.8);
        c.restore();
      }
      drawGlassImpact(c,...glassImpacts[i],i);
    }
    if(!reduced&&age<.28){
      const [ix,iy]=glassImpacts[stage-1];
      const fade=1-age/.28;
      c.globalAlpha=fade*.72;c.lineWidth=2;
      disk(c,ix,iy,20+age*325,null,'#f5ecdf',(20+age*325)*.68);
    }
  }else{
    const motion=reduced?0:age;
    c.globalAlpha=reduced?.55:clamp(1-age*.82,0,1);
    for(let i=0;i<28;i++){
      const sx=62+(i%7)*140+(i*31)%49, sy=84+Math.floor(i/7)*112+(i*29)%62;
      const a=Math.atan2(sy-y,sx-x), speed=160+(i*43)%395, size=24+(i*19)%50;
      const face=i%2?'#799eaf55':'#c3dce666', edge=i%2?'#86c5db':'#e4f7ff';
      c.save();
      c.translate(sx+Math.cos(a)*motion*speed,sy+Math.sin(a)*motion*speed*.6+motion*motion*180);
      c.rotate(a+i*.5+motion*(i%2?3:-2));
      c.lineWidth=2;
      poly(c,[-size,-size*.21,-size*.25,-size*.61,size,-size*.42,size*.48,size*.58],face,edge);
      poly(c,[-size,-size*.21,-size*.25,-size*.61,size*.48,size*.58],'#d7f5ff38');
      line(c,[-size*.25,-size*.61,size*.48,size*.58],'#f3fffcac',1.4);
      c.restore();
    }
  }
  if(stage<4&&!reduced&&age<.46){
    const tick=Math.floor(age*24);
    c.globalAlpha=(1-age/.46)*.54;
    for(let i=0;i<5+stage*2;i++){
      const left=(i*239+tick*83)%900, top=58+(i*79+tick*31)%459;
      const width=30+(i*71+tick*11)%250;
      rect(c,left,top,width,i%4+2,'#96f3e063');
      rect(c,left+9,top+2,width,i%3+1,'#ff624a82');
    }
  }
  c.restore();
}

function drawServerExplosion(c,glass){
  if(glass?.stage!==4)return;
  const age=g.clock-glass.at;
  if(age>=.78)return;
  const fade=1-age/.78, radius=reduced?132:34+age*480;
  c.save();
  c.globalAlpha=fade*(reduced?.38:.82);
  c.lineWidth=3+fade*6;
  disk(c,glass.x,glass.y,radius,'#ff8d452b','#ffb482');
  c.lineWidth=2;
  disk(c,glass.x,glass.y,radius*.78,null,'#ffe2ab');
  disk(c,glass.x,glass.y,radius*1.10,null,'#8fe4db');
  if(!reduced&&age<.26){
    const glow=c.createRadialGradient(glass.x,glass.y,0,glass.x,glass.y,114);
    glow.addColorStop(0,'#fff4cc');glow.addColorStop(.35,'#ffc78a');glow.addColorStop(1,'#fa715400');
    c.globalAlpha=1-age/.26;
    disk(c,glass.x,glass.y,114,glow);
  }
  c.restore();
}

function drawHellboot(c,e){
  const hot=e.hot>0, edge=hot?'#baff93':'#ff634a', glow='#fff0b8';
  const twitch=reduced?0:Math.sin(e.walk*.9)*4;
  c.save();c.translate(e.x,e.y);
  c.lineWidth=2;
  disk(c,0,29,91,'#08050dc8',null,44);
  disk(c,0,1,72,null,'#f342344e');
  for(const side of [-1,1]){
    poly(c,[side*33,-18,side*43,-48,side*53,-69,side*49,-83,side*63,-70,side*67,-48,side*57,-20],'#311521','#a73e36');
    for(let i=0;i<3;i++){
      const y=-9+i*19, leg=74+i*7;
      poly(c,[side*38,y,side*(leg-9),y-17+twitch,side*leg,y-13+twitch,side*(leg+5),y+17,side*(leg-7),y+28,side*(leg-8),y+1,side*45,y+12],
        i%2?'#362033':'#491c2a','#a84343');
      disk(c,side*(leg-6),y-9+twitch,3,'#fa805c');
    }
    for(let i=0;i<3;i++)line(c,[side*41,19+i*6,side*(52+i*6),33+i*6,side*(63+i*3),43+i*6],'#bd5847',2);
  }
  poly(c,[-52,-25,-43,-44,36,-45,52,-29,50,39,29,48,-37,44,-50,28],'#28141e',edge);
  rect(c,-40,-32,79,66,hot?'#29452b':'#3a111c','#100a13',7);
  for(let y=-29;y<30;y+=5)line(c,[-37,y,35,y],'#1107129b',1);
  c.save();c.shadowBlur=hot?9:13;c.shadowColor=edge;
  disk(c,-16,-10,11,edge,null,5);disk(c,18,-14,13,edge,null,6);
  disk(c,-14,-10,2.3,'#0e0811',null,5);disk(c,15,-14,2.5,'#0e0811',null,5);
  c.restore();
  poly(c,[-27,4,-13,1,0,9,13,3,29,2,23,19,10,24,-14,21,-23,16],'#0d090f','#984340');
  for(let i=0;i<6;i++){
    const x=-19+i*7;
    poly(c,[x,7,x+5,7,x+2,14],glow);
    if(i%2===0)poly(c,[x,20,x+5,20,x+3,15],'#ffb987');
  }
  line(c,[-34,-19,-24,-22,-23,-17,-14,-20],glow,1);
  line(c,[32,24,22,28,14,26],edge,2);
  const photo=monitorImages[e.monitorFrame];
  const remaining=e.monitorUntil-g.clock;
  if(remaining>0&&photo?.naturalWidth){
    c.save();
    c.globalAlpha=reduced?.8:Math.min(.92,remaining*5);
    c.drawImage(photo,-37,-29,73,59);
    for(let y=-28;y<30;y+=5)line(c,[-37,y,36,y],'#180f2366',1);
    c.restore();
  }
  if(e.transform>0){
    const t=1-e.transform/primeEntrance;
    c.globalAlpha=1-t;disk(c,0,0,50+118*t,null,edge);
  }
  c.restore();
}
function decorateResults(box,survived){
  box.classList.add('result-card',survived?'result-win':'result-loss');
  const portrait=document.createElement('div');
  portrait.className='result-face';
  portrait.innerHTML=`<svg viewBox="116 35 214 216" aria-hidden="true"><use href="#dreamy-head"/><use href="#dreamy-${survived?'grin':'wince'}"/></svg>`;
  const header=document.createElement('header');
  header.className='result-header';
  const copy=document.createElement('div');
  copy.append(box.querySelector('small'),box.querySelector('h2'));
  const subtitle=box.querySelector('p');
  if(subtitle.textContent.trim())copy.append(subtitle);
  else subtitle.remove();
  header.append(portrait,copy);
  box.prepend(header);
}
