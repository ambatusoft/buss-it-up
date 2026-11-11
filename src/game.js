'use strict';
const W=960,H=544, TAU=Math.PI*2, bounds={l:32,r:928,t:69,b:505};
const $=id=>document.getElementById(id), clamp=(n,a,b)=>Math.max(a,Math.min(b,n)), lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x);
const pad=(n,len=2)=>String(n).padStart(len,'0'), rand=(a,b)=>a+Math.random()*(b-a);
const canvas=$('arena'), cx=canvas.getContext('2d'), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const stages=[
  {name:'After Hours Gym',tag:'GYM',boss:'The Lunk-Bot',color:'#ddff64',floor:'#232039',tile:'#272440',line:'#3b3453',bossHP:470,bpm:113,base:43,icon:'M5 12v8m3-11v14m16-14v14m3-11v8M8 16h16',theme:'The tour opens in a fictional gym staffed by overzealous exercise bots. Their night manager is basically a dumbbell with opinions.',quote:'ONE MORE REP!',tip:'Dash sideways when the Lunk-Bot lines up a charge.'},
  {name:'Buss Terminal',tag:'BUS',boss:'The Dreamybus',color:'#ffbf66',floor:'#252425',tile:'#2a292b',line:'#443b32',bossHP:635,bpm:125,base:41,icon:'M6 21V9q0-4 4-4h12q4 0 4 4v12H6zm0-7h20M9 21v5m14-5v5M10 18h2m8 0h2',theme:'The “Bus, Bus, Bus” audio became a literal bus edit. Here, the bus gets its own terminal, timetable and extremely bad attitude.',url:'https://knowyourmeme.com/sensitive/memes/dreamybull-bus-bus-bus-im-bussing',quote:'THIS STOP: BUSSINESS.',tip:'The bus announces its lane before each pass. Step out and pop it as it drives by.'},
  {name:'Ambatublow Club',tag:'SAX',boss:'Sax Max',color:'#ff7bc4',floor:'#2d162e',tile:'#321a36',line:'#552952',bossHP:750,bpm:133,base:46,icon:'M22 4h5m-6 1-3 15c-1 8-13 7-13 0v-5h5v4q0 3 3 3t4-4l3-12zM14 11l5 1m-6 3 5 1',theme:'The saxophone meme becomes a late-night club. Sax Max turns solos into rings of flying notes.',url:'https://knowyourmeme.com/sensitive/videos/384184-dreamybull',quote:'GIVE THE SAX SOME SPACE.',tip:'Keep your distance and thread the gaps between notes.'},
  {name:'Omaygot Studio',tag:'REC',boss:'The Omaygot Director',color:'#79f4cf',floor:'#122b29',tile:'#16312e',line:'#28504a',bossHP:850,icon:'M4 9h17v14H4zM21 14l7-4v12l-7-4M8 5h7',theme:'Ambatukam Omaygot grew out of recaptioned clips and fan edits. This green-screen studio is a parody of the remix factory.',url:'https://knowyourmeme.com/sensitive/memes/ambatukam',quote:'AND… CUT!',tip:'Move out of the marked camera spots and clear the stunt doubles.'},
  {name:'Ambatron Core',tag:'BOT',boss:'Ambatron Prime',color:'#8fbcff',floor:'#131f36',tile:'#182741',line:'#2a4169',bossHP:1350,icon:'M6 10h20v15H6zM16 10V5m-3 0h6M10 15h3m6 0h3m-10 5h8M3 14v7m26-7v7',theme:'The Ambatron / Dreamybot cyborg meme supplied the core’s original boss.',url:'https://knowyourmeme.com/memes/ambatron',quote:'SYSTEM ERROR: TOO DREAMY.',tip:'Watch for the beam markers. Save a Buss Burst to clear the spiral.'},
  {name:'The Burnt Server',tag:'666',boss:'Satan’s PC',color:'#ff7663',floor:'#1c1018',tile:'#29141d',line:'#5f2730',bossHP:2440,icon:'M5 10h22v14H5zm5-7 4 7m8-7-4 7M11 16h2m6 0h2m-8 4h6',theme:'A bootleg choir caption and the fan jokes about Wordington gaining sentience become an original underworld full of cursed computers.',quote:'FATAL ERROR. GOOD RIDDANCE.',tip:'Get into the green safe lane. The chassis shrugs off shots until the screen glows OVERHEAT.'}
];
const publicStageCount=5;
const waveCounts=[3,3,4,4,4,4], bossHealthScale=6.8;
const enemyHealthScale=[1.16,1.69,3.38,4.26,5.12,6.3];
const stageAmp=[1,1.23,1.55,1.94,2.40,3.05];
const deploymentCaps=[9,10,10,11,11,12], deploymentSpacing=.16;
const deploymentCap=(level,mode)=>deploymentCaps[level]-(mode==='chill'?2:0);
const isBossWave=()=>g.wave===waveCounts[g.level]+1;
const waveTitles=[
  ['Ambatu Company Interview','Ambadonut Break','Wordington Anger'],
  ['Thank Your Driver','Move Over!','Bus Edit Part 2'],
  ['I’m at the Club','Ambasing Choir','Paza Soundcheck','Thesis Night'],
  ['Sleepy Dreamy','Candid Talk Pt. 3','Evil Dreamy','The 30-Buck Cameo'],
  ['Dreamybot Boot','Base Form','Terminator Red Circle','Mount Wordington'],
  ['Going to Hell','Fever Dream','Wordington Gains Sentience','Fatal Encore']
];
const communityNotes=[
  ['Standin’ on Bussiness','A Reddit comment on a Dreamybull speech remix inspired Bussiness Blend and the Rep bots.','https://www.reddit.com/r/21stCenturyHumour/comments/16bqquz/'],
  ['Tentacle Transfer','The terminal’s tentacle motif comes from @absolutenutcase162’s Instagram comic about Squidward and Dreamybull driving a bus.','https://knowyourmeme.com/sensitive/photos/2570554-dreamybull-bus-bus-bus-im-bussing','https://www.instagram.com/p/Cq9GIFbtGnQ/'],
  ['Midnight Persona','The club’s set list nods to an original saxophone crossover posted to r/OkBuddyPersona.','https://www.reddit.com/r/OkBuddyPersona/comments/yau2vx/'],
  ['Thesis Night','The club and Ambatron’s Third Impact form take cues from the saxophone cover credited to Dreamy’s Instagram in the r/wordington repost.','https://www.reddit.com/r/wordington/comments/1eyadej/'],
  ['Dreamy Mood Board','A r/wordington reaction thread named Sleepy, Classy, and Evil Dreamy. Look for all three edits on the studio floor.','https://www.reddit.com/r/wordington/comments/1d19d9i/'],
  ['Amboutabass','A fishing photo thread turned a bass catch into Amboutabass and Ambatufish. Echo Cast comes from that pun.','https://www.reddit.com/r/wordington/comments/1d9l24t/'],
  ['Ambadonut','A stray Ambadonut reply to a reaction image became the gym’s snack break and a Vibe perk.','https://www.reddit.com/r/wordington/comments/166uut9/'],
  ['Base Form & the 30-Buck Cameo','A Cameo repost’s comments joked about Dreamy in base form and a thirty-dollar price. Both made it into the tour as fan jokes.','https://www.reddit.com/r/wordington/comments/1fcwfr6/'],
  ['Mount Wordington','A stream compilation’s comments supplied both the Wordington Anger wave and the core’s Mount Wordington name.','https://www.reddit.com/r/wordington/comments/1cpxoq3/'],
  ['Ambatuexplode','A fan comment on a Dreamybot image gave Prime’s overload wave its name.','https://www.reddit.com/r/wordington/comments/1d4esrl/'],
  ['Thank Your Driver','A bus-driver edit turned the thank-you speech into a transit joke. It inspired the terminal opener and its dash perk.','https://knowyourmeme.com/sensitive/memes/dreamybull-bus-bus-bus-im-bussing'],
  ['Ambasing Choir','The fan choir edit lent its name to the club’s second wave and the extra-shot perk.','https://siivagunner.fandom.com/wiki/Ambatukam'],
  ['Ambatu Company','The gym’s opening interview comes from a throwaway reply about practicing a smile for a job interview.','https://www.reddit.com/r/wordington/comments/144iilf/'],
  ['Bus Edit Part 2','The third terminal wave borrows its name from the follow-up to the literal school-bus transformation edit.','https://knowyourmeme.com/sensitive/videos/393707-dreamybull-bus-bus-bus-im-bussing'],
  ['Paza Soundcheck','The club gives a little-known Paza soundboard upload its own set.','https://www.myinstants.com/media/sounds/paza.mp3'],
  ['Candid Talk Pt. 3','The studio’s second round borrows the title of the livestream where Dreamy discussed the memes.','https://knowyourmeme.com/sensitive/memes/people/dreamybull'],
  ['Terminator Red Circle','The core nods to @ninopacee’s TikTok comparison and @neetchaneru’s Instagram repost of the early Ambatron image.','https://knowyourmeme.com/memes/ambatron','https://www.instagram.com/neetchaneru/p/C3u7M0jRYO2/'],
  ['Move Over!','A driving caption by @tacticalindex surfaced under #dreamybull and named the terminal’s second wave.','https://urlebird.com/video/makes-me-so-mad-like-move-over-7618649458452008205/'],
  ['I’m at the Club','A #masamba club caption by @tshoon2 gave the club its opening wave.','https://urlebird.com/video/im-at-the-club-7616927634383015188/'],
  ['Free Bird Request','The sax cover thread took a song request in the comments. It became the perk that pays extra charge for threading enemy fire.','https://www.reddit.com/r/wordington/comments/1eyadej/'],
  ['High Quality Rip','The fan choir made its way into a Super Bomberman title remix. The dash perk sends a shot back to the sender.','https://siivagunner.fandom.com/wiki/Title_-_Super_Bomberman'],
  ['Candid Camerabot','The third Candid Talk livestream gave the Studio’s new camera bot its name. It marks the player and one flank.','https://knowyourmeme.com/sensitive/memes/people/dreamybull'],
  ['Fever Dream','A Reddit reply called a surreal Dreamy edit a Wordington fever dream.','https://www.reddit.com/r/wordington/comments/15uf0e5/'],
  ['Wordington Gains Sentience','A reaction-image thread supplied the sentience joke.','https://www.reddit.com/r/wordington/comments/1ftqtmh/']
];
const enemyFiles={
  runner:{name:'Bussiness Rep',mark:'↗',color:'#ef9d66',note:'A night-shift regular. Runs straight at you and crowds the corners.'},
  thrower:{name:'Transfer Clerk',mark:'▰',color:'#ffd478',note:'Circles you at midrange and tosses tickets. Expect a wider volley in later arenas.'},
  guard:{name:'Classy Bouncer',mark:'⬢',color:'#ba80e8',note:'A slow, heavily padded bot with a very formal stance.'},
  skater:{name:'Ambatufish',mark:'◈',color:'#58d3c3',note:'Zigzags on fast skates like a fish on a line. Lead your shots.'},
  charger:{name:'Ambatuexplode',mark:'⚡',color:'#ff7f9f',note:'A pink dash line shows where this hothead is about to charge.'},
  speaker:{name:'Ambatusax Cabinet',mark:'♫',color:'#89aaff',note:'An amp on wheels. It drops rings of notes when it gets close.'},
  primePod:{name:'Base Form Pod',mark:'◇',color:'#ff9cd9',note:'Orbits the Third Impact chassis. Shoot both pods to break its shield.'},
  prime:{name:'Ambatron // Third Impact',mark:'✸',color:'#ff9cd9',note:'Destroy both pods to clear the projectiles, restore Vibe, and expose the core.'},
  choir:{name:'Angelic Kam Choir',mark:'♫',color:'#ffad8d',note:'A flying trio on one chassis. It swerves at you and sings a short fan of embers.'},
  popup:{name:'Sentient Pop-up',mark:'▣',color:'#f4d280',note:'Stops to paint a crosshair before it fires a long laser. Move off the line.'},
  firewall:{name:'Wordington Firewall',mark:'♜',color:'#ff6859',note:'An armored tower that tries to hem you in with slow ember rings.'},
  ...Object.fromEntries(stages.map((stage,i)=>['boss'+i,{name:stage.boss,mark:'◆',color:stage.color,note:stage.tip}])),
  camerabot:{name:'Candid Camerabot',mark:'▦',color:'#a5ffe9',note:'A floating camera that projects two bright marks before the stage lights hit. Attack while it lines up the shot.'}
};
const enemyIds=Object.keys(enemyFiles);
const enemyTypes={
  runner:{hp:32,speed:131,radius:13,contact:12},
  thrower:{hp:40,speed:90,radius:15,contact:12},
  guard:{hp:78,speed:70,radius:21,contact:19},
  skater:{hp:35,speed:157,radius:12,contact:12},
  charger:{hp:62,speed:104,radius:17,contact:12},
  speaker:{hp:48,speed:77,radius:16,contact:12},
  choir:{hp:43,speed:154,radius:16,contact:12},
  popup:{hp:51,speed:80,radius:17,contact:12},
  firewall:{hp:91,speed:68,radius:22,contact:24},
  camerabot:{hp:56,speed:82,radius:17,contact:12}
};
const bossRadii=[35,42,31,34,40,51];
const modes={
  arcade:{enemyHP:1,bossHP:1,damage:1,projectileSpeed:1,waveHeal:.17,bossHeal:.55,dropChance:.115},
  chill:{enemyHP:.72,bossHP:.76,damage:.53,projectileSpeed:.82,waveHeal:.28,bossHeal:.72,dropChance:.19}
};
function enemyStats(kind,level,mode){
  const entry=enemyTypes[kind];
  return {
    hp:Math.round(entry.hp*(1+level*.16)*enemyHealthScale[level]*modes[mode].enemyHP),
    speed:entry.speed+level*5,
    radius:entry.radius,
    contact:entry.contact
  };
}
const bossHP=(level,mode)=>Math.round(stages[level].bossHP*bossHealthScale*modes[mode].bossHP);
const perks=[
  {id:'power',tier:'Common',icon:'✸',name:'Bussiness Blend',desc:'+13% pop power',apply:p=>p.dmg*=1.13},
  {id:'rate',tier:'Common',icon:'»',name:'Triple Buss Ticket',desc:'+11% fire rate',apply:p=>p.rate/=1.11},
  {id:'speed',tier:'Common',icon:'↟',name:'Ambatufish Sliders',desc:'+8% move speed',max:4,apply:p=>p.speed*=1.08},
  {id:'tank',tier:'Common',icon:'✚',name:'Ambadonut',desc:'+16 max Vibe and refill',apply:p=>{p.max+=16;p.hp=p.max;}},
  {id:'clip',tier:'Rare',icon:'✹',name:'Classy Dreamy Edit',desc:'+23% pop power',apply:p=>p.dmg*=1.23},
  {id:'sax',tier:'Rare',icon:'♫',name:'Ambatusax Solo',desc:'+20% fire rate',apply:p=>p.rate/=1.20},
  {id:'spread',tier:'Rare',icon:'⋰',name:'Ambasing Choir',desc:'Two extra side pops at 34% power',max:2,apply:p=>p.spread++},
  {id:'dash',tier:'Rare',icon:'ϟ',name:'Tentacle Transfer',desc:'22% shorter dash cooldown',max:3,apply:p=>p.dashMax*=.78},
  {id:'pierce',tier:'Rare',icon:'➤',name:'Base Form Firmware',desc:'Pierce one extra bot and gain 9% power',max:2,apply:p=>{p.pierce++;p.dmg*=1.09;}},
  {id:'burst',tier:'Rare',icon:'◎',name:'Thesis Night Reverb',desc:'Buss Burst hits 28% harder and charges faster',apply:p=>p.burst++},
  {id:'echoCast',tier:'Bussted',icon:'↝',name:'Amboutabass Echo Cast',desc:'Popped bots fire an echo bolt. Extra copies boost bolt damage.'},
  {id:'seatbelt',tier:'Bussted',icon:'↯',name:'Thank Your Driver',desc:'Dash drops a transfer ticket that pops nearby bots.',max:1},
  {id:'thesis',tier:'Bussted',icon:'✺',name:'Thesis Night Finale',desc:'Periodically launches a piercing fan. Extra copies make it more frequent.'},
  {id:'cameo',tier:'Bussted',icon:'◩',name:'30-Buck Cameo',desc:'Once per stage, survive a wipeout and recover 42% Vibe.',max:1},
  {id:'aftershock',tier:'Bussted',icon:'◉',name:'Ambatuexplode Encore',desc:'Buss Burst leaves a second blast. Extra copies boost its power.'},
  {id:'candidCut',tier:'Common',icon:'▤',name:'Candid Cut',desc:'Pops travel 16% faster and hit 6% harder.',max:4,apply:p=>{p.popSpeed*=1.16;p.dmg*=1.06;}},
  {id:'freeBird',tier:'Rare',icon:'♪',name:'Free Bird Request',desc:'+3 charge per shot dodged with a dash. Up to 3 dodges per dash.',max:3},
  {id:'highQualityRip',tier:'Bussted',icon:'⤴',name:'High Quality Rip',desc:'Each of the first 3 shots dodged per dash fires a piercing pop toward your aim.',max:1}
];
const fileNumber=(type,id)=>type==='enemy'?'E-'+pad(enemyIds.indexOf(id)+1):'U-'+pad(perks.findIndex(perk=>perk.id===id)+1);
const storage={
  read(key,fallback){try{return JSON.parse(localStorage.getItem('buss-v1-'+key))??fallback;}catch{return fallback;}},
  write(key,val){try{localStorage.setItem('buss-v1-'+key,JSON.stringify(val));}catch{}},
  erase(key){try{localStorage.removeItem('buss-v1-'+key);}catch{}}
};
const initial=()=>({x:480,y:390,r:15,hp:100,max:100,dmg:17,rate:.164,speed:265,dashMax:1.48,popSpeed:730,spread:0,pierce:0,burst:0,charge:48,encores:1,loadout:{}});
const motion=p=>Object.assign(p,{x:480,y:397,aim:-Math.PI/2,vx:0,vy:0,inv:.4,dashing:0,dashCd:0,dashBuffer:0,closeCalls:0,fireCd:0,recoil:0,walk:0});
const dashRules={speed:785,duration:.17,buffer:.14,closeCallCap:3,charge:5,score:25};
const practiceRules={power:[1,1.22,1.38,1.55,1.78,1.98],healthPerStage:10,ratePerStage:.055,charge:65};
const cleanWaveRules={points:240,pointsPerStage:80,charge:10};
const input={keys:new Set(),x:480,y:280,down:false,touchFire:false,dx:0,dy:0,dash:false,buss:false};
const empty=()=>({enemies:[],pops:[],hazards:[],enemyPops:[],fx:[],floaters:[],items:[],queue:[],perksFx:[]});
const freshStats=level=>({
  time:0, waves:waveCounts.slice(0,level).reduce((sum,n)=>sum+n,0), bosses:level,
  bots:0, streak:0, shots:0, hits:0, damage:0, dashes:0, closeCalls:0, cleanWaves:0, bursts:0, upgrades:0
});
let difficulty=storage.read('mode','arcade')==='chill'?'chill':'arcade';
let high=Number(storage.read('best',0))||0, checkpoint=storage.read('save',null);
const discovered=new Set(storage.read('enemy-files',[]));
const seenPerks=new Set(storage.read('perk-files',[]));
if(!checkpoint||!Number.isInteger(checkpoint.level)||!stages[checkpoint.level]||!checkpoint.p?.loadout)checkpoint=null;
let furthest=clamp(Math.max(Number(storage.read('furthest',0))||0,checkpoint?.level??0),0,stages.length-1);
for(const id of Object.keys(checkpoint?.p.loadout??{}))seenPerks.add(id);
const filesCount=()=>$('catalog-count').textContent=discovered.size+seenPerks.size;
function discover(id){
  if(discovered.has(id))return;
  discovered.add(id);
  storage.write('enemy-files',[...discovered]);
  filesCount();
  if(g.mode==='play')floater(g.p.x,g.p.y-35,'FILE FOUND','#a7e8ff');
}
function unlockStage(index){
  if(index<=furthest)return;
  furthest=index;
  storage.write('furthest',furthest);
}
let g={mode:'title',level:0,wave:1,score:0,p:motion(initial()),...empty()};
let backdrop=null, lorePause=false, musicTimer=0;
const voiceForms={
  uh:[590,1180,2540], ah:[730,1330,2550], oh:[430,820,2460], ee:[300,2250,3020], ay:[500,1850,2630], mm:[280,1020,2190]
};
const voiceCues={
  squad:[['b',.042],['uh',.13,107,93],['s',.10]],
  enemyAttack:[['t',.034],['ay',.09,124,105],['k',.026],['ee',.071,108,89],['t',.022]],
  down:[['oh',.081,151,88],['t',.026]],
  hurt:[['ah',.14,142,92]],
  fail:[['oh',.19,138,115],['mm',.044,111,110],['ay',.18,118,106],['k',.031],['ah',.23,119,68],['t',.042]],
  burst:[['b',.037],['uh',.103,124,105],['s',.058],['b',.035],['uh',.106,137,116],['s',.068],['b',.04],['uh',.25,152,85],['s',.16]],
  transform:[['ah',.22,89,62],['mm',.085,62,60],['b',.05],['ah',.16,78,55],['t',.038],['uh',.21,84,57],['b',.047],['oh',.40,103,48]],
  bossDown:[['oh',.15,154,121],['mm',.055,115,109],['ay',.15,125,103],['k',.034],['ah',.23,129,73]]
};
// Clip, start/end in source seconds, gain, rate, cooldown in real seconds, queue priority.
const recordedCues={
  stageIntro:['way',1.28,5.16,.48,1.02,1,1],
  squad:['ambatubus',.36,1.96,.30,1.12,7,0],
  enemyAttack:['take',0,1.26,.25,1.1,4.6,0],
  down:['yek',.63,1.88,.30,1.19,1.8,0],
  hurt:['like',4.84,6.37,.44,1.03,4.5,0],
  dash:['rtp',.16,.97,.28,1.19,6,0],
  burst:['buss',.16,2.36,.55,1,0,2],
  fail:['tap',.38,4.7,.49,1,0,3],
  bossIntro:['insane',0,1.74,.49,.97,3,2],
  transform:['blow',.11,1.92,.56,.94,0,3],
  bossDown:['dies',.78,3.68,.46,1.04,1,3],
  clear:['paza',0,1.23,.33,1.08,2.5,0],
  pick:['acting',.74,1.74,.38,1.05,1,0],
  jackpot:['choir',0,2.92,.45,1.05,1,1],
  reveal:['way',1.29,5.16,.52,.92,0,3],
  hellEntry:['choir',.04,3.56,.49,.93,0,2],
  overload:['insane',1.94,6.44,.48,.94,0,2],
  victory:['paza',1.31,3.04,.48,.98,0,3]
};
const voiceQueueSize=2, voiceQueueLifetime=8;
const musicVolume={tour:.17,castle:.14,boss:.11,climax:.11};
const sound={enabled:storage.read('audio',true)!==false,ac:null,bus:null,lastShot:0,lastVoice:{},clips:{},track:null,trackOffsets:{},voiceSource:null,voiceQueue:[],
  wake(){
    if(!this.enabled)return;
    try{
      if(!this.ac){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return;
        this.ac=new AC();this.bus=this.ac.createGain();this.bus.gain.value=.48;this.bus.connect(this.ac.destination);
        this.loadClips().then(()=>this.nextVoice());
      }
      if(this.ac.state==='suspended'||this.ac.state==='interrupted'){
        this.ac.resume().then(()=>this.nextVoice()).catch(()=>{});
      }
    }catch{}
  },
  async loadClips(){
    await Promise.all(Object.entries(bundledAudio).map(async ([id,base64])=>{
      try{
        const binary=atob(base64), bytes=new Uint8Array(binary.length);
        for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
        this.clips[id]=await this.ac.decodeAudioData(bytes.buffer);
      }catch{}
    }));
  },
  sample(cue){
    const [id,,,,,cooldown,priority]=cue;
    if(!this.enabled||!this.ac||!bundledAudio[id])return false;
    const now=this.ac.currentTime;
    if(now-(this.lastVoice[id]??-Infinity)<cooldown)return true;
    const ready=this.clips[id]&&this.ac.state==='running';
    if(ready&&!this.voiceSource){
      this.playVoice(cue);
    }else if(priority>0){
      const alreadyQueued=this.voiceQueue.some(item=>item.cue[0]===id);
      if(!alreadyQueued){
        this.voiceQueue.push({cue,queuedAt:now});
        if(this.voiceQueue.length>voiceQueueSize){
          const lowest=Math.min(...this.voiceQueue.map(item=>item.cue[6]));
          this.voiceQueue.splice(this.voiceQueue.findIndex(item=>item.cue[6]===lowest),1);
        }
      }
    }
    return true;
  },
  playVoice([id,start,end,volume,rate]){
    const buffer=this.clips[id], now=this.ac.currentTime;
    const duration=Math.min(end,buffer.duration)-start;
    if(duration<=0)return;
    const source=this.ac.createBufferSource(), gain=this.ac.createGain();
    source.buffer=buffer;source.playbackRate.value=rate;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(volume,now+.015);
    gain.gain.setTargetAtTime(0,now+Math.max(.025,duration/rate-.085),.024);
    source.connect(gain);gain.connect(this.bus);
    this.lastVoice[id]=now;this.voiceSource=source;
    this.setMusicGain();
    source.onended=()=>{
      if(this.voiceSource!==source)return;
      this.voiceSource=null;
      this.nextVoice();
      this.setMusicGain();
    };
    source.start(now,start,duration);
  },
  nextVoice(){
    if(!this.enabled||this.ac?.state!=='running'||this.voiceSource)return;
    while(this.voiceQueue.length){
      const {cue,queuedAt}=this.voiceQueue.shift();
      if(this.ac.currentTime-queuedAt<=voiceQueueLifetime&&this.clips[cue[0]]){
        this.playVoice(cue);
        return;
      }
    }
  },
  stopVoices(){
    this.voiceQueue.length=0;
    if(this.voiceSource){
      const source=this.voiceSource;
      this.voiceSource=null;source.stop();
    }
  },
  setMusicGain(){
    if(!this.track)return;
    const gain=this.track.gain.gain;
    const duck=this.voiceSource ? .53 : 1;
    gain.setTargetAtTime(musicVolume[this.track.id]*duck,this.ac.currentTime,.14);
  },
  playTrack(id){
    if(this.track?.id===id)return true;
    const buffer=this.clips[id];
    if(!buffer||!this.enabled||this.ac?.state!=='running')return false;
    this.stopTrack();
    const source=this.ac.createBufferSource(), gain=this.ac.createGain(), now=this.ac.currentTime;
    source.buffer=buffer;source.loop=true;source.connect(gain);gain.connect(this.bus);
    gain.gain.setValueAtTime(.001,now);
    const offset=(this.trackOffsets[id]??0)%buffer.duration;
    source.start(now,offset);
    this.track={id,source,gain,offset,startedAt:now,duration:buffer.duration};
    this.setMusicGain();
    return true;
  },
  stopTrack(){
    if(!this.track)return;
    const {gain,source,id,offset,startedAt,duration}=this.track, now=this.ac.currentTime;
    this.trackOffsets[id]=(offset+now-startedAt)%duration;
    gain.gain.setTargetAtTime(0,now,.04);source.stop(now+.17);
    this.track=null;
  },
  tone(hz,dur=.09,vol=.09,kind='triangle',end=hz,offset=0){if(!this.enabled||!this.ac||this.ac.state!=='running')return;
    const t=this.ac.currentTime+offset,o=this.ac.createOscillator(),v=this.ac.createGain();o.type=kind;o.frequency.setValueAtTime(hz,t);
    o.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+dur);v.gain.setValueAtTime(.0001,t);
    v.gain.exponentialRampToValueAtTime(vol,t+.008);v.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(v);v.connect(this.bus);o.start(t);o.stop(t+dur+.01);},
  voice(type,volume,spacing=0,pitch=1){
    if(!this.enabled||this.ac?.state!=='running')return;
    const ac=this.ac, now=ac.currentTime;
    if(now-(this.lastVoice[type]??-Infinity)<spacing)return;
    this.lastVoice[type]=now;
    if(!this.noise){
      const length=Math.ceil(ac.sampleRate*.25);
      this.noise=ac.createBuffer(1,length,ac.sampleRate);
      const samples=this.noise.getChannelData(0);
      for(let i=0;i<length;i++)samples[i]=Math.random()*2-1;
    }
    let t=now+.014;
    for(const [phoneme,length,start,end] of voiceCues[type]){
      const vowel=voiceForms[phoneme];
      const source=vowel?ac.createOscillator():ac.createBufferSource();
      const gain=ac.createGain();
      if(vowel){
        source.type='sawtooth';
        source.frequency.setValueAtTime(start*pitch,t);
        source.frequency.exponentialRampToValueAtTime(end*pitch,t+length);
      }else source.buffer=this.noise;
      const frequencies=vowel||[phoneme==='s'?3900:phoneme==='b'?380:2150];
      frequencies.forEach((hz,i)=>{
        const filter=ac.createBiquadFilter();
        filter.type='bandpass';filter.frequency.value=hz;filter.Q.value=vowel?6+i*2:1.4;
        const mix=ac.createGain();mix.gain.value=[1,.57,.32][i];
        source.connect(filter);filter.connect(mix);mix.connect(gain);
      });
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(volume*(vowel?1:.32),t+.012);
      gain.gain.exponentialRampToValueAtTime(.0001,t+length);
      gain.connect(this.bus);source.start(t);source.stop(t+length);
      t+=length*.88;
    }
  },
  event(type){const t=this.ac?.currentTime||0;if(type==='fire'){if(t-this.lastShot>.067){this.lastShot=t;this.tone(580,.076,.052,'square',200);}}
    if(type==='down')this.tone(210,.12,.11,'triangle',660);
    if(type==='hurt')this.tone(124,.21,.17,'sawtooth',47);
    if(type==='dash')this.tone(165,.15,.10,'sine',620);
    if(type==='warn')this.tone(350,.15,.08,'square',270);
    if(type==='burst'){this.tone(110,.42,.21,'sine',35);this.tone(310,.24,.12,'sawtooth',870);}
    if(type==='fail')this.tone(185,.7,.16,'triangle',42);
    if(type==='bossDown')this.tone(190,.63,.21,'sine',37);
    if(type==='transform'){
      [52,65,78,104].forEach((hz,i)=>this.tone(hz,.94,.13,'sawtooth',hz*.73,i*.14));
    }
    const vocal={
      squad:[.31,1.1,.84],enemyAttack:[.19,.64,1.2],down:[.24,.38,1.3],
      hurt:[.26,.7,1],fail:[.58,0,.94],burst:[.61,0,1],transform:[.65,0,.88],bossDown:[.48,0,1.13]
    }[type];
    const recording=recordedCues[type];
    const sampled=recording&&this.sample(recording);
    if(vocal&&!sampled)this.voice(type,...vocal);
    if(type==='clear')[392,494,587,784].forEach((f,i)=>this.tone(f,.19,.12,'triangle',f,i*.07));
    if(type==='pick')this.tone(680,.13,.10,'sine',1060);}
};
function music(dt){
  musicTimer-=dt;
  if(musicTimer>0)return;
  const track=isBossWave()?(g.primeForm||g.level===5?'climax':'boss'):g.level===5?'castle':'tour';
  sound.playTrack(track);
  musicTimer=.15;
}
function route(){
  const level=g.mode==='title'?(checkpoint?.level??0):g.level, done=g.mode==='win';
  const visibleCount=furthest>=publicStageCount?stages.length:publicStageCount;
  $('stage-count').textContent=g.practice&&g.mode!=='title'?'PRACTICE':pad(level+1)+' / '+pad(visibleCount);
  $('route-list').innerHTML=stages.slice(0,visibleCount).map((s,i)=>{
    const known=i<=furthest;
    const state=done||i<level?'done':i===level?'active':'';
    const icon=known?'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="'+s.icon+'"/></svg>':'?';
    return '<li class="'+(known?state:'locked')+'" style="--stage:'+(known?s.color:'#918ba8')+'"'+(state==='active'?' aria-current="step"':'')+
      '><div class="route-icon" aria-hidden="true">'+icon+'</div><div><small>STAGE '+pad(i+1)+'</small><b>'+(known?s.name:'???')+'</b></div><span class="route-tag">'+(state==='done'?'✓':state==='active'?'▶':known?s.tag:'—')+'</span></li>';
  }).join('');
  $('difficulty').textContent=(difficulty==='chill'?'CHILL':'ARCADE')+(g.mode==='title'?' ▾':'');
  $('difficulty').disabled=g.mode!=='title';
  $('practice').disabled=g.mode!=='title';
  $('reset-data').hidden=g.mode!=='title';
  $('best').textContent=pad(high,6);
}
function clearInput(){
  input.keys.clear();input.down=false;input.touchFire=false;
  input.dx=input.dy=0;input.dash=input.buss=false;g.p.dashBuffer=0;
  $('stick').firstElementChild.style.transform='';
}
function setMode(mode){
  g.mode=mode;
  document.body.dataset.mode=mode;
  $('title-screen').hidden=mode!=='title';$('hud').hidden=mode==='title';
  const modal=mode!=='play'&&mode!=='title';
  $('overlay').classList.toggle('is-open',modal);
  $('overlay').inert=!modal;
  $('touch').hidden=mode!=='play'||!matchMedia('(pointer:coarse)').matches;
  if(mode!=='play'){$('toast').hidden=true;clearInput();}
  if(mode!=='play')sound.stopTrack();
  route();
}
function panel(label,title,body,actions=[]){
  const el=$('overlay');el.innerHTML='<div class="modal-card"><small>'+label+'</small><h2>'+title+'</h2><p>'+body+'</p><div class="actions"></div></div>';
  for(const [txt,fn] of actions){
    const b=document.createElement('button');b.className='primary'+(el.querySelector('.actions').childElementCount?' ghost':'');b.textContent=txt;b.addEventListener('click',fn);
    el.querySelector('.actions').append(b);
  }
  const first=el.querySelector('button');if(first)first.focus({preventScroll:true});
  return el.querySelector('.modal-card');
}
function saveBest(){if(g.score>high){high=g.score;storage.write('best',high);$('best').textContent=pad(high,6);}}
function saveLevel(){
  checkpoint={level:g.level,score:g.score,difficulty,p:JSON.parse(JSON.stringify(g.p)),stats:{...g.stats},edition:4};
  storage.write('save',checkpoint);
}
function start(resume=false){
  sound.wake();
  if(resume&&!checkpoint)return;
  if(resume)difficulty=checkpoint.difficulty==='chill'?'chill':'arcade';
  const player=initial();
  if(resume)Object.assign(player,JSON.parse(JSON.stringify(checkpoint.p)));
  g={mode:'play',level:resume?checkpoint.level:0,wave:1,score:resume?checkpoint.score:0,p:motion(player),...empty()};
  g.stats={...freshStats(g.level),...(resume?checkpoint.stats:null)};
  if(resume&&![3,4].includes(checkpoint.edition))g.stats.waves=freshStats(g.level).waves;
  openLevel(g.level);
}
function title(){
  g.practice=null;
  $('continue').hidden=!checkpoint;
  if(checkpoint)$('continue').textContent='RESUME • '+pad(checkpoint.level+1);
  setMode('title');$('start').focus({preventScroll:true});
}
function openLevel(i,firstWave=1){
  g.level=i;g.p=motion(g.p);g.p.hp=g.p.max;g.p.charge=Math.max(48,g.p.charge);
  if(!g.practice)unlockStage(i);
  g.combo=0;g.comboT=0;g.clock=0;g.shake=0;g.flash=0;g.echo=0;g.gap=null;g.banner=0;g.primeForm=false;
  g.cameoUsed=false;g.volley=0;g.perksFx=[];
  g.enemies=[];
  g.safeZone=null;
  musicTimer=0;backdrop=null;
  if(!g.practice)saveLevel();
  setMode('play');openWave(firstWave,firstWave===1);
}
function startPractice(level,phaseTwo=false){
  if(!discovered.has('boss'+level))return;
  if(phaseTwo&&(level!==4||!discovered.has('prime')))return;
  sound.wake();
  const p=initial();
  p.dmg*=practiceRules.power[level];
  p.max+=level*practiceRules.healthPerStage;
  p.rate/=1+level*practiceRules.ratePerStage;
  p.charge=practiceRules.charge;
  g={mode:'play',level,wave:waveCounts[level]+1,score:0,p,stats:freshStats(0),practice:{level,phaseTwo},...empty()};
  openLevel(level,waveCounts[level]+1);
  if(phaseTwo){
    const boss=g.enemies[0];boss.spawn=0;
    transformPrime(boss);
  }
}
function finishPractice(survived){
  const {level,phaseTwo}=g.practice;
  const match=phaseTwo?'Ambatron // Third Impact':stages[level].boss;
  const seconds=Math.floor(g.stats.time);
  setMode('practice-report');
  if(!survived)sound.event('fail');
  panel('PRACTICE • '+match.toUpperCase(),survived?'Boss cleared':'Try another take',
    'Time '+Math.floor(seconds/60)+':'+pad(seconds%60)+' · Vibe lost '+g.stats.damage+' · Close calls '+g.stats.closeCalls,
    [['RETRY',()=>startPractice(level,phaseTwo)],['TITLE SCREEN',title]]);
}
function announce(text,time=1.45){$('toast').textContent=text;$('toast').hidden=false;g.banner=time;}
function spawnPoint(){
  for(let i=0;i<20;i++){const edge=(Math.random()*4)|0;const v=edge===0?{x:rand(92,868),y:94}:edge===1?{x:rand(92,868),y:472}:edge===2?{x:64,y:rand(125,445)}:{x:896,y:rand(125,445)};if(dist(v,g.p)>205)return v;}
  return{x:g.p.x>480?88:872,y:110};
}
function enemy(kind,x,y,materialize=.42){
  const stats=enemyStats(kind,g.level,difficulty);
  g.enemies.push({kind,x,y,r:stats.radius,hp:stats.hp,max:stats.hp,speed:stats.speed,cd:rand(.65,1.75),
    spawn:materialize,aim:0,turn:Math.random()<.5?1:-1,walk:rand(0,TAU),hit:0,variant:Math.floor(rand(0,3))});
  discover(kind);
}
const clubSquads=[
  [
    ['runner','runner','skater','runner','thrower'],
    ['runner','skater','runner','thrower','guard'],
    ['runner','runner','skater','runner','guard','speaker']
  ],
  [
    ['runner','thrower','runner','skater','charger'],
    ['runner','runner','skater','guard','speaker'],
    ['runner','skater','runner','guard','thrower','charger']
  ],
  [
    ['runner','runner','skater','guard','thrower'],
    ['runner','skater','runner','charger','speaker'],
    ['runner','runner','skater','thrower','guard'],
    ['runner','skater','runner','guard','charger','speaker']
  ],
  [
    ['runner','runner','skater','runner','guard','speaker'],
    ['runner','skater','runner','guard','thrower','charger'],
    ['runner','runner','skater','runner','charger','speaker'],
    ['runner','skater','runner','guard','thrower','charger','speaker']
  ]
];
function planWave(level,wave,mode){
  const start=wave===1?1.1:.58, spacing=4.3+wave*.24;
  if(level===2){
    return clubSquads[wave-1].flatMap((group,squad)=>{
      const roles=mode==='chill'?group.slice(0,-1):group;
      return roles.map((kind,i)=>({kind,squad,at:start+squad*(spacing+.24)+i*deploymentSpacing}));
    });
  }
  const squads=3+Number(wave>=3)+Number(wave===4&&level===4);
  const studioFinalWaves=level===3&&wave>=3;
  const size=4+Math.floor((level+wave)/3)+(mode==='chill'?-1:Number(level>=2))-Number(studioFinalWaves);
  const rotation=level===5
    ?['choir','popup','choir','firewall','charger','choir','popup','skater','choir','firewall']
    :['runner','thrower','runner','skater','runner','guard','charger','thrower','speaker','runner','skater','guard'];
  const queue=[];
  for(let squad=0;squad<squads;squad++){
    for(let i=0;i<size+(squad===squads-1?1:0);i++){
      const role=rotation[(i+squad*3+level*2+wave-1)%rotation.length];
      let kind=role;
      if(level===0&&role==='speaker')kind='thrower';
      if(level===0&&wave===1&&role==='charger')kind='runner';
      if((studioFinalWaves||level===4&&wave<=2)&&i===2&&squad===1)kind='camerabot';
      queue.push({kind,squad,at:start+squad*spacing+i*deploymentSpacing});
    }
  }
  return queue;
}
function openWave(n,opening=false){
  g.wave=n;g.gap=null;g.pops=[];g.enemyPops=[];g.hazards=[];g.queue=[];g.items=[];g.perksFx=[];g.squad=0;
  g.safeZone=null;
  g.waveHit=false;g.lastDeployment=-Infinity;
  if(isBossWave()){
    const hp=bossHP(g.level,difficulty);
    g.enemies=[{kind:'boss',x:480,y:154,r:bossRadii[g.level],hp,max:hp,spawn:1.22,cd:.53,pattern:0,walk:0,hit:0,aim:Math.PI/2,charge:0}];
    discover('boss'+g.level);
    g.p.hp=Math.min(g.p.max,g.p.hp+g.p.max*modes[difficulty].bossHeal);
    announce('BOSS • '+stages[g.level].boss.toUpperCase(),1.5);sound.event('bossIntro');
  }else{
    g.queue=planWave(g.level,n,difficulty);
    if(n>1)g.p.hp=Math.min(g.p.max,g.p.hp+g.p.max*modes[difficulty].waveHeal);
    announce(opening?'STAGE '+pad(g.level+1)+' • '+stages[g.level].name.toUpperCase():waveTitles[g.level][n-1].toUpperCase(),opening?1.62:1.2);
    if(opening)sound.event(g.level===5?'hellEntry':'stageIntro');
  }
  g.elapsed=0;hud();
}
function rollRarity(roll=Math.random()){
  if(roll<.6)return 'Common';
  if(roll<.9)return 'Rare';
  return 'Bussted';
}
function requestUpgrade(afterBoss){
  saveBest();
  if(afterBoss&&g.level===publicStageCount-1){
    unlockStage(publicStageCount);sound.event('reveal');
  }else sound.event('clear');
  setMode('pick');
  const stage=stages[g.level], p=g.p, finalPick=afterBoss&&g.level===stages.length-1;
  const next=()=>{
    if(finalPick)win();
    else if(afterBoss)openLevel(g.level+1);
    else{setMode('play');openWave(g.wave+1);}
  };
  const reveal=afterBoss&&g.level===publicStageCount-1;
  const box=panel(reveal?'UNLISTED SIGNAL • NEW STOP FOUND':afterBoss?'STAGE '+pad(g.level+1)+' COMPLETE':'INTERMISSION • WAVE '+g.wave+' CLEARED',
    reveal?'The signal’s still live.':afterBoss?stage.boss+' Popped!':'Tune Up',
    reveal?'Something is broadcasting from below the Core. Pick a perk before you follow it.':finalPick?'Pick one final perk to add to your run report.':afterBoss?'“'+stage.quote+'” Pick a perk for the next arena.':'Pick a perk. Upgrades stack and stay with you for the whole tour.');
  const row=document.createElement('div');row.className='pick-list';box.insertBefore(row,box.querySelector('.actions'));
  const pool=perks.filter(perk=>(p.loadout[perk.id]||0)<(perk.max??Infinity));
  function showOffer(){
    row.replaceChildren();
    const picked=[];
    for(let slot=0;slot<3;slot++){
      const tier=rollRarity();
      const choices=pool.filter(perk=>perk.tier===tier&&!picked.includes(perk));
      picked.push(choices[Math.floor(Math.random()*choices.length)]);
    }
    picked.forEach(perk=>seenPerks.add(perk.id));
    storage.write('perk-files',[...seenPerks]);filesCount();
    for(const perk of picked){
      const b=document.createElement('button');
      const owned=p.loadout[perk.id]||0;
      b.dataset.tier=perk.tier;b.dataset.perk=perk.id;
      b.innerHTML='<span class="rarity">'+perk.tier+'</span><i>'+perk.icon+'</i><b>'+perk.name+'</b><small>'+perk.desc+'</small>'+
        (owned?'<small class="perk-owned">OWNED ×'+owned+'</small>':'');
      b.addEventListener('click',()=>{
        if(g.mode!=='pick'||!b.isConnected)return;
        p.loadout[perk.id]=(p.loadout[perk.id]||0)+1;
        perk.apply?.(p);g.stats.upgrades++;sound.event(perk.tier==='Bussted'?'jackpot':'pick');next();
      });
      row.append(b);
    }
    row.firstElementChild?.focus({preventScroll:true});
  }
  const odds=document.createElement('small');
  odds.className='upgrade-odds';
  odds.textContent='PER CARD · 60% COMMON / 30% RARE / 10% BUSSTED';
  box.insertBefore(odds,box.querySelector('.actions'));
  if(p.encores>0){
    const encore=document.createElement('button');
    encore.className='secondary encore';encore.textContent='ENCORE · REROLL';
    encore.title='One reroll per run';
    encore.addEventListener('click',()=>{
      if(g.mode!=='pick'||p.encores<=0)return;
      p.encores--;encore.remove();sound.event('pick');showOffer();
    });
    box.querySelector('.actions').append(encore);
  }
  showOffer();
}
function pause(){
  if(g.mode!=='play')return;setMode('pause');
  const load=perks.filter(k=>g.p.loadout[k.id]).map(k=>k.name+' ×'+g.p.loadout[k.id]);
  panel('TOUR ON HOLD','PAUSED',load.length?'Loadout: '+load.join(' · '):stages[g.level].tip,[['KEEP BUSSIN’',unpause],['TITLE SCREEN',title]]);
}
function unpause(){if(g.mode==='pause'){sound.wake();setMode('play');}}
function showStats(box){
  const s=g.stats, seconds=Math.floor(s.time);
  const values=[
    ['PLAY TIME',Math.floor(seconds/60)+':'+pad(seconds%60)],
    ['WAVES CLEARED',s.waves+' / '+waveCounts.slice(0,furthest>=publicStageCount?stages.length:publicStageCount).reduce((a,b)=>a+b,0)],
    ['BOSSES POPPED',s.bosses+' / '+(furthest>=publicStageCount?stages.length:publicStageCount)],
    ['BOTS POPPED',s.bots],
    ['BEST STREAK',s.streak],
    ['POP ACCURACY',s.shots?Math.round(s.hits/s.shots*100)+'%':'—'],
    ['VIBE LOST',s.damage],
    ['DASHES',s.dashes],
    ['CLOSE CALLS',s.closeCalls],
    ['CLEAN WAVES',s.cleanWaves],
    ['BUSS BURSTS',s.bursts],
    ['UPGRADES',s.upgrades]
  ];
  const stats=document.createElement('dl');
  stats.className='run-stats';
  stats.innerHTML=values.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('');
  box.insertBefore(stats,box.querySelector('.actions'));
}
function fail(){
  if(g.practice){finishPractice(false);return;}
  saveBest();setMode('fail');sound.event('fail');
  showStats(panel('RUN REPORT • STAGE '+pad(g.level+1)+' • '+pad(g.score,6)+' POINTS','VIBE CHECK FAILED',stages[g.level].tip+' Your stage checkpoint is ready.',
    [['RETRY STAGE',()=>start(true)],['TITLE SCREEN',title]]));
}
function win(){
  saveBest();checkpoint=null;storage.erase('save');setMode('win');sound.event('victory');
  const loadout=perks.filter(perk=>g.p.loadout[perk.id]).map(perk=>perk.name+(g.p.loadout[perk.id]>1?' ×'+g.p.loadout[perk.id]:''));
  showStats(panel('RUN REPORT • 06 / 06 • '+pad(g.score,6)+' POINTS','TOUR COMPLETE!', 'Satan’s PC has been unplugged. Final build: '+loadout.join(' · '),
    [['PLAY AGAIN',()=>start()],['TITLE SCREEN',title]]));
}
function setHudText(id,value){
  const node=$(id);
  if(node.textContent!==value)node.textContent=value;
}
function hud(){
  const p=g.p,b=g.enemies.find(e=>e.kind==='boss'),s=stages[g.level];
  setHudText('hp-text','VIBE '+Math.ceil(Math.max(0,p.hp))+'/'+p.max);
  $('hp-fill').style.width=clamp(p.hp/p.max*100,0,100)+'%';
  setHudText('arena-name',pad(g.level+1)+' / '+(isBossWave()?s.name:waveTitles[g.level][g.wave-1]).toUpperCase());
  const nextSquad=g.queue[0];
  const incoming=nextSquad&&!g.enemies.length&&nextSquad.at-g.elapsed>.38;
  setHudText('wave-name',isBossWave()?'BOSS ROUND':incoming
    ?'WAVE '+g.wave+' · NEXT IN '+(nextSquad.at-g.elapsed).toFixed(1)+'s'
    :'WAVE '+g.wave+' / '+waveCounts[g.level]+' · '+pad(g.enemies.length+g.queue.length)+' LEFT');
  const roundIndex=String(g.level)+'-'+g.wave;
  if($('wave-track').dataset.round!==roundIndex){
    const track=$('wave-track');
    track.dataset.round=roundIndex;
    track.innerHTML=Array.from({length:waveCounts[g.level]+1},(_,i)=>'<i class="'+(i<g.wave-1?'done':i===g.wave-1?'now':'')+'"></i>').join('');
  }
  setHudText('score',pad(g.score,6));
  setHudText('dash-status','DASH '+(p.dashCd>0?p.dashCd.toFixed(1)+'s':'✓'));
  setHudText('buss-status','BUSS '+(p.charge>=100?'◆ READY':Math.floor(p.charge)+'%'));
  $('buss-status').classList.toggle('ready',p.charge>=100);
  $('dash-status').classList.toggle('ready',p.dashCd<=0);
  $('dash-fill').style.width=100*clamp(1-p.dashCd/p.dashMax,0,1)+'%';
  $('buss-fill').style.width=clamp(p.charge,0,100)+'%';
  $('combo-status').hidden=g.comboT<=0||g.combo<2;
  setHudText('combo-status','×'+g.combo+' STREAK');
  $('boss-hud').hidden=!b;
  if(b){
    setHudText('boss-name',g.primeForm
      ?'THIRD IMPACT · '+(b.pods.some(pod=>!pod.dead)?'BREAK THE PODS':'CORE EXPOSED')
      :s.boss.toUpperCase()+(b.hot>0?' · OVERHEAT':''));
    $('boss-fill').style.width=(b.transform>0?100*(1-b.transform/primeEntrance):clamp(b.hp/b.max*100,0,100))+'%';
    $('boss-hud').classList.toggle('overclocked',g.primeForm);
    $('boss-hud').classList.toggle('overheat',b.hot>0);
  }
}
function particle(x,y,color,n=10,v=130,shape=0,direction=0,width=TAU){
  for(let i=0;i<n;i++){const a=direction+rand(-width/2,width/2),speed=rand(v*.24,v);const life=rand(.18,.62);g.fx.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,color,life,max:life,s:rand(2,6),spin:rand(-8,8),a,shape});}
}
function floater(x,y,label,color='#d9ff58'){g.floaters.push({x,y,label,color,life:.74,max:.74});}
function kill(e){
  e.hp=0;e.dead=true;
  g.combo=g.comboT>0?g.combo+1:1;g.comboT=2.1;
  g.stats.streak=Math.max(g.stats.streak,g.combo);
  if(e.kind==='boss')g.stats.bosses++;
  else g.stats.bots++;
  const mult=Math.min(5,1+Math.floor((g.combo-1)/3)), value=(e.kind==='boss'?1000:e.kind==='guard'?160:100)*mult;
  g.score+=value;g.p.charge=Math.min(100,g.p.charge+(e.kind==='boss'?31:7+g.p.burst*2));
  const color=e.kind==='boss'?stages[g.level].color:'#c491ff';
  particle(e.x,e.y,color,e.kind==='boss'?65:17,e.kind==='boss'?270:154,1);
  particle(e.x,e.y,'#faffc7',e.kind==='boss'?21:7,157);
  floater(e.x,e.y-14,e.kind==='boss'?'BOSS POPPED!':'+'+value+(mult>1?' ×'+mult:''),color);
  if(e.kind!=='boss'&&Math.random()<modes[difficulty].dropChance)g.items.push({x:e.x,y:e.y,life:9});
  if(e.kind==='boss'){g.enemies.forEach(other=>{if(other!==e&&!other.dead){other.dead=true;particle(other.x,other.y,color,13);}});g.enemyPops=[];g.hazards=[];g.shake=11;sound.event('bossDown');}
  else{
    sound.event('down');
    if(g.p.loadout.echoCast){
      const next=g.enemies.filter(bot=>!bot.dead&&bot.spawn<=0&&dist(e,bot)<330)
        .sort((a,b)=>dist(e,a)-dist(e,b))[0];
      if(next)playerPop(e,angle(e,next),g.p.dmg*stageAmp[g.level]*(.9+g.p.loadout.echoCast*.24),0,'#7dfff4');
    }
  }
}
function damage(e,amount){
  if(e.dead||e.spawn>0||e.transform>0)return false;
  if(e.kind==='primePod'&&e.owner.transform>0)return false;
  if(e.kind==='boss'&&g.primeForm&&e.pods.some(pod=>!pod.dead))amount*=.32;
  if(e.kind==='boss'&&g.level===5)amount*=e.hot>0?1.65:difficulty==='chill'?.66:.48;
  e.hp-=amount;e.hit=.09;
  if(e.kind==='boss'&&g.level===4&&!g.primeForm&&e.hp<=0){
    transformPrime(e);
  }else if(e.hp<=0)kill(e);
  if(e.kind==='primePod'&&e.dead&&e.owner.pods.every(pod=>pod.dead)){
    g.p.hp=Math.min(g.p.max,g.p.hp+g.p.max*.34);
    g.p.inv=Math.max(g.p.inv,.8);
    g.enemyPops=[];
    announce('CORE EXPOSED',1.2);sound.event('warn');
  }
  return true;
}
function hurt(n){
  const p=g.p;if(p.inv>0||p.dashing>0||g.mode!=='play')return;
  const damage=Math.round(n*modes[difficulty].damage);
  g.waveHit=true;
  g.stats.damage+=Math.min(Math.ceil(p.hp),damage);
  p.hp=Math.max(0,p.hp-damage);p.inv=.72;g.shake=7;g.flash=.19;g.combo=0;g.comboT=0;
  particle(p.x,p.y,'#ff86ae',13,147);
  if(p.hp<=0&&p.loadout.cameo&&!g.cameoUsed){
    g.cameoUsed=true;p.hp=Math.ceil(p.max*.42);p.inv=1.65;
    announce('30-BUCK CAMEO • TAKE TWO',1.4);sound.event('pick');
  }else if(p.hp<=0){hud();fail();}else sound.event('hurt');
}
function playerPop(origin,a,d,pierce,color='#eaffb6',offset=26){
  g.stats.shots++;
  g.pops.push({x:origin.x+Math.cos(a)*offset,y:origin.y+Math.sin(a)*offset,
    a,s:g.p.popSpeed,d,r:5,life:1.28,pierce,hits:new Set(),color});
}
function fire(){
  const p=g.p;if(p.fireCd>0)return;p.fireCd=p.rate;
  p.recoil=1;
  const power=p.dmg*stageAmp[g.level];
  playerPop(p,p.aim+rand(-.027,.027),power,p.pierce);
  for(let i=1;i<=p.spread;i++){
    playerPop(p,p.aim-i*.16,power*.34,p.pierce);
    playerPop(p,p.aim+i*.16,power*.34,p.pierce);
  }
  if(p.loadout.thesis&&++g.volley%Math.max(3,8-p.loadout.thesis)===0){
    for(let i=-3;i<=3;i++)playerPop(p,p.aim+i*.16,power*.95,p.pierce+2,'#ffa9e1');
  }
  particle(p.x+Math.cos(p.aim)*29,p.y+Math.sin(p.aim)*29,'#e1ff80',3,49,1);sound.event('fire');
}
const burstRange=330, burstAngle=Math.PI*.275, burstTime=.46;
function inBurst(origin,target){
  const x=target.x-origin.x,y=target.y-origin.y;
  const forward=x*Math.cos(origin.a)+y*Math.sin(origin.a);
  const side=Math.abs(y*Math.cos(origin.a)-x*Math.sin(origin.a));
  return forward>0&&x*x+y*y<=(burstRange+target.r)**2&&side<=forward*Math.tan(burstAngle)+target.r;
}
function buzz(){
  const p=g.p;if(p.charge<100)return;
  p.charge=0;g.stats.bursts++;g.echo=burstTime;g.echoAt={x:p.x,y:p.y,a:p.aim};g.shake=7;
  g.enemyPops=g.enemyPops.filter(b=>!inBurst(g.echoAt,b));
  particle(p.x,p.y,'#dcff6c',57,530,1,p.aim,burstAngle*2);sound.event('burst');
  for(const e of g.enemies){
    if(inBurst(g.echoAt,e))damage(e,(e.kind==='boss'?245:86)*stageAmp[g.level]*(1+p.burst*.28));
  }
  if(p.loadout.aftershock){
    const x=clamp(p.x+Math.cos(p.aim)*265,48,912), y=clamp(p.y+Math.sin(p.aim)*265,85,489);
    g.perksFx.push({x,y,r:102,wait:.35,life:.43,power:(76+22*p.loadout.aftershock)*stageAmp[g.level]*(1+p.burst*.28),color:'#ff9fd4'});
  }
  floater(p.x,p.y-26,'BUSS BURST!');
}
function updatePerkBlasts(dt){
  for(const effect of g.perksFx){
    if(effect.wait>0){
      effect.wait-=dt;
      if(effect.wait<=0){
        for(const e of g.enemies)if(dist(e,effect)<effect.r+e.r)damage(e,effect.power);
        g.enemyPops=g.enemyPops.filter(b=>dist(b,effect)>effect.r);
        particle(effect.x,effect.y,effect.color,19,190,1);
        sound.tone(188,.18,.10,'triangle',72);
      }
    }else effect.life-=dt;
  }
  g.perksFx=g.perksFx.filter(effect=>effect.life>0);
}
function shot(x,y,a,s=240,dmg=12,type='orb'){
  g.enemyPops.push({x,y,a,s:s*modes[difficulty].projectileSpeed,dmg,r:type==='note'?7:6,life:6,type});
}
function fan(e,a,count,spread,s,type='orb',dmg=13){
  for(let j=0;j<count;j++)shot(e.x,e.y,a+(j-(count-1)/2)*spread,s,dmg,type);
}
function ring(e,n,offset,s,type='orb',damage=13){
  for(let i=0;i<n;i++)shot(e.x,e.y,offset+TAU*i/n,s,damage,type);
}
function move(e,x,y){e.x=clamp(e.x+x,bounds.l+e.r,bounds.r-e.r);e.y=clamp(e.y+y,bounds.t+e.r,bounds.b-e.r);}
function beam(a,b,width,delay,dur,action,dmg=0,owner=null){
  g.hazards.push({type:'line',a,b,width,wait:delay,max:delay,live:dur,dmg,action,owner});
  sound.event('warn');
}
function spot(x,y,r,delay,dmg,owner=null){
  g.hazards.push({type:'spot',x,y,r,wait:delay,max:delay,live:.34,dmg,owner});
}
function lineDist(x,y,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=clamp(((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-a.x-dx*t,y-a.y-dy*t);}
const primeEntrance=2.4;
function arenaLane(vertical,position,width,delay,dmg,action=null){
  beam(vertical?{x:position,y:52}:{x:0,y:position},
    vertical?{x:position,y:520}:{x:960,y:position},width,delay,.36,action,dmg);
}
function aimBeam(from,a,width,delay,dmg,owner=null){
  const target={x:from.x+Math.cos(a)*1250,y:from.y+Math.sin(a)*1250};
  beam({x:from.x,y:from.y},target,width,delay,.37,null,dmg,owner);
}
function quarantineLanes(p,vertical,critical){
  const min=vertical?32:69, max=vertical?928:505;
  const half=critical?58:77, center=clamp((vertical?p.x:p.y)+(Math.random()<.5?-1:1)*104,min+half+18,max-half-18);
  const before=center-half, after=center+half, delay=critical?.96:1.07;
  g.safeZone={vertical,min:before,max:after,time:delay+.38};
  arenaLane(vertical,(min+before)/2,before-min,delay,35);
  arenaLane(vertical,(max+after)/2,max-after,delay,35);
}
function firewallWall(vertical,reverse,gap,critical){
  const start=vertical?48:85,end=vertical?910:490,step=critical?26:33;
  const dir=vertical?(reverse?-Math.PI/2:Math.PI/2):(reverse?Math.PI:0);
  for(let point=start;point<=end;point+=step){
    if(Math.abs(point-gap)<(critical?68:80))continue;
    const x=vertical?point:reverse?957:3, y=vertical?reverse?519:61:point;
    shot(x,y,dir,critical?205:183,20,'ember');
  }
}
function pcUpdate(e,dt){
  const p=g.p, ratio=e.hp/e.max, critical=ratio<.34, heavy=ratio<.7;
  e.walk+=dt*6;
  e.hot=Math.max(0,(e.hot||0)-dt);
  if(critical&&!e.critical){
    e.critical=true;g.shake=12;
    announce('FATAL ENCORE // ALL FANS FAILED',1.5);sound.event('overload');
    particle(e.x,e.y,'#ff684d',34,225,1);
  }
  const x=480+Math.sin(g.clock*(critical?.64:.47))*238;
  const y=232+Math.cos(g.clock*.72)*74;
  const direction=angle(e,{x,y});
  if(dist(e,{x,y})>9)move(e,Math.cos(direction)*dt*108,Math.sin(direction)*dt*108);
  e.cd-=dt;
  if(e.cd>0)return;
  const k=e.pattern++, a=angle(e,p);
  if(k%5===0){
    quarantineLanes(p,k%2===0,critical);
    e.hot=critical?1.22:1.94;e.cd=2.08;
  }else if(k%5===1){
    fan(e,a,critical?17:13,.16,234,'ember',20);
    for(const turret of [{x:70,y:106},{x:890,y:435}]){
      fan(turret,angle(turret,p),heavy?8:5,.21,178,'ember',17);
    }
    e.cd=heavy?1.46:1.75;
  }else if(k%5===2){
    const vertical=k%2===0;
    firewallWall(vertical,k%4>=2,vertical?p.x:p.y,critical);
    ring(e,heavy?21:15,g.clock*.68,148,'ember');
    e.cd=critical?1.52:1.83;
  }else if(k%5===3){
    spot(p.x,p.y,critical?96:78,.77,30);
    for(let j=0;j<4;j++){
      const dir=j*Math.PI/2+.44;
      spot(clamp(p.x+Math.cos(dir)*154,94,866),clamp(p.y+Math.sin(dir)*122,120,452),heavy?71:57,.93+j*.08,24);
    }
    if(heavy)aimBeam(e,a+.38,44,1.21,26);
    e.hot=critical?1.26:1.8;e.cd=2;
  }else{
    for(const off of [-.65,0,.65])aimBeam(e,a+off,critical?55:40,.82+Math.abs(off)*.3,29);
    ring(e,heavy?24:18,-g.clock*.42,124,'ember');
    if(g.enemies.length<3){const q=spawnPoint();enemy(critical?'popup':'choir',q.x,q.y,.66);}
    e.cd=1.89;
  }
}
function transformPrime(e){
  g.primeForm=true;
  g.enemyPops=[];g.hazards=[];
  e.max=Math.round(e.max*.82);e.hp=e.max;
  e.transform=primeEntrance;e.origin={x:e.x,y:e.y};e.pattern=0;e.cd=.54;
  e.r=52;
  const hp=difficulty==='chill'?960:1460;
  e.pods=[0,1].map(slot=>({kind:'primePod',owner:e,slot,x:e.x,y:e.y,r:15,hp,max:hp,hit:0,spawn:0}));
  for(const pod of e.pods)positionPod(pod);
  g.enemies.push(...e.pods);
  g.p.hp=Math.min(g.p.max,g.p.hp+g.p.max*(difficulty==='chill'?.72:.53));
  g.p.charge=100;
  sound.stopTrack();
  g.shake=12;musicTimer=primeEntrance;
  discover('prime');discover('primePod');
  particle(e.x,e.y,'#ffaeef',44,268,1);
  announce('PHASE II  //  THIRD IMPACT',primeEntrance+.65);sound.event('transform');
}
function positionPod(pod){
  const e=pod.owner, a=e.walk*.24+pod.slot*Math.PI;
  pod.x=e.x+Math.cos(a)*114;
  pod.y=e.y+Math.sin(a)*83;
}
function primeUpdate(e,dt){
  const p=g.p;
  if(e.transform>0){
    e.transform=Math.max(0,e.transform-dt);
    const t=1-(e.transform/primeEntrance)**2;
    e.x=lerp(e.origin.x,480,t);e.y=lerp(e.origin.y,228,t);
    e.aim+=dt*(2.2+e.transform*.8);
    if(e.transform===0){g.shake=16;particle(e.x,e.y,'#ff70d3',70,280,1);}
    return;
  }
  e.aim=angle(e,p);
  const center={x:480+Math.sin(e.walk*.093)*216,y:278+Math.sin(e.walk*.16)*113};
  const a=angle(e,center);
  if(dist(e,center)>7)move(e,Math.cos(a)*116*dt,Math.sin(a)*116*dt);
  e.cd-=dt;
  if(e.cd>0)return;
  const k=e.pattern++, pods=e.pods.filter(pod=>!pod.dead);
  if(k%5===0){
    const aim=angle(e,p);
    for(const [index,offset] of [-.92,-.46,0,.46,.92].entries())
      aimBeam(e,aim+offset,49,.76+Math.abs(index-2)*.14,29);
    e.cd=1.65;
  }else if(k%5===1){
    for(const [i,pod] of pods.entries())ring(pod,16,e.walk*.28+i*.31,158,'plasma');
    ring(e,23,-e.walk*.18,222,'plasma');ring(e,15,e.walk*.21+.16,114,'plasma');
    e.cd=1.42;
  }else if(k%5===2){
    const x=clamp(p.x,102,858), y=clamp(p.y,127,451);
    spot(x,y,86,.78,28);
    for(const offset of [-1,1]){
      spot(clamp(x+offset*137,90,870),clamp(y+offset*90,120,450),77,1.01,24);
      spot(clamp(x+offset*147,90,870),clamp(y-offset*106,120,450),69,1.22,24);
    }
    e.cd=1.58;
  }else if(k%5===3){
    const x=clamp(p.x,160,800),y=clamp(p.y,154,406);
    arenaLane(true,x,66,.79,30);
    arenaLane(false,y,64,.94,29);
    arenaLane(true,x-124,49,1.17,25);
    arenaLane(true,x+124,49,1.17,25);
    e.cd=1.7;
  }else{
    for(const pod of pods)fan(pod,angle(pod,p),7,.19,290,'plasma',17);
    fan(e,angle(e,p),11,.18,265,'plasma',17);
    if(g.enemies.length<5){
      const q=spawnPoint();enemy(k%2===0?'charger':'speaker',q.x,q.y);
    }
    e.cd=1.05;
  }
}
const saxRules={
  wind:.46, ring:[16,20], innerRing:10, ringSpeed:164, innerSpeed:101,
  duet:[6,8], lead:6, duetSpeed:190, leadSpeed:241, floorRadius:[58,72],
  floorDelay:1.02, noteDamage:12, floorDamage:17
};
function saxAttack(e,k,aim,phase){
  const late=Number(phase), p=g.p;
  if(k%3===2){
    for(const x of [240,480,720])spot(x,p.y,saxRules.floorRadius[late],saxRules.floorDelay,saxRules.floorDamage);
    ring(e,13,g.clock*.35,126,'note',saxRules.noteDamage);
    sound.event('warn');e.cd=1.72;
    return;
  }
  const amp=k%3===1?{x:k%2===0?112:848,y:k%4<2?125:446}:null;
  e.solo={
    left:saxRules.wind,total:saxRules.wind,amp,
    fire(){
      if(amp){
        fan(amp,e.solo.ampAim,saxRules.duet[late],.235,saxRules.duetSpeed,'note',saxRules.noteDamage);
        fan(e,aim,saxRules.lead,.20,saxRules.leadSpeed,'note',saxRules.noteDamage);
      }else{
        ring(e,saxRules.ring[late],g.clock*.43,saxRules.ringSpeed,'note',saxRules.noteDamage);
        ring(e,saxRules.innerRing,g.clock*.5+.18,saxRules.innerSpeed,'note',saxRules.noteDamage);
      }
    }
  };
  if(amp)e.solo.ampAim=angle(amp,p);
  sound.event('warn');
  e.cd=amp?1.59:phase?1.40:1.70;
}
function bossUpdate(e,dt){
  const p=g.p,i=g.level, a=angle(e,p), d=dist(e,p), phase=e.hp/e.max<.5;
  if(i===5){pcUpdate(e,dt);return;}
  if(g.primeForm){e.walk+=dt*8;primeUpdate(e,dt);return;}
  if(phase&&!e.phase){e.phase=true;announce(i===4?'PRIME // ARMOR FAILING':'BOSS • SECOND WIND',.92);sound.event('warn');}
  e.walk+=dt*(phase?8:5);
  if(e.charge>0){e.charge-=dt;e.cd=Math.max(.34,e.cd-dt);const v=e.vel;
    if(i===1){e.x+=v.x*dt;e.y+=v.y*dt;if(e.charge<=0){e.x=clamp(e.x,72,888);e.y=clamp(e.y,121,456);ring(e,phase?17:12,Math.PI/12,142,'ticket');}}
    else move(e,v.x*dt,v.y*dt);
    return;
  }
  if(i>=2){
    e.aim=a;
    const target=i===2
      ?{x:480+Math.sin(g.clock*.77)*248,y:267+Math.cos(g.clock*.9)*128}
      :i===3?{x:clamp(960-p.x,174,786),y:clamp(544-p.y,138,408)}
        :{x:480+Math.sin(g.clock*.53)*205,y:214+Math.sin(g.clock*1.06)*80};
    const q=angle(e,target), speed=i===4?112:i===3?92:83;
    if(dist(e,target)>12)move(e,Math.cos(q)*dt*speed,Math.sin(q)*dt*speed);
  }else if(!e.wind){
    e.aim=a;
    if(d>(i===0?102:230)){
      const heading=i===0?a+Math.sin(g.clock*1.2)*.54:a;
      move(e,Math.cos(heading)*dt*70,Math.sin(heading)*dt*70);
    }
  }
  if(e.solo&&(e.solo.left-=dt)<=0){
    e.solo.fire();e.solo=null;
  }
  if(e.primeVolley&&(e.primeVolley.left-=dt)<=0){
    fan(e,e.primeVolley.aim,13,.14,279);
    e.primeVolley=null;
  }
  e.cd-=dt;if(e.cd>0)return;
  const k=e.pattern++;
  if(i===0){
    if(k%2===0){
      const end={x:e.x+Math.cos(a)*540,y:e.y+Math.sin(a)*540};e.wind=true;e.aim=a;
      beam({x:e.x,y:e.y},end,70,.78,.32,()=>{e.wind=false;e.charge=.58;e.vel={x:Math.cos(a)*675,y:Math.sin(a)*675};});
      if(phase)aimBeam(e,a+(k%4===0?.47:-.47),43,.99,16);
      e.cd=phase?1.68:2.12;
    }else if(k%4===1){
      fan(e,a,phase?9:7,.23,246,'plate',15);e.cd=1.15;
    }else{
      ring(e,phase?17:12,g.clock*.33,170,'plate');
      spot(p.x,p.y,phase?81:60,.81,20);e.cd=1.34;
    }
  }else if(i===1){
    if(k%4===1){
      fan(e,a,phase?13:9,.22,231,'ticket');e.cd=1.35;
    }else{
      const vertical=k%4===2, sign=k%3===0?1:-1;
      const lane=vertical?clamp(p.x,148,812):clamp(p.y,153,434);
      e.wind=true;e.aim=vertical?sign*Math.PI/2:sign===1?0:Math.PI;
      e.x=vertical?lane:sign>0?46:914;e.y=vertical?sign>0?73:495:lane;
      arenaLane(vertical,lane,vertical?103:101,.87,0,()=>{
        e.wind=false;e.charge=vertical?.58:1.19;
        e.vel=vertical?{x:0,y:sign*725}:{x:sign*727,y:0};
      });
      if(phase||k%4===3){
        const ghost=lane+(lane<(vertical?480:288)?1:-1)*(vertical?166:108);
        arenaLane(vertical,ghost,74,1.03,18);
      }
      e.cd=phase?2.19:2.57;
    }
  }else if(i===2){
    saxAttack(e,k,a,phase);
  }else if(i===3){
    if(k%3===0){
      spot(p.x,p.y,75,.87,21);
      const marks=phase?5:4;
      for(let j=0;j<marks;j++){
        const dir=TAU*j/marks+.3;
        spot(clamp(p.x+Math.cos(dir)*155,85,875),clamp(p.y+Math.sin(dir)*137,112,466),62,1.02+j*.08,18);
      }
      sound.event('warn');e.cd=phase?1.68:1.88;
    }else if(k%3===1){
      const count=Math.min(phase?3:2,Math.max(0,6-g.enemies.length));
      for(let j=0;j<count;j++){const q=spawnPoint();enemy('skater',q.x,q.y,.60);}
      fan(e,a,8,.23,239);e.cd=1.45;
    }else{
      const x=clamp(p.x,138,822),y=clamp(p.y,126,457);
      arenaLane(true,x,59,.86,21);arenaLane(false,y,59,.99,21);e.cd=1.65;
    }
  }else{
    if(k%3===0){
      const vertical=k%2===0,n=phase?3:2;
      for(let j=0;j<n;j++){
        const x=clamp(p.x+(j===0?0:(j===1?-132:150)),85,875),y=clamp(p.y+(j===0?0:(j===1?99:-106)),110,470);
        beam(vertical?{x,y:52}:{x:0,y},vertical?{x,y:520}:{x:960,y},50,.78+j*.11,.36,null,22);
      }
      e.cd=1.52;
    }else if(k%3===1){
      ring(e,phase?22:17,g.clock*.82,199);
      ring(e,phase?16:12,-g.clock*.38,119);
      e.cd=phase?1.24:1.30;
    }else{
      if(phase){
        e.primeVolley={left:.27,aim:a};
        sound.event('warn');
        if(g.enemies.length<3&&k%6===2){const q=spawnPoint();enemy('guard',q.x,q.y,.59);}
      }else fan(e,a,9,.14,279);
      e.cd=phase?1.30:1.17;
    }
  }
}
const rangedAttacks={
  thrower:{range:440,wind:.31,rest:[1.45,2.3],fire:(e,a)=>fan(e,a,g.level>=2?3:1,.15,243+g.level*10,'ticket',12)},
  speaker:{range:375,wind:.42,rest:[2.1,2.8],fire:e=>ring(e,8,e.walk*.25,171,'note')},
  choir:{range:350,wind:.33,rest:[2.25,3.05],fire:(e,a)=>fan(e,a,4,.27,193,'ember',15)},
  firewall:{range:420,wind:.48,rest:[3,3.75],fire:e=>ring(e,10,e.walk*.29,145,'ember')}
};
function rangedWindup(e,dt,distToPlayer,aim){
  const attack=rangedAttacks[e.kind];
  if(!attack)return false;
  if(e.attackWind>0){
    e.attackWind-=dt;
    e.aim=e.attackAim;
    if(e.attackWind<=0){
      attack.fire(e,e.attackAim);
      e.cd=rand(...attack.rest)-(e.kind==='thrower'?g.level*.08:0);
      sound.event('enemyAttack');
    }
    return true;
  }
  e.cd-=dt;
  if(e.cd>0||distToPlayer>attack.range)return false;
  e.attackWind=attack.wind;e.attackAim=aim;
  return true;
}
function enemyUpdate(e,dt){
  e.hit=Math.max(0,e.hit-dt);
  if(e.spawn>0){e.spawn-=dt;return;}
  if(e.kind==='boss'){
    bossUpdate(e,dt);
    if(!e.transform&&dist(e,g.p)<e.r+g.p.r)hurt(e.charge>0?26:g.level===2?17:20);
    return;
  }
  if(e.kind==='primePod'){positionPod(e);return;}
  const p=g.p,a=angle(e,p),d=dist(e,p);
  e.aim=a;e.walk+=dt*(e.kind==='skater'?16:10);
  let vx=Math.cos(a),vy=Math.sin(a);
  if(e.kind==='choir'){
    vx=Math.cos(a+Math.sin(e.walk*.6)*.92);vy=Math.sin(a+Math.sin(e.walk*.6)*.92);
  }else if(e.kind==='popup'||e.kind==='camerabot'){
    const direction=d>245?1:d<177?-1:0;
    vx*=direction;vy*=direction;
    e.cd-=dt;e.focus=Math.max(0,(e.focus||0)-dt);
    if(e.focus>0){vx=0;vy=0;e.aim=e.focusAim;}
    if(e.cd<0&&d<440){
      e.focusAim=a;
      if(e.kind==='popup'){
        e.focus=.82;e.cd=rand(3.2,4.2);
        aimBeam(e,a,24,.82,18,e);
      }else{
        e.focus=.87;e.cd=rand(3.4,4.4);
        spot(p.x,p.y,47,.87,16,e);
        const side=a+Math.PI/2*e.turn;
        spot(clamp(p.x+Math.cos(side)*91,84,876),clamp(p.y+Math.sin(side)*91,106,466),43,1.12,14,e);
      }
      sound.event('enemyAttack');
    }
  }
  if(e.kind==='thrower'||e.kind==='speaker'){
    const speaker=e.kind==='speaker';
    const dir=d>(speaker?218:252)?1:d<151?-1:0;
    vx=vx*dir+Math.cos(a+Math.PI/2)*e.turn*.55;vy=vy*dir+Math.sin(a+Math.PI/2)*e.turn*.55;
  }
  if(rangedWindup(e,dt,d,a)){vx*=.36;vy*=.36;}
  if(e.kind==='charger'){
    if(e.charge>0){
      e.charge-=dt;e.aim=e.lunge;
      move(e,Math.cos(e.lunge)*dt*420,Math.sin(e.lunge)*dt*420);
      if(dist(e,p)<e.r+p.r)hurt(18);
      return;
    }
    if(e.wind>0){
      e.wind-=dt;e.aim=e.lunge;
      if(e.wind<=0)e.charge=.42;
      return;
    }
    e.cd-=dt;
    if(e.cd<0&&d<265){
      e.lunge=a;e.wind=.52;e.cd=rand(1.3,1.8);
      sound.event('enemyAttack');
      return;
    }
  }
  if(e.kind==='skater'){vx=Math.cos(a+Math.sin(e.walk*.57)*.74);vy=Math.sin(a+Math.sin(e.walk*.57)*.74);}
  for(const o of g.enemies){if(o===e||o.dead)continue;const d2=dist(e,o),sum=e.r+o.r+6;if(d2>0&&d2<sum){const f=(sum-d2)/sum*1.34;vx+=(e.x-o.x)/d2*f;vy+=(e.y-o.y)/d2*f;}}
  move(e,vx*dt*e.speed,vy*dt*e.speed);
  if(d<p.r+e.r)hurt(enemyTypes[e.kind].contact);
}
function closeCall(bullet){
  const p=g.p;
  bullet.life=0;
  particle(bullet.x,bullet.y,'#84ffec',5,105,1);
  if(p.closeCalls>=dashRules.closeCallCap)return;
  p.closeCalls++;g.stats.closeCalls++;
  p.charge=Math.min(100,p.charge+dashRules.charge+3*(p.loadout.freeBird||0));
  g.score+=dashRules.score;
  if(p.closeCalls===1){
    floater(p.x,p.y-18,'CLOSE CALL','#a5ffea');sound.tone(840,.12,.07,'triangle',1250);
  }
  if(p.loadout.highQualityRip){
    playerPop(p,p.aim,p.dmg*stageAmp[g.level]*1.30,p.pierce+1,'#81fff5',16);
  }
}
function update(dt){
  if(g.mode!=='play')return;
  g.clock+=dt;g.elapsed+=dt;g.stats.time+=dt;music(dt);g.comboT-=dt;
  if(g.safeZone&&(g.safeZone.time-=dt)<=0)g.safeZone=null;
  g.shake=Math.max(0,g.shake-dt*39);g.flash=Math.max(0,g.flash-dt);g.echo=Math.max(0,g.echo-dt);
  if(g.banner>0){g.banner-=dt;if(g.banner<=0)$('toast').hidden=true;}
  const p=g.p,K=input.keys;
  const mx=Number(K.has('KeyD')||K.has('ArrowRight'))-Number(K.has('KeyA')||K.has('ArrowLeft'))+input.dx;
  const my=Number(K.has('KeyS')||K.has('ArrowDown'))-Number(K.has('KeyW')||K.has('ArrowUp'))+input.dy;
  const len=Math.hypot(mx,my);
  if(input.touchFire){
    const e=g.enemies.filter(e=>!e.dead&&e.spawn<=0).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(e)p.aim=angle(p,e);
  }else if(!matchMedia('(pointer:coarse)').matches||input.down)p.aim=Math.atan2(input.y-p.y,input.x-p.x);
  else if(len>.2)p.aim=Math.atan2(my,mx);
  p.inv=Math.max(0,p.inv-dt);p.dashCd=Math.max(0,p.dashCd-dt);p.fireCd=Math.max(0,p.fireCd-dt);
  p.recoil=Math.max(0,p.recoil-dt*13);
  p.dashBuffer=input.dash?dashRules.buffer:Math.max(0,p.dashBuffer-dt);
  if(p.dashBuffer>0&&p.dashCd<=0){
    g.stats.dashes++;p.dashCd=p.dashMax;p.dashing=dashRules.duration;p.closeCalls=0;p.dashBuffer=0;
    const a=len>.1?Math.atan2(my,mx):p.aim;
    p.vx=Math.cos(a)*dashRules.speed;p.vy=Math.sin(a)*dashRules.speed;sound.event('dash');
    if(p.loadout.seatbelt){
      g.perksFx.push({x:p.x,y:p.y,r:88,wait:.32,life:.39,power:p.dmg*stageAmp[g.level]*3.1,color:'#ffbc65'});
    }
  }
  input.dash=false;
  if(p.dashing>0){p.dashing-=dt;move(p,p.vx*dt,p.vy*dt);particle(p.x,p.y,'#b787ff',2,72,1);}
  else if(len>0){move(p,mx/Math.max(1,len)*p.speed*dt,my/Math.max(1,len)*p.speed*dt);p.walk+=dt*12;}
  else p.walk*=Math.max(0,1-dt*10);
  if(input.down||input.touchFire||K.has('KeyF'))fire();
  if(input.buss)buzz();input.buss=false;
  updatePerkBlasts(dt);
  if(g.queue.length&&g.queue[0].at<=g.elapsed&&g.elapsed-g.lastDeployment>=deploymentSpacing&&
    g.enemies.length<deploymentCap(g.level,difficulty)){
    const {kind,squad}=g.queue.shift(),q=spawnPoint();
    g.lastDeployment=g.elapsed;
    if(g.squad!==squad+1){g.squad=squad+1;sound.event('squad');}
    enemy(kind,q.x,q.y);
  }
  for(const e of g.enemies){if(!e.dead)enemyUpdate(e,dt);if(g.mode!=='play')return;}
  for(const b of g.pops){
    const prev={x:b.x,y:b.y};b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;b.life-=dt;
    if(b.life<=0)continue;
    const hit=g.enemies.filter(e=>!e.dead&&e.spawn<=0&&!b.hits.has(e)&&lineDist(e.x,e.y,prev,b)<e.r+b.r).sort((a,e)=>dist(a,prev)-dist(e,prev));
    for(const e of hit){
      if(damage(e,b.d)&&!b.scored){b.scored=true;g.stats.hits++;if(e.kind==='boss')p.charge=Math.min(100,p.charge+1.6+p.burst*.24);}
      b.hits.add(e);particle(b.x,b.y,'#eaffb6',3,73);
      if(b.pierce--<=0){b.life=0;break;}
    }
  }
  g.pops=g.pops.filter(b=>b.life>0&&b.x>0&&b.x<W&&b.y>44&&b.y<H);
  for(const h of g.hazards){
    if(h.owner?.dead&&h.wait>0){h.live=0;continue;}
    if(h.wait>0){h.wait-=dt;if(h.wait<=0){h.action?.();if(h.type==='spot'){particle(h.x,h.y,'#76f5cc',14,177);sound.tone(216,.14,.07,'square',69);}}}
    else{h.live-=dt;if(h.dmg&&((h.type==='line'&&lineDist(p.x,p.y,h.a,h.b)<h.width/2+p.r*.6)||(h.type==='spot'&&dist(p,h)<h.r+p.r*.6)))hurt(h.dmg);}
    if(g.mode!=='play')return;
  }
  g.hazards=g.hazards.filter(h=>h.live>0);
  for(const b of g.enemyPops){const prev={x:b.x,y:b.y};b.x+=Math.cos(b.a)*b.s*dt;b.y+=Math.sin(b.a)*b.s*dt;b.life-=dt;
    if(lineDist(p.x,p.y,prev,b)<p.r+b.r){
      if(p.dashing>0)closeCall(b);
      else{b.life=0;hurt(b.dmg);}
    }
    if(g.mode!=='play')return;
  }
  g.enemyPops=g.enemyPops.filter(b=>b.life>0&&b.x>-18&&b.x<W+18&&b.y>45&&b.y<H+14);
  for(const o of g.items){o.life-=dt;const d=dist(o,p);if(d<80&&d>0){o.x+=(p.x-o.x)/d*dt*180;o.y+=(p.y-o.y)/d*dt*180;}
    if(d<24){o.life=0;p.hp=Math.min(p.max,p.hp+19);floater(p.x,p.y-17,'+ VIBE','#aaffcf');sound.event('pick');}}
  g.items=g.items.filter(o=>o.life>0);
  for(const f of g.fx){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=160*dt;f.a+=f.spin*dt;f.life-=dt;}
  g.fx=g.fx.filter(f=>f.life>0);
  for(const f of g.floaters){f.life-=dt;f.y-=dt*44;}
  g.floaters=g.floaters.filter(f=>f.life>0);
  g.enemies=g.enemies.filter(e=>!e.dead);
  if(!g.enemies.length&&!g.queue.length){
    if(g.gap===null){
      g.gap=isBossWave()?1.28:.86;g.enemyPops=[];g.hazards=[];
      if(!isBossWave()){
        g.stats.waves++;sound.event('clear');
        if(!g.waveHit){
          const points=cleanWaveRules.points+g.level*cleanWaveRules.pointsPerStage;
          g.stats.cleanWaves++;g.score+=points;
          p.charge=Math.min(100,p.charge+cleanWaveRules.charge);
          floater(p.x,p.y-24,'+'+points+' CLEAN WAVE','#adffe8');
        }
      }
    }
    g.gap-=dt;
    if(g.gap<=0){
      if(isBossWave()){
        if(g.practice)finishPractice(true);
        else{g.score+=Math.ceil(p.hp)*5;requestUpgrade(true);}
      }
      else if(g.wave===2)requestUpgrade(false);
      else openWave(g.wave+1);
    }
  }
  hud();
}
