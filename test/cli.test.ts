import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import path from 'node:path';
import { handleInitCommand } from '../src/commands/init.js';
import { fileExists } from '../src/utils/filesystem.js';

describe('CLI Commands Execution', () => {
  const testOutputPath = './test-output-brief.md';

  afterEach(async () => {
    try {
      await fs.unlink(path.resolve(process.cwd(), testOutputPath));
    } catch {
      // ignore
    }
  });

  it('generates brief non-interactively using template and --yes flag', async () => {
    const brief = await handleInitCommand({
      template: 'ai-workspace',
      output: testOutputPath,
      yes: true,
    });

    expect(brief.projectName).toBe('HyperPrompt Studio');
    expect(brief.outputPath).toBe(testOutputPath);

    const exists = await fileExists(testOutputPath);
    expect(exists).toBe(true);

    const fileContent = await fs.readFile(path.resolve(process.cwd(), testOutputPath), 'utf-8');
    expect(fileContent).toContain('HyperPrompt Studio');
    expect(fileContent).toContain('Streaming Chat Interface');
  });

  it('generates brief for SaaS starter template', async () => {
    const brief = await handleInitCommand({
      template: 'saas-starter',
      output: testOutputPath,
      agent: 'cursor',
      yes: true,
    });

    expect(brief.projectName).toBe('VibeSaaS Studio');
    expect(brief.selectedAgentId).toBe('cursor');

    const fileContent = await fs.readFile(path.resolve(process.cwd(), testOutputPath), 'utf-8');
    expect(fileContent).toContain('VibeSaaS Studio');
    expect(fileContent).toContain('/* Cursor Composer Prompt & Context */');
  });
});
