# Buss It Up! · Story design

Revised 2026-11-16. The campaign is a fictional clean slate for Dreamy. He is clearing out the old clips and their copies before opening a new chapter. The gym, terminal, broadcast booth, edit suite, assembly floor, and backup server mark different stops in the life of those clips. Keep the motivation in props, filenames, and short observations. The check-in camera, unsolicited subtitles, and closing color swatches carry the thread. [Lore ledger](LORE-RESEARCH.md) [Gameplay reference](../GAME-DESIGN.md)

## Maps and campaign route

Left and right arrows page through illustrated area maps. A map has four main levels and one side level. Clear level two to unlock both level three and the side level. A side clear grants its own gear and two skill points, then returns the player to the main route. Clear each area's fourth level to advance. The first five areas can be previewed. The sixth map and its position marker appear after 5-4.

The level selection map shows the area name in its header and level names on the nodes and in the fixed-height launch card. The card shows first-clear rewards and medals. After a clear it pairs the recorded best time with the Speed Clear target. During play, the top HUD shows the level name above the wave counter, plus an attempt timer and medal target beside the score. The arena background omits area and level titles.

| Area | Main rounds per level | Bonus rounds | Optional bonus level | Side reward |
| --- | --- | --- | --- | --- |
| Bussiness Gym | 4 | 6 | 1-X: Wash That | Nut Cracker and Ambalien Goo |
| Bus Bus Terminal | 5 | 7 | 2-X: Self Pleasure | Night Return and YEK Circuit |
| Ambasing FM | 5 | 7 | 3-X: At The Club | Bootleg Overdub and Paza Runners |
| Omaygot Edit Suite | 6 | 8 | 4-X: Cream Factory | Censor Bar and Coldest Moment |
| Ngawi Assembly | 6 | 8 | 5-X: Nut Tree | Red Tag Guard and Batu Khan's Revenge |
| The Burnt Server | 6 | 8 | 6-X: The Nail Theory | I Need That Nut |

## Combat

The 30 levels have 172 rounds, including 24 Final Waves and six boss rounds. A **Final Wave** deploys its entire roster in one group after the round begins. Main-route surges have nine to twelve bots, with two extra enemies in each bonus surge. The ending **Boss** round adds two escorts to the area's boss. The two ending labels appear without a numeric total. Main-route numbered waves show **WAVE CLEAR** before advancing. Numbered rounds combine compass-side entries and alternating flanks with area specialists. Returning Bussiness Reps feint, Terminal clerks curve their tickets, and later Bouncers telegraph shield shoves. Warm marks indicate enemy hazards. Player blasts and projectile effects use cool colors.

The single ruleset uses the former Nutmare baseline. The District gets a modest increase. The Terminal gets stronger bots and quicker reinforcements. Ambasing FM keeps its ordinary damage and recovery baseline. Omaygot hits harder, Ngawi has tougher bots, and the Burnt Server adds stronger fire and alternating targeted firewall lanes. Side levels deploy squads and hazards faster and add 20% bot HP and 8% bot speed. They raise incoming damage by 14%, or 7% on the Burnt Server’s already tougher baseline. The 6-X firewall waits when seven or more bots are active so a full deployment leaves room to dodge.

The next bonus wave starts as soon as the current roster is defeated. If the deployment queue is empty and the timer expires first, surviving enemies, shots, and hazards carry into the next wave. The same rule starts the bonus Final Wave. To finish, clear its roster and all enemies carried over from earlier waves.

The enemy work drew on *The Binding of Isaac: Rebirth* and *Repentance*, especially the use of distinct movement rules and readable attack windows to distinguish enemies at a glance. The specialists use original vector art and campaign-specific attack combinations. [Repentance development updates](https://store.steampowered.com/news/posts/?appids=250900&enddate=1611951807&feed=steam_community_announcements)

The first attempt shows the controls. The arena preserves its 960 × 544 playing coordinates and redraws at the screen's pixel density. The angled meters have solid fills and a shared width, with thicker Vibe and thinner Dash and Burst. Full Dash stays steady. Full Burst and its **Buss Ready** label pulse together. The streak sits above the readiness label to the right of the meters. Distinct banner colors identify waves, clears, and the final round. Banners and kill captions use the same display stack as the Upgrades heading. Captions include **Popped!**, **Bussed!**, and **Nutted!**. Loss results play the full Tappin Out line. The 30-Buck Cameo revive plays the heavenly choir over a gold halo and wings.

Satan’s PC becomes **Satan’s PC - Harder and Dirtier** when its first bar empties. The second chassis has 124.8% of the opening form’s HP, faster attacks, five patterns, and its own Files entry. The transition restores at least 56% Vibe. Graphic arrows mark the safe paths, and an orange ring telegraphs the double ember volley. The monitor cycles through six Dreamybull portraits during its attacks. The background cracks and glitches at 75%, 50%, and 25% health on the second bar, then shatters around a final explosion. Ambatron becomes **Ambatron - Third Impact** on transformation. The other bosses retain their names throughout the fight. All opening bars are longer, and Burst damage against bosses is lower.

## Builds

An ordinary first clear grants one skill point. Boss and bonus first clears grant two. Specific levels also unlock gear, shown with its equipment icon and slot color in the first-clear rewards. Equipment cards show `???` until the item is unlocked. The six equipped items and purchased skills apply at the start of an attempt.

| Slot | Items | New effect examples |
| --- | --- | --- |
| Popper | 10 | Patterns, fire rate, and range. Reverse Playback favors its backward shot. Eight-Way Cut fires in eight fixed directions. Nut Cracker spreads five close-range pellets. |
| Nut Effect | 8 | Mix projectile slow, periodic stun, poison, splash, piercing, homing, or ricochet into a Popper build. |
| Buss Burst | 8 | Six-Point Signal covers a large hexagram around the player. Censor Bar rewards erasing three hostile shots with knockback and 1.0 s of protection. |
| Boots | 8 | Classy Stabilizer stores two dashes with slower sequential reloads. Stretch This extends dash duration. Paza Runners reset dash cooldown on bot pops. |
| Vibe Guard | 8 | Breakaway Jacket blocks the first projectile in each wave. Spam Filter clears nearby shots when hit. |
| Pendant | 8 | Coldest Moment freezes the arena on Burst. Batu Khan's Revenge clears hostile shots, retaliates at 2× pop power, and gives 5% Burst charge on every damaging hit. 30-Buck Cameo supplies the sole revive. |

The left column groups nine build stats, including nominal shot range and base Burst damage. Pop power has a fixed-height row with right-aligned values. Multishot weapons show damage and count for each damage group. Overdrive shows its ordinary and fan volleys. Equipment is sorted by unlock level, with each bonus after the main route. The 32 nodes cost one to three points, with 42 points available from a full campaign and 57 needed for the entire tree. Double-click a node or use its purchase button. Refund skills restores all spent points immediately and keeps the loadout. Dash healing and Burst healing are smaller, and passive damage reduction has a cap. Bosses take half the strength and duration of slows. A stun becomes a 70% slow for half its duration. Coldest Moment freezes regular enemies for five seconds and heavily slows bosses for 2.5 seconds.

## Menus, medals, and saves

**Files** reveals enemies upon encounter and groups them by first appearance. **Settings** manages sound, combat voices, and New Story. The map music continues across all four campaign tabs. Long lists scroll inside their panels. Win results show the clear time, medal target, score, medals, and first-clear rewards.

The trophy is **Clear**, the shield is **No Hit**, and the stopwatch is **Speed Clear**. Finish within the five-second-step target to earn it. The clock stops on the final enemy’s lethal hit. Existing nonlegacy records that satisfy the relaxed targets count. Medals accumulate across replays. Cleared finales support boss-only rematches without changing Story progress or records.

Choose one of three slots. Each shows the furthest main-route level cleared. Optional stages and replays leave that summary in place. Change slots or start over from Settings. Existing saves carry forward with the new point budget. If older purchases cost more than the new budget, the skill points are refunded. Previous-rules records remain visible until the level is cleared under the current rules.

Existing saves appear in Slot 1. Compatible progress carries forward. Version 6 retires old Remix medals and preserves Clear and No Hit. The other two slots start empty.
