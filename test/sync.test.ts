import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { expandHome, syncContent, syncSkills, runCli } from '../src/index.js';

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

test('syncContent supports dry-run and backups', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-skip-'));
  const source = path.join(tmp, 'global.md');
  const target = path.join(tmp, 'rule.md');
  writeFileSync(source, 'same content', 'utf8');
  writeFileSync(target, 'same content', 'utf8');

  const dryRun = syncContent(source, [target], { dryRun: true });
  assert.equal(dryRun[0].status, 'dry-run');
  assert.equal(existsSync(`${target}.bak`), false);

  writeFileSync(source, 'updated', 'utf8');
  const results = syncContent(source, [target], { dryRun: false, backup: true });
  assert.equal(results[0].status, 'synced');
  assert.equal(readFileSync(target, 'utf8'), 'updated');
  assert.equal(readFileSync(`${target}.bak`, 'utf8'), 'same content');
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
  assert.equal(parsed.sourceRules, source);
  assert.ok(Array.isArray(parsed.results.rules));
});

test('syncSkills copies directories with backup', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-skills-'));
  const srcSkills = path.join(tmp, 'skills-src');
  const destSkills = path.join(tmp, 'skills-dest');
  mkdirSync(srcSkills, { recursive: true });
  writeFileSync(path.join(srcSkills, 'skill1.md'), 's1', 'utf8');
  mkdirSync(destSkills, { recursive: true });
  writeFileSync(path.join(destSkills, 'old.md'), 'old', 'utf8');

  const dry = syncSkills(srcSkills, [destSkills], { dryRun: true });
  assert.equal(dry[0].status, 'dry-run');
  assert.equal(readFileSync(path.join(destSkills, 'old.md'), 'utf8'), 'old');

  const res = syncSkills(srcSkills, [destSkills], { dryRun: false, backup: true });
  assert.equal(res[0].status, 'synced');
  assert.equal(readFileSync(path.join(destSkills, 'skill1.md'), 'utf8'), 's1');
  assert.equal(readFileSync(`${destSkills}.bak/old.md`, 'utf8'), 'old');
});

test('runCli respects config file and dry-run', () => {
  const tmp = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-cli-config-'));
  const configPath = path.join(tmp, 'aigs.config.json');
  const source = path.join(tmp, 'global.md');
  writeFileSync(source, 'cfg', 'utf8');
  const skillSource = path.join(tmp, 'skills');
  mkdirSync(skillSource, { recursive: true });
  writeFileSync(path.join(skillSource, 'k.md'), 'k', 'utf8');

  const destRule = path.join(tmp, 'out', 'rule.md');
  const destSkill = path.join(tmp, 'out', 'skills');
  const cfg = {
    sourceRules: source,
    sourceSkills: skillSource,
    tools: [{ name: 't', configPath: destRule, skillPath: destSkill }]
  };
  writeFileSync(configPath, JSON.stringify(cfg), 'utf8');

  const payload = runCli(['--config', configPath, '--dry-run']);
  assert.equal(payload.options.dryRun, true);
  assert.equal(payload.results.rules[0].status, 'dry-run');
  assert.equal(payload.results.skills[0].status, 'dry-run');

  runCli(['--config', configPath]);
  assert.equal(readFileSync(destRule, 'utf8'), 'cfg');
  assert.equal(readFileSync(path.join(destSkill, 'k.md'), 'utf8'), 'k');
});
