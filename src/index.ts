// Core Types
export * from './types/index.js';
export * from './types/catalog.js';
export * from './types/agents.js';

// Curated Data
export { RESOURCE_CATALOG, CATEGORIES } from './data/resources.js';
export {
  FRONTEND_OPTIONS,
  BACKEND_OPTIONS,
  DATABASE_OPTIONS,
  DEPLOYMENT_OPTIONS,
  VISUAL_VIBE_PRESETS,
  COPY_TONE_PRESETS,
  ANIMATION_PRESETS,
} from './data/stacks.js';
export { STARTER_TEMPLATES } from './data/templates.js';

// Generators
export { generateMarkdownBrief, filterResourcesForBrief } from './generator/markdown.js';
export { generateAgentPrompt } from './generator/prompt.js';
export { generateDeploymentChecklist, generateEnvExample } from './generator/checklist.js';

// Adapters & Registry
export {
  AgentAdapterRegistry,
  defaultRegistry,
  BaseAgentAdapter,
  ClaudeCodeAdapter,
  CursorAdapter,
  CodexAdapter,
  GeminiAgentAdapter,
  AiderAdapter,
  GenericAgentAdapter,
} from './adapters/index.js';

// Utilities
export { writeBriefToFile, fileExists } from './utils/filesystem.js';
export { copyToClipboard } from './utils/clipboard.js';
export { printBanner, printMiniBanner } from './utils/banner.js';
