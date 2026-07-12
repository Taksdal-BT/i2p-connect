import { routeRegistry } from '../../src/server/routes/registry';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

assert(routeRegistry.length > 0, 'Route registry should not be empty.');

const seenRoutes = new Set<string>();
const seenAuditEvents = new Set<string>();

for (const route of routeRegistry) {
  const { method, path, security } = route;
  const context = `Route: [${method}] ${path}`;

  assert(/^(GET|POST|PUT|DELETE|PATCH)$/.test(method), `${context} has unsupported method.`);
  assert(/^\//.test(path), `${context} must start with /.`);
  assert(typeof route.handler === 'function', `${context} must define a handler function.`);

  const routeKey = `${method} ${path}`;
  assert(!seenRoutes.has(routeKey), `${context} duplicates route key ${routeKey}.`);
  seenRoutes.add(routeKey);

  assert(security !== undefined, `${context} must define security policy.`);

  if (security.isPublic) {
    assert(
      security.requiredScopes === undefined,
      `${context} is public but declares requiredScopes.`
    );
  } else {
    const requiredScopes = security.requiredScopes;
    assert(requiredScopes !== undefined, `${context} is private but has no requiredScopes.`);
    assert(
      (requiredScopes?.length ?? 0) > 0,
      `${context} is private but requiredScopes is empty.`
    );
  }

  if (method === 'POST' || method === 'PUT' || method === 'DELETE' || method === 'PATCH') {
    assert(security.csrfRequired, `${context} mutates state without CSRF requirement.`);
  }

  assert(security.rateLimit !== undefined, `${context} has no rateLimit policy.`);
  assert(security.rateLimit.windowMs > 0, `${context} has invalid rateLimit.windowMs.`);
  assert(security.rateLimit.maxRequests > 0, `${context} has invalid rateLimit.maxRequests.`);

  assert(security.auditEvent !== undefined, `${context} has no auditEvent.`);
  assert(security.auditEvent.trim().length > 0, `${context} has empty auditEvent.`);
  assert(
    !seenAuditEvents.has(security.auditEvent),
    `${context} reuses auditEvent ${security.auditEvent}.`
  );
  seenAuditEvents.add(security.auditEvent);
}
