import { readFile, writeFile } from 'node:fs/promises';
const read = name => readFile(new URL('./src/' + name, import.meta.url), 'utf8');
const [shell, css, poster, ...scripts] = await Promise.all(
  ['shell.html', 'style.css', 'poster.svg', 'game.js', 'render.js', 'boot.js'].map(read)
);
const audio = {};
const clips = ['buss','yek','way','take','tap','like','acting','rtp','blow','dies','ambatubus','insane','choir','paza'];
const tracks = ['tour','boss','climax','castle'];
for (const [id, file] of [...clips.map(id=>[id,id+'.mp3']), ...tracks.map(id=>[id,id+'.ogg'])]) {
  try {
    const bytes = await readFile(new URL('./assets/audio/' + file, import.meta.url));
    audio[id] = bytes.toString('base64');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    console.warn('Missing ' + file + '. The game will skip this recording.');
  }
}
const game = shell.replace('/* STYLES */', () => css).replace('<!-- POSTER -->', () => poster)
  .replace('/* GAME */', () => 'const bundledAudio = ' + JSON.stringify(audio) + ';\n' + scripts.join('\n'));
await writeFile(new URL('./index.html', import.meta.url), game);
console.log('Built index.html (' + Buffer.byteLength(game).toLocaleString() + ' bytes).');
