import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class AiderAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'aider';
  name = 'Aider (CLI Pair Programmer)';
  commandName = 'aider';
  description = 'Terminal-based AI pair programming tool with Git auto-commits';
  installGuideUrl = 'https://aider.chat/docs/install.html';

  formatPrompt(brief: ProjectBrief): string {
    return `/read ${brief.outputPath || 'glidingvibe-brief.md'}

Build ${brief.projectName}: ${brief.tagline}

Please implement the features defined in the brief:
${brief.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Stack: ${brief.stack.frontend} + ${brief.stack.backend} + ${brief.stack.database}
Aesthetic: ${brief.visualDirection}, ${brief.copyTone} copy tone.`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: 'aider',
      args: ['--read', config.briefPath, '--message', `Implement ${config.brief.projectName} based on ${config.briefPath}`],
      explanation: 'Launches Aider pair programming session reading the brief markdown',
    };
  }
}
