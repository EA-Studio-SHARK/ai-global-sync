# Demo Script (concise)

场景：开发者维护多工具规则，想用一份源文件同步。
痛点：多 AI 编程工具的规则、Skills、配置不用再手动复制。
GitHub：https://github.com/EA-Studio-SHARK/ai-global-sync

1. 准备 `global.md`（示例规则）与可选 `skills/` 目录。
2. 终端运行 `node dist/src/index.js --dry-run` 预览，再运行 `node dist/src/index.js` 同步（覆盖前会生成 `.bak` 备份）。
3. 打开以下目标文件/目录确认同步：
   - `~/.claude/CLAUDE.md`
   - `~/.cursor/rules/global.md`
   - `~/.codex/AGENTS.md`
   - `~/.windsurf/rules.md`
   - Skills 目录（如 `~/.claude/skills` 等）
4. 修改 `global.md` 或 `skills/` 再次运行命令，展示 diff 被同步。
5. 强调：
   - 本地优先，无需云账号
   - 自动创建缺失目录，未变更文件跳过
   - 输出 JSON 摘要便于脚本集成
6. 引导：Star 仓库 + 提 Issue 请求更多适配。

English quick steps:
1) Prepare `global.md` as single source + optional `skills/` folder.
2) Run `node dist/src/index.js --dry-run`, then `node dist/src/index.js` (with backups).
3) Verify targets as above (including Skills folders).
4) Modify `global.md` / `skills/`, re-run, show updates.
5) Highlight local-first, auto dir creation, backups, skip unchanged, JSON output.
6) CTA: Star repo & request adapters.
