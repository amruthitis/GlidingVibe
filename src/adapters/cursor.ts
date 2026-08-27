import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class CursorAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'cursor';
  name = 'Cursor Editor / Composer';
  commandName = 'cursor';
  description = 'AI-first code editor with integrated Composer and terminal agent';
  installGuideUrl = 'https://www.cursor.com';

  formatPrompt(brief: ProjectBrief): string {
    return `/* Cursor Composer Prompt & Context */
Project: ${brief.projectName}
Tagline: ${brief.tagline}

Please review @glidingvibe-brief.md and execute the implementation plan.

Stack Architecture:
- Frontend: ${brief.stack.frontend}
- Backend: ${brief.stack.backend}
- Database: ${brief.stack.database}
- Deployment: ${brief.stack.deployment}

Visual & Style Guide:
- Theme vibe: ${brief.visualDirection}
- Copy style: ${brief.copyTone}
- Motion feel: ${brief.animationPreference}

Key Implementation Goals:
${brief.coreFeatures.map((f, i) => `${i + 1}. ${f}`).join('\n')}

Action Plan:
1. Scaffold required configuration files and folder architecture.
2. Build reusable UI components adhering to the "${brief.visualDirection}" design guidelines.
3. Wire up application state, mock APIs, and end-to-end user workflows.
4. Ensure all TypeScript types are strictly typed without 'any'.
5. Verify build scripts run with zero errors.`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: 'cursor',
      args: ['.', config.briefPath],
      explanation: 'Opens project workspace and the brief in Cursor IDE',
    };
  }
}
