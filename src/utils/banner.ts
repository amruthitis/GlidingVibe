import gradient from 'gradient-string';
import pc from 'picocolors';

const brandGradient = gradient(['#06b6d4', '#8b5cf6', '#ec4899']);
const goldGradient = gradient(['#f59e0b', '#ec4899', '#8b5cf6']);

export const BANNER_TEXT = `
  ____ _ _     _ _             __     ___ _          
 / ___| (_) __| (_)_ __   __ _ \\ \\   / (_) |__   ___ 
| |  _| | |/ _\` | | '_ \\ / _\` | \\ \\ / /| | '_ \\ / _ \\
| |_| | | | (_| | | | | | (_| |  \\ V / | | |_) |  __/
 \\____|_|_|\\__,_|_|_| |_|\\__, |   \\_/  |_|_.__/ \\___|
                         |___/                       
`;

export function printBanner(): void {
  console.log(brandGradient(BANNER_TEXT));
  console.log(
    pc.dim('  ⚡ Turn your product idea into an AI-agent-ready build brief')
  );
  console.log(
    pc.dim('  ✨ Curated Free Resources • Pluggable Agent Adapters • Deployment Checklist\n')
  );
}

export function printMiniBanner(): void {
  console.log(
    `\n  ${brandGradient.multiline('✨ GLIDINGVIBE CLI')} ${pc.dim('— Hackathon Build Brief Generator')}\n`
  );
}
