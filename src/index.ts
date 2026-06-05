#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export type ToolConfig = {
  name: string;
  configPath: string;
  skillPath?: string;
};

export type SyncStatus = 'synced' | 'created' | 'skipped' | 'dry-run';

export type SyncResult = {
  target: string;
  status: SyncStatus;
  reason?: string;
  kind?: 'rules' | 'skills';
};

type SyncOptions = {
  dryRun?: boolean;
  backup?: boolean;
};

export type AigsConfig = {
  sourceRules?: string;
  sourceSkills?: string;
  tools?: ToolConfig[];
};

export const tools: ToolConfig[] = [
  { name: 'claude-code', configPath: '~/.claude/CLAUDE.md', skillPath: '~/.claude/skills' },
  { name: 'cursor', configPath: '~/.cursor/rules/global.md', skillPath: '~/.cursor/skills' },
  { name: 'codex', configPath: '~/.codex/AGENTS.md', skillPath: '~/.codex/skills' },
  { name: 'windsurf', configPath: '~/.windsurf/rules.md', skillPath: '~/.windsurf/skills' }
];

function resolvePath(p?: string): string | undefined {
  if (!p) return undefined;
  const resolved = p.startsWith('~/') ? path.join(process.env.HOME ?? '', p.slice(2)) : p;
  return path.isAbsolute(resolved) ? resolved : path.resolve(resolved);
}

export function expandHome(input: string): string {
  return input.startsWith('~/') ? path.join(process.env.HOME ?? '', input.slice(2)) : input;
}

export function ensureDir(filePath: string) {
  mkdirSync(path.dirname(filePath), { recursive: true });
}

function backupFile(target: string, content: string) {
  const backupPath = `${target}.bak`;
  writeFileSync(backupPath, content, 'utf8');
}

function backupDir(targetDir: string) {
  const backupPath = `${targetDir}.bak`;
  cpSync(targetDir, backupPath, { recursive: true, force: true });
}

export function syncContent(sourceFile: string, targets: string[], options: SyncOptions = {}): SyncResult[] {
  const { dryRun = false, backup = true } = options;
  const source = readFileSync(sourceFile, 'utf8');
  const results: SyncResult[] = [];

  for (const target of targets) {
    const resolved = expandHome(target);
    try {
      ensureDir(resolved);
      const before = existsSync(resolved) ? readFileSync(resolved, 'utf8') : '';

      if (dryRun) {
        results.push({ target: resolved, status: 'dry-run', kind: 'rules', reason: before ? 'would update' : 'would create' });
        continue;
      }

      if (before === source) {
        results.push({ target: resolved, status: 'skipped', kind: 'rules', reason: 'already up to date' });
        continue;
      }

      if (backup && before) {
        backupFile(resolved, before);
      }

      writeFileSync(resolved, source, 'utf8');
      results.push({ target: resolved, status: before ? 'synced' : 'created', kind: 'rules' });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      results.push({ target: resolved, status: 'skipped', kind: 'rules', reason });
    }
  }

  return results;
}

export function syncSkills(sourceDir: string, targets: string[], options: SyncOptions = {}): SyncResult[] {
  const { dryRun = false, backup = true } = options;
  const resolvedSource = resolvePath(sourceDir);
  if (!resolvedSource || !existsSync(resolvedSource)) {
    return targets.map((target) => ({ target: expandHome(target), status: 'skipped', kind: 'skills', reason: 'source skills not found' }));
  }

  const results: SyncResult[] = [];

  for (const target of targets) {
    const resolvedTarget = expandHome(target);
    mkdirSync(resolvedTarget, { recursive: true });

    if (dryRun) {
      results.push({ target: resolvedTarget, status: 'dry-run', kind: 'skills', reason: 'would sync directory' });
      continue;
    }

    try {
      if (backup && existsSync(resolvedTarget)) {
        backupDir(resolvedTarget);
      }

      cpSync(resolvedSource, resolvedTarget, { recursive: true, force: true });
      results.push({ target: resolvedTarget, status: 'synced', kind: 'skills' });
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown error';
      results.push({ target: resolvedTarget, status: 'skipped', kind: 'skills', reason });
    }
  }

  return results;
}

function loadConfig(configPath?: string): { config: AigsConfig; configPathUsed?: string } {
  const explicitPath = configPath ? resolvePath(configPath) : undefined;
  const defaultPath = resolvePath('aigs.config.json');
  const selected = explicitPath ?? (defaultPath && existsSync(defaultPath) ? defaultPath : undefined);

  if (selected && existsSync(selected)) {
    const content = readFileSync(selected, 'utf8');
    const parsed = JSON.parse(content) as AigsConfig;
    return { config: parsed, configPathUsed: selected };
  }

  return { config: {} };
}

function parseArgs(argv: string[]) {
  let sourceRules: string | undefined;
  let configPath: string | undefined;
  let dryRun = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--config' && argv[i + 1]) {
      configPath = argv[i + 1];
      i++;
      continue;
    }
    if (arg === '--dry-run') {
      dryRun = true;
      continue;
    }
    if (!arg.startsWith('-') && !sourceRules) {
      sourceRules = arg;
    }
  }

  return { sourceRules, configPath, dryRun };
}

export function runCli(argv = process.argv.slice(2)) {
  const { sourceRules: sourceRulesArg, configPath, dryRun } = parseArgs(argv);
  const { config, configPathUsed } = loadConfig(configPath);

  const sourceFile = resolvePath(sourceRulesArg ?? config.sourceRules ?? 'global.md')!;
  const sourceSkills = config.sourceSkills;
  const toolList = config.tools && config.tools.length ? config.tools : tools;

  const resultsRules = syncContent(sourceFile, toolList.map((tool) => tool.configPath), { dryRun, backup: true });
  const skillTargets = toolList.filter((t) => t.skillPath).map((t) => t.skillPath!) as string[];
  const skillResults = sourceSkills && skillTargets.length > 0 ? syncSkills(sourceSkills, skillTargets, { dryRun, backup: true }) : [];

  const payload = {
    sourceRules: sourceFile,
    sourceSkills,
    configPath: configPathUsed,
    options: { dryRun, backup: true },
    results: { rules: resultsRules, skills: skillResults }
  };

  console.log(JSON.stringify(payload, null, 2));
  return payload;
}

const entryFile = process.argv[1];
if (entryFile) {
  const entryUrl = pathToFileURL(entryFile).href;
  if (import.meta.url === entryUrl) {
    runCli();
  }
}
