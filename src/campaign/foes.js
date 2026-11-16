const approach=(e,a,d)=>[a,d>125?1:.35];
const flank=(e,a,d)=>[a+e.turn*(d>180?.66:1.62),1];
const retreat=(e,a,d)=>[d<185?a+Math.PI:a+e.turn*.9,d<285?1:.28];
const zigzag=(e,a)=>[a+Math.sin(e.walk*.79)*1.12,1];
const square=(e,a)=>[Math.round(a/(Math.PI/2))*Math.PI/2,1];
const compact=(e,a,d)=>[a,d>330?1:0];
const specialFoes={
  stapler:{name:'Spring Stapler',hp:43,speed:109,radius:15,contact:14,color:'#d9ff7e',mark:'⌁',pace:2.5,wind:.56,steer:approach,note:'Crouches, then springs along its dotted aim line.',sprite:[-17,-10,15,-9,19,1,8,11,-18,8],attack(e,a){e.rush={aim:a,left:.31,speed:395};}},
  timecard:{name:'Punch Clock',hp:60,speed:64,radius:20,contact:15,color:'#efa8fa',mark:'◷',pace:3.3,wind:.60,steer:compact,note:'Plants its feet and stamps a delayed mark at the player’s position.',sprite:[-19,-18,13,-18,19,-9,17,18,-19,18],attack(e,_a,p){spot(p.x,p.y,49,.72,15,e);}},
  headlight:{name:'High Beam Hopper',hp:36,speed:155,radius:12,contact:12,color:'#fff0a4',mark:'◀',pace:2.9,wind:.48,steer:square,note:'Follows grid lines, then races down a lane in a single direction.',sprite:[-13,-10,8,-10,16,0,8,10,-13,10,-8,0],attack(e,a){e.rush={aim:a,left:.37,speed:465};}},
  inspector:{name:'Last-Fare Inspector',hp:54,speed:85,radius:17,contact:13,color:'#ff9c68',mark:'▤',pace:3.25,wind:.47,steer:retreat,note:'Backs away and throws tickets that curve across its firing lane.',sprite:[-18,-9,-5,-16,17,-13,12,0,17,13,-5,16,-18,9],attack(e,a){for(const sign of [-1,1])shot(e.x,e.y,a+sign*.38,191,13,'ticket',-sign*1.10);}},
  tuningfork:{name:'Tuning Fork',hp:38,speed:139,radius:13,contact:11,color:'#ffd2fa',mark:'♬',pace:2.55,wind:.37,steer:flank,note:'Orbits its target and scatters a triplet sideways across the beat.',sprite:[-12,-6,1,-6,1,-13,15,-13,15,-6,5,-3,5,3,15,6,15,13,1,13,1,6,-12,6],attack(e,a){for(const turn of [-1,1])fan(e,a+turn*.66,3,.17,176,'note',11);}},
  feedback:{name:'Feedback Drum',hp:66,speed:55,radius:21,contact:15,color:'#a386ff',mark:'◎',pace:3.65,wind:.70,steer:compact,note:'Bangs out a twelve-note ring. Its last beat comes from a different angle.',sprite:[-17,-11,-8,-21,11,-21,20,-10,20,12,10,21,-10,21,-18,11],attack(e,a){ring(e,12,a+.2,154,'note',12);shot(e.x,e.y,a,235,13,'note');}},
  clapper:{name:'Clapper Cut',hp:41,speed:130,radius:14,contact:12,color:'#7bf8dd',mark:'✂',pace:2.70,wind:.38,steer:zigzag,note:'Zigzags between takes and fires a cross from its current heading.',sprite:[-16,-10,14,-10,17,10,-14,10,-12,0],attack(e,a){ring(e,4,a+.46,224,'orb',12);}},
  lighting:{name:'Followspot Rig',hp:62,speed:78,radius:20,contact:13,color:'#fff6a7',mark:'☀',pace:3.45,wind:.60,steer:square,note:'Moves along the lighting rails. Its paired pools close on your previous position.',sprite:[-20,-12,-10,-19,8,-19,17,-8,21,8,10,18,-9,18,-20,9],attack(e,a,p){for(const sign of [-1,1])spot(clamp(p.x+Math.cos(a+Math.PI/2)*sign*57,82,878),clamp(p.y+Math.sin(a+Math.PI/2)*sign*57,106,470),50,.68+sign*.13,16,e);}},
  induction:{name:'Induction Coil',hp:70,speed:62,radius:22,contact:16,color:'#b0c9ff',mark:'ϟ',pace:3.6,wind:.63,steer:compact,note:'A heavy coil with twin beams. Step through the center opening or behind it.',sprite:[-22,-14,-8,-21,15,-21,22,-12,22,12,15,21,-8,21,-22,14],attack(e,a){for(const off of [-.32,.32])aimBeam(e,a+off,26,.69,17,e);}},
  cutter:{name:'Assembly Cutter',hp:46,speed:146,radius:14,contact:13,color:'#ff91aa',mark:'◬',pace:2.65,wind:.42,steer:flank,note:'Hunts in arcs and throws plasma blades that curve away from each other.',sprite:[-16,-3,-7,-16,13,-13,18,0,13,13,-7,16],attack(e,a){for(const turn of [-1,1])shot(e.x,e.y,a+turn*.12,232,14,'plasma',turn*.82);}},
  ash:{name:'Ash Wisp',hp:36,speed:174,radius:11,contact:12,color:'#ffb35b',mark:'✧',pace:2.55,wind:.41,steer:zigzag,note:'A fast, erratic ember that hurls slow fire in four diagonal directions.',sprite:[-12,0,-2,-14,3,-7,14,-6,10,0,14,6,3,7,-2,14],attack(e,a){ring(e,4,a+.57,167,'ember',14);}},
  ghost:{name:'Reboot Ghost',hp:62,speed:89,radius:18,contact:14,color:'#f38fdb',mark:'↻',pace:3.55,wind:.51,steer:retreat,note:'Marks a reboot location, then jumps there and launches a fan of embers.',sprite:[-17,-14,7,-17,16,-7,16,14,8,9,0,16,-8,10,-17,13],attack(e,a,p){
    const x=clamp(p.x+Math.cos(a+.9)*150,87,873),y=clamp(p.y+Math.sin(a+.9)*150,116,459);
    spot(x,y,39,.79,0,e,()=>{e.x=x;e.y=y;fan(e,angle(e,g.p),5,.29,178,'ember',13);});
  }}
};

function specialistUpdate(e,dt,spec){
  const p=g.p,a=angle(e,p),d=dist(e,p);
  e.walk+=dt*9;
  e.cd-=dt;
  if(e.rush?.left>0){
    e.rush.left-=dt;
    move(e,Math.cos(e.rush.aim)*dt*e.rush.speed,Math.sin(e.rush.aim)*dt*e.rush.speed);
  }else if(e.wind>0){
    e.wind-=dt;
    if(e.wind<=0)spec.attack(e,e.lunge,p);
  }else{
    const [heading,speed]=spec.steer(e,a,d);
    e.aim=heading;
    const speedScale=speed*e.speed*dt;
    move(e,Math.cos(heading)*speedScale,Math.sin(heading)*speedScale);
    if(e.cd<=0&&d<390){
      e.aim=e.lunge=e.kind==='headlight'?Math.round(a/(Math.PI/2))*Math.PI/2:a;
      e.wind=spec.wind;e.cd=spec.pace+spec.wind;
    }
  }
  if(dist(e,p)<e.r+p.r)hurt(spec.contact);
}

function drawSpecialist(c,e,spec){
  c.save();
  if(e.wind>0){
    c.setLineDash([4,6]);line(c,[e.x,e.y,e.x+Math.cos(e.lunge)*125,e.y+Math.sin(e.lunge)*125],'#ff9661',2);c.setLineDash([]);
    disk(c,e.x,e.y,e.r+4,null,'#ff9661');
  }
  disk(c,e.x,e.y+8,e.r+3,'#0806149c',null,e.r*.62);
  c.translate(e.x,e.y);c.rotate(e.aim);c.lineWidth=2;
  poly(c,spec.sprite,e.hit>0?'#fff4e4':spec.color,'#21132c');
  line(c,[-e.r*.69,-e.r*.33,-e.r*.69,e.r*.33],'#281a39',3);
  c.rotate(-e.aim);
  caption(c,spec.mark,1,0,e.r*.99,'#251530');
  c.restore();
}
