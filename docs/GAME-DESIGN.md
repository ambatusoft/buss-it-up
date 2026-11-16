# Buss It Up! gameplay reference

Updated 2026-11-14. This file contains full-route and boss spoilers. Numerical tables come from the game data and formulas. Regenerate them with `node scripts/refresh-reference.mjs`.

<!-- BEGIN GENERATED TABLES -->

## Player and combat tuning

Starts with 100 Vibe, 17 pop power, 0.164 s per volley, 934 px shot range, 265 px/s movement, 40% charge, and 86 base Burst damage. A hit grants 1 s of protection. Dash starts at 785 px/s for 0.17 s with a 1.48 s cooldown. A dash can award one Close Call for 5 charge and 25 points before build modifiers.

| Bot HP | Boss HP | Incoming damage | Shot speed | Wave heal | Boss heal | Vibe drop |
| --- | --- | --- | --- | --- | --- | --- |
| 126% | 122% | 136% | 115% | 12% | 43% | 9% |

Regular waves apply these area multipliers on top of the campaign rules. Deployment and hazard columns scale the time between events.

| Area | Bot HP | Damage | Shot speed | Wave recovery | Deployment | Hazard timing |
| --- | --- | --- | --- | --- | --- | --- |
| Bussiness Gym | 106% | 104% | 100% | 100% | 97% | 100% |
| Bus Bus Terminal | 121% | 117% | 105.5% | 86% | 87% | 82% |
| Ambasing FM | 100% | 100% | 100% | 100% | 100% | 100% |
| Omaygot Edit Suite | 100% | 117% | 102.5% | 85% | 100% | 94% |
| Ngawi Assembly | 119% | 112% | 104.5% | 81% | 94% | 90% |
| The Burnt Server | 128% | 124% | 108.5% | 71% | 86% | 76% |

## Route and bosses

| Area | Levels (total rounds) | Boss | Opening boss HP | Opening escorts | Deployment cap | Area music | Boss music |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Bussiness Gym | 1-1: Ambatu Interview (4), 1-2: Ambadonut Break (4), 1-3: YEK! (4), 1-4: Stand on Bussiness (4), 1-X: Wash That (6, side) | Bussiness Rep XL | 3314 | stamper, stapler | 10 | Chase! | 8bit Action Miniboss Battle |
| Bus Bus Terminal | 2-1: Thank Your Driver (5), 2-2: Tentacle Crossing (5), 2-3: Move Over! (5), 2-4: Ambatubus (5), 2-X: Self Pleasure (7, side) | The Dreamybus | 5215 | headlight, faregate | 12 | Darkness Road | Hard Boss Battle 1 |
| Ambasing FM | 3-1: Paza (5), 3-2: Dreamyfantasia (5), 3-3: Poké Flute Rip (5), 3-4: Thesis Night (5), 3-X: At The Club (7, side) | Ambatusax | 6035 | tuningfork, choir | 11 | Chiptune Battle Music | Urban Boss Battle |
| Omaygot Edit Suite | 4-1: Sleepy Edit (6), 4-2: Candid Talk Pt. 3 (6), 4-3: Classy Cut (6), 4-4: Going Insane (6), 4-X: Cream Factory (8, side) | Evil Dreamy | 6629 | clapper, lighting | 12 | Hard Battle 1 | Trance Boss Battle |
| Ngawi Assembly | 5-1: Sungut Lele (6), 5-2: Terminator Red Circle (6), 5-3: Mas Amba Protocol (6), 5-4: Level 99 (6), 5-X: Nut Tree (8, side) | Ambatron → Ambatron - Third Impact | 7280 | induction, cutter | 13 | Hard Battle 2 | Heavy Boss Battle 1 |
| The Burnt Server | 6-1: I'm Going to Hell (6), 6-2: Gains Sentience (6), 6-3: I Can Tell You're Hungry (6), 6-4: Rate This PC (6), 6-X: The Nail Theory (8, side) | Satan’s PC → Satan’s PC - Harder and Dirtier | 17408 | firewall, backup | 15 | Infinite Darkness | Raiders March |

## Speed Clear targets

Earn the medal by clearing within the listed attempt time. Bonus waves advance immediately on a clear, or after the listed interval if the deployment queue is empty. Live threats carry over when time expires.

| Level | Target | Bonus wave deadlines (s) |
| --- | --- | --- |
| 1-1: Ambatu Interview | 0:45 | — |
| 1-2: Ambadonut Break | 0:50 | — |
| 1-3: YEK! | 0:45 | — |
| 1-4: Stand on Bussiness | 1:10 | — |
| 1-X: Wash That | 1:20 | 11 / 12 / 12 / 12 / 12 |
| 2-1: Thank Your Driver | 1:00 | — |
| 2-2: Tentacle Crossing | 1:00 | — |
| 2-3: Move Over! | 0:55 | — |
| 2-4: Ambatubus | 1:20 | — |
| 2-X: Self Pleasure | 1:40 | 12 / 13 / 13 / 13 / 13 / 13 |
| 3-1: Paza | 1:10 | — |
| 3-2: Dreamyfantasia | 1:10 | — |
| 3-3: Poké Flute Rip | 1:05 | — |
| 3-4: Thesis Night | 1:25 | — |
| 3-X: At The Club | 1:40 | 12 / 13 / 13 / 13 / 13 / 13 |
| 4-1: Sleepy Edit | 1:20 | — |
| 4-2: Candid Talk Pt. 3 | 1:25 | — |
| 4-3: Classy Cut | 1:15 | — |
| 4-4: Going Insane | 1:35 | — |
| 4-X: Cream Factory | 1:55 | 12 / 13 / 13 / 13 / 13 / 13 / 13 |
| 5-1: Sungut Lele | 1:40 | — |
| 5-2: Terminator Red Circle | 1:45 | — |
| 5-3: Mas Amba Protocol | 1:25 | — |
| 5-4: Level 99 | 2:20 | — |
| 5-X: Nut Tree | 2:15 | 13 / 14 / 14 / 14 / 14 / 14 / 14 |
| 6-1: I'm Going to Hell | 1:45 | — |
| 6-2: Gains Sentience | 1:45 | — |
| 6-3: I Can Tell You're Hungry | 1:55 | — |
| 6-4: Rate This PC | 2:55 | — |
| 6-X: The Nail Theory | 2:10 | 13 / 14 / 14 / 14 / 14 / 14 / 14 |

## Regular waves

Numbered waves begin at 0.75 s and stagger their bots by 0.22 s. Before area multipliers, main-route gaps are 3.5 s or 3.1 s for flanks. Side gaps are 2.65 s, or 2.95 s in Area 6. The active cap can delay main-route numbered deployments. Later squads repeat their first bot from wave two onward. Every Final Wave bot deploys at 0.75 s in one surge. The `edge>bots` prefix controls the entry edge. Unprefixed squads use standard spawn points.

| Level | Wave | Bots | Squads |
| --- | --- | --- | --- |
| 1-1: Ambatu Interview | 1 | 6 | runner runner skater / runner runner thrower |
| 1-1: Ambatu Interview | 2 | 7 | stapler skater runner / thrower runner guard |
| 1-1: Ambatu Interview | 3 | 7 | flanks>timecard skater runner / north>thrower runner guard |
| 1-1: Ambatu Interview | Final Wave | 9 | north>stapler stamper runner / south>timecard guard thrower / flanks>skater guard charger |
| 1-2: Ambadonut Break | 1 | 6 | timecard runner thrower / runner guard skater |
| 1-2: Ambadonut Break | 2 | 8 | stapler runner skater / thrower guard runner charger |
| 1-2: Ambadonut Break | 3 | 10 | north>timecard guard thrower / flanks>skater runner charger / south>thrower runner |
| 1-2: Ambadonut Break | Final Wave | 9 | south>timecard guard thrower / flanks>skater guard charger / north>stapler stamper runner |
| 1-3: YEK! | 1 | 5 | west>timecard skater runner / east>guard thrower |
| 1-3: YEK! | 2 | 9 | flanks>stapler skater runner / north>stamper guard / south>runner charger |
| 1-3: YEK! | 3 | 10 | north>timecard thrower guard / flanks>charger runner skater / east>stamper skater |
| 1-3: YEK! | Final Wave | 9 | flanks>skater guard charger / north>stapler stamper runner / south>timecard guard thrower |
| 1-4: Stand on Bussiness | 1 | 8 | stamper timecard charger / thrower runner skater / guard runner |
| 1-4: Stand on Bussiness | 2 | 11 | stapler thrower skater / runner stamper thrower / runner skater charger |
| 1-4: Stand on Bussiness | 3 | 10 | west>stamper timecard charger / east>thrower guard runner / flanks>stamper skater |
| 1-X: Wash That | 1 | 8 | flanks>timecard charger thrower / north>guard stamper runner / south>charger skater |
| 1-X: Wash That | 2 | 11 | east>stamper stapler thrower / west>charger charger skater / flanks>timecard runner skater |
| 1-X: Wash That | 3 | 11 | flanks>stamper timecard guard / south>skater thrower runner / north>stamper charger skater |
| 1-X: Wash That | 4 | 6 | west>guard timecard / east>stamper stapler charger |
| 1-X: Wash That | 5 | 6 | flanks>charger guard / north>timecard stapler stamper |
| 1-X: Wash That | Final Wave | 11 | south>timecard guard thrower / flanks>skater guard charger / north>stapler stamper runner / east>stamper stapler |
| 2-1: Thank Your Driver | 1 | 6 | thrower runner skater / thrower charger guard |
| 2-1: Thank Your Driver | 2 | 11 | headlight skater thrower / charger runner thrower / guard skater runner |
| 2-1: Thank Your Driver | 3 | 6 | west>inspector skater runner / east>charger guard |
| 2-1: Thank Your Driver | 4 | 9 | south>faregate headlight thrower / north>skater charger / flanks>runner thrower |
| 2-1: Thank Your Driver | Final Wave | 10 | west>headlight inspector faregate / east>faregate skater inspector / south>charger thrower guard / north>headlight |
| 2-2: Tentacle Crossing | 1 | 9 | inspector skater faregate / guard runner charger / thrower skater runner |
| 2-2: Tentacle Crossing | 2 | 11 | faregate headlight skater / guard charger faregate / skater skater runner |
| 2-2: Tentacle Crossing | 3 | 9 | flanks>inspector faregate skater / north>charger guard / east>skater thrower |
| 2-2: Tentacle Crossing | 4 | 10 | north>faregate headlight charger / south>guard thrower / west>charger thrower skater |
| 2-2: Tentacle Crossing | Final Wave | 10 | east>faregate skater inspector / south>charger thrower guard / north>headlight / west>headlight inspector faregate |
| 2-3: Move Over! | 1 | 5 | west>faregate inspector thrower / east>charger guard |
| 2-3: Move Over! | 2 | 8 | south>speaker headlight / north>faregate charger / flanks>thrower skater |
| 2-3: Move Over! | 3 | 9 | flanks>inspector skater faregate / north>guard speaker / east>charger thrower |
| 2-3: Move Over! | 4 | 10 | east>faregate headlight guard / west>charger skater charger / south>speaker skater |
| 2-3: Move Over! | Final Wave | 10 | south>charger thrower guard / north>headlight / west>headlight inspector faregate / east>faregate skater inspector |
| 2-4: Ambatubus | 1 | 9 | faregate speaker inspector / charger guard thrower / runner skater speaker |
| 2-4: Ambatubus | 2 | 11 | headlight skater thrower / guard charger runner / faregate speaker skater |
| 2-4: Ambatubus | 3 | 9 | west>speaker faregate inspector / east>charger charger / south>guard thrower |
| 2-4: Ambatubus | 4 | 9 | flanks>faregate headlight charger / north>speaker guard / south>thrower faregate |
| 2-X: Self Pleasure | 1 | 8 | flanks>faregate inspector skater / north>speaker guard thrower / south>charger thrower |
| 2-X: Self Pleasure | 2 | 10 | west>faregate faregate headlight / east>charger guard charger / flanks>speaker inspector |
| 2-X: Self Pleasure | 3 | 10 | north>speaker faregate inspector / south>skater skater thrower / flanks>guard faregate |
| 2-X: Self Pleasure | 4 | 11 | flanks>faregate headlight speaker / south>guard thrower skater / north>inspector faregate skater |
| 2-X: Self Pleasure | 5 | 6 | north>headlight thrower / south>inspector faregate guard |
| 2-X: Self Pleasure | 6 | 6 | west>headlight inspector / east>faregate speaker charger |
| 2-X: Self Pleasure | Final Wave | 12 | west>headlight inspector faregate / east>faregate skater inspector / south>charger thrower guard / north>headlight / north>inspector faregate |
| 3-1: Paza | 1 | 9 | speaker runner skater / speaker thrower guard / runner skater choir |
| 3-1: Paza | 2 | 11 | choir tuningfork speaker / choir skater thrower / guard speaker runner |
| 3-1: Paza | 3 | 9 | south>speaker feedback choir / north>thrower guard / east>speaker runner |
| 3-1: Paza | 4 | 9 | flanks>choir tuningfork skater / west>speaker thrower / east>guard repeater |
| 3-1: Paza | Final Wave | 11 | flanks>tuningfork choir repeater / south>feedback speaker choir / north>repeater skater guard / east>choir tuningfork |
| 3-2: Dreamyfantasia | 1 | 9 | speaker feedback choir / thrower guard repeater / charger choir skater |
| 3-2: Dreamyfantasia | 2 | 11 | choir repeater tuningfork / guard runner choir / repeater charger thrower |
| 3-2: Dreamyfantasia | 3 | 9 | west>repeater feedback choir / east>charger thrower / north>speaker guard |
| 3-2: Dreamyfantasia | 4 | 9 | flanks>repeater speaker tuningfork / south>choir guard / north>repeater skater |
| 3-2: Dreamyfantasia | Final Wave | 11 | south>feedback speaker choir / north>repeater skater guard / east>choir tuningfork / flanks>tuningfork choir repeater |
| 3-3: Poké Flute Rip | 1 | 6 | east>speaker choir / west>feedback repeater / north>runner guard |
| 3-3: Poké Flute Rip | 2 | 9 | flanks>choir speaker tuningfork / south>thrower guard / north>repeater charger |
| 3-3: Poké Flute Rip | 3 | 7 | north>repeater repeater feedback / flanks>skater thrower choir |
| 3-3: Poké Flute Rip | 4 | 10 | south>choir speaker tuningfork / west>repeater guard / east>speaker thrower skater |
| 3-3: Poké Flute Rip | Final Wave | 11 | north>repeater skater guard / east>choir tuningfork / flanks>tuningfork choir repeater / south>feedback speaker choir |
| 3-4: Thesis Night | 1 | 6 | repeater choir feedback / skater speaker thrower |
| 3-4: Thesis Night | 2 | 7 | speaker tuningfork choir / repeater skater thrower |
| 3-4: Thesis Night | 3 | 14 | choir feedback repeater / speaker charger choir / guard skater thrower / choir runner |
| 3-4: Thesis Night | 4 | 10 | flanks>repeater choir speaker / east>tuningfork charger guard / west>choir thrower |
| 3-X: At The Club | 1 | 6 | flanks>repeater choir feedback / north>speaker charger guard |
| 3-X: At The Club | 2 | 9 | south>choir choir tuningfork / north>repeater guard / east>speaker feedback |
| 3-X: At The Club | 3 | 10 | east>repeater repeater feedback / west>choir charger guard / flanks>speaker thrower |
| 3-X: At The Club | 4 | 10 | flanks>choir repeater speaker / north>tuningfork guard choir / south>repeater feedback |
| 3-X: At The Club | 5 | 6 | flanks>choir repeater / north>feedback tuningfork speaker |
| 3-X: At The Club | 6 | 6 | south>tuningfork guard / east>choir repeater feedback |
| 3-X: At The Club | Final Wave | 13 | flanks>tuningfork choir repeater / south>feedback speaker choir / north>repeater skater guard / east>choir tuningfork / west>tuningfork choir |
| 4-1: Sleepy Edit | 1 | 9 | camerabot runner skater / guard speaker camerabot / charger skater thrower |
| 4-1: Sleepy Edit | 2 | 11 | camerabot clapper runner / speaker skater camerabot / charger thrower skater |
| 4-1: Sleepy Edit | 3 | 6 | west>camerabot lighting runner / east>charger guard |
| 4-1: Sleepy Edit | 4 | 6 | flanks>camerabot clapper charger / south>speaker skater |
| 4-1: Sleepy Edit | 5 | 9 | north>camerabot lighting cutout / south>speaker charger / flanks>thrower runner |
| 4-1: Sleepy Edit | Final Wave | 11 | east>clapper cutout lighting / west>lighting camerabot clapper / north>clapper charger guard / south>cutout lighting |
| 4-2: Candid Talk Pt. 3 | 1 | 9 | lighting camerabot cutout / camerabot choir thrower / charger guard cutout |
| 4-2: Candid Talk Pt. 3 | 2 | 11 | cutout camerabot clapper / guard speaker camerabot / choir skater thrower |
| 4-2: Candid Talk Pt. 3 | 3 | 8 | east>cutout camerabot lighting / west>guard charger / north>speaker |
| 4-2: Candid Talk Pt. 3 | 4 | 7 | flanks>cutout cutout clapper / south>camerabot choir guard |
| 4-2: Candid Talk Pt. 3 | 5 | 9 | south>choir camerabot lighting / north>charger guard / east>cutout thrower |
| 4-2: Candid Talk Pt. 3 | Final Wave | 11 | west>lighting camerabot clapper / north>clapper charger guard / south>cutout lighting / east>clapper cutout lighting |
| 4-3: Classy Cut | 1 | 5 | north>cutout camerabot lighting / south>thrower skater |
| 4-3: Classy Cut | 2 | 6 | flanks>camerabot speaker clapper / east>cutout guard |
| 4-3: Classy Cut | 3 | 8 | east>camerabot cutout / west>choir lighting / south>skater guard |
| 4-3: Classy Cut | 4 | 7 | north>camerabot camerabot clapper / flanks>cutout charger guard |
| 4-3: Classy Cut | 5 | 9 | west>cutout choir camerabot / east>lighting speaker / north>guard skater |
| 4-3: Classy Cut | Final Wave | 11 | north>clapper charger guard / south>cutout lighting / east>clapper cutout lighting / west>lighting camerabot clapper |
| 4-4: Going Insane | 1 | 6 | camerabot lighting thrower / cutout speaker camerabot |
| 4-4: Going Insane | 2 | 7 | cutout clapper guard / charger camerabot skater |
| 4-4: Going Insane | 3 | 14 | camerabot cutout lighting / guard camerabot choir / speaker skater charger / camerabot runner |
| 4-4: Going Insane | 4 | 7 | east>camerabot cutout clapper / west>charger thrower choir |
| 4-4: Going Insane | 5 | 9 | flanks>cutout camerabot speaker / south>lighting charger / north>choir cutout |
| 4-X: Cream Factory | 1 | 6 | flanks>camerabot cutout lighting / north>guard speaker choir |
| 4-X: Cream Factory | 2 | 10 | west>cutout cutout clapper / east>camerabot camerabot charger / south>choir lighting |
| 4-X: Cream Factory | 3 | 7 | south>camerabot speaker choir / north>lighting cutout guard |
| 4-X: Cream Factory | 4 | 10 | flanks>camerabot clapper charger / west>choir cutout guard / east>speaker camerabot |
| 4-X: Cream Factory | 5 | 10 | north>camerabot cutout choir / south>lighting charger cutout / flanks>camerabot skater |
| 4-X: Cream Factory | 6 | 6 | north>clapper cutout / flanks>lighting camerabot choir |
| 4-X: Cream Factory | 7 | 6 | east>camerabot lighting / south>clapper charger cutout |
| 4-X: Cream Factory | Final Wave | 13 | east>clapper cutout lighting / west>lighting camerabot clapper / north>clapper charger guard / south>cutout lighting / flanks>clapper lighting |
| 5-1: Sungut Lele | 1 | 9 | popup runner guard / camerabot skater firewall / charger popup guard |
| 5-1: Sungut Lele | 2 | 11 | firewall induction popup / charger guard camerabot / skater choir firewall |
| 5-1: Sungut Lele | 3 | 6 | flanks>popup cutter guard / north>firewall charger |
| 5-1: Sungut Lele | 4 | 7 | west>firewall camerabot induction / east>popup choir guard |
| 5-1: Sungut Lele | 5 | 9 | north>popup scout cutter / south>firewall guard / flanks>camerabot skater |
| 5-1: Sungut Lele | Final Wave | 12 | north>induction scout cutter / south>cutter popup firewall / east>scout induction guard / west>charger cutter induction |
| 5-2: Terminator Red Circle | 1 | 9 | popup firewall cutter / camerabot scout popup / charger choir firewall |
| 5-2: Terminator Red Circle | 2 | 11 | scout popup induction / firewall camerabot skater / choir popup firewall |
| 5-2: Terminator Red Circle | 3 | 7 | west>scout popup cutter / east>camerabot charger choir |
| 5-2: Terminator Red Circle | 4 | 7 | south>firewall firewall induction / north>scout popup guard |
| 5-2: Terminator Red Circle | 5 | 9 | flanks>scout popup choir / west>firewall cutter / east>camerabot scout |
| 5-2: Terminator Red Circle | Final Wave | 12 | south>cutter popup firewall / east>scout induction guard / west>charger cutter induction / north>induction scout cutter |
| 5-3: Mas Amba Protocol | 1 | 5 | north>scout popup cutter / south>charger skater |
| 5-3: Mas Amba Protocol | 2 | 6 | flanks>popup firewall induction / west>camerabot scout |
| 5-3: Mas Amba Protocol | 3 | 7 | south>firewall scout choir / north>popup cutter guard |
| 5-3: Mas Amba Protocol | 4 | 7 | east>popup popup induction / west>scout firewall choir |
| 5-3: Mas Amba Protocol | 5 | 9 | flanks>scout firewall popup / south>camerabot cutter / north>guard choir |
| 5-3: Mas Amba Protocol | Final Wave | 12 | east>scout induction guard / west>charger cutter induction / north>induction scout cutter / south>cutter popup firewall |
| 5-4: Level 99 | 1 | 6 | popup scout cutter / firewall camerabot skater |
| 5-4: Level 99 | 2 | 7 | scout choir popup / camerabot induction firewall |
| 5-4: Level 99 | 3 | 14 | popup popup cutter / firewall choir scout / charger camerabot firewall / popup skater |
| 5-4: Level 99 | 4 | 7 | flanks>firewall popup scout / north>induction skater choir |
| 5-4: Level 99 | 5 | 10 | west>scout camerabot popup / east>firewall choir cutter / south>popup charger |
| 5-X: Nut Tree | 1 | 5 | west>scout firewall / east>cutter choir camerabot |
| 5-X: Nut Tree | 2 | 9 | flanks>scout cutter induction / north>guard popup / south>charger choir |
| 5-X: Nut Tree | 3 | 7 | north>cutter firewall popup / south>charger scout choir |
| 5-X: Nut Tree | 4 | 9 | east>cutter scout induction / west>camerabot charger / flanks>choir cutter |
| 5-X: Nut Tree | 5 | 9 | flanks>scout firewall charger / north>camerabot choir / south>cutter popup |
| 5-X: Nut Tree | 6 | 6 | west>scout induction / east>cutter popup firewall |
| 5-X: Nut Tree | 7 | 6 | flanks>charger induction / south>scout cutter camerabot |
| 5-X: Nut Tree | Final Wave | 14 | north>induction scout cutter / south>cutter popup firewall / east>scout induction guard / west>charger cutter induction / south>cutter induction |
| 6-1: I'm Going to Hell | 1 | 9 | choir choir popup / firewall skater charger / choir guard popup |
| 6-1: I'm Going to Hell | 2 | 11 | popup choir firewall / ash choir skater / firewall popup choir |
| 6-1: I'm Going to Hell | 3 | 7 | north>choir ghost popup / south>firewall skater guard |
| 6-1: I'm Going to Hell | 4 | 6 | flanks>choir popup firewall / west>ash choir |
| 6-1: I'm Going to Hell | 5 | 10 | west>backup choir popup / east>firewall ghost guard / south>choir skater |
| 6-1: I'm Going to Hell | Final Wave | 12 | north>ash ghost backup / south>choir firewall backup / east>ash ash backup ghost / west>ghost firewall |
| 6-2: Gains Sentience | 1 | 9 | backup firewall choir / popup ghost charger / firewall choir backup |
| 6-2: Gains Sentience | 2 | 14 | firewall popup ash / choir firewall guard / backup choir firewall / choir skater |
| 6-2: Gains Sentience | 3 | 7 | flanks>backup popup ghost / east>choir charger firewall |
| 6-2: Gains Sentience | 4 | 7 | west>firewall popup backup / east>choir ash charger |
| 6-2: Gains Sentience | 5 | 9 | north>backup choir firewall / south>popup ghost / flanks>choir charger |
| 6-2: Gains Sentience | Final Wave | 12 | south>choir firewall backup / east>ash ash backup ghost / west>ghost firewall / north>ash ghost backup |
| 6-3: I Can Tell You're Hungry | 1 | 5 | flanks>backup choir popup / north>ghost charger |
| 6-3: I Can Tell You're Hungry | 2 | 7 | west>firewall ash choir / east>backup popup charger |
| 6-3: I Can Tell You're Hungry | 3 | 6 | south>choir choir firewall / north>popup ghost |
| 6-3: I Can Tell You're Hungry | 4 | 7 | east>backup backup ash / west>firewall choir skater |
| 6-3: I Can Tell You're Hungry | 5 | 10 | flanks>backup popup firewall / north>choir ghost charger / south>popup skater |
| 6-3: I Can Tell You're Hungry | Final Wave | 12 | east>ash ash backup ghost / west>ghost firewall / north>ash ghost backup / south>choir firewall backup |
| 6-4: Rate This PC | 1 | 6 | choir firewall backup / popup ghost choir |
| 6-4: Rate This PC | 2 | 7 | choir backup ash / firewall choir skater |
| 6-4: Rate This PC | 3 | 15 | firewall backup choir / choir choir ghost / popup firewall guard / choir popup firewall |
| 6-4: Rate This PC | 4 | 7 | flanks>backup firewall choir / north>popup ash guard |
| 6-4: Rate This PC | 5 | 10 | east>firewall backup popup / west>choir ghost skater / south>firewall choir |
| 6-X: The Nail Theory | 1 | 6 | north>backup firewall choir / south>popup ghost firewall |
| 6-X: The Nail Theory | 2 | 9 | flanks>ash choir backup / east>firewall ash / west>ghost skater |
| 6-X: The Nail Theory | 3 | 9 | west>backup firewall / east>choir ash ghost / north>popup guard |
| 6-X: The Nail Theory | 4 | 9 | flanks>firewall ash backup / south>choir charger / north>popup choir |
| 6-X: The Nail Theory | 5 | 10 | north>ash firewall backup / south>popup ghost / flanks>ghost skater ash |
| 6-X: The Nail Theory | 6 | 6 | south>ghost firewall / north>ash backup popup |
| 6-X: The Nail Theory | 7 | 6 | flanks>ghost ash / east>firewall backup choir |
| 6-X: The Nail Theory | Final Wave | 14 | north>ash ghost backup / south>choir firewall backup / east>ash ash backup ghost / west>ghost firewall / flanks>ash firewall |

## Enemies

| ID | Name | Base HP | Base speed | Radius | Contact damage | Specialist behavior |
| --- | --- | --- | --- | --- | --- | --- |
| stapler | Spring Stapler | 43 | 109 | 15 | 14 | Crouches, then springs along its dotted aim line. |
| timecard | Punch Clock | 60 | 64 | 20 | 15 | Plants its feet and stamps a delayed mark at the player’s position. |
| headlight | High Beam Hopper | 36 | 155 | 12 | 12 | Follows grid lines, then races down a lane in a single direction. |
| inspector | Last-Fare Inspector | 54 | 85 | 17 | 13 | Backs away and throws tickets that curve across its firing lane. |
| tuningfork | Tuning Fork | 38 | 139 | 13 | 11 | Orbits its target and scatters a triplet sideways across the beat. |
| feedback | Feedback Drum | 66 | 55 | 21 | 15 | Bangs out a twelve-note ring. Its last beat comes from a different angle. |
| clapper | Clapper Cut | 41 | 130 | 14 | 12 | Zigzags between takes and fires a cross from its current heading. |
| lighting | Followspot Rig | 62 | 78 | 20 | 13 | Moves along the lighting rails. Its paired pools close on your previous position. |
| induction | Induction Coil | 70 | 62 | 22 | 16 | A heavy coil with twin beams. Step through the center opening or behind it. |
| cutter | Assembly Cutter | 46 | 146 | 14 | 13 | Hunts in arcs and throws plasma blades that curve away from each other. |
| ash | Ash Wisp | 36 | 174 | 11 | 12 | A fast, erratic ember that hurls slow fire in four diagonal directions. |
| ghost | Reboot Ghost | 62 | 89 | 18 | 14 | Marks a reboot location, then jumps there and launches a fan of embers. |
| runner | Bussiness Rep | 32 | 131 | 13 | 12 | — |
| thrower | Transfer Clerk | 40 | 90 | 15 | 12 | — |
| guard | Classy Bouncer | 78 | 70 | 21 | 19 | — |
| skater | Ambatufish | 35 | 157 | 12 | 12 | — |
| charger | Ambatuexplode | 62 | 104 | 17 | 12 | — |
| speaker | Ambatusax Cabinet | 48 | 77 | 16 | 12 | — |
| choir | Angelic Kam Choir | 43 | 154 | 16 | 12 | — |
| popup | Sentient Pop-up | 51 | 80 | 17 | 12 | — |
| firewall | Wordington Firewall | 91 | 68 | 22 | 24 | — |
| camerabot | Candid Camerabot | 56 | 82 | 17 | 12 | — |

| Variant | Base bot | HP multiplier | Speed multiplier | Radius | Behavior |
| --- | --- | --- | --- | --- | --- |
| Gym Floor Monitor | Classy Bouncer | 1.05 | 0.84 | 24 | Stops at arm’s length to stamp a warning zone at your feet. |
| Tentacle Faregate | Transfer Clerk | 1.23 | 0.87 | 19 | Patrols the grid and telegraphs a beam on each side of its aim. |
| High Quality Repeater | Ambatusax Cabinet | 0.95 | 1.25 | 15 | Circles close to you and releases a five-note fan. |
| Classy Stunt Double | Ambatufish | 0.9 | 1.08 | 11 | Skates in wide loops and drops a timed spotlight as it passes. |
| Sungut Lele Scout | Classy Bouncer | 0.73 | 1.46 | 16 | Bounces away at midrange and tracks your last position with a narrow beam. |
| Wordington Backup | Sentient Pop-up | 1.16 | 1.08 | 20 | Drifts erratically between its laser and slow ember rings. |

## Equipment

| Slot | Item | Unlock | Effect |
| --- | --- | --- | --- |
| Popper | Standard Popper | Starter | Balanced single shot. |
| Popper | Ambasing Scatter | 1-2: Ambadonut Break | Three equal-strength shots in a forward fan. |
| Popper | Double Take | 1-4: Stand on Bussiness | Fires two parallel shots. |
| Popper | Transfer Repeater | 2-1: Thank Your Driver | Fastest sustained fire at short range. |
| Popper | Bass Drop | 3-1: Paza | Slow heavy single shot with a short reach. |
| Popper | Red Circle Needle | 3-2: Dreamyfantasia | Fast, long-range single shot. |
| Popper | Eight-Way Cut | 4-3: Classy Cut | Fires one shot in each of the eight compass directions. |
| Popper | Sungut Lele Overdrive | 5-2: Terminator Red Circle | Every fourth volley fires a six-pop fan. |
| Popper | Nut Cracker | 1-X: Wash That | Five wide pellets with a short range. |
| Popper | Reverse Playback | 3-3: Poké Flute Rip | Fires at 80% pop power forward and 180% backward. |
| Nut Effect | Plain Kernels | Starter | Standard projectiles. |
| Nut Effect | It Cold | 1-1: Ambatu Interview | Cuts speed and attack tempo by 36% for 1.25 s. Bosses lose 18% for 0.625 s. |
| Nut Effect | Ambalien Goo | 1-X: Wash That | Poisons for 2 s at 100% pop power per second before defenses. Hits refresh poison. |
| Nut Effect | YEK Circuit | 2-X: Self Pleasure | Every third volley stuns for 0.8 s. Bosses receive a shorter heavy slow. |
| Nut Effect | Ambatuexplode | 3-1: Paza | Hits deal 45% splash damage around the target. |
| Nut Effect | Base Form Tip | 3-2: Dreamyfantasia | Each pellet pierces one extra enemy at full damage. |
| Nut Effect | Tracer | 4-2: Candid Talk Pt. 3 | Shots curve toward nearby enemies and deal 25% less damage. |
| Nut Effect | Rebound Cut | 4-4: Going Insane | Shots ricochet once and deal 45% more damage after the bounce. |
| Buss Burst | Confetti Cone | Starter | A wide forward sweep. |
| Buss Burst | Paza Halo | 1-2: Ambadonut Break | A tight ring centered on you at 140% of standard Burst damage. |
| Buss Burst | Express Lane | 2-4: Ambatubus | A long, narrow beam at 115% of standard Burst damage. |
| Buss Burst | Six-Point Signal | 3-4: Thesis Night | A six-pointed star centered on you. Covers most of the arena when cast near the middle. |
| Buss Burst | Red Circle Strike | 5-4: Level 99 | Projects a high-damage blast ahead. |
| Buss Burst | Bootleg Overdub | 3-X: At The Club | A wide ring followed 1.5 s later by a smaller blast that deals 80% of the initial damage. |
| Buss Burst | Switchback | 2-3: Move Over! | Fires forward and backward beams at 105% of standard Burst damage. |
| Buss Burst | Censor Bar | 4-X: Cream Factory | Wide short beam. Erase three shots to stagger nearby bots and gain 1.0 s of protection. |
| Boots | Stock Trainers | Starter | Balanced movement and dash. |
| Boots | Transfer Ticket | 2-2: Tentacle Crossing | Dash cooldown is 20% shorter. |
| Boots | Classy Stabilizer | 4-2: Candid Talk Pt. 3 | Store up to two dashes. Each charge takes 35% longer to refill, one at a time. |
| Boots | Stretch This | 4-1: Sleepy Edit | Dash lasts 55% longer. |
| Boots | Firewall Soles | 6-1: I'm Going to Hell | Dashing leaves a pulse that damages enemies and clears nearby shots. |
| Boots | Night Return | 2-X: Self Pleasure | Each Close Call refunds 0.5 seconds of dash cooldown. |
| Boots | Jomok Drift Soles | 3-3: Poké Flute Rip | Walk 45% faster for 1.5 seconds after a dash. |
| Boots | Paza Runners | 3-X: At The Club | Popping a bot resets dash cooldown. |
| Vibe Guard | Softshell | Starter | Standard Vibe and recovery. |
| Vibe Guard | Bussiness Lifting Belt | 1-4: Stand on Bussiness | Increases max Vibe. |
| Vibe Guard | Bouncer Plate | 2-4: Ambatubus | Take 14% less damage and move 8% slower. |
| Vibe Guard | Ambadonut Lining | 3-1: Paza | Vibe pickups and wave refills heal 40% more. |
| Vibe Guard | Core Padding | 5-1: Sungut Lele | +2.5 s of hit protection. |
| Vibe Guard | Red Tag Guard | 5-X: Nut Tree | Start every wave with 6.7 seconds of protection. |
| Vibe Guard | Breakaway Jacket | 4-2: Candid Talk Pt. 3 | Blocks the first projectile hit in each wave. |
| Vibe Guard | Spam Filter | 6-1: I'm Going to Hell | Taking a hit erases shots within 200 px and adds 1.0 s of hit protection. Recharges in 5 s. |
| Pendant | nuthing | Starter | A plain dispatch token. |
| Pendant | Nitro PC Charger | 3-4: Thesis Night | Start with extra Burst charge. Gain 35% at the start of each later wave. |
| Pendant | Pop Me | 3-2: Dreamyfantasia | Popped bots fire an echo worth 3× pop power. Each echo hits one enemy. |
| Pendant | 30-Buck Cameo | 4-4: Going Insane | Survive one lethal hit per attempt at 30% Vibe with 2.0 s of extra hit protection. |
| Pendant | Take It Take It Take It | 5-2: Terminator Red Circle | Close Calls return a piercing shot with 3× pop power. |
| Pendant | I Need That Nut | 6-X: The Nail Theory | Restore 10 Vibe for every fourth bot popped and 2 Vibe for every tenth shot that hits a boss. |
| Pendant | Coldest Moment | 4-X: Cream Factory | Buss Burst freezes all enemies for 5 seconds. Bosses are heavily slowed for 2.5 seconds. |
| Pendant | Batu Khan's Revenge | 5-X: Nut Tree | Taking damage clears hostile shots, deals 2× pop power to all enemies, and grants 5% Burst charge. |

## Skill tree

| Branch | Node | Cost (SP) | Prerequisite | Effect |
| --- | --- | --- | --- | --- |
| Pop | Bussiness Blend | 1 | Root | +12% pop power. |
| Pop | Classy Edit | 2 | Bussiness Blend | +12% fire rate. |
| Pop | First Impressions | 2 | Classy Edit | Opening hits on full-health bots deal 40% extra damage. |
| Pop | Crowd Control | 3 | Classy Edit | Each pop in your current streak adds 4% shot power, up to 20%. |
| Pop | Candid Cut | 1 | Bussiness Blend | +24% projectile speed. |
| Pop | No Mercy | 3 | First Impressions | Shots deal 50% more damage to regular bots below 30% Vibe. |
| Pop | Quick Draw | 2 | First Impressions | The first volley within 1.0 s of dashing deals 100% extra damage. |
| Dash | Ambatufish Sliders | 1 | Root | +10% move speed. |
| Dash | Tentacle Transfer | 1 | Ambatufish Sliders | 10% less dash cooldown. |
| Dash | Close Shave | 2 | Tentacle Transfer | +3% Burst charge per Close Call. |
| Dash | Move Over! | 1 | Tentacle Transfer | +40% dash speed. |
| Dash | Change for the Bus | 2 | Tentacle Transfer | A Close Call restores 2 Vibe. |
| Dash | Last Flare | 3 | Change for the Bus | Stay invulnerable for 0.25 seconds after a dash. |
| Burst | Thesis Reverb | 1 | Root | +12% Burst damage. |
| Burst | Encore Reach | 1 | Thesis Reverb | +20% Burst reach. |
| Burst | Bass Boost | 2 | Encore Reach | Deal 20% more damage to bots and bosses at 50% Vibe or higher. |
| Burst | Final Encore | 3 | Bass Boost | Get 35% charge back when a Burst erases five or more hostile shots. |
| Burst | Second Wind | 2 | Encore Reach | Using Burst restores 8 Vibe. |
| Burst | Soundcheck | 1 | Thesis Reverb | +20% starting Burst charge. |
| Vibe | Ambadonut Break | 1 | Root | +20 max Vibe. |
| Vibe | Classy Guard | 2 | Ambadonut Break | Take 7% less damage. |
| Vibe | Clean Cut | 2 | Classy Guard | +0.5 seconds of hit protection. |
| Vibe | Second Serving | 2 | Classy Guard | Vibe pickups heal 25% more. |
| Vibe | Reset the Set | 1 | Ambadonut Break | Restore 20 Vibe when a regular wave ends. |
| Vibe | No Signal | 1 | Reset the Set | Arena hazards deal 35% less damage. |
| Signal | Ambasing Choir | 1 | Root | +2 Burst charge per bot pop. |
| Signal | Mas Amba Edit | 2 | Ambasing Choir | Gain 15% Burst charge at the start of each wave. |
| Signal | Red Circle Lock | 2 | Mas Amba Edit | +0.5% Burst charge per boss hit. |
| Signal | Bass Echo | 2 | Mas Amba Edit | Taking damage deals 1× pop power to all enemies. |
| Signal | Clean Plate | 3 | Red Circle Lock | Finishing a wave without a hit fully charges Burst. |
| Signal | Standing Ovation | 1 | Ambasing Choir | Streaks stay active for an extra 1.5 seconds between kills. |
| Vibe | Nut Break | 3 | Second Serving | Restore 4 Vibe for every fourth bot popped. |

## Burst shapes

| Shape | Range or radius (px) | Extra geometry |
| --- | --- | --- |
| cone | 330 | 49.5° half-angle |
| star | 760 | Player-centered hexagram |
| halo | 145 | Player-centered |
| ring | 178 | Player-centered |
| beam | 535 | 48 px half-width |
| remote | 138 | 230 px forward center |
| crossbeam | 395 | 42 px half-width |
| widebeam | 250 | 96 px half-width |

## Soundtrack and narration

| Track | Creator | File | Authored gain | Source |
| --- | --- | --- | --- | --- |
| Sci-fi Puzzle Stage Select | MintoDog | dispatch.ogg | 0.1 | [CC0 release](https://opengameart.org/content/sci-fi-puzzle-stage-select) |
| Chase! | Ted Kerr (Wolfgang_) | action-district.ogg | 0.145 | [CC0 release](https://opengameart.org/content/chase) |
| Darkness Road | MintoDog | road.ogg | 0.087 | [CC0 release](https://opengameart.org/content/darkness-roadremake) |
| Chiptune Battle Music | pmiller | action-radio.ogg | 0.162 | [CC0 release](https://opengameart.org/content/chiptune-battle-music) |
| Hard Battle 1 | MintoDog | hard-battle-1.ogg | 0.127 | [CC0 release](https://opengameart.org/content/hard-battle-1) |
| Hard Battle 2 | MintoDog | action-core.ogg | 0.115 | [CC0 release](https://opengameart.org/content/hard-battle-2) |
| Infinite Darkness | HydroGene | action-server.ogg | 0.12 | [CC0 release](https://opengameart.org/content/8-bit-infinite-darkness) |
| 8bit Action Miniboss Battle | MintoDog | 8bit-action-miniboss-battle.ogg | 0.134 | [CC0 release](https://opengameart.org/content/8bit-action-miniboss-battle) |
| Hard Boss Battle 1 | MintoDog | hard-boss-battle-1.ogg | 0.145 | [CC0 release](https://opengameart.org/content/hard-boss-battle-1) |
| Urban Boss Battle | MintoDog | urban-boss-battle.ogg | 0.146 | [CC0 release](https://opengameart.org/content/urban-boss-battle) |
| Trance Boss Battle | MintoDog | trance-boss-battle.ogg | 0.141 | [CC0 release](https://opengameart.org/content/trance-boss-battle) |
| Heavy Boss Battle 1 | MintoDog | core-boss.ogg | 0.132 | [CC0 release](https://opengameart.org/content/heavy-boss-battle-1) |
| Raiders March | bobjt | server-boss.mp3 | 0.181 | [CC0 release](https://opengameart.org/content/raiders-march) |
| Boss Battle #8 Metal | nene | hellboot.ogg | 0.192 | [CC0 release](https://opengameart.org/content/boss-battle-8-metal) |

Satan’s PC - Harder and Dirtier switches to **Boss Battle #8 Metal** on transformation. The gameplay music mix is 1.38× each track’s authored gain. The menu uses its own quieter gain.

Narration uses complete source recordings at normal speed. The queue holds 2 pending cues for up to 16 seconds. Failure and revival play immediately on the foreground channel.

| Cue | File | Cooldown (s) | Priority |
| --- | --- | --- | --- |
| terminal | buss.mp3 | 35 | 1 |
| radio | paza.mp3 | 35 | 1 |
| studio | insane.mp3 | 35 | 1 |
| transform | blow.mp3 | 12 | 3 |
| revive | choir.mp3 | 0 | 4 |
| fail | tap.mp3 | 0 | 4 |
| victory | dies.mp3 | 35 | 3 |

Each combat event plays its authored cue with overlap compensation. Settings can turn combat chatter off. A short edit starts at the listed timestamp and ends at the first detected quiet window after its earliest end. The audio check flags any edit that falls back to a fade.

| Event | File | Start (s) | Earliest end (s) | Gain |
| --- | --- | --- | --- | --- |
| down | yek.mp3 | 0.49 | 2.02 | 0.16 |
| down | yek.mp3 | 2.27 | 2.61 | 0.15 |
| hurt | like.mp3 | 4.77 | 6.23 | 0.28 |
| dash | rtp.mp3 | 0.16 | 1.71 | 0.17 |
| burst | nut.mp3 | 0 | 1.75 | 0.35 |
| burst | buss.mp3 | 0.16 | 1.07 | 0.27 |
| clean | blow.mp3 | 0 | 2.15 | 0.19 |

<!-- END GENERATED TABLES -->

## Combat rules

The engine ticks at 90 Hz in a 960 × 544 arena. Actors stay within the bounds inset by their radius. The mouse is projected through the rendered canvas bounds. Touch fire aims at the nearest materialized enemy. Dash grants invulnerability and consumes intercepted bullets. Only one contact per dash grants Close Call charge, score, or upgrades. Later intercepted bullets are still cleared.

Pop damage includes the area power multiplier and the current build. A projectile can hit each enemy at most once, and piercing adds distinct hits. Splash damages nearby bots on impact. Echo and reflected projectiles use their own power and skip the equipped popper's special effects. Bosses and Ambatron’s pods receive half the duration and strength of slows. Stuns reduce their speed and attack tempo by 70% for half the original duration. Coldest Moment stuns regular enemies for five seconds. The standard streak lasts 2.5 seconds between pops and Standing Ovation raises that to 4.0 seconds.

Buss Burst consumes a full meter, hits bots and bosses, and clears hostile shots in its shape. Cone covers the front, Halo covers a circle around the player, Express Lane runs a narrow beam toward the aim, and Red Circle Strike projects a circle ahead. Six-Point Signal covers a player-centered hexagram regardless of aim, with the broadest coverage from the middle of the arena. Bootleg Overdub adds a 90 px blast after 1.5 s at 80% of the first blast's damage to bots and bosses before target defenses. Burst damage is shown as base hit damage in Upgrades and scales by area, with a separate boss coefficient. Armor, healing, and revival effects are applied at attempt start through the selected build. Bass Boost checks the current health bar for each target, including each boss phase, and applies at 50% or higher.

Main waves advance once the spawn queue and enemies are empty. Bonus waves advance on an early clear or when their timer expires. Pending deployments must finish, and live threats carry over. Boss rounds occur on the fourth level of each area. Scripted hazards telegraph before dealing damage. Vibe drops restore 19 before healing modifiers. Clean regular waves award score and charge. Skill points and gear come from first clears.

The recorded timer stops on the last lethal hit in the final round. The victory animation stays visible for roughly 1.3 seconds after the timer freezes. Old stored times retain their original measurement.

## Equipment balance notes

- Ambasing Scatter retains 1.96× standard pop power across three equal pellets. Eight-Way Cut totals 2.8× standard pop power per volley and sends 0.35× in any one direction. Red Circle Needle travels at 1.60× standard projectile speed. Overdrive’s fourth volley fires six equal 0.68× pellets, for up to 4.08× pop power before Nut Effects and defenses. Reverse Playback directs 0.8× forward and 1.8× backward.
- Base Form Tip pays a full second hit when enemies line up. Ambatuexplode pays 45% per neighbor and needs three neighbors to exceed one full extra hit. Tracer needs about 33% more hits to offset its 25% damage penalty.
- Transfer Ticket saves about 0.30 s per base dash. Classy Stabilizer stores two dashes for back-to-back escapes at 2.00 s per charge before skills. Stretch This extends protection during the dash without changing its cooldown. Night Return saves up to 0.5 s per dash by landing a Close Call. Paza Runners skip the entire remaining cooldown on a kill and can chain dashes in crowds. Drift Soles increase walk speed by 45% for 1.5 s after each dash.
- Red Tag Guard covers the first 6.7 s of each wave and can make Clean Plate easy to trigger. Reset the Set heals 20 Vibe after each regular wave, including timed transitions with surviving enemies.
- Pop Me can create a new echo when an echo kills a bot. Bass Drop delivers about 115 raw base damage per echo impact before area and skill scaling. Each echo hits one target.
- Batu Khan's Revenge clears all hostile shots, hits each active enemy for 2× pop power before scaling and defenses, and adds five points to the Burst meter on every damaging hit. Bass Echo adds its 1× pop power to the same retaliation.

On the November 15 matched replay check, Bass Drop with Amboutabass Echo cleared 4-X and 5-X in 59.50 s and 73.82 s. Swapping only the pendant to 30-Buck Cameo took 80.92 s and 98.38 s. Removing Clean Plate had little effect on clear time in that seed. Eight-Way Cut cleared both bonus stages but failed all six attempts at 5-4, even with compass-aware movement. Reverse Playback cleared 5-4 in 91.90 s with the pilot aiming its stronger shot at the target. These are single-seed comparisons.

In the matched single-seed Echo replay, removing piercing added 1.26 s on 4-X and 2.10 s on 5-X. The single-target version still cleared those levels 20.16 s and 22.46 s faster than the same kit with 30-Buck Cameo.

## Boss cues

- **Bussiness Rep XL** telegraphs charges and adds a three-mark Overtime Stamp. Move perpendicular to the charge lane.
- **The Dreamybus** alternates lane charges and ticket fire. Express Service paints ghost lanes to both sides of the player.
- **Ambatusax** follows musical rings and a solo warning with double note fans. Keep space between you and the speaker stacks.
- **Evil Dreamy** uses spot marks and split-screen retakes. Clear summoned Camerabots to open space.
- **Ambatron** marks the player's last position and transforms after the first health bar. Destroy both orbiting pods to remove the second form's damage reduction.
- **Satan’s PC** exposes a green safe lane during quarantine. The OVERHEAT window increases damage dealt to the chassis. In the second phase, glass cracks at 75%, 50%, and 25% health, with portraits appearing at half health. The last hit shatters the glass, blacks out the background, and triggers an explosion while the clear time stays frozen.

## Audio routing

Map, Upgrades, Files, and Settings share the dispatch theme. Each combat area has one arena track and one boss track. Playback crossfades when a decoded successor is ready. Pause and return preserve each track's offset. The cache keeps up to four decoded music tracks and protects the active one. Common actions use short synthesized effects. Enemy pops, dashes, hurt events, and repeated Burst use never enqueue narration. Terminal, FM, and Studio boss intros, Third Impact, entry to area six, and the ending use the six complete voice recordings. Voice ducks music while it plays. Leaving an attempt or retrying stops its narration, stingers, and synthesized effects. The loss cue can play in full if the player stays on the results screen.
