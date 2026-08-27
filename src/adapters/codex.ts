import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class CodexAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'codex';
  name = 'OpenAI Codex CLI';
  commandName = 'codex';
  description = 'OpenAI command-line coding agent for automated code synthesis and editing';
  installGuideUrl = 'https://github.com/openai/codex';

  formatPrompt(brief: ProjectBrief): string {
    return `# CODEX AGENT BUILD INSTRUCTION

## Target Application: ${brief.projectName}
"${brief.tagline}"

## Mission
Build a fully functioning, beautiful web prototype for "${brief.targetAudience}" addressing:
"${brief.problemStatement}"

## Architectural Requirements
- Stack: ${brief.stack.frontend} / ${brief.stack.backend} / ${brief.stack.database} / ${brief.stack.deployment}
- Visual Direction: ${brief.visualDirection}
- Copy & Voice: ${brief.copyTone}
- Motion / Transitions: ${brief.animationPreference}

## Required Deliverables
${brief.coreFeatures.map((f, i) => `[ ] Step ${i + 1}: Implement ${f}`).join('\n')}

## Quality Standards
- Clean modular file organization.
- Strict type definitions and lint-clean code.
- Fully functional demo states and interactive mock fallback.
- Read \`${brief.outputPath || './glidingvibe-brief.md'}\` for complete resource links and deployment checklists.`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: 'codex',
      args: ['exec', config.prompt],
      explanation: 'Executes Codex CLI with the structured project brief prompt',
    };
  }
}
