# Buss It Up! internal game reference

This reference includes the full six-stage route and boss spoilers. It uses the game's 960 × 544 arena coordinates. Distances and speeds are in pixels and pixels per second. Times are in seconds and angles are in radians unless marked otherwise. The tables below come from [src/game.js](../src/game.js). Run `node docs/refresh-reference.mjs` after changing balance values, files, wave plans, or cue timings. The remaining sections describe the attack and scoring logic.

<!-- BEGIN GENERATED TABLES -->

## Player and difficulty

Starts with **100 Vibe**, **17 pop damage**, a **0.164 s** fire interval, **265 px/s** movement, **730 px/s** projectile speed, and **48%** Burst charge.

Dash speed is **785 px/s** for **0.17 s**, with a **1.48 s** cooldown and **0.14 s** input buffer. Each of the first **3** projectile contacts while dashing is worth **5 charge** and **25 points**. The dash removes all projectiles it intercepts.

A clean regular wave pays **240 + 80 × zero-based stage index** points and **10 charge**. Practice starts with **65%** charge, **+10** max Vibe per stage index, and divides the fire interval by **1 + 0.055 × stage index**.

| Mode | Enemy HP | Boss HP | Incoming damage | Enemy shot speed | Regular wave refill | Boss entry refill | Vibe drop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| arcade | 100% | 100% | 100% | 100% | 17% | 55% | 11.5% |
| chill | 72% | 76% | 53% | 82% | 28% | 72% | 19% |

## Stage progression

| Stage                | Regular waves | Enemy HP scale | Pop/Burst damage scale | Active cap Arcade / Chill | Boss                 | Boss radius | Boss HP Arcade / Chill | Practice power |
| -------------------- | ------------- | -------------- | ---------------------- | ------------------------- | -------------------- | ----------- | ---------------------- | -------------- |
| 1 · After Hours Gym  | 3             | 1.16           | 1                      | 9 / 7                     | The Lunk-Bot         | 35          | 3196 / 2429            | 1×             |
| 2 · Buss Terminal    | 3             | 1.69           | 1.23                   | 10 / 8                    | The Dreamybus        | 42          | 4318 / 3282            | 1.22×          |
| 3 · Ambatublow Club  | 4             | 3.38           | 1.55                   | 10 / 8                    | Sax Max              | 31          | 5100 / 3876            | 1.38×          |
| 4 · Omaygot Studio   | 4             | 4.26           | 1.94                   | 11 / 9                    | The Omaygot Director | 34          | 5780 / 4393            | 1.55×          |
| 5 · Ambatron Core    | 4             | 5.12           | 2.4                    | 11 / 9                    | Ambatron Prime       | 40          | 9180 / 6977            | 1.78×          |
| 6 · The Burnt Server | 4             | 6.3            | 3.05                   | 12 / 10                   | Satan’s PC           | 51          | 16592 / 12610          | 1.98×          |

Regular wave spawn times are seconds after the round begins. The first squad starts at 1.10 s in wave 1 and 0.58 s in later waves. Squads start 4.30 + 0.24 × wave number seconds apart, with an extra 0.24 s in the club. The nominal gap between bots is 0.16 s. The time range below is the earliest Arcade schedule. Deployments queue when the active cap is reached and are released one at a time after a slot opens. Boss summons use their own caps. The enemy numbers in the last two columns omit the E- prefix and list the squad members in spawn order.

| Stage.wave | Wave | Bots Arcade / Chill | First–last spawn, s | Arcade squads | Chill squads |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Ambatu Company Interview | 13 / 10 | 1.1–10.82 | 01 02 01 04 / 04 01 03 01 / 01 02 02 01 04 | 01 02 01 / 04 01 03 / 01 02 02 01 |
| 1.2 | Ambadonut Break | 13 / 10 | 0.58–10.78 | 02 01 04 01 / 01 03 05 02 / 02 02 01 04 03 | 02 01 04 / 01 03 05 / 02 02 01 04 |
| 1.3 | Wordington Anger | 21 / 17 | 0.58–16.44 | 01 04 01 03 05 / 03 05 02 02 01 / 02 01 04 03 01 / 03 01 02 01 04 01 | 01 04 01 03 / 03 05 02 02 / 02 01 04 03 / 03 01 02 01 04 |
| 2.1 | Thank Your Driver | 13 / 10 | 1.1–10.82 | 01 04 01 03 / 03 05 02 06 / 06 01 04 03 01 | 01 04 01 / 03 05 02 / 06 01 04 03 |
| 2.2 | Move Over! | 16 / 13 | 0.58–10.94 | 04 01 03 05 02 / 05 02 06 01 04 / 01 04 03 01 02 01 | 04 01 03 05 / 05 02 06 01 / 01 04 03 01 02 |
| 2.3 | Bus Edit Part 2 | 21 / 17 | 0.58–16.44 | 01 03 05 02 06 / 02 06 01 04 03 / 04 03 01 02 01 / 02 01 04 01 03 05 | 01 03 05 02 / 02 06 01 04 / 04 03 01 02 / 02 01 04 01 03 |
| 3.1 | I’m at the Club | 16 / 13 | 1.1–11.46 | 01 01 04 01 02 / 01 04 01 02 03 / 01 01 04 01 03 06 | 01 01 04 01 / 01 04 01 02 / 01 01 04 01 03 |
| 3.2 | Ambasing Choir | 16 / 13 | 0.58–11.42 | 01 02 01 04 05 / 01 01 04 03 06 / 01 04 01 03 02 05 | 01 02 01 04 / 01 01 04 03 / 01 04 01 03 02 |
| 3.3 | Paza Soundcheck | 21 / 17 | 0.58–17.16 | 01 01 04 03 02 / 01 04 01 05 06 / 01 01 04 02 03 / 01 04 01 03 05 06 | 01 01 04 03 / 01 04 01 05 / 01 01 04 02 / 01 04 01 03 05 |
| 3.4 | Thesis Night | 25 / 21 | 0.58–18.04 | 01 01 04 01 03 06 / 01 04 01 03 02 05 / 01 01 04 01 05 06 / 01 04 01 03 02 05 06 | 01 01 04 01 03 / 01 04 01 03 02 / 01 01 04 01 05 / 01 04 01 03 02 05 |
| 4.1 | Sleepy Dreamy | 19 / 13 | 1.1–11.14 | 05 02 06 01 04 03 / 01 04 03 01 02 01 / 01 02 01 04 01 03 05 | 05 02 06 01 / 01 04 03 01 / 01 02 01 04 01 |
| 4.2 | Candid Talk Pt. 3 | 19 / 13 | 0.58–11.1 | 02 06 01 04 03 01 / 04 03 01 02 01 04 / 02 01 04 01 03 05 02 | 02 06 01 04 / 04 03 01 02 / 02 01 04 01 03 |
| 4.3 | Evil Dreamy | 25 / 17 | 0.58–16.6 | 06 01 04 03 01 02 / 03 01 18 01 04 01 / 01 04 01 03 05 02 / 03 05 02 06 01 04 03 | 06 01 04 03 / 03 01 18 01 / 01 04 01 03 / 03 05 02 06 01 |
| 4.4 | The 30-Buck Cameo | 25 / 17 | 0.58–17.32 | 01 04 03 01 02 01 / 01 02 18 04 01 03 / 04 01 03 05 02 06 / 05 02 06 01 04 03 01 | 01 04 03 01 / 01 02 18 04 / 04 01 03 05 / 05 02 06 01 04 |
| 5.1 | Dreamybot Boot | 19 / 13 | 1.1–11.14 | 06 01 04 03 01 02 / 03 01 18 01 04 01 / 01 04 01 03 05 02 06 | 06 01 04 03 / 03 01 18 01 / 01 04 01 03 05 |
| 5.2 | Base Form | 22 / 16 | 0.58–11.26 | 01 04 03 01 02 01 04 / 01 02 18 04 01 03 05 / 04 01 03 05 02 06 01 04 | 01 04 03 01 02 / 01 02 18 04 01 / 04 01 03 05 02 06 |
| 5.3 | Terminator Red Circle | 29 / 21 | 0.58–16.76 | 04 03 01 02 01 04 01 / 02 01 04 01 03 05 02 / 01 03 05 02 06 01 04 / 02 06 01 04 03 01 02 01 | 04 03 01 02 01 / 02 01 04 01 03 / 01 03 05 02 06 / 02 06 01 04 03 01 |
| 5.4 | Mount Wordington | 36 / 26 | 0.58–22.74 | 03 01 02 01 04 01 03 / 01 04 01 03 05 02 06 / 03 05 02 06 01 04 03 / 06 01 04 03 01 02 01 / 03 01 02 01 04 01 03 05 | 03 01 02 01 04 / 01 04 01 03 05 / 03 05 02 06 01 / 06 01 04 03 01 / 03 01 02 01 04 01 |
| 6.1 | Going to Hell | 22 / 16 | 1.1–11.3 | 09 10 09 11 05 09 10 / 11 05 09 10 04 09 11 / 10 04 09 11 09 10 09 11 | 09 10 09 11 05 / 11 05 09 10 04 / 10 04 09 11 09 10 |
| 6.2 | Fever Dream | 22 / 16 | 0.58–11.26 | 10 09 11 05 09 10 04 / 05 09 10 04 09 11 09 / 04 09 11 09 10 09 11 05 | 10 09 11 05 09 / 05 09 10 04 09 / 04 09 11 09 10 09 |
| 6.3 | Wordington Gains Sentience | 29 / 21 | 0.58–16.76 | 09 11 05 09 10 04 09 / 09 10 04 09 11 09 10 / 09 11 09 10 09 11 05 / 10 09 11 05 09 10 04 09 | 09 11 05 09 10 / 09 10 04 09 11 / 09 11 09 10 09 / 10 09 11 05 09 10 |
| 6.4 | Fatal Encore | 33 / 25 | 0.58–17.64 | 11 05 09 10 04 09 11 09 / 10 04 09 11 09 10 09 11 / 11 09 10 09 11 05 09 10 / 09 11 05 09 10 04 09 11 09 | 11 05 09 10 04 09 / 10 04 09 11 09 10 / 11 09 10 09 11 05 / 09 11 05 09 10 04 09 |

## Enemy catalog

| File | Enemy                    | Base HP        | Base speed | Radius | Contact damage | Field note                                                                                                       |
| ---- | ------------------------ | -------------- | ---------- | ------ | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| E-01 | Bussiness Rep            | 32             | 131        | 13     | 12             | A night-shift regular. Runs straight at you and crowds the corners.                                              |
| E-02 | Transfer Clerk           | 40             | 90         | 15     | 12             | Circles you at midrange and tosses tickets. Expect a wider volley in later arenas.                               |
| E-03 | Classy Bouncer           | 78             | 70         | 21     | 19             | A slow, heavily padded bot with a very formal stance.                                                            |
| E-04 | Ambatufish               | 35             | 157        | 12     | 12             | Zigzags on fast skates like a fish on a line. Lead your shots.                                                   |
| E-05 | Ambatuexplode            | 62             | 104        | 17     | 12             | A pink dash line shows where this hothead is about to charge.                                                    |
| E-06 | Ambatusax Cabinet        | 48             | 77         | 16     | 12             | An amp on wheels. It drops rings of notes when it gets close.                                                    |
| E-07 | Base Form Pod            | See boss notes | —          | —      | —              | Orbits the Third Impact chassis. Shoot both pods to break its shield.                                            |
| E-08 | Ambatron // Third Impact | See boss notes | —          | —      | —              | Destroy both pods to clear the projectiles, restore Vibe, and expose the core.                                   |
| E-09 | Angelic Kam Choir        | 43             | 154        | 16     | 12             | A flying trio on one chassis. It swerves at you and sings a short fan of embers.                                 |
| E-10 | Sentient Pop-up          | 51             | 80         | 17     | 12             | Stops to paint a crosshair before it fires a long laser. Move off the line.                                      |
| E-11 | Wordington Firewall      | 91             | 68         | 22     | 24             | An armored tower that tries to hem you in with slow ember rings.                                                 |
| E-12 | The Lunk-Bot             | See boss notes | —          | —      | —              | Dash sideways when the Lunk-Bot lines up a charge.                                                               |
| E-13 | The Dreamybus            | See boss notes | —          | —      | —              | The bus announces its lane before each pass. Step out and pop it as it drives by.                                |
| E-14 | Sax Max                  | See boss notes | —          | —      | —              | Keep your distance and thread the gaps between notes.                                                            |
| E-15 | The Omaygot Director     | See boss notes | —          | —      | —              | Move out of the marked camera spots and clear the stunt doubles.                                                 |
| E-16 | Ambatron Prime           | See boss notes | —          | —      | —              | Watch for the beam markers. Save a Buss Burst to clear the spiral.                                               |
| E-17 | Satan’s PC               | See boss notes | —          | —      | —              | Get into the green safe lane. The chassis shrugs off shots until the screen glows OVERHEAT.                      |
| E-18 | Candid Camerabot         | 56             | 82         | 17     | 12             | A floating camera that projects two bright marks before the stage lights hit. Attack while it lines up the shot. |

These are the effective regular enemy HP values by stage, shown as Arcade / Chill. A value is listed for tuning even if the enemy does not spawn in that stage. Speed gains 5 px/s per zero-based stage index.

| Enemy | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| E-01 Bussiness Rep | 37 / 27 | 63 / 45 | 143 / 103 | 202 / 145 | 269 / 193 | 363 / 261 |
| E-02 Transfer Clerk | 46 / 33 | 78 / 56 | 178 / 128 | 252 / 182 | 336 / 242 | 454 / 327 |
| E-03 Classy Bouncer | 90 / 65 | 153 / 110 | 348 / 251 | 492 / 354 | 655 / 472 | 885 / 637 |
| E-04 Ambatufish | 41 / 29 | 69 / 49 | 156 / 112 | 221 / 159 | 294 / 212 | 397 / 286 |
| E-05 Ambatuexplode | 72 / 52 | 122 / 88 | 277 / 199 | 391 / 281 | 521 / 375 | 703 / 506 |
| E-06 Ambatusax Cabinet | 56 / 40 | 94 / 68 | 214 / 154 | 303 / 218 | 403 / 290 | 544 / 392 |
| E-09 Angelic Kam Choir | 50 / 36 | 84 / 61 | 192 / 138 | 271 / 195 | 361 / 260 | 488 / 351 |
| E-10 Sentient Pop-up | 59 / 43 | 100 / 72 | 228 / 164 | 322 / 232 | 428 / 308 | 578 / 416 |
| E-11 Wordington Firewall | 106 / 76 | 178 / 128 | 406 / 292 | 574 / 413 | 764 / 550 | 1032 / 743 |
| E-18 Candid Camerabot | 65 / 47 | 110 / 79 | 250 / 180 | 353 / 254 | 470 / 339 | 635 / 457 |

## Upgrade catalog

| File | Upgrade               | Rarity  | Max picks | Effect shown in game                                                            |
| ---- | --------------------- | ------- | --------- | ------------------------------------------------------------------------------- |
| U-01 | Bussiness Blend       | Common  | Uncapped  | +13% pop power                                                                  |
| U-02 | Triple Buss Ticket    | Common  | Uncapped  | +11% fire rate                                                                  |
| U-03 | Ambatufish Sliders    | Common  | 4         | +8% move speed                                                                  |
| U-04 | Ambadonut             | Common  | Uncapped  | +16 max Vibe and refill                                                         |
| U-05 | Classy Dreamy Edit    | Rare    | Uncapped  | +23% pop power                                                                  |
| U-06 | Ambatusax Solo        | Rare    | Uncapped  | +20% fire rate                                                                  |
| U-07 | Ambasing Choir        | Rare    | 2         | Two extra side pops at 34% power                                                |
| U-08 | Tentacle Transfer     | Rare    | 3         | 22% shorter dash cooldown                                                       |
| U-09 | Base Form Firmware    | Rare    | 2         | Pierce one extra bot and gain 9% power                                          |
| U-10 | Thesis Night Reverb   | Rare    | Uncapped  | Buss Burst hits 28% harder and charges faster                                   |
| U-11 | Amboutabass Echo Cast | Bussted | Uncapped  | Popped bots fire an echo bolt. Extra copies boost bolt damage.                  |
| U-12 | Thank Your Driver     | Bussted | 1         | Dash drops a transfer ticket that pops nearby bots.                             |
| U-13 | Thesis Night Finale   | Bussted | Uncapped  | Periodically launches a piercing fan. Extra copies make it more frequent.       |
| U-14 | 30-Buck Cameo         | Bussted | 1         | Once per stage, survive a wipeout and recover 42% Vibe.                         |
| U-15 | Ambatuexplode Encore  | Bussted | Uncapped  | Buss Burst leaves a second blast. Extra copies boost its power.                 |
| U-16 | Candid Cut            | Common  | 4         | Pops travel 16% faster and hit 6% harder.                                       |
| U-17 | Free Bird Request     | Rare    | 3         | +3 charge per shot dodged with a dash. Up to 3 dodges per dash.                 |
| U-18 | High Quality Rip      | Bussted | 1         | Each of the first 3 shots dodged per dash fires a piercing pop toward your aim. |

## Audio cue regions

Voice gain is relative to the game’s 0.48 master gain. Playback uses source seconds, so a 2 s region at 1.25× takes 1.6 s. The queue holds **2** pending lines for up to **8 s**. Priority 0 chatter is skipped if busy. Priority 1–3 lines can wait. If full, the oldest lowest-priority line gives up its place. Playing voice lines finish before the next one begins. Music ducks to 53% of its normal gain during a recording and resumes from its previous offset when unpaused.

| Cue         | Recording     | Start s | End s | Gain | Rate | Min spacing s | Queue priority |
| ----------- | ------------- | ------- | ----- | ---- | ---- | ------------- | -------------- |
| stageIntro  | way.mp3       | 1.28    | 5.16  | 0.48 | 1.02 | 1             | 1              |
| squad       | ambatubus.mp3 | 0.36    | 1.96  | 0.3  | 1.12 | 7             | 0              |
| enemyAttack | take.mp3      | 0       | 1.26  | 0.25 | 1.1  | 4.6           | 0              |
| down        | yek.mp3       | 0.63    | 1.88  | 0.3  | 1.19 | 1.8           | 0              |
| hurt        | like.mp3      | 4.84    | 6.37  | 0.44 | 1.03 | 4.5           | 0              |
| dash        | rtp.mp3       | 0.16    | 0.97  | 0.28 | 1.19 | 6             | 0              |
| burst       | buss.mp3      | 0.16    | 2.36  | 0.55 | 1    | 0             | 2              |
| fail        | tap.mp3       | 0.38    | 4.7   | 0.49 | 1    | 0             | 3              |
| bossIntro   | insane.mp3    | 0       | 1.74  | 0.49 | 0.97 | 3             | 2              |
| transform   | blow.mp3      | 0.11    | 1.92  | 0.56 | 0.94 | 0             | 3              |
| bossDown    | dies.mp3      | 0.78    | 3.68  | 0.46 | 1.04 | 1             | 3              |
| clear       | paza.mp3      | 0       | 1.23  | 0.33 | 1.08 | 2.5           | 0              |
| pick        | acting.mp3    | 0.74    | 1.74  | 0.38 | 1.05 | 1             | 0              |
| jackpot     | choir.mp3     | 0       | 2.92  | 0.45 | 1.05 | 1             | 1              |
| reveal      | way.mp3       | 1.29    | 5.16  | 0.52 | 0.92 | 0             | 3              |
| hellEntry   | choir.mp3     | 0.04    | 3.56  | 0.49 | 0.93 | 0             | 2              |
| overload    | insane.mp3    | 1.94    | 6.44  | 0.48 | 0.94 | 0             | 2              |
| victory     | paza.mp3      | 1.31    | 3.04  | 0.48 | 0.98 | 0             | 3              |

| Music file | Loop gain before ducking |
| --- | --- |
| tour.ogg | 0.17 |
| castle.ogg | 0.14 |
| boss.ogg | 0.11 |
| climax.ogg | 0.11 |

<!-- END GENERATED TABLES -->

## Tour and controls

- The simulation ticks at 90 Hz. The actor-center bounds are x = 32–928 and y = 69–505, inset by the actor's radius. The player starts each stage at (480, 397) with radius 15, 0.40 s of invulnerability, full Vibe, and at least 48% Burst charge.
- WASD and arrows move. Mouse aims, and the primary mouse button or F fires. Shift dashes in the movement direction or along aim while standing still. Space fires Buss Burst at 100% charge. Escape or P pauses. Touch provides a stick plus Pop, Dash, and Buss. Pop auto-aims at the closest active enemy.
- Enemy spawns try up to 20 edge points more than 205 px from the player. Top and bottom points have x = 92–868 and y = 94 or 472. Side points have x = 64 or 896 and y = 125–445. The fallback is x = 88 on the player's left or x = 872 on the right, y = 110. Standard bots materialize in 0.42 s and bosses in 1.22 s. The starting attack cooldown is randomly 0.65–1.75 s for bots and 0.53 s after a boss materializes.
- Every stage offers one upgrade after regular wave 2 and one after the boss. The final reward still appears before the run report. The three card slots independently roll 60% Common, 30% Rare, and 10% Bussted. Eligible cards of the rolled rarity have equal odds within that slot. A card can appear only once in an offer. Encore can replace one offer per run, with the same odds and no extra pick. Cards enter Files when offered and enemy files enter it when encountered. Numbers follow the catalog order and are independent of discovery order.
- The first five stops are listed at the start. Their titles unlock on entry and the Burnt Server appears only after Ambatron is defeated. Campaign checkpoints store Vibe capacity, upgrades, score, difficulty, and statistics at the start of each stage. Retry restarts that stage from the saved build. Browser-local records also include high score, map discoveries, and Files entries.
- Boss Practice unlocks on encounter. Ambatron Phase II has its own entry after the first transformation. Practice uses the loadout in the tables above and the selected difficulty. Practice leaves the campaign checkpoint, score record, and stage unlocks untouched. Boss and enemy discoveries count as encounters in either mode.

## Damage, recovery, and scoring

| Mechanic     | Exact rule                                                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Player shot  | Radius 5, fired 26 px forward, lifespan 1.28 s, aim jitter −0.027 to +0.027. Pop power is player damage × stage scale. The normal shot stops on the first valid hit, with one additional hit per pierce.                                                |
| Hostile shot | Radius 6, or 7 for notes. Lifespan 6 s. Chill multiplies the listed speed by 0.82. A fan uses the listed angle between shots and is centered on aim. Ring bullets are evenly spaced around 2π. Ring damage is 13 unless specified.                      |
| Player hit   | Rounds base damage × difficulty multiplier. Grants 0.72 s of invulnerability and resets the streak. A dash is invulnerable and consumes projectile contacts. A floor or laser hit during a dash awards no Close Call charge.                            |
| Burst        | 330 px reach and 49.5° to each side of aim. Targets behind the player are outside the cone. Removes projectiles in the cone. Does 86 damage to bots or 245 to bosses, × stage power × (1 + 0.28 × Reverb copies). The visual lasts 0.46 s.              |
| Charge       | Regular bot pop gives 7 + 2 × Reverb copies. A boss pop gives 31. The first scoring hit of each projectile on a boss gives 1.6 + 0.24 × Reverb copies. All charge is capped at 100.                                                                     |
| Vibe pickup  | Restores 19 Vibe. Lasts 9 s, attracts inside 80 px at 180 px/s, and is collected inside 24 px. See mode table for drop odds. Wave and boss entry refills are fractions of max Vibe and cap at max.                                                      |
| Score        | Each bot pop is worth 100, a Classy Bouncer 160, and a boss 1,000 before streak multiplier. Streak window is 2.1 s between pops. Multiplier = min(5, 1 + floor((streak − 1) / 3)). Boss rounds pay another 5 × ceiling(remaining Vibe) after the clear. |
| Close Call   | Removes the projectile and grants the listed reward for the first three contacts of that dash. Reflected pops count as player shots. A single piercing shot counts at most once toward accuracy.                                                        |
| Clean Wave   | Any regular wave cleared without losing Vibe qualifies. A prevented hit during a dash or invulnerability window preserves it. Bonus is awarded once per wave.                                                                                           |
| Wave clear   | Removes remaining hostile shots and floor hazards. Standard rounds pause 0.86 s before moving on. Boss rounds pause 1.28 s.                                                                                                                             |

## Regular enemy attacks

All regular enemies have the contact damage in the generated catalog. Bots slow to 36% of normal movement while winding up a ranged shot. Those windups lock aim before release. A Sentient Pop-up or Camerabot cancels its own warning zones if it is popped before the attack activates.

| File | Attack and movement tuning |
| --- | --- |
| E-01 Bussiness Rep | Direct chase. |
| E-02 Transfer Clerk | Orbits at 151–252 px with tangent factor 0.55. Attack range 440, windup 0.31, rest 1.45–2.30 minus 0.08 × stage index. Fires 1 ticket in stages 1–2 or 3 tickets from stage 3. Spread 0.15, speed 243 + 10 × stage index, damage 12. |
| E-03 Classy Bouncer | Direct chase at the slow speed in its table. Armored HP and 19 contact damage. |
| E-04 Ambatufish | Chase angle oscillates by up to 0.74 rad. Visual/steer phase advances 16 rad/s and the steering sine uses phase × 0.57. |
| E-05 Ambatuexplode | Starts a lunge within 265 px. Windup 0.52, charge lasts 0.42 at speed 420, charge damage 18. Cooldown random 1.3–1.8 before the next windup. |
| E-06 Ambatusax Cabinet | Orbits at 151–218 px with tangent factor 0.55. Range 375, windup 0.42, rest 2.10–2.80. Ring of 8 notes at speed 171 and damage 13, offset by animation phase × 0.25. |
| E-07 Base Form Pod | Ambatron Phase II only. Two pods. Each has 1,460 Arcade or 960 Chill HP, radius 15, and no contact damage. Orbit radii 114 × 83. Shield and attack contribution are in the Ambatron section. |
| E-08 Ambatron Phase II | See boss section. |
| E-09 Angelic Kam Choir | Sways up to 0.92 rad from chase angle. Range 350, windup 0.33, rest 2.25–3.05. Fan of 4 embers at spread 0.27, speed 193, damage 15. |
| E-10 Sentient Pop-up | Approaches outside 245 px, backs away inside 177 px, and holds between. Range 440. Laser width 24, delay 0.82, active 0.37, damage 18. Holds position through its windup. Rest 3.20–4.20. |
| E-11 Wordington Firewall | Direct chase. Range 420, windup 0.48, rest 3.00–3.75. Ring of 10 embers at speed 145 and damage 13. |
| E-18 Candid Camerabot | Same range control as Pop-up. At ≤440 px, focuses for 0.87 s and marks the player's snapshot with radius 47, delay 0.87, damage 16. The second mark is 91 px to a flank, radius 43, delay 1.12, damage 14. Each spot is active 0.34. Rest 3.40–4.40. First appears in Studio wave 3. |

## Perk formulas

- Stat multipliers in the upgrade catalog apply multiplicatively to the current value. Fire rate multipliers divide the fire interval. Ambadonut adds 16 to max Vibe and immediately refills. Base Form Firmware adds one pierce and multiplies shot power by 1.09.
- Ambasing Choir adds side shots at ±0.16 rad per stack index. Each side shot has 34% of the main shot power. Thesis Night Finale adds 7 shots at −0.48 to +0.48 rad in 0.16 rad steps, at 95% power with two additional pierces, every max(3, 8 − copies) volleys.
- Amboutabass Echo Cast sends one shot to the closest remaining active enemy within 330 px of a defeated bot. Echo damage is pop power × (0.90 + 0.24 × copies). It has no extra pierce.
- Thank Your Driver leaves a mine at the dash origin. Its delay is 0.32 s, radius 88, and damage 3.1 × pop power. Ambatuexplode Encore leaves a radius-102 blast 265 px along aim, clamped to x = 48–912 and y = 85–489. It triggers after 0.35 s and deals (76 + 22 × copies) × stage scale × Reverb multiplier. Both erase hostile shots in their blast circles.
- 30-Buck Cameo revives at ceiling(42% max Vibe) with 1.65 s invulnerability once per stage. Free Bird Request adds 3 charge per copy to each rewarded Close Call. High Quality Rip fires a 130% pop-power shot 16 px forward along aim for each rewarded Close Call and adds one pierce.

## Boss patterns

Boss cooldowns below start when the attack is selected and include any listed windup unless otherwise stated. Angles track the player when the warning or salvo begins. Ground spots remain live 0.34 s, arena lanes 0.36 s, and directed aim beams 0.37 s unless specified. Standard boss contact is 20, Sax Max contact is 17, and an active charge is 26. Vibe lost from all these attacks is adjusted by the selected difficulty.

### E-12 The Lunk-Bot

- Pursues at 70 px/s when farther than 102 px, with a heading sway of up to 0.54 rad.
- Pattern order is charge, fan, charge, slam. Charge warning is 70 px wide and 540 px long with a 0.78 s tell. Physical lunge is 675 px/s for 0.58 s. Cooldown is 2.12 s, or 1.68 s below 50% HP. The late charge adds a width-43 aim beam offset by ±0.47 rad, delay 0.99, damage 16.
- Fan sends 7 plates or 9 below 50% HP, with spread 0.23, speed 246, damage 15, cooldown 1.15. Slam adds a ring of 12 or 17 plates at speed 170 and a targeted radius-60 or radius-81 spot with a 0.81 s tell and 20 damage. Slam cooldown 1.34.

### E-13 The Dreamybus

- Pursues at 70 px/s outside 230 px between charges. Its four-part rotation is lane charge, fan, vertical lane charge, lane charge. Direction flips on the k modulo 3 schedule. The fan fires 9 or 13 tickets below 50% HP, spread 0.22, speed 231, damage 13, cooldown 1.35.
- Horizontal lane center clamps to y = 153–434, width 101, run speed 727, duration 1.19 s. Vertical center clamps to x = 148–812, width 103, run speed 725, duration 0.58 s. Both show a 0.87 s warning and deal contact damage during the pass. The exit ring fires 12 or 17 tickets at speed 142 and offset π/12.
- The last lane in every cycle, and all lanes below 50% HP, add a ghost lane. Its center is 108 px horizontally across the y-axis or 166 px vertically across the x-axis from the first lane, toward the center. Width 74, tell 1.03, damage 18. Lane cooldown 2.57 normally or 2.19 late.

### E-14 Sax Max

- Moves at 83 px/s around a target at (480 + 248 × sin(0.77t), 267 + 128 × cos(0.90t)). Contact does 17. Below 50% HP, uses the late counts in the patterns below.
- **Double ring.** 0.46 s tell. Outer ring has 16 or 20 notes at 164 px/s and inner ring has 10 at 101 px/s. Damage 12. Cooldown 1.70 or 1.40.
- **Duet.** 0.46 s tell, with a marked corner speaker. The speaker's fan has 6 or 8 notes at speed 190 and spread 0.235. The boss fan has 6 notes at speed 241 and spread 0.20. All notes deal 12. Cooldown 1.59.
- **Floor beat.** Snapshots the player's y at x = 240, 480, and 720. Spots have radius 58 or 72, delay 1.02, damage 17. A 13-note ring at speed 126 accompanies the warning and deals 12. Cooldown 1.72.

### E-15 The Omaygot Director

- Moves at 92 px/s toward the player's reflected position, with x clamped to 174–786 and y to 138–408. The cycle is spotlight cluster, stunt doubles, crossing lanes.
- **Spotlights.** Main spot radius 75, delay 0.87, damage 21. Four outer spots, or five below 50% HP, form a radius-155 × 137 ellipse before arena clamping. Outer spot radius 62, delay 1.02 + 0.08 × spot index, damage 18. Cooldown 1.88 or 1.68.
- **Stunt doubles.** Spawns 2 or 3 Ambatufish, capped so boss and adds total at most 6. They materialize in 0.60 s. Fires 8 shots at speed 239, spread 0.23, damage 13. Cooldown 1.45.
- **Crossing lanes.** Width 59, one x-lane with 0.86 delay and one y-lane with 0.99 delay, both damage 21. Cooldown 1.65.

### E-16 Ambatron Prime and E-08 Third Impact

- First form moves at 112 px/s around (480 + 205 × sin(0.53t), 214 + 80 × sin(1.06t)). Its three attacks are lanes, rings, and fan. Lanes number 2 or 3 under 50% HP, width 50, delays 0.78 + 0.11 × lane index, damage 22, cooldown 1.52. Offset lanes sit at x − 132 / x + 150 or y + 99 / y − 106 before clamping.
- The first form's rings have 17 and 12 bullets or 22 and 16 late, speeds 199 and 119, damage 13, cooldown 1.30 or 1.24. Its fan has 9 or 13 bullets, spread 0.14, speed 279, damage 13, cooldown 1.17 or 1.30. The late fan adds a 0.27 s tell and summons one Bouncer every other volley if fewer than three enemies remain. The Bouncer materializes in 0.59 s.
- At zero HP, a 2.40 s invulnerable transformation creates a new bar of round(82% of the first bar), which is **7,528 Arcade / 5,721 Chill**. Radius grows to 52. The player regains 53% of max Vibe in Arcade or 72% in Chill, capped at max, and receives 100% Burst charge. Both pods reduce incoming core damage to 32% while at least one survives. Destroying the second clears hostile shots, grants at least 0.8 s invulnerability, and restores 34% max Vibe.
- **Five beams.** Aim offsets −0.92, −0.46, 0, 0.46, 0.92. Width 49, delay 0.76 s for center, +0.14 s per step outward, damage 29. Cooldown 1.65.
- **Plasma rings.** Each live pod sends 16 shots at 158 px/s. Core sends rings of 23 at 222 px/s and 15 at 114 px/s. Damage 13. Cooldown 1.42.
- **Spot cluster.** Center radius 86, delay 0.78, damage 28. Two radius-77 spots offset by (±137, ±90) with 1.01 s tells. Two radius-69 spots offset by (±147, ∓106) with 1.22 s tells. Both outer pairs do 24. Cooldown 1.58.
- **Crossing cage.** Width-66 vertical lane and width-64 horizontal lane at the player snap, delays 0.79 and 0.94, damage 30 and 29. Two vertical side lanes at ±124, width 49, delay 1.17, damage 25. Cooldown 1.70.
- **Fans and backup.** Each live pod sends 7 shots with spread 0.19 at 290 px/s. Core sends 11 with spread 0.18 at 265 px/s. Damage 17. Summons one Charger or Cabinet if fewer than five enemies remain. Cooldown 1.05.
- Phase II pursues its moving target at 116 px/s. Target oscillation is ±216 x and ±113 y around (480, 278), driven by walk phase × 0.093 and × 0.16. Walk phase advances 8 rad/s. Pod orbit phase uses walk phase × 0.24 and a π offset for the second pod.

### E-17 Satan’s PC

- Moves at 108 px/s toward (480 + 238 × sin(0.47t), 232 + 74 × cos(0.72t)). The x frequency increases to 0.64 below 34% HP. Pattern intensity rises below 70%, then again below 34%. Contact damage is 20.
- Outside Overheat, takes 48% damage in Arcade or 66% in Chill. While green, takes 165% damage. Overheat occurs during the safe lane and floor-cluster patterns.
- **Quarantine lanes.** Blocks both sides of a safe lane. The safe lane is 154 px wide, or 116 px below 34% HP. Its center is shifted 104 px from the player before clamping. Warning is 1.07 s normally or 0.96 late. Damage 35. Overheat lasts 1.94 or 1.22. Cooldown 2.08.
- **Three fans.** Core sends 13 or 17 embers below 34%, spread 0.16, speed 234, damage 20. Two emitters at (70, 106) and (890, 435) send 5 or 8 below 70%, spread 0.21, speed 178, damage 17. Cooldown 1.75 or 1.46.
- **Firewall.** A screen-edge wall leaves a gap of ±80 px around the snapshot, or ±68 late. Shots are spaced by 33 px or 26 late, travel at 183 or 205, and deal 20. The core also sends a ring of 15 or 21 below 70% at speed 148, damage 13. Cooldown 1.83 or 1.52 below 34%.
- **Floor cluster.** Main radius 78 or 96 below 34%, delay 0.77, damage 30. Four marks form a 154 × 122 ellipse with offset angle 0.44. Their radius is 57 or 71 below 70%, delay 0.93 + 0.08 × mark index, damage 24. Below 70%, adds width-44 beam at +0.38 rad, delay 1.21, damage 26. Overheat 1.80 or 1.26 below 34%, cooldown 2.00.
- **Beam fan.** Three beams at −0.65, 0, +0.65 rad. Width 40 or 55 late, delay 0.82 + 0.30 × absolute offset, damage 29. Ring of 18 or 24 below 70% at speed 124, damage 13. Spawns one Choir or, below 34%, one Pop-up when fewer than three enemies remain. Its spawn warning lasts 0.66. Cooldown 1.89.

## Design references

- Readable dodges and projectile clearing draw on Dave Crooks's description of the dodge-roll and table-flip mechanics in *Enter the Gungeon*. The Close Call reward applies that idea to this game's dash. [Developer interview](https://www.gamedeveloper.com/design/q-a-the-guns-and-dungeons-of-i-enter-the-gungeon-i-)
- The explicit tells and distinct recovery windows follow the kind of enemy telegraph tuning Supergiant documented for *Hades*. [Supergiant patch notes](https://www.supergiantgames.com/blog/hades-updates/)
- Recoil, hit deformation, and small impact effects follow Jan Willem Nijman's examples of making actions readable through animation and feedback. [The Art of Screenshake](https://www.youtube.com/watch?v=AJdEqssNZ-U)
- The dark cabinet preserves the thick ink outlines and bright color accents of the previous *Hi-Fi RUSH*-inspired design. [Visual reference](https://news.xbox.com/en-us/2023/01/25/hi-fi-rush-preview-out-now-hands-on/)
