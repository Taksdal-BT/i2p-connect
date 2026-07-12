import type { RouteDefinition } from './routePolicy';
import { getCoreLocalRouteDefinitions } from '../server/routeDefinitions';

export const ROUTE_REGISTRY: readonly RouteDefinition[] = getCoreLocalRouteDefinitions();

