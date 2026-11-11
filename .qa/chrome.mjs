import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
const html=await readFile(new URL('../index.html',import.meta.url),'utf8');
const tmp=await mkdtemp(join(tmpdir(),'buss-chrome-'));
const mode=process.argv[2]||'test';
const browser=process.env.BUSS_TEST_CHROME||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':'chromium');
const profile=join(tmp,'profile');
const screen=fileURLToPath(new URL('./'+mode+'.png',import.meta.url));
let file=join(tmp,'index.html');
const harness=await readFile(new URL('./campaign.js',import.meta.url),'utf8');
const captures={
  gameplay:`sound.enabled=false;start();for(let i=0;i<330;i++){input.x=410;input.y=155;input.down=true;update(1/90);}render();`,
  impact:`sound.enabled=false;start();openLevel(4);openWave(waveCounts[4]+1);const b=g.enemies[0];b.spawn=0;damage(b,b.max);for(let i=0;i<389;i++){g.p.inv=2;update(1/90);}render();`,
  report:`sound.enabled=false;start();openLevel(3);Object.assign(g.stats,{time:248,shots:514,hits:328,bots:183,streak:9,bursts:12,dashes:41,damage:213});g.score=33420;render();fail();`,
  catalog:`Object.keys(enemyFiles).forEach(discover);$('field-guide').style.animation='none';$('catalog').click();$('enemy-files').querySelector('button').click();`,
  inferno:`sound.enabled=false;start();openLevel(5);openWave(waveCounts[5]+1);for(let i=0;i<195;i++){g.p.inv=2;update(1/90);}render();`,
  audio:`(async()=>{
    try {
      sound.ac=new AudioContext();
      await sound.ac.resume();
      sound.bus=sound.ac.createGain();
      sound.bus.gain.value=0;
      sound.bus.connect(sound.ac.destination);
      await sound.loadClips();
      const durations=Object.fromEntries(Object.entries(sound.clips).map(([id,buffer])=>[id,buffer.duration.toFixed(2)]));
      if(Object.keys(durations).length!==18)throw new Error('Missing decoded asset');
      if(Object.values(recordedCues).some(([id,start,end])=>end>sound.clips[id].duration||end<=start))throw new Error('Cue outside recording');
      const first=recordedCues.burst, second=recordedCues.transform;
      const ended=source=>new Promise(resolve=>source.addEventListener('ended',resolve,{once:true}));
      sound.playTrack('boss');
      sound.sample(first);
      const original=sound.voiceSource;
      const firstEnded=ended(original);
      sound.sample(second);
      sound.sample(recordedCues.down);
      if(sound.voiceSource!==original||sound.voiceQueue.length!==1)throw new Error('Queued line interrupted active line');
      await firstEnded;
      const firstTime=sound.lastVoice.blow-sound.lastVoice.buss;
      if(!sound.voiceSource||firstTime<(first[2]-first[1])/first[4]-.05)throw new Error('First line ended prematurely');
      await ended(sound.voiceSource);
      const secondTime=sound.ac.currentTime-sound.lastVoice.blow;
      if(secondTime<(second[2]-second[1])/second[4]-.05)throw new Error('Second line ended prematurely');
      if(sound.voiceSource||sound.voiceQueue.length||sound.lastVoice.blow<=sound.lastVoice.buss)throw new Error('Queued line did not finish in order');
      sound.stopTrack();
      if(sound.trackOffsets.boss<=.2)throw new Error('Loop position was not preserved');
      console.log('BUSS_AUDIO_RESULT ' + JSON.stringify({ok:true,durations,played:[firstTime,secondTime],loopOffset:sound.trackOffsets.boss}));
    } catch(error) {console.log('BUSS_AUDIO_RESULT ' + JSON.stringify({ok:false,error:error.message}));}
  })();`
};
captures['mobile-files']=captures.catalog;
const payload=mode==='test'?harness:captures[mode]??'';
await writeFile(file,html.replace('</body>',()=>'<script>'+payload+'</script></body>'));
const phone=mode==='mobile'||mode==='mobile-files';
if(phone){
  file=join(tmp,'phone.html');
  await writeFile(file,'<!doctype html><body style="margin:0;background:#32273d"><iframe title="390 px layout" src="index.html" style="width:390px;height:748px;border:0"></iframe>');
}
const args=['--headless=new','--disable-gpu','--disable-extensions','--no-first-run','--disable-background-networking','--disable-crash-reporter','--user-data-dir='+profile,'--window-size='+ (phone?'500,780':'1440,900')];
if(mode==='test')args.push('--dump-dom');
else if(mode==='audio')args.push('--enable-logging=stderr','--autoplay-policy=no-user-gesture-required');
else args.push('--screenshot='+screen);
try {
  const out=await new Promise((resolve,reject)=>{
    const p=spawn(browser,[...args,pathToFileURL(file).href],{windowsHide:true});
    let o='',e='',audioResult;
    const timeout=mode==='audio'?setTimeout(()=>p.kill(),12000):null;
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
  }else if(mode==='test'){
    const match=out.o.match(/<pre id="test-result">([^<]+)<\/pre>/);
    if(!match)throw new Error('No results: '+out.e.slice(0,900));
    console.log(match[1]);if(match[1].includes('FAIL'))process.exitCode=1;
  }else console.log(out.e.trim(),screen);
}finally{await rm(tmp,{recursive:true,force:true,maxRetries:4,retryDelay:200});}
