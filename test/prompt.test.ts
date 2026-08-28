import { describe, it, expect } from 'vitest';
import { generateAgentPrompt } from '../src/generator/prompt.js';
import type { ProjectBrief } from '../src/types/index.js';

describe('AI Agent Prompt Generator', () => {
  const baseBrief: ProjectBrief = {
    projectName: 'FlowVibe AI',
    tagline: 'Visual node-based orchestration for multi-model workflows.',
    targetAudience: 'AI engineers & data scientists',
    problemStatement: 'Writing Python scripts for every pipeline iteration is slow and error-prone.',
    coreFeatures: [
      'Infinite canvas node editor with drag-and-drop connections',
      'Realtime token stream preview panel',
      'Export workflow to runnable TypeScript/Python code',
    ],
    visualDirection: 'dark-cyberpunk',
    copyTone: 'technical-precise',
    animationPreference: 'smooth-organic',
    stack: {
      frontend: 'nextjs',
      backend: 'hono',
      database: 'sqlite-turso',
      deployment: 'cloudflare-pages',
    },
    createdAt: '2026-08-27',
  };

  it('formats prompt tailored for Claude Code', () => {
    const prompt = generateAgentPrompt(baseBrief, 'claude');
    expect(prompt).toContain('# Task: Build FlowVibe AI');
    expect(prompt).toContain('Instructions for Claude Code');
    expect(prompt).toContain('Visual node-based orchestration');
  });

  it('formats prompt tailored for Cursor', () => {
    const prompt = generateAgentPrompt(baseBrief, 'cursor');
    expect(prompt).toContain('/* Cursor Composer Prompt & Context */');
    expect(prompt).toContain('Project: FlowVibe AI');
    expect(prompt).toContain('@glidingvibe-brief.md');
  });

  it('formats prompt tailored for OpenAI Codex', () => {
    const prompt = generateAgentPrompt(baseBrief, 'codex');
    expect(prompt).toContain('# CODEX AGENT BUILD INSTRUCTION');
    expect(prompt).toContain('Target Application: FlowVibe AI');
  });

  it('formats prompt tailored for Gemini / Antigravity CLI', () => {
    const prompt = generateAgentPrompt(baseBrief, 'gemini');
    expect(prompt).toContain('<BUILD_DIRECTIVE>');
    expect(prompt).toContain('System Role: Autonomous Full-Stack Engineer');
    expect(prompt).toContain('FlowVibe AI');
    expect(prompt).toContain('</BUILD_DIRECTIVE>');
  });

  it('formats prompt tailored for Aider', () => {
    const prompt = generateAgentPrompt(baseBrief, 'aider');
    expect(prompt).toContain('/read');
    expect(prompt).toContain('Build FlowVibe AI');
  });

  it('formats universal high-octane prompt for generic / clipboard option', () => {
    const prompt = generateAgentPrompt(baseBrief, 'generic');
    expect(prompt).toContain('# AGENT IMPLEMENTATION DIRECTIVE: FLOWVIBE AI');
    expect(prompt).toContain('## 1. Project Overview & Target Audience');
    expect(prompt).toContain('## 2. Technical Stack Architecture');
    expect(prompt).toContain('## 3. UI/UX Design System & Aesthetic Directives');
    expect(prompt).toContain('## 4. Cybersecurity & Application Defense Directives');
    expect(prompt).toContain('## 5. Feature Requirements');
    expect(prompt).toContain('## 6. Execution Instructions for the AI Agent');
  });
});
