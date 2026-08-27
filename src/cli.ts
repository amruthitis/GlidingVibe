#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { handleInitCommand } from './commands/init.js';
import { handleResourcesCommand } from './commands/resources.js';
import { handleAgentsCommand } from './commands/agents.js';
import { handleTemplatesCommand } from './commands/templates.js';
import { setupGracefulExit } from './utils/terminal.js';

setupGracefulExit();

const program = new Command();

program
  .name('glidingvibe')
  .description('Turn product ideas into AI-agent-ready build briefs with curated free resources & stack checklists')
  .version('1.0.0', '-v, --version', 'Output the current version of GlidingVibe');

// Subcommand: init (isDefault: true allows `glidingvibe` or `glidingvibe init`)
program
  .command('init', { isDefault: true })
  .description('Start the interactive wizard to generate an AI-agent build brief')
  .option('-o, --output <path>', 'Path to save generated Markdown brief', './glidingvibe-brief.md')
  .option('-t, --template <name>', 'Starter template to use (e.g. salon-vibe, saas-starter, ai-workspace)')
  .option('-a, --agent <name>', 'Target AI coding agent (e.g. claude, cursor, codex, gemini, aider, generic)')
  .option('-y, --yes', 'Skip prompts and generate immediately using template defaults', false)
  .action(async (options) => {
    try {
      await handleInitCommand({
        output: options.output,
        template: options.template,
        agent: options.agent,
        yes: options.yes,
      });
    } catch (err: any) {
      if (err?.name === 'ExitPromptError' || err?.message?.includes('User force closed')) {
        process.exit(0);
      }
      console.error(pc.red(`\nError: ${err?.message || err}`));
      process.exit(1);
    }
  });

// Subcommand: resources
program
  .command('resources')
  .description('Browse curated free UI, content, motion, and engineering resources')
  .option('-c, --category <category>', 'Filter by category (visual, content, motion, engineering, all)')
  .option('-s, --search <query>', 'Search resources by keyword or tag')
  .action(async (options) => {
    try {
      await handleResourcesCommand({
        category: options.category,
        search: options.search,
      });
    } catch (err: any) {
      console.error(pc.red(`\nError: ${err?.message || err}`));
      process.exit(1);
    }
  });

// Subcommand: agents
program
  .command('agents')
  .description('Detect locally installed AI coding agent CLIs (Claude Code, Cursor, Codex, Gemini, Aider)')
  .action(async () => {
    try {
      await handleAgentsCommand();
    } catch (err: any) {
      console.error(pc.red(`\nError: ${err?.message || err}`));
      process.exit(1);
    }
  });

// Subcommand: templates
program
  .command('templates')
  .description('List available starter templates (Salon Experience, SaaS MVP, AI Workspace, etc.)')
  .action(() => {
    try {
      handleTemplatesCommand();
    } catch (err: any) {
      console.error(pc.red(`\nError: ${err?.message || err}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
