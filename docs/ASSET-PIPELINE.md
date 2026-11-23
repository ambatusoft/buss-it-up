# Art and audio pipeline

Updated 2026-11-23. The editable files in this repository are the source of the shipped assets. The build inlines the artwork, JavaScript, CSS, and every recording into one offline HTML file. The player makes no runtime requests to the original sources.

## Draw graphics that fit the game

The look is a dark broadcast cabinet with warm paper lettering, dark outlines and offset shadows, one strong accent per area, and bold geometric silhouettes. Use the shared CSS display stack `--head` for major headings and pop-ups, with the display face at its natural weight. Use `--mono` for wave labels, numbers, and data. Both use local system fonts. Keep warm red and orange reserved for hostile telegraphs and splashes. Player effects favor cyan, mint, and violet. Pair color with a shape, motion, or direction cue.

| Graphic | Editable source | How to add or revise one |
| --- | --- | --- |
| Title poster and result portraits | [poster.svg](../assets/art/poster.svg), [face.svg](../assets/art/face.svg), [art.js](../src/campaign/art.js) | Keep the face and alternate expressions as shared SVG definitions. Use the original vector geometry as a starting point for new expressions. The poster and result views reuse those definitions. |
| Area map | [data.js](../src/campaign/data.js), [ui.js](../src/campaign/ui.js), [campaign styles](../src/campaign/style.css) | Build each background from simple SVG paths in the normalized 0–100 map space. Set node positions and decorative artwork separately. Keep the route and X branch legible at narrow sizes and keep area-six assets behind the existing reveal logic. |
| Arena backgrounds and props | [render.js](../src/render.js), [art.js](../src/campaign/art.js) | Draw area marks and props as Canvas paths on the cached backdrop. Use the 960 × 544 logical grid. Render moving details and combat telegraphs in the dynamic pass. Place gameplay names in the HUD and map. |
| Player, bots, and boss forms | [render.js](../src/render.js), [foes.js](../src/campaign/foes.js), [art.js](../src/campaign/art.js) | Sketch a distinct silhouette using polygons, strokes, and a signature feature. Start with the intended hit radius, then make the motion, windup, and shape agree with it. Reuse the same drawing for the Files portrait. For specialists, add the spec and attack behavior alongside the vector drawing. |
| Equipment and medals | [gear.js](../src/campaign/gear.js), [ui.js](../src/campaign/ui.js), [armory.js](../src/campaign/armory.js) | Draw a recognizable one-color path on a 24 × 24 grid. `gearIcon()` sets rounded strokes and inherits the slot or medal color. Check small-size silhouettes in the actual menu. |
| Skill nodes and stats | [gear.js](../src/campaign/gear.js), [armory.js](../src/campaign/armory.js) | The existing system uses simple monochrome glyphs. Choose a text-style symbol with good system-font coverage, like Reset the Set’s circular arrow. Let the branch or stat color come from the existing styles. |

For a new piece, sketch with basic shapes in a vector editor or directly in SVG or Canvas code. Export a clean SVG with a `viewBox`, compact paths, unique IDs for inline definitions, and local references. Keep vector sources editable and use original art. Draw on whole or half coordinates where they help a thin stroke. On the arena canvas use `save()` and `restore()` around transforms, alpha, and stroke changes. The game sizes the backing store for display density up to 12 million pixels and keeps gameplay positions in logical units. Recheck pointer aim and touch mapping if the render transform changes.

Capture the asset in context at desktop and narrow sizes with the [browser screenshot commands](DEVELOPMENT.md). Check moving hazards during a real attempt as well as a paused frame. If a font or illustration is added from outside, record the creator, source, license, and any modifications alongside it.

## Source and prepare music

The [track manifest](../assets/audio/tracks.mjs) lists every bundled recording, its local filename, creator release page, per-track gain, and loop offset when needed. The [soundtrack table](GAME-DESIGN.md#soundtrack-and-narration) lists their area, boss, or menu assignments. The existing 14 pieces are CC0 releases on OpenGameArt by MintoDog, Ted Kerr, pmiller, HydroGene, bobjt, and nene. Use the release page's download attachment. The local filename may be different from the download name. Some bundled copies were re-encoded for size, so use the repository copy for an exact reproduction. Useful starting points are [MintoDog's Hard Battle 1](https://opengameart.org/content/hard-battle-1), [Ted Kerr's Chase!](https://opengameart.org/content/chase), and [nene's Boss Battle #8 Metal](https://opengameart.org/content/boss-battle-8-metal).

1. Choose a stage piece with a strong beat or hook and a boss piece with more momentum. Each of the six areas has a distinct stage and boss track. The final server phase switches to `hellboot`. Audition it alongside the previous boss piece and the short transition cue.
2. Verify the license on the creator's release page and record the title, creator, exact source, and modifications. Keep the best authorized source copy. Encode a game copy if size or format requires it. Ogg Vorbis at quality 3 is a starting point. Preserve the source sample rate unless you have a reason to change it. Avoid transcoding a suitable compressed copy.
3. Listen around the loop join and record `loopStart` in seconds when a track has an intro. The radio track currently loops from 7.5 seconds. The menu loop resumes across campaign tabs, and the selected encounter preloads. The game retains up to four decoded music tracks.
4. Measure integrated loudness and tune the track's `gain` in the manifest. The current combat bus multiplies it by 1.38. An initial estimate is `10 ** ((targetLUFS - sourceLUFS) / 20) / 1.38`, with a target near −27 LUFS for stages and −26 for bosses, before the master bus, ducking, and limiter. Listen over combat and voice playback before finalizing.
5. Add the local file under `assets/audio/`, update the manifest and `areaMusic` or `finalPhaseMusic` as needed, rebuild the HTML, regenerate the reference, and run the browser audio check.

```sh
ffmpeg -i "source.wav" -c:a libvorbis -q:a 3 "assets/audio/new-track.ogg"
ffmpeg -i "assets/audio/new-track.ogg" -af ebur128 -f null -
```

[FFmpeg filter reference](https://ffmpeg.org/ffmpeg-filters.html)

## Source and edit voices

The 14 original MP3s below matched the then-current repository copies by SHA-256 on November 12, 2026. Eleven remain bundled; the three retired sources are retained separately below as historical credits. The soundboard is a verified byte source for these copies. Attribution of the original recordings and rights to redistribute them remain separate questions. Prefer an authorized original or a recorded line you have permission to use for new material. Keep the exact source link and edit notes. [Dreamybull soundboard](https://www.myinstants.com/en/search/?name=dreamybull)

To reproduce a comparison, download the linked file under a temporary name and compare it to the repository copy with `Get-FileHash -Algorithm SHA256 assets/audio/tap.mp3, downloaded-tap.mp3` on PowerShell or `sha256sum assets/audio/tap.mp3 downloaded-tap.mp3` on Linux. If a mirror changes, keep the known repository copy and record the discrepancy.

### Voice source ledger

| File in `assets/audio` | Current use | Matching MP3 |
| --- | --- | --- |
| `buss.mp3` | Terminal narration and short Burst variant | [Dreamybull Busss](https://www.myinstants.com/media/sounds/dreamybull-busss.mp3) |
| `blow.mp3` | Boss transformation and clean-wave stinger | [Ambatublow](https://www.myinstants.com/media/sounds/ambatublow-dreamybull.mp3) |
| `dies.mp3` | Victory narration | [Ambatukam dies](https://www.myinstants.com/media/sounds/ambatukam-dies.mp3) |
| `insane.mp3` | Edit Suite narration | [Dreamybull insane](https://www.myinstants.com/media/sounds/dreamybull-insane_FMEQySF.mp3) |
| `choir.mp3` | Full 9 s Cameo revive cue | [Most Angelic Kam](https://www.myinstants.com/media/sounds/ambatukam-most-angelic-kam.mp3) |
| `paza.mp3` | Radio narration | [Paza](https://www.myinstants.com/media/sounds/paza.mp3) |
| `nut.mp3` | Burst stinger | [Ambatunut](https://www.myinstants.com/media/sounds/ambatunut_Nihexk6.mp3) |
| `yek.mp3` | Two enemy-down edits | [Dreamybull YEK](https://www.myinstants.com/media/sounds/dreamybull-yek.mp3) |
| `like.mp3` | Hurt stinger | [Damn it's like that](https://www.myinstants.com/media/sounds/damn-its-like-that_ycZqoI5.mp3) |
| `rtp.mp3` | Dash stinger | [Dreamybull RTP](https://www.myinstants.com/media/sounds/dreamybull-rtp.mp3) |
| `tap.mp3` | Full 10.77 s failure cue | [You Tappin Out](https://www.myinstants.com/media/sounds/you-tappin-out.mp3) |

Retired recordings are not shipped:

| Former file | Former use | Historical source |
| --- | --- | --- |
| `take.mp3` | Archive preview | [Take it, take it](https://www.myinstants.com/media/sounds/dreamybull-take-it-take-it.mp3) |
| `ambatubus.mp3` | Archive reel | [Ambatubus](https://www.myinstants.com/media/sounds/ambatubus.mp3) |
| `acting.mp3` | Relay stinger | [Dreamybull acting stupid](https://www.myinstants.com/media/sounds/dreamybull-acting-stupid.mp3) |

Verify the role and presence of each file in [audio.js](../src/audio.js) when reassigning it. The two preview-only recordings and former relay stinger are documented here as source links. The synth in `audio.js` supplies clicks, impacts, warnings, and the server transformation cue without extra files.

1. Add the MP3 and its ID to `voiceFiles` in the track manifest. Keep an authorized lossless source when available. If an MP3 must be made from it, use `ffmpeg -i "source.wav" -c:a libmp3lame -q:a 4 "assets/audio/new-voice.mp3"`.
2. Add a full line to `recordedCues` with its gain, cooldown, and priority. Use full playback for story beats, revival, and failure. Only add a short combat excerpt to `stingers` after listening through the entire phrase.
3. A stinger tuple gives the ID, start, earliest acceptable end, and gain. Scrub the waveform and place the earliest end after the intended words. `ffmpeg -i "assets/audio/new-voice.mp3" -af silencedetect=n=-36dB:d=0.06 -f null -` can locate candidate pauses. In game, `voiceBoundary()` looks ahead by up to 0.48 s for three quiet 20 ms windows across all channels. It detects signal gaps. Listen to ensure the first qualifying gap comes after the intended phrase.
4. Run the audio harness. It reports chosen timestamps, requires an audible signal, checks the short clips' maximum duration and gain, and rejects fallback fades. In a normal browser, check loud and crowded fights. Repeated combat events have separate voices with shared gain control so frequent clips sit under narration.

For new lore references or archival investigations, follow the [research workflow](design/LORE-RESEARCH.md#research-workflow). Keep source evidence with the asset instead of relying on a chat transcript.

## Final boss monitor images

These six JPEGs are cropped from thumbnails on Dreamybull’s verified YouTube channel, The Real Dreamy. A new image appears at each attack onset and stays inside the monitor for 0.78 seconds. At half health in phase two, the arena reuses the same set behind the cracked glass. The portraits are cropped to fill the whole arena, including during screen shake. The background cycles every 1.18 seconds, with a portrait visible for up to 0.34 seconds per cycle. Reduced motion displays a single still. The build embeds each JPEG once in the offline HTML. The source videos establish provenance. Separate reuse terms have yet to be verified.

| Local JPEG | Source thumbnail |
| --- | --- |
| `monitor-fishing.jpg` | [Change of Plans · Let’s go fishing](https://www.youtube.com/watch?v=mhzROs9PQyQ) |
| `monitor-bowling.jpg` | [We Back Bowling](https://www.youtube.com/watch?v=FddR9TWt_DI) |
| `monitor-sax-stream.jpg` | [150k Subs · Saxophone Music and Reactions](https://www.youtube.com/watch?v=mrHqHoyTC3E) |
| `monitor-channel.jpg` | [Stream thumbnail with channel portrait](https://www.youtube.com/watch?v=ttbE1ox1mCo) |
| `monitor-gaming.jpg` | [Gaming stream webcam crop](https://www.youtube.com/watch?v=cbspktbqWAQ) |
| `monitor-horror-stream.jpg` | [Horror game stream webcam crop](https://www.youtube.com/watch?v=UVOgEsGb30g) |
