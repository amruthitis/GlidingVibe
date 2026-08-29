import { describe, it, expect } from 'vitest';
import { BaseAgentAdapter } from '../src/adapters/base.js';
import { GeminiAgentAdapter } from '../src/adapters/gemini.js';
import { ClaudeCodeAdapter } from '../src/adapters/claude.js';
import { sanitizeFontName, getGoogleFontCssUrl, downloadFontFiles } from '../src/utils/fonts.js';
import { isValidUrl } from '../src/data/resources.js';
import type { ProjectBrief } from '../src/types/index.js';

class MockSecurityAdapter extends BaseAgentAdapter {
  id = 'generic' as const;
  name = 'Test Security Adapter';
  commandName = 'test-cmd';
  description = 'Test adapter for security testing';
  installGuideUrl = '';

  formatPrompt(brief: ProjectBrief): string {
    return brief.projectName;
  }

  getLaunchCommand() {
    return {
      command: 'test-cmd',
      args: [],
      explanation: 'test',
    };
  }

  public async testCheckCommandExists(cmd: string) {
    return this.checkCommandExists(cmd);
  }

  public async testGetCommandVersion(cmd: string, flag?: string) {
    return this.getCommandVersion(cmd, flag);
  }
}

describe('Cybersecurity Analysis & Defense Verification', () => {
  const dummyBrief: ProjectBrief = {
    projectName: 'SecurityTestApp',
    tagline: 'Cybersecurity Test',
    targetAudience: 'Testers',
    problemStatement: 'None',
    coreFeatures: ['Feature 1'],
    visualDirection: 'minimal-clean',
    copyTone: 'professional-clear',
    animationPreference: 'subtle-snappy',
    stack: {
      frontend: 'nextjs',
      backend: 'nextjs-api',
      database: 'supabase',
      deployment: 'vercel',
    },
    createdAt: '2026-08-28',
  };

  describe('1. Command Injection Defenses in Agent Adapters', () => {
    const adapter = new MockSecurityAdapter();

    it('rejects command execution containing shell metacharacters in checkCommandExists', async () => {
      const maliciousCmds = [
        'gemini; rm -rf /',
        'claude && calc',
        'codex | cat /etc/passwd',
        '$(whoami)',
        '`id`',
      ];

      for (const cmd of maliciousCmds) {
        const result = await adapter.testCheckCommandExists(cmd);
        expect(result.exists).toBe(false);
      }
    });

    it('rejects version command flags containing shell metacharacters', async () => {
      const maliciousFlag = '--version; echo HACKED';
      const version = await adapter.testGetCommandVersion('node', maliciousFlag);
      if (version) {
        expect(version).not.toContain('HACKED');
      }
    });

    it('prevents command injection during agent launch invocation', async () => {
      const claude = new ClaudeCodeAdapter();

      const launchRes = await claude.launch({
        briefPath: './test.md',
        prompt: 'test',
        brief: dummyBrief,
      });
      expect(launchRes.success).toBe(true);

      const maliciousAdapter = new MockSecurityAdapter();
      maliciousAdapter.commandName = 'evil; rm -rf /';
      maliciousAdapter.getLaunchCommand = () => ({
        command: 'evil; rm -rf /',
        args: [],
        explanation: 'malicious command',
      });

      await expect(
        maliciousAdapter.launch({
          briefPath: './test.md',
          prompt: 'test',
          brief: dummyBrief,
        })
      ).rejects.toThrow(/Security Exception/);
    });
  });

  describe('2. URL Parameter Injection & SSRF Defenses', () => {
    it('sanitizes font names removing parameter injection characters', () => {
      const maliciousFont = 'Inter&display=swap#evil';
      const cleanFont = sanitizeFontName(maliciousFont);
      expect(cleanFont).toBe('Interdisplayswapevil');
      expect(cleanFont).not.toContain('&');
      expect(cleanFont).not.toContain('#');
    });

    it('properly encodes parameters in Google Font CSS URLs', () => {
      const fontUrl = getGoogleFontCssUrl('Space Grotesk');
      expect(fontUrl).toContain('Space+Grotesk');
      expect(fontUrl.startsWith('https://fonts.googleapis.com/css2')).toBe(true);
    });
  });

  describe('3. Path Traversal Defenses', () => {
    it('blocks directory traversal attempts in downloadFontFiles', async () => {
      const traversalDir = '../../../../tmp/evil-fonts';
      const res = await downloadFontFiles('Inter', traversalDir);
      expect(res.success).toBe(false);
      expect(res.error).toContain('Security Violation');
    });
  });

  describe('4. Protocol Validation & URI Scheme Safety', () => {
    it('validates http and https protocols as safe', () => {
      expect(isValidUrl('https://v0.dev')).toBe(true);
      expect(isValidUrl('http://ui.shadcn.com')).toBe(true);
    });

    it('rejects unsafe URI protocols like javascript, file, and data', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      expect(isValidUrl('file:///etc/passwd')).toBe(false);
      expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(isValidUrl('vbscript:msgbox(1)')).toBe(false);
    });
  });

  describe('5. Cybersecurity Feature Selection & Brief Integration', () => {
    it('contains comprehensive cybersecurity protection options', async () => {
      const { CYBERSECURITY_OPTIONS } = await import('../src/data/security.js');
      expect(CYBERSECURITY_OPTIONS.length).toBeGreaterThanOrEqual(6);

      const rateLimiting = CYBERSECURITY_OPTIONS.find((s) => s.id === 'rate-limiting');
      expect(rateLimiting).toBeDefined();
      expect(rateLimiting?.name).toContain('Rate Limiting');
      expect(rateLimiting?.recommendedTools).toContain('Arcjet');

      const inputValidation = CYBERSECURITY_OPTIONS.find((s) => s.id === 'input-validation');
      expect(inputValidation).toBeDefined();
      expect(inputValidation?.recommendedTools).toContain('Zod');
    });

    it('embeds selected cybersecurity features in Markdown brief and checklist', async () => {
      const { generateMarkdownBrief } = await import('../src/generator/markdown.js');
      const { generateDeploymentChecklist } = await import('../src/generator/checklist.js');
      const { generateAgentPrompt } = await import('../src/generator/prompt.js');

      const secBrief: ProjectBrief = {
        ...dummyBrief,
        securityFeatures: ['rate-limiting', 'input-validation', 'cors-headers', 'rbac-rls'],
      };

      const markdown = generateMarkdownBrief(secBrief);
      expect(markdown).toContain('Cybersecurity Protection & Testing Suite');
      expect(markdown).toContain('Rate Limiting & Brute-Force Defense');
      expect(markdown).toContain('Strict Input Validation');

      const checklist = generateDeploymentChecklist(secBrief.stack.deployment, secBrief.stack.database, secBrief.securityFeatures);
      const secSection = checklist.find((s) => s.title.includes('Cybersecurity'));
      expect(secSection).toBeDefined();
      expect(secSection?.items.length).toBeGreaterThan(1);

      const prompt = generateAgentPrompt(secBrief);
      expect(prompt).toContain('Cybersecurity & Application Defense Directives');
      expect(prompt).toContain('rate-limiting');
      expect(prompt).toContain('input-validation');
    });
  });
});
