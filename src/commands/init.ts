import { runInteractiveWizard } from '../wizard/interactive.js';
import { STARTER_TEMPLATES } from '../data/templates.js';
import { generateMarkdownBrief } from '../generator/markdown.js';
import { writeBriefToFile } from '../utils/filesystem.js';
import { printMiniBanner } from '../utils/banner.js';
import { displayBox } from '../utils/terminal.js';
import pc from 'picocolors';
import type { WizardOptions, ProjectBrief } from '../types/index.js';

export interface InitCommandOptions {
  output?: string;
  template?: string;
  agent?: string;
  yes?: boolean;
}

export async function handleInitCommand(options: InitCommandOptions = {}): Promise<ProjectBrief> {
  if (options.yes && options.template) {
    printMiniBanner();
    const template = STARTER_TEMPLATES.find((t) => t.id === options.template) || STARTER_TEMPLATES[0];
    const briefPath = options.output || './glidingvibe-brief.md';

    const brief: ProjectBrief = {
      ...template.brief,
      selectedAgentId: options.agent || 'generic',
      createdAt: new Date().toISOString().split('T')[0],
      outputPath: briefPath,
    };

    const markdownContent = generateMarkdownBrief(brief);
    const resolvedPath = await writeBriefToFile(briefPath, markdownContent);

    displayBox(
      `${pc.bold(pc.white(`✨ Generated Brief from Template: ${template.name}`))}\n\n` +
      `📁 ${pc.cyan('Saved To')}: ${pc.bold(resolvedPath)}\n` +
      `🤖 ${pc.cyan('Agent Target')}: ${pc.yellow(brief.selectedAgentId || 'Universal')}\n` +
      `🛠️  ${pc.cyan('Tech Stack')}: ${brief.stack.frontend} • ${brief.stack.backend} • ${brief.stack.database} • ${brief.stack.deployment}`,
      'Template Scaffolded',
      'green'
    );

    return brief;
  }

  const wizardOpts: WizardOptions = {
    outputPath: options.output,
    template: options.template,
    agent: options.agent,
  };

  return runInteractiveWizard(wizardOpts);
}
