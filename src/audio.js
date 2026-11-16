// Clip ID, gain, cooldown, priority. Narration plays each file in full.
const recordedCues={
  terminal:['buss',.46,35,1],
  radio:['paza',.43,35,1],
  studio:['insane',.43,35,1],
  transform:['blow',.55,12,3],
  revive:['choir',.66,0,4],
  fail:['tap',.62,0,4],
  victory:['dies',.43,35,3]
};
const voiceQueueSize=2, voiceQueueLifetime=16;
const musicById=new Map(musicTracks.map(track=>[track.id,track]));
// Each edit names the earliest acceptable end. Look ahead for a clean boundary.
const stingers={
  down:[['yek',.49,2.02,.16],['yek',2.27,2.61,.15]],
  hurt:[['like',4.77,6.23,.28]],
  dash:[['rtp',.16,1.71,.17]],
  burst:[['nut',0,1.75,.35],['buss',.16,1.07,.27]],
  clean:[['blow',0,2.15,.19]]
};
function voiceBoundary(buffer,start,minEnd){
  const {sampleRate,duration}=buffer;
  const window=Math.round(sampleRate*.02), channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i));
  const limit=Math.min(duration,minEnd+.48);
  let quiet=0;
  for(let frame=Math.round(minEnd*sampleRate);frame+window<=limit*sampleRate;frame+=window){
    let peak=0;
    for(const channel of channels)for(let i=frame;i<frame+window;i++)peak=Math.max(peak,Math.abs(channel[i]));
    if(peak<.074){
      if(++quiet>=3)return {start,end:frame/sampleRate,kind:'silence'};
    }else quiet=0;
  }
  if(limit===duration)return {start,end:duration,kind:'file'};
  return {start,end:limit,kind:'fade'};
}
const sound={enabled:storage.read('audio',true)!==false,stingersEnabled:storage.read('stingers',true)!==false,
  ac:null,bus:null,lastShot:0,lastPop:0,lastVoice:{},clips:{},clipLoads:{},musicCache:new Set(),track:null,trackOffsets:{},voiceSource:null,voiceQueue:[],
  foreground:new Set(),narrationMix:null,attemptEpoch:0,attemptTones:new Set(),
  combatVoices:new Map(),stingerIndices:{},voiceEdits:new Map(), pendingCombat:new Map(),effects:null,
  wake(){
    if(!this.enabled)return;
    try{
      if(!this.ac){
        const AC=window.AudioContext||window.webkitAudioContext;
        if(!AC)return;
        this.ac=new AC();this.bus=this.ac.createGain();this.bus.gain.value=.67;
        const limiter=this.ac.createDynamicsCompressor();
        limiter.threshold.value=-10;limiter.ratio.value=8;limiter.attack.value=.003;
        this.bus.connect(limiter);limiter.connect(this.ac.destination);
        this.effects=this.ac.createGain();this.effects.gain.value=1.32;this.effects.connect(this.bus);
        for(const [id] of Object.values(recordedCues))this.loadClip(id);
        for(const entries of Object.values(stingers))for(const [id] of entries)this.loadClip(id);
      }
      if(this.ac.state==='suspended'||this.ac.state==='interrupted'){
        return this.ac.resume().then(()=>{
          this.nextVoice();
          for(const [type,count] of this.pendingCombat){
            for(let i=0;i<count;i++)this.playStinger(type);
          }
          this.pendingCombat.clear();
        }).catch(()=>{});
      }
    }catch{}
  },
  loadClip(id){
    if(this.clips[id]){this.rememberTrack(id);return Promise.resolve(this.clips[id]);}
    if(!this.ac||!bundledAudio[id])return Promise.resolve(null);
    this.clipLoads[id]??=Promise.resolve().then(async()=>{
      try{
        const binary=atob(bundledAudio[id]), bytes=new Uint8Array(binary.length);
        for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
        this.clips[id]=await this.ac.decodeAudioData(bytes.buffer);
        this.rememberTrack(id);
      }catch{this.voiceQueue=this.voiceQueue.filter(item=>item.cue[0]!==id);}
      this.nextVoice();
      return this.clips[id]??null;
    });
    return this.clipLoads[id];
  },
  rememberTrack(id){
    if(!musicById.has(id))return;
    this.musicCache.delete(id);
    this.musicCache.add(id);
    if(this.musicCache.size<=4)return;
    const oldest=[...this.musicCache].find(key=>key!==this.track?.id);
    this.musicCache.delete(oldest);
    delete this.clips[oldest];
    delete this.clipLoads[oldest];
  },
  sample(cue){
    const [id,,cooldown,priority]=cue;
    if(!this.enabled||!this.ac||!bundledAudio[id])return false;
    const now=this.ac.currentTime;
    if(priority===4){
      const epoch=this.attemptEpoch;
      if(this.clips[id]&&this.ac.state==='running')this.playVoice(cue,true);
      else Promise.all([this.wake(),this.loadClip(id)]).then(([,clip])=>{
        if(epoch===this.attemptEpoch&&clip&&this.enabled&&this.ac.state==='running')this.playVoice(cue,true);
      });
      return true;
    }
    if(now-(this.lastVoice[id]??-Infinity)<cooldown)return true;
    const ready=this.clips[id]&&this.ac.state==='running';
    if(!this.clips[id])this.loadClip(id).then(clip=>{
      if(!clip)this.voiceQueue=this.voiceQueue.filter(item=>item.cue[0]!==id);
    });
    if(ready&&!this.voiceSource){
      this.playVoice(cue);
    }else if(priority>0){
      const alreadyQueued=this.voiceQueue.some(item=>item.cue[0]===id);
      if(!alreadyQueued){
        this.voiceQueue.push({cue,queuedAt:now});
        this.voiceQueue.sort((a,b)=>b.cue[3]-a.cue[3]);
        if(this.voiceQueue.length>voiceQueueSize){
          this.voiceQueue.pop();
        }
      }
    }
    return true;
  },
  playVoice([id,volume],foreground=false){
    const buffer=this.clips[id], now=this.ac.currentTime;
    const duration=buffer.duration;
    if(duration<=0)return;
    const source=this.ac.createBufferSource(), gain=this.ac.createGain();
    source.buffer=buffer;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(volume,now+.015);
    gain.gain.setValueAtTime(volume,now+duration-.014);
    gain.gain.linearRampToValueAtTime(0,now+duration);
    source.connect(gain);
    if(foreground){
      gain.connect(this.bus);
      this.foreground.add(source);
    }else{
      this.narrationMix=this.ac.createGain();
      gain.connect(this.narrationMix);this.narrationMix.connect(this.bus);
      this.voiceSource=source;
    }
    this.lastVoice[id]=now;
    this.mixCombatVoices();
    this.setMusicGain();
    source.onended=()=>{
      if(foreground)this.foreground.delete(source);
      else if(this.voiceSource===source){
        this.voiceSource=null;this.narrationMix=null;
        this.nextVoice();
      }
      this.mixCombatVoices();
      this.setMusicGain();
    };
    source.start(now);
    return source;
  },
  nextVoice(){
    if(!this.enabled||this.ac?.state!=='running'||this.voiceSource)return;
    this.voiceQueue=this.voiceQueue.filter(item=>this.ac.currentTime-item.queuedAt<=voiceQueueLifetime);
    const index=this.voiceQueue.findIndex(item=>this.clips[item.cue[0]]);
    if(index>=0)this.playVoice(this.voiceQueue.splice(index,1)[0].cue);
  },
  stopAttemptAudio(){
    this.attemptEpoch++;
    this.voiceQueue.length=0;
    if(this.voiceSource){
      const source=this.voiceSource;
      this.voiceSource=null;source.stop();
    }
    for(const source of this.foreground)source.stop();
    this.foreground.clear();
    this.narrationMix=null;
    this.stopStinger();
    for(const tone of this.attemptTones)tone.stop();
    this.attemptTones.clear();
  },
  stopStinger(){
    this.pendingCombat.clear();
    for(const source of this.combatVoices.keys())source.stop();
    this.combatVoices.clear();
  },
  playStinger(type){
    if(!this.enabled||!this.stingersEnabled||!this.ac)return;
    if(this.ac.state!=='running'){this.pendingCombat.set(type,(this.pendingCombat.get(type)??0)+1);return;}
    const now=this.ac.currentTime;
    const options=stingers[type], index=this.stingerIndices[type]??0;
    const edit=options[index%options.length];
    const [id]=edit;
    this.stingerIndices[type]=index+1;
    const buffer=this.clips[id];
    if(!buffer){
      const epoch=this.attemptEpoch;
      this.loadClip(id).then(clip=>{
        if(epoch===this.attemptEpoch&&clip&&this.enabled&&this.stingersEnabled&&this.ac.state==='running')this.startStinger(edit);
      });
      return;
    }
    return this.startStinger(edit);
  },
  startStinger(edit){
    const [id,start,minEnd,volume]=edit;
    const buffer=this.clips[id], now=this.ac.currentTime;
    if(!this.voiceEdits.has(edit))this.voiceEdits.set(edit,voiceBoundary(buffer,start,minEnd));
    const boundary=this.voiceEdits.get(edit);
    const duration=boundary.end-start;
    if(duration<=.06)return;
    const source=this.ac.createBufferSource(), gain=this.ac.createGain(), level=this.ac.createGain();
    source.buffer=buffer;
    gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(volume,now+.016);
    gain.gain.setValueAtTime(volume,now+duration-(boundary.kind==='fade'?.18:.035));
    gain.gain.linearRampToValueAtTime(0,now+duration);
    source.connect(gain);gain.connect(level);level.connect(this.bus);
    this.combatVoices.set(source,level);
    this.mixCombatVoices();
    source.onended=()=>{this.combatVoices.delete(source);this.mixCombatVoices();};
    source.start(now,start,duration);
    return source;
  },
  mixCombatVoices(){
    const level=(this.voiceSource||this.foreground.size ? .42 : 1)/Math.sqrt(Math.max(1,this.combatVoices.size));
    this.narrationMix?.gain.setTargetAtTime(this.foreground.size?.25:1,this.ac.currentTime,.035);
    for(const node of this.combatVoices.values())node.gain.setTargetAtTime(level,this.ac.currentTime,.012);
  },
  setMusicGain(){
    if(!this.track)return;
    const gain=this.track.gain.gain;
    const duck=this.voiceSource||this.foreground.size ? .50 : 1;
    const track=this.track.id;
    gain.setTargetAtTime(musicById.get(track).gain*duck*(track==='dispatch'?1:1.38),this.ac.currentTime,.14);
  },
  playTrack(id){
    if(this.track?.id===id)return true;
    if(this.enabled&&!this.clips[id])this.loadClip(id);
    const buffer=this.clips[id];
    if(!buffer||!this.enabled||this.ac?.state!=='running')return false;
    this.rememberTrack(id);
    this.stopTrack();
    const source=this.ac.createBufferSource(), gain=this.ac.createGain(), now=this.ac.currentTime;
    source.buffer=buffer;source.loop=true;source.loopStart=musicById.get(id).loopStart??0;source.connect(gain);gain.connect(this.bus);
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
    const position=offset+now-startedAt;
    this.trackOffsets[id]=position<duration?position:source.loopStart+(position-duration)%(duration-source.loopStart);
    gain.gain.setTargetAtTime(0,now,.04);source.stop(now+.17);
    this.track=null;
  },
  tone(hz,dur=.09,vol=.09,kind='triangle',end=hz,offset=0,attempt=true){if(!this.enabled||!this.ac||this.ac.state!=='running')return;
    const t=this.ac.currentTime+offset,o=this.ac.createOscillator(),v=this.ac.createGain();o.type=kind;o.frequency.setValueAtTime(hz,t);
    o.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+dur);v.gain.setValueAtTime(.0001,t);
    v.gain.exponentialRampToValueAtTime(vol,t+.008);v.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(v);v.connect(this.effects??this.bus);
    if(attempt){
      this.attemptTones.add(o);
      o.onended=()=>this.attemptTones.delete(o);
    }
    o.start(t);o.stop(t+dur+.01);},
  event(type){const t=this.ac?.currentTime||0;if(type==='fire'){if(t-this.lastShot>.067){this.lastShot=t;this.tone(580,.055,.039,'triangle',240);}}
    if(type==='down'&&t-this.lastPop>.065){this.lastPop=t;this.tone(260,.055,.045,'triangle',510);}
    if(type==='hurt')this.tone(124,.21,.17,'sawtooth',47);
    if(type==='dash')this.tone(165,.15,.10,'sine',620);
    if(type==='warn')this.tone(350,.15,.08,'square',270);
    if(type==='burst'){this.tone(110,.42,.21,'sine',35);this.tone(310,.24,.12,'sawtooth',870);}
    if(type==='fail')this.tone(185,.7,.16,'triangle',42);
    if(type==='bossDown')this.tone(190,.63,.21,'sine',37);
    if(type==='transform'){
      [52,65,78,104].forEach((hz,i)=>this.tone(hz,.94,.13,'sawtooth',hz*.73,i*.14));
    }
    if(type==='overload'){
      [41,58,87,123].forEach((hz,i)=>this.tone(hz,1.12,.16,'sawtooth',hz*.38,i*.11));
    }
    const cueName=type==='bossIntro'?({1:'terminal',2:'radio',3:'studio'})[g.level]:type;
    if(recordedCues[cueName])this.sample(recordedCues[cueName]);
    if(type==='clear')[392,494,587,784].forEach((f,i)=>this.tone(f,.19,.12,'triangle',f,i*.07));
    if(type==='pick')this.tone(680,.13,.10,'sine',1060);
    if(type==='click')this.tone(740,.045,.039,'sine',510,0,false);
    if(stingers[type])this.playStinger(type);
  }
};
function music(dt){
  musicTimer-=dt;
  if(musicTimer>0)return;
  const track=g.serverGlass?finalPhaseMusic:areaMusic[g.level][Number(isBossWave())];
  sound.playTrack(track);
  musicTimer=.15;
}
