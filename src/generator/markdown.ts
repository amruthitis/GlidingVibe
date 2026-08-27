import type { ProjectBrief } from '../types/index.js';
import type { ResourceItem } from '../types/catalog.js';
import { RESOURCE_CATALOG, CATEGORIES } from '../data/resources.js';
import {
  FRONTEND_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
  DEPLOYMENT_OPTIONS,
  VISUAL_VIBE_PRESETS,
  COPY_TONE_PRESETS,
  ANIMATION_PRESETS,
} from '../data/stacks.js';
import { generateDeploymentChecklist, generateEnvExample } from './checklist.js';
import { generateAgentPrompt } from './prompt.js';

export function filterResourcesForBrief(brief: ProjectBrief): {
  recommended: ResourceItem[];
  allByCategory: Record<string, ResourceItem[]>;
} {
  const recommended: ResourceItem[] = [];
  const allByCategory: Record<string, ResourceItem[]> = {
    visual: [],
    content: [],
    motion: [],
    engineering: [],
  };

  const stackKeys = [
    brief.stack.frontend,
    brief.stack.backend,
    brief.stack.database,
    brief.stack.deployment,
  ];

  for (const item of RESOURCE_CATALOG) {
    if (allByCategory[item.category]) {
      allByCategory[item.category].push(item);
    }

    let isMatch = false;
    if (item.recommendedFor) {
      if (item.recommendedFor.stacks?.some((s) => stackKeys.includes(s as any))) {
        isMatch = true;
      }
      if (item.recommendedFor.visuals?.includes(brief.visualDirection)) {
        isMatch = true;
      }
      if (item.recommendedFor.tones?.includes(brief.copyTone)) {
        isMatch = true;
      }
    }

    if (isMatch && !recommended.some((r) => r.id === item.id)) {
      recommended.push(item);
    }
  }

  return { recommended, allByCategory };
}

export function generateMarkdownBrief(brief: ProjectBrief): string {
  const dateStr = brief.createdAt || new Date().toISOString().split('T')[0];
  const visualMeta = VISUAL_VIBE_PRESETS[brief.visualDirection];
  const copyMeta = COPY_TONE_PRESETS[brief.copyTone];
  const animMeta = ANIMATION_PRESETS[brief.animationPreference];

  const frontendMeta = FRONTEND_OPTIONS.find((f) => f.id === brief.stack.frontend);
  const backendMeta = BACKEND_OPTIONS.find((b) => b.id === brief.stack.backend);
  const dbMeta = DATABASE_OPTIONS.find((d) => d.id === brief.stack.database);
  const deployMeta = DEPLOYMENT_OPTIONS.find((dp) => dp.id === brief.stack.deployment);

  const { recommended } = filterResourcesForBrief(brief);
  const checklistSections = generateDeploymentChecklist(brief.stack.deployment, brief.stack.database);
  const envExample = generateEnvExample(brief.stack);
  const agentPrompt = generateAgentPrompt(brief);

  return `# ${brief.projectName} — AI Agent Build Brief

> **Tagline**: "${brief.tagline}"  
> **Generated on**: ${dateStr} by [GlidingVibe CLI](https://github.com/amruth/GlidingVibe)  
> **Target Agent**: \`${brief.selectedAgentId || 'Universal'}\`

---

## 1. Product Summary & Problem Statement

### Elevator Pitch
${brief.tagline}

### Target Audience
${brief.targetAudience}

### Problem Statement
${brief.problemStatement}

---

## 2. Core Feature Specifications

### Must-Have MVP Features
${brief.coreFeatures.map((f, i) => `${i + 1}. **${f}**`).join('\n')}

${
  brief.stretchFeatures && brief.stretchFeatures.length > 0
    ? `### Stretch / Post-MVP Goals
${brief.stretchFeatures.map((f) => `- ${f}`).join('\n')}`
    : ''
}

---

## 3. Design, Aesthetic & Copywriting Direction

### Visual Vibe: ${visualMeta?.name || brief.visualDirection}
- **Vibe Description**: ${visualMeta?.description || ''}
- **Recommended Color Palette**:
  - **Primary**: \`${visualMeta?.palette.primary}\`
  - **Secondary**: \`${visualMeta?.palette.secondary}\`
  - **Background**: \`${visualMeta?.palette.background}\`
  - **Surface / Card**: \`${visualMeta?.palette.surface}\`
  - **Accent**: \`${visualMeta?.palette.accent}\`
  - **Text**: \`${visualMeta?.palette.text}\`
- **Typography Pairing**:
  - **Headings**: ${visualMeta?.fontPairing.heading}
  - **Body Text**: ${visualMeta?.fontPairing.body}
  - **Code / Monospace**: ${visualMeta?.fontPairing.mono}
- **Design Principles**:
${visualMeta?.designPrinciples.map((p) => `  - ${p}`).join('\n') || ''}

### Copywriting Tone: ${copyMeta?.name || brief.copyTone}
- **Tone Profile**: ${copyMeta?.description || ''}
- **Tagline Formula**: *${copyMeta?.taglineStyle || ''}*
- **Call-to-Action Example**: \`${copyMeta?.sampleCta || 'Get Started'}\`
- **Writing Guidelines**:
${copyMeta?.guidelines.map((g) => `  - ${g}`).join('\n') || ''}

### Animation & Motion: ${animMeta?.name || brief.animationPreference}
- **Motion Profile**: ${animMeta?.description || ''}
- **Recommended Tools**: ${animMeta?.recommendedLibraries.join(', ') || 'Tailwind native transitions'}
- **Motion Guidelines**:
${animMeta?.guidelines.map((g) => `  - ${g}`).join('\n') || ''}

---

## 4. Technical Stack Architecture

| Layer | Selected Technology | Category | Documentation |
|---|---|---|---|
| **Frontend** | ${frontendMeta?.name || brief.stack.frontend} | ${frontendMeta?.category || 'Frontend'} | [Docs](${frontendMeta?.docsUrl || '#'}) |
| **Backend** | ${backendMeta?.name || brief.stack.backend} | ${backendMeta?.category || 'Backend'} | [Docs](${backendMeta?.docsUrl || '#'}) |
| **Database** | ${dbMeta?.name || brief.stack.database} | ${dbMeta?.category || 'Database'} | [Docs](${dbMeta?.docsUrl || '#'}) |
| **Deployment** | ${deployMeta?.name || brief.stack.deployment} | ${deployMeta?.category || 'Deployment'} | [Docs](${deployMeta?.docsUrl || '#'}) |

${
  frontendMeta?.setupCommands && frontendMeta.setupCommands.length > 0
    ? `### Quick Start Scaffolding Command
\`\`\`bash
${frontendMeta.setupCommands.join('\n')}
\`\`\`
`
    : ''
}

---

## 5. Curated Free Resources Hub (Matched for Your Stack)

Below is a curated selection of free tools, UI components, icons, and fonts matched to your chosen stack and design vibe:

| Resource | Category | What it provides | Free Tier & License | Link |
|---|---|---|---|---|
${recommended
  .map(
    (res) =>
      `| **${res.name}** | \`${res.category}/${res.subcategory}\` | ${res.description} | ${res.freeTier} *(Note: ${res.licenseNotice})* | [Visit Resource](${res.url}) |`
  )
  .join('\n')}

> **License Notice**: All third-party resources, components, photography, and fonts listed above remain subject to the respective provider's terms of service and license agreements. Please verify specific commercial attribution rules where applicable.

---

## 6. Production & Deployment Checklist

${checklistSections
  .map(
    (sec) => `### ${sec.title}
${sec.items.map((it) => `- [ ] ${it.task}`).join('\n')}`
  )
  .join('\n\n')}

### 🔐 Environment Variables Template (\`.env.example\`)
\`\`\`env
${envExample}
\`\`\`

---

## 7. Tailored AI Agent Implementation Prompt

Copy the prompt block below and feed it directly into your AI coding assistant (Claude Code, Cursor Composer, OpenAI Codex, Gemini CLI / Antigravity, or Aider):

\`\`\`markdown
${agentPrompt}
\`\`\`

---

*Generated by **GlidingVibe CLI** — Turn product ideas into AI-agent-ready build briefs in seconds.*
`;
}
