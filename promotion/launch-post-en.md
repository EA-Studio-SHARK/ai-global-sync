# AI Global Sync Launch Post (EN)

- Product: AI Global Sync
- Core value: keep one local rules file in sync across Claude Code / Cursor / Codex / Windsurf, no more multi-place edits.
- One-liner: One command to sync your global rules and Skills into every AI coding tool config path.
- Pain: Stop copy/pasting rules and Skills across multiple AI coding tools.
- Install & run:
  - `npm install`
  - `npm run build`
  - `node dist/src/index.js --dry-run` (preview only)
  - `node dist/src/index.js` (writes with .bak backups; customize paths via `aigs.config.json`)
- GitHub repo: https://github.com/EA-Studio-SHARK/ai-global-sync
- Release: https://github.com/EA-Studio-SHARK/ai-global-sync/releases/tag/v0.1.0
- Ideal users: developers using multiple AI coding tools, teams needing a single source of truth for rules/Skills, eng leads reducing drift and onboarding cost.

## 30s demo script
1. Show `global.md` (single source of truth).
2. Run `node dist/src/index.js --dry-run` then `node dist/src/index.js` (with backups) to sync rules and Skills.
3. Open `~/.claude/CLAUDE.md`, `~/.cursor/rules/global.md`, `~/.codex/AGENTS.md`, `~/.windsurf/rules.md` and Skills folders to show synced content.
4. Highlight: local-first, no cloud account, skips unchanged files.
5. Call to action: Star the repo and request more adapters via Issues.
