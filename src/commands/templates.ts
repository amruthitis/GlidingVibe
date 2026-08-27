import pc from 'picocolors';
import { STARTER_TEMPLATES } from '../data/templates.js';
import { printMiniBanner } from '../utils/banner.js';
import { displayBox } from '../utils/terminal.js';

export function handleTemplatesCommand(): void {
  printMiniBanner();
  console.log(pc.bold('Available Starter Templates:\n'));

  for (const t of STARTER_TEMPLATES) {
    const content =
      `${pc.bold(t.description)}\n\n` +
      `${pc.cyan('Tagline')}: "${t.brief.tagline}"\n` +
      `${pc.cyan('Stack')}: ${t.brief.stack.frontend} + ${t.brief.stack.backend} + ${t.brief.stack.database} + ${t.brief.stack.deployment}\n` +
      `${pc.cyan('Vibe')}: ${t.brief.visualDirection} • ${t.brief.copyTone}\n\n` +
      `${pc.bold('Core Features')}:\n` +
      t.brief.coreFeatures.map((f, i) => `  ${i + 1}. ${f}`).join('\n') +
      `\n\nRun: ${pc.green(`npx glidingvibe init --template ${t.id} --yes`)}`;

    displayBox(content, `${t.name} (id: ${t.id})`, 'magenta');
  }
}
