import type { RouteDefinition } from '../security/types';

export const routeRegistry: readonly RouteDefinition[] = [
  {
    method: 'GET',
    path: '/api/v1/status',
    security: {
      isPublic: false,
      requiredScopes: ['status:read'],
      csrfRequired: false,
      rateLimit: {
        windowMs: 60_000,
        maxRequests: 60
      },
      auditEvent: 'STATUS_VIEW'
    },
    handler: async (_req, _res) => {
      void _req;
      void _res;
    }
  }
];
