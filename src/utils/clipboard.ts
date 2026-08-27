import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function copyToClipboard(text: string): Promise<boolean> {
  const platform = process.platform;
  try {
    if (platform === 'darwin') {
      const proc = exec('pbcopy');
      proc.stdin?.write(text);
      proc.stdin?.end();
      return true;
    } else if (platform === 'win32') {
      const proc = exec('clip');
      proc.stdin?.write(text);
      proc.stdin?.end();
      return true;
    } else if (platform === 'linux') {
      try {
        const proc = exec('wl-copy');
        proc.stdin?.write(text);
        proc.stdin?.end();
        return true;
      } catch {
        const proc = exec('xclip -selection clipboard');
        proc.stdin?.write(text);
        proc.stdin?.end();
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}
