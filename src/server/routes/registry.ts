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
  },
  {
    method: 'GET',
    path: '/api/v1/onboarding/state',
    security: {
      isPublic: true,
      csrfRequired: false,
      rateLimit: {
        windowMs: 60_000,
        maxRequests: 60
      },
      auditEvent: 'ONBOARDING_STATE_VIEW'
    },
    handler: async (_req, _res) => {
      void _req;
      void _res;
    }
  },
  {
    method: 'POST',
    path: '/api/v1/onboarding/step',
    security: {
      isPublic: false,
      requiredScopes: ['identity:manage'],
      csrfRequired: true,
      rateLimit: {
        windowMs: 60_000,
        maxRequests: 30
      },
      auditEvent: 'ONBOARDING_STEP_UPDATE'
    },
    handler: async (_req, _res) => {
      void _req;
      void _res;
    }
  },
  {
    method: 'POST',
    path: '/api/v1/onboarding/complete',
    security: {
      isPublic: false,
      requiredScopes: ['identity:manage'],
      csrfRequired: true,
      rateLimit: {
        windowMs: 60_000,
        maxRequests: 20
      },
      auditEvent: 'ONBOARDING_COMPLETE'
    },
    handler: async (_req, _res) => {
      void _req;
      void _res;
    }
  }
];
