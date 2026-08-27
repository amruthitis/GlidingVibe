import pc from 'picocolors';
import boxen from 'boxen';
import { isCancel, cancel } from '@clack/prompts';

export function handleCancel<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel(pc.yellow('GlidingVibe wizard cancelled. See you next time!'));
    process.exit(0);
  }
  return value as T;
}

export function displayBox(content: string, title?: string, borderColor: string = 'cyan'): void {
  console.log(
    boxen(content, {
      title: title ? ` ${title} ` : undefined,
      titleAlignment: 'left',
      padding: 1,
      margin: { top: 0, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: borderColor as any,
    })
  );
}

export function setupGracefulExit(): void {
  process.on('SIGINT', () => {
    console.log(pc.yellow('\n\nOperation interrupted by user. Exiting cleanly.'));
    process.exit(0);
  });
}
