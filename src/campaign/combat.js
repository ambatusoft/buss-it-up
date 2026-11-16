const shotPatterns={
  single:[[0,1,0]],scatter:[[0,1,0],[-.19,1,0],[.19,1,0]],twin:[[0,1,-8],[0,1,8]],
  compass:Array.from({length:8},(_,index)=>[index*Math.PI/4,1,0]),
  backbeat:[[0,.80,0],[Math.PI,1.80,0]],
  cluster:[[-.44,.32,0],[-.22,.44,0],[0,.63,0],[.22,.44,0],[.44,.32,0]],
  fan:[-.36,-.216,-.072,.072,.216,.36].map(offset=>[offset,.68,0])
};
const burstTime=.46;
const poisonTick=.2;
const bossBurstScale=174/86;
const starBurstPoints=Array.from({length:12},(_,i)=>{
  const angle=i*Math.PI/6-Math.PI/2, radius=i%2?1/Math.sqrt(3):1;
  return {x:Math.cos(angle)*radius,y:Math.sin(angle)*radius};
});
const burstShapes={
  cone:{range:330,angle:Math.PI*.275,color:'#a4fae7'},
  star:{range:760,color:'#a8e9ff'},
  halo:{range:145,color:'#b8a7ff'},
  ring:{range:178,color:'#b8a7ff'},
  beam:{range:535,width:48,color:'#8ddfff'},
  remote:{range:138,offset:230,color:'#b1bcff'},
  crossbeam:{range:395,width:42,color:'#a2c8ff'},
  widebeam:{range:250,width:96,color:'#c6adff'}
};

function healPlayer(amount,refill=false){
  const p=g.p;
  p.hp=Math.min(p.max,p.hp+Math.round(amount*(refill?p.refillHealing:1)));
}

function playerPop(origin,a,d,pierce,color='#eaffb6',offset=26,side=0,useGear=false,effect=null){
  const p=g.p;
  g.stats.shots++;
  g.pops.push({x:origin.x+Math.cos(a)*offset-Math.sin(a)*side,y:origin.y+Math.sin(a)*offset+Math.cos(a)*side,
    a,s:p.popSpeed,d:d*(effect?.scale??1),r:5,life:useGear?p.shotLife+(effect?.extraLife??0):1.28,pierce:pierce+(effect?.pierce??0),hits:new Set(),color,
    homing:effect?.homing??0,bounces:effect?.bounces??0,effect});
}

function fire(){
  const p=g.p;
  if(p.fireCd>0)return;
  p.fireCd=p.rate;p.recoil=1;
  const volley=++g.volley;
  const empowered=p.pattern==='overdrive'&&volley%4===0;
  const pattern=empowered?shotPatterns.fan:shotPatterns[p.pattern]??shotPatterns.single;
  const aim=p.pattern==='compass'?p.aim:p.aim+rand(-.022,.022);
  const power=p.dmg*stageAmp[combatAreaIndex()]*(1+(p.quickDrawWindow>0?p.quickDraw:0)+p.streakPower*Math.min(5,g.comboT>0?g.combo:0));
  p.quickDrawWindow=0;
  const effect=p.nut&&(!p.nut.interval||volley%p.nut.interval===0)?p.nut:null;
  const color=effect?.color??(empowered?'#8fc1ff':'#eaffb6');
  for(const [offset,scale,side] of pattern)playerPop(p,aim+offset,power*scale,p.pierce,color,26,side,true,effect);
  particle(p.x+Math.cos(p.aim)*29,p.y+Math.sin(p.aim)*29,color,3,49,1);sound.event('fire');
}

function isElite(e){return e.kind==='boss'||e.kind==='primePod';}
function slowEnemy(e,duration,power){
  const elite=isElite(e);
  e.slow=Math.max(e.slow??0,duration*(elite?.25:1));
  e.slowPower=power*(elite?.5:1);
}

function stunEnemy(e,duration){
  e.stun=Math.max(e.stun??0,duration*(isElite(e)?.25:1));
  e.stunLock=e.stun+.67;
}

function applyNutEffect(e,shot){
  const effect=shot.effect;
  if(!effect)return;
  if(!e.dead){
    if(effect.slow)slowEnemy(e,effect.slow,effect.slowPower??.36);
    if(effect.stun&&!(e.stunLock>0)){
      stunEnemy(e,effect.stun);
    }
    if(effect.poison){
      const dps=g.p.dmg*stageAmp[combatAreaIndex()]*effect.poisonDps;
      e.poison={duration:effect.poison,potency:dps*poisonTick,step:e.poison?.step??poisonTick};
    }
  }
  if(effect.splash){
    const radius=effect.radius??53;
    for(const other of g.enemies)if(other!==e&&dist(other,e)<radius+other.r)damage(other,shot.d*effect.splash,'nut');
    g.nutPulses.push({x:e.x,y:e.y,life:.22,max:.22,r:radius});
    particle(e.x,e.y,effect.color,7,115,1);
  }
}

function conditionStep(e,dt){
  if(e.poison){
    const poison=e.poison;
    poison.step-=Math.min(dt,poison.duration);poison.duration-=dt;
    if(poison.step<=1e-8){
      damage(e,poison.potency,'nut');poison.step+=poisonTick;
      particle(e.x,e.y,'#89ebcc',3,53);
    }
    if(poison.duration<=1e-8)e.poison=null;
  }
  e.slow=Math.max(0,(e.slow??0)-dt);
  e.stun=Math.max(0,(e.stun??0)-dt);
  e.stunLock=Math.max(0,(e.stunLock??0)-dt);
  const slow=e.slow>0?e.slowPower:0;
  const stun=e.stun>0?(isElite(e)?.70:1):0;
  return dt*(1-Math.max(slow,stun));
}

function updatePlayerPops(dt){
  for(const b of g.pops){
    if(b.homing){
      let target,nearest=245*245;
      for(const bot of g.enemies){
        if(bot.dead||bot.spawn>0||b.hits.has(bot))continue;
        const distance=(bot.x-b.x)**2+(bot.y-b.y)**2;
        if(distance<nearest){nearest=distance;target=bot;}
      }
      if(target){const diff=angle(b,target)-b.a;b.a+=clamp(Math.atan2(Math.sin(diff),Math.cos(diff)),-dt*b.homing,dt*b.homing);}
    }
    const prev={x:b.x,y:b.y};
    b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;b.life-=dt;
    if(b.life<=0)continue;
    if(b.bounces&&(b.x<15||b.x>945||b.y<55||b.y>518)){
      if(b.x<15||b.x>945){b.a=Math.PI-b.a;b.x=clamp(b.x,15,945);}
      if(b.y<55||b.y>518){b.a=-b.a;b.y=clamp(b.y,55,518);}
      b.bounces--;
      b.d*=b.effect?.bankScale??1;
      particle(b.x,b.y,b.color,4,65);
    }
    const hits=g.enemies.filter(e=>!e.dead&&e.spawn<=0&&!b.hits.has(e)&&lineDist(e.x,e.y,prev,b)<e.r+b.r)
      .sort((a,e)=>dist(a,prev)-dist(e,prev));
    for(const e of hits){
      if(e.dead)continue;
      const skillBonus=!isElite(e)?(e.hp>=e.max?g.p.opener:e.hp/e.max<.30?g.p.finisher:0):0;
      if(damage(e,b.d*(1+skillBonus))){
        if(!b.scored){b.scored=true;g.stats.hits++;}
        if(e.kind==='boss'){
          g.p.charge=Math.min(100,g.p.charge+.5+g.p.bossCharge);
          if(g.p.bossVibe){
            g.p.bossHits=(g.p.bossHits??0)+1;
            if(g.p.bossHits%10===0)healPlayer(g.p.bossVibe);
          }
        }
        applyNutEffect(e,b);
      }
      b.hits.add(e);particle(b.x,b.y,b.color,3,73);
      if(b.pierce--<=0){b.life=0;break;}
    }
  }
  g.pops=g.pops.filter(b=>b.life>0&&b.x>0&&b.x<W&&b.y>44&&b.y<H);
}

function inBurst(origin,target){
  const x=target.x-origin.x,y=target.y-origin.y;
  const radius=target.r??0;
  if(origin.shape==='star'){
    const px=x/origin.range,py=y/origin.range;
    let inside=false;
    for(let i=0,j=starBurstPoints.length-1;i<starBurstPoints.length;j=i++){
      const a=starBurstPoints[j],b=starBurstPoints[i];
      if(lineDist(px,py,a,b)<=radius/origin.range)return true;
      if((a.y>py)!==(b.y>py)&&px<a.x+(b.x-a.x)*(py-a.y)/(b.y-a.y))inside=!inside;
    }
    return inside;
  }
  const forward=x*Math.cos(origin.a)+y*Math.sin(origin.a),side=Math.abs(y*Math.cos(origin.a)-x*Math.sin(origin.a));
  if(origin.shape==='ring'||origin.shape==='halo')return Math.hypot(x,y)<=origin.range+radius;
  if(origin.width){
    const length=origin.shape==='crossbeam'?Math.abs(forward):forward;
    return length>=-radius&&length<=origin.range+radius&&side<=origin.width+radius;
  }
  if(origin.shape==='remote')return Math.hypot(forward-origin.offset,side)<=origin.range+radius;
  return forward>0&&Math.hypot(x,y)<=origin.range+radius&&side<=forward*Math.tan(origin.angle)+radius;
}

function hitBurst(e,power){
  const hit=damage(e,(e.kind==='boss'?bossBurstScale:1)*power,'burst');
  if(hit&&!e.dead&&g.p.coldBurst){
    stunEnemy(e,g.p.coldBurst);
    g.coldFlash=.75;
  }
}

function buzz(){
  const p=g.p;
  if(p.charge<100)return;
  const spec=burstShapes[p.burstShape];
  const origin={...spec,x:p.x,y:p.y,a:p.aim,shape:p.burstShape,range:spec.range*p.burstReach};
  p.charge=0;g.stats.bursts++;g.echo=burstTime;g.echoAt=origin;g.shake=7;
  if(p.burstHeal)healPlayer(p.burstHeal);
  const projectileCount=g.enemyPops.length;
  g.enemyPops=g.enemyPops.filter(b=>!inBurst(origin,b));
  const erased=projectileCount-g.enemyPops.length;
  if(p.burstRefund&&erased>=7)p.charge+=p.burstRefund;
  const push=p.burstPush;
  if(push)p.inv=Math.max(p.inv,p.burstPush);
  const offset=spec.offset??0;
  particle(p.x+Math.cos(p.aim)*offset,p.y+Math.sin(p.aim)*offset,spec.color,46,360,1,p.aim,spec.angle?spec.angle*2:TAU);
  sound.event('burst');
  const power=stageAmp[combatAreaIndex()]*p.burstDamage;
  for(const e of g.enemies){
    if(inBurst(origin,e))hitBurst(e,power);
    if(push&&!e.dead&&!isElite(e)&&dist(e,p)<275){
      const a=angle(p,e);
      move(e,Math.cos(a)*96,Math.sin(a)*96);
      stunEnemy(e,.55);
    }
  }
  if(p.aftershock){
    g.blasts.push({x:p.x,y:p.y,r:90,wait:1.5,life:.43,power:p.aftershock*power,color:'#b4abff',source:'burst'});
  }
  floater(p.x,p.y-26,'BUSS BURST!','#9ef4ee');
}
