import type { RouteSecurityPolicy } from './types';
import { verifyCsrfProtection } from './csrf';

export interface IncomingRequest {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly headers: Readonly<Record<string, string | undefined>>;
}

export interface SecurityEnforcerOptions {
  readonly port?: number;
}

export class SecurityEnforcementError extends Error {
  public readonly statusCode: 403 | 401;

  public constructor(message: string, statusCode: 403 | 401) {
    super(message);
    this.name = 'SecurityEnforcementError';
    this.statusCode = statusCode;
  }
}

export function enforceRequestSecurity(
  req: IncomingRequest,
  policy: RouteSecurityPolicy,
  options: SecurityEnforcerOptions = {}
): void {
  const port = options.port ?? 7650;

  verifyLoopbackRequest(req, port);
  verifyCsrfProtection(req, policy, { port });
  verifyBearerToken(req, policy);
}

function verifyLoopbackRequest(req: IncomingRequest, port: number): void {
  const host = readHeader(req, 'host');
  if (!host) {
    throw new SecurityEnforcementError('Missing Host header.', 403);
  }

  if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
    throw new SecurityEnforcementError('Request host is not loopback-local.', 403);
  }
}

function verifyBearerToken(req: IncomingRequest, policy: RouteSecurityPolicy): void {
  if (policy.isPublic) {
    return;
  }

  const authorization = readHeader(req, 'authorization');
  if (!authorization || !authorization.startsWith('Bearer ') || authorization.length <= 'Bearer '.length) {
    throw new SecurityEnforcementError('Missing or malformed bearer token.', 401);
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
