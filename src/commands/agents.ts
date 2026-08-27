import { spinner, intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { defaultRegistry } from '../adapters/index.js';
import { printMiniBanner } from '../utils/banner.js';
import { displayBox } from '../utils/terminal.js';

export async function handleAgentsCommand(): Promise<void> {
  printMiniBanner();
  intro(pc.bgBlue(pc.black(' AI CODING AGENT DETECTOR ')));

  const s = spinner();
  s.start('Scanning local PATH and binaries for supported coding agents...');

  const results = await defaultRegistry.detectAll();
  s.stop('Scan complete.');

  console.log(pc.bold('\nSupported Local Coding Agent Status:\n'));

  let installedCount = 0;

  for (const { adapter, result } of results) {
    if (result.isInstalled) {
      installedCount++;
      const details =
        `✔ ${pc.green(pc.bold('Status: INSTALLED & READY'))}\n` +
        `${pc.cyan('Command')}: \`${result.commandName}\`\n` +
        (result.path ? `${pc.cyan('Path')}: ${result.path}\n` : '') +
        (result.version ? `${pc.cyan('Version')}: ${result.version}\n` : '') +
        `${pc.dim(result.description)}`;

      displayBox(details, `${adapter.name}`, 'green');
    } else {
      const details =
        `○ ${pc.yellow('Status: Not Detected in PATH')}\n` +
        `${pc.dim('Expected Command')}: \`${adapter.commandName}\`\n` +
        `${pc.dim(adapter.description)}\n` +
        (adapter.installGuideUrl ? `${pc.cyan('Install Guide')}: ${adapter.installGuideUrl}` : '');

      displayBox(details, `${adapter.name}`, 'yellow');
    }
  }

  const summary =
    `${pc.bold('Detection Summary')}: Found ${pc.green(installedCount)} of ${pc.bold(results.length)} agent adapters ready.\n` +
    (installedCount > 0
      ? pc.dim('When running `glidingvibe init`, you can automatically launch any installed agent with your generated brief!')
      : pc.dim('You can still use any agent by copying the generated prompt to clipboard or file.'));

  outro(summary);
}
