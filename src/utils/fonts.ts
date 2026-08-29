import fs from 'node:fs/promises';
import path from 'node:path';
import { findFontByName } from '../data/fonts.js';

export interface DownloadFontResult {
  success: boolean;
  fontName: string;
  filesDownloaded: string[];
  cssSnippet: string;
  error?: string;
}

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

export function sanitizeFontName(fontName: string): string {
  if (!fontName) return 'Inter';
  return fontName.replace(/[^a-zA-Z0-9 +_-]/g, '').trim();
}

export function getGoogleFontCssUrl(fontName: string, weights: number[] = [400, 500, 600, 700]): string {
  const safeName = sanitizeFontName(fontName);
  const fontMeta = findFontByName(safeName);
  const rawName = fontMeta?.googleFontName || safeName;
  const nameToUse = rawName.includes('+') ? rawName : rawName.replace(/\s+/g, '+');
  const validWeights = (fontMeta?.weights || weights).filter((w) => typeof w === 'number' && w > 0 && w <= 1000);
  const weightsParam = (validWeights.length > 0 ? validWeights : [400, 700]).join(';');
  return `https://fonts.googleapis.com/css2?family=${nameToUse}:wght@${weightsParam}&display=swap`;
}

export function generateFontImportCss(primaryFont?: string, secondaryFont?: string): string {
  const imports: string[] = [];
  if (primaryFont) {
    imports.push(`@import url('${getGoogleFontCssUrl(primaryFont)}');`);
  }
  if (secondaryFont && secondaryFont !== primaryFont) {
    imports.push(`@import url('${getGoogleFontCssUrl(secondaryFont)}');`);
  }
  return imports.join('\n');
}

export function generateTailwindFontConfig(primaryFont?: string, secondaryFont?: string): string {
  const pFont = sanitizeFontName(primaryFont || 'Inter');
  const sFont = sanitizeFontName(secondaryFont || 'Plus Jakarta Sans');

  return `// tailwind.config.js / tailwind.config.ts snippet
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"${pFont}"', 'sans-serif'],
        heading: ['"${sFont}"', 'sans-serif'],
      },
    },
  },
};`;
}

export async function downloadFontFiles(
  fontName: string,
  outputDir: string = './public/fonts'
): Promise<DownloadFontResult> {
  const safeName = sanitizeFontName(fontName);
  if (!safeName) {
    return {
      success: false,
      fontName,
      filesDownloaded: [],
      cssSnippet: '',
      error: 'Invalid font name specified',
    };
  }

  const cssUrl = getGoogleFontCssUrl(safeName);

  try {
    // Path containment check to prevent Directory Traversal attacks
    const cwd = path.resolve(process.cwd());
    const resolvedOutputDir = path.resolve(cwd, outputDir);
    const relativeDir = path.relative(cwd, resolvedOutputDir);

    if (relativeDir.startsWith('..') && !path.isAbsolute(outputDir)) {
      throw new Error(`Security Violation: Target directory must remain within workspace boundaries (${outputDir})`);
    }

    const response = await fetch(cssUrl, {
      headers: { 'User-Agent': DEFAULT_USER_AGENT },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status} fetching font CSS from Google Fonts`);
    }

    const cssText = await response.text();
    const urlRegex = /url\((https:\/\/[^)]+\.woff2)\)/g;
    const matches = Array.from(cssText.matchAll(urlRegex));

    if (matches.length === 0) {
      throw new Error(`No .woff2 font files found in Google Fonts CSS response for ${safeName}`);
    }

    await fs.mkdir(resolvedOutputDir, { recursive: true });

    const downloadedFiles: string[] = [];
    let localCssText = cssText;

    const filePrefix = safeName.replace(/[^a-zA-Z0-9]/g, '');

    let index = 0;
    for (const match of matches) {
      index++;
      const woff2Url = match[1];
      // Protocol validation on woff2 URL
      if (!woff2Url.startsWith('https://')) {
        continue;
      }
      const fileName = `${filePrefix}-${index}.woff2`;
      const filePath = path.join(resolvedOutputDir, fileName);

      const fontFileResp = await fetch(woff2Url);
      if (fontFileResp.ok) {
        const buffer = await fontFileResp.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(buffer));
        downloadedFiles.push(fileName);

        // Replace remote URL with local path in CSS
        const relativeWebPath = path.posix.join('/', path.relative(process.cwd(), filePath));
        localCssText = localCssText.replace(woff2Url, relativeWebPath);
      }
    }

    return {
      success: true,
      fontName: safeName,
      filesDownloaded: downloadedFiles,
      cssSnippet: localCssText,
    };
  } catch (err: any) {
    return {
      success: false,
      fontName: safeName,
      filesDownloaded: [],
      cssSnippet: generateFontImportCss(safeName),
      error: err.message || String(err),
    };
  }
}
