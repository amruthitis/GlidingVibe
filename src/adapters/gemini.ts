import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig, AgentDetectionResult } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class GeminiAgentAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'gemini';
  name = 'Gemini CLI / Antigravity (agy)';
  commandName = 'gemini';
  description = 'Google DeepMind Gemini & Antigravity advanced agentic coding CLI';
  installGuideUrl = 'https://ai.google.dev';

  private detectedBin: string = 'gemini';

  override async detect(): Promise<AgentDetectionResult> {
    const binaries = ['agy', 'gemini', 'antigravity'];
    for (const bin of binaries) {
      const { exists, path } = await this.checkCommandExists(bin);
      if (exists) {
        this.detectedBin = bin;
        const version = await this.getCommandVersion(bin);
        return {
          id: this.id,
          name: bin === 'agy' || bin === 'antigravity' ? 'Antigravity CLI (agy)' : 'Gemini CLI',
          commandName: bin,
          isInstalled: true,
          path,
          version,
          description: this.description,
          installGuideUrl: this.installGuideUrl,
        };
      }
    }

    return {
      id: this.id,
      name: this.name,
      commandName: 'gemini',
      isInstalled: false,
      description: this.description,
      installGuideUrl: this.installGuideUrl,
    };
  }

  formatPrompt(brief: ProjectBrief): string {
    return `<BUILD_DIRECTIVE>
# System Role: Autonomous Full-Stack Engineer
You are building "${brief.projectName}" (${brief.tagline}) in the current directory.

## Project Context
- **Target Audience**: ${brief.targetAudience}
- **Problem Statement**: ${brief.problemStatement}
- **Full Brief Reference**: ${brief.outputPath || './glidingvibe-brief.md'}

## Design & Architecture Spec
- **Visual Design**: ${brief.visualDirection}
- **Voice & Tone**: ${brief.copyTone}
- **Motion Spec**: ${brief.animationPreference}
- **Frontend Framework**: ${brief.stack.frontend}
- **Backend Architecture**: ${brief.stack.backend}
- **Database Engine**: ${brief.stack.database}
- **Deployment Platform**: ${brief.stack.deployment}

## Deliverables & Milestones
${brief.coreFeatures.map((f, i) => `${i + 1}. [Core Feature] ${f}`).join('\n')}
${brief.stretchFeatures && brief.stretchFeatures.length > 0 ? `\n### Stretch Goals\n${brief.stretchFeatures.map((f, i) => `- ${f}`).join('\n')}` : ''}

## Execution Directives
1. Read the comprehensive brief at \`${brief.outputPath || './glidingvibe-brief.md'}\` for curated resources and env variables.
2. Initialize project files and install dependencies.
3. Build responsive UI components with clean design and pleasant transitions.
4. Implement end-to-end user workflows with realistic mock fallbacks.
5. Verify build and type checks pass with zero warnings.
</BUILD_DIRECTIVE>`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: this.detectedBin,
      args: ['--prompt', this.formatPrompt(config.brief)],
      explanation: `Launches ${this.detectedBin} with the autonomous build directive`,
    };
  }
}
