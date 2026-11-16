# Buss It Up! · Maintainer handoff

Updated 2026-11-16. This is the starting point for a new maintainer or AI agent. The game is a playable, six-area, single-player top-down shooter called *Buss It Up!*. The repository ships the editable sources and a complete offline game in [index.html](../index.html). The original Arcade mode was intentionally retired at the owner's request.

## First session

1. Read [AGENTS.md](../AGENTS.md), [TODO.md](../TODO.md), and the latest entries in the [changelog](../CHANGELOG.md). Inspect Git status and preserve existing work. Several source and asset files may appear as untracked until the campaign changes are committed.
2. Open [index.html](../index.html), choose **Start** or **Continue**, and use an empty slot for testing. Browser storage belongs to its origin. The downloaded file, a loopback server, and GitHub Pages have separate saves.
3. Use the [architecture map](ARCHITECTURE.md) to find the source for a mechanic. Use the [story design](design/STORY-CAMPAIGN.md) for the player experience and the [generated gameplay reference](GAME-DESIGN.md) for current data. [The implementation plan](plans/STORY-IMPLEMENTATION.md) is historical. The current code and active TODO take precedence.
4. For art and audio, start with the [asset pipeline](ASSET-PIPELINE.md). For references, start with the [lore ledger](design/LORE-RESEARCH.md). It distinguishes a creator upload, an archival trace, a fan label, and a game invention.
5. Edit source and build from the repo root. Keep `index.html` in the same change as its inputs. Regenerate reference tables after gameplay or track changes. [Development and publishing commands](DEVELOPMENT.md)

## Current design

- Story opens on an illustrated map. The arrows page by area. The first five maps can be previewed. Area six, its map marker, unrevealed Files, and its locked gear stay hidden until the 5-4 first clear. Each area has four main levels and one optional `N-X` branch unlocked by `N-2`. Level 4 closes each area with a boss. Preserve level IDs across retitles.
- Main levels have 4, 5, 5, 6, 6, or 6 rounds by area, including the ending round. Each X stage adds two timed rounds. Waves advance early when the active roster is defeated and all squads have deployed. The ordinary Final Wave deploys its stronger roster together. Each Boss round starts with two escorts. The campaign totals 172 rounds.
- Clear, No Hit, and Speed Clear medals accumulate across runs. The timer and medal target sit beside the score in combat. The map pairs the target with the best time after a clear. Targets use five-second steps, and qualifying current-rules records earn the medal. Time stops at the final kill. The save picker shows the furthest cleared main-route level. A boss rematch starts at the boss round and leaves progress and records intact.
- The former Nutmare baseline is the only combat ruleset. Preserve readable attack warnings and space to dodge as difficulty rises. Ambasing FM was the user's balance reference. They wanted stronger pressure in Areas 2, 5, and especially 6. Ambatron keeps the **Ambatron - Third Impact** name on transformation. The Burnt Server ends with **Satan’s PC - Harder and Dirtier**, an independent second phase with its own chassis, Files entry, and metal theme. The six monitor portraits also cycle behind the glass at half health, and the arena background goes black on defeat.
- Progression comes from equipment and skills. There are six gear slots and 50 items. Popper owns the volley pattern, speed, fire rate, and range. Nut Effect owns projectile properties such as splash, homing, and control. Burst, Boots, Vibe Guard, and Pendant each own a different part of the build. Keep effects mechanically distinct where possible. Bosses resist control. The **30-Buck Cameo** pendant is the only revive and triggers a full choir cue with a halo and wings. **Batu Khan's Revenge** clears shots and retaliates on every hit that damages the player.
- The radial tree has 32 nodes costing 1–3 SP. Dash runs from Ambatufish Sliders to Tentacle Transfer, Change for the Bus, and Last Flare. Signal runs from Ambasing Choir to Mas Amba Edit, Red Circle Lock, and Clean Plate. Nut Break sits under Second Serving in Vibe. First clears pay 1 SP, and boss and bonus first clears pay 2 SP, for 42 points across the route. Buying the whole tree would cost 57. Refunds are instant and preserve the rest of the save. Favor meaningful timing, mobility, and utility alongside damage, and check that proc-based gear cannot turn healing or mitigation into an easy tank build.
- The map shows area and level names. During combat the level name sits above the wave counter, and the background uses art without names. Keep the HUD compact. The three angled meters have flat fills and equal widths. Full Dash stays steady. Full Buss Burst pulses slowly with its **Buss Ready** label in a separate row below the streak. Use the shared display face at its native weight for pop-ups and readable colored banners. Warm hues warn of hostile space and cool hues identify player effects.
- Classy Stabilizer starts with two dashes. Charges refill one at a time at 135% of normal cooldown. The split blue meter eases to its new value in 60 ms. Stretch This keeps one charge and extends the dash by 55%.
- The first-level controls appear once per slot. Move with WASD/arrows, aim and fire with the pointer or fire with F, dash with Shift, Burst with Space, and pause with Esc or P. The touch stick moves, held POP auto-aims, and dedicated buttons Dash and Burst. The main campaign tabs are Map, Upgrades, Files, and Settings. Keep scrolling inside long subpanels at 16:9. Victory has one **Next** action back to the map.

## Making changes safely

| Task | Start here | Verify |
| --- | --- | --- |
| Add or tune a wave | `data.js` for authored squads, `missions.js` for parsing and surge rosters, `play.js` for scheduling and spawns | Both seeds, numbered-wave cadence, simultaneous Final Wave, timed bonus carryover, and sufficient room to dodge |
| Add an enemy or boss form | `foes.js`, `game.js`, `play.js`, and the drawing code in `render.js` and `campaign/art.js` | Silhouette, tell and hitbox, ordering and discovery in Files, map-six spoiler gating, safe paths on mobile |
| Add gear or a skill | `gear.js`, `combat.js`, `profile.js`, and `armory.js` | Ownership, sort order with bonus levels last, active versus equipped state, exact costs, stat readouts, effect interactions, migration |
| Change a map or HUD | `data.js`, `ui.js`, `shell.html`, styles, and `hud()` in `game.js` | Wide and narrow layouts, keyboard focus, touch, reduced motion, typography, and result or overlay transitions |
| Change music, voice, or art | [Asset pipeline](ASSET-PIPELINE.md) | Origin and license, browser audio checks or captures, actual listening for mix and loop seams, rebuilt offline HTML |
| Change progression or storage | `profile.js`, `menus.js`, `tests/browser/story.js` | Three independent slots, v1–v5 migration, purchase and replay, storage errors and stale results |

## What was verified

On November 16, 2026, Chrome completed all 30 levels and 172 rounds for seeds 1061 and 5133, offline and at the local Pages path. Each seed finished without retries and earned 29 Speed Clear medals, including 6-4 at 2:10.27 and 2:09.22 against its 2:55 target. The Story checks cover old saves, both dash charges and buffering, touch after pausing, the tenth-hit boss heal, and the final boss's phase-two health, three crack thresholds, and portrait cycle. Desktop captures confirmed the portraits and shatter. Human balance and physical touch still need validation.

The Story harness checks the six-map gate, area names, tiered purchases and refunds, legacy saves, two-phase boss logic, timed bonus wave carryover and speed medals, final deployment, and browser-simulated touch. Layout checks cover 1280 × 720 at 2× pixel density and HUDs at 390 and 320 px with the longest level label. Desktop captures include the map, Final Wave HUD, and skill tree, with a narrow map capture for comparison.

The muted audio harness decoded all 25 bundled assets, checked seven short edits, queue timing and repeat-event playback, and measured the full **Tappin Out** failure cue at 10.77 seconds. It also verified the revive cue, quiet button clicks, and uninterrupted campaign menu music. All 14 bundled voice clips were matched byte for byte to public soundboard copies on the same date. [Voice source ledger](ASSET-PIPELINE.md#voice-source-ledger)

## Still open

- Play the late route on keyboard and physical touch with more than one build. Prioritize 2-4, 5-X, 6-X, and both phases of 6-4. Check that the one-group Final Wave reads clearly and that overlapping bonus rosters leave readable dodge paths.
- Listen on speakers and headphones to track transitions, loop seams, combat speech under dense fire, the whole failure line, and the revive choir. Headless audio timing cannot judge intelligibility.
- Verify the live GitHub Pages deployment. The local HTTP test covers the project path. The expected project URL returned 404 on November 15, 2026.
- Saves assume one active play session per origin. Profile IDs protect against a stale result after a reset. Simultaneous read-and-write actions in two tabs can still race. Keep the v6 migration behavior intact unless a storage change is required.
- The release file is about 27.47 MB. Measure first-load behavior on a slow connection before adding large recordings. Confirm reuse terms for mirrored voice clips before broader redistribution. No verified recording of the exact Satan's PC line has been identified.
