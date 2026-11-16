function renderCampaignSettings(profile){
  $('campaign-content').innerHTML=`<section class="armory settings-view"><header class="campaign-heading"><h2 id="campaign-heading" tabindex="-1">Settings</h2></header>
    <div class="menu-scroll settings-grid">
      <article class="armory-card"><small>Audio</small><h3>Sound</h3><button class="secondary" data-setting="audio" aria-pressed="${sound.enabled}">${sound.enabled?'On':'Off'}</button></article>
      <article class="armory-card"><small>Audio</small><h3>Combat chatter</h3><button class="secondary" data-setting="stingers" aria-pressed="${sound.stingersEnabled}">${sound.stingersEnabled?'On':'Off'}</button></article>
      <article class="armory-card"><small>Story saves</small><h3>Save ${campaignSlot}</h3><button class="secondary" data-switch-story="true">Change save</button> <button class="secondary" data-new-story="true">Start over</button></article>
    </div></section>`;
}

function toggleCampaignSetting(setting){
  if(setting==='stingers'){
    sound.stingersEnabled=!sound.stingersEnabled;
    storage.write('stingers',sound.stingersEnabled);
    if(!sound.stingersEnabled){sound.stopStinger();sound.nextVoice();}
  }else if(setting==='audio'){
    sound.enabled=!sound.enabled;
    storage.write('audio',sound.enabled);
    if(sound.enabled)campaignMenuMusic();
    else if(sound.ac){sound.stopTrack();sound.stopAttemptAudio();sound.ac.suspend().catch(()=>{});}
  }
  renderCampaign();
  $('campaign-content').querySelector(`[data-setting="${setting}"]`)?.focus({preventScroll:true});
}
