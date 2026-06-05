# AI Global Sync 发布帖（中文）

- 产品名：AI Global Sync
- 核心价值：一份本地规则文件同步到 Claude Code / Cursor / Codex / Windsurf 等多个 AI 工具，避免多处手动维护与漂移。
- 一句话介绍：一条命令，把你的全局规则和 Skills 同步到所有 AI 编码工具的配置路径。
- 痛点：多 AI 编程工具的规则、Skills、配置不用再手动复制。
- 安装与运行：
  - `npm install`
  - `npm run build`
  - `node dist/src/index.js --dry-run`（先预览，不写入）
  - `node dist/src/index.js`（自动备份 .bak 并同步规则/Skills；可用 `aigs.config.json` 自定义路径）
- GitHub 仓库：https://github.com/EA-Studio-SHARK/ai-global-sync
- Release 链接：https://github.com/EA-Studio-SHARK/ai-global-sync/releases/tag/v0.1.0
- 适用用户：同时使用 Claude Code / Cursor / Codex / Windsurf 等多工具的开发者、团队内需要统一规则/Skills 的工程师、希望降低规则漂移和入职成本的技术负责人。

## 30 秒演示脚本（口播）
1. 打开终端，展示本地的 `global.md`（一份统一规则）。
2. 运行 `node dist/src/index.js --dry-run` 先预览，再 `node dist/src/index.js` 真同步（自动备份 .bak）。
3. 展示工具配置路径：`~/.claude/CLAUDE.md`、`~/.cursor/rules/global.md`、`~/.codex/AGENTS.md`、`~/.windsurf/rules.md` 以及 Skills 目录内容已同步一致。
4. 强调：本地优先、无需云账号、支持跳过未变更文件。
5. Call to action：Star 仓库 + 提 Issue 请求更多工具适配。
