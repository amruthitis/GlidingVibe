import type { ProjectBrief } from '../types/index.js';
import type { CodingAgentId } from '../types/agents.js';
import { defaultRegistry } from '../adapters/index.js';
import { VISUAL_VIBE_PRESETS, COPY_TONE_PRESETS, ANIMATION_PRESETS } from '../data/stacks.js';

export function generateAgentPrompt(brief: ProjectBrief, agentId?: CodingAgentId): string {
  const targetAgentId = agentId || (brief.selectedAgentId as CodingAgentId) || 'generic';
  const adapter = defaultRegistry.get(targetAgentId) || defaultRegistry.get('generic');

  if (adapter && targetAgentId !== 'generic') {
    return adapter.formatPrompt(brief);
  }

  // Universal / High-Octane Full Prompt
  const visualMeta = VISUAL_VIBE_PRESETS[brief.visualDirection];
  const copyMeta = COPY_TONE_PRESETS[brief.copyTone];
  const animMeta = ANIMATION_PRESETS[brief.animationPreference];

  return `# AGENT IMPLEMENTATION DIRECTIVE: ${brief.projectName.toUpperCase()}

> **Elevator Pitch**: "${brief.tagline}"

You are an expert autonomous software engineer and product designer. Build a complete, functional, and visually striking web application based on this technical specification.

---

## 1. Project Overview & Target Audience
- **Product Name**: ${brief.projectName}
- **Target Audience**: ${brief.targetAudience}
- **Core Problem Addressed**: ${brief.problemStatement}
- **Specification File**: \`${brief.outputPath || './glidingvibe-brief.md'}\`

---

## 2. Technical Stack Architecture
- **Frontend**: ${brief.stack.frontend}
- **Backend**: ${brief.stack.backend}
- **Database / State**: ${brief.stack.database}
- **Target Deployment**: ${brief.stack.deployment}

---

## 3. UI/UX Design System & Aesthetic Directives
- **Visual Aesthetic**: ${visualMeta?.name || brief.visualDirection}
  - *Summary*: ${visualMeta?.description || ''}
  - *Palette*: Primary \`${visualMeta?.palette.primary}\`, Secondary \`${visualMeta?.palette.secondary}\`, Surface \`${visualMeta?.palette.surface}\`, Text \`${visualMeta?.palette.text}\`, Accent \`${visualMeta?.palette.accent}\`
  - *Typography*: Headings: **${visualMeta?.fontPairing.heading}**, Body: **${visualMeta?.fontPairing.body}**, Code: **${visualMeta?.fontPairing.mono}**
  - *Key Principles*:
    ${visualMeta?.designPrinciples.map((p) => `- ${p}`).join('\n    ') || ''}

- **Copywriting Voice & Tone**: ${copyMeta?.name || brief.copyTone}
  - *Tone Summary*: ${copyMeta?.description || ''}
  - *Tagline Style Formula*: "${copyMeta?.taglineStyle || ''}"
  - *Sample Call to Action*: "${copyMeta?.sampleCta || ''}"
  - *Copy Guidelines*:
    ${copyMeta?.guidelines.map((g) => `- ${g}`).join('\n    ') || ''}

- **Motion & Interactions**: ${animMeta?.name || brief.animationPreference}
  - *Motion Feel*: ${animMeta?.description || ''}
  - *Recommended Libraries*: ${animMeta?.recommendedLibraries.join(', ') || 'Standard CSS'}
  - *Guidelines*:
    ${animMeta?.guidelines.map((g) => `- ${g}`).join('\n    ') || ''}

---

## 4. Feature Requirements (Step-by-Step Milestones)

### Phase 1: Foundation & Layout
- Initialize project configuration, Tailwind CSS theme colors, and typography.
- Scaffold responsive app shell (Navigation bar, Hero section, Footer, Mobile drawer).
- Set up shared state management and layout containers.

### Phase 2: Core Feature Implementation
${brief.coreFeatures.map((f, i) => `#### Feature ${i + 1}: ${f}\n- Build interactive UI components with realistic initial state.\n- Connect user actions (forms, buttons, filters, modals).\n- Ensure validation feedback and error states are user-friendly.`).join('\n\n')}

${
  brief.stretchFeatures && brief.stretchFeatures.length > 0
    ? `### Phase 3: Stretch Enhancements
${brief.stretchFeatures.map((f, i) => `- [ ] ${f}`).join('\n')}`
    : ''
}

### Phase 4: Polish & Resilience
- Add loading skeletons, empty states, and toast notifications.
- Ensure 100% mobile responsiveness (iPhone, iPad, Desktop).
- Verify type check passes with zero errors (\`npm run typecheck\` / \`tsc --noEmit\`).

---

## 5. Execution Instructions for the AI Agent
1. **Explore First**: Check existing files in the repository before writing new ones.
2. **Modular Code**: Keep components small, reusable, and cleanly organized in \`src/components\`.
3. **Mock Data Quality**: Populate UI with rich, realistic mock data so the app looks ready for a demo.
4. **Zero Broken Dependencies**: Test imports and run build checks before declaring completion.
5. Begin by building the core app foundation and report each completed milestone.`;
}
