import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const html=await readFile(new URL('../../index.html',import.meta.url),'utf8');
const tmp=await mkdtemp(join(tmpdir(),'buss-chrome-'));
const mode=process.argv[2]||'story';
const http=process.argv.includes('--http');
const browser=process.env.BUSS_TEST_CHROME||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'chromium');
const profile=join(tmp,'profile');
const screen=fileURLToPath(new URL('./'+mode+'.png',import.meta.url));
let file=join(tmp,'index.html');
const storyMap=`sound.enabled=false;$('story-entry').click();$('story-slot-list').querySelector('[data-story-slot="1"]').click();`;
const advancedStory=`${storyMap}saveCampaignProfile({...campaignProfile,cleared:campaignLevels.filter(level=>!level.side&&level.areaIndex<4).map(level=>level.id)});`;
const hellbootScene=`${advancedStory}saveCampaignProfile({...campaignProfile,cleared:campaignLevels.filter(level=>level.id!=='encore').map(level=>level.id)});startCampaignLevel('encore');openWave(activeWaveCount());const satan=g.enemies[0];satan.spawn=0;damage(satan,1e7);`;
const captures={
  menu:'',mobile:'',
  gameplay:`${storyMap}startCampaignLevel('interview');for(let i=0;i<330;i++){input.x=410;input.y=155;input.down=true;update(1/90);}render();`,
  'final-wave':`${storyMap}startCampaignLevel('interview');openWave(activeWaveCount());for(let i=0;i<85;i++)update(1/90);g.p.charge=100;g.combo=7;g.comboT=2;$('buss-fill').style.transition='none';hud();render();`,
  catalog:`${advancedStory}saveCampaignProfile({...campaignProfile,files:campaignFiles.filter(file=>file.index<4).map(file=>file.id)});showCampaign('files');`,
  'story-map':`${advancedStory}showCampaign('map','red-circle');`,
  'mobile-story':storyMap,
  'story-skills':`${advancedStory}showCampaign('gear');$('campaign-content').querySelector('[data-armory="skills"]').click();`,
  'mobile-skills':`${advancedStory}showCampaign('gear');$('campaign-content').querySelector('[data-armory="skills"]').click();`,
  'story-nuts':`${advancedStory}showCampaign('gear');$('campaign-content').querySelector('[data-slot="nut"]').click();`,
  'story-boss':`${advancedStory}startCampaignLevel('bus-edit');openWave(activeWaveCount());for(let i=0;i<530;i++){g.p.inv=2;update(1/90);}render();`,
  'story-win':`${storyMap}saveCampaignProfile({...campaignProfile,cleared:['interview','donut']});startCampaignLevel('ambatunut');g.stats.time=62.36;g.score=14250;render();campaignResults(true);$('overlay').style.transition='none';$('overlay').querySelector('.result-card').style.animation='none';`,
  'story-loss':`${storyMap}startCampaignLevel('interview');render();campaignResults(false);`,
  hellboot:`${hellbootScene}Promise.all(monitorImages.map(photo=>photo.decode())).then(()=>{while(satan.pattern===0)update(1/90);render();});`,
  'hellboot-cracks':`${hellbootScene}satan.transform=0;g.banner=0;$('toast').hidden=true;satan.hp=satan.max*.75+1;damage(satan,10);for(let i=0;i<11;i++)update(1/90);render();`,
  'hellboot-portrait':`${hellbootScene}monitorImages[0].decode().then(()=>{satan.transform=0;g.banner=0;$('toast').hidden=true;satan.hp=satan.max*.25+1;damage(satan,10);for(let i=0;i<12;i++)update(1/90);g.mode='pause';render();});`,
  'hellboot-shatter':`${hellbootScene}satan.transform=0;g.banner=0;$('toast').hidden=true;g.fx=[];damage(satan,1e7);for(let i=0;i<17;i++)update(1/90);render();`,
  'hellboot-blackout':`${hellbootScene}satan.transform=0;g.banner=0;$('toast').hidden=true;damage(satan,1e7);for(let i=0;i<109;i++)update(1/90);g.mode='pause';render();`,
  'double-dash':`${advancedStory}equipCampaignGear('stabilizer');startCampaignLevel('thesis');input.dash=true;for(let i=0;i<36;i++)update(1/90);render();`,
  'star-burst':`${advancedStory}equipCampaignGear('echo');startCampaignLevel('thesis');g.banner=0;$('toast').hidden=true;g.p.x=480;g.p.y=280;g.p.charge=100;buzz();for(let i=0;i<13;i++)update(1/90);render();`,
  revive:`${advancedStory}equipCampaignGear('cameo');startCampaignLevel('interview');g.p.inv=0;hurt(1000);for(let i=0;i<38;i++)update(1/90);render();`,
  audio:`(async()=>{
    try {
      sound.ac=new AudioContext();
      await sound.ac.resume();
      sound.bus=sound.ac.createGain();
      sound.bus.gain.value=0;
      sound.bus.connect(sound.ac.destination);
      await sound.loadClip('dispatch');
      if(!sound.clips.dispatch||sound.clips.road)throw new Error('Menu audio did not load independently');
      const roadLoad=sound.loadClip('road');
      if(roadLoad!==sound.loadClip('road'))throw new Error('Duplicate audio decode');
      await roadLoad;
      const durations={};
      for(const id of Object.keys(bundledAudio)){
        const clip=await sound.loadClip(id);
        if(!clip)throw new Error('Missing decoded asset: '+id);
        durations[id]=clip.duration.toFixed(2);
      }
      if(Object.keys(durations).length!==Object.keys(bundledAudio).length)throw new Error('Missing decoded asset');
      if(new Set(areaMusic.flat()).size!==12||areaMusic.flat().some(id=>!durations[id]))throw new Error('Areas need distinct stage and boss tracks');
      if(sound.musicCache.size>4)throw new Error('Decoded music cache exceeded its limit');
      const edits=[];
      for(const [id,start,minEnd,gain] of Object.values(stingers).flat()){
        const buffer=sound.clips[id];
        const edit=voiceBoundary(buffer,start,minEnd);
        const {end,kind}=edit;
        if(!buffer||start>=minEnd||end>buffer.duration||end<minEnd||end-start>2.45||gain>.36)throw new Error('Invalid stinger timing or gain: '+id);
        if(kind==='fade')throw new Error('No quiet endpoint near '+minEnd+' for '+id+' ('+start+'–'+end+')');
        const signal=buffer.getChannelData(0).subarray(Math.round(start*buffer.sampleRate),Math.round(end*buffer.sampleRate));
        if(!signal.some(sample=>Math.abs(sample)>.025))throw new Error('Silent stinger: '+id);
        edits.push({id,start,end:Number(end.toFixed(3)),kind});
      }
      for(const [id] of Object.values(recordedCues)){
        const clip=sound.clips[id], channel=clip.getChannelData(0);
        let peak=0;
        for(let i=0;i<channel.length;i++)peak=Math.max(peak,Math.abs(channel[i]));
        if(peak<.008)throw new Error('Voice cue is silent: '+id);
      }
      const first=recordedCues.transform, second=recordedCues.radio;
      const ended=source=>new Promise(resolve=>source.addEventListener('ended',resolve,{once:true}));
      for(const id of ['dispatch','road','boss']){
        await sound.loadClip(id);
        if(!sound.playTrack(id))throw new Error('Music transition failed: '+id);
      }
      const requested=sound.ac.currentTime;
      sound.sample(first);
      if(sound.lastVoice.blow-requested>.035)throw new Error('Decoded voice took too long to start');
      const original=sound.voiceSource;
      const firstEnded=ended(original);
      sound.sample(second);
      for(const event of ['down','dash','hurt','squad','enemyAttack','burst'])sound.event(event);
      if(sound.voiceSource!==original||sound.voiceQueue.length!==1)throw new Error('Queued line interrupted active line');
      await firstEnded;
      const firstTime=sound.lastVoice.paza-sound.lastVoice.blow;
      if(!sound.voiceSource||Math.abs(firstTime-sound.clips.blow.duration)>.10)throw new Error('First line ended early or the second line started late');
      await ended(sound.voiceSource);
      const secondTime=sound.ac.currentTime-sound.lastVoice.paza;
      if(secondTime<sound.clips.paza.duration-.05)throw new Error('Second line ended prematurely');
      if(sound.voiceSource||sound.voiceQueue.length||sound.lastVoice.paza<=sound.lastVoice.blow)throw new Error('Queued line did not finish in order');
      sound.stopTrack();
      if(sound.trackOffsets.boss<=.2)throw new Error('Loop position was not preserved');
      const loopOffset=sound.trackOffsets.boss;
      if(!sound.playTrack('boss')||Math.abs(sound.track.offset-loopOffset)>.01)throw new Error('Music resumed at wrong offset');
      sound.stingerIndices.burst=0;
      const burstSource=sound.playStinger('burst');
      if(burstSource?.buffer!==sound.clips.nut)throw new Error('Burst stinger failed to start');
      const stingerStarted=sound.ac.currentTime;
      await ended(burstSource);
      const stingerTime=sound.ac.currentTime-stingerStarted;
      const [nut,stingerIn,earliestEnd]=stingers.burst[0];
      if(Math.abs(stingerTime-(voiceBoundary(sound.clips[nut],stingerIn,earliestEnd).end-stingerIn))>.10)throw new Error('Stinger ended outside its detected window');
      const count=sound.combatVoices.size;
      for(const event of ['down','down','hurt','hurt','burst','burst'])sound.event(event);
      if(sound.combatVoices.size!==count+6)throw new Error('Combat event voices were skipped');
      sound.event('revive');
      const revival=[...sound.foreground].find(source=>source.buffer===sound.clips.choir);
      sound.event('fail');
      const fail=[...sound.foreground].find(source=>source.buffer===sound.clips.tap);
      if(!revival||!fail)throw new Error('Revive choir or full failure line failed to start');
      const failStarted=sound.lastVoice.tap;
      await ended(fail);
      if(sound.ac.currentTime-failStarted<sound.clips.tap.duration-.05)throw new Error('Tappin out line stopped before the full source ended');
      saveCampaignProfile(freshCampaignProfile());
      showCampaign('map');
      await sound.loadClip('dispatch');
      await new Promise(resolve=>setTimeout(resolve,120));
      const menuSource=sound.track?.source;
      if(sound.track?.id!=='dispatch')throw new Error('Map music failed to start');
      const clicks=[];
      const tone=sound.tone.bind(sound);
      sound.tone=(...args)=>{clicks.push(args);tone(...args);};
      for(const tab of ['gear','files','settings','map']){
        $('campaign-'+tab).click();
        await Promise.resolve();
        if(sound.track?.source!==menuSource)throw new Error('Menu music restarted on '+tab);
      }
      if(clicks.length!==4||clicks.some(([,seconds,gain])=>seconds>.08||gain>.05))throw new Error('Menu clicks missing or louder than intended');
      const buttonClicks=clicks.length;
      const hasAttemptAudio=()=>sound.voiceSource||sound.voiceQueue.length||sound.foreground.size||
        sound.combatVoices.size||sound.pendingCombat.size||sound.attemptTones.size;
      startCampaignLevel('interview');
      sound.event('overload');
      const tail=[...sound.attemptTones].at(-1);
      const tailEnded=ended(tail);
      sound.playStinger('dash');
      campaignResults(false);
      const interrupted=[...sound.foreground].find(source=>source.buffer===sound.clips.tap);
      if(!interrupted)throw new Error('Fail cue must play on the loss screen');
      const interruptedEnded=ended(interrupted);
      $('overlay').querySelector('.actions button:last-child').click();
      if(g.mode!=='campaign'||hasAttemptAudio())throw new Error('Leaving the loss screen left attempt audio active');
      await Promise.race([
        Promise.all([tailEnded,interruptedEnded]),
        new Promise((_,reject)=>setTimeout(()=>reject(new Error('Stopped sounds kept playing')),450))
      ]);
      startCampaignLevel('interview');
      campaignResults(false);
      $('overlay').querySelector('.actions button').click();
      if(g.mode!=='play'||hasAttemptAudio())throw new Error('Retry left attempt audio active');
      const load=sound.loadClip.bind(sound), delayedIds=['tap','yek'];
      const buffers=Object.fromEntries(delayedIds.map(id=>[id,sound.clips[id]]));
      let finishDecode;
      const delayed=new Promise(resolve=>{finishDecode=resolve;});
      for(const id of delayedIds)delete sound.clips[id];
      sound.loadClip=id=>delayedIds.includes(id)?delayed.then(()=>sound.clips[id]=buffers[id]):load(id);
      sound.playStinger('down');
      campaignResults(false);
      $('overlay').querySelector('.actions button:last-child').click();
      finishDecode();
      await new Promise(resolve=>setTimeout(resolve,80));
      if(hasAttemptAudio())throw new Error('Late decode played attempt audio after exit');
      sound.loadClip=load;
      console.log('BUSS_AUDIO_RESULT ' + JSON.stringify({ok:true,durations,played:[firstTime,secondTime],loopOffset,stingerTime,menuContinuous:true,buttonClicks,edits,fullFail:sound.clips.tap.duration,attemptAudioStopped:true}));
    } catch(error) {console.log('BUSS_AUDIO_RESULT ' + JSON.stringify({ok:false,error:error.message}));}
  })();`
};
captures['mobile-files']=captures.catalog;
captures['mobile-win']=captures['story-win'];
const testMode=mode==='test'||mode==='story';
if(!testMode&&!Object.hasOwn(captures,mode))throw new Error('Unknown browser check: '+mode);
const payload=testMode?(await Promise.all(['./pilot.js','./story.js']
  .map(path=>readFile(new URL(path,import.meta.url),'utf8')))).join('\n'):captures[mode]??'';
const game=html.replace('</body>',()=>'<script>'+payload+'</script></body>');
await writeFile(file,game);
const phone=mode.startsWith('mobile');
if(phone){
  file=join(tmp,'phone.html');
  await writeFile(file,'<!doctype html><body style="margin:0;background:#32273d"><iframe title="390 px layout" src="index.html" style="width:390px;height:748px;border:0"></iframe>');
}
const args=['--headless=new','--disable-gpu','--disable-extensions','--no-first-run','--disable-background-networking','--disable-crash-reporter','--user-data-dir='+profile,'--window-size='+ (phone?'500,780':'1280,720')];
if(testMode)args.push('--dump-dom','--force-device-scale-factor=2');
else if(mode==='audio')args.push('--enable-logging=stderr','--autoplay-policy=no-user-gesture-required');
else args.push('--screenshot='+screen);
let server;
try {
  let url=pathToFileURL(file).href;
  if(http){
    server=createServer((req,res)=>{
      if(req.url!=='/buss-it-up/'){res.writeHead(404).end();return;}
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(game);
    });
    server.listen(0,'127.0.0.1');
    await once(server,'listening');
    url=`http://127.0.0.1:${server.address().port}/buss-it-up/`;
  }
  const out=await new Promise((resolve,reject)=>{
    const p=spawn(browser,[...args,url],{windowsHide:true});
    let o='',e='',audioResult;
    const timeout=setTimeout(()=>p.kill(),mode==='audio'?49000:75000);
    p.stdout.on('data',d=>o+=d);
    p.stderr.on('data',d=>{
      e+=d;
      if(mode==='audio'){
        const match=e.match(/BUSS_AUDIO_RESULT (\{.*\})", source:/);
        if(match){audioResult=match[1];p.kill();}
      }
    });
    p.on('error',reject);p.on('close',code=>{
      clearTimeout(timeout);
      if(audioResult||code===0)resolve({o,e,audioResult});
      else reject(new Error('Chrome exited '+code+' '+e.slice(-1200)));
    });
  });
  if(mode==='audio'){
    if(!out.audioResult)throw new Error('No audio decode result: '+out.e.slice(-1200));
    console.log(out.audioResult);if(!JSON.parse(out.audioResult).ok)process.exitCode=1;
  }else if(testMode){
    const match=out.o.match(/<pre id="test-result"[^>]*>([^<]+)<\/pre>/);
    if(!match)throw new Error('No results: '+out.e.slice(0,900));
    console.log(match[1]);if(match[1].includes('FAIL'))process.exitCode=1;
  }else console.log(out.e.trim(),screen);
}finally{
  if(server)server.close();
  await rm(tmp,{recursive:true,force:true,maxRetries:4,retryDelay:200});
}
