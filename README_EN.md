# AI Global Sync

`AI Global Sync` is a local-first CLI that keeps one source rules file (and optional Skills directory) in sync across the configuration paths used by AI tools like Claude Code, Cursor, Codex, and Windsurf.

> TL;DR: One command fixes the “copy rules/Skills into every AI tool” pain. Install and run: `npm install && npm run build && node dist/src/index.js --dry-run` to preview, then `node dist/src/index.js` to write with backups.

## Why it exists

AI workflows often drift because each tool stores instructions in a different place. This CLI gives you one canonical rules file and copies it to the places your tools actually read.

## Features

- Sync one source rules file to multiple destinations
- Optional Skills sync: copy local `skills/` into each tool’s `skillPath`
- Create missing directories and write `.bak` backups before overwrite
- `--dry-run` preview without touching files
- JSON output for scripting

## Quick start

```bash
npm install
npm run build
node dist/src/index.js --dry-run     # preview writes
node dist/src/index.js               # execute sync with backups
```

Defaults come from `aigs.config.json` in the repo root (falls back to built-in paths). Key fields:

```json
{
  "sourceRules": "global.md",
  "sourceSkills": "skills",
  "tools": [
    { "name": "claude-code", "configPath": "~/.claude/CLAUDE.md", "skillPath": "~/.claude/skills" },
    { "name": "cursor", "configPath": "~/.cursor/rules/global.md", "skillPath": "~/.cursor/skills" },
    { "name": "codex", "configPath": "~/.codex/AGENTS.md", "skillPath": "~/.codex/skills" },
    { "name": "windsurf", "configPath": "~/.windsurf/rules.md", "skillPath": "~/.windsurf/skills" }
  ]
}
```

Change sync targets by editing `aigs.config.json`—no code edits required.

## Development

```bash
npm run lint
npm test
```

## Notes

- The project is designed for local use only.
- No cloud account or telemetry is required.
- Customize targets via `aigs.config.json` in the repo root.
