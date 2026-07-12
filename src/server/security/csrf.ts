import type { IncomingRequest } from './enforcer';
import type { RouteSecurityPolicy } from './types';

export interface CsrfProtectionOptions {
  readonly port?: number;
}

export class CsrfViolationError extends Error {
  public readonly statusCode: 403;

  public constructor(message: string) {
    super(message);
    this.name = 'CsrfViolationError';
    this.statusCode = 403;
  }
}

export function verifyCsrfProtection(
  req: IncomingRequest,
  policy: RouteSecurityPolicy,
  options: CsrfProtectionOptions = {}
): void {
  if (req.method === 'GET' && !policy.csrfRequired) {
    return;
  }

  if (!policy.csrfRequired) {
    return;
  }

  const port = options.port ?? 7650;
  const csrfHeader = readHeader(req, 'X-I2P-Connect-CSRF');
  if (!csrfHeader) {
    throw new CsrfViolationError('Missing X-I2P-Connect-CSRF header.');
  }

  const origin = readHeader(req, 'Origin');
  if (origin) {
    const allowedOrigins = new Set([`http://127.0.0.1:${port}`, `http://localhost:${port}`]);
    if (!allowedOrigins.has(origin)) {
      throw new CsrfViolationError('Origin header is not allowed for CSRF-protected route.');
    }
  }

  const host = readHeader(req, 'Host');
  if (!host) {
    throw new CsrfViolationError('Missing Host header for CSRF-protected route.');
  }

  if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
    throw new CsrfViolationError('Host header is not allowed for CSRF-protected route.');
  }
}

function readHeader(req: IncomingRequest, headerName: string): string | undefined {
  const expected = headerName.toLowerCase();
  const entries = Object.entries(req.headers);

  for (const [name, value] of entries) {
    if (name.toLowerCase() === expected) {
      return value;
    }
  }

  return undefined;
}
