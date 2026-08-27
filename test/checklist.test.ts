import { describe, it, expect } from 'vitest';
import { generateDeploymentChecklist, generateEnvExample } from '../src/generator/checklist.js';

describe('Deployment Checklist & Env Template Generator', () => {
  it('generates Vercel checklist', () => {
    const sections = generateDeploymentChecklist('vercel', 'supabase');
    const titles = sections.map((s) => s.title);
    expect(titles.some((t) => t.includes('Vercel'))).toBe(true);
    expect(titles.some((t) => t.includes('Supabase'))).toBe(true);
  });

  it('generates Render checklist with Postgres', () => {
    const sections = generateDeploymentChecklist('render', 'postgresql-prisma');
    const titles = sections.map((s) => s.title);
    expect(titles.some((t) => t.includes('Render'))).toBe(true);
    expect(titles.some((t) => t.includes('Database Migration'))).toBe(true);
  });

  it('generates Railway checklist', () => {
    const sections = generateDeploymentChecklist('railway', 'sqlite-turso');
    const titles = sections.map((s) => s.title);
    expect(titles.some((t) => t.includes('Railway'))).toBe(true);
  });

  it('generates .env.example with database-specific keys', () => {
    const supabaseEnv = generateEnvExample({
      frontend: 'nextjs',
      backend: 'nextjs-api',
      database: 'supabase',
      deployment: 'vercel',
    });
    expect(supabaseEnv).toContain('NEXT_PUBLIC_SUPABASE_URL=');
    expect(supabaseEnv).toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
    expect(supabaseEnv).toContain('SUPABASE_SERVICE_ROLE_KEY=');

    const prismaEnv = generateEnvExample({
      frontend: 'nextjs',
      backend: 'nextjs-api',
      database: 'postgresql-prisma',
      deployment: 'render',
    });
    expect(prismaEnv).toContain('DATABASE_URL=');

    const tursoEnv = generateEnvExample({
      frontend: 'nextjs',
      backend: 'hono',
      database: 'sqlite-turso',
      deployment: 'cloudflare-pages',
    });
    expect(tursoEnv).toContain('TURSO_DATABASE_URL=');
    expect(tursoEnv).toContain('TURSO_AUTH_TOKEN=');
  });
});
