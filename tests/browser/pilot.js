const observedEnemies=new WeakMap();
function steerPlaytest(t){
  const p=g.p;
  const active=g.enemies.filter(e=>!e.dead&&e.spawn<=0);
  const nearest=[...active].sort((a,b)=>dist(p,a)-dist(p,b));
  const boss=active.find(e=>e.kind==='boss');
  const target=nearest.find(e=>e.kind==='primePod')||(dist(p,nearest[0]??p)<105?nearest[0]:boss??nearest[0]);
  input.down=!!target;
  if(target){
    const last=observedEnemies.get(target);
    const lead=Math.min(.22,dist(p,target)/p.popSpeed*.72);
    const sample=last&&Math.max(1/90,t-last.t);
    input.x=target.x+(last?clamp((target.x-last.x)/sample,-290,290)*lead:0);
    input.y=target.y+(last?clamp((target.y-last.y)/sample,-290,290)*lead:0);
  }
  for(const enemy of active)observedEnemies.set(enemy,{x:enemy.x,y:enemy.y,t});
  if(p.charge>=100&&target&&dist(target,p)<310&&(active.length>=3||isBossWave()))input.buss=true;
  let dx=0,dy=0, best=-Infinity;
  for(let k=0;k<25;k++){
    const a=k*TAU/24, vx=k===24?0:Math.cos(a),vy=k===24?0:Math.sin(a), x=p.x+vx*58,y=p.y+vy*58;
    if(x<52||x>908||y<90||y>484)continue;
    const next={x,y};
    const nt=target?dist(next,target):200;
    let value=-(Math.abs(nt-(isBossWave()?266:196)))*.3-Math.hypot(x-480,y-285)*.035;
    value+=Math.cos(a-t*.7)*3;
    for(const e of nearest){
      const d=dist(e,next);
      if(d<130)value-=(130-d)*(d<62?1.8:1);
      if((e.kind==='charger'||e.kind==='stapler'||e.kind==='headlight')&&e.wind>0){
        const end={x:e.x+Math.cos(e.lunge)*180,y:e.y+Math.sin(e.lunge)*180};
        if(lineDist(x,y,e,end)<31)value-=85;
      }
    }
    for(const b of g.enemyPops){
      const a2={x:b.x,y:b.y},b2={x:b.x+Math.cos(b.a)*b.s*.37,y:b.y+Math.sin(b.a)*b.s*.37};
      const d=lineDist(x,y,a2,b2);if(d<42)value-=(42-d)*2.3;
    }
    for(const h of g.hazards){
      const weight=h.wait>.52?.56:1;
      if(h.type==='line'){const d=lineDist(x,y,h.a,h.b);if(d<h.width*.5+25)value-=150*weight;}
      else if(dist(h,next)<h.r+26)value-=145*weight;
    }
    if(g.safeZone){
      const point=g.safeZone.vertical?x:y;
      if(point<g.safeZone.min+15||point>g.safeZone.max-15)value-=420;
    }
    if(value>best){best=value;dx=vx;dy=vy;}
  }
  input.dx=dx;input.dy=dy;
  if((dx||dy)&&readyDashes(p)>0&&(best<-51||target&&dist(target,p)<49))input.dash=true;
}
