# Buss It Up!

Open **index.html** in a browser, choose **Start** or **Continue**, and pick one of three slots. The game and soundtrack work offline from this file.

Page left and right through the area maps. Each area has four main levels and a harder **X** branch after level two. The final round is a **Final Wave** or an area boss. First clears earn one skill point, or two for a boss or bonus level. Bonus waves advance on an early clear or when their timer elapses. Each level has a Speed Clear medal with a target shown beside your map record and under the combat timer.

Clear **6-4** to unlock **Endless Edging** on the Burnt Server map. Timed waves overlap. Every sixth wave holds until you defeat the boss and clear all remaining bots, then the run moves to a different arena.

**Upgrades** has six equipment slots and a draggable skill tree. Match a Popper pattern with a Nut Effect and use the build stats to check shot range. Double-click a skill node to buy it. **Files** shows encountered enemies by area. Replay cleared levels for medals, times, and scores, or rematch a cleared area's boss.

## Develop and deploy

From the repository root, run `node build.mjs` after changing the source. Use `node build.mjs --check` for build freshness, `node scripts/refresh-reference.mjs --check` for reference freshness, `node tests/browser/chrome.mjs story --http` for the campaign, and `node tests/browser/chrome.mjs audio` for the soundtrack and voice checks.

- [Maintainer handoff](docs/HANDOFF.md) records current design decisions, how to make changes, and what still needs verification.
- [Story design](docs/design/STORY-CAMPAIGN.md) covers the map, progression, and interface.
- [Gameplay reference](docs/GAME-DESIGN.md) has the exact gear, skill, wave, combat tuning, and audio tables. It contains spoilers.
- [Architecture](docs/ARCHITECTURE.md) explains source ownership, combat state, and saves.
- [Development and GitHub Pages](docs/DEVELOPMENT.md) covers testing and publishing.
- [Art and audio pipeline](docs/ASSET-PIPELINE.md) covers editable graphics, music credits, exact voice sources, and processing.
- [Lore research](docs/design/LORE-RESEARCH.md) links the game's inspiration and gives a workflow for researching new references.
- [TODO](TODO.md), [changelog](CHANGELOG.md), and [contributor instructions](AGENTS.md) track changes.

The cabinet's comic look takes inspiration from [Hi-Fi RUSH](https://news.xbox.com/en-us/2023/01/25/hi-fi-rush-preview-out-now-hands-on/). Narration uses clips from the [Dreamybull soundboard](https://www.myinstants.com/en/search/?name=dreamybull).
