# Working on Buss It Up!

Read [README.md](README.md) and [architecture](docs/ARCHITECTURE.md) first. Check [TODO.md](TODO.md) for the next task and [CHANGELOG.md](CHANGELOG.md) for completed changes. Use the [gameplay reference](docs/GAME-DESIGN.md), [story design](docs/design/STORY-CAMPAIGN.md), and [lore research](docs/design/LORE-RESEARCH.md) to verify mechanics and references.

Read the [maintainer handoff](docs/HANDOFF.md) for current decisions and outstanding checks. Use the [art and audio pipeline](docs/ASSET-PIPELINE.md) when adding graphics, sound, or music.

- Inspect Git status and the relevant source before editing. Preserve unrelated changes. Run commands from the repository root.
- Keep the static offline entry point. Rebuild with `node build.mjs` and include the resulting `index.html` when source inputs change.
- Regenerate the marked gameplay tables with `node scripts/refresh-reference.mjs`. The [development guide](docs/DEVELOPMENT.md) lists the verification commands. Run both campaign seeds when changing combat and check legacy Story migration when changing saves.
- Update the active task, dated changelog, and relevant documentation. Record the checks that passed and any verification still pending.
