import { routeRegistry } from '../../src/server/routes/registry';
import { bindRoutes, RouteNotFoundError } from '../../src/server/router/binder';
import type { RouteDefinition } from '../../src/server/security/types';

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

const bound = bindRoutes(routeRegistry);
assert(bound.routes.length === routeRegistry.length, 'valid registry should bind all routes');

const matchedStatusRoute = bound.matchRoute('GET', '/api/v1/status');
assert(matchedStatusRoute.path === '/api/v1/status', 'binder should resolve registered route');
assert(matchedStatusRoute.method === 'GET', 'binder should preserve route method');
assert(matchedStatusRoute.security.isPublic === false, 'binder should preserve security metadata');
assert(
  matchedStatusRoute.security.requiredScopes?.includes('status:read') ?? false,
  'binder should preserve required scopes'
);

assertThrows(
  () => bound.matchRoute('GET', '/api/v1/unknown'),
  'binder should reject unregistered routes'
);

let capturedError: unknown;
try {
  bound.matchRoute('GET', '/api/v1/not-registered');
} catch (error) {
  capturedError = error;
}

assert(capturedError instanceof RouteNotFoundError, 'unregistered route should throw RouteNotFoundError');
if (capturedError instanceof RouteNotFoundError) {
  assert(capturedError.statusCode === 404, 'not found error should carry 404 status code');
}

const firstRoute = routeRegistry[0];
assert(firstRoute !== undefined, 'route registry must include at least one route for duplicate test');

const duplicateRegistry: readonly RouteDefinition[] =
  firstRoute === undefined
    ? []
    : [
        ...routeRegistry,
        {
          method: firstRoute.method,
          path: firstRoute.path,
          security: firstRoute.security,
          handler: async (_req, _res) => {
            void _req;
            void _res;
          }
        }
      ];

assertThrows(
  () => bindRoutes(duplicateRegistry),
  'binding duplicate method/path combinations should throw'
);
