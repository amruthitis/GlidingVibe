import { describe, it, expect } from 'vitest';
import { generateMarkdownBrief, filterResourcesForBrief } from '../src/generator/markdown.js';
import type { ProjectBrief } from '../src/types/index.js';

describe('Markdown Brief Generator', () => {
  const sampleBrief: ProjectBrief = {
    projectName: 'Acme Test Studio',
    tagline: 'The smartest test automation suite for modern web apps.',
    targetAudience: 'QA engineers, fullstack devs, and startup leads.',
    problemStatement: 'Manual end-to-end testing takes 10+ hours per release sprint.',
    coreFeatures: [
      'Visual test recorder with instant selector generation',
      'Parallel cloud test execution runner',
      'Automated flake detection & failure triage reports',
    ],
    stretchFeatures: [
      'Self-healing selectors using vision models',
      'Slack notification webhooks',
    ],
    visualDirection: 'dark-cyberpunk',
    copyTone: 'technical-precise',
    animationPreference: 'high-energy-dynamic',
    stack: {
      frontend: 'nextjs',
      backend: 'nextjs-api',
      database: 'postgresql-drizzle',
      deployment: 'vercel',
    },
    selectedAgentId: 'claude',
    createdAt: '2026-08-27',
    outputPath: './acme-brief.md',
  };

  it('generates a complete Markdown brief containing all required sections', () => {
    const markdown = generateMarkdownBrief(sampleBrief);

    // Header & Meta
    expect(markdown).toContain('# 🚀 Acme Test Studio — AI Agent Build Brief');
    expect(markdown).toContain('The smartest test automation suite for modern web apps.');
    expect(markdown).toContain('`claude`');

    // Section 1: Summary & Problem
    expect(markdown).toContain('## 📌 1. Product Summary & Problem Statement');
    expect(markdown).toContain('QA engineers, fullstack devs, and startup leads.');
    expect(markdown).toContain('Manual end-to-end testing takes 10+ hours per release sprint.');

    // Section 2: Features
    expect(markdown).toContain('## ✨ 2. Core Feature Specifications');
    expect(markdown).toContain('Visual test recorder with instant selector generation');
    expect(markdown).toContain('Self-healing selectors using vision models');

    // Section 3: Design, Aesthetic & Copy
    expect(markdown).toContain('## 🎨 3. Design, Aesthetic & Copywriting Direction');
    expect(markdown).toContain('Dark Mode Cyberpunk');
    expect(markdown).toContain('Technical & Precise');
    expect(markdown).toContain('High Energy & Dynamic');

    // Section 4: Stack Architecture
    expect(markdown).toContain('## 🛠️ 4. Technical Stack Architecture');
    expect(markdown).toContain('Next.js 15');
    expect(markdown).toContain('PostgreSQL + Drizzle ORM');
    expect(markdown).toContain('Vercel');

    // Section 5: Curated Free Resources Hub
    expect(markdown).toContain('## 💎 5. Curated Free Resources Hub');
    expect(markdown).toContain('shadcn/ui');
    expect(markdown).toContain('License Notice');

    // Section 6: Production & Deployment Checklist
    expect(markdown).toContain('## 🚀 6. Production & Deployment Checklist');
    expect(markdown).toContain('Vercel Deployment Instructions');
    expect(markdown).toContain('DATABASE_URL=');

    // Section 7: Agent Implementation Prompt
    expect(markdown).toContain('## 🤖 7. Tailored AI Agent Implementation Prompt');
    expect(markdown).toContain('You are tasked with building "Acme Test Studio"');
  });

  it('filters curated resources matching the selected stack and visual theme', () => {
    const { recommended } = filterResourcesForBrief(sampleBrief);
    expect(recommended.length).toBeGreaterThan(0);

    const resourceIds = recommended.map((r) => r.id);
    // nextjs & dark-cyberpunk recommended resources
    expect(resourceIds).toContain('shadcn-ui');
    expect(resourceIds).toContain('framer-motion');
    expect(resourceIds).toContain('nextjs-docs');
    expect(resourceIds).toContain('vercel-docs');
  });
});
