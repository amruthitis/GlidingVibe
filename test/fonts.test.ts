import { describe, it, expect } from 'vitest';
import { POPULAR_FONTS, getFontsByCategory, findFontByName } from '../src/data/fonts.js';
import {
  getGoogleFontCssUrl,
  generateFontImportCss,
  generateTailwindFontConfig,
} from '../src/utils/fonts.js';

describe('Font Catalog & Utilities', () => {
  it('contains popular categorized fonts for Figma & Web', () => {
    expect(POPULAR_FONTS.length).toBeGreaterThan(15);
    const sansFonts = getFontsByCategory('sans-serif');
    const displayFonts = getFontsByCategory('display');
    const serifFonts = getFontsByCategory('serif');
    const monoFonts = getFontsByCategory('monospace');

    expect(sansFonts.length).toBeGreaterThan(0);
    expect(displayFonts.length).toBeGreaterThan(0);
    expect(serifFonts.length).toBeGreaterThan(0);
    expect(monoFonts.length).toBeGreaterThan(0);
  });

  it('finds fonts by name ignoring case', () => {
    const font = findFontByName('inter');
    expect(font).toBeDefined();
    expect(font?.name).toBe('Inter');

    const spaceGrotesk = findFontByName('Space Grotesk');
    expect(spaceGrotesk).toBeDefined();
    expect(spaceGrotesk?.category).toBe('sans-serif');
  });

  it('generates Google Fonts CSS URL', () => {
    const url = getGoogleFontCssUrl('Space Grotesk');
    expect(url).toContain('https://fonts.googleapis.com/css2?family=Space+Grotesk');
  });

  it('generates CSS @import statement for single or dual fonts', () => {
    const css = generateFontImportCss('Inter', 'Playfair Display');
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Inter");
    expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Playfair+Display");
  });

  it('generates Tailwind font configuration snippet', () => {
    const tailwindConfig = generateTailwindFontConfig('Space Grotesk', 'Plus Jakarta Sans');
    expect(tailwindConfig).toContain('"Space Grotesk"');
    expect(tailwindConfig).toContain('"Plus Jakarta Sans"');
    expect(tailwindConfig).toContain('fontFamily');
  });
});
