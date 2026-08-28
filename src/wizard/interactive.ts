import { intro, outro, text, select, multiselect, confirm, spinner, note } from '@clack/prompts';
import pc from 'picocolors';
import { handleCancel, displayBox } from '../utils/terminal.js';
import { printBanner } from '../utils/banner.js';
import { writeBriefToFile } from '../utils/filesystem.js';
import { copyToClipboard } from '../utils/clipboard.js';
import { generateMarkdownBrief } from '../generator/markdown.js';
import { generateAgentPrompt } from '../generator/prompt.js';
import { defaultRegistry } from '../adapters/index.js';
import { STARTER_TEMPLATES } from '../data/templates.js';
import {
  FRONTEND_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
  DEPLOYMENT_OPTIONS,
  VISUAL_VIBE_PRESETS,
  COPY_TONE_PRESETS,
  ANIMATION_PRESETS,
} from '../data/stacks.js';
import { CYBERSECURITY_OPTIONS } from '../data/security.js';
import { POPULAR_FONTS } from '../data/fonts.js';
import { downloadFontFiles } from '../utils/fonts.js';
import { FREE_UI_RESOURCES } from '../data/resources.js';
import type {
  ProjectBrief,
  WizardOptions,
  VisualDirection,
  CopyTone,
  AnimationPreference,
  FrontendStack,
  BackendStack,
  DatabaseStack,
  DeploymentProvider,
  CybersecurityFeature,
  AuthMethod,
  ComponentPrompt,
} from '../types/index.js';
import type { CodingAgentId } from '../types/agents.js';

async function collectLines(message: string, initialValue = '', required = true): Promise<string> {
  const lines = initialValue ? initialValue.split('\n').filter(Boolean) : [];
  let addAnother = true;
  while (addAnother) {
    const line = handleCancel(await text({
      message: lines.length ? 'Add another line (or detail):' : message,
      initialValue: lines.length === 0 ? initialValue : '',
      validate(value) {
        if (required && lines.length === 0 && !value.trim()) return 'Please enter a short description.';
      },
    }));
    if (line.trim()) lines.push(line.trim());
    addAnother = handleCancel(await confirm({ message: 'Add another line?', initialValue: false }));
  }
  return lines.join('\n');
}

async function collectComponentPrompts(initial: ComponentPrompt[] = []): Promise<ComponentPrompt[]> {
  const prompts = [...initial];
  let addAnother = handleCancel(await confirm({ message: 'Add component-specific prompts to copy with the build brief?', initialValue: prompts.length > 0 }));
  while (addAnother) {
    const component = handleCancel(await text({ message: 'Component name:', placeholder: 'Pricing table, onboarding, team settings', validate: (v) => !v.trim() ? 'A component name is required.' : undefined }));
    const prompt = await collectLines('Describe this component. You can add as many lines as you need.');
    prompts.push({ component, prompt });
    addAnother = handleCancel(await confirm({ message: 'Add another component prompt?', initialValue: false }));
  }
  return prompts;
}

export async function runInteractiveWizard(options: WizardOptions = {}): Promise<ProjectBrief> {
  printBanner();
  intro(pc.bgCyan(pc.black(' GLIDINGVIBE — AI-AGENT BUILD BRIEF WIZARD ')));

  // 1. Template vs Custom Choice
  let briefBase: Partial<ProjectBrief> = {};

  let startMode = 'custom';
  if (!options.template && !options.nonInteractive) {
    startMode = handleCancel(
      await select({
        message: 'How would you like to start?',
        options: [
          { value: 'custom', label: 'Start Fresh (Custom Project)', hint: 'Create a tailor-made brief from scratch' },
          { value: 'template', label: 'Start from a Curated Template', hint: 'SaaS MVP, AI Studio, etc.' },
        ],
      })
    );
  }

  if (startMode === 'template' || options.template) {
    let chosenTemplateId = options.template;
    if (!chosenTemplateId) {
      chosenTemplateId = handleCancel(
        await select({
          message: 'Choose a starter template:',
          options: STARTER_TEMPLATES.map((t) => ({
            value: t.id,
            label: `${t.name}`,
            hint: t.description,
          })),
        })
      );
    }

    const template = STARTER_TEMPLATES.find((t) => t.id === chosenTemplateId) || STARTER_TEMPLATES[0];
    briefBase = {
      ...template.brief,
      stack: { ...template.brief.stack },
      coreFeatures: [...template.brief.coreFeatures],
      stretchFeatures: template.brief.stretchFeatures ? [...template.brief.stretchFeatures] : [],
    };

    note(
      `${pc.bold(template.name)}\n${pc.dim(template.description)}\n\n` +
      `${pc.cyan('Tip:')} You can customize any of these values in the next steps!`,
      'Loaded Template'
    );
  }

  // 2. Project Name
  let projectName = handleCancel(
    await text({
      message: 'What is the name of your project?',
      placeholder: briefBase.projectName || 'MyNextBigThing',
      initialValue: briefBase.projectName || '',
      validate(val) {
        if (!val || val.trim().length === 0) return 'Project name is required!';
      },
    })
  );

  // 3. Product idea. Repeatable input keeps detail without requiring terminal multiline tricks.
  let tagline = await collectLines(
    'Describe your product idea. Add a second line for context, scope, or a differentiator.',
    briefBase.tagline || ''
  );

  // 4. Target Audience
  let targetAudience = handleCancel(
    await text({
      message: 'Who is the target audience / primary user?',
      placeholder: briefBase.targetAudience || 'Indie hackers, startup founders, and design leads.',
      initialValue: briefBase.targetAudience || '',
      validate(val) {
        if (!val || val.trim().length === 0) return 'Target audience is required.';
      },
    })
  );

  // 5. Problem Statement
  let problemStatement = await collectLines(
    'What core problem does this solve? Add context or constraints on additional lines.',
    briefBase.problemStatement || ''
  );

  // 6. Core Features
  let coreFeatures: string[] = briefBase.coreFeatures || [];
  if (coreFeatures.length === 0) {
    const rawFeatures = handleCancel(
      await text({
        message: 'List 3-5 core MVP features (comma-separated):',
        placeholder: 'User auth, Interactive dashboard, Instant export, Stripe checkout',
        validate(val) {
          if (!val || val.trim().length === 0) return 'At least one feature is required.';
        },
      })
    );
    coreFeatures = rawFeatures.split(',').map((f) => f.trim()).filter(Boolean);
  } else {
    const editFeatures = handleCancel(
      await confirm({
        message: `Use pre-configured features (${coreFeatures.length} items)?`,
        initialValue: true,
      })
    );
    if (!editFeatures) {
      const rawFeatures = handleCancel(
        await text({
          message: 'Enter your custom features (comma-separated):',
          initialValue: coreFeatures.join(', '),
          validate(val) {
            if (!val || val.trim().length === 0) return 'At least one feature is required.';
          },
        })
      );
      coreFeatures = rawFeatures.split(',').map((f) => f.trim()).filter(Boolean);
    }
  }

  let componentPrompts = await collectComponentPrompts(briefBase.componentPrompts);

  // 7. Visual Direction
  const visualDirection = handleCancel(
    await select({
      message: 'Select a visual & design vibe:',
      initialValue: briefBase.visualDirection || 'minimal-clean',
      options: Object.entries(VISUAL_VIBE_PRESETS).map(([key, meta]) => ({
        value: key as VisualDirection,
        label: meta.name,
        hint: meta.description,
      })),
    })
  );

  // 7b. Design Personalization & Resource Selection
  let designResource = briefBase.designResource;
  let designPrompt = briefBase.designPrompt;
  let designReferenceDoc = briefBase.designReferenceDoc;
  let designScreenshotPath = briefBase.designScreenshotPath;

  const wantDesignCustomization = handleCancel(
    await confirm({
      message: 'Would you like to add custom design resources, prompts, or screenshot references?',
      initialValue: false,
    })
  );

  if (wantDesignCustomization) {
    note(
      FREE_UI_RESOURCES.filter((resource) => ['v0 by vercel', '21st.dev', 'shadcn/ui'].includes(resource.name.toLowerCase()))
        .map((resource) => `${pc.bold(resource.name)}\n${resource.url}`)
        .join('\n\n'),
      'Useful design resources'
    );
    const designChoice = handleCancel(
      await select({
        message: 'Select primary design reference method:',
        options: [
          { value: 'v0-dev', label: 'v0.dev / Generative UI Prompt', hint: 'Provide text prompt or v0 URL' },
          { value: '21st-dev', label: '21st.dev / Component Snippet', hint: 'Copy component link or snippet' },
          { value: 'shadcn-ui', label: 'shadcn/ui / Radix UI Blocks', hint: 'Tailwind + Radix accessible blocks' },
          { value: 'screenshot', label: 'Screenshot Mockup File', hint: 'Path to visual mockup screenshot' },
          { value: 'custom-md', label: 'Custom Design Brief MD', hint: 'Path or link to design markdown spec' },
        ],
      })
    );

    designResource = designChoice;

    if (designChoice === 'screenshot') {
      designScreenshotPath = handleCancel(
        await text({
          message: 'Enter path to screenshot mockup file (e.g. ./docs/mockup.png):',
          placeholder: './mockup.png',
        })
      );
    } else if (designChoice === 'custom-md') {
      designReferenceDoc = handleCancel(
        await text({
          message: 'Enter path or URL to design specification MD file:',
          placeholder: './design-spec.md',
        })
      );
    } else {
      designPrompt = await collectLines('Paste your design prompt, aesthetic notes, or component URL. Add more lines if useful.');
    }
  }

  // 7c. Primary and Secondary Font Selection
  let primaryFont = briefBase.primaryFont || VISUAL_VIBE_PRESETS[visualDirection as VisualDirection]?.fontPairing.heading || 'Inter';
  let secondaryFont = briefBase.secondaryFont || VISUAL_VIBE_PRESETS[visualDirection as VisualDirection]?.fontPairing.body || 'Plus Jakarta Sans';

  const customizeFonts = handleCancel(
    await confirm({
      message: `Customize typography fonts (Default: Primary "${primaryFont}", Secondary "${secondaryFont}")?`,
      initialValue: false,
    })
  );

  if (customizeFonts) {
    const fontOptionChoice = handleCancel(
      await select({
        message: 'Select Primary Font (Headings & Titles):',
        options: [
          ...POPULAR_FONTS.slice(0, 10).map((f) => ({
            value: f.name,
            label: `${f.name} (${f.category})`,
            hint: f.description,
          })),
          { value: 'custom', label: 'Enter custom Google Font name...' },
        ],
      })
    );

    if (fontOptionChoice === 'custom') {
      primaryFont = handleCancel(
        await text({
          message: 'Enter Primary Font name (e.g. Space Grotesk, Syne, Geist):',
          placeholder: 'Space Grotesk',
          validate(v) {
            if (!v || !v.trim()) return 'Font name is required!';
          },
        })
      );
    } else {
      primaryFont = fontOptionChoice;
    }

    const secFontOptionChoice = handleCancel(
      await select({
        message: 'Select Secondary Font (Body & UI text):',
        options: [
          ...POPULAR_FONTS.slice(0, 10).map((f) => ({
            value: f.name,
            label: `${f.name} (${f.category})`,
            hint: f.description,
          })),
          { value: 'custom', label: 'Enter custom Google Font name...' },
        ],
      })
    );

    if (secFontOptionChoice === 'custom') {
      secondaryFont = handleCancel(
        await text({
          message: 'Enter Secondary Font name:',
          placeholder: 'Plus Jakarta Sans',
          validate(v) {
            if (!v || !v.trim()) return 'Font name is required!';
          },
        })
      );
    } else {
      secondaryFont = secFontOptionChoice;
    }
  }

  // Ask to download font files
  const shouldDownloadFonts = handleCancel(
    await confirm({
      message: `Download local .woff2 font files for "${primaryFont}" & "${secondaryFont}" into ./public/fonts?`,
      initialValue: false,
    })
  );

  if (shouldDownloadFonts) {
    const fontSpinner = spinner();
    fontSpinner.start(`Downloading font files for ${primaryFont} and ${secondaryFont}...`);
    await downloadFontFiles(primaryFont, './public/fonts');
    if (secondaryFont !== primaryFont) {
      await downloadFontFiles(secondaryFont, './public/fonts');
    }
    fontSpinner.stop(pc.green(`✔ Font files saved to ${pc.cyan('./public/fonts')}`));
  }

  // 8. Copy Tone
  const copyTone = handleCancel(
    await select({
      message: 'Select a copywriting tone of voice:',
      initialValue: briefBase.copyTone || 'professional-clear',
      options: Object.entries(COPY_TONE_PRESETS).map(([key, meta]) => ({
        value: key as CopyTone,
        label: meta.name,
        hint: meta.description,
      })),
    })
  );

  // 9. Animation Preference
  const animationPreference = handleCancel(
    await select({
      message: 'Select an animation & motion preference:',
      initialValue: briefBase.animationPreference || 'subtle-snappy',
      options: Object.entries(ANIMATION_PRESETS).map(([key, meta]) => ({
        value: key as AnimationPreference,
        label: meta.name,
        hint: meta.description,
      })),
    })
  );

  // 10. Frontend Stack
  const frontend = handleCancel(
    await select({
      message: 'Select your Frontend Framework:',
      initialValue: briefBase.stack?.frontend || 'nextjs',
      options: FRONTEND_OPTIONS.map((f) => ({
        value: f.id,
        label: f.name,
        hint: `${f.badge ? `[${f.badge}] ` : ''}${f.description}`,
      })),
    })
  );

  // 11. Backend Stack
  const backend = handleCancel(
    await select({
      message: 'Select your Backend Architecture:',
      initialValue: briefBase.stack?.backend || 'nextjs-api',
      options: BACKEND_OPTIONS.map((b) => ({
        value: b.id,
        label: b.name,
        hint: `${b.badge ? `[${b.badge}] ` : ''}${b.description}`,
      })),
    })
  );

  // 12. Database Stack
  const database = handleCancel(
    await select({
      message: 'Select your Database / State layer:',
      initialValue: briefBase.stack?.database || 'supabase',
      options: DATABASE_OPTIONS.map((d) => ({
        value: d.id,
        label: d.name,
        hint: `${d.badge ? `[${d.badge}] ` : ''}${d.description}`,
      })),
    })
  );

  let authMethod = handleCancel(
    await select({
      message: 'How should people sign in?',
      initialValue: briefBase.authMethod || 'email-password',
      options: [
        { value: 'none', label: 'No sign-in', hint: 'Public or frontend-only project' },
        { value: 'email-password', label: 'Email and password', hint: 'Standard accounts with reset flow' },
        { value: 'magic-link', label: 'Email magic link', hint: 'Passwordless sign-in' },
        { value: 'oauth', label: 'OAuth', hint: 'Google, GitHub, or another provider' },
        { value: 'oauth-email-password', label: 'OAuth + email/password', hint: 'Offer both paths' },
        { value: 'passkeys', label: 'Passkeys', hint: 'WebAuthn with a sensible fallback' },
        { value: 'enterprise-sso', label: 'Enterprise SSO', hint: 'OIDC or SAML organizations' },
      ],
    })
  ) as AuthMethod;

  // 13. Deployment Provider
  const deployment = handleCancel(
    await select({
      message: 'Select your Deployment Provider:',
      initialValue: briefBase.stack?.deployment || 'vercel',
      options: DEPLOYMENT_OPTIONS.map((dp) => ({
        value: dp.id,
        label: dp.name,
        hint: `${dp.badge ? `[${dp.badge}] ` : ''}${dp.description}`,
      })),
    })
  );

  // A concise review provides an escape hatch without making the user restart the wizard.
  let editAnswers = handleCancel(await confirm({ message: 'Review or edit earlier answers before creating the brief?', initialValue: false }));
  while (editAnswers) {
    const field = handleCancel(await select({
      message: 'Choose an answer to update:',
      options: [
        { value: 'name', label: 'Project name' },
        { value: 'idea', label: 'Product idea' },
        { value: 'audience', label: 'Target audience' },
        { value: 'problem', label: 'Problem statement' },
        { value: 'features', label: 'Core features' },
        { value: 'auth', label: 'Authentication method' },
        { value: 'components', label: 'Component prompts' },
      ],
    }));
    if (field === 'name') projectName = handleCancel(await text({ message: 'Project name:', initialValue: projectName, validate: (v) => !v.trim() ? 'Project name is required.' : undefined }));
    if (field === 'idea') tagline = await collectLines('Describe your product idea.', tagline);
    if (field === 'audience') targetAudience = handleCancel(await text({ message: 'Target audience:', initialValue: targetAudience, validate: (v) => !v.trim() ? 'Target audience is required.' : undefined }));
    if (field === 'problem') problemStatement = await collectLines('What problem does it solve?', problemStatement);
    if (field === 'features') {
      const raw = handleCancel(await text({ message: 'Core features (comma-separated):', initialValue: coreFeatures.join(', '), validate: (v) => !v.trim() ? 'At least one feature is required.' : undefined }));
      coreFeatures = raw.split(',').map((item) => item.trim()).filter(Boolean);
    }
    if (field === 'auth') authMethod = handleCancel(await select({ message: 'How should people sign in?', initialValue: authMethod, options: [
      { value: 'none', label: 'No sign-in' }, { value: 'email-password', label: 'Email and password' }, { value: 'magic-link', label: 'Email magic link' }, { value: 'oauth', label: 'OAuth' }, { value: 'oauth-email-password', label: 'OAuth + email/password' }, { value: 'passkeys', label: 'Passkeys' }, { value: 'enterprise-sso', label: 'Enterprise SSO' },
    ] })) as AuthMethod;
    if (field === 'components') componentPrompts = await collectComponentPrompts(componentPrompts);
    editAnswers = handleCancel(await confirm({ message: 'Edit another answer?', initialValue: false }));
  }

  // 13b. Cybersecurity Protection & Testing Selection
  let securityFeatures: CybersecurityFeature[] = briefBase.securityFeatures || (options.securityFeatures && options.securityFeatures.length > 0 ? options.securityFeatures : [
    'rate-limiting',
    'input-validation',
    'cors-headers',
    'rbac-rls',
    'dependency-audit',
  ]);

  if (!options.nonInteractive) {
    const customizeSecurity = handleCancel(
      await confirm({
        message: 'Customize security and testing requirements?',
        initialValue: false,
      })
    );

    if (customizeSecurity) {
      securityFeatures = handleCancel(
        await multiselect({
          message: 'Select Cybersecurity Features & Protections to integrate:',
          options: CYBERSECURITY_OPTIONS.map((sec) => ({
            value: sec.id,
            label: sec.name,
            hint: `${sec.description} (${sec.recommendedTools.join(', ')})`,
          })),
          initialValues: securityFeatures,
          required: false,
        })
      ) as CybersecurityFeature[];
    }
  }

  // 14. Real-Time AI Agent Detection
  const detectSpinner = spinner();
  detectSpinner.start('Detecting installed AI coding agents on your system...');

  const detectedAgents = await defaultRegistry.detectAll();
  detectSpinner.stop('Agent detection complete.');

  const agentOptions = detectedAgents.map(({ adapter, result }) => {
    const isInstalled = result.isInstalled;
    const statusPrefix = isInstalled ? pc.green('✔ [Installed]') : pc.dim('○ [Not Found]');
    const versionInfo = result.version ? ` (${result.version})` : '';
    return {
      value: adapter.id,
      label: `${statusPrefix} ${adapter.name}${versionInfo}`,
      hint: adapter.description,
    };
  });

  const selectedAgentId = handleCancel(
    await select({
      message: 'Select the AI coding agent to tailor the build prompt for:',
      options: agentOptions,
      initialValue: options.agent || (detectedAgents.find((a) => a.result.isInstalled)?.adapter.id ?? 'generic'),
    })
  );

  // Assemble Brief
  const briefPath = options.outputPath || './glidingvibe-brief.md';
  const brief: ProjectBrief = {
    projectName,
    tagline,
    targetAudience,
    problemStatement,
    coreFeatures,
    stretchFeatures: briefBase.stretchFeatures,
    securityFeatures,
    visualDirection,
    copyTone,
    animationPreference,
    primaryFont,
    secondaryFont,
    designResource,
    designPrompt,
    designReferenceDoc,
    designScreenshotPath,
    authMethod,
    componentPrompts,
    stack: {
      frontend,
      backend,
      database,
      deployment,
    },
    selectedAgentId,
    createdAt: new Date().toISOString().split('T')[0],
    outputPath: briefPath,
  };

  // Generate & Write Brief
  const genSpinner = spinner();
  genSpinner.start('Generating AI-agent-ready Markdown brief and curated resources...');
  const markdownContent = generateMarkdownBrief(brief);
  const resolvedPath = await writeBriefToFile(briefPath, markdownContent);
  genSpinner.stop(pc.green(`✔ Saved Markdown brief to ${pc.cyan(resolvedPath)}`));

  // Copy prompt to clipboard
  const agentPrompt = generateAgentPrompt(brief, selectedAgentId as CodingAgentId);
  const copied = await copyToClipboard(agentPrompt);

  // Summary box
  displayBox(
    `${pc.bold(pc.white(`${brief.projectName}`))}\n` +
    `${pc.dim(brief.tagline)}\n\n` +
    `${pc.cyan('Brief Location')}: ${pc.bold(resolvedPath)}\n` +
    `${pc.cyan('Target Agent')}: ${pc.yellow(selectedAgentId)}\n` +
    `${pc.cyan('Tech Stack')}: ${frontend} • ${backend} • ${database} • ${deployment}\n` +
    `${pc.cyan('Visual Direction')}: ${visualDirection}\n` +
    `${pc.cyan('Cybersecurity')}: ${securityFeatures.length} protection modules enabled\n` +
    `${copied ? pc.green('\nImplementation prompt copied to clipboard!') : ''}`,
    'Build Brief Ready',
    'green'
  );

  // Check if chosen agent is installed and offer to launch
  const chosenAdapterMeta = detectedAgents.find((a) => a.adapter.id === selectedAgentId);
  if (chosenAdapterMeta?.result.isInstalled && selectedAgentId !== 'generic') {
    const shouldLaunch = handleCancel(
      await confirm({
        message: `Would you like to launch ${chosenAdapterMeta.adapter.name} now with this prompt?`,
        initialValue: false,
      })
    );

    if (shouldLaunch) {
      const launchCmd = chosenAdapterMeta.adapter.getLaunchCommand({
        briefPath: resolvedPath,
        prompt: agentPrompt,
        brief,
      });

      console.log(pc.cyan(`\nLaunching ${chosenAdapterMeta.adapter.name}...`));
      console.log(pc.dim(`> ${launchCmd.command} ${launchCmd.args.join(' ')}\n`));

      await chosenAdapterMeta.adapter.launch({
        briefPath: resolvedPath,
        prompt: agentPrompt,
        brief,
      });
    }
  }

  outro(pc.bgGreen(pc.black(' Brief ready to use ')));
  return brief;
}
