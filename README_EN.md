# AI Global Sync

A local-first synchronizer for AI tool rules and Skills.

## Problem

Many developers use several AI tools at the same time, and each tool has its own rules or Skills directory. Updating them manually is slow and error-prone.

## Solution

Keep one source file and sync it to every configured tool path.

## Install

```bash
npm install
npm run build
```

## Usage

```bash
node dist/index.js global.md
```

## License

MIT
