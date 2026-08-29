export type FontCategory = 'sans-serif' | 'display' | 'serif' | 'monospace';

export interface FontOption {
  name: string;
  category: FontCategory;
  description: string;
  weights: number[];
  googleFontName?: string;
  recommendedFor?: string[];
}

export const POPULAR_FONTS: FontOption[] = [
  // --- SANS-SERIF ---
  {
    name: 'Inter',
    category: 'sans-serif',
    description: 'Variable neo-grotesque typeface designed for high legibility on digital screens',
    weights: [400, 500, 600, 700],
    googleFontName: 'Inter',
    recommendedFor: ['minimal-clean', 'corporate-modern'],
  },
  {
    name: 'Plus Jakarta Sans',
    category: 'sans-serif',
    description: 'Modern sans-serif with geometric proportions and friendly warmth',
    weights: [400, 500, 600, 700, 800],
    googleFontName: 'Plus+Jakarta+Sans',
    recommendedFor: ['dark-cyberpunk', 'glassmorphism-glow', 'playful-vibrant'],
  },
  {
    name: 'Geist',
    category: 'sans-serif',
    description: 'Precision sans-serif typeface crafted by Vercel for modern developer interfaces',
    weights: [400, 500, 600, 700],
    googleFontName: 'Geist',
    recommendedFor: ['minimal-clean', 'dark-cyberpunk'],
  },
  {
    name: 'Outfit',
    category: 'sans-serif',
    description: 'Geometric sans-serif with round, friendly curves and modern character',
    weights: [400, 500, 600, 700],
    googleFontName: 'Outfit',
    recommendedFor: ['playful-vibrant', 'corporate-modern'],
  },
  {
    name: 'Space Grotesk',
    category: 'sans-serif',
    description: 'Proportional sans-serif based on Space Mono with futuristic tech aesthetic',
    weights: [400, 500, 600, 700],
    googleFontName: 'Space+Grotesk',
    recommendedFor: ['dark-cyberpunk', 'brutalist-bold'],
  },
  {
    name: 'Poppins',
    category: 'sans-serif',
    description: 'Geometric sans-serif font family with international support and clean curves',
    weights: [400, 500, 600, 700],
    googleFontName: 'Poppins',
    recommendedFor: ['playful-vibrant', 'corporate-modern'],
  },
  {
    name: 'DM Sans',
    category: 'sans-serif',
    description: 'Low-contrast geometric sans-serif designed for high legibility at smaller point sizes',
    weights: [400, 500, 700],
    googleFontName: 'DM+Sans',
    recommendedFor: ['minimal-clean', 'editorial-elegant'],
  },
  {
    name: 'Roboto',
    category: 'sans-serif',
    description: 'Google classic geometric sans-serif with dual nature of mechanical skeleton and friendly curves',
    weights: [400, 500, 700],
    googleFontName: 'Roboto',
    recommendedFor: ['corporate-modern'],
  },

  // --- DISPLAY ---
  {
    name: 'Syne',
    category: 'display',
    description: 'Artistic display typeface with ultra-wide proportions and striking visual identity',
    weights: [400, 600, 700, 800],
    googleFontName: 'Syne',
    recommendedFor: ['dark-cyberpunk', 'brutalist-bold'],
  },
  {
    name: 'Clash Display',
    category: 'display',
    description: 'Bold high-contrast display font ideal for memorable titles and headlines',
    weights: [400, 600, 700],
    googleFontName: 'Clash+Display',
    recommendedFor: ['brutalist-bold', 'retro-vintage'],
  },
  {
    name: 'Cal Sans',
    category: 'display',
    description: 'Geometric sans-serif display font created for Cal.com with crisp geometric structure',
    weights: [600, 700],
    googleFontName: 'Cal+Sans',
    recommendedFor: ['minimal-clean', 'dark-cyberpunk'],
  },
  {
    name: 'Bricolage Grotesque',
    category: 'display',
    description: 'Expressive variable display font with quirky brutalist details',
    weights: [400, 600, 700, 800],
    googleFontName: 'Bricolage+Grotesque',
    recommendedFor: ['retro-vintage', 'brutalist-bold'],
  },
  {
    name: 'Cabinet Grotesk',
    category: 'display',
    description: 'Neobrutalist display font inspired by classic 19th-century posters',
    weights: [400, 700, 800],
    googleFontName: 'Cabinet+Grotesk',
    recommendedFor: ['retro-vintage', 'brutalist-bold'],
  },
  {
    name: 'Righteous',
    category: 'display',
    description: 'Retro-futuristic display font inspired by 1980s synthwave aesthetics',
    weights: [400],
    googleFontName: 'Righteous',
    recommendedFor: ['retro-vintage', 'dark-cyberpunk'],
  },

  // --- SERIF ---
  {
    name: 'Playfair Display',
    category: 'serif',
    description: 'High-contrast transitional serif with classical European elegance',
    weights: [400, 600, 700, 900],
    googleFontName: 'Playfair+Display',
    recommendedFor: ['editorial-elegant'],
  },
  {
    name: 'Lora',
    category: 'serif',
    description: 'Contemporary serif with calligraphy roots, perfect for long-form editorial reading',
    weights: [400, 500, 600, 700],
    googleFontName: 'Lora',
    recommendedFor: ['editorial-elegant', 'minimal-clean'],
  },
  {
    name: 'Merriweather',
    category: 'serif',
    description: 'Medium-contrast text serif engineered to be pleasant to read on screens',
    weights: [400, 700],
    googleFontName: 'Merriweather',
    recommendedFor: ['editorial-elegant'],
  },
  {
    name: 'Cormorant Garamond',
    category: 'serif',
    description: 'Stunning luxury serif inspired by 16th-century Claude Garamont typefaces',
    weights: [400, 600, 700],
    googleFontName: 'Cormorant+Garamond',
    recommendedFor: ['editorial-elegant'],
  },

  // --- MONOSPACE ---
  {
    name: 'JetBrains Mono',
    category: 'monospace',
    description: 'Developer font crafted specifically for code legibility with programming ligatures',
    weights: [400, 500, 700],
    googleFontName: 'JetBrains+Mono',
    recommendedFor: ['minimal-clean', 'corporate-modern'],
  },
  {
    name: 'Fira Code',
    category: 'monospace',
    description: 'Free monospaced font containing programming ligatures for common multi-character combinations',
    weights: [400, 500, 700],
    googleFontName: 'Fira+Code',
    recommendedFor: ['dark-cyberpunk'],
  },
  {
    name: 'Space Mono',
    category: 'monospace',
    description: 'Original monospaced display font designed for headlines and code blocks',
    weights: [400, 700],
    googleFontName: 'Space+Mono',
    recommendedFor: ['retro-vintage', 'playful-vibrant'],
  },
  {
    name: 'IBM Plex Mono',
    category: 'monospace',
    description: 'Grotesque monospaced font reflecting IBM industrial design heritage',
    weights: [400, 500, 600],
    googleFontName: 'IBM+Plex+Mono',
    recommendedFor: ['brutalist-bold'],
  },
  {
    name: 'Geist Mono',
    category: 'monospace',
    description: 'Developer monospace font designed by Vercel for code editors and terminal dashboards',
    weights: [400, 500, 700],
    googleFontName: 'Geist+Mono',
    recommendedFor: ['glassmorphism-glow', 'minimal-clean'],
  },
];

export function getFontsByCategory(category: FontCategory): FontOption[] {
  return POPULAR_FONTS.filter((f) => f.category === category);
}

export function findFontByName(name: string): FontOption | undefined {
  const normalized = name.trim().toLowerCase();
  return POPULAR_FONTS.find((f) => f.name.toLowerCase() === normalized);
}
