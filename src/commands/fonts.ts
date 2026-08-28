import { Command } from 'commander';
import pc from 'picocolors';
import { select, text, confirm, spinner } from '@clack/prompts';
import { POPULAR_FONTS, getFontsByCategory, findFontByName, type FontCategory } from '../data/fonts.js';
import { downloadFontFiles, generateFontImportCss, generateTailwindFontConfig } from '../utils/fonts.js';
import { handleCancel, displayBox } from '../utils/terminal.js';

export function registerFontsCommand(program: Command): void {
  const fontsCmd = program
    .command('fonts')
    .description('Browse Figma/Google fonts and download font files for your frontend project');

  fontsCmd
    .command('list')
    .description('List available popular Figma & Google fonts by category')
    .action(() => {
      console.log(pc.bold(pc.cyan('\n🎨 GLIDINGVIBE TYPOGRAPHY & FONT CATALOG\n')));

      const categories: { key: FontCategory; name: string }[] = [
        { key: 'sans-serif', name: 'Sans-Serif (Modern & Clean)' },
        { key: 'display', name: 'Display & Headlines (Bold & Creative)' },
        { key: 'serif', name: 'Serif (Editorial & Elegant)' },
        { key: 'monospace', name: 'Monospace (Code & Terminal)' },
      ];

      for (const cat of categories) {
        const fonts = getFontsByCategory(cat.key);
        console.log(pc.bold(pc.yellow(`\n▸ ${cat.name}`)));
        for (const font of fonts) {
          console.log(`  ${pc.green('•')} ${pc.bold(font.name)} — ${pc.dim(font.description)}`);
        }
      }

      console.log(pc.dim('\nRun `glidingvibe fonts download "Font Name"` to download font files locally.\n'));
    });

  fontsCmd
    .command('download [fontName]')
    .description('Download Google/Figma font (.woff2) files into your frontend project asset folder')
    .option('-o, --output <path>', 'Output directory for font files', './public/fonts')
    .action(async (fontNameArg?: string, options?: { output?: string }) => {
      let targetFont = fontNameArg;
      const outputDir = options?.output || './public/fonts';

      if (!targetFont) {
        const chosenCategory = handleCancel(
          await select({
            message: 'Select font category to pick from:',
            options: [
              { value: 'sans-serif', label: 'Sans-Serif (Inter, Plus Jakarta Sans, Geist, Outfit...)' },
              { value: 'display', label: 'Display (Syne, Clash Display, Cal Sans, Bricolage...)' },
              { value: 'serif', label: 'Serif (Playfair Display, Lora, Merriweather...)' },
              { value: 'monospace', label: 'Monospace (JetBrains Mono, Fira Code, Space Mono...)' },
              { value: 'custom', label: 'Enter custom Google Font name...' },
            ],
          })
        );

        if (chosenCategory === 'custom') {
          targetFont = handleCancel(
            await text({
              message: 'Enter Google Font name:',
              placeholder: 'Space Grotesk',
              validate(v) {
                if (!v || v.trim().length === 0) return 'Font name is required!';
              },
            })
          );
        } else {
          const catFonts = getFontsByCategory(chosenCategory as FontCategory);
          targetFont = handleCancel(
            await select({
              message: `Select font from ${chosenCategory}:`,
              options: catFonts.map((f) => ({
                value: f.name,
                label: f.name,
                hint: f.description,
              })),
            })
          );
        }
      }

      const fontSpinner = spinner();
      fontSpinner.start(`Fetching and downloading font files for "${targetFont}"...`);

      const result = await downloadFontFiles(targetFont, outputDir);

      if (result.success) {
        fontSpinner.stop(pc.green(`✔ Successfully downloaded ${result.filesDownloaded.length} font files!`));

        const tailwindSnippet = generateTailwindFontConfig(targetFont);

        displayBox(
          `${pc.bold(pc.white(`Font Downloaded: ${targetFont}`))}\n\n` +
          `${pc.cyan('Saved To Directory')}: ${pc.bold(outputDir)}\n` +
          `${pc.cyan('Files Downloaded')}: ${result.filesDownloaded.join(', ')}\n\n` +
          `${pc.yellow('Tailwind CSS Configuration Snippet')}:\n${tailwindSnippet}`,
          'Font Download Complete',
          'green'
        );
      } else {
        fontSpinner.stop(pc.yellow(`⚠ Could not download font files directly: ${result.error}`));
        const fallbackImport = generateFontImportCss(targetFont);

        displayBox(
          `${pc.bold(pc.white(`Fallback Web Font Setup: ${targetFont}`))}\n\n` +
          `${pc.cyan('CSS @import Snippet')}:\n${fallbackImport}`,
          'Web Font Fallback',
          'yellow'
        );
      }
    });
}
