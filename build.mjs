import { readFile, writeFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { areaMusic, finalPhaseMusic, musicTracks, voiceFiles } from './assets/audio/tracks.mjs';
const normalize = text => text.replace(/\r\n/g, '\n');
const read = async path => normalize(await readFile(new URL(path, import.meta.url), 'utf8'));
const [shell, css, campaignCss, poster, face, ...scripts] = await Promise.all(
  ['./src/shell.html', './src/style.css', './src/campaign/style.css', './assets/art/poster.svg', './assets/art/face.svg',
    './src/campaign/data.js', './src/campaign/missions.js', './src/campaign/gear.js', './src/campaign/profile.js', './src/campaign/foes.js', './src/game.js', './src/audio.js', './src/campaign/play.js',
    './src/campaign/combat.js', './src/render.js', './src/campaign/art.js', './src/campaign/armory.js', './src/campaign/menus.js', './src/campaign/ui.js', './src/boot.js'].map(read)
);
new Script(scripts.join('\n'),{filename:'Buss It Up! game sources'});
const audio = {};
const check = process.argv.includes('--check');
for (const [id, file] of [...voiceFiles.map(id=>[id,id+'.mp3']), ...musicTracks.map(track=>[track.id,track.file])]) {
  try {
    const bytes = await readFile(new URL('./assets/audio/' + file, import.meta.url));
    audio[id] = bytes.toString('base64');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.warn('Missing ' + file + '. The game will skip this recording.');
    if (check) process.exitCode = 1;
  }
}
const monitorFrames = await Promise.all(['fishing','bowling','sax-stream','channel','gaming','horror-stream'].map(async name => {
  const photo = await readFile(new URL('./assets/art/monitor-' + name + '.jpg', import.meta.url));
  return 'data:image/jpeg;base64,' + photo.toString('base64');
}));
const game = shell.replace('/* STYLES */', () => css + '\n' + campaignCss).replace('<!-- POSTER -->', () => poster).replace('<!-- FACE -->', () => face)
  .replace('/* GAME */', () => `const monitorFrames=${JSON.stringify(monitorFrames)};\nconst bundledAudio=${JSON.stringify(audio)};\nconst musicTracks=${JSON.stringify(musicTracks.map(({id,gain,loopStart})=>({id,gain,loopStart})))};\nconst areaMusic=${JSON.stringify(areaMusic)};\nconst finalPhaseMusic=${JSON.stringify(finalPhaseMusic)};\n` + scripts.join('\n'));
const output = new URL('./index.html', import.meta.url);
if (check) {
  const existing = await readFile(output, 'utf8').catch(error => {
    if (error.code !== 'ENOENT') throw error;
    return '';
  });
  if (normalize(existing) !== game) {
    console.error('index.html is out of date. Run node build.mjs.');
    process.exitCode = 1;
  } else if (!process.exitCode) {
    console.log('index.html matches its sources.');
  }
} else {
  await writeFile(output, game);
  console.log('Built index.html (' + Buffer.byteLength(game).toLocaleString() + ' bytes).');
}
