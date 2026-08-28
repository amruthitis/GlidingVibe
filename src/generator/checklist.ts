import type { DeploymentProvider, DatabaseStack, StackSelection, CybersecurityFeature } from '../types/index.js';
import { DEPLOYMENT_OPTIONS, DATABASE_OPTIONS } from '../data/stacks.js';
import { CYBERSECURITY_OPTIONS } from '../data/security.js';

export interface DeploymentChecklistSection {
  title: string;
  items: { task: string; tip?: string }[];
}

export function generateDeploymentChecklist(
  provider: DeploymentProvider,
  database: DatabaseStack,
  securityFeatures: CybersecurityFeature[] = ['rate-limiting', 'input-validation', 'cors-headers', 'rbac-rls', 'dependency-audit']
): DeploymentChecklistSection[] {
  const providerMeta = DEPLOYMENT_OPTIONS.find((p) => p.id === provider);
  const providerName = providerMeta?.name || provider;

  const sections: DeploymentChecklistSection[] = [
    {
      title: '1. Pre-Flight Codebase Checks',
      items: [
        { task: 'Run production build locally (`npm run build` or `npm run typecheck`) and verify zero errors' },
        { task: 'Ensure `.gitignore` excludes `.env`, `node_modules`, `.next`, `dist`, and build caches' },
        { task: 'Check that all dynamic imports and asset paths use relative or standard aliases (`@/*`)' },
        { task: 'Verify all images have explicit `alt` text and responsive dimensions' },
      ],
    },
    {
      title: '2. Environment Variables & Secrets Configuration',
      items: [
        { task: 'Create a clean `.env.example` in repo root with placeholder values (never commit real secrets)' },
        { task: `Add all required production environment variables into ${providerName} Project Settings > Environment Variables` },
        { task: 'Verify secrets are scoped properly (Production, Preview, Development)' },
      ],
    },
  ];

  // Provider-specific instructions
  if (provider === 'vercel') {
    sections.push({
      title: '3. Vercel Deployment Instructions',
      items: [
        { task: 'Push your repository to GitHub / GitLab / Bitbucket' },
        { task: 'Import project at [vercel.com/new](https://vercel.com/new) or run `npx vercel` in terminal' },
        { task: 'Configure Framework Preset (Auto-detected: Next.js / Vite)' },
        { task: 'Set Root Directory if working in a monorepo' },
        { task: 'Click "Deploy" and test the live preview URL' },
        { task: 'Configure Custom Domain in Project Settings > Domains (optional)' },
      ],
    });
  } else if (provider === 'render') {
    sections.push({
      title: '3. Render Deployment Instructions',
      items: [
        { task: 'Create a new "Web Service" or "Static Site" on [dashboard.render.com](https://dashboard.render.com)' },
        { task: 'Connect repository and select the target branch' },
        { task: 'Set Build Command (e.g. `npm install && npm run build`) and Start Command (e.g. `npm start`)' },
        { task: 'Add environment variables under "Environment" tab' },
        { task: 'Trigger manual or automated push-to-deploy' },
      ],
    });
  } else if (provider === 'railway') {
    sections.push({
      title: '3. Railway Deployment Instructions',
      items: [
        { task: 'Create new project on [railway.com](https://railway.com) -> "Deploy from GitHub repo"' },
        { task: 'Add Postgres database plugin if needed in Railway dashboard canvas' },
        { task: 'Configure environment variables via Railway Variables tab or CLI (`railway variables`)' },
        { task: 'Generate domain under Service Settings > Networking > Generate Domain' },
      ],
    });
  } else if (provider === 'cloudflare-pages') {
    sections.push({
      title: '3. Cloudflare Pages Deployment Instructions',
      items: [
        { task: 'Go to Cloudflare Dashboard > Workers & Pages > Create application' },
        { task: 'Connect Git repo, choose framework preset (e.g. Next.js / Vite)' },
        { task: 'Set build output directory (e.g. `.next` or `dist`)' },
        { task: 'Add production environment variables in Settings > Environment Variables' },
      ],
    });
  } else if (provider === 'netlify') {
    sections.push({
      title: '3. Netlify Deployment Instructions',
      items: [
        { task: 'Import Git repo on [app.netlify.com](https://app.netlify.com)' },
        { task: 'Configure build command `npm run build` and publish directory `dist` or `.next`' },
        { task: 'Set environment variables under Site configuration > Environment variables' },
        { task: 'Trigger initial deploy' },
      ],
    });
  } else {
    sections.push({
      title: `3. ${providerName} Deployment Instructions`,
      items: [
        { task: 'Ensure build scripts are defined in `package.json`' },
        { task: `Follow setup documentation at: ${providerMeta?.docsUrl || 'provider dashboard'}` },
        { task: 'Configure environment variables before triggering build' },
      ],
    });
  }

  // Database-specific deployment checks
  if (database === 'supabase') {
    sections.push({
      title: '4. Supabase Database & Auth Checks',
      items: [
        { task: 'Run initial SQL migrations in Supabase SQL Editor or via Supabase CLI' },
        { task: 'Verify Row-Level Security (RLS) is ENABLED on all public tables' },
        { task: 'Add production site URL to Supabase Auth > URL Configuration > Redirect URLs' },
      ],
    });
  } else if (database === 'postgresql-prisma' || database === 'postgresql-drizzle') {
    sections.push({
      title: '4. Database Migration Checks',
      items: [
        { task: 'Run production migration command (`npx prisma migrate deploy` or `npx drizzle-kit push`)' },
        { task: 'Verify database connection pooling (e.g., PgBouncer / Neon connection string) for serverless environments' },
      ],
    });
  }

  // Cybersecurity checks
  if (securityFeatures.length > 0) {
    const secItems = securityFeatures.map((secId) => {
      const meta = CYBERSECURITY_OPTIONS.find((s) => s.id === secId);
      return {
        task: `${meta?.name || secId}: ${meta?.testStrategy || 'Verify security enforcement.'}`,
      };
    });

    sections.push({
      title: '5. Cybersecurity Protection & Vulnerability Safeguards (Vibecoder Defense)',
      items: [
        { task: 'Run security audit (`npm audit --audit-level=high`) and fix critical dependency vulnerabilities' },
        ...secItems,
      ],
    });
  }

  return sections;
}

export function generateEnvExample(stack: StackSelection): string {
  const lines: string[] = ['# =========================================', '# Environment Variables Template (.env.example)', '# Generated by GlidingVibe CLI', '# =========================================\n'];

  lines.push('# Application Configuration');
  lines.push('NODE_ENV=production');
  lines.push('PORT=3000');
  lines.push('NEXT_PUBLIC_APP_URL=http://localhost:3000\n');

  // Database variables
  const dbMeta = DATABASE_OPTIONS.find((d) => d.id === stack.database);
  if (dbMeta && dbMeta.defaultEnvVars && dbMeta.defaultEnvVars.length > 0) {
    lines.push(`# Database: ${dbMeta.name}`);
    for (const env of dbMeta.defaultEnvVars) {
      lines.push(`# ${env.description}`);
      lines.push(`${env.key}=${env.example}`);
    }
    lines.push('');
  }

  // Auth / Security Secret
  lines.push('# Security & Auth Secrets (generate with `openssl rand -base64 32`)');
  lines.push('NEXTAUTH_SECRET=your_super_secret_session_key_here');
  lines.push('JWT_SECRET=your_jwt_secret_key_here');

  return lines.join('\n');
}
