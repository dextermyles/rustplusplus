# Copilot / AI Agent Instructions for rustplusplus

This file captures the minimal, concrete context an AI coding agent needs to be immediately productive in this repository.

## Big picture
- Project: NodeJS Discord bot for Rust (rustplusplus). Main entry: `index.ts` → `src/structures/DiscordBot.js` which coordinates commands, events, instances and rust+ connections.
- Runtime: Runs with `ts-node` (TypeScript entrypoint) but codebase contains many `.js` modules (CommonJS `module.exports`) mixed with `.ts`. Expect interop via `ts-node` / Node resolution.
- Key responsibilities:
  - `DiscordBot` (central client) loads commands from `src/commands/*.js`, events from `src/discordEvents/*.js`, and localizations from `src/languages/*.json`.
  - `instances/` and `credentials/` store per-guild JSON state. Use `src/util/instanceUtils.js` to read/write them.
  - Integrations: `rustplus.js` (FCM push receiver), Battlemetrics, Steam APIs, and asset updater (`update_assets.js`).

## How to run & test locally
- Start the bot (development): set required env vars (see `config/index.js`) and run:
  - `npm start` → `ts-node .` (recommended for quick start)
- Type-check only: `npm test` (runs `tsc --noEmit -p .`) — there is no unit-test suite.
- Update local Rust assets: `node update_assets.js "<PATH_TO_STEAM_RUST_INSTALL>"` or `npm run assets` (script expects Steam path).
- Debug / live reload: a `nodemon` command exists as `watch:debug` string near package.json (not in `scripts`). You can run:
  - `nodemon --inspect=5858 -e ts,tsx --exec node -r ts-node/register ./index.ts`
- Directories created at startup: `logs/`, `instances/`, `credentials/`, `maps/` (see `index.ts` helper).

## Project-specific conventions & patterns
- Formatting & style: see `CONTRIBUTING.md` — 4 spaces indentation, single quotes, no unused variables, use `===`.
- Commands:
  - Location: `src/commands/*.js` (files are loaded by `loadDiscordCommands()` and must end in `.js`).
  - Interface: export an object with at least `name`, `getData(client, guildId)` (returns `SlashCommandBuilder`) and `async execute(client, interaction)`.
  - Example: `src/commands/help.js` uses `getData` with `@discordjs/builders` and `execute(client, interaction)` which calls `client.intlGet` and `DiscordMessages`.
- Events: `src/discordEvents/*.js` must export `{ name, once?, execute(client, ...args) }` and are wired up by `loadDiscordEvents()`.
- Permissions: check `client.validatePermissions(interaction)` before mutating actions. Use `client.logInteraction(interaction, verifyId, 'slashCommand')` for consistent logging.
- Localization: messages live under `src/languages/*.json` and are accessed via `client.intlGet(guildId, id, variables)`. When adding new user-facing text, add new keys to `src/languages/en.json` and propagate to others.
- Config via env vars: variables referenced in `config/index.js` (e.g. `RPP_DISCORD_TOKEN`, `RPP_DISCORD_CLIENT_ID`, `RPP_LANGUAGE`, `RPP_POLLING_INTERVAL`, `RPP_STEAM_API_KEY`, `RPP_GROQ_TOKEN`). Document changes to environment requirements in `README.md`.
- Persistent state: modify `instances/<guildId>.json` or use `InstanceUtils` helpers; credentials stored in `credentials/<guildId>.json`.

## Integration and extension notes
- rustplus integration: uses a forked `rustplus.js` dependency pinned to a commit in `package.json`. Be careful if upgrading—tests are manual.
- FCM listeners for Rust+ push: created per guild in `setupGuild()` via `util/FcmListener` and `util/FcmListenerLite`.
- Registering slash commands: performed during `setupGuild()` via `discordTools/RegisterSlashCommands.js` (requires proper `clientId` and `token`).
- Updating server-specific templates: `templates/notificationSettingsTemplate.json` and `templates/generalSettingsTemplate.json` are used as seeds for new guild instances.

## Safety & common pitfalls
- The code mixes CommonJS & ESM/TS. Running locally uses `ts-node` which handles the mix — do not assume a plain `node` run will work without transpilation or `-r ts-node/register`.
- There is no automated test coverage. Use `npm test` (typecheck) and manual end-to-end testing in a test Discord server.
- Some package.json fields (like `watch:debug`) are present outside `scripts`—run the exact `nodemon` command shown if you need hot reload.

## Quick checklist for code changes
- Follow `CONTRIBUTING.md` styling rules.
- If adding commands: add command file to `src/commands/`, export `name`, `getData`, `execute`, and add `intl` keys for any user-facing text.
- If changing APIs or behavior: update `docs/*` or `README.md` accordingly.
- Ensure `instances/` and `credentials/` changes are backward-compatible and avoid manual edits on production guilds without backups.

---
If any of these sections are unclear or you'd like more examples (e.g., a template PR checklist or a sample command change), tell me which part to expand and I will iterate. ✅
