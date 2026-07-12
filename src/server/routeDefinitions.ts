import type { RouteDefinition } from '../security/routePolicy';

const CORE_LOCAL_ROUTES: readonly RouteDefinition[] = [
  {
    id: 'status.read',
    transport: 'http',
    method: 'GET',
    path: '/api/status',
    purpose: 'Return sanitized local status summary.',
    browserAccessible: true,
    stateChanging: false,
    sensitive: false,
    accessLevel: 'public',
    implemented: false,
    policy: {
      authentication: { decision: 'not_required' },
      csrf: { decision: 'not_required' },
      authorization: { decision: 'not_required' },
      inputValidation: { decision: 'required' },
      rateLimit: { decision: 'required' },
      audit: { decision: 'required' }
    }
  },
  {
    id: 'identity.read',
    transport: 'http',
    method: 'GET',
    path: '/api/identity',
    purpose: 'Return local identity metadata safe view.',
    browserAccessible: true,
    stateChanging: false,
    sensitive: true,
    accessLevel: 'authenticated',
    implemented: false,
    policy: {
      authentication: { decision: 'required' },
      csrf: { decision: 'not_required' },
      authorization: { decision: 'required', requiredScopes: ['identity:read'] },
      inputValidation: { decision: 'required' },
      rateLimit: { decision: 'required' },
      audit: { decision: 'required' }
    }
  },
  {
    id: 'messages.create',
    transport: 'http',
    method: 'POST',
    path: '/api/messages',
    purpose: 'Create a local queued private message record.',
    browserAccessible: true,
    stateChanging: true,
    sensitive: true,
    accessLevel: 'privileged',
    implemented: false,
    policy: {
      authentication: { decision: 'required' },
      csrf: { decision: 'required' },
      authorization: { decision: 'required', requiredScopes: ['messages:write'] },
      inputValidation: { decision: 'required' },
      rateLimit: { decision: 'required' },
      audit: { decision: 'required' }
    }
  },
  {
    id: 'contacts.updateAlias',
    transport: 'http',
    method: 'PATCH',
    path: '/api/contacts/:contactId/alias',
    purpose: 'Update local contact alias metadata.',
    browserAccessible: true,
    stateChanging: true,
    sensitive: true,
    accessLevel: 'privileged',
    implemented: false,
    policy: {
      authentication: { decision: 'required' },
      csrf: { decision: 'required' },
      authorization: { decision: 'required', requiredScopes: ['contacts:manage'] },
      inputValidation: { decision: 'required' },
      rateLimit: { decision: 'required' },
      audit: { decision: 'required' }
    }
  }
];

export function getCoreLocalRouteDefinitions(): readonly RouteDefinition[] {
  return CORE_LOCAL_ROUTES;
}
