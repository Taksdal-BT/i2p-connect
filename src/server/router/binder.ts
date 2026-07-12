import type { RouteDefinition } from '../security/types';

export class RouteNotFoundError extends Error {
  public readonly statusCode: 404;
  public readonly method: string;
  public readonly path: string;

  public constructor(method: string, path: string) {
    super(`Route not found for ${method.toUpperCase()} ${path}`);
    this.name = 'RouteNotFoundError';
    this.statusCode = 404;
    this.method = method.toUpperCase();
    this.path = path;
  }
}

export interface BoundRoute {
  readonly method: RouteDefinition['method'];
  readonly path: string;
  readonly security: RouteDefinition['security'];
  readonly handler: RouteDefinition['handler'];
}

export interface RouteBinder {
  readonly routes: readonly BoundRoute[];
  matchRoute(method: string, path: string): BoundRoute;
}

export function bindRoutes(registry: readonly RouteDefinition[]): RouteBinder {
  const table = new Map<string, BoundRoute>();

  for (const route of registry) {
    const routeKey = toRouteKey(route.method, route.path);

    if (table.has(routeKey)) {
      throw new Error(`Duplicate route definition detected: ${routeKey}`);
    }

    table.set(routeKey, {
      method: route.method,
      path: route.path,
      security: route.security,
      handler: route.handler
    });
  }

  return {
    routes: Array.from(table.values()),
    matchRoute(method: string, path: string): BoundRoute {
      const routeKey = toRouteKey(method, path);
      const found = table.get(routeKey);

      if (!found) {
        throw new RouteNotFoundError(method, path);
      }

      return found;
    }
  };
}

function toRouteKey(method: string, path: string): string {
  return `${method.toUpperCase()} ${path}`;
}
