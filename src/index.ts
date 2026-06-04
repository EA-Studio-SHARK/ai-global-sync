#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

export type ToolConfig = {
  name: string;
  configPath: string;
  skillPath?: string;
};

export const tools: ToolConfig[] = [
  { name: 'claude-code', configPath: '~/.claude/CLAUDE.md', skillPath: '~/.claude/skills' },
  { name: 'cursor', configPath: '~/.cursor/rules/global.md', skillPath: '~/.cursor/skills' },
  { name: 'codex', configPath: '~/.codex/AGENTS.md', skillPath: '~/.codex/skills' },
  { name: 'windsurf', configPath: '~/.windsurf/rules.md', skillPath: '~/.windsurf/skills' }
];

export function expandHome(input: string): string {
  return input.startsWith('~/') ? path.join(process.env.HOME ?? '', input.slice(2)) : input;
}

export function ensureDir(filePath: string) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

export function syncContent(sourceFile: string, targets: string[]) {
  const source = readFileSync(sourceFile, 'utf8');
  const results: Array<{ target: string; status: 'synced' | 'created' | 'skipped'; reason?: string }> = [];
  for (const target of targets) {
    const resolved = expandHome(target);
    ensureDir(resolved);
    const before = existsSync(resolved) ? readFileSync(resolved, 'utf8') : '';
    if (before === source) {
      results.push({ target: resolved, status: 'skipped', reason: 'already up to date' });
      continue;
    }
    writeFileSync(resolved, source, 'utf8');
    results.push({ target: resolved, status: before ? 'synced' : 'created' });
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [,, sourceFile = 'global.md'] = process.argv;
  const result = syncContent(sourceFile, tools.map(t => t.configPath));
  console.log(JSON.stringify(result, null, 2));
}
