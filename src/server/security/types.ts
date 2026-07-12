export type AuthScope =
  | 'status:read'
  | 'identity:read'
  | 'identity:manage'
  | 'contacts:read'
  | 'contacts:manage'
  | 'messages:read'
  | 'messages:write'
  | 'messages:delete'
  | 'data:export'
  | 'settings:manage'
  | 'admin:security';

export interface RateLimitConfig {
  readonly windowMs: number;
  readonly maxRequests: number;
}

export interface RouteSecurityPolicy {
  readonly isPublic: boolean;
  readonly requiredScopes?: readonly AuthScope[];
  readonly csrfRequired: boolean;
  readonly rateLimit: RateLimitConfig;
  readonly auditEvent: string;
}

export interface RouteDefinition {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  readonly path: string;
  readonly security: RouteSecurityPolicy;
  readonly handler: (req: unknown, res: unknown) => Promise<void>;
}
