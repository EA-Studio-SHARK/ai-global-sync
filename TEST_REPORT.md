# TEST_REPORT

## Test environment
- macOS
- Node runtime: `/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`
- npm CLI: `/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js`

## Test commands
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" install --ignore-scripts --no-audit --no-fund`
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" run build`
- `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" test`
- Fresh-clone validation (clean temp dir):
  - `git clone https://github.com/EA-Studio-SHARK/ai-global-sync.git /tmp/ai-global-sync-clone`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" install --ignore-scripts --no-audit --no-fund`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" run build`
  - `"/Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" "/Users/shark/Downloads/EA科技/.tooling/npm-11.4.1/bin/npm-cli.js" test`
  - `printf 'demo rules' > global.md`
  - `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" /Users/shark/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node dist/src/index.js global.md`

## Passed
- Build completed successfully
- Automated tests passed: 4/4 (includes CLI entrypoint logging) — local repo
- Fresh clone tests: build & 3/3 tests passed (remote HEAD), README command produced JSON and created targets
- Clean-environment install completed successfully with `npm install --ignore-scripts --no-audit --no-fund`

## README command verification
- `npm run build` completed successfully
- `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" node dist/src/index.js global.md` outputs JSON summary and writes targets as expected
- Fresh clone run: `TMP_HOME=$(mktemp -d); HOME="$TMP_HOME" node dist/src/index.js global.md` prints JSON and creates target files under $HOME as configured

## Notes
- package-lock is tracked; node_modules is ignored.
- Quality gate、公开仓库、Release、宣发素材均已完成；README/Release 可公开访问。
