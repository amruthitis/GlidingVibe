import type { CybersecurityFeature } from '../types/index.js';

export interface CybersecurityOption {
  id: CybersecurityFeature;
  name: string;
  category: 'runtime-protection' | 'auth-access' | 'data-validation' | 'security-testing';
  description: string;
  recommendedTools: string[];
  implementationGuide: string;
  testStrategy: string;
  isRecommended: boolean;
}

export const CYBERSECURITY_OPTIONS: CybersecurityOption[] = [
  {
    id: 'rate-limiting',
    name: 'Rate Limiting & Brute-Force Defense',
    category: 'runtime-protection',
    description: 'Throttle abusive API traffic, prevent denial of service (DoS), and protect auth endpoints from brute-force attacks.',
    recommendedTools: ['Arcjet', 'Upstash Redis', 'express-rate-limit', 'Next.js Middleware'],
    implementationGuide: 'Configure sliding-window or token-bucket rate limiting middleware on key API routes (/api/auth, /api/checkout, /api/ai).',
    testStrategy: 'Run automated rate-limit burst tests (verify HTTP 429 Too Many Requests response after exceeding limit).',
    isRecommended: true,
  },
  {
    id: 'input-validation',
    name: 'Strict Input Validation & XSS/SQLi Sanitization',
    category: 'data-validation',
    description: 'Enforce schema-level runtime validation on all incoming request payloads and sanitize HTML outputs to block XSS and SQL injection.',
    recommendedTools: ['Zod', 'DOMPurify', 'validator.js', 'sanitize-html'],
    implementationGuide: 'Validate all API request params/body with Zod schemas. Escape and sanitize any dynamic HTML rendered on the frontend.',
    testStrategy: 'Unit tests verifying rejection of XSS payload strings (`<script>alert(1)</script>`) and SQL injection patterns (`\' OR 1=1 --`).',
    isRecommended: true,
  },
  {
    id: 'cors-headers',
    name: 'Hardened Security Headers & CORS Policy',
    category: 'runtime-protection',
    description: 'Configure Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), X-Frame-Options, and restricted CORS origins.',
    recommendedTools: ['Helmet.js', 'Next.js Security Headers', 'Cloudflare WAF'],
    implementationGuide: 'Set HTTP response headers: Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Strict-Transport-Security.',
    testStrategy: 'Audit response headers via automated test suite checking presence and syntax of security headers.',
    isRecommended: true,
  },
  {
    id: 'rbac-rls',
    name: 'Role-Based Access Control & Database Row-Level Security (RLS)',
    category: 'auth-access',
    description: 'Lock down database tables so users can only read/write their own records. Prevent Broken Object Level Authorization (BOLA).',
    recommendedTools: ['Supabase RLS', 'Drizzle RLS policies', 'Prisma Middleware / CASL'],
    implementationGuide: 'Enable RLS on Postgres tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) and write explicit `auth.uid() = user_id` policies.',
    testStrategy: 'Integration tests attempting cross-tenant record accesses using user B authentication credentials on user A resources.',
    isRecommended: true,
  },
  {
    id: 'auth-mfa',
    name: 'Secure Session Management & Anti-CSRF',
    category: 'auth-access',
    description: 'Store session tokens in HttpOnly, SameSite cookies with anti-CSRF token verification and multi-factor auth support.',
    recommendedTools: ['Lucia Auth', 'NextAuth / Auth.js', 'Supabase Auth', 'CSRF Protection'],
    implementationGuide: 'Avoid localStorage for JWT storage. Issue HttpOnly, Secure, SameSite=Lax/Strict session cookies with short expirations.',
    testStrategy: 'Verify cookies contain HttpOnly/Secure flags and test backend rejection of invalid or missing CSRF tokens.',
    isRecommended: true,
  },
  {
    id: 'dependency-audit',
    name: 'Automated Dependency & Secret Leak Scanning',
    category: 'security-testing',
    description: 'Catch vulnerable npm packages and prevent leaked API keys, tokens, or private keys from entering git repositories.',
    recommendedTools: ['npm audit', 'Snyk', 'Trufflehog', 'GitGuardian'],
    implementationGuide: 'Include `npm audit --audit-level=high` pre-commit script and CI secret scanning step.',
    testStrategy: 'Run automated dependency scan before production deployments.',
    isRecommended: true,
  },
  {
    id: 'dast-pentest',
    name: 'Automated DAST & API Security Testing',
    category: 'security-testing',
    description: 'Execute dynamic security scans against running API endpoints to detect OWASP Top 10 vulnerabilities automatically.',
    recommendedTools: ['OWASP ZAP', 'Nuclei', 'Vitest Security Suite'],
    implementationGuide: 'Add dynamic security scanner or Vitest security suite execution step into CI/CD build pipelines.',
    testStrategy: 'Automated endpoint pentest suite verifying 401/403/429 status codes on unauthenticated or malformed requests.',
    isRecommended: false,
  },
  {
    id: 'bot-captcha',
    name: 'Bot Defense & CAPTCHA Integration',
    category: 'runtime-protection',
    description: 'Protect public submission forms (signups, contact forms, AI prompt inputs) from automated spam bots and abuse.',
    recommendedTools: ['Cloudflare Turnstile', 'Arcjet Bot Detection', 'reCAPTCHA v3'],
    implementationGuide: 'Embed Turnstile challenge widget on public forms and validate challenge tokens server-side before execution.',
    testStrategy: 'Verify backend API rejects form submissions when Turnstile verification token is missing or forged.',
    isRecommended: false,
  },
];
