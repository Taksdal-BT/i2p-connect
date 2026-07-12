import { CsrfViolationError, verifyCsrfProtection } from '../../src/server/security/csrf';
import type { IncomingRequest } from '../../src/server/security/enforcer';
import type { RouteSecurityPolicy } from '../../src/server/security/types';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, message: string): void {
  try {
    action();
  } catch {
    return;
  }

  throw new Error(message);
}

function buildRequest(
  method: IncomingRequest['method'],
  headers: Record<string, string | undefined>
): IncomingRequest {
  return {
    method,
    headers
  };
}

const protectedPolicy: RouteSecurityPolicy = {
  isPublic: false,
  requiredScopes: ['messages:write'],
  csrfRequired: true,
  rateLimit: {
    windowMs: 60_000,
    maxRequests: 60
  },
  auditEvent: 'MESSAGE_CREATE'
};

const getPolicy: RouteSecurityPolicy = {
  isPublic: false,
  requiredScopes: ['status:read'],
  csrfRequired: false,
  rateLimit: {
    windowMs: 60_000,
    maxRequests: 60
  },
  auditEvent: 'STATUS_READ'
};

verifyCsrfProtection(
  buildRequest('GET', {
    Host: '127.0.0.1:7650'
  }),
  getPolicy
);

assertThrows(
  () =>
    verifyCsrfProtection(
      buildRequest('POST', {
        Host: '127.0.0.1:7650',
        Origin: 'http://127.0.0.1:7650'
      }),
      protectedPolicy
    ),
  'state-changing requests should fail when X-I2P-Connect-CSRF is missing'
);

assertThrows(
  () =>
    verifyCsrfProtection(
      buildRequest('POST', {
        Host: '127.0.0.1:7650',
        Origin: 'https://evil.com',
        'X-I2P-Connect-CSRF': 'present'
      }),
      protectedPolicy
    ),
  'mismatched Origin should fail CSRF checks'
);

let hostViolationError: unknown;
try {
  verifyCsrfProtection(
    buildRequest('POST', {
      Host: 'evil.local:7650',
      Origin: 'http://127.0.0.1:7650',
      'X-I2P-Connect-CSRF': 'present'
    }),
    protectedPolicy
  );
} catch (error) {
  hostViolationError = error;
}

assert(hostViolationError instanceof CsrfViolationError, 'mismatched Host should throw CsrfViolationError');
