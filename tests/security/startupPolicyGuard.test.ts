import { ROUTE_REGISTRY } from '../../src/security/routeRegistry';
import { buildRouteSecurityMatrix } from '../../src/security/routeSecurityMatrix';
import { runStartupRoutePolicyGuard } from '../../src/security/startupPolicyGuard';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

runStartupRoutePolicyGuard();

const matrix = buildRouteSecurityMatrix(ROUTE_REGISTRY);
assert(matrix.length === ROUTE_REGISTRY.length, 'route registry and matrix should have the same number of rows');
assert(matrix.length > 0, 'route registry should not be empty');
assert(
  matrix.some((row) => row.id === 'messages.create' && row.csrf === 'required'),
  'messages.create should require CSRF in the registry'
);
