import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type {
  AgentAdapter,
  AgentDetectionResult,
  AgentLaunchConfig,
  AgentLaunchResult,
  CodingAgentId,
} from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

const execFileAsync = promisify(execFile);
const SAFE_CMD_REGEX = /^[a-zA-Z0-9_-]+$/;

export abstract class BaseAgentAdapter implements AgentAdapter {
  abstract id: CodingAgentId;
  abstract name: string;
  abstract commandName: string;
  abstract description: string;
  abstract installGuideUrl: string;

  protected async checkCommandExists(cmd: string): Promise<{ exists: boolean; path?: string }> {
    if (!SAFE_CMD_REGEX.test(cmd)) {
      return { exists: false };
    }
    try {
      const tool = process.platform === 'win32' ? 'where' : 'which';
      const { stdout } = await execFileAsync(tool, [cmd], { timeout: 3000 });
      const binaryPath = stdout.trim().split('\n')[0]?.trim();
      return { exists: !!binaryPath, path: binaryPath };
    } catch {
      // Direct command fallback with safe array arguments
      try {
        await execFileAsync(cmd, ['--version'], { timeout: 3000 });
        return { exists: true };
      } catch {
        return { exists: false };
      }
    }
  }

  protected async getCommandVersion(cmd: string, versionFlag = '--version'): Promise<string | undefined> {
    if (!SAFE_CMD_REGEX.test(cmd)) {
      return undefined;
    }
    try {
      const safeFlag = SAFE_CMD_REGEX.test(versionFlag.replace(/^-+/, '')) ? versionFlag : '--version';
      const { stdout } = await execFileAsync(cmd, [safeFlag], { timeout: 3000 });
      const firstLine = stdout.trim().split('\n')[0]?.trim();
      return firstLine || undefined;
    } catch {
      return undefined;
    }
  }

  async detect(): Promise<AgentDetectionResult> {
    const { exists, path } = await this.checkCommandExists(this.commandName);
    let version: string | undefined;
    if (exists) {
      version = await this.getCommandVersion(this.commandName);
    }
    return {
      id: this.id,
      name: this.name,
      commandName: this.commandName,
      isInstalled: exists,
      path,
      version,
      description: this.description,
      installGuideUrl: this.installGuideUrl,
    };
  }

  abstract formatPrompt(brief: ProjectBrief): string;

  abstract getLaunchCommand(config: AgentLaunchConfig): {
    command: string;
    args: string[];
    explanation: string;
  };

  async launch(config: AgentLaunchConfig): Promise<AgentLaunchResult> {
    const { command, args } = this.getLaunchCommand(config);
    if (!SAFE_CMD_REGEX.test(command)) {
      throw new Error(`Security Exception: Refusing to launch command with invalid characters: ${command}`);
    }
    const fullCmd = `${command} ${args.map(a => (a.includes(' ') || a.includes('\n') ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' ')}`;
    return {
      success: true,
      commandExecuted: fullCmd,
      message: `Ready to execute: ${fullCmd}`,
    };
  }
}
