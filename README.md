# AI Global Sync

A local-first synchronizer for AI tool rules and Skills.

## What it solves

If you use Claude Code, Cursor, Codex, Windsurf, or similar tools, you often end up copying the same rules and Skills into multiple places. `AI Global Sync` gives you one source file and syncs it to each target.

## Quick start

```bash
npm install
npm run build
node dist/index.js global.md
```

## Example

1. Write your global rules in `global.md`
2. Run the CLI
3. The file is copied into each configured tool path

## Features

- One source of truth for AI rules
- Local-only file sync
- Works with Markdown-based rules and Skills
- Easy to extend for new tools

## How it works

The CLI reads one source file and copies it into target config paths. The current MVP includes a simple adapter list for common AI tools.

## Configuration

Edit the target list in `src/index.ts`.

## Tests

```bash
npm test
```

## License

MIT
