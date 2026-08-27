import { describe, it, expect, vi } from 'vitest';
import { defaultRegistry, ClaudeCodeAdapter, CursorAdapter, CodexAdapter, GeminiAgentAdapter, AiderAdapter, GenericAgentAdapter } from '../src/adapters/index.js';
import type { ProjectBrief } from '../src/types/index.js';

describe('Agent Adapters & Detection Registry', () => {
  const dummyBrief: ProjectBrief = {
    projectName: 'DemoApp',
    tagline: 'Test Tagline',
    targetAudience: 'Users',
    problemStatement: 'Problem',
    coreFeatures: ['Feature 1'],
    visualDirection: 'minimal-clean',
    copyTone: 'professional-clear',
    animationPreference: 'subtle-snappy',
    stack: {
      frontend: 'nextjs',
      backend: 'nextjs-api',
      database: 'supabase',
      deployment: 'vercel',
    },
    createdAt: '2026-08-27',
  };

  it('registers all default agent adapters', () => {
    const adapters = defaultRegistry.getAll();
    expect(adapters.length).toBe(6);
    expect(defaultRegistry.get('claude')).toBeInstanceOf(ClaudeCodeAdapter);
    expect(defaultRegistry.get('cursor')).toBeInstanceOf(CursorAdapter);
    expect(defaultRegistry.get('codex')).toBeInstanceOf(CodexAdapter);
    expect(defaultRegistry.get('gemini')).toBeInstanceOf(GeminiAgentAdapter);
    expect(defaultRegistry.get('aider')).toBeInstanceOf(AiderAdapter);
    expect(defaultRegistry.get('generic')).toBeInstanceOf(GenericAgentAdapter);
  });

  it('generic adapter is always installed and ready', async () => {
    const generic = defaultRegistry.get('generic')!;
    const result = await generic.detect();
    expect(result.isInstalled).toBe(true);
    expect(result.commandName).toBe('clipboard');
  });

  it('generates correct launch commands for adapters', () => {
    const claude = new ClaudeCodeAdapter();
    const claudeCmd = claude.getLaunchCommand({
      briefPath: './test-brief.md',
      prompt: 'Prompt text',
      brief: dummyBrief,
    });
    expect(claudeCmd.command).toBe('claude');
    expect(claudeCmd.args).toContain('-p');

    const cursor = new CursorAdapter();
    const cursorCmd = cursor.getLaunchCommand({
      briefPath: './test-brief.md',
      prompt: 'Prompt text',
      brief: dummyBrief,
    });
    expect(cursorCmd.command).toBe('cursor');
    expect(cursorCmd.args).toEqual(['.', './test-brief.md']);

    const aider = new AiderAdapter();
    const aiderCmd = aider.getLaunchCommand({
      briefPath: './test-brief.md',
      prompt: 'Prompt text',
      brief: dummyBrief,
    });
    expect(aiderCmd.command).toBe('aider');
    expect(aiderCmd.args).toContain('--read');
  });

  it('detectAll runs without throwing even if CLIs are missing', async () => {
    const results = await defaultRegistry.detectAll();
    expect(results.length).toBe(6);
    for (const item of results) {
      expect(item.result.name).toBeTruthy();
      expect(typeof item.result.isInstalled).toBe('boolean');
    }
  });
});
