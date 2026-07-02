import type { I2pStatus } from './types';

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

const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /private\s+destination/i,
  /private\s+key/i,
  /router\s+credential/i,
  /message\s+content/i,
  /raw\s+traffic\s+log/i,
  /api\s+key/i,
  /service\s+role\s+key/i
];

export function isSafeDiagnosticText(value: string): boolean {
  return !FORBIDDEN_DIAGNOSTIC_PATTERNS.some((pattern) => pattern.test(value));
}

export function assertSafeDiagnosticText(value: string): string {
  if (!isSafeDiagnosticText(value)) {
    throw new Error('Diagnostic text contains sensitive material.');
  }

  return value;
}
