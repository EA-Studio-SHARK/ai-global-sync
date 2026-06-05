# TEST_REPORT

## Test environment
- macOS
- Node runtime: `/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`
- npm CLI: `/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js`

## Test commands
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" install --ignore-scripts --no-audit --no-fund`
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" run build`
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" test`
- `node dist/src/index.js --dry-run`（预览同步计划与备份，不写入）
- `node dist/src/index.js`（实际同步，写入 .bak 备份，含 Skills 目录）
- Fresh-clone validation (clean temp dir):
  - `git clone https://github.com/EA-Studio-SHARK/ai-global-sync.git /tmp/ai-global-sync-clone`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" install --ignore-scripts --no-audit --no-fund`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" run build`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" test`
  - `printf 'demo rules' > global.md`
  - `mkdir -p skills && echo 'sample skill' > skills/sample.md`
  - `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" /Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node dist/src/index.js --dry-run`
  - `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" /Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node dist/src/index.js`

## Passed
- Build completed successfully
- Automated tests passed: 6/6（含 dry-run/备份/Skills 同步/配置文件 CLI 覆盖）— local repo；最新一轮 `npm test`：tests 6 / pass 6 / fail 0 / exit code 0。
- Fresh clone tests: build & tests passed (remote HEAD commit 5becd1494e519afbad361e7ba854fbeca96713f5)，README dry-run/写入命令产出 JSON、生成规则与 Skills 目标文件并写入 .bak；最新一轮 fresh clone `npm test`: tests 6 / pass 6 / fail 0 / exit code 0。
- Clean-environment install completed successfully with `npm install --ignore-scripts --no-audit --no-fund`

## README command verification
- `npm run build` completed successfully
- `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" node dist/src/index.js --dry-run` prints planned writes (no files changed)
- `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" node dist/src/index.js` outputs JSON summary, writes rules, Skills, and `.bak` backups as expected
- Fresh clone runs mirror上述 dry-run/执行流程，均成功写入目标与备份。

## Notes
- package-lock is tracked; node_modules is ignored.
- Skills 目录同步已实现；支持外部配置文件 `aigs.config.json`、`--dry-run`、覆盖前自动备份 `.bak`。
- README/Release 可公开访问；npx 命令已移除，避免未发布包报错。
