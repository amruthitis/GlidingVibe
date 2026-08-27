import type { AgentAdapter, AgentDetectionResult, CodingAgentId } from '../types/agents.js';
import { ClaudeCodeAdapter } from './claude.js';
import { CursorAdapter } from './cursor.js';
import { CodexAdapter } from './codex.js';
import { GeminiAgentAdapter } from './gemini.js';
import { AiderAdapter } from './aider.js';
import { GenericAgentAdapter } from './generic.js';

export * from './base.js';
export * from './claude.js';
export * from './cursor.js';
export * from './codex.js';
export * from './gemini.js';
export * from './aider.js';
export * from './generic.js';

export class AgentAdapterRegistry {
  private adapters: Map<CodingAgentId, AgentAdapter> = new Map();

  constructor() {
    this.register(new ClaudeCodeAdapter());
    this.register(new CursorAdapter());
    this.register(new CodexAdapter());
    this.register(new GeminiAgentAdapter());
    this.register(new AiderAdapter());
    this.register(new GenericAgentAdapter());
  }

  register(adapter: AgentAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  get(id: CodingAgentId): AgentAdapter | undefined {
    return this.adapters.get(id);
  }

  getAll(): AgentAdapter[] {
    return Array.from(this.adapters.values());
  }

  async detectAll(): Promise<{ adapter: AgentAdapter; result: AgentDetectionResult }[]> {
    const promises = this.getAll().map(async (adapter) => {
      try {
        const result = await adapter.detect();
        return { adapter, result };
      } catch (err) {
        return {
          adapter,
          result: {
            id: adapter.id,
            name: adapter.name,
            commandName: adapter.commandName,
            isInstalled: false,
            description: adapter.description,
            installGuideUrl: adapter.installGuideUrl,
          },
        };
      }
    });

    return Promise.all(promises);
  }

  async getInstalledAgents(): Promise<{ adapter: AgentAdapter; result: AgentDetectionResult }[]> {
    const all = await this.detectAll();
    return all.filter((item) => item.result.isInstalled);
  }
}

export const defaultRegistry = new AgentAdapterRegistry();
