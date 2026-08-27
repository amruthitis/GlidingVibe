import type {
  FrontendStack,
  BackendStack,
  DatabaseStack,
  DeploymentProvider,
  VisualDirection,
  CopyTone,
  AnimationPreference,
} from '../types/index.js';

export interface StackOption<T extends string> {
  id: T;
  name: string;
  category: string;
  description: string;
  badge?: string;
  popularWith?: string[];
  docsUrl: string;
  defaultEnvVars?: { key: string; description: string; example: string; secret: boolean }[];
  setupCommands?: string[];
}

export const FRONTEND_OPTIONS: StackOption<FrontendStack>[] = [
  {
    id: 'nextjs',
    name: 'Next.js 15 (App Router + React)',
    category: 'Frontend',
    description: 'Modern full-stack React framework with SSR, Server Components, and built-in optimization',
    badge: 'Most Popular',
    docsUrl: 'https://nextjs.org/docs',
    setupCommands: ['npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"'],
  },
  {
    id: 'vite-react',
    name: 'Vite + React (SPA)',
    category: 'Frontend',
    description: 'Blazing fast client-side React development environment with instant HMR',
    badge: 'Lightweight & Fast',
    docsUrl: 'https://vitejs.dev/guide',
    setupCommands: ['npm create vite@latest my-app -- --template react-ts'],
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    category: 'Frontend',
    description: 'Delightful developer experience, minimal boilerplate, and compiler-driven reactivity',
    badge: 'Elegant',
    docsUrl: 'https://kit.svelte.dev/docs',
    setupCommands: ['npx sv create my-app'],
  },
  {
    id: 'nuxt',
    name: 'Nuxt 3 (Vue.js)',
    category: 'Frontend',
    description: 'Intuitive Vue full-stack framework with auto-imports, SSR, and hybrid rendering',
    badge: 'Vue Ecosystem',
    docsUrl: 'https://nuxt.com/docs',
    setupCommands: ['npx nuxi@latest init my-app'],
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'Frontend',
    description: 'Content-driven island architecture delivering zero client-side JavaScript by default',
    badge: 'Peak Performance',
    docsUrl: 'https://docs.astro.build',
    setupCommands: ['npm create astro@latest my-app'],
  },
  {
    id: 'remix',
    name: 'Remix',
    category: 'Frontend',
    description: 'Web standards-focused React framework with nested routing and optimistic UI',
    badge: 'Full Stack',
    docsUrl: 'https://remix.run/docs',
    setupCommands: ['npx create-remix@latest my-app'],
  },
];

export const BACKEND_OPTIONS: StackOption<BackendStack>[] = [
  {
    id: 'nextjs-api',
    name: 'Next.js Server Actions & Route Handlers',
    category: 'Backend',
    description: 'Unified backend right inside Next.js with type-safe server actions and Edge APIs',
    badge: 'Zero Extra Server',
    docsUrl: 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers',
  },
  {
    id: 'hono',
    name: 'Hono Web Framework (Node/Edge)',
    category: 'Backend',
    description: 'Ultrafast, lightweight web framework compatible with Node.js, Cloudflare, and Bun',
    badge: 'Modern & Tiny',
    docsUrl: 'https://hono.dev',
    setupCommands: ['npm create hono@latest my-api'],
  },
  {
    id: 'nodejs-fastify',
    name: 'Node.js + Fastify',
    category: 'Backend',
    description: 'High-performance Node framework with built-in schema validation and plugin architecture',
    badge: 'High Throughput',
    docsUrl: 'https://fastify.dev/docs/latest',
  },
  {
    id: 'nodejs-express',
    name: 'Node.js + Express',
    category: 'Backend',
    description: 'Battle-tested, flexible Node.js REST server standard with massive ecosystem support',
    badge: 'Classic Standard',
    docsUrl: 'https://expressjs.com',
  },
  {
    id: 'supabase-backend',
    name: 'Supabase BaaS (Auto-APIs & Edge Functions)',
    category: 'Backend',
    description: 'Instant auto-generated REST/GraphQL APIs, Auth, and Deno edge functions backed by Postgres',
    badge: 'No Backend Code',
    docsUrl: 'https://supabase.com/docs/guides/functions',
  },
  {
    id: 'python-fastapi',
    name: 'Python + FastAPI',
    category: 'Backend',
    description: 'Modern, high-speed Python backend with auto-generated OpenAPI docs and type hints',
    badge: 'AI & Data Friendly',
    docsUrl: 'https://fastapi.tiangolo.com',
  },
  {
    id: 'none-frontend-only',
    name: 'None (Pure Client-Side / Static)',
    category: 'Backend',
    description: 'Static frontend communicating with 3rd-party APIs or running 100% in the browser',
    badge: 'Simplest',
    docsUrl: '',
  },
];

export const DATABASE_OPTIONS: StackOption<DatabaseStack>[] = [
  {
    id: 'supabase',
    name: 'Supabase (PostgreSQL + Auth + Storage)',
    category: 'Database',
    description: 'Fully managed Postgres with Row-Level Security, instant realtime sync, and generous free tier',
    badge: 'Top Hackathon Pick',
    docsUrl: 'https://supabase.com/docs',
    defaultEnvVars: [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', description: 'Supabase project URL', example: 'https://xyzcompany.supabase.co', secret: false },
      { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', description: 'Supabase anonymous public key', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', secret: false },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', description: 'Supabase admin service key (server only)', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', secret: true },
    ],
  },
  {
    id: 'postgresql-prisma',
    name: 'PostgreSQL + Prisma ORM',
    category: 'Database',
    description: 'Relational database with intuitive schema definition, type-safe queries, and migrations',
    badge: 'Type Safe',
    docsUrl: 'https://www.prisma.io/docs',
    defaultEnvVars: [
      { key: 'DATABASE_URL', description: 'Postgres connection string', example: 'postgresql://user:password@host:5432/mydb?sslmode=require', secret: true },
    ],
  },
  {
    id: 'postgresql-drizzle',
    name: 'PostgreSQL + Drizzle ORM',
    category: 'Database',
    description: 'Zero-overhead SQL-like TypeScript ORM designed for edge runtimes and serverless cold starts',
    badge: 'Edge Native',
    docsUrl: 'https://orm.drizzle.team',
    defaultEnvVars: [
      { key: 'DATABASE_URL', description: 'Postgres connection string', example: 'postgresql://user:password@host:5432/mydb?sslmode=require', secret: true },
    ],
  },
  {
    id: 'sqlite-turso',
    name: 'Turso (Distributed SQLite + LibSQL)',
    category: 'Database',
    description: 'Ultra-low latency edge database powered by LibSQL with thousands of free databases',
    badge: 'Instant Edge DB',
    docsUrl: 'https://docs.turso.tech',
    defaultEnvVars: [
      { key: 'TURSO_DATABASE_URL', description: 'Turso database connection URL', example: 'libsql://my-db-user.turso.io', secret: true },
      { key: 'TURSO_AUTH_TOKEN', description: 'Turso database authentication token', example: 'eyJhbGciOi...', secret: true },
    ],
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas + Mongoose',
    category: 'Database',
    description: 'Flexible NoSQL document store ideal for rapidly evolving unstructured data schemas',
    badge: 'NoSQL Schema-Free',
    docsUrl: 'https://www.mongodb.com/docs/atlas',
    defaultEnvVars: [
      { key: 'MONGODB_URI', description: 'MongoDB Atlas connection URI', example: 'mongodb+srv://user:pass@cluster.mongodb.net/dbname', secret: true },
    ],
  },
  {
    id: 'redis-upstash',
    name: 'Upstash Redis (Serverless KV & Rate Limiting)',
    category: 'Database',
    description: 'Serverless Redis with REST API support, perfect for caching, session stores, and rate limits',
    badge: 'Caching & State',
    docsUrl: 'https://upstash.com/docs',
    defaultEnvVars: [
      { key: 'UPSTASH_REDIS_REST_URL', description: 'Upstash Redis endpoint URL', example: 'https://example.upstash.io', secret: false },
      { key: 'UPSTASH_REDIS_REST_TOKEN', description: 'Upstash Redis token', example: 'AXxxxxxxxxxxxx', secret: true },
    ],
  },
  {
    id: 'none',
    name: 'None (Local State / In-Memory)',
    category: 'Database',
    description: 'No database required; uses client localStorage, mock data, or stateless API requests',
    badge: 'Zero Config',
    docsUrl: '',
  },
];

export const DEPLOYMENT_OPTIONS: StackOption<DeploymentProvider>[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Deployment',
    description: 'Leading frontend cloud platform with zero-configuration Next.js support, edge caching, and preview URLs',
    badge: 'Recommended for Next.js',
    docsUrl: 'https://vercel.com/docs',
    setupCommands: ['npm i -g vercel', 'vercel'],
  },
  {
    id: 'render',
    name: 'Render',
    category: 'Deployment',
    description: 'Versatile cloud provider for Web Services, background workers, static sites, and managed PostgreSQL',
    badge: 'Full Stack & Containers',
    docsUrl: 'https://render.com/docs',
  },
  {
    id: 'railway',
    name: 'Railway',
    category: 'Deployment',
    description: 'Developer platform providing automated build pipelines, instant PR environments, and multi-service topologies',
    badge: 'Multi-Service Dev',
    docsUrl: 'https://docs.railway.com',
    setupCommands: ['npm i -g @railway/cli', 'railway login', 'railway init'],
  },
  {
    id: 'netlify',
    name: 'Netlify',
    category: 'Deployment',
    description: 'Composable web platform with edge functions, form handling, and instant Git branch previews',
    badge: 'JAMStack',
    docsUrl: 'https://docs.netlify.com',
    setupCommands: ['npm i -g netlify-cli', 'netlify deploy'],
  },
  {
    id: 'flyio',
    name: 'Fly.io',
    category: 'Deployment',
    description: 'Deploy full Docker containers and databases close to users in 30+ physical regions worldwide',
    badge: 'Global Edge Containers',
    docsUrl: 'https://fly.io/docs',
    setupCommands: ['flyctl launch'],
  },
  {
    id: 'cloudflare-pages',
    name: 'Cloudflare Pages & Workers',
    category: 'Deployment',
    description: 'Fast, secure, and generous edge hosting running across Cloudflare’s global 300+ city network',
    badge: 'Ultra Fast Edge',
    docsUrl: 'https://developers.cloudflare.com/pages',
    setupCommands: ['npm create cloudflare@latest'],
  },
  {
    id: 'aws-amplify',
    name: 'AWS Amplify Gen 2',
    category: 'Deployment',
    description: 'Code-first fullstack TypeScript development with AWS backend primitives and hosting',
    badge: 'Enterprise Scalable',
    docsUrl: 'https://docs.amplify.aws',
  },
];

export const VISUAL_VIBE_PRESETS: Record<VisualDirection, {
  name: string;
  description: string;
  palette: { primary: string; secondary: string; background: string; surface: string; text: string; accent: string };
  fontPairing: { heading: string; body: string; mono: string };
  designPrinciples: string[];
}> = {
  'minimal-clean': {
    name: 'Minimal Clean & Monochromatic',
    description: 'High whitespace, stark typography, crisp border lines, and intentional grayscale hierarchy',
    palette: { primary: '#18181b', secondary: '#71717a', background: '#ffffff', surface: '#f4f4f5', text: '#09090b', accent: '#2563eb' },
    fontPairing: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    designPrinciples: ['Abundant breathing room (>40px padding)', '1px hairline borders (border-zinc-200)', 'Subtle card hover elevation', 'Crisp typography hierarchy'],
  },
  'dark-cyberpunk': {
    name: 'Dark Mode Cyberpunk & High Contrast',
    description: 'Deep zinc/slate backdrops, vivid neon accents (cyan/purple/green), glow effects, and futuristic vibes',
    palette: { primary: '#06b6d4', secondary: '#8b5cf6', background: '#09090b', surface: '#18181b', text: '#fafafa', accent: '#10b981' },
    fontPairing: { heading: 'Space Grotesk', body: 'Plus Jakarta Sans', mono: 'Fira Code' },
    designPrinciples: ['Radial background gradient glows', 'Subtle neon border highlights (border-cyan-500/20)', 'Dark glassmorphic surfaces', 'Vibrant interactive state feedback'],
  },
  'playful-vibrant': {
    name: 'Playful Vibrant & Dynamic',
    description: 'Warm energetic colors, soft rounded corners, expressive illustrations, and bouncy micro-interactions',
    palette: { primary: '#f97316', secondary: '#ec4899', background: '#fffbeb', surface: '#ffffff', text: '#1c1917', accent: '#8b5cf6' },
    fontPairing: { heading: 'Outfit', body: 'Plus Jakarta Sans', mono: 'Space Mono' },
    designPrinciples: ['Generous rounded corners (rounded-2xl)', 'Playful icon badges and emoji reactions', 'Warm energetic color accents', 'Bouncy hover scaling (scale-105)'],
  },
  'editorial-elegant': {
    name: 'Editorial Elegant & Luxury',
    description: 'Sophisticated serif titles, muted earthy tones, delicate line work, and luxury magazine layout rhythm',
    palette: { primary: '#292524', secondary: '#78716c', background: '#fafaf9', surface: '#f5f5f4', text: '#1c1917', accent: '#b45309' },
    fontPairing: { heading: 'Playfair Display', body: 'Plus Jakarta Sans', mono: 'Courier Prime' },
    designPrinciples: ['High-contrast serif headings with tight tracking', 'Subtle beige/stone neutral backgrounds', 'Editorial grid layouts with asymmetry', 'Delicate gold/bronze divider accents'],
  },
  'retro-vintage': {
    name: 'Retro Vintage & Neo-Brutalist',
    description: 'Bold black borders, hard drop shadows, punchy pastel palettes, and nostalgic 90s aesthetic',
    palette: { primary: '#ff6b6b', secondary: '#4ecdc4', background: '#fffdf7', surface: '#ffe66d', text: '#1a1a1a', accent: '#a06cd5' },
    fontPairing: { heading: 'Cabinet Grotesk', body: 'Inter', mono: 'Space Mono' },
    designPrinciples: ['Hard shadow offset: 4px 4px 0px #000000', '2px solid black borders on cards and buttons', 'Pastel color blocks', 'No gradient blurs — pure hard edges'],
  },
  'corporate-modern': {
    name: 'Corporate Modern & Trusted SaaS',
    description: 'Polished enterprise feel with trustworthy blues, structured data tables, and refined badge indicators',
    palette: { primary: '#0284c7', secondary: '#475569', background: '#f8fafc', surface: '#ffffff', text: '#0f172a', accent: '#10b981' },
    fontPairing: { heading: 'Inter', body: 'Inter', mono: 'JetBrains Mono' },
    designPrinciples: ['Trust-inspiring slate and royal blue palette', 'Structured metric stat cards', 'Clean table views and filter bars', 'Clear accessible contrast ratios (WCAG AAA)'],
  },
  'brutalist-bold': {
    name: 'Brutalist Bold & Unapologetic',
    description: 'Monochrome high-contrast grids, oversized typography, raw structural honesty, and zero embellishment',
    palette: { primary: '#000000', secondary: '#525252', background: '#ffffff', surface: '#f5f5f5', text: '#000000', accent: '#dc2626' },
    fontPairing: { heading: 'Clash Display', body: 'Inter', mono: 'IBM Plex Mono' },
    designPrinciples: ['Extremely large headline point sizes', 'Exposed grid lines and raw layout containers', 'Red or yellow highlight badges', 'Maximum stark clarity'],
  },
  'glassmorphism-glow': {
    name: 'Glassmorphism & Frosted Glow',
    description: 'Translucent frosted-glass panels, backdrop blur filters, iridescent gradients, and floating layers',
    palette: { primary: '#6366f1', secondary: '#a855f7', background: '#030712', surface: 'rgba(255, 255, 255, 0.05)', text: '#f9fafb', accent: '#38bdf8' },
    fontPairing: { heading: 'Plus Jakarta Sans', body: 'Inter', mono: 'Geist Mono' },
    designPrinciples: ['Backdrop blur (backdrop-blur-md) with subtle translucent borders', 'Multi-layered z-index floating cards', 'Ambient glowing background orbs', 'Silky smooth hover transitions'],
  },
};

export const COPY_TONE_PRESETS: Record<CopyTone, {
  name: string;
  description: string;
  taglineStyle: string;
  guidelines: string[];
  sampleCta: string;
}> = {
  'professional-clear': {
    name: 'Professional & Clear',
    description: 'Direct, value-focused, concise, and trustworthy with zero fluff',
    taglineStyle: 'The modern platform to [Achieve Core Benefit] without [Major Frustration].',
    guidelines: ['Use active voice and direct verbs', 'Focus on quantifiable outcomes', 'Eliminate jargon and marketing clichés', 'State the core benefit within the first 5 words'],
    sampleCta: 'Start Your 14-Day Trial',
  },
  'friendly-casual': {
    name: 'Friendly & Casual',
    description: 'Approachable, warm, conversational, and human-first',
    taglineStyle: 'Meet the easiest way to [Solve Problem]. You’re going to love it.',
    guidelines: ['Write like you speak to a smart peer', 'Use contractions (you’ll, we’ve, it’s)', 'Add subtle warmth and encouraging affirmations', 'Keep sentences under 15 words'],
    sampleCta: 'Get Started for Free',
  },
  'punchy-direct': {
    name: 'Punchy & Direct',
    description: 'High-energy, brief, bold statements with urgent call to actions',
    taglineStyle: 'Build [Thing] 10x Faster. Ship Today.',
    guidelines: ['Ultra-short sentences (3-7 words)', 'Emphasize speed, simplicity, and victory', 'Strong imperative action verbs', 'Every word must earn its pixel'],
    sampleCta: 'Ship Your App Now',
  },
  'technical-precise': {
    name: 'Technical & Precise',
    description: 'Developer-oriented, architectural, accurate, and feature-rich',
    taglineStyle: 'A type-safe, low-latency framework for [Engineering Goal].',
    guidelines: ['Highlight architecture, performance, and developer ergonomics', 'Use accurate technical terminology without over-explaining', 'Provide code snippet previews early', 'Focus on reliability, types, and speed'],
    sampleCta: 'Read the Docs & Clone',
  },
  'playful-witty': {
    name: 'Playful & Witty',
    description: 'Clever, humorous, delightful, and memorable personality',
    taglineStyle: 'Because life is too short to [Struggle with Annoying Problem].',
    guidelines: ['Inject clever observational humor without sacrificing clarity', 'Surprise the user with delightful microcopy on empty states', 'Use relatable metaphors', 'Keep the primary CTA crystal clear'],
    sampleCta: 'Join the Fun — It’s Free',
  },
  'inspiring-visionary': {
    name: 'Inspiring & Visionary',
    description: 'Big picture, ambitious, future-forward, and empowering',
    taglineStyle: 'The future of [Industry] starts right here.',
    guidelines: ['Connect everyday actions to a bigger transformative mission', 'Use evocative and elevating language', 'Frame the user as the hero of the story', 'Inspire confidence and forward momentum'],
    sampleCta: 'Shape the Future',
  },
};

export const ANIMATION_PRESETS: Record<AnimationPreference, {
  name: string;
  description: string;
  recommendedLibraries: string[];
  guidelines: string[];
}> = {
  'subtle-snappy': {
    name: 'Subtle & Snappy (150ms - 250ms)',
    description: 'Instant tactile feedback, fast micro-transitions, zero UI lag feel',
    recommendedLibraries: ['Tailwind CSS transitions', 'Radix UI Primitives', 'Lucide React animated icons'],
    guidelines: ['Transition durations between 150ms and 200ms', 'Cubic-bezier(0.16, 1, 0.3, 1) ease-out', 'Hover scale max 1.02', 'Prioritize immediate responsiveness over elaborate motion'],
  },
  'smooth-organic': {
    name: 'Smooth & Organic (300ms - 500ms)',
    description: 'Fluid spring physics, elegant page transitions, and smooth scroll',
    recommendedLibraries: ['Framer Motion / Motion', 'Lenis Smooth Scroll', 'AutoAnimate'],
    guidelines: ['Spring physics with damping: 25, stiffness: 120', 'Layout animations for expanding cards and accordion elements', 'Staggered child list entry (0.05s stagger)', 'Fade-in-up entrance with translateY(12px)'],
  },
  'high-energy-dynamic': {
    name: 'High Energy & Dynamic (Interactive)',
    description: 'Show-stopping 3D effects, particle backgrounds, bento grid reveals, and hover tilts',
    recommendedLibraries: ['Aceternity UI', 'Magic UI', 'Framer Motion', 'LottieFiles'],
    guidelines: ['Bento grid hover perspective tilts', 'Glowing gradient hover borders following cursor', 'Animated SVG badges and interactive particle canvas', 'Hero headline character-by-character reveal'],
  },
  'minimal-essential': {
    name: 'Minimal & Essential',
    description: 'Strictly functional state indicators, modal fades, and dropdown toggles only',
    recommendedLibraries: ['Tailwind CSS native utilities'],
    guidelines: ['Transitions limited to opacity and background color', 'No layout shifts or scale transforms', 'Respect prefers-reduced-motion unconditionally', 'Max 150ms duration'],
  },
  'none': {
    name: 'None (Static & Instant)',
    description: 'Zero motion, instantaneous rendering, optimized for raw speed and accessibility',
    recommendedLibraries: [],
    guidelines: ['Zero animation CSS classes', 'Instant layout swaps', 'Maximum battery and performance efficiency'],
  },
};
