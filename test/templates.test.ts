import { describe, it, expect } from 'vitest';
import { STARTER_TEMPLATES } from '../src/data/templates.js';
import { generateMarkdownBrief } from '../src/generator/markdown.js';

describe('Starter Templates', () => {
  it('does not contain the Salon Vibe demo template', () => {
    const salon = STARTER_TEMPLATES.find((t) => t.id === 'salon-vibe');
    expect(salon).toBeUndefined();
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
      expect(markdown).toContain('## 1. Product Summary & Problem Statement');
      expect(markdown).toContain('## 4. Technical Stack Architecture');
      expect(markdown).toContain('## 6. Production & Deployment Checklist');
      expect(markdown).toContain('## 7. Tailored AI Agent Implementation Prompt');
    }
  });
});
