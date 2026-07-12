import type { PolicyDecision, RouteDefinition } from './routePolicy';

export interface RouteSecurityMatrixRow {
  id: string;
  implemented: boolean;
  transport: RouteDefinition['transport'];
  method: RouteDefinition['method'];
  path: string;
  purpose: string;
  accessLevel: RouteDefinition['accessLevel'];
  authentication: PolicyDecision;
  csrf: PolicyDecision;
  authorization: PolicyDecision;
  requiredScopes: readonly string[];
  inputValidation: PolicyDecision;
  rateLimit: PolicyDecision;
  audit: PolicyDecision;
}

export function buildRouteSecurityMatrix(routes: readonly RouteDefinition[]): RouteSecurityMatrixRow[] {
  return routes.map((route) => ({
    id: route.id,
    implemented: route.implemented,
    transport: route.transport,
    method: route.method,
    path: route.path,
    purpose: route.purpose,
    accessLevel: route.accessLevel,
    authentication: route.policy.authentication.decision,
    csrf: route.policy.csrf.decision,
    authorization: route.policy.authorization.decision,
    requiredScopes: route.policy.authorization.requiredScopes ?? [],
    inputValidation: route.policy.inputValidation.decision,
    rateLimit: route.policy.rateLimit.decision,
    audit: route.policy.audit.decision
  }));
}
