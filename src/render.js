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
function backdropFor(i){
  const c=document.createElement('canvas');c.width=W;c.height=H;
  const b=c.getContext('2d'),s=stages[i], ink='#100c1b';
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
    caption(b,'B U S S   F I T N E S S',480,276,40,'#5a47724d');
    caption(b,'STANDIN’ ON BUSSINESS  /  FLOOR 01',480,302,12,'#a68db48a');
  }else if(i===1){
    for(let y=92;y<500;y+=80){rect(b,16,y,928,60,'#201e20');line(b,[28,y+7,932,y+7],'#f4a84451');line(b,[28,y+52,932,y+52],'#f4a84451');
      for(let x=38;x<932;x+=54)rect(b,x,y+28,29,3,'#e9c18462');}
    for(let x of [28,872])for(let y of [81,242,404]){
      rect(b,x,y,60,33,'#1a1720','#624d40',5);rect(b,x+5,y+5,50,19,'#382d25',null,3);caption(b,'STOP',x+30,y+15,10,'#ffc46d');}
    for(let x=372;x<585;x+=25)rect(b,x,460,13,31,'#ffe3ad6e');
    caption(b,'DREAMYBUS  •  EXPRESS ONLY',480,284,29,'#ffcb7951');
    caption(b,'ROUTE 02  /  TENTACLE TRANSFER',480,306,11,'#facc8f9c');
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
    caption(b,'AMBATUBLOW',480,284,39,'#ffbee466');
    caption(b,'THESIS NIGHT  /  MIDNIGHT PERSONA',480,309,12,'#ffbee4a0');
    caption(b,'NO FREE BIRD REQUESTS',480,327,9,'#ffd1b580');
  }else if(i===3){
    for(let x=16;x<950;x+=38)for(let y=55;y<520;y+=38){if((x+y)%3===0)rect(b,x,y,37,37,s.tile);rect(b,x+17,y+17,3,3,'#3f7263');}
    rect(b,121,94,718,397,'#1d463e','#529580',12);rect(b,137,111,686,362,'#245a4b','#77b099',9);
    for(let x of [169,771])for(let y of [148,422]){line(b,[x-16,y,x+16,y],'#79bfa6',2);line(b,[x,y-16,x,y+16],'#79bfa6',2);}
    for(let x of [44,857])for(let y of [88,427]){
      rect(b,x,y,58,49,'#0d1d1c','#4b8a7d',6);poly(b,[x+23,y+14,x+39,y+14,x+34,y+35,x+15,y+34],'#3e7a6e','#81b3a7');
      disk(b,x+47,y+9,3,'#ff7996');line(b,[x+8,y+46,x+49,y+46],'#417469',2);
    }
    caption(b,'OMAYGOT STUDIOS',480,272,39,'#a6f9d961');
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
    caption(b,'AMBATRON',480,283,26,'#9eb9eb90');
    caption(b,'CORE // 05',480,309,12,'#a8c8f1');
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
    caption(b,'BURNT SERVER',0,-7,28,'#f27d5b9e');
    caption(b,'DO NOT REBOOT',0,14,12,'#f2b281aa');
    b.restore();
  }
  const v=b.createRadialGradient(480,277,160,480,277,537);v.addColorStop(0,'#11091b00');v.addColorStop(1,'#11091b84');rect(b,0,50,W,470,v);
  b.restore();
  for(let x=23;x<940;x+=20){rect(b,x,58,8,2,s.color+'66');rect(b,x,514,8,2,s.color+'55');}
  rect(b,0,0,W,52,'#16101e');line(b,[0,52,960,52],s.color+'77');
  rect(b,0,520,W,24,'#16101e');line(b,[0,520,960,520],s.color+'77');
  caption(b,'UNOFFICIAL ARCADE  /  NO REPS AFTER MIDNIGHT',933,533,9,'#a58db2','right');
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
  const dark='#20142c', bright='#fff2c8';
  const paint={runner:'#ef9d66',thrower:'#ffd478',guard:'#ba80e8',skater:'#58d3c3',charger:'#ff7f9f',speaker:'#89aaff',
    choir:'#ffad8d',popup:'#f4d280',firewall:'#ff6859',camerabot:'#a5ffe9'};
  const body=e.hit>0?'#fff7de':paint[e.kind],r=e.r,step=Math.sin(e.walk)*3;
  if(e.wind>0){
    c.save();c.globalAlpha=.72;c.setLineDash([7,7]);
    line(c,[e.x,e.y,e.x+Math.cos(e.lunge)*173,e.y+Math.sin(e.lunge)*173],'#ff879f',2);c.restore();
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
    rect(c,-17+step,-12,11,7,'#ac745f',dark,2);rect(c,-17-step,6,11,7,'#ac745f',dark,2);
    disk(c,-1,0,13,body,dark,11);rect(c,0,-8,10,16,'#432a37',dark,3);
    for(const y of [-4,4])disk(c,5,y,2,bright);
  }else if(e.kind==='thrower'){
    poly(c,[-15,-11,7,-14,14,-6,14,8,6,15,-15,11],body,dark);
    rect(c,-11,-8,12,16,'#514052',dark,2);
    rect(c,3,-7,16,14,'#514052',dark,3);rect(c,13,-4,5,8,'#fff3b1',null,2);
  }else if(e.kind==='guard'){
    for(const y of [-16,10])rect(c,-18,y,29,8,'#765592',dark,3);
    poly(c,[-17,-15,9,-15,18,-8,18,8,9,15,-17,15,-22,0],body,dark);
    rect(c,4,-12,13,24,'#432555',dark,4);line(c,[13,-7,13,7],'#f6c8ff',3);
    rect(c,18,-19,6,38,'#8e68b9','#f6c8ff',3);
  }else if(e.kind==='skater'){
    poly(c,[-19,0,-11,-13,6,-7,16,0,6,7,-11,13],body,dark);
    line(c,[-13,-11,-20,-15],'#adffdc',2);line(c,[-13,11,-20,15],'#adffdc',2);
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
  if(e.hp<e.max&&e.hp>0){rect(c,e.x-e.r,e.y-e.r-8,e.r*2,3,'#191026');rect(c,e.x-e.r,e.y-e.r-8,e.r*2*e.hp/e.max,3,body);}
}
function drawBoss(e,c=cx,i=g.level,primeForm=g.primeForm){
  const ink='#140e22', s=stages[i], color=e.hit>0?'#fff7db':s.color, r=e.r;
  if(i===4&&primeForm){drawPrime(e,c);return;}
  if(i===5){drawPC(e,c);return;}
  disk(c,e.x,e.y+13,r*1.2,'#070714b5',null,r*.62);
  if(e.wind||e.charge>0)disk(c,e.x,e.y,r+9,null,'#ffc17a');
  if(e.primeVolley){
    const a=e.primeVolley.aim, range=43+(1-e.primeVolley.left/.27)*16;
    disk(c,e.x+Math.cos(a)*range,e.y+Math.sin(a)*range,6,'#ffcba3','#ffdabb');
  }
  if(e.solo){
    const progress=1-e.solo.left/e.solo.total;
    c.lineWidth=2;disk(c,e.x,e.y,r+8+18*progress,null,'#ffd2a7');
    const amp=e.solo.amp;
    if(amp){
      disk(c,amp.x,amp.y,20+progress*12,'#ff9c7b2d','#ffd2a7');
      caption(c,'♪',amp.x,amp.y,23,'#ffe5af');
    }
  }
  c.save();c.translate(e.x,e.y);c.lineWidth=3;
  if(i===0){
    c.rotate(e.aim);rect(c,-24,-37,32,74,'#4b2d73',ink,7);rect(c,-12,-40,36,18,color,ink,4);rect(c,-12,22,36,18,color,ink,4);
    rect(c,-21,-22,48,44,'#8e58b8',ink,7);rect(c,-11,-15,35,30,'#332044',ink,7);
    for(let y of [-8,8])rect(c,8,y-3,10,6,color,null,2);
    line(c,[-15,-28,-9,-28],ink,3);line(c,[-15,29,-9,29],ink,3);
    rect(c,-15,-7,9,14,'#ffc77a',ink,2);
  }else if(i===1){
    if(e.wind||e.charge>0)c.rotate(e.aim);
    else if(Math.cos(e.aim)<0)c.scale(-1,1);
    for(let x of [-28,27])for(let y of [-21,21])rect(c,x-9,y-6,18,12,'#231b26','#100c17',4);
    rect(c,-47,-21,95,42,color,ink,7);
    rect(c,-43,-15,72,30,'#e49139',ink,5);rect(c,-37,-13,54,26,'#fcc875',null,4);
    for(let x of [-35,-19,-3,13]){rect(c,x,-17,12,5,'#665279',null,2);rect(c,x,12,12,5,'#665279',null,2);}
    rect(c,29,-16,12,32,'#2c314c',ink,4);rect(c,33,-11,6,7,'#daff95',null,2);rect(c,33,4,6,7,'#daff95',null,2);
    caption(c,'BUSS',-10,0,12,'#2a1532');
  }else if(i===2){
    c.rotate(Math.sin(e.walk*.7)*.16);
    disk(c,0,1,30,'#913b85',ink);disk(c,0,-5,24,'#572b66',ink);
    rect(c,-18,-15,36,15,'#2c2045',ink,5);disk(c,-8,-7,3,'#ffdb95');disk(c,8,-7,3,'#ffdb95');
    line(c,[14,-29,24,-23,17,-13,15,6,6,20,-7,20,-14,10,-10,0],ink,12);
    line(c,[14,-29,24,-23,17,-13,15,6,6,20,-7,20,-14,10,-10,0],color,7);
    disk(c,-9,-1,10,'#ffd082',ink,5);for(let y of [-9,-2,5])disk(c,16,y,2,'#fff1ac');
  }else if(i===3){
    c.rotate(e.aim);
    rect(c,-28,-24,42,49,'#337e6f',ink,6);rect(c,-22,-17,35,34,'#132b2c',ink,3);
    for(let y of [-13,10])rect(c,-28,y,7,6,'#c3ffb3',null,1);
    poly(c,[9,-13,34,-22,38,-22,38,22,34,22,9,13],color,ink);
    rect(c,34,-18,9,36,'#2f493e',ink,3);disk(c,-9,-5,5,'#ff7e96',ink);
    line(c,[-18,-24,-8,-35,6,-35,10,-25],'#abe6d6',4);
  }else{
    c.rotate(e.aim);
    for(let sgn of [-1,1]){
      poly(c,[-28,sgn*13,-29,sgn*32,-15,sgn*43,9,sgn*40,23,sgn*24,12,sgn*14],'#4e6db1',ink);
      rect(c,-15,sgn*31-4,27,8,color,ink,3);
    }
    poly(c,[-32,-18,-13,-29,18,-26,34,-11,34,11,18,26,-13,29,-32,18],'#809cdb',ink);
    rect(c,-17,-19,35,38,'#25334f',ink,6);
    disk(c,4,0,12,color,ink);disk(c,4,0,6,'#e0f7ff',ink);
    rect(c,24,-9,13,18,'#f3abd4',ink,4);
    line(c,[-32,0,-42,0,-46,-7],'#a0d9ff',3);
  }
  c.restore();
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
  const c=canvas.getContext('2d'), boss=id.startsWith('boss');
  const sizes={runner:13,thrower:15,guard:21,skater:12,charger:17,speaker:16,primePod:15,prime:52,choir:16,popup:17,firewall:22,boss5:51,camerabot:17};
  const level=boss?Number(id.slice(4)):0;
  const sprite={kind:id,x:0,y:0,r:sizes[id]??36,aim:-.4,walk:0,hit:0,hp:1,max:1,variant:1,pods:[]};
  const scale=id==='boss5'?.52:boss?.69:id==='prime'?.43:1.17;
  c.translate(36,36);c.scale(scale,scale);
  if(boss)drawBoss(sprite,c,level,false);
  else if(id==='prime')drawPrime(sprite,c);
  else if(id==='primePod')drawPrimePod(sprite,c);
  else drawBot(sprite,c,0);
}
function drawBurst(){
  const c=cx, {x,y,a}=g.echoAt, fade=g.echo/burstTime;
  const range=burstRange*(.48+.52*(1-fade));
  c.save();c.translate(x,y);c.rotate(a);
  const spray=c.createRadialGradient(0,0,12,0,0,range);
  spray.addColorStop(0,'#efffbfbc');spray.addColorStop(.5,'#d0ff7788');spray.addColorStop(1,'#dbff6048');
  c.globalAlpha=fade*.84;
  c.beginPath();c.moveTo(0,0);c.arc(0,0,range,-burstAngle,burstAngle);c.closePath();
  c.fillStyle=spray;c.fill();
  c.strokeStyle='#edffab';c.lineWidth=3;c.stroke();
  for(let i=0;i<5;i++){
    const ray=(i-2)*burstAngle*.43;
    line(c,[Math.cos(ray)*20,Math.sin(ray)*20,Math.cos(ray)*range*.91,Math.sin(ray)*range*.91],'#f8ffd6',1.5);
  }
  c.restore();
}
function drawHazard(h){
  const c=cx,t=h.wait>0?1-h.wait/h.max:1;
  const edge=h.wait>0?'#ffb477':'#fff0c6', fill=h.wait>0?'rgba(255,90,134,'+(.15+t*.24)+')':'#ffd3a26c';
  c.save();c.lineWidth=2;
  if(h.type==='spot'){
    disk(c,h.x,h.y,h.r,fill,edge);disk(c,h.x,h.y,h.r*t,null,edge);
    line(c,[h.x-9,h.y,h.x+9,h.y],edge);line(c,[h.x,h.y-9,h.x,h.y+9],edge);
  }else{
    c.lineCap='butt';line(c,[h.a.x,h.a.y,h.b.x,h.b.y],fill,h.width);
    c.setLineDash(h.wait>0?[10,8]:[]);
    if(h.wait>0&&!reduced)c.lineDashOffset=-t*44;
    line(c,[h.a.x,h.a.y,h.b.x,h.b.y],edge,h.wait>0?2:8);c.setLineDash([]);
    const a=angle(h.a,h.b),dx=-Math.sin(a)*h.width*.5,dy=Math.cos(a)*h.width*.5;
    line(c,[h.a.x+dx,h.a.y+dy,h.b.x+dx,h.b.y+dy],edge,1);
    line(c,[h.a.x-dx,h.a.y-dy,h.b.x-dx,h.b.y-dy],edge,1);
  }
  c.restore();
}
function render(){
  if(g.mode==='title')return;
  const c=cx, p=g.p, theme=stages[g.level];
  if(!backdrop)backdrop=backdropFor(g.level);
  c.drawImage(backdrop,0,0);
  c.save();c.beginPath();c.rect(15,55,930,465);c.clip();
  if(!reduced&&g.shake>0)c.translate(rand(-g.shake,g.shake),rand(-g.shake,g.shake));
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
    for(let j=0;j<22;j++){
      const x=26+(j*137)%909,y=517-((g.clock*(20+j%4*7)+j*53)%459);
      disk(c,x+Math.sin(g.clock+j)*9,y,1+j%3*.55,j%3?'#ff934c79':'#ffd4729a');
    }
    if(g.safeZone){
      const {min,max,vertical}=g.safeZone;
      c.lineWidth=2;
      if(vertical)rect(c,min,56,max-min,462,'#b6fa791e','#bbfc7cbd');
      else rect(c,16,min,929,max-min,'#b6fa791e','#bbfc7cbd');
      caption(c,'SAFE LANE',vertical?(min+max)/2:480,vertical?100:(min+max)/2,14,'#d6ffad');
    }
  }
  for(const effect of g.perksFx){
    c.save();
    c.globalAlpha=effect.wait>0?.42:effect.life;
    c.lineWidth=2;c.setLineDash(effect.wait>0?[4,6]:[]);
    disk(c,effect.x,effect.y,effect.r,effect.color+'20',effect.color);
    c.restore();
  }
  for(const h of g.hazards)drawHazard(h);
  for(const o of g.items){c.save();c.globalAlpha=o.life<2?.55+Math.sin(o.life*15)*.34:1;c.translate(o.x,o.y+Math.sin(g.clock*7)*3);c.lineWidth=2;rect(c,-9,-10,18,20,'#85efb3','#161728',4);line(c,[-5,0,5,0],'#142c26',3);line(c,[0,-5,0,5],'#142c26',3);c.restore();}
  for(const b of g.pops){line(c,[b.x-Math.cos(b.a)*17,b.y-Math.sin(b.a)*17,b.x,b.y],b.color,4);disk(c,b.x,b.y,3.5,'#fcffd5',null);}
  const actors=[...g.enemies,p].sort((a,b)=>a.y-b.y);
  for(const e of actors){
    if(e===p){drawPlayer(p);continue;}
    if(e.spawn>0){
      const reveal=e.kind==='boss'?.76:.26;
      if(e.spawn<reveal){
        c.save();c.globalAlpha=clamp(1-e.spawn/reveal,.12,.86);
        if(e.kind==='boss')drawBoss(e);else drawBot(e);
        c.restore();
      }
      const radius=e.r+7+(reduced?0:Math.sin(e.spawn*11)*6);
      c.lineWidth=2;c.setLineDash([4,5]);disk(c,e.x,e.y,radius,'#e9aaff26','#e9aaff');
      c.setLineDash([]);
      if(e.spawn>=reveal*.63)caption(c,'!',e.x,e.y,20,'#ffe4ff');
      continue;
    }
    if(e.kind==='boss')drawBoss(e);
    else if(e.kind==='primePod')drawPrimePod(e);
    else drawBot(e);
  }
  for(const b of g.enemyPops){
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
  for(const f of g.fx){c.save();c.globalAlpha=clamp(f.life/f.max*1.6,0,1);c.translate(f.x,f.y);c.rotate(f.a);if(f.shape)rect(c,-f.s,-f.s*.42,f.s*2,f.s*.85,f.color);else disk(c,0,0,f.s*.52,f.color);c.restore();}
  if(g.echo>0)drawBurst();
  if(g.mode==='play'&&!matchMedia('(pointer:coarse)').matches&&input.y>65&&input.y<505){
    const x=input.x,y=input.y;c.lineWidth=1.5;disk(c,x,y,8,null,'#eeffbab0');
    line(c,[x-12,y,x-4,y],'#eeffba');line(c,[x+4,y,x+12,y],'#eeffba');
    line(c,[x,y-12,x,y-4],'#eeffba');line(c,[x,y+4,x,y+12],'#eeffba');
  }
  for(const f of g.floaters){c.save();c.globalAlpha=clamp(f.life*3.3,0,1);caption(c,f.label,f.x+1,f.y+2,16,'#160e21');caption(c,f.label,f.x,f.y,16,f.color);c.restore();}
  if(g.flash>0&&!reduced)rect(c,15,55,930,465,'rgba(255,76,120,'+g.flash*.72+')');
  c.restore();
  if(g.gap!==null&&!isBossWave()&&g.mode==='play')caption(c,'✓  WAVE CLEAR',480,251,23,theme.color);
}
