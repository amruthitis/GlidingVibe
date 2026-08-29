import { describe, it, expect } from 'vitest';
import { RESOURCE_CATALOG, CATEGORIES } from '../src/data/resources.js';
import { filterCatalog } from '../src/commands/resources.js';

describe('Resource Catalog', () => {
  it('contains valid categories with subcategories', () => {
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(4);
    const categoryIds = CATEGORIES.map((c) => c.id);
    expect(categoryIds).toContain('visual');
    expect(categoryIds).toContain('content');
    expect(categoryIds).toContain('motion');
    expect(categoryIds).toContain('engineering');

    for (const cat of CATEGORIES) {
      expect(cat.name).toBeTruthy();
      expect(typeof cat.emoji).toBe('string');
      expect(cat.subcategories.length).toBeGreaterThan(0);
    }
  });

  it('contains rich resource items with required fields and license notices', () => {
    expect(RESOURCE_CATALOG.length).toBeGreaterThanOrEqual(20);

    for (const item of RESOURCE_CATALOG) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.url).toMatch(/^https?:\/\//);
      expect(item.description).toBeTruthy();
      expect(item.freeTier).toBeTruthy();
      expect(item.licenseNotice).toBeTruthy();
      expect(item.tags.length).toBeGreaterThan(0);
    }
  });

  it('filters catalog by category', () => {
    const visualItems = filterCatalog({ category: 'visual' });
    expect(visualItems.length).toBeGreaterThan(0);
    expect(visualItems.every((i) => i.category === 'visual')).toBe(true);

    const contentItems = filterCatalog({ category: 'content' });
    expect(contentItems.length).toBeGreaterThan(0);
    expect(contentItems.every((i) => i.category === 'content')).toBe(true);
  });

  it('filters catalog by search query across name, description, tags, and subcategory', () => {
    const tailwindItems = filterCatalog({ search: 'tailwind' });
    expect(tailwindItems.length).toBeGreaterThan(0);

    const iconItems = filterCatalog({ search: 'icons' });
    expect(iconItems.length).toBeGreaterThan(0);
    expect(iconItems.some((i) => i.id === 'lucide-icons')).toBe(true);

    const nonExistent = filterCatalog({ search: 'xyznonexistentterm123' });
    expect(nonExistent.length).toBe(0);
  });

  it('filters catalog by category and search query combined', () => {
    const visualShadcn = filterCatalog({ category: 'visual', search: 'shadcn' });
    expect(visualShadcn.length).toBeGreaterThanOrEqual(1);
    expect(visualShadcn.some((item) => item.id === 'shadcn-ui')).toBe(true);
  });
});
