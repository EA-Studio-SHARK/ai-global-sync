# AI Global Sync

`AI Global Sync` is a local-first CLI that keeps one source rules file in sync across the configuration paths used by AI tools like Claude Code, Cursor, Codex, and Windsurf.

> TL;DR: 一条命令解决「多 AI 编程工具规则/Skills 反复手动复制」的痛点。安装后运行：`npm install && npm run build && node dist/src/index.js global.md`（或 `npx ai-global-sync global.md`）。

## Why it exists

AI workflows often drift because each tool stores instructions in a different place. This CLI gives you one canonical rules file and copies it to the places your tools actually read.

## Features

- Sync one source file to multiple destinations
- Create missing parent directories automatically
- Skip files that are already up to date
- Print a JSON summary in CLI mode

## Quick start

```bash
npm install
npm run build
node dist/src/index.js global.md
# or
npx ai-global-sync global.md
```

By default, the CLI syncs `global.md` into the tool paths listed in `src/index.ts`.

## Example workflow

1. Edit `global.md` once.
2. Run the sync command.
3. Open each target tool and confirm the updated rules were copied over.

## Development

```bash
npm run lint
npm test
```

## Notes

- The project is designed for local use only.
- No cloud account or telemetry is required.
- You can customize target paths in `src/index.ts`.
