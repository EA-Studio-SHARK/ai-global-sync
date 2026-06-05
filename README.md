# AI Global Sync

`AI Global Sync` is a local-first CLI that keeps one source rules (and optional Skills directory) in sync across the configuration paths used by AI tools like Claude Code, Cursor, Codex, and Windsurf.

**Keywords:** claude code · cursor · codex · windsurf · rules sync · skills sync

> TL;DR: 一条命令解决「多 AI 编程工具规则/Skills 反复手动复制」的痛点。安装后运行：`npm install && npm run build && node dist/src/index.js --dry-run` 先预览，再 `node dist/src/index.js` 真写入。

## Why it exists

AI workflows often drift because each tool stores instructions in a different place. This CLI gives you one canonical rules file and copies it to the places your tools actually read.

## Features

- Sync one source rules file to multiple destinations
- Optional Skills 目录同步：从本地 `skills/` 目录复制到各工具的 `skillPath`
- 自动创建缺失目录，并在覆盖前生成 `.bak` 备份
- `--dry-run` 预览不会写入
- JSON 输出，便于脚本集成

## Quick start

```bash
npm install
npm run build
node dist/src/index.js --dry-run     # 预览将写入哪些文件
node dist/src/index.js               # 执行同步（会备份 .bak）
```

默认配置来自仓库根目录的 `aigs.config.json`（不存在则使用内置路径）。主要字段：

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

修改同步目标时，只需改 `aigs.config.json`，不用改源码。

## Example workflow

1. 编辑 `global.md` 和 `skills/`（如果有技能目录）。
2. `node dist/src/index.js --dry-run` 确认计划写入与备份。
3. `node dist/src/index.js` 执行同步；如需自定义配置，用 `--config path/to/aigs.config.json`。
4. 打开各工具，确认规则/Skills 已更新。备份文件在同目录的 `.bak` 中。

## Development

```bash
npm run lint
npm test
```

## Notes

- The project is designed for local use only.
- No cloud account or telemetry is required.
- 自定义目标路径与源目录：编辑仓库根的 `aigs.config.json`。
