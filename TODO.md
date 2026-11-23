# Release checklist

Updated 2026-11-23. Completed development history lives in [CHANGELOG.md](CHANGELOG.md). Current mechanics and verification guidance live in the [maintainer handoff](docs/HANDOFF.md).

## Current task

- [x] Change I'm in Love with Satan to halve all healing and retune its independent companion to 150% of default Popper DPS.
- [x] Compare companion damage against other pendants across two late-game seeds, including both finales.
- [x] Cover fractional healing, healing bonuses, wave recovery, pickups, skills, and boss-phase recovery in browser checks.
- [x] Fix narrow HUD spacing with wider system fallback fonts.
- [x] Remove the superseded implementation plan and temporary balance tools. Consolidate current documentation and preserve historical changes and source credits.
- [x] Rebuild the offline game and run both campaign seeds, audio, asset inventory, documentation links, and generated-file checks before pushing. Check GitHub's workflow after the push.

## Launch

- [ ] Enable GitHub Pages from **main / (root)** and smoke-test the published URL. [Publishing steps](docs/DEVELOPMENT.md#publishing)
- [ ] Check landscape touch controls on a physical device and listen to the mix on speakers and headphones. Browser automation covers simulated touch and muted audio timing.
- [ ] Human-playtest the revised pendant and late bonus stages with several builds. Automated comparisons are useful balance evidence, not a substitute for player feedback.

## Known limits

- Saves support one active play session per browser origin. Simultaneous changes in two tabs can race; profile IDs prevent stale results after a reset.
- The offline build is about 27.5 MB. Verify first-load time on a slow connection before adding more media.
- Voice and thumbnail provenance is recorded in the [asset pipeline](docs/ASSET-PIPELINE.md). Separate redistribution permissions remain unverified.
