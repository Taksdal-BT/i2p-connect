import { ROUTE_REGISTRY } from './routeRegistry';
import { assertRoutePoliciesForStartup } from './routePolicy';

export function runStartupRoutePolicyGuard(): void {
  assertRoutePoliciesForStartup(ROUTE_REGISTRY);
}
