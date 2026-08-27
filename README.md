# 🚀 GlidingVibe CLI

[![npm version](https://img.shields.io/badge/npm-v1.0.0-cb3837.svg?style=flat-square)](https://www.npmjs.com/package/glidingvibe)
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

> **Turn any product idea into an AI-agent-ready build brief in seconds.**  
> Curated free-resource links • Local AI-agent detection • Stack selection • Deployment checklist.  
> **Zero API keys required. No deployment costs. 100% Hackathon-ready.**

---

## ⚡ Quick Start

You can run `glidingvibe` instantly without installing:

```bash
npx glidingvibe
```

Or install globally:

```bash
npm install -g glidingvibe
glidingvibe
```

---

## 💡 Why GlidingVibe?

When building MVPs or hackathon projects with AI coding agents (Claude Code, Cursor Composer, OpenAI Codex, Gemini CLI, Antigravity, or Aider), prompting from a blank slate often results in:
- Generic styling and mismatched visual vibes
- Disconnected backend or database architectures
- Forgetting essential environment variables and deployment pre-flight checks
- Wasting hours searching for free icons, fonts, placeholder APIs, and component libraries

**GlidingVibe bridges the gap between your product idea and autonomous AI code generation.** It runs an interactive terminal wizard that collects your product vision, matches it with curated free design and engineering resources, detects your local AI coding agents, and generates a structured, production-ready `glidingvibe-brief.md` alongside a tailored agent prompt.

---

## 🌟 Key Features

- 🧙 **Guided Terminal Wizard**: Captures project name, elevator pitch, target users, core features, visual vibe, copy tone, animation speed, technical stack, and deployment target.
- 💎 **Curated Free-Resource Catalogs**:
  - **Visual & Design**: UI inspiration galleries (Godly, Mobbin, Land-book), component libraries (shadcn/ui, Aceternity UI, Magic UI, Radix UI, Mantine), stock media (Unsplash, Pexels, SVGBackgrounds), icon packages (Lucide Icons, Tabler Icons, Phosphor Icons), illustration kits (unDraw, OpenPeeps), and typography (Google Fonts, Fontshare).
  - **Content & Copywriting**: Headline formulas (Copywriting Examples), clarity tools (Hemingway Editor), and realistic mock APIs (DummyJSON, JSONPlaceholder).
  - **Motion & Interactions**: Modern animation engines (Motion / Framer Motion, AutoAnimate, Lenis Smooth Scroll, LottieFiles).
  - **Engineering & Docs**: Framework quickstarts, ORM docs (Prisma, Drizzle), databases (Supabase, Turso), and cloud hosts (Vercel, Render, Railway, Cloudflare Pages).
- 🤖 **Pluggable AI Agent Detection**:
  - Detects installed coding agent CLIs in real-time on your system (`claude`, `cursor`, `codex`, `agy` / `gemini`, `aider`).
  - Auto-tailors system prompts, composer directives, and milestone execution phases specifically for the selected agent.
  - Offers to launch the agent directly or copies the prompt to your clipboard.
- 📦 **Built-In Starter Templates**:
  - `salon-vibe`: *The original problem story* — Aesthetic salon booking, stylist vibe-matching quiz, and portfolio galleries.
  - `saas-starter`: B2B SaaS boilerplate with landing page, auth, dashboard, and billing.
  - `ai-workspace`: Futuristic LLM agent playground with streaming chat, live artifact canvas, and prompt versioning.
  - `marketplace`: Peer-to-peer artisan marketplace with search filters, creator storefronts, and order tracking.
  - `hackathon-speedrun`: Instant full-stack prototype optimized for demo day presentation.
- 🚀 **Deployment & Environment Checklist**:
  - Provider-specific deployment steps for Vercel, Render, Railway, Cloudflare Pages, Netlify, and Fly.io.
  - Generates `.env.example` pre-populated with database connection strings and security token placeholders.

---

## 📖 CLI Usage & Subcommands

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
glidingvibe init --template salon-vibe

# Target a specific AI agent
glidingvibe init --template saas-starter --agent cursor

# Non-interactive quick generation
glidingvibe init --template hackathon-speedrun --yes
```

### 2. Browse Curated Free Resources
Browse the curated directory directly from your terminal:
```bash
# Interactive resource explorer
glidingvibe resources

# Filter by category (visual, content, motion, engineering)
glidingvibe resources --category visual

# Search by keyword or tag
glidingvibe resources --search icons
glidingvibe resources --search tailwind
```

### 3. Detect AI Coding Agents
Scan your machine for installed coding agent CLIs and view their status:
```bash
glidingvibe agents
```

### 4. Inspect Starter Templates
View all built-in templates and their pre-configured stacks:
```bash
glidingvibe templates
```

---

## 🤖 Supported AI Coding Agents

| Agent Adapter | Command | Mode | Tailored Features |
|---|---|---|---|
| **Claude Code** | `claude` | CLI | Multi-file editing directive, step verification, tool usage guidelines |
| **Cursor** | `cursor` | IDE / Composer | `@brief.md` context reference, strict TypeScript guidelines, composer prompt |
| **OpenAI Codex** | `codex` | CLI | Structured task execution checklist with quality standards |
| **Gemini CLI / Antigravity** | `gemini` / `agy` | CLI | `<BUILD_DIRECTIVE>` structure, modular component architecture |
| **Aider** | `aider` | CLI | `/read` brief directive and automated git pairing prompt |
| **Universal / Clipboard** | `clipboard` | Universal | High-octane prompt copied to clipboard for ChatGPT, Claude Web, v0, Bolt, Lovable |

---

## 📁 Generated Brief Structure (`glidingvibe-brief.md`)

```markdown
# 🚀 ProjectName — AI Agent Build Brief
## 📌 1. Product Summary & Problem Statement
## ✨ 2. Core Feature Specifications (MVP vs Stretch)
## 🎨 3. Design, Aesthetic & Copywriting Direction
- Recommended color palette (Hex codes)
- Typography font pairings
- Voice & Tone guidelines + CTA formulas
- Motion curves & transition speeds
## 🛠️ 4. Technical Stack Architecture & Scaffolding
## 💎 5. Curated Free Resources Hub (Matched for Your Stack)
## 🚀 6. Production & Deployment Checklist (.env.example included)
## 🤖 7. Tailored AI Agent Implementation Prompt
```

---

## 💻 Programmatic TypeScript API

You can also use GlidingVibe inside your own Node.js / TypeScript scripts:

```typescript
import {
  generateMarkdownBrief,
  generateAgentPrompt,
  STARTER_TEMPLATES,
  RESOURCE_CATALOG,
  defaultRegistry
} from 'glidingvibe';

// 1. Load a template
const template = STARTER_TEMPLATES.find((t) => t.id === 'salon-vibe')!;

// 2. Generate Markdown Brief
const briefMarkdown = generateMarkdownBrief({
  ...template.brief,
  createdAt: '2026-08-27',
  outputPath: './salon-brief.md',
});

// 3. Generate Agent Prompt
const prompt = generateAgentPrompt(template.brief, 'claude');

// 4. Detect local agents
const agents = await defaultRegistry.detectAll();
console.log('Installed agents:', agents.filter(a => a.result.isInstalled));
```

---

## 🛠️ Development & Testing

```bash
# Install dependencies
npm install

# Run TypeScript build
npm run build

# Run unit and integration tests
npm test

# Typecheck
npm run typecheck
```

---

## ⚖️ License & Terms

- **GlidingVibe CLI** is open-source software licensed under the [MIT License](LICENSE).
- **External Resources**: All curated external tools, component libraries, typography, mock APIs, and hosting providers referenced in the catalog remain subject to the respective provider's terms of service and license agreements.
