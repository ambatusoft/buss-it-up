# Architecture

Updated 2026-11-23. The build emits a single offline HTML game. See the [maintainer handoff](HANDOFF.md) for the current project state.

## Source map

| Path | Responsibility |
| --- | --- |
| [src/game.js](../src/game.js) | Simulation, player and enemy lifecycle, boss patterns, HUD, input state |
| [src/audio.js](../src/audio.js) | Decode and cache, music loops and resume positions, foreground and queued narration, voice boundary detection, combat mixing and procedural sounds |
| [src/render.js](../src/render.js), [src/campaign/art.js](../src/campaign/art.js) | Arena backgrounds, effects, actors, and enemy file portraits |
| [src/campaign/data.js](../src/campaign/data.js), [src/campaign/missions.js](../src/campaign/missions.js) | Authored area maps and waves, stable level IDs, derived route and squad parsing |
| [src/campaign/play.js](../src/campaign/play.js) | Deployment, arena hazards, timed bonus waves, boss modifiers, and result screens |
| [src/campaign/foes.js](../src/campaign/foes.js) | Area specialists, vector silhouettes, telegraph timing, movement and attacks |
| [src/campaign/gear.js](../src/campaign/gear.js), [src/campaign/combat.js](../src/campaign/combat.js) | Loadout definitions, single-purchase tree, shot patterns and effects, Burst geometry |
| [src/campaign/profile.js](../src/campaign/profile.js) | Save normalization, unlocks, purchases, records, medal and discovery ledgers |
| [src/campaign/ui.js](../src/campaign/ui.js), [src/campaign/armory.js](../src/campaign/armory.js), [src/campaign/menus.js](../src/campaign/menus.js) | Map, Files, save slots, tutorial prompt, upgrades and settings |
| [assets/art/face.svg](../assets/art/face.svg) | Shared SVG head and win/loss expressions for the title and results |
| [src/shell.html](../src/shell.html), [src/style.css](../src/style.css), [src/campaign/style.css](../src/campaign/style.css), [src/boot.js](../src/boot.js) | Game shell, layout, keyboard, pointer, touch, and frame loop |
| [assets/audio/tracks.mjs](../assets/audio/tracks.mjs), [build.mjs](../build.mjs) | Track assignment, assets and credits, offline HTML packaging |
| [tests/browser](../tests/browser/), [scripts/refresh-reference.mjs](../scripts/refresh-reference.mjs) | Playthrough and audio verification, generated game tables |

Build order matters because the concatenated scripts share a scope. Content and profile definitions load before the simulation. Combat, rendering, and menus follow. Boot connects the controls and frame loop after the UI exists.

## Game state

`g.level` is a zero-based area index used by boss logic, stats, and rendering. `g.story.level.id` is a stable progression key. `g.wave` is one-based. `campaignRoundCount()` includes the ending round for both level types. Ordinary levels append the area’s surge roster in `missions.js`. `campaignWave()` gives the roster one arrival time and `updateCampaignDeployment()` consumes that whole group in one fixed step. The normal deployment cap and spacing apply to numbered waves. Boss levels end with a separately scheduled boss round. Main levels advance when both the spawn queue and live-enemy list are empty. Bonus levels advance as soon as the current wave is clear or its clock expires, once all squads have deployed. Enemies, hazards and projectiles can carry into the next wave. The bonus clear still requires the final roster and all stragglers to be defeated. The final lethal hit freezes the attempt clock and clears hostile hazards. Simulation time continues through the short victory animation.

In `data.js`, list each area's three main levels, then finale 4, then bonus level X. Position drives the map label, equipment sort order, and branch connections. Keep each level's `id` stable across renames. A squad is a space-delimited bot list, optionally prefixed with `north>`, `south>`, `east>`, `west>`, or `flanks>`. The wave system falls back to standard spawning if a formation point is too close to the player.

The arena simulation and input share a 960 × 544 coordinate space. The renderer scales the canvas backing store to the viewport and device pixel ratio, capped at 12 million pixels. A resize invalidates the cached backdrop, which is drawn once per size and reused. Campaign tabs share one music source across view changes. The audio engine keeps at most four decoded music tracks and preloads the selected encounter. Leaving or retrying invalidates pending attempt audio and stops its active sources. Menu clicks use their own lifetime.

`campaignPlayer()` creates an attempt from base stats, six equipped items, and purchased nodes. Popper sets volley pattern, travel speed, lifetime, and damage. Nut Effect attaches a descriptor to the primary projectile at fire time. Secondary echoes and reflected shots have their own parameters. The central condition step ticks poison and scales movement and attack time for slow and stun. Bosses resist control without becoming immune. Burst geometry is defined in combat and shared with its animation.

Add skill benefits as stat modifiers or distinct triggers such as a dash timing window, opening hit, streak, or wave start.

The devil pendant creates a companion for the attempt. Its projectiles share friendly collision and homing code, with independent damage, cadence, speed, and lifetime. The companion flag bypasses player damage and hit-proc skills. Its `healingScale` halves recovery after normal healing bonuses and rounding, retaining fractional Vibe. The shared helper and direct boss-phase recovery sites apply the same multiplier; the final boss's recovery floor is included in that calculation. Starting an attempt restores full starting Vibe.

Dash cooldown tracks how much time remains until the entire stock is full. Spending a charge adds its reload time to the total. A charge becomes ready each time the balance drops through one full reload interval. This keeps the first reload running if the player spends a second charge and lets the split HUD reflect both available charges and reload progress.

The final boss's second phase stores its glass state on the attempt. Damage advances that state at 75%, 50%, 25%, and death. Half health starts a portrait cycle behind the cracks. On death the renderer switches to a black background, then draws shards, the shockwave, and particles over it. The second-phase track continues through that animation.

Files computes a catalog ordered by the first area that can spawn each enemy. Encounter events write the enemy ID into the active story profile. Bosses and boss phases use separate IDs. The final map, its undiscovered Files, and its locked gear remain gated by the area-five finale.

## Save boundaries

The three slots use `buss-story-profile`, `buss-story-profile-2`, and `buss-story-profile-3`. Each stores a profile ID, cleared levels, medals, records, tutorial acknowledgment, discovered enemies, six equipped gear IDs, purchased nodes, and the last selected level. The slot summary derives the furthest main-route clear from the cleared IDs. It ignores replays and optional X levels. Available points use one per ordinary first clear and two per boss or bonus first clear, minus purchased node costs. Points are derived from clears, so saves with an existing bonus clear gain its extra point automatically. Replays and rematches award no extra points.

Versions 1–7 migrate on read. Older saves keep clears and available gear. Equipped legacy Popper effects map to compatible Nut Effects. Unaffordable old skill trees are refunded. Version 5 equipment and skill IDs with replacements are remapped. Across supported versions, equipped retired items switch to their replacement if owned, or to starter gear in that slot. Renamed items retain their IDs. Previous-rules score and time remain visible until a new clear. Old Remix medals retire. On load, purchased nodes that lack a current prerequisite or exceed the current point budget return their points. The Speed Clear medal requires a qualifying time under the current rules. Save normalization grants it when a nonlegacy record already meets the target. Version 7 retains gear earned at an older unlock gate and stores a first-bonus acknowledgment. Version 8 preserves Censor Bar from its previous 6-4 gate and grants the new pendant to existing 6-4 clears.

Mutations reread the latest profile when possible. Attempts carry the profile ID, so a reset in another tab invalidates stale results. Concurrent browser tabs can still race between read and write because browser-local storage offers no cross-tab transaction. When writes fail, Story retains the session snapshot and shows a notice.

## Verification

Keep level IDs stable when retitling levels or revising a map. After tuning a wave, gear item, skill, difficulty, or track, regenerate the [gameplay reference](GAME-DESIGN.md). Use the [development guide](DEVELOPMENT.md) for browser and Pages checks and the [asset pipeline](ASSET-PIPELINE.md) for art, audio, and their sources.
