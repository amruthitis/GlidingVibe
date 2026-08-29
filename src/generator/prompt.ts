import type { ProjectBrief } from '../types/index.js';
import type { CodingAgentId } from '../types/agents.js';
import { defaultRegistry } from '../adapters/index.js';
import { VISUAL_VIBE_PRESETS, COPY_TONE_PRESETS, ANIMATION_PRESETS } from '../data/stacks.js';

export function generateProductQualityDirectives(brief: ProjectBrief): string {
  const auth = {
    none: 'Do not add authentication. Keep private actions unavailable rather than pretending users are signed in.',
    'email-password': 'Implement email and password authentication with secure password hashing, verified email flow, reset flow, protected routes, and authorization checks.',
    'magic-link': 'Implement passwordless email magic links with expiry, replay protection, protected routes, and authorization checks.',
    oauth: 'Implement OAuth with the provider(s) documented in the project README. Validate callback state, store sessions securely, and protect routes.',
    'oauth-email-password': 'Implement OAuth plus email/password authentication. Keep account linking, session security, password resets, protected routes, and authorization checks coherent.',
    passkeys: 'Implement passkeys/WebAuthn with a practical fallback and protected routes. Do not fake biometric or credential success states.',
    'enterprise-sso': 'Implement enterprise SSO (OIDC or SAML as appropriate) with organization membership, protected routes, and authorization checks.',
  }[brief.authMethod || 'none'];
  const components = brief.componentPrompts?.length
    ? `\n\n## Component prompts\n${brief.componentPrompts.map(({ component, prompt }, index) => `${index + 1}. ${component}\n${prompt}`).join('\n\n')}`
    : '';

  return `

## Product quality bar
- Build a restrained, legible product interface. Do not use emojis, hype copy, fake metrics, fake testimonials, fake online indicators, “backend live” badges, or AI-themed comments.
- Prefer familiar product patterns and task-focused copy. Use a consistent spacing scale, semantic HTML, accessible contrast, keyboard support, visible focus states, and purposeful hover/pressed/disabled states.
- Include a light/dark/system theme control; a consent-aware cookie banner when non-essential cookies are used; a back-to-top control on long pages; a responsive mobile menu; documented keyboard shortcuts; an intentional scrollbar; copy buttons for copyable values; skeleton loading; a sticky header when navigation persists; a skip-to-content link; Open Graph metadata and preview image; useful empty states; expandable FAQ items where FAQs exist; and accessible toast notifications.
- ${auth}
- Never invent completed integrations, data, users, network status, or deployment state. Use clearly labeled local sample data only where it helps a user understand a workflow.
- Add CI to run type checks, tests, linting, dependency/security checks, and production builds on pull requests. Document environment variables, deploy/rollback steps, backups, observability, rate limits, and a pragmatic path to containers/Kubernetes only when the deployment needs it.${components}`;
}

export function generateAgentPrompt(brief: ProjectBrief, agentId?: CodingAgentId): string {
  const targetAgentId = agentId || (brief.selectedAgentId as CodingAgentId) || 'generic';
  const adapter = defaultRegistry.get(targetAgentId) || defaultRegistry.get('generic');

  if (adapter && targetAgentId !== 'generic') {
    return `${adapter.formatPrompt(brief)}${generateProductQualityDirectives(brief)}`;
  }

  const visualMeta = VISUAL_VIBE_PRESETS[brief.visualDirection];
  const copyMeta = COPY_TONE_PRESETS[brief.copyTone];
  const animMeta = ANIMATION_PRESETS[brief.animationPreference];
  const securityFeatures = brief.securityFeatures || ['rate-limiting', 'input-validation', 'cors-headers', 'rbac-rls', 'dependency-audit'];

  return `# AGENT IMPLEMENTATION DIRECTIVE: ${brief.projectName.toUpperCase()}

> **Elevator Pitch**: "${brief.tagline}"

You are an experienced software engineer and product designer. Build a complete, functional web application from this specification.

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
  - *Typography*: Headings: **${brief.primaryFont || visualMeta?.fontPairing.heading || 'Inter'}**, Body: **${brief.secondaryFont || visualMeta?.fontPairing.body || 'Plus Jakarta Sans'}**, Code: **${visualMeta?.fontPairing.mono || 'JetBrains Mono'}**
${brief.designResource ? `  - *Design Inspiration Resource*: ${brief.designResource}\n` : ''}${brief.designPrompt ? `  - *Custom Design Prompt/Vibe*: ${brief.designPrompt}\n` : ''}${brief.designReferenceDoc ? `  - *Design Specification MD*: ${brief.designReferenceDoc}\n` : ''}${brief.designScreenshotPath ? `  - *Screenshot Reference*: ${brief.designScreenshotPath}\n` : ''}  - *Key Principles*:
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

## 4. Cybersecurity & Application Defense Directives
## Security requirements
${securityFeatures.map((sec) => `- [ ] **${sec}**: Implement strict defenses and input/auth validation for ${sec}.`).join('\n')}
- Enforce strict runtime schema validation (Zod) on ALL public API endpoints.
- Enable Row-Level Security (RLS) or authorization checks so users cannot read/write each other's data.
- Never hardcode API keys, secrets, or passwords in client code.
- Add security headers (CSP, HSTS, X-Frame-Options) and rate-limiting middleware.

---

## 5. Feature Requirements (Step-by-Step Milestones)

### Phase 1: Foundation & Layout
- Initialize project configuration, Tailwind CSS theme colors, typography, and security headers middleware.
- Scaffold responsive app shell (Navigation bar, Hero section, Footer, Mobile drawer).
- Set up shared state management and layout containers.

### Phase 2: Core Feature Implementation
${brief.coreFeatures.map((f, i) => `#### Feature ${i + 1}: ${f}\n- Build interactive UI components with realistic initial state.\n- Connect user actions with Zod schema input validation and error handling.\n- Ensure authorization feedback and error states are user-friendly.`).join('\n\n')}

${
  brief.stretchFeatures && brief.stretchFeatures.length > 0
    ? `### Phase 3: Stretch Enhancements
${brief.stretchFeatures.map((f, i) => `- [ ] ${f}`).join('\n')}`
    : ''
}

### Phase 4: Security Verification & Polish
- Add loading skeletons, empty states, and toast notifications.
- Run type check (\`npm run typecheck\`) and verify security tests pass.
- Ensure 100% mobile responsiveness (iPhone, iPad, Desktop).

---

## 6. Execution Instructions for the AI Agent
1. **Explore First**: Check existing files in the repository before writing new ones.
2. **Modular & Secure Code**: Keep components small, reusable, and cleanly organized in \`src/components\`.
3. **Mock Data Quality**: Populate UI with rich, realistic mock data so the app looks ready for a demo.
4. **Zero Broken Dependencies**: Test imports, run security audit, and verify build checks before completion.
5. Begin by building the core app foundation and report each completed milestone.${generateProductQualityDirectives(brief)}`;
}
