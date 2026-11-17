#!/usr/bin/env node
// Copies the Workbench items a repo asked for into that repo.
//
//   node sync.mjs --source <workbench checkout> --target <repo> [--config workbench.json] [--check]
//
// The repo lists what it wants in workbench.json. The copies are read-only: change them in
// Workbench, not in the repo. A lock file records a hash of every copied file, so --check can
// tell when someone edited a copy by hand.
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, readFileSync, readdirSync, rmSync, rmdirSync, statSync, writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const MARKER = '<!-- Synced from Fallout.Workbench. Edit it there, not here. -->';
const LOCK_NAME = 'workbench.lock.json';
const ITEM_PATTERN = /^(skills\/[a-z0-9][a-z0-9-]*|agents\/[a-z0-9][a-z0-9-]*\.md|commands\/[a-z0-9][a-z0-9-]*\.md)$/;

const { values } = parseArgs({
  options: {
    source: { type: 'string' },
    target: { type: 'string', default: '.' },
    config: { type: 'string', default: 'workbench.json' },
    check: { type: 'boolean', default: false },
  },
});

const target = path.resolve(values.target);
const configPath = path.resolve(target, values.config);
const lockPath = path.join(path.dirname(configPath), LOCK_NAME);

function fail(message) {
  console.error(`sync: ${message}`);
  process.exit(1);
}

const hash = (text) => createHash('sha256').update(text).digest('hex');
const readLock = () => (existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')).files : {});

function listFiles(dir) {
  // Skip dot-files and dot-folders (.DS_Store, editor or tool state): they are never part of an item.
  return readdirSync(dir, { withFileTypes: true }).filter((entry) => !entry.name.startsWith('.')).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function addMarker(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  if (normalized.startsWith('---\n')) {
    const end = normalized.indexOf('\n---\n', 4);
    if (end !== -1) {
      const cut = end + 5;
      return `${normalized.slice(0, cut)}${MARKER}\n${normalized.slice(cut)}`;
    }
  }
  return `${MARKER}\n${normalized}`;
}

// --check: has anyone edited a copy by hand?
if (values.check) {
  const problems = Object.entries(readLock()).flatMap(([file, expected]) => {
    const full = path.join(target, file);
    if (!existsSync(full)) return [`missing: ${file}`];
    return hash(readFileSync(full, 'utf8')) === expected ? [] : [`edited: ${file}`];
  });
  if (problems.length > 0) {
    fail(`copies differ from Workbench. Run the sync again, and make changes in Workbench.\n  ${problems.join('\n  ')}`);
  }
  console.log('sync: all copies match the lock file.');
  process.exit(0);
}

if (!values.source) fail('--source is required (path to a Workbench checkout).');
const source = path.resolve(values.source);
if (!existsSync(configPath)) fail(`config not found: ${configPath}`);

const config = JSON.parse(readFileSync(configPath, 'utf8'));
const settings = {
  skillsDirs: config.skillsDirs ?? ['.agents/skills'],
  agentsDir: config.agentsDir ?? '.claude/agents',
  commandsDir: config.commandsDir ?? '.claude/commands',
};
const items = config.items ?? [];

// Work out every file to write: relative destination path -> content.
const wanted = new Map();
for (const item of items) {
  if (!ITEM_PATTERN.test(item)) fail(`not a valid item: "${item}". Use skills/<name>, agents/<name>.md or commands/<name>.md.`);
  const from = path.join(source, item);
  if (!existsSync(from)) fail(`not found in Workbench: ${item}`);

  const [kind, name] = item.split('/');
  const destinations = kind === 'skills'
    ? settings.skillsDirs.map((dir) => path.posix.join(dir, name))
    : [path.posix.join(kind === 'agents' ? settings.agentsDir : settings.commandsDir, name)];

  const files = statSync(from).isDirectory() ? listFiles(from) : [from];
  for (const destination of destinations) {
    for (const file of files) {
      const relative = statSync(from).isDirectory() ? path.relative(from, file).split(path.sep).join('/') : '';
      const destFile = relative ? path.posix.join(destination, relative) : destination;
      const text = readFileSync(file, 'utf8');
      wanted.set(destFile, file.endsWith('.md') ? addMarker(text) : text.replace(/\r\n/g, '\n'));
    }
  }
}

// Remove copies that an earlier sync wrote and this one no longer wants.
const oldLock = readLock();
let removed = 0;
for (const file of Object.keys(oldLock)) {
  if (wanted.has(file)) continue;
  rmSync(path.join(target, file), { force: true });
  removed++;
  for (let dir = path.dirname(path.join(target, file)); dir !== target; dir = path.dirname(dir)) {
    if (!existsSync(dir) || readdirSync(dir).length > 0) break;
    rmdirSync(dir);
  }
}

let written = 0;
const files = {};
for (const [file, content] of [...wanted.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const full = path.join(target, file);
  files[file] = hash(content);
  if (existsSync(full) && readFileSync(full, 'utf8') === content) continue;
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, content);
  written++;
}

writeFileSync(lockPath, `${JSON.stringify({ files }, null, 2)}\n`);
console.log(`sync: ${items.length} item(s), ${written} file(s) written, ${removed} removed.`);
