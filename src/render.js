function rect(c,x,y,w,h,fill,stroke,r=0){
  c.beginPath();c.roundRect(x,y,w,h,r);
  if(fill){c.fillStyle=fill;c.fill();}
  if(stroke){c.strokeStyle=stroke;c.stroke();}
}
function disk(c,x,y,r,fill,stroke,ry=r){
  c.beginPath();c.ellipse(x,y,r,ry,0,0,TAU);
  if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}
}
function line(c,points,color,w=1){
  c.beginPath();c.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);c.strokeStyle=color;c.lineWidth=w;c.stroke();
}
function poly(c,points,fill,stroke){
  c.beginPath();c.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);c.closePath();
  if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}
}
function caption(c,label,x,y,size,color,align='center'){
  c.font='bold '+size+'px Consolas, monospace';c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(label,x,y);
}
const arenaHeadingFont=getComputedStyle(document.documentElement).getPropertyValue('--head').trim();
function canvasBackingSize(width,height){
  const scale=Math.min(devicePixelRatio||1,Math.sqrt(12000000/(width*height)));
  return [Math.round(width*scale),Math.round(height*scale)];
}
function syncArenaResolution(){
  if(!g.story)return;
  const {width,height}=canvas.getBoundingClientRect();
  if(width<1||height<1)return;
  const [pixelsX,pixelsY]=canvasBackingSize(width,height);
  if(canvas.width===pixelsX&&canvas.height===pixelsY)return;
  canvas.width=pixelsX;canvas.height=pixelsY;
  backdrop=null;
}
function backdropFor(i){
  const c=document.createElement('canvas');c.width=canvas.width;c.height=canvas.height;
  const b=c.getContext('2d'),s=stages[i], ink='#100c1b';
  b.setTransform(c.width/W,0,0,c.height/H,0,0);
  b.lineCap='round';b.lineJoin='round';
  rect(b,0,0,W,H,ink);
  rect(b,15,55,930,464,s.floor,s.line,9);
  b.save();b.beginPath();b.roundRect(15,55,930,464,9);b.clip();
  if(i===0){
    for(let x=17;x<W;x+=29){rect(b,x,57,27,H,(x%4<2?s.tile:s.floor));line(b,[x,57,x,518],s.line);}
    for(let y=88;y<510;y+=68)line(b,[15,y,945,y],s.line);
    rect(b,133,110,694,351,'#211d34','#5d4a76',14);
    b.setLineDash([4,5]);rect(b,144,121,672,329,null,'#695580',11);b.setLineDash([]);
    for(let x of [62,114,819,871]){
      rect(b,x,70,36,66,'#171323','#54416c',5);rect(b,x+6,79,24,43,'#332746','#624e78',4);
      for(let y=86;y<120;y+=7)line(b,[x+9,y,x+27,y],'#655080',1);
      rect(b,x+10,123,16,5,'#c7f560',null,2);
    }
    for(let x of [40,862])for(let y of [397,459]){
      rect(b,x,y,58,21,'#15111f','#49375e',4);
      line(b,[x+5,y+10,x+53,y+10],'#71618a',4);rect(b,x+8,y+2,10,16,'#9a75c5',null,2);rect(b,x+39,y+2,10,16,'#9a75c5',null,2);
    }
  }else if(i===1){
    for(let y=92;y<500;y+=80){rect(b,16,y,928,60,'#201e20');line(b,[28,y+7,932,y+7],'#f4a84451');line(b,[28,y+52,932,y+52],'#f4a84451');
      for(let x=38;x<932;x+=54)rect(b,x,y+28,29,3,'#e9c18462');}
    for(let x of [28,872])for(let y of [81,242,404]){
      rect(b,x,y,60,33,'#1a1720','#624d40',5);rect(b,x+5,y+5,50,19,'#382d25',null,3);caption(b,'STOP',x+30,y+15,10,'#ffc46d');}
    for(let x=372;x<585;x+=25)rect(b,x,460,13,31,'#ffe3ad6e');
    for(const x of [179,781]){
      b.save();b.translate(x,304);if(x>480)b.scale(-1,1);
      b.beginPath();b.moveTo(-13,24);b.bezierCurveTo(-29,-22,35,-43,35,-11);b.bezierCurveTo(35,1,21,9,14,1);
      b.lineWidth=8;b.strokeStyle='#7fcda576';b.stroke();b.restore();
    }
  }else if(i===2){
    const colors=['#322043','#472354','#3b1c40','#4c2550','#303050'];
    for(let x=24;x<938;x+=48)for(let y=63;y<518;y+=45){const n=((x*7+y*11)%53)%5;rect(b,x,y,45,42,colors[n],null,4);}
    rect(b,227,102,506,372,null,'#ba5b9770',17);
    disk(b,480,284,135,null,'#ef86c054');disk(b,480,284,113,null,'#ef86c052');disk(b,480,284,91,'#461c4470','#ef86c04e');
    for(let x of [43,841])for(let y of [83,415]){rect(b,x,y,76,67,'#1f142e','#85568c',8);disk(b,x+22,y+34,14,'#3f2552','#b45ba5');disk(b,x+54,y+34,14,'#3f2552','#b45ba5');disk(b,x+22,y+34,4,'#f285c0');disk(b,x+54,y+34,4,'#f285c0');}
    caption(b,'NO FREE BIRD REQUESTS',480,327,9,'#ffd1b580');
  }else if(i===3){
    for(let x=16;x<950;x+=38)for(let y=55;y<520;y+=38){if((x+y)%3===0)rect(b,x,y,37,37,s.tile);rect(b,x+17,y+17,3,3,'#3f7263');}
    rect(b,121,94,718,397,'#1d463e','#529580',12);rect(b,137,111,686,362,'#245a4b','#77b099',9);
    for(let x of [169,771])for(let y of [148,422]){line(b,[x-16,y,x+16,y],'#79bfa6',2);line(b,[x,y-16,x,y+16],'#79bfa6',2);}
    for(let x of [44,857])for(let y of [88,427]){
      rect(b,x,y,58,49,'#0d1d1c','#4b8a7d',6);poly(b,[x+23,y+14,x+39,y+14,x+34,y+35,x+15,y+34],'#3e7a6e','#81b3a7');
      disk(b,x+47,y+9,3,'#ff7996');line(b,[x+8,y+46,x+49,y+46],'#417469',2);
    }
    caption(b,'●  REC   /   MOOD BOARD',480,304,13,'#bcffdb8f');
    for(const [i,name] of ['SLEEPY','CLASSY','EVIL'].entries()){
      rect(b,306+i*119,339,110,28,'#183c34','#7ab8a275',4);
      caption(b,name,361+i*119,353,10,'#b9efc7');
    }
  }else if(i===4){
    for(let x=17;x<947;x+=44)for(let y=55;y<519;y+=42)rect(b,x,y,42,40,(x+y)%3===0?s.floor:s.tile,null,3);
    for(let k=0;k<12;k++){const x=54+k*77,y=k%2?92:463,d=k%2?1:-1;
      line(b,[x,y,x,y+38*d,x+(k%3-1)*49,y+66*d,x+(k%3-1)*49,y+98*d],'#4e7bbe70',2);
      disk(b,x,y,4,'#7dafff',null);disk(b,x+(k%3-1)*49,y+98*d,4,'#324b73','#6598e2');
    }
    for(let r of [82,113,158,196])disk(b,480,288,r,null,'#628cc254');
    poly(b,[480,201,560,244,560,329,480,374,400,329,400,244],'#1f385d','#547cba');
    disk(b,480,285,51,'#253e66','#729ddd');
  }else{
    for(let y=61;y<518;y+=31)for(let x=20;x<944;x+=47){
      const jitter=(y/31|0)%2?8:0;
      rect(b,x-jitter,y,45,29,(x+y)%5<2?'#351821':s.tile,null,2);
    }
    for(const edge of [102,858]){
      const side=edge<480?1:-1;
      line(b,[edge,56,edge,129,edge+side*39,173,edge+side*39,367,edge,411,edge,519],'#0f090f',35);
      line(b,[edge,56,edge,129,edge+side*39,173,edge+side*39,367,edge,411,edge,519],'#c44d34',12);
      line(b,[edge,56,edge,129,edge+side*39,173,edge+side*39,367,edge,411,edge,519],'#ffb84b8e',3);
    }
    for(const x of [174,732])for(const y of [81,415]){
      rect(b,x,y,52,68,'#190f19','#923a40',5);
      for(let k=0;k<6;k++)line(b,[x+8,y+9+k*8,x+44,y+9+k*8],'#b7543f',2);
      disk(b,x+26,y+59,3,'#ffae70');
    }
    poly(b,[325,112,635,112,773,268,638,465,322,465,189,268],'#23121d','#75313e');
    for(const [scale,col] of [[1,'#b64c474f'],[.82,'#c86b5358'],[.54,'#ae393f57']]){
      b.save();b.translate(480,283);b.scale(scale,scale);
      poly(b,[-159,-137,159,-137,248,-12,152,146,-152,146,-248,-12],null,col);
      b.restore();
    }
    b.save();b.translate(480,282);b.rotate(-.11);
    rect(b,-128,-32,256,60,'#371821','#b55445',4);
    caption(b,'DO NOT REBOOT',0,0,12,'#f2b281aa');
    b.restore();
  }
  const v=b.createRadialGradient(480,277,160,480,277,537);v.addColorStop(0,'#11091b00');v.addColorStop(1,'#11091b84');rect(b,0,50,W,470,v);
  b.restore();
  for(let x=23;x<940;x+=20){rect(b,x,58,8,2,s.color+'66');rect(b,x,514,8,2,s.color+'55');}
  rect(b,0,0,W,52,'#16101e');line(b,[0,52,960,52],s.color+'77');
  drawCampaignFloor(b,campaignAreas[i]);
  return c;
}
function drawPlayer(p){
  const c=cx, step=Math.sin(p.walk)*3, ink='#160f24';
  if(p.dashing>0&&!reduced){
    c.save();c.lineWidth=1.5;
    for(let i=3;i>0;i--){
      const x=p.x-p.vx*.014*i,y=p.y-p.vy*.014*i;
      c.globalAlpha=.18+.07*(3-i);
      disk(c,x,y,16,'#8c4de2','#f0b9ff',12);
    }
    c.restore();
  }
  disk(c,p.x,p.y+8,20,'#070713a8',null,12);
  c.save();c.translate(p.x,p.y);c.rotate(p.aim);
  if(p.inv>0&&p.dashing<=0){disk(c,0,0,22,null,'#ff9ab6');if(Math.floor(p.inv*22)%2)c.globalAlpha=.67;}
  c.lineWidth=2;
  rect(c,-18+step,-12,12,8,'#e5d6ed',ink,3);rect(c,-18-step,4,12,8,'#e5d6ed',ink,3);
  disk(c,-3,0,14,'#8c4de2',ink,16);
  line(c,[-12,-11,5,-12],'#c392ff',2);line(c,[-13,11,5,12],'#c392ff',2);
  rect(c,2,-13,17,7,'#a364ee',ink,3);rect(c,5,5,16,8,'#ab63fa',ink,3);
  disk(c,3,-1,9,'#a65e43',ink,9);
  disk(c,-2,-1,6,'#31223a',null,9);
  for(let y of [-7,-2,4])disk(c,-4,y,3,'#392840',null,3.6);
  line(c,[1,-8,1,7],'#daff60',3);
  const recoil=reduced?0:p.recoil*6;
  rect(c,13-recoil,2,13,9,'#ffa558',ink,3);rect(c,24-recoil,0,7,13,'#d9ff53',ink,3);rect(c,16-recoil,4,4,5,'#8145c0',null,1);
  if(p.recoil>.52){
    c.globalAlpha=Math.min(1,(p.recoil-.52)*2.3);
    poly(c,[29,1,40,-4,37,3,47,6,37,9,40,15,29,12],'#ecffad','#fdf9e8');
  }
  c.restore();
}
function drawBot(e,c=cx,stage=g.level){
  if(specialFoes[e.kind]){drawSpecialist(c,e,specialFoes[e.kind]);return;}
  const dark='#20142c', bright='#fff2c8';
  const paint={runner:'#ef9d66',thrower:'#ffd478',guard:'#ba80e8',skater:'#58d3c3',charger:'#ff7f9f',speaker:'#89aaff',
    choir:'#ffad8d',popup:'#f4d280',firewall:'#ff6859',camerabot:'#a5ffe9'};
  const storyBot=e.storyKind&&campaignBotTypes[e.storyKind];
  const body=e.hit>0?'#fff7de':storyBot?.accent??paint[e.kind],r=e.r,step=Math.sin(e.walk)*3;
  if(e.wind>0){
    c.save();c.globalAlpha=.72;c.setLineDash([7,7]);
    line(c,[e.x,e.y,e.x+Math.cos(e.lunge)*173,e.y+Math.sin(e.lunge)*173],'#ff8a53',2);c.restore();
  }
  disk(c,e.x,e.y+8,e.r+3,'#0806149c',null,e.r*.62);
  c.save();c.translate(e.x,e.y);c.rotate(e.aim);c.lineWidth=2;
  if(e.attackWind>0||e.focus>0){
    const window=rangedAttacks[e.kind]?.wind??.87;
    const ready=1-clamp((e.attackWind||e.focus)/window,0,1);
    disk(c,0,0,r+6+ready*3,null,'#ffc888d8');
    disk(c,r+6,0,2+ready*3,'#fff1be');
  }
  if(e.hit>0&&!reduced){const squash=e.hit/.09*.11;c.scale(1-squash,1+squash);}
  if(e.kind==='runner'){
    rect(c,-17+step,-12,13,7,'#46405c',dark,2);rect(c,-17-step,6,13,7,'#46405c',dark,2);
    poly(c,[-13,-11,9,-13,15,-7,14,9,3,13,-12,9],body,dark);
    poly(c,[-8,-5,5,-8,5,8,-8,5],'#fff0cf',dark);
    poly(c,[-6,0,1,-2,5,0,1,2],'#b33854');
    rect(c,5,-7,11,14,'#432a37',dark,3);
    for(const y of [-4,4])disk(c,11,y,2,bright);
  }else if(e.kind==='thrower'){
    poly(c,[-15,-11,7,-14,14,-6,14,8,6,15,-15,11],body,dark);
    rect(c,-11,-8,12,16,'#514052',dark,2);
    rect(c,3,-7,16,14,'#514052',dark,3);rect(c,13,-4,5,8,'#fff3b1',null,2);
    rect(c,-7,-16,12,8,'#ffeb9b',dark,2);line(c,[-4,-12,2,-12],dark,1);
  }else if(e.kind==='guard'){
    for(const y of [-16,10])rect(c,-18,y,29,8,'#765592',dark,3);
    poly(c,[-17,-15,9,-15,18,-8,18,8,9,15,-17,15,-22,0],body,dark);
    rect(c,4,-12,13,24,'#432555',dark,4);line(c,[13,-7,13,7],'#f6c8ff',3);
    rect(c,18,-19,6,38,'#8e68b9','#f6c8ff',3);
    for(const y of [-11,0,11])line(c,[20,y-2,23,y,20,y+2],'#f9e0ff',1.5);
  }else if(e.kind==='skater'){
    poly(c,[-19,0,-11,-13,6,-7,16,0,6,7,-11,13],body,dark);
    line(c,[-13,-11,-20,-15],'#adffdc',2);line(c,[-13,11,-20,15],'#adffdc',2);
    for(const y of [-10,10])line(c,[-19,y,-9,y+step*.48,0,y],body,3);
    disk(c,4,0,5,'#193d3c',dark);disk(c,6,0,2,bright);
  }else if(e.kind==='charger'){
    poly(c,[-16,-10,-8,-16,13,-14,19,-5,19,5,13,14,-8,16,-16,10],body,dark);
    for(const y of [-12,12])poly(c,[1,y,7,y*1.55,22,y*1.5,16,y*.65],body,dark);
    rect(c,1,-8,13,16,'#5b2448',dark,4);line(c,[11,-5,11,5],bright,3);
  }else if(e.kind==='choir'){
    poly(c,[-20,0,-16,-23,-2,-16,9,-17,17,-6,20,0,17,6,9,17,-2,16,-16,23],body,dark);
    for(const y of [-10,0,10]){disk(c,6,y,5,'#4a1726',dark);disk(c,8,y,2,'#ffe3a4');}
  }else if(e.kind==='popup'){
    rect(c,-18,-14,36,28,body,dark,3);rect(c,-14,-8,28,17,'#371c2c',dark,2);
    for(const y of [-4,4])line(c,[-8,y,8,y],'#ff814f',2);
    line(c,[-15,-11,11,-11],'#ffe6ad',2);disk(c,13,-11,2,'#ff674a');
  }else if(e.kind==='firewall'){
    poly(c,[-21,-19,8,-23,24,-14,24,14,8,23,-21,19],body,dark);
    for(const y of [-13,0,13])rect(c,-12,y-3,25,6,'#4c1b2d',dark,2);
    for(const y of [-14,14])disk(c,16,y,3,'#ffe391');
  }else if(e.kind==='camerabot'){
    poly(c,[-16,-12,5,-14,13,-8,13,8,5,14,-16,12],body,dark);
    rect(c,-13,-8,18,16,'#285156',dark,4);
    poly(c,[5,-7,22,-13,22,13,5,7],body,dark);
    rect(c,15,-8,6,16,'#1a3442',dark,2);
    for(const y of [-5,5])disk(c,-5,y,2,'#d7ff9b');
  }else{
    rect(c,-16,-13,32,26,body,dark,7);
    disk(c,2,0,10,'#292e57',dark);disk(c,2,0,6,null,'#a8beff');disk(c,2,0,2,bright);
    for(const y of [-11,11])disk(c,-9,y,4,'#59619f',dark);
  }
  if(e.variant===0)rect(c,-12,-2,6,4,stages[stage].color,null,1);
  if(e.variant===1){
    line(c,[-9,-9,-15,-15],stages[stage].color,2);
    disk(c,-15,-15,2,stages[stage].color);
  }
  if(e.variant===2)line(c,[-10,-4,-10,4],stages[stage].color,2);
  c.restore();
  if(storyBot){
    c.lineWidth=1;disk(c,e.x+e.r*.62,e.y-e.r*.62,7,'#211329',storyBot.accent);
    caption(c,storyBot.glyph,e.x+e.r*.62,e.y-e.r*.62,10,storyBot.accent);
  }
  if(e.hp<e.max&&e.hp>0){rect(c,e.x-e.r,e.y-e.r-8,e.r*2,3,'#191026');rect(c,e.x-e.r,e.y-e.r-8,e.r*2*e.hp/e.max,3,body);}
}
function drawPC(e,c=cx){
  const hot=e.hot>0, critical=e.critical, glow=hot?'#cfff84':critical?'#ff5b45':'#ff9270';
  const screen=hot?'#4c3b21':'#2b1428', ink='#110b17';
  disk(c,e.x,e.y+25,76,'#07050bb9',null,34);
  c.save();c.translate(e.x,e.y);c.rotate(Math.sin(e.walk*.21)*.11);c.lineWidth=4;
  for(const s of [-1,1]){
    poly(c,[s*36,-21,s*53,-45,s*46,-65,s*26,-49,s*25,-27],critical?'#a52b46':'#743048',ink);
    line(c,[s*39,-27,s*45,-43,s*43,-51],'#ff795f',3);
  }
  rect(c,-57,-35,114,73,e.hit>0?'#d28d78':'#663550',ink,12);
  rect(c,-47,-27,94,52,'#ba5c53',ink,10);
  rect(c,-38,-21,76,42,screen,ink,8);
  for(let y=-16;y<20;y+=5)line(c,[-32,y,32,y],glow+'28');
  poly(c,[-25,-9,-6,-3,-7,7,-22,5],glow,ink);
  poly(c,[25,-9,6,-3,7,7,22,5],glow,ink);
  line(c,[-13,14,-6,10,0,14,6,10,13,14],glow,2);
  rect(c,-32,29,64,13,'#372337',ink,4);
  for(const x of [-22,-9,4,17])rect(c,x,32,7,4,glow,null,1);
  if(hot){
    c.globalAlpha=.55;
    disk(c,0,0,61,null,glow,43);
    if(!reduced)for(let i=0;i<3;i++){
      const y=-45-(e.walk*14+i*7)%19;
      line(c,[-15+i*15,y,-12+i*15,y-5,-15+i*15,y-10],glow,2);
    }
  }
  c.restore();
}
function drawPrime(e,c=cx){
  const color=e.hit>0?'#fff2ea':'#ff9cd9', ink='#1d102b';
  disk(c,e.x,e.y+17,75,'#090512ac',null,33);
  c.save();c.lineWidth=2;
  disk(c,e.x,e.y,104,null,'#ff9ed357',76);
  for(const pod of e.pods){
    if(pod.dead)continue;
    line(c,[e.x,e.y,pod.x,pod.y],'#fd8ee773',2);
  }
  if(e.pods.some(pod=>!pod.dead))disk(c,e.x,e.y,63,'#8c4bff19','#ffb7e8a0');
  c.translate(e.x,e.y);c.rotate(e.aim);c.lineWidth=3;
  if(e.transform>0&&!reduced){
    const assembly=1-e.transform/primeEntrance;
    const size=.52+.48*Math.min(1,assembly*1.65);
    c.scale(size,size);
  }
  for(const s of [-1,1]){
    poly(c,[-43,s*13,-51,s*63,-28,s*49,-31,s*75,-1,s*54,25,s*30,15,s*12],'#6f2da4',ink);
    line(c,[-41,s*18,-41,s*51,-24,s*37,-24,s*56,10,s*32],color,3);
    poly(c,[-8,s*20,17,s*24,36,s*41,55,s*31,36,s*12], '#a04dc0',ink);
  }
  poly(c,[-43,-16,-17,-31,18,-28,43,-12,51,0,43,12,18,28,-17,31,-43,16],'#ad63dd',ink);
  poly(c,[-27,-13,-8,-24,21,-18,36,0,21,18,-8,24,-27,13],'#411e63',ink);
  disk(c,4,0,15,color,ink);disk(c,5,0,7,'#fff6c9',ink);
  rect(c,30,-7,15,14,'#ffd893',ink,3);
  if(e.transform>0){
    const t=1-e.transform/primeEntrance;
    c.globalAlpha=.65*(1-t);
    disk(c,0,0,36+t*130,null,'#ffdfef');disk(c,0,0,50+t*100,null,'#ff99d3');
  }
  c.restore();
}
function drawPrimePod(e,c=cx){
  c.lineWidth=2;
  poly(c,[e.x-14,e.y,e.x,e.y-14,e.x+14,e.y,e.x,e.y+14],e.hit>0?'#fff1df':'#962e91','#ffb4ef');
  disk(c,e.x,e.y,4,'#fff4c5');
  rect(c,e.x-13,e.y-22,26,3,'#20122b');
  rect(c,e.x-13,e.y-22,26*e.hp/e.max,3,'#ffabed');
}
function drawFilePortrait(canvas,id){
  const {width,height}=canvas.getBoundingClientRect();
  if(width&&height)[canvas.width,canvas.height]=canvasBackingSize(width,height);
  const c=canvas.getContext('2d'), boss=id.startsWith('boss');
  c.setTransform(canvas.width/72,0,0,canvas.height/72,0,0);
  const sizes={runner:13,thrower:15,guard:21,skater:12,charger:17,speaker:16,primePod:15,prime:52,choir:16,popup:17,firewall:22,boss5:51,camerabot:17};
  const level=boss?Number(id.slice(4)):0;
  const variant=campaignBotTypes[id],kind=variant?.base??id;
  const sprite={kind,storyKind:variant?id:null,x:0,y:0,r:variant?.radius??sizes[kind]??specialFoes[kind]?.radius??36,aim:-.4,walk:0,hit:0,hp:1,max:1,variant:1,pods:[]};
  const scale=id==='boss5'?.52:boss?.69:id==='prime'||id==='hellboot'?.43:1.17;
  c.translate(36,36);c.scale(scale,scale);
  if(boss)drawCampaignBoss(sprite,c,campaignAreas[level],false);
  else if(id==='prime')drawPrime(sprite,c);
  else if(id==='hellboot')drawHellboot(c,sprite);
  else if(id==='primePod')drawPrimePod(sprite,c);
  else drawBot(sprite,c,0);
}
function drawBurst(){
  const c=cx, {x,y,a,shape,angle,width,offset,color}=g.echoAt, fade=g.echo/burstTime;
  const range=g.echoAt.range*(.62+.38*(1-fade));
  c.save();c.translate(x,y);
  if(shape==='star'){
    const points=starBurstPoints.map(point=>[point.x*g.echoAt.range,point.y*g.echoAt.range]);
    c.globalAlpha=fade*.92;c.lineWidth=5;
    poly(c,points.flat(),color+'58',color);
    c.globalAlpha=fade*.38;c.lineWidth=2;
    for(const tip of [0,2]){
      poly(c,[...points[tip],...points[tip+4],...points[tip+8]],null,color);
    }
    c.restore();return;
  }
  c.rotate(a);
  c.globalAlpha=fade*.84;c.lineWidth=3;c.beginPath();
  if(shape==='ring'||shape==='halo'||shape==='remote')c.arc(offset??0,0,range,0,TAU);
  else if(width)c.roundRect(shape==='crossbeam'?-range:0,-width,range*(shape==='crossbeam'?2:1),width*2,12);
  else {c.moveTo(0,0);c.arc(0,0,range,-angle,angle);c.closePath();}
  c.fillStyle=color+'65';c.fill();c.strokeStyle=color;c.stroke();
  c.restore();
}
const hazardLooks={
  pressure:['#ffad6c','!'],traffic:['#ffc074','»'],backbeat:['#ff8b86','♪'],
  retake:['#ff986c','REC'],targeting:['#ff7864','⊕'],firewall:['#ff694d','ϟ']
};
function drawHazard(h){
  const c=cx,t=h.wait>0?1-h.wait/h.max:1;
  const look=hazardLooks[h.theme];
  const edge=h.wait>0?look?.[0]??'#ffb477':'#fff0c6';
  const fill=h.wait>0?edge+Math.round(255*(.14+t*.24)).toString(16).padStart(2,'0'):'#ffd3a26c';
  c.save();c.lineWidth=2;
  if(h.type==='spot'){
    disk(c,h.x,h.y,h.r,fill,edge);disk(c,h.x,h.y,h.r*t,null,edge);
    if(look){
      caption(c,look[1],h.x,h.y,18,edge);
      if(h.theme==='retake')rect(c,h.x-h.r*.7,h.y-h.r*.7,h.r*1.4,h.r*1.4,null,edge,5);
      if(h.theme==='backbeat')for(const r of [.35,.67])disk(c,h.x,h.y,h.r*r,null,edge);
    }else{
      line(c,[h.x-9,h.y,h.x+9,h.y],edge);line(c,[h.x,h.y-9,h.x,h.y+9],edge);
    }
  }else{
    c.lineCap='butt';line(c,[h.a.x,h.a.y,h.b.x,h.b.y],fill,h.width);
    c.setLineDash(h.wait>0?[10,8]:[]);
    if(h.wait>0&&!reduced)c.lineDashOffset=-t*44;
    line(c,[h.a.x,h.a.y,h.b.x,h.b.y],edge,h.wait>0?2:8);c.setLineDash([]);
    const a=angle(h.a,h.b),dx=-Math.sin(a)*h.width*.5,dy=Math.cos(a)*h.width*.5;
    line(c,[h.a.x+dx,h.a.y+dy,h.b.x+dx,h.b.y+dy],edge,1);
    line(c,[h.a.x-dx,h.a.y-dy,h.b.x-dx,h.b.y-dy],edge,1);
    if(look){
      for(const factor of [.23,.5,.77])caption(c,look[1],lerp(h.a.x,h.b.x,factor),lerp(h.a.y,h.b.y,factor),18,edge);
    }
  }
  c.restore();
}
function render(){
  if(!g.story)return;
  const c=cx, p=g.p;
  if(!backdrop)backdrop=backdropFor(g.level);
  c.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
  c.drawImage(backdrop,0,0,W,H);
  c.save();c.beginPath();c.rect(15,55,930,465);c.clip();
  const screenOff=g.serverGlass?.stage===4;
  if(screenOff)rect(c,15,55,930,465,'#000');
  if(!reduced&&g.shake>0)c.translate(rand(-g.shake,g.shake),rand(-g.shake,g.shake));
  if(!screenOff)drawAreaMotion(c,g.level,reduced?0:g.clock);
  if(g.level===2&&!reduced){
    for(const [i,x] of [184,776].entries()){
      const drift=Math.sin(g.clock*.64+i*Math.PI)*117;
      poly(c,[x,58,x+drift-83,381,x+drift+107,381],'#ffd3d313');
      disk(c,x+drift+12,381,94,'#ff8ed713',null,24);
    }
  }
  if(g.primeForm){
    rect(c,15,55,930,465,'#800d6e39');
    const pulse=reduced?.55:.47+Math.sin(g.clock*3)*.23;
    c.save();c.globalAlpha=pulse;c.lineWidth=2;
    for(const r of [106,140,183,223])disk(c,480,282,r,null,'#ff8ad5',r*.8);
    for(const x of [43,917])line(c,[x,78,x,492],'#f78de7',3);
    c.restore();
  }
  if(g.level===5){
    if(g.serverGlass){
      if(!screenOff){
        rect(c,15,55,930,465,'#a812262c');
        c.lineWidth=2;c.setLineDash([12,10]);disk(c,480,280,257,null,'#ff643f90',157);c.setLineDash([]);
        drawServerPortrait(c,g.serverGlass);
      }
      drawServerGlass(c,g.serverGlass);
    }
    for(let j=0;!screenOff&&j<22;j++){
      const x=26+(j*137)%909,y=517-((g.clock*(20+j%4*7)+j*53)%459);
      disk(c,x+Math.sin(g.clock+j)*9,y,1+j%3*.55,j%3?'#ff934c79':'#ffd4729a');
    }
    if(g.safeZone){
      const {min,max,vertical}=g.safeZone;
      c.save();c.lineWidth=2;c.setLineDash([8,6]);
      if(vertical)rect(c,min,56,max-min,462,'#89ffe416','#b2ffddbd');
      else rect(c,16,min,929,max-min,'#89ffe416','#b2ffddbd');
      c.setLineDash([]);
      const center=(min+max)/2;
      for(let i=0;i<4;i++){
        const x=vertical?center:165+i*210,y=vertical?119+i*113:center;
        if(vertical)line(c,[x-10,y+3,x,y-7,x+10,y+3],'#b2ffdd9b',2);
        else line(c,[x-4,y-10,x+6,y,x-4,y+10],'#b2ffdd9b',2);
      }
      c.restore();
    }
  }
  for(const effect of g.blasts){
    c.save();
    c.globalAlpha=effect.wait>0?.42:effect.life;
    c.lineWidth=2;c.setLineDash(effect.wait>0?[4,6]:[]);
    disk(c,effect.x,effect.y,effect.r,effect.color+'20',effect.color);
    if(effect.source==='burst'&&effect.wait<=0){
      const fade=effect.life/.43;
      c.globalAlpha=fade*.72;c.lineWidth=3;
      disk(c,effect.x,effect.y,effect.r*(reduced?1:.36+.64*(1-fade)),effect.color+'45',effect.color);
    }
    c.restore();
  }
  for(const pulse of g.nutPulses){
    const alpha=pulse.life/pulse.max;
    c.save();c.globalAlpha=alpha;c.lineWidth=2;
    disk(c,pulse.x,pulse.y,(pulse.r??53)*(1-alpha*.4),'#9bdcff3a','#9bdcff');
    c.restore();
  }
  if(g.coldFlash>0)rect(c,15,55,930,465,`rgba(153,219,255,${g.coldFlash*.17})`);
  for(const h of g.hazards)drawHazard(h);
  for(const o of g.items){c.save();c.globalAlpha=o.life<2?.55+Math.sin(o.life*15)*.34:1;c.translate(o.x,o.y+Math.sin(g.clock*7)*3);c.lineWidth=2;rect(c,-9,-10,18,20,'#85efb3','#161728',4);line(c,[-5,0,5,0],'#142c26',3);line(c,[0,-5,0,5],'#142c26',3);c.restore();}
  for(const b of g.pops){line(c,[b.x-Math.cos(b.a)*17,b.y-Math.sin(b.a)*17,b.x,b.y],b.color,4);disk(c,b.x,b.y,3.5,'#fcffd5',null);}
  const actors=[...g.enemies,p];
  if(g.devil)actors.push(g.devil);
  actors.sort((a,b)=>a.y-b.y);
  for(const e of actors){
    if(e===g.devil){drawDevil(c,e);continue;}
    if(e===p){
      if(g.reviveEffect>0)drawRevive(c,p,g.reviveEffect);
      drawPlayer(p);continue;
    }
    if(e.spawn>0){
      const reveal=e.kind==='boss'?.76:.26;
      if(e.spawn<reveal){
        c.save();c.globalAlpha=clamp(1-e.spawn/reveal,.12,.86);
        if(e.kind==='boss')drawCampaignBoss(e);else drawBot(e);
        c.restore();
      }
      const radius=e.r+7+(reduced?0:Math.sin(e.spawn*11)*6);
      c.lineWidth=2;c.setLineDash([4,5]);disk(c,e.x,e.y,radius,'#e9aaff26','#e9aaff');
      c.setLineDash([]);
      if(e.spawn>=reveal*.63)caption(c,'!',e.x,e.y,20,'#ffe4ff');
      continue;
    }
    if(e.slow>0||e.stun>0){
      c.lineWidth=2;c.setLineDash(e.stun>0?[4,4]:[]);
      disk(c,e.x,e.y+7,e.r+8,'#6acdf51b',e.stun>0?'#c0a9ff':'#9edaff',Math.max(9,e.r*.68));
      c.setLineDash([]);
    }
    if(e.kind==='boss')drawCampaignBoss(e);
    else if(e.kind==='primePod')drawPrimePod(e);
    else drawBot(e);
  }
  for(const b of g.enemyPops){
    if(b.life<=0)continue;
    const color=b.type==='ember'?'#ff835d':b.type==='plasma'?'#f5a1ff':b.type==='note'?'#ffc27a':b.type==='ticket'?'#ffad6c':'#ff80a5';
    c.save();c.translate(b.x,b.y);c.rotate(b.a);c.lineWidth=1.5;
    if(b.type==='note'){disk(c,-2,2,5,color,'#2d0f30',4);line(c,[2,2,2,-8,7,-5],color,3);}
    else if(b.type==='ticket')rect(c,-7,-4,14,8,color,'#4a2233',2);
    else if(b.type==='plasma')poly(c,[-8,0,0,-6,10,0,0,6],color,'#592060');
    else if(b.type==='ember'){poly(c,[-10,0,-4,-6,8,-2,10,0,8,2,-4,6],color,'#621b33');disk(c,4,0,2,'#fff3b5');}
    else if(b.type==='plate'){disk(c,0,0,7,color,'#321633',5);disk(c,0,0,2,'#321633');}
    else{disk(c,0,0,8,color,'#321633');disk(c,1,0,3,'#fff0e9');}
    c.restore();
  }
  drawServerExplosion(c,g.serverGlass);
  for(const f of g.fx){c.save();c.globalAlpha=clamp(f.life/f.max*1.6,0,1);c.translate(f.x,f.y);c.rotate(f.a);if(f.shape)rect(c,-f.s,-f.s*.42,f.s*2,f.s*.85,f.color);else disk(c,0,0,f.s*.52,f.color);c.restore();}
  if(g.echo>0)drawBurst();
  if(g.mode==='play'&&!usesTouchControls()&&input.y>65&&input.y<505){
    const x=input.x,y=input.y;c.lineWidth=1.5;disk(c,x,y,8,null,'#eeffbab0');
    line(c,[x-12,y,x-4,y],'#eeffba');line(c,[x+4,y,x+12,y],'#eeffba');
    line(c,[x,y-12,x,y-4],'#eeffba');line(c,[x,y+4,x,y+12],'#eeffba');
  }
  for(const f of g.floaters){
    c.save();c.globalAlpha=clamp(f.life*3.3,0,1);
    const size=f.loud?20:14;
    if(f.loud){
      c.font=`20px ${arenaHeadingFont}`;c.textAlign='center';c.textBaseline='middle';
      c.shadowColor='#160e21';c.shadowOffsetX=1;c.shadowOffsetY=2;
      c.fillStyle=f.color;c.fillText(f.label,f.x,f.y);
    }
    else{caption(c,f.label,f.x+1,f.y+2,size,'#160e21');caption(c,f.label,f.x,f.y,size,f.color);}
    c.restore();
  }
  if(g.flash>0&&!reduced&&!screenOff)rect(c,15,55,930,465,'rgba(255,76,120,'+g.flash*.72+')');
  c.restore();
}

function drawAreaMotion(c,area,time){
  if(area===0){
    for(const [i,x] of [67,883].entries()){
      for(let j=0;j<7;j++)rect(c,x,101+((j*59+time*14+i*27)%374),13,3,'#d9fc702b');
    }
  }else if(area===1){
    for(const y of [190,374])for(let i=0;i<6;i++){
      const x=25+(i*170+time*106)%905;
      line(c,[x,y-9,x+27,y-9,x+38,y,x+27,y+9,x,y+9],'#ffbd7259',2);
    }
  }else if(area===3){
    for(const [i,x] of [108,852].entries()){
      const end=x+Math.sin(time*.9+i*Math.PI)*165;
      poly(c,[x,63,end-65,353,end+65,353],'#7ff3cc19');
      disk(c,end,353,67,'#7ff3cc14',null,23);
    }
  }else if(area===4){
    c.lineWidth=1.5;
    for(const y of [176,384])for(const direction of [-1,1]){
      const x=480+direction*(27+(time*112)%431);
      disk(c,x,y,8,'#a3c9ff26','#8fb9ff52',4);
    }
  }
}

function drawRevive(c,p,time){
  const progress=1-time/1.65;
  c.save();c.translate(p.x,p.y);c.globalAlpha=time/1.65;c.lineWidth=3;
  disk(c,0,8,30+progress*46,'#ffeea52a','#ffe594',12+progress*22);
  disk(c,0,-31,19+progress*8,null,'#fff7c6',7);
  for(const side of [-1,1]){
    const span=17+(reduced?12:23*Math.sin(progress*Math.PI));
    poly(c,[side*11,3,side*(span+21),-32,side*span,-7,side*(span+13),-12,side*19,10],'#fff0b8','#f3ba65');
  }
  c.restore();
}
