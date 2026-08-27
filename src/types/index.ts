export * from './catalog.js';
export * from './agents.js';

export type VisualDirection =
  | 'minimal-clean'
  | 'dark-cyberpunk'
  | 'playful-vibrant'
  | 'editorial-elegant'
  | 'retro-vintage'
  | 'corporate-modern'
  | 'brutalist-bold'
  | 'glassmorphism-glow';

export type CopyTone =
  | 'professional-clear'
  | 'friendly-casual'
  | 'punchy-direct'
  | 'technical-precise'
  | 'playful-witty'
  | 'inspiring-visionary';

export type AnimationPreference =
  | 'subtle-snappy'
  | 'smooth-organic'
  | 'high-energy-dynamic'
  | 'minimal-essential'
  | 'none';

export type FrontendStack =
  | 'nextjs'
  | 'vite-react'
  | 'sveltekit'
  | 'nuxt'
  | 'astro'
  | 'remix';

export type BackendStack =
  | 'nextjs-api'
  | 'nodejs-express'
  | 'nodejs-fastify'
  | 'hono'
  | 'supabase-backend'
  | 'python-fastapi'
  | 'none-frontend-only';

export type DatabaseStack =
  | 'postgresql-prisma'
  | 'postgresql-drizzle'
  | 'supabase'
  | 'sqlite-turso'
  | 'mongodb'
  | 'redis-upstash'
  | 'none';

export type DeploymentProvider =
  | 'vercel'
  | 'render'
  | 'railway'
  | 'netlify'
  | 'flyio'
  | 'cloudflare-pages'
  | 'aws-amplify';

export interface StackSelection {
  frontend: FrontendStack;
  backend: BackendStack;
  database: DatabaseStack;
  deployment: DeploymentProvider;
  additionalTools?: string[];
}

export interface ProjectFeature {
  id: string;
  name: string;
  description: string;
  isCore: boolean;
}

export interface ProjectBrief {
  projectName: string;
  tagline: string;
  targetAudience: string;
  problemStatement: string;
  coreFeatures: string[];
  stretchFeatures?: string[];
  visualDirection: VisualDirection;
  copyTone: CopyTone;
  animationPreference: AnimationPreference;
  stack: StackSelection;
  selectedAgentId?: string;
  createdAt: string;
  outputPath?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  brief: Omit<ProjectBrief, 'createdAt' | 'outputPath'>;
}

export interface WizardOptions {
  outputPath?: string;
  template?: string;
  agent?: string;
  nonInteractive?: boolean;
}
