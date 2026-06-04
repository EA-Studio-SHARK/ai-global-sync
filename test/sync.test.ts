import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncContent, expandHome } from '../src/index.js';

test('expandHome resolves home shorthand', () => {
  const expected = path.join(process.env.HOME ?? '', '.claude/test.md');
  assert.equal(expandHome('~/.claude/test.md'), expected);
});

test('syncContent writes source to targets', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ai-global-sync-'));
  const source = path.join(dir, 'global.md');
  const target = path.join(dir, 'tool.md');
  writeFileSync(source, '# hello', 'utf8');

  const result = syncContent(source, [target]);
  assert.equal(result[0].status, 'created');
  assert.equal(readFileSync(target, 'utf8'), '# hello');

  writeFileSync(source, '# updated', 'utf8');
  const result2 = syncContent(source, [target]);
  assert.equal(result2[0].status, 'synced');
  assert.equal(readFileSync(target, 'utf8'), '# updated');

  rmSync(dir, { recursive: true, force: true });
});
