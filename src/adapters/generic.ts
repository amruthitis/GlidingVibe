import { BaseAgentAdapter } from './base.js';
import type { CodingAgentId, AgentLaunchConfig, AgentDetectionResult } from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

export class GenericAgentAdapter extends BaseAgentAdapter {
  id: CodingAgentId = 'generic';
  name = 'Universal / Copy to Clipboard';
  commandName = 'clipboard';
  description = 'Formatted prompt ready to paste into ChatGPT, Claude Web, v0, Bolt, Lovable, or Cursor Chat';
  installGuideUrl = '';

  override async detect(): Promise<AgentDetectionResult> {
    return {
      id: this.id,
      name: this.name,
      commandName: 'clipboard',
      isInstalled: true,
      description: this.description,
      installGuideUrl: '',
    };
  }

  formatPrompt(brief: ProjectBrief): string {
    return `# AI Agent Build Prompt: ${brief.projectName}

You are an expert full-stack developer and UI/UX designer. Build a complete, functional, and visually stunning web application for **${brief.projectName}**.

---

### 🚀 Elevator Pitch & Concept
> "${brief.tagline}"

- **Target Audience**: ${brief.targetAudience}
- **Problem Solved**: ${brief.problemStatement}

---

### 🛠️ Selected Technical Stack
- **Frontend**: ${brief.stack.frontend}
- **Backend**: ${brief.stack.backend}
- **Database**: ${brief.stack.database}
- **Deployment Platform**: ${brief.stack.deployment}

---

### 🎨 Visual & Experience Guidelines
- **Visual Aesthetic**: ${brief.visualDirection}
- **Brand Voice & Copy Tone**: ${brief.copyTone}
- **Motion & Interactions**: ${brief.animationPreference}

---

### 📋 Core Features to Build
${brief.coreFeatures.map((f, i) => `${i + 1}. **${f}**`).join('\n')}
${brief.stretchFeatures && brief.stretchFeatures.length > 0 ? `\n### 🌟 Stretch Features\n${brief.stretchFeatures.map((f, i) => `- ${f}`).join('\n')}` : ''}

---

### 🏗️ Implementation Guidelines
1. **Scaffold & Setup**: Create a clean, modular folder structure with TypeScript and Tailwind CSS.
2. **Interactive UI First**: Build responsive components with consistent spacing, polished typography, and accessible contrasts.
3. **Mock Data & State**: Provide realistic default data so the app looks alive and interactive out of the box.
4. **Resilience**: Handle loading states, empty states, and validation errors gracefully.
5. **Brief Reference**: For curated free resources and deployment checklists, refer to \`${brief.outputPath || './glidingvibe-brief.md'}\`.`;
  }

  getLaunchCommand(config: AgentLaunchConfig): { command: string; args: string[]; explanation: string } {
    return {
      command: 'echo',
      args: ['Prompt saved in brief file and ready to copy'],
      explanation: 'Saves prompt to brief markdown and outputs copyable text',
    };
  }
}
