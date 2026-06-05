import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { expandHome, syncContent } from '../src/index.js';

test('expandHome resolves home-prefixed paths', () => {
  const originalHome = process.env.HOME;
  process.env.HOME = '/tmp/home-test';
  assert.equal(expandHome('~/.claude/CLAUDE.md'), '/tmp/home-test/.claude/CLAUDE.md');
  process.env.HOME = originalHome;
});

test('syncContent creates and updates targets', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-'));
  const source = path.join(tmp, 'global.md');
  const target = path.join(tmp, 'nested', 'rule.md');
  writeFileSync(source, 'hello world', 'utf8');

  const first = syncContent(source, [target]);
  assert.equal(first[0].status, 'created');
  assert.equal(readFileSync(target, 'utf8'), 'hello world');

  writeFileSync(source, 'new content', 'utf8');
  const second = syncContent(source, [target]);
  assert.equal(second[0].status, 'synced');
  assert.equal(readFileSync(target, 'utf8'), 'new content');
});

test('syncContent skips files already up to date', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-skip-'));
  const source = path.join(tmp, 'global.md');
  const target = path.join(tmp, 'rule.md');
  writeFileSync(source, 'same content', 'utf8');
  writeFileSync(target, 'same content', 'utf8');

  const results = syncContent(source, [target]);
  assert.equal(results[0].status, 'skipped');
  assert.equal(results[0].reason, 'already up to date');
  assert.equal(existsSync(target), true);
});

test('runCli executes when invoked as entrypoint and prints JSON', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-cli-'));
  const source = path.join(tmp, 'global.md');
  writeFileSync(source, 'cli content', 'utf8');

  const entryPath = path.join(process.cwd(), 'dist', 'src', 'index.js');
  const result = spawnSync('node', [entryPath, source], { encoding: 'utf8' });

  assert.equal(result.status, 0);
  const output = (result.stdout || '').trim();
  assert.ok(output.length > 0, 'CLI should print output');

  const parsed = JSON.parse(output);
  assert.equal(parsed.sourceFile, source);
  assert.ok(Array.isArray(parsed.results));
  assert.ok(parsed.results.length > 0);
});
