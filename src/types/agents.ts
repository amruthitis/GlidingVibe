import type { ProjectBrief } from './index.js';

export type CodingAgentId =
  | 'claude'
  | 'cursor'
  | 'codex'
  | 'gemini'
  | 'aider'
  | 'generic';

export interface AgentDetectionResult {
  id: CodingAgentId;
  name: string;
  commandName: string;
  isInstalled: boolean;
  path?: string;
  version?: string;
  description: string;
  installGuideUrl?: string;
}

export interface AgentLaunchConfig {
  briefPath: string;
  prompt: string;
  brief: ProjectBrief;
}

export interface AgentLaunchResult {
  success: boolean;
  commandExecuted?: string;
  message: string;
  error?: Error;
}

export interface AgentAdapter {
  id: CodingAgentId;
  name: string;
  commandName: string;
  description: string;
  installGuideUrl: string;

  detect(): Promise<AgentDetectionResult>;
  formatPrompt(brief: ProjectBrief): string;
  getLaunchCommand(config: AgentLaunchConfig): {
    command: string;
    args: string[];
    explanation: string;
  };
  launch(config: AgentLaunchConfig): Promise<AgentLaunchResult>;
}
