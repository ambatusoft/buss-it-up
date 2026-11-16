# Changelog

## Unreleased

### 2026-11-16 · Stage retitles and combat polish

- Retitled eight stages. Existing records and unlocks use the same level IDs.
- Ambalien Goo deals 100% pop power per second before defenses. Bootleg Overdub's second blast hits after 1.5 s at 70% damage within a 90 px radius.
- Classy Stabilizer recharges each dash 35% slower than the base cooldown. The dash meter updates immediately when a charge is spent. Jomok Drift Soles boost walking for 1.5 s after a dash.
- Locked equipment descriptions show `???`. Phase-two portraits fill the arena behind the final boss's cracked glass.
- The two browser seeds each completed all 30 levels and 172 rounds with zero retries and 29 speed medals, offline and over local HTTP. Audio, build, and reference checks passed.


### 2026-11-16 · Stage names, boots, and final boss blackout

- Retitled 28 stages after Dreamybull clips, transit edits, music remixes, and Indonesian community references. The stage numbers and save IDs are stable. Gear and skill renames also retain their IDs.
- Classy Stabilizer stores two dashes and takes 30% longer per recharge. The HUD has a split meter for the two charges. Stretch This extends dash duration by 55% at the normal cooldown. Transfer Ticket's description states its 20% cooldown reduction. I Need That Nut heals 2 Vibe every tenth hit on a boss.
- Strengthened phase two's glass cracks and shatter. Existing monitor portraits cycle behind the cracked glass at half health, and the arena background goes black on the lethal hit. Reduced motion shows a still portrait. Tightened narrow HUD spacing for longer stage names.
- Both browser seeds cleared all 30 levels with 29 speed medals each and zero retries, offline and over local HTTP. Verified the rebuilt offline file, 320 px HUD, and desktop captures of the portrait, shatter, and blackout.


### 2026-11-15 · Gear roster and final boss effects

- Renamed Dead Air Locket to Batu Khan's Revenge. Every damaging hit clears hostile shots, retaliates for 2× pop power, and adds 5% Burst charge. Removed Camera Tracker, Cache Ripper, Loose Crumbs, Cache Freeze, Lost Take Shell, and Free Bird Request. Existing saves equip an owned replacement or starter gear.
- Bass Drop hits 5% harder and fires 15% slower. Red Circle Needle projectiles travel 27% faster. Eight-Way Cut fires about 7% faster. Jomok Drift Soles give a 45% walk-speed boost after a dash. Bouncer Plate reduces incoming damage by 14%. Moved Eight-Way Cut and Switchback one main level earlier.
- Replaced Thesis Echo with Six-Point Signal, a player-centered hexagram that reaches most of the arena at 90% of standard Burst damage. Bootleg Overdub's second blast now lands after 0.75 s.
- Satan’s PC's second phase cracks and glitches at 75%, 50%, and 25% health. The lethal hit shatters the glass and adds an explosion over the second-phase music. Both automated seeds finished all 30 levels with 29 speed medals and no retries, offline and over local HTTP. Browser audio and legacy save checks passed.


### 2026-11-15 · Burst and defensive gear tuning

- Bass Boost now applies to bosses at 50% health or higher on the active phase bar. Paza Halo, Express Lane, and Switchback now deal 140%, 115%, and 105% of standard Burst damage.
- Red Tag Guard grants 6.7 s of wave-start protection. Core Padding adds 2.5 s of hit protection. Dead Air Locket retaliates at 5× pop power, and Paza Capacitor grants 35% charge at the start of each later wave.
- Both automated seeds cleared all 30 levels and 172 rounds without retries, offline and over local HTTP.


### 2026-11-15 · Close Calls, results, and attempt audio

- Cap Close Calls at one per dash while clearing every intercepted projectile. Limit Amboutabass Echo to one target at its existing damage. It was 1–2 s slower than the piercing version in a matched test on 4-X and 5-X and still beat Cameo by 20–22 s.
- Give Level Clear separate time and score boxes, medal badges, and a list of first-clear gear with each item’s color and icon. Fit rewards beside the summary at narrow widths. Add the vibecoded notice to the title screen.
- Cancel playing and pending combat, narration, and loss audio when leaving or retrying a level. The full loss cue still plays while the player stays at the result. Both campaign seeds completed all 30 levels and 172 rounds without retries, and the browser audio check passed for all 25 assets.


### 2026-11-15 · Final tuning and release review

- Set Expired Ambadonut's damage per second to 120% against regular bots and 90% against bosses before defenses. Reduced Bass Drop from 2.22× to 2.15× pop power and raised Censor Bar's triggered protection to 1.0 s.
- Set Reverse Playback to 80% forward and 180% backward. Overdrive's six fan shots share a 68% multiplier. Right-aligned Pop power values and restored numbers on equipment drawbacks.
- Both campaign seeds cleared all 30 levels and 172 rounds without retries offline and over local HTTP. The audio check passed for all 25 assets. A player validated the 2-1 medal. The unchanged expected public URL returned 404.


### 2026-11-15 · Bonus pacing and balance follow-up

- Increased the base streak to 2.5 s and set Standing Ovation to +1.5 s. Buffed Eight-Way Cut to 35% per shot, Camera Tracker from 1.22× to 1.27× damage, and Last Flare to 0.25 s. Set Reset the Set to 20 Vibe per regular wave, Red Tag Guard to 7 s, Amboutabass Echo to 3× pop power, and Free Bird Request to one trigger per dash.
- Swapped Red Circle Lock and Mas Amba Edit. Gave bonus first clears two points, including existing clears. Refunding skills now takes one click. Fixed Pop power row height and condensed equipment copy.
- Bonus waves now advance immediately when the last enemy falls and all squads have spawned, or on the normal deadline with surviving enemies. Both seeds cleared all 30 levels and 172 rounds without retries, earning 29 medals each offline and over local HTTP. The first-clear routes missed only 2-1. With the same replay build on both bonus stages, Bass Drop was fastest of the four Poppers tested. Human validation remains open.


### 2026-11-15 · Equipment and skill balance pass

- Rebalanced equipment and the skill tree, added Eight-Way Cut, and showed per-projectile Pop power for multishot Poppers. Set base hit protection to 1.0 s and base Burst charge to 40%.
- Retained equipment and skill IDs. Existing builds keep valid purchases and recover points from nodes with missing prerequisites or unaffordable costs.
- Both seeds cleared all 30 levels and 172 rounds offline and over local HTTP. They needed zero and one retries and earned 29 medals each. The first-clear pilot missed 2-1 by 1.6–1.9 s. Human balance for the stronger conditional combinations remains open.


### 2026-11-14 · Release title, story, and clear timing

- Freeze the combat timer and record at the final lethal hit while the victory animation plays. Clear hostile shots and hazards on that hit. Result cards display hundredths to match the map records.
- Retune selected targets in Areas 1–5 in five-second steps. Core Access now allows 2:20. Area 6 keeps all six targets. Both first-clear pilot seeds earned all 30 medals with two retries each. Six extra 5-4 checks across three builds cleared in 1:29.51–1:57.89 without retries.
- Rename the first area Bussiness Gym and add gym scenery, a few reference-based names, and an implied story through the chapter endings. Keep the title screen to the artwork, title, and Start or Continue. Set the Pages title and search and social descriptions.
- Derive the save summary from the furthest cleared main-route level. Both offline and local HTTP tests passed, including old saves, replays, bonus stages, and the finish clock. Human balance, physical touch, and live deployment are still pending.


### 2026-11-14 · Medal targets and equipment follow-up

- Moved the timer and medal target beside the score and paired the target with the recorded best time on the map. Retuned all 30 targets in five-second increments. Orientation now gives 40 seconds. Existing qualifying current-rules records count toward the medals.
- Made hazard notifications bold, removed the remaining boss name suffixes, and changed the final transformation banner to THAT PC BELONGS TO SATAN.
- Improved alternate Poppers, splash, bank shots, control, precision Bursts, dash refunds, reactive armor, and conditional pendants. Reduced secondary pierce damage to 80% to give splash room to compete. Added break-even calculations to the gameplay reference.
- Both campaign seeds cleared all 172 rounds with two retries each, offline and over local HTTP. They earned 29 and 30 Speed Clear medals. Compared boss, crowd, utility, pursuit, and sustain-focused loadouts. Human balance and physical touch remain open.


### 2026-11-14 · Speed Clear and bonus wave overhaul

- Replaced relays and Remix with 30 Speed Clear targets and a combat timer. Reworked Paza Runners, Dead Air Locket, No Signal, and Clean Signal. Version 6 remaps equipment and skill IDs and labels old records as previous rules.
- Renamed the six branches to X and added two timed waves to each. Enemies and hazards carry across transitions. Strengthened every Final Wave and added two escorts to every boss round.
- Updated the Dreamybus and Satan’s PC names and both second forms. Six cropped Dreamybull portraits appear on the final boss monitor during attacks. Moved Archive lore, voice sources, and credits to Markdown.
- Buffed single-shot Poppers, reduced Nut Cracker and Sungut Seeker damage, and gave Coldest Moment a four-second freeze. Bosses take half the strength and duration of slows. Stuns become a 70% slow for half the duration. Matched the Map card title to its labels and moved grouped stats and base Burst damage to the left column.
- Verified 30 levels and 172 rounds on both seeds, offline and at the local Pages path, with two and three retries. Neither first-clear build earned a speed medal. A fully unlocked replay build recorded times under all 30 final targets. Checked legacy migration, desktop and narrow layouts, the rebuilt HTML, the gameplay reference, and all 25 audio assets. Human balance, physical touch, and thumbnail reuse terms remain open.


### 2026-11-12 · Final polish and maintainer handoff (EET)

- **23:06** — Restored area names on the map. Matched wave and kill pop-ups to the shared display type, replaced the segmented meter fills with solid colors, and synchronized the full Burst meter with Buss Ready. Changed Reset the Set to a monochrome circular arrow.
- **23:06** — Made each Final Wave deploy its entire roster at once. Kept relay reveals in numbered waves and removed numeric suffixes from the Final Wave and Boss HUD labels.
- **23:09** — Verified both 30-level, 160-round runs offline and on the local Pages path, with one and seven retries. Checked HUD spacing through 320 px and all 28 audio assets, including the full failure cue. Added the handoff, art and audio pipeline, research workflow, and exact source links for the 14 byte-matched voice files. Physical touch, listening, human balance, and live deployment remain open.

### 2026-11-12 · Level labels and HUD (EET)

- **22:36** — Restored visible level names on the selection map and launch card. Removed the arena title lettering and kept the level name above the wave counter. Aligned the three angled meters, moved the two status labels into separate rows to their right, and limited the slow pulse to full Burst. Verified the HUD at desktop and 390 px widths and ran both campaign seeds.

### 2026-11-12 · Final Waves and Nut Effects (EET)

- **21:54** — Replaced the difficulty selector with one ruleset based on Nutmare. Kept Ambasing FM’s ordinary-wave tuning, raised pressure across the other areas, and increased boss HP while reducing Burst damage against bosses. Added 24 Final Waves for 160 rounds across the campaign.
- **22:00** — Split projectile modifiers into a sixth equipment slot with 10 Nut Effects. Added Reverse Playback, two Bursts, two boots, two Vibe Guards, and two pendants. Coldest Moment slows enemies across the arena. Bosses resist slow and stun. Lowered Burst and dash healing and capped passive damage reduction.
- **22:04** — Added 1–3 SP skill costs, two-point boss first clears, and double-click purchasing. Version 5 migrates compatible builds, refunds over-budget trees, and labels old times and scores until replaced. Added range to the armory readouts.
- **22:11** — Gave relays staggered mid-wave reveal times and fading checks. Shortened and highlighted the dash and Burst bars, enlarged streak and Buss Ready text, added colored banners and kill captions, and standardized the start/replay card. Replaced map names and safe-lane warnings with numbering and graphics.
- **22:16** — Reworked several original bot sprites and attacks and remixed the soundtrack from measured loudness. Lowered both tracks in Areas 2 and 4. Rebuilt the final boss’s second chassis, named it **PC THAT BELONGS TO SATAN**, and added five quicker patterns and a health bar nearly three times its prior size. Retuned bonus squads to avoid stacking too many late hazards at once.
- **22:20** — Verified two 30-level, 160-round seeded playthroughs offline and at a local Pages path. The runs took four and six retries, respectively. Their lowest Burnt Server Vibe readings were 3% and 1%. Checked all 28 audio assets and captured the final-wave HUD, Nut Effect equipment screen, map, tree, and final boss.

### 2026-11-12 · Combat and audio overhaul (EET)

- **19:45** — Added two specialist enemies per area with distinct vector shapes, sizes, movement, windups, and attacks. The six returning variants also gained distinct movement and stats. Updated area wave rosters, hazard markers, and background motion.
- **19:49** — Moved the three meters and streak to the top, added the level title above the wave count, and made wave-clear banners explicit. Three relays appear across each regular attempt and persist across waves. Remix requires all three. Side levels use A labels.
- **19:51** — Added three independent Story slots with difficulty and last-clear summaries. Version 4 keeps the prior single save in Slot 1 and retires Remix medals earned under the previous rule. Sorted equipment by unlock level, marked ownership and equipped state, and replaced duplicate gear effects in the skill tree with combat timing, streak, and utility effects.
- **19:55** — Added the Hellboot form and metal theme to Satan’s PC. Replaced five other tracks, raised combat gain, and made kill, damage, dash, and Burst cues trigger every time when combat chatter is enabled. Moved the heavenly choir to the Cameo revive and added wings and a halo. The failure screen plays the complete Tappin Out source.
- **19:57** — Added automatic quiet-boundary selection for short clips and a browser check that rejects fallback fades. The Archive includes full voice previews. The unverified Satan quote appears as text with an original synthesized cue.
- **19:59** — Verified all 30 levels and 136 rounds on each difficulty, offline and at the local Pages path. Browser checks covered save isolation, v1–v3 migration, relays, both multi-phase bosses, revival, and equipment order. Audio checks decoded all 28 assets, resolved all eight short edits at quiet endpoints, and played the full 10.77-second failure clip.

### 2026-11-12 · Campaign expansion (EET)

- **17:59** — Expanded the six areas to 24 main levels and six harder side levels. The 130 regular waves include directional squads and flanks. Each fourth level adds a separately labeled boss round. Map cards, results, and equipment share the area-level labels. The sixth map appears after 5-4.
- **18:01** — Matched the arena backing resolution to the display and slimmed the campaign navigation for 16:9. Added Archive and Settings tabs, removed Dispatch Log, and added bounded skill-tree panning and shared SVG win and loss portraits. The victory screen returns to the map with one Next button.
- **18:03** — Added six gear rewards and expanded the skill tree to 32 nodes. Rebalanced Double Take and its alternatives and made 30-Buck Cameo the only revive. Locked Normal or Nutmare when starting a story. Version 3 migration keeps older clears and compatible build progress, refunds the removed revive skill, and starts new records for the revised waves.
- **18:06** — Added five CC0 action tracks and a separate Ambatron theme. Kept the menu loop playing across tabs. Added quiet button ticks, nine short stinger variations, Ambatunut references, and source credits. Consolidated wave definitions, split the audio engine from combat, and removed superseded assets and styles.
- **18:09** — Verified both 30-level playthroughs offline and at a local Pages-style URL. Checked 2× rendering, scroll-free 16:9 navigation, v1/v2 migration, and all 27 audio files. The audio test measured complete 2.31 s and 15.52 s narration clips and a 1.85 s Burst stinger. It also verified five quiet button clicks and uninterrupted menu music. Speaker and headphone listening, physical touch-device testing, and the live deployment check remain open.

### 2026-11-12 · Story redesign (EET)

- **00:09** — Replaced temporary perk picks and the old module slot with 31 illustrated items across Popper, Buss Burst, Boots, Vibe Guard, and Pendant. Added projectile patterns and effects, four Burst geometries, and survivability and charge effects.
- **00:18** — Replaced the left map list with arrow-paged areas. Locked the sixth page behind the area-five finale. Added enemy-only Files with area colors, medal icons, an introductory controls card, a five-branch radial tree, and eight color-coded stats. Removed the original tour, combat sidebar, named-wave HUD, and always-visible controls strip.
- **00:33** — Verified the full Hard and Nightmare routes. Migrated Story v1 clears, medals, and compatible gear. Refunded prior skill ranks into the 25 single-purchase nodes and started new difficulty records.
- **00:47** — Verified both 18-level routes from the offline HTML and a local Pages-style URL. Added nine CC0 area and boss tracks, retained full narration recordings for story beats, and removed narration from routine combat. The audio test decoded 19 assets and measured consecutive clips at 2.30 s and 15.52 s. The soundtrack uses 12 distinct combat tracks plus one menu track. Audio listening and gameplay on a physical phone remain pending.

### 2026-11-11 · Initial campaign

- Added *The Lost Broadcast*, an 18-level Story campaign with 40 regular waves, six distinct maps, and six boss finales. Each area has its own attack cues, and six variant bots appear along the route.
- Added a versioned Story profile, a two-slot equipment system, nine skill nodes, exact skill refunds, level medals and records, a dispatch log, optional relays, and boss rematches.
- Researched Dreamybull references across edits, community threads, and archives. Added an in-game dispatch log with source links and a repository reference ledger.
- Added MintoDog's CC0 **Sci-fi Puzzle Stage Select** and **Darkness Road** and switched to loading audio on demand with priority for common voice cues.
- Hardened arcade checkpoint and Files loading and added a fallback for exhausted perk rarities.
- Added a Pages-style HTTP test and GitHub Actions checks. Removed the duplicate nested checkout after confirming it held no unique work.
- Verified the rebuilt HTML, three seeded Arcade Tour runs, the complete Story route on Arcade and Chill, simulated touch controls, and all 20 audio recordings. Live Pages deployment and physical-device playtesting remain pending.
- Moved browser checks to `tests/browser/`, the game-reference generator to `scripts/`, and the poster source to `assets/art/`.
- Added a build freshness check and `.nojekyll` for branch-root GitHub Pages publishing.
- Added an architecture guide, contributor workflow, agent handoff, and a phased story campaign plan with a tracked backlog.

## Arcade baseline

- The initial commit `a1ea437` contains the offline arcade tour, Arcade and Chill difficulties, per-stage checkpoints, Files, Boss Practice, and keyboard, mouse, and touch controls.
