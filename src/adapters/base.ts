import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type {
  AgentAdapter,
  AgentDetectionResult,
  AgentLaunchConfig,
  AgentLaunchResult,
  CodingAgentId,
} from '../types/agents.js';
import type { ProjectBrief } from '../types/index.js';

const execAsync = promisify(exec);

export abstract class BaseAgentAdapter implements AgentAdapter {
  abstract id: CodingAgentId;
  abstract name: string;
  abstract commandName: string;
  abstract description: string;
  abstract installGuideUrl: string;

  protected async checkCommandExists(cmd: string): Promise<{ exists: boolean; path?: string }> {
    try {
      const checkCmd = process.platform === 'win32' ? `where ${cmd}` : `which ${cmd}`;
      const { stdout } = await execAsync(checkCmd, { timeout: 3000 });
      const binaryPath = stdout.trim().split('\n')[0]?.trim();
      return { exists: !!binaryPath, path: binaryPath };
    } catch {
      return { exists: false };
    }
  }

  protected async getCommandVersion(cmd: string, versionFlag = '--version'): Promise<string | undefined> {
    try {
      const { stdout } = await execAsync(`${cmd} ${versionFlag}`, { timeout: 3000 });
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
    const fullCmd = `${command} ${args.map(a => (a.includes(' ') || a.includes('\n') ? `"${a.replace(/"/g, '\\"')}"` : a)).join(' ')}`;
    return {
      success: true,
      commandExecuted: fullCmd,
      message: `Ready to execute: ${fullCmd}`,
    };
  }
}
