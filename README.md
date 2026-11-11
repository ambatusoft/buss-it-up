# Dreamybull: Buss It Up!

An unofficial arcade parody about Dreamybull and a gym full of rogue exercise bots. Open **index.html** in a browser. The game runs offline from that one file, with no installation or server.

- **Move:** WASD or arrow keys.
- **Aim and pop:** Move the mouse and hold the left mouse button (or hold F to fire).
- **Dash:** Shift. Dash through shots to clear them and charge Buss Burst. The first three projectile contacts per dash earn a Close Call reward.
- **Buss Burst:** Aim and press Space at full charge to spray a cone of confetti. It pops bots and clears incoming shots in its path. Pop bots or land boss hits to fill the meter.
- **Pause:** Esc or P. Touch devices have a movement stick, an auto-aiming POP button, DASH, and BUSS.

The listed stages have 3, 3, 4, 4, and 4 waves plus a boss round each. Pick one upgrade after wave two and one after every boss. Each displayed card independently rolls 60% Common, 30% Rare, or 10% Bussted. Use Encore once per run to replace an offer. Ambatron rebuilds into Third Impact after its first health bar runs out. Target the orbiting pods to strip its shield.

Open **Files** below the tour map. Search by name or file number. Select an enemy sprite or switch to the Upgrades tab to inspect cards you’ve seen. **Practice** lets you revisit a boss you’ve encountered, using the selected difficulty. Discoveries, unlocked stages, checkpoints, and high scores are saved in the current browser where storage is available.

| Stage | Boss | Inspiration |
| --- | --- | --- |
| After Hours Gym | The Lunk-Bot | Original gym setting |
| Buss Terminal | The Dreamybus | [Bus, Bus, Bus](https://knowyourmeme.com/sensitive/memes/dreamybull-bus-bus-bus-im-bussing) |
| Ambatublow Club | Sax Max | [Saxophone meme](https://knowyourmeme.com/sensitive/videos/384184-dreamybull) |
| Omaygot Studio | The Omaygot Director | [Ambatukam Omaygot edits](https://knowyourmeme.com/sensitive/memes/ambatukam) |
| Ambatron Core | Ambatron Prime | [Ambatron / Dreamybot](https://knowyourmeme.com/memes/ambatron) |

The Archive links to the community posts and fan edits behind the game’s names. The cabinet’s comic look takes inspiration from [Hi-Fi RUSH](https://news.xbox.com/en-us/2023/01/25/hi-fi-rush-preview-out-now-hands-on/).

Background music uses four CC0 recordings by MintoDog. [Stage Select](https://opengameart.org/node/171901), [Boss Battle and Climax](https://opengameart.org/content/8bit-action-boss-battle), [Castle Stage](https://opengameart.org/content/castle-stage). The fourteen voice clips come from the [Dreamybull soundboard](https://www.myinstants.com/en/search/?name=dreamybull). The original audio files are in `assets/audio` and are embedded in the HTML for offline play.

To rebuild the self-contained HTML after editing the source, run `node build.mjs`.
To run the automated full campaign and boss checks in a local Chromium browser, run `node .qa/chrome.mjs test`. Set `BUSS_TEST_CHROME` if your browser is installed at a different path.

The [internal game reference](docs/GAME-DESIGN.md) contains the exact tuning, attack patterns, wave rosters, and audio timings.
