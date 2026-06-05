# Demo Script (concise)

场景：开发者维护多工具规则，想用一份源文件同步。
痛点：多 AI 编程工具的规则、Skills、配置不用再手动复制。
GitHub：https://github.com/EA-Studio-SHARK/ai-global-sync

1. 准备 `global.md`（示例规则）。
2. 终端运行 `npx ai-global-sync global.md`。
3. 打开以下目标文件确认同步：
   - `~/.claude/CLAUDE.md`
   - `~/.cursor/rules/global.md`
   - `~/.codex/AGENTS.md`
   - `~/.windsurf/rules.md`
4. 修改 `global.md` 再次运行命令，展示 diff 被同步。
5. 强调：
   - 本地优先，无需云账号
   - 自动创建缺失目录，未变更文件跳过
   - 输出 JSON 摘要便于脚本集成
6. 引导：Star 仓库 + 提 Issue 请求更多适配。

English quick steps:
1) Prepare `global.md` as single source.
2) Run `npx ai-global-sync global.md`.
3) Verify targets as above.
4) Modify `global.md`, re-run, show updates.
5) Highlight local-first, auto dir creation, skip unchanged, JSON output.
6) CTA: Star repo & request adapters.
