import { readFile, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/game.js', import.meta.url), 'utf8');
const data = runInNewContext(source + `
  ({
    stages: stages.map((stage, level) => ({
      name: stage.name, boss: stage.boss, radius: bossRadii[level],
      hp: bossHP(level, 'arcade'), chillHP: bossHP(level, 'chill'),
      amp: stageAmp[level], scale: enemyHealthScale[level],
      cap: [deploymentCap(level, 'arcade'), deploymentCap(level, 'chill')],
      practicePower: practiceRules.power[level],
      waves: waveTitles[level].map((name, index) => ({
        name,
        arcade: planWave(level, index + 1, 'arcade'),
        chill: planWave(level, index + 1, 'chill')
      }))
    })),
    modes, player: initial(), dashRules, practiceRules, cleanWaveRules,
    enemies: enemyIds.map(id => ({
      file: fileNumber('enemy', id), id, name: enemyFiles[id].name, note: enemyFiles[id].note,
      base: enemyTypes[id],
      health: enemyTypes[id] && stages.map((_, level) => [
        enemyStats(id, level, 'arcade').hp, enemyStats(id, level, 'chill').hp
      ])
    })),
    perks: perks.map(perk => ({
      file: fileNumber('perk', perk.id), ...perk
    })),
    recordedCues, musicVolume, voiceQueueSize, voiceQueueLifetime
  })
`, {
  document: { getElementById: () => ({ getContext: () => ({}) }) },
  matchMedia: () => ({ matches: false }),
  localStorage: { getItem: () => null },
  bundledAudio: {}
}, { timeout: 2500 });

const format = value => String(Number(value.toFixed(3)));
const percentage = value => format(100 * value) + '%';
const table = (headers, rows) => [
  headers, headers.map(() => '---'), ...rows
].map(row => '| ' + row.join(' | ') + ' |').join('\n');

const waveRows = [];
const fileById = new Map(data.enemies.map(enemy => [enemy.id, enemy.file]));
const squadSummary = queue => {
  const squads = new Map();
  for (const { kind, squad } of queue) {
    if (!squads.has(squad)) squads.set(squad, []);
    squads.get(squad).push(fileById.get(kind));
  }
  return [...squads.values()].map(group => group.map(id => id.slice(2)).join(' ')).join(' / ');
};
data.stages.forEach((stage, level) => stage.waves.forEach((wave, index) => {
  waveRows.push([
    (level + 1) + '.' + (index + 1), wave.name,
    wave.arcade.length + ' / ' + wave.chill.length,
    format(wave.arcade[0].at) + '–' + format(wave.arcade.at(-1).at),
    squadSummary(wave.arcade), squadSummary(wave.chill)
  ]);
}));

const { player, dashRules, practiceRules, cleanWaveRules } = data;
const generated = [
  '## Player and difficulty',
  `Starts with **${player.max} Vibe**, **${player.dmg} pop damage**, a **${player.rate} s** fire interval, **${player.speed} px/s** movement, **${player.popSpeed} px/s** projectile speed, and **${player.charge}%** Burst charge.`,
  `Dash speed is **${dashRules.speed} px/s** for **${dashRules.duration} s**, with a **${player.dashMax} s** cooldown and **${dashRules.buffer} s** input buffer. Each of the first **${dashRules.closeCallCap}** projectile contacts while dashing is worth **${dashRules.charge} charge** and **${dashRules.score} points**. The dash removes all projectiles it intercepts.`,
  `A clean regular wave pays **${cleanWaveRules.points} + ${cleanWaveRules.pointsPerStage} × zero-based stage index** points and **${cleanWaveRules.charge} charge**. Practice starts with **${practiceRules.charge}%** charge, **+${practiceRules.healthPerStage}** max Vibe per stage index, and divides the fire interval by **1 + ${practiceRules.ratePerStage} × stage index**.`,
  table(['Mode','Enemy HP','Boss HP','Incoming damage','Enemy shot speed','Regular wave refill','Boss entry refill','Vibe drop'], Object.entries(data.modes).map(([name, mode]) => [
    name, percentage(mode.enemyHP), percentage(mode.bossHP), percentage(mode.damage),
    percentage(mode.projectileSpeed), percentage(mode.waveHeal), percentage(mode.bossHeal), percentage(mode.dropChance)
  ])),
  '## Stage progression',
  table(['Stage','Regular waves','Enemy HP scale','Pop/Burst damage scale','Active cap Arcade / Chill','Boss','Boss radius','Boss HP Arcade / Chill','Practice power'], data.stages.map((stage, i) => [
    (i + 1) + ' · ' + stage.name, stage.waves.length, stage.scale, stage.amp, stage.cap.join(' / '), stage.boss, stage.radius,
    stage.hp + ' / ' + stage.chillHP, stage.practicePower + '×'
  ])),
  'Regular wave spawn times are seconds after the round begins. The first squad starts at 1.10 s in wave 1 and 0.58 s in later waves. Squads start 4.30 + 0.24 × wave number seconds apart, with an extra 0.24 s in the club. The nominal gap between bots is 0.16 s. The time range below is the earliest Arcade schedule. Deployments queue when the active cap is reached and are released one at a time after a slot opens. Boss summons use their own caps. The enemy numbers in the last two columns omit the E- prefix and list the squad members in spawn order.',
  table(['Stage.wave','Wave','Bots Arcade / Chill','First–last spawn, s','Arcade squads','Chill squads'], waveRows),
  '## Enemy catalog',
  table(['File','Enemy','Base HP','Base speed','Radius','Contact damage','Field note'], data.enemies.map(enemy => [
    enemy.file, enemy.name, enemy.base?.hp ?? 'See boss notes', enemy.base?.speed ?? '—',
    enemy.base?.radius ?? '—', enemy.base?.contact ?? '—', enemy.note
  ])),
  'These are the effective regular enemy HP values by stage, shown as Arcade / Chill. A value is listed for tuning even if the enemy does not spawn in that stage. Speed gains 5 px/s per zero-based stage index.',
  table(['Enemy','1','2','3','4','5','6'], data.enemies.filter(enemy => enemy.base).map(enemy => [
    enemy.file + ' ' + enemy.name, ...enemy.health.map(values => values.join(' / '))
  ])),
  '## Upgrade catalog',
  table(['File','Upgrade','Rarity','Max picks','Effect shown in game'], data.perks.map(perk => [
    perk.file, perk.name, perk.tier, perk.max ?? 'Uncapped', perk.desc
  ])),
  '## Audio cue regions',
  `Voice gain is relative to the game’s 0.48 master gain. Playback uses source seconds, so a 2 s region at 1.25× takes 1.6 s. The queue holds **${data.voiceQueueSize}** pending lines for up to **${data.voiceQueueLifetime} s**. Priority 0 chatter is skipped if busy. Priority 1–3 lines can wait. If full, the oldest lowest-priority line gives up its place. Playing voice lines finish before the next one begins. Music ducks to 53% of its normal gain during a recording and resumes from its previous offset when unpaused.`,
  table(['Cue','Recording','Start s','End s','Gain','Rate','Min spacing s','Queue priority'], Object.entries(data.recordedCues).map(([cue, settings]) => [
    cue, settings[0] + '.mp3', ...settings.slice(1).map(format)
  ])),
  table(['Music file','Loop gain before ducking'], Object.entries(data.musicVolume).map(([id, gain]) => [id + '.ogg', gain]))
].join('\n\n');

const file = new URL('./GAME-DESIGN.md', import.meta.url);
const markdown = await readFile(file, 'utf8');
const block = /<!-- BEGIN GENERATED TABLES -->[\s\S]*?<!-- END GENERATED TABLES -->/;
if (!block.test(markdown)) throw new Error('Missing generated tables markers in GAME-DESIGN.md');
await writeFile(file, markdown.replace(block, () =>
  '<!-- BEGIN GENERATED TABLES -->\n\n' + generated + '\n\n<!-- END GENERATED TABLES -->'
));
console.log('Refreshed design tables from src/game.js.');
