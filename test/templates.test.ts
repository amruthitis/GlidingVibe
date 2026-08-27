import { describe, it, expect } from 'vitest';
import { STARTER_TEMPLATES } from '../src/data/templates.js';
import { generateMarkdownBrief } from '../src/generator/markdown.js';

describe('Starter Templates', () => {
  it('contains the Salon Vibe demo template (the original problem story)', () => {
    const salon = STARTER_TEMPLATES.find((t) => t.id === 'salon-vibe');
    expect(salon).toBeDefined();
    expect(salon?.name).toContain('Salon Vibe');
    expect(salon?.brief.projectName).toContain('Gliding Salon Experience');
    expect(salon?.brief.coreFeatures.length).toBeGreaterThanOrEqual(3);
    expect(salon?.brief.stack.frontend).toBe('nextjs');
    expect(salon?.brief.stack.database).toBe('supabase');
  });

  it('contains other hackathon starter templates', () => {
    const ids = STARTER_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('saas-starter');
    expect(ids).toContain('ai-workspace');
    expect(ids).toContain('marketplace');
    expect(ids).toContain('hackathon-speedrun');
  });

  it('generates valid markdown for all starter templates', () => {
    for (const template of STARTER_TEMPLATES) {
      const markdown = generateMarkdownBrief({
        ...template.brief,
        createdAt: '2026-08-27',
        outputPath: `./${template.id}-brief.md`,
      });

      expect(markdown).toContain(template.brief.projectName);
      expect(markdown).toContain(template.brief.tagline);
      expect(markdown).toContain('## 📌 1. Product Summary & Problem Statement');
      expect(markdown).toContain('## 🛠️ 4. Technical Stack Architecture');
      expect(markdown).toContain('## 🚀 6. Production & Deployment Checklist');
      expect(markdown).toContain('## 🤖 7. Tailored AI Agent Implementation Prompt');
    }
  });
});
