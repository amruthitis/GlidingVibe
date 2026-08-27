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
} from '../types/index.js';
import type { CodingAgentId } from '../types/agents.js';

export async function runInteractiveWizard(options: WizardOptions = {}): Promise<ProjectBrief> {
  printBanner();
  intro(pc.bgCyan(pc.black(' ✨ GLIDINGVIBE — AI-AGENT BUILD BRIEF WIZARD ')));

  // 1. Template vs Custom Choice
  let briefBase: Partial<ProjectBrief> = {};

  let startMode = 'custom';
  if (!options.template && !options.nonInteractive) {
    startMode = handleCancel(
      await select({
        message: 'How would you like to start?',
        options: [
          { value: 'custom', label: '🚀 Start Fresh (Custom Project)', hint: 'Create a tailor-made brief from scratch' },
          { value: 'template', label: '📦 Start from a Curated Template', hint: 'Salon Experience, SaaS MVP, AI Studio, etc.' },
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
      `💡 ${pc.cyan('Tip:')} You can customize any of these values in the next steps!`,
      'Loaded Template'
    );
  }

  // 2. Project Name
  const projectName = handleCancel(
    await text({
      message: 'What is the name of your project?',
      placeholder: briefBase.projectName || 'MyNextBigThing',
      initialValue: briefBase.projectName || '',
      validate(val) {
        if (!val || val.trim().length === 0) return 'Project name is required!';
      },
    })
  );

  // 3. One-sentence idea / Tagline
  const tagline = handleCancel(
    await text({
      message: 'What is the one-sentence elevator pitch / tagline?',
      placeholder: briefBase.tagline || 'An AI-powered workspace to streamline team productivity.',
      initialValue: briefBase.tagline || '',
      validate(val) {
        if (!val || val.trim().length < 5) return 'Please provide at least 5 characters for your pitch.';
      },
    })
  );

  // 4. Target Audience
  const targetAudience = handleCancel(
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
  const problemStatement = handleCancel(
    await text({
      message: 'What core problem does this solve?',
      placeholder: briefBase.problemStatement || 'Users currently waste too much time manually coordinating tasks.',
      initialValue: briefBase.problemStatement || '',
      validate(val) {
        if (!val || val.trim().length === 0) return 'Problem statement is required.';
      },
    })
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
    visualDirection,
    copyTone,
    animationPreference,
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
    `${pc.bold(pc.white(`✨ ${brief.projectName}`))}\n` +
    `${pc.dim(brief.tagline)}\n\n` +
    `📁 ${pc.cyan('Brief Location')}: ${pc.bold(resolvedPath)}\n` +
    `🤖 ${pc.cyan('Target Agent')}: ${pc.yellow(selectedAgentId)}\n` +
    `🛠️  ${pc.cyan('Tech Stack')}: ${frontend} • ${backend} • ${database} • ${deployment}\n` +
    `🎨 ${pc.cyan('Visual Direction')}: ${visualDirection}\n` +
    `${copied ? pc.green('\n📋 Implementation prompt copied to clipboard!') : ''}`,
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

      console.log(pc.cyan(`\n🚀 Launching ${chosenAdapterMeta.adapter.name}...`));
      console.log(pc.dim(`> ${launchCmd.command} ${launchCmd.args.join(' ')}\n`));

      await chosenAdapterMeta.adapter.launch({
        briefPath: resolvedPath,
        prompt: agentPrompt,
        brief,
      });
    }
  }

  outro(pc.bgGreen(pc.black(' 🚀 Ready to build! Happy hacking! ')));
  return brief;
}
