# GlidingVibe CLI

[![npm version](https://img.shields.io/badge/npm-v1.0.2-cb3837.svg?style=flat-square)](https://www.npmjs.com/package/glidingvibe)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933.svg?style=flat-square)](https://nodejs.org/)

```
  ____ _ _     _ _             __     ___ _          
 / ___| (_) __| (_)_ __   __ _ \ \   / (_) |__   ___ 
| |  _| | |/ _` | | '_ \ / _` | \ \ / /| | '_ \ / _ \
| |_| | | | (_| | | | | | (_| |  \ V / | | |_) |  __/
 \____|_|_|\__,_|_|_| |_|\__, |   \_/  |_|_.__/ \___|
                         |___/                       
```

Turn a product idea into a clear build brief for the coding agent you already use. GlidingVibe asks about the product, audience, stack, security, authentication, and design direction, then produces a practical implementation prompt and project handoff.

It is for founders, product teams, and people building their first software product, not only hackathon projects. No API key is required to generate a brief.

---

## Quick Start

Run `glidingvibe` instantly without installing:

```bash
npx glidingvibe
```

Or install globally:

```bash
npm install -g glidingvibe
glidingvibe
```

---

## Why GlidingVibe?

When building an MVP with an AI coding agent, a blank prompt often leaves important product decisions unspecified:
- **Ignoring Cybersecurity**: Fast AI coding frequently omits rate-limiting, input schema validation, security headers, anti-CSRF cookies, and database Row-Level Security (RLS) policies, leaving websites exposed to OWASP Top 10 exploits.
- **Generic Styling**: Mismatched color schemes, missing typography, and default unstyled components.
- **Disconnected Architectures**: Incompatible ORM or backend setups that break at deploy time.
- **Missing Deployment Pre-flight**: Forgetting `.env` secrets, missing build scripts, and unhandled production errors.

GlidingVibe collects those choices in an interactive terminal wizard. You can enter an idea across multiple lines, return to earlier answers before generation, save component-specific prompts, choose an authentication approach, and copy the final instruction set into a supported coding agent.

---

## What it produces

- An editable Markdown brief with product requirements, component prompts, stack choices, security requirements, and direct resource links.
- A tailored prompt for Claude Code, Cursor, Codex, Gemini CLI, Aider, or a general-purpose assistant.
- A delivery checklist covering CI, releases, operations, backups, observability, and the point at which containers or Kubernetes make sense.
- A product-quality baseline: accessible interaction states, responsive navigation, loading and empty states, theme preference, authentication rules, metadata, and no fabricated “live” product state.

## Key Features

- **Cybersecurity protection and testing selection**:
  - Select and integrate cybersecurity features into your build brief: Rate Limiting (Arcjet/Redis), Strict Input Validation (Zod), Security Headers & CORS (CSP/HSTS), Database Row-Level Security (Supabase RLS), Anti-CSRF/HttpOnly Sessions, Dependency/Secret Auditing (`npm audit`), DAST vulnerability test scripts, and CAPTCHA Bot Defense (Turnstile).
  - Automatically embeds hard security requirements and automated test strategies into the AI agent prompt so the agent writes secure code by default.
- **Typography and local font support (`glidingvibe fonts`)**:
  - Browse popular Google and Figma fonts by category (Sans-serif, Display, Serif, Monospace).
  - Download `.woff2` font files directly into `./public/fonts` for offline and fast local hosting.
  - Automatically generates Tailwind CSS font configuration snippets and CSS `@import` fallbacks.
  - Built-in parameter sanitization and path traversal defenses.
- **Generative UI and design references**:
  - Integrate v0.dev prompts, 21st.dev component links, shadcn/ui blocks, screenshot mockup paths, and custom markdown design specs directly into your brief.
- **Guided interactive terminal wizard**:
  - Captures the project idea over one or more lines, target users, features, component prompts, visual direction, stack, authentication method, security choices, and deployment provider. Before generation, users can revise earlier answers.
- **Curated resource catalog**:
  - **Visual & Design**: UI galleries (Godly, Mobbin), component kits (shadcn/ui, Aceternity UI, Magic UI, Radix UI), stock media (Unsplash, SVGBackgrounds), icon sets (Lucide Icons, Tabler Icons), and fonts (Google Fonts, Fontshare).
  - **Content & Copywriting**: Headline formulas, clarity checkers (Hemingway Editor), and mock APIs (DummyJSON, JSONPlaceholder).
  - **Motion & Interactions**: Framer Motion / Motion, AutoAnimate, Lenis Smooth Scroll, LottieFiles.
  - **Engineering & Cloud**: Framework docs, ORMs (Prisma, Drizzle), databases (Supabase, Turso), and cloud hosts (Vercel, Render, Railway, Cloudflare Pages).
- **Coding agent detection and execution**:
  - Scans system for installed agent CLIs (`claude`, `cursor`, `codex`, `agy` / `gemini`, `aider`).
  - Auto-tailors system prompts, composer directives, and milestone execution phases specifically for the selected agent.
  - Launches the agent directly from the terminal or copies the prompt to your clipboard.
- **Built-in starter templates**:
  - `saas-starter`: B2B SaaS boilerplate with landing page, auth, dashboard, billing, and full security suite.
  - `ai-workspace`: Futuristic LLM agent playground with streaming chat, live artifact canvas, and prompt versioning.
  - `marketplace`: Peer-to-peer artisan marketplace with search filters, creator storefronts, and order tracking.
  - `hackathon-speedrun`: Instant full-stack prototype optimized for demo day presentation.
- **Production and deployment checklist**:
  - Provider-specific deployment steps for Vercel, Render, Railway, Cloudflare Pages, Netlify, and Fly.io.
  - Generates `.env.example` pre-populated with database connection strings and security token placeholders.
  - Includes CI/CD, rollback, backup, observability, container, and Kubernetes guidance proportional to the project.

---

## Cybersecurity Safeguards Catalog

Vibecoding fast should not mean shipping vulnerable code. GlidingVibe allows you to bake these cybersecurity modules directly into your project prompt and brief:

| Cybersecurity Module | Category | Description | Recommended Tools | Verification / Test Strategy |
|---|---|---|---|---|
| **Rate Limiting & Brute-Force** | `runtime-protection` | Throttle abusive traffic, DoS attacks, and auth brute-forcing | Arcjet, Upstash Redis, express-rate-limit | Burst test verifying HTTP 429 status code |
| **Strict Input Validation** | `data-validation` | Schema runtime validation & HTML sanitization to block XSS and SQLi | Zod, DOMPurify, validator.js | Unit tests verifying XSS `<script>` & SQLi pattern rejection |
| **Security Headers & CORS** | `runtime-protection` | CSP, HSTS, X-Frame-Options: DENY, and restricted CORS origins | Helmet.js, Next.js Headers, Cloudflare | Response header audit checking CSP directives |
| **Database Row-Level Security** | `auth-access` | Enforce RLS policies so users only access their own data records | Supabase RLS, Drizzle Policies, CASL | Integration tests attempting cross-tenant data access |
| **Secure Session & CSRF** | `auth-access` | Store tokens in HttpOnly, SameSite cookies with anti-CSRF tokens | Lucia Auth, NextAuth, Supabase Auth | Cookie flag verification and CSRF token mismatch tests |
| **Dependency & Secret Audit** | `security-testing` | Catch vulnerable npm packages and prevent leaked API key commits | npm audit, Snyk, Trufflehog | Automated `npm audit --audit-level=high` pre-commit script |
| **Automated DAST Pentest** | `security-testing` | Run dynamic security scans against running API endpoints | OWASP ZAP, Nuclei, Vitest Security | Automated test suite verifying 401/403/429 status codes |
| **Bot & CAPTCHA Defense** | `runtime-protection` | Protect signup and contact forms from automated spam bots | Cloudflare Turnstile, Arcjet Bot | Server-side validation check of Turnstile challenge token |

---

## CLI Usage & Subcommands

### 1. Interactive Build Brief Wizard
```bash
glidingvibe
# or
glidingvibe init
```

#### CLI Options
```bash
# Save brief to custom path
glidingvibe init --output ./specs/my-brief.md

# Start from a template
glidingvibe init --template saas-starter

# Target a specific AI agent
glidingvibe init --template saas-starter --agent cursor

# Select specific cybersecurity features
glidingvibe init --template saas-starter --security rate-limiting input-validation rbac-rls cors-headers

# Non-interactive quick generation
glidingvibe init --template hackathon-speedrun --yes
```

### 2. Download & Manage Typography Fonts
Browse and download Google/Figma font files locally for your app:
```bash
# List available fonts by category
glidingvibe fonts list

# Download font files (.woff2) into ./public/fonts
glidingvibe fonts download "Space Grotesk"

# Specify custom output directory
glidingvibe fonts download "Inter" --output ./src/assets/fonts
```

### 3. Browse Curated Free Resources
Browse the curated directory directly from your terminal:
```bash
# Interactive resource explorer
glidingvibe resources

# Filter by category (visual, content, motion, engineering)
glidingvibe resources --category visual

# Search by keyword or tag
glidingvibe resources --search icons
glidingvibe resources --search tailwind

# Display clickable web links directly in terminal
glidingvibe resources --ui
```

### 4. Detect AI Coding Agents
Scan your machine for installed coding agent CLIs and view their status:
```bash
glidingvibe agents
```

### 5. Inspect Starter Templates
View all built-in templates and their pre-configured stacks:
```bash
glidingvibe templates
```

---

## Supported AI Coding Agents

| Agent Adapter | Command | Mode | Tailored Features |
|---|---|---|---|
| **Claude Code** | `claude` | CLI | Multi-file editing directive, step verification, tool usage guidelines |
| **Cursor** | `cursor` | IDE / Composer | `@brief.md` context reference, strict TypeScript guidelines, composer prompt |
| **OpenAI Codex** | `codex` | CLI | Structured task execution checklist with quality standards |
| **Gemini CLI / Antigravity** | `gemini` / `agy` | CLI | `<BUILD_DIRECTIVE>` structure, modular component architecture |
| **Aider** | `aider` | CLI | `/read` brief directive and automated git pairing prompt |
| **Universal / Clipboard** | `clipboard` | Universal | High-octane prompt copied to clipboard for ChatGPT, Claude Web, v0, Bolt, Lovable |

---

## Generated Brief Structure (`glidingvibe-brief.md`)

```markdown
# ProjectName — AI Agent Build Brief
## 1. Product Summary & Problem Statement
## 2. Core Feature Specifications (MVP vs Stretch)
## 3. Design, Aesthetic & Typography Personalization
- Recommended color palette (Hex codes)
- Typography font pairings & CSS import snippets
- Tailwind CSS font configuration
- Personal design inputs (v0, 21st.dev, screenshot mockups)
- Voice & Tone guidelines + CTA formulas
- Motion curves & transition speeds
## 4. Technical Stack Architecture & Scaffolding
## 5. Curated Free Resources Hub (Matched for Your Stack)
## 6. Cybersecurity Protection & Testing Suite
- Rate limiting, Zod validation, CSP headers, RLS policies, npm audit
- Implementation directives & automated test strategies
## 7. Production & Deployment Checklist (.env.example included)
## 8. Tailored AI Agent Implementation Prompt
```

---

## Programmatic TypeScript API

You can also use GlidingVibe inside your Node.js / TypeScript scripts:

```typescript
import {
  generateMarkdownBrief,
  generateAgentPrompt,
  generateDeploymentChecklist,
  downloadFontFiles,
  STARTER_TEMPLATES,
  CYBERSECURITY_OPTIONS,
  defaultRegistry
} from 'glidingvibe';

// 1. Load a template
const template = STARTER_TEMPLATES.find((t) => t.id === 'saas-starter')!;

// 2. Customize with cybersecurity features & fonts
const briefMarkdown = generateMarkdownBrief({
  ...template.brief,
  primaryFont: 'Space Grotesk',
  secondaryFont: 'Plus Jakarta Sans',
  securityFeatures: ['rate-limiting', 'input-validation', 'cors-headers', 'rbac-rls'],
  createdAt: '2026-08-28',
  outputPath: './saas-brief.md',
});

// 3. Generate Agent Prompt with Security Directives
const prompt = generateAgentPrompt(template.brief, 'claude');

// 4. Download local font files
await downloadFontFiles('Space Grotesk', './public/fonts');

// 5. Detect local agents
const agents = await defaultRegistry.detectAll();
console.log('Installed agents:', agents.filter(a => a.result.isInstalled));
```

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run TypeScript build
npm run build

# Run unit, integration, and security test suites
npm test

# Typecheck codebase
npm run typecheck
```

---

## License & Terms

- **GlidingVibe CLI** is open-source software licensed under the [MIT License](LICENSE).
- **External Resources**: All curated external tools, component libraries, typography, mock APIs, and hosting providers referenced in the catalog remain subject to the respective provider's terms of service and license agreements.
