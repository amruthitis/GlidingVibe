import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class ClaudeCodeAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'claude';
  name = 'Claude Code';
  commandName = 'claude';
  description = 'Anthropic official agentic coding CLI with tool use and multi-file editing';
  installGuideUrl = 'https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview';

  formatPrompt(brief: ProjectBrief): string {
    return `# Task: Build ${brief.projectName}

You are tasked with building "${brief.projectName}" from scratch in the current workspace.

## Product Overview
- **Tagline**: ${brief.tagline}
- **Target Users**: ${brief.targetAudience}
- **Core Problem**: ${brief.problemStatement}

## Key Features to Implement
${brief.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}
${brief.stretchFeatures && brief.stretchFeatures.length > 0 ? `\n### Stretch Goals\n${brief.stretchFeatures.map((f, i) => `- ${f}`).join('\n')}` : ''}

## Aesthetic & Architecture Directives
- **Visual Tone**: ${brief.visualDirection} (Follow clean spacing, modern color hierarchy, and responsive layout)
- **Copy Tone**: ${brief.copyTone} (Ensure all UI copy, error states, and empty states reflect this tone)
- **Motion Level**: ${brief.animationPreference}
- **Stack Target**:
  - Frontend: ${brief.stack.frontend}
  - Backend: ${brief.stack.backend}
  - Database: ${brief.stack.database}
  - Deployment Target: ${brief.stack.deployment}

## Instructions for Claude Code
1. Inspect the current workspace and review the full brief at \`${brief.outputPath || './glidingvibe-brief.md'}\`.
2. Initialize and configure the codebase using the chosen stack (${brief.stack.frontend} + ${brief.stack.backend}).
3. Build the core components step by step. Verify syntax and types at each milestone.
4. Implement realistic mock data or database models for the core features.
5. Create a clean, production-ready landing page and interactive application flow.
6. Provide a concise summary of created files and commands to run the app locally.`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: 'claude',
      args: ['-p', this.formatPrompt(config.brief)],
      explanation: 'Launches Claude Code agent with the generated project prompt',
    };
  }
}
