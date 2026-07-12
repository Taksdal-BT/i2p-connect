import {
  assertRoutePoliciesForStartup,
  type RouteDefinition,
  validateRoutePolicies
} from '../../src/security/routePolicy';
import { buildRouteSecurityMatrix } from '../../src/security/routeSecurityMatrix';

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

const validPrivilegedRoute: RouteDefinition = {
  id: 'messages.create',
  transport: 'http',
  method: 'POST',
  path: '/api/messages',
  purpose: 'Create a local queued message record.',
  browserAccessible: true,
  stateChanging: true,
  sensitive: true,
  accessLevel: 'privileged',
  implemented: true,
  policy: {
    authentication: { decision: 'required' },
    csrf: { decision: 'required' },
    authorization: { decision: 'required', requiredScopes: ['messages:write'] },
    inputValidation: { decision: 'required' },
    rateLimit: { decision: 'required' },
    audit: { decision: 'required' }
  }
};

const validPublicRoute: RouteDefinition = {
  id: 'status.read',
  transport: 'http',
  method: 'GET',
  path: '/api/status',
  purpose: 'Return sanitized local status summary.',
  browserAccessible: true,
  stateChanging: false,
  sensitive: false,
  accessLevel: 'public',
  implemented: true,
  policy: {
    authentication: { decision: 'not_required' },
    csrf: { decision: 'not_required' },
    authorization: { decision: 'not_required' },
    inputValidation: { decision: 'required' },
    rateLimit: { decision: 'required' },
    audit: { decision: 'required' }
  }
};

const validRoutes = [validPrivilegedRoute, validPublicRoute] as const;

const validFindings = validateRoutePolicies(validRoutes);
assert(validFindings.length === 0, 'valid routes should not produce findings');
assertRoutePoliciesForStartup(validRoutes);

const unknownPolicyRoute: RouteDefinition = {
  ...validPrivilegedRoute,
  id: 'messages.create.unknown',
  policy: {
    ...validPrivilegedRoute.policy,
    audit: { decision: 'unknown' }
  }
};

const unknownFindings = validateRoutePolicies([unknownPolicyRoute]);
assert(
  unknownFindings.some((finding) => finding.code === 'policy.audit.unknown'),
  'sensitive routes with unknown policy decisions should fail'
);

const csrfMissingRoute: RouteDefinition = {
  ...validPrivilegedRoute,
  id: 'messages.create.no-csrf',
  policy: {
    ...validPrivilegedRoute.policy,
    csrf: { decision: 'not_required' }
  }
};

const csrfFindings = validateRoutePolicies([csrfMissingRoute]);
assert(
  csrfFindings.some((finding) => finding.code === 'policy.browser-state.csrf-required'),
  'browser state-changing routes should require CSRF or explicit exemption'
);

const missingScopeRoute: RouteDefinition = {
  ...validPrivilegedRoute,
  id: 'messages.create.no-scope',
  policy: {
    ...validPrivilegedRoute.policy,
    authorization: { decision: 'required', requiredScopes: [] }
  }
};

const scopeFindings = validateRoutePolicies([missingScopeRoute]);
assert(
  scopeFindings.some((finding) => finding.code === 'policy.privileged.scope-missing'),
  'privileged routes should require at least one scope'
);

const implicitPublicRoute: RouteDefinition = {
  ...validPublicRoute,
  id: 'status.read.implicit-public',
  policy: {
    ...validPublicRoute.policy,
    authentication: { decision: 'required' }
  }
};

const publicFindings = validateRoutePolicies([implicitPublicRoute]);
assert(
  publicFindings.some((finding) => finding.code === 'policy.public.auth-mismatch'),
  'public routes must explicitly set authentication not_required'
);

assertThrows(
  () => assertRoutePoliciesForStartup([unknownPolicyRoute]),
  'startup policy guard should fail on invalid route policy coverage'
);

const matrix = buildRouteSecurityMatrix(validRoutes);
assert(matrix.length === validRoutes.length, 'matrix should include each registered route exactly once');
assert(matrix[0]?.id === 'messages.create', 'matrix should preserve route identity');
assert(matrix[0]?.authorization === 'required', 'matrix should include authorization decision');
assert(matrix[0]?.requiredScopes.includes('messages:write') ?? false, 'matrix should include required scopes');
