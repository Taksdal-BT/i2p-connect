export type RouteTransport = 'http' | 'websocket' | 'ipc' | 'local_admin';

export type RouteMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'WS'
  | 'IPC';

export type RouteAccessLevel = 'public' | 'authenticated' | 'privileged';

export type PolicyDecision = 'required' | 'not_required' | 'exempt' | 'unknown';

export interface PolicyDecisionConfig {
  decision: PolicyDecision;
  rationale?: string;
}

export interface AuthorizationPolicy extends PolicyDecisionConfig {
  requiredScopes?: readonly string[];
}

export interface RouteSecurityPolicy {
  authentication: PolicyDecisionConfig;
  csrf: PolicyDecisionConfig;
  authorization: AuthorizationPolicy;
  inputValidation: PolicyDecisionConfig;
  rateLimit: PolicyDecisionConfig;
  audit: PolicyDecisionConfig;
}

export interface RouteDefinition {
  id: string;
  transport: RouteTransport;
  method: RouteMethod;
  path: string;
  purpose: string;
  browserAccessible: boolean;
  stateChanging: boolean;
  sensitive: boolean;
  accessLevel: RouteAccessLevel;
  implemented: boolean;
  policy: RouteSecurityPolicy;
}

export interface RoutePolicyFinding {
  routeId: string;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export function validateRoutePolicies(routes: readonly RouteDefinition[]): RoutePolicyFinding[] {
  const findings: RoutePolicyFinding[] = [];

  for (const route of routes) {
    const { policy } = route;

    if (route.sensitive) {
      pushUnknownDecisionFindings(route, policy, findings);
    }

    if (route.accessLevel === 'public' && policy.authentication.decision !== 'not_required') {
      findings.push({
        routeId: route.id,
        severity: 'error',
        code: 'policy.public.auth-mismatch',
        message: 'Public routes must explicitly set authentication to not_required.'
      });
    }

    if (route.accessLevel !== 'public' && policy.authentication.decision !== 'required') {
      findings.push({
        routeId: route.id,
        severity: 'error',
        code: 'policy.non-public.auth-required',
        message: 'Authenticated and privileged routes must require authentication.'
      });
    }

    if (route.browserAccessible && route.stateChanging) {
      const csrfDecision = policy.csrf.decision;
      if (csrfDecision !== 'required' && csrfDecision !== 'exempt') {
        findings.push({
          routeId: route.id,
          severity: 'error',
          code: 'policy.browser-state.csrf-required',
          message: 'Browser-accessible state-changing routes must require CSRF or provide an explicit exempt decision.'
        });
      }
      if (csrfDecision === 'exempt' && !policy.csrf.rationale) {
        findings.push({
          routeId: route.id,
          severity: 'error',
          code: 'policy.browser-state.csrf-exempt-rationale',
          message: 'CSRF exemptions require a rationale.'
        });
      }
    }

    if (route.accessLevel === 'privileged') {
      if (policy.authorization.decision !== 'required') {
        findings.push({
          routeId: route.id,
          severity: 'error',
          code: 'policy.privileged.authorization-required',
          message: 'Privileged routes must require authorization scopes.'
        });
      }

      if (!policy.authorization.requiredScopes || policy.authorization.requiredScopes.length === 0) {
        findings.push({
          routeId: route.id,
          severity: 'error',
          code: 'policy.privileged.scope-missing',
          message: 'Privileged routes must define at least one required scope.'
        });
      }
    }

    if (policy.authorization.decision === 'required') {
      if (!policy.authorization.requiredScopes || policy.authorization.requiredScopes.length === 0) {
        findings.push({
          routeId: route.id,
          severity: 'error',
          code: 'policy.authorization.scope-missing',
          message: 'Authorization marked required but no requiredScopes are configured.'
        });
      }
    }

    if (policy.authorization.decision === 'exempt' && !policy.authorization.rationale) {
      findings.push({
        routeId: route.id,
        severity: 'error',
        code: 'policy.authorization.exempt-rationale',
        message: 'Authorization exemptions require a rationale.'
      });
    }
  }

  return findings;
}

function pushUnknownDecisionFindings(
  route: RouteDefinition,
  policy: RouteSecurityPolicy,
  findings: RoutePolicyFinding[]
): void {
  const decisions: Array<[string, PolicyDecisionConfig | AuthorizationPolicy]> = [
    ['authentication', policy.authentication],
    ['csrf', policy.csrf],
    ['authorization', policy.authorization],
    ['inputValidation', policy.inputValidation],
    ['rateLimit', policy.rateLimit],
    ['audit', policy.audit]
  ];

  for (const [name, decision] of decisions) {
    if (decision.decision === 'unknown') {
      findings.push({
        routeId: route.id,
        severity: 'error',
        code: `policy.${name}.unknown`,
        message: `Sensitive route ${route.id} has an unknown ${name} policy decision.`
      });
    }
  }
}

export function assertRoutePoliciesForStartup(routes: readonly RouteDefinition[]): void {
  const findings = validateRoutePolicies(routes);
  const startupBlockers = findings.filter((finding) => finding.severity === 'error');

  if (startupBlockers.length === 0) {
    return;
  }

  const detail = startupBlockers
    .map((finding) => `${finding.routeId}: ${finding.code} - ${finding.message}`)
    .join('\n');

  throw new Error(`Route policy startup validation failed:\n${detail}`);
}
