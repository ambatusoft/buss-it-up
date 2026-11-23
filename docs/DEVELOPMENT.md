# Development and GitHub Pages

Updated 2026-11-23. Run these commands from the repository root. The build uses Node.js built-ins. Browser checks use Chrome or Chromium. Open `index.html` to play offline.

```sh
node build.mjs
node build.mjs --check
node scripts/refresh-reference.mjs
node scripts/refresh-reference.mjs --check
node tests/browser/chrome.mjs story --http
node tests/browser/chrome.mjs story
node tests/browser/chrome.mjs audio
```

The build freshness command verifies all bundled assets and the generated HTML without rewriting the file. The reference freshness command checks the generated tables. Run `node scripts/refresh-reference.mjs` after changing documented gameplay data or track assignments.

Commit and push finished changes to GitHub after local verification passes.

The Story test runs the single ruleset with two fixed seeds. Each run covers all 30 levels and 172 rounds. It checks simultaneous Final Wave deployment, ending HUD labels, the sixth-map gate, tutorial and touch input, double-click purchases, weighted point accounting, Nut Effects, boss control resistance, timed bonus waves, speed medals, a frozen finish clock during victory animations, rematches, Files, result actions, and seven legacy save versions. It uses a 1280 × 720 viewport at 2× pixel density, with additional 390 px and 320 px HUD layout assertions using both native display and wider fallback fonts. `--http` serves it at `/buss-it-up/` on loopback. Omit `--http` to test the file origin. Set `BUSS_TEST_CHROME` if your browser is installed elsewhere.

| Change | Check |
| --- | --- |
| Combat or balance | Run the full Story test and review retries and minimum Vibe by area for both seeds |
| Devil pendant | The Story test checks independent DPS, boss hits, healing sources, follow position, save migration, and the sole 6-4 reward. Use `devil-companion` and `devil-reward` captures |
| Gear or skill data | Check the generated reference and the in-game slot, stats, tree detail, and purchase flows |
| Maps, files, or menus | Use screenshot modes `story-map`, `mobile-story`, `story-skills`, `mobile-skills`, and `catalog` with `node tests/browser/chrome.mjs <mode>` |
| Gameplay layout | Use `gameplay`, `final-wave`, `double-dash`, `story-boss`, `mobile-story-boss`, `hellboot`, `hellboot-cracks`, `hellboot-portrait`, `hellboot-shatter`, `hellboot-blackout`, `star-burst`, `revive`, `story-win`, `mobile-win`, or `story-loss` captures and check keyboard, pointer, and touch input |
| Audio | Run the audio check. It decodes all assets, resolves each stinger boundary, checks repeated combat events, measures the full failure cue and revive trigger, and checks track resume, menu continuity, and attempt-audio cancellation on leave or retry |
| Storage | Test three isolated slots, v1–v7 Story profiles, retained equipment, and furthest main route after a replay or bonus clear |

Screenshot captures are ignored by Git. The audio harness runs muted. Listen in a normal browser when changing cue selection, mix, or loop seams. Keep source credits in the manifest and lore ledger. The [asset pipeline](ASSET-PIPELINE.md) describes asset sources, drawing conventions, and encoding.

For soundtrack balance, measure integrated loudness with `ffmpeg -i TRACK -af ebur128 -f null -`. The November 12 mix targets roughly −27 LUFS for ordinary stages and −26 LUFS for bosses after the track and combat gains, before the shared master bus, narration ducking, and limiter. Keep the menu quieter than gameplay.

## Editing voice cues

Use a full cue for a failure, revival, or a line whose words must all land. For a short combat excerpt, set the source start and earliest acceptable end in `src/audio.js`. Listen to find the earliest point after the intended words. The browser then looks ahead up to 0.48 seconds for three consecutive quiet 20 ms windows across all channels. The checker reports the chosen timestamp and fails if the excerpt is silent, too long, outside its buffer, or falls back to a fade. The detector measures silence and cannot recognize spoken words. Adjust the earliest end or choose a different excerpt if the selected pause splits the phrase.

## Publishing

The root already contains the built `index.html` and `.nojekyll`. The public repository is ready for branch-based static hosting on GitHub Pages. No separate server or package installation is needed. [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/(root)**, then **Save**.
4. Wait for **pages build and deployment** to succeed under **Actions**. Return to **Settings → Pages** and choose **Visit site**.
5. The default project address is [ambatusoft.github.io/buss-it-up](https://ambatusoft.github.io/buss-it-up/). Check Start, audio after a gesture, map travel, and progress after reload.

These steps follow GitHub's branch publishing instructions. Later pushes to `main` publish the updated game automatically. The separate **Check game** workflow verifies the bundled game and audio. [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Keep navigation inside the static page and any future asset paths relative. Browser progress is scoped to its origin.
