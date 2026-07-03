import type { I2pAdvancedDiagnostic, I2pStatus } from './types';

export const SAFE_DIAGNOSTIC_MESSAGES: Record<I2pStatus, string> = {
  ready: 'The supplied local status is ready. This package does not probe the router yet.',
  starting: 'The supplied local status is starting. Wait for local services to finish.',
  router_not_found: 'No local router status is available. Check local I2P setup before continuing.',
  proxy_unavailable: 'The local proxy is not available in the supplied status. Check local proxy settings.',
  sam_unavailable: 'SAM is not available in the supplied status. Check local SAM settings.',
  tunnel_unknown: 'Tunnel state is unknown in the supplied status. Review local setup before relying on it.',
  advanced_diagnostics_available: 'More local diagnostics are available. Review them before changing setup.'
};

export const UNKNOWN_STATUS_DIAGNOSTIC =
  'The supplied status is not recognized. Treat the local I2P state as unknown.';

export const ADVANCED_DIAGNOSTICS: Record<I2pStatus | 'unknown', I2pAdvancedDiagnostic[]> = {
  ready: [
    {
      code: 'status.ready.local-only',
      title: 'Local model ready',
      detail: 'The supplied status maps to ready. No router, proxy, SAM, or tunnel probe was performed.',
      safeToShow: true
    }
  ],
  starting: [
    {
      code: 'status.starting.wait',
      title: 'Startup in progress',
      detail: 'The supplied status indicates startup. Wait before depending on I2P readiness.',
      safeToShow: true
    }
  ],
  router_not_found: [
    {
      code: 'status.router.not-found',
      title: 'Router status missing',
      detail: 'No local router status was supplied to the mapper. This is not a network probe result.',
      safeToShow: true
    }
  ],
  proxy_unavailable: [
    {
      code: 'status.proxy.unavailable',
      title: 'Proxy unavailable',
      detail: 'The supplied status says the local proxy is unavailable. No proxy connection was attempted.',
      safeToShow: true
    }
  ],
  sam_unavailable: [
    {
      code: 'status.sam.unavailable',
      title: 'SAM unavailable',
      detail: 'The supplied status says SAM is unavailable. No SAM session was opened.',
      safeToShow: true
    }
  ],
  tunnel_unknown: [
    {
      code: 'status.tunnel.unknown',
      title: 'Tunnel state unknown',
      detail: 'The supplied status does not establish tunnel readiness. Avoid relying on transport behavior yet.',
      safeToShow: true
    }
  ],
  advanced_diagnostics_available: [
    {
      code: 'status.diagnostics.available',
      title: 'Advanced diagnostics available',
      detail: 'More local diagnostics can be reviewed. Sensitive values must be redacted before display.',
      safeToShow: true
    }
  ],
  unknown: [
    {
      code: 'status.unknown.fallback',
      title: 'Unknown status fallback',
      detail: 'The supplied status is not recognized. Treat readiness as unknown.',
      safeToShow: true
    }
  ]
};

const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /private\s+destination/i,
  /private\s+key/i,
  /router\s+credentials?/i,
  /message\s+(body|content)/i,
  /raw\s+(router\s+)?logs?/i,
  /raw\s+traffic\s+logs?/i,
  /sensitive\s+headers?/i,
  /api\s+key/i,
  /service\s+role\s+key/i,
  /invite\s+secret/i,
  /contact\s+graph/i,
  /deanonymizing\s+metadata/i
];

const REDACTION_RULES = [
  {
    pattern: /\b[a-z2-7]{52}\.b32\.i2p\b/gi,
    replacement: '[REDACTED_I2P_DESTINATION]'
  },
  {
    pattern: /\b(private\s+(?:destination|key)\s*[:=]\s*)[^\s,;]+/gi,
    replacement: '$1[REDACTED]'
  },
  {
    pattern: /\b(router\s+credentials?\s*[:=]\s*)[^\s,;]+/gi,
    replacement: '$1[REDACTED]'
  },
  {
    pattern: /\b(api\s*key|service\s+role\s+key|token|secret|password)\s*[:=]\s*[^\s,;]+/gi,
    replacement: '$1=[REDACTED]'
  },
  {
    pattern: /\b[A-Za-z0-9+/]{80,}={0,2}\b/g,
    replacement: '[REDACTED_LONG_VALUE]'
  },
  {
    pattern: /\bsk-[A-Za-z0-9_-]{12,}\b/g,
    replacement: 'sk-[REDACTED]'
  }
];

export function redactDiagnosticText(value: string): string {
  return REDACTION_RULES.reduce(
    (redactedValue, rule) => redactedValue.replace(rule.pattern, rule.replacement),
    value
  );
}

export function isSafeDiagnosticText(value: string): boolean {
  const redactedValue = redactDiagnosticText(value);
  return !FORBIDDEN_DIAGNOSTIC_PATTERNS.some((pattern) => pattern.test(redactedValue));
}

export function assertSafeDiagnosticText(value: string): string {
  const redactedValue = redactDiagnosticText(value);

  if (!isSafeDiagnosticText(redactedValue)) {
    throw new Error('Diagnostic text contains sensitive material.');
  }

  return redactedValue;
}
