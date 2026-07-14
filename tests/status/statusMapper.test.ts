import {
  isSafeDiagnosticText,
  assertSafeDiagnosticText,
  redactDiagnosticText
} from '../../src/status/diagnostics';
import {
  composeLocalI2pReadiness,
  formatBeginnerReadinessSummary,
  mapI2pStatus,
  mapLocalRouterReachability,
  mapLocalSamReadiness,
  mapLocalTransportReadiness,
  isI2pStatus,
  isLoopbackHost,
  isValidLocalRouterPort,
  isValidLocalSamPort,
  isValidLocalTransportPort,
  getI2pStatusSeverity
} from '../../src/status/statusMapper';
import { I2P_STATUS_VALUES, type I2pStatus, type I2pStatusSeverity } from '../../src/status/types';

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
  }
}

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

const expectedSeverity: Record<I2pStatus, I2pStatusSeverity> = {
  ready: 'ok',
  starting: 'warning',
  router_not_found: 'error',
  router_reachable: 'ok',
  router_unreachable: 'warning',
  router_misconfigured: 'error',
  sam_session_ready: 'ok',
  sam_session_unavailable: 'warning',
  sam_misconfigured: 'error',
  transport_ready: 'ok',
  transport_unavailable: 'warning',
  transport_misconfigured: 'error',
  proxy_unavailable: 'warning',
  sam_unavailable: 'warning',
  tunnel_unknown: 'unknown',
  advanced_diagnostics_available: 'unknown'
};

for (const status of I2P_STATUS_VALUES) {
  const mapped = mapI2pStatus(status);

  assertEqual(mapped.status, status, `${status} should map to itself`);
  assertEqual(mapped.severity, expectedSeverity[status], `${status} should map to expected severity`);
  assert(mapped.reason.length > 0, `${status} should include a typed reason`);
  assert(mapped.label.length > 0, `${status} should have a beginner-friendly label`);
  assert(mapped.summary.length > 0, `${status} should have a beginner-friendly summary`);
  assert(mapped.diagnosticMessage.length > 0, `${status} should have a diagnostic message`);
  assert(mapped.advancedDiagnostics.length > 0, `${status} should have advanced diagnostics`);
  assert(mapped.nextAction.length > 0, `${status} should have a next action`);
  assertEqual(mapped.networkProbePerformed, false, `${status} should not perform network probing`);
  assert(isSafeDiagnosticText(mapped.diagnosticMessage), `${status} diagnostic should be safe`);
  assertEqual(getI2pStatusSeverity(status), expectedSeverity[status], `${status} severity helper should match`);

  for (const diagnostic of mapped.advancedDiagnostics) {
    assert(diagnostic.safeToShow, `${status} advanced diagnostic should be marked safe`);
    assert(diagnostic.code.length > 0, `${status} advanced diagnostic should have a code`);
    assert(diagnostic.title.length > 0, `${status} advanced diagnostic should have a title`);
    assert(diagnostic.detail.length > 0, `${status} advanced diagnostic should have detail`);
    assert(isSafeDiagnosticText(diagnostic.detail), `${status} advanced diagnostic should be safe`);
  }
}

const unknown = mapI2pStatus('unexpected_status');
assertEqual(unknown.status, 'unknown', 'unknown input should fall back to unknown status');
assertEqual(unknown.severity, 'unknown', 'unknown input should have unknown severity');
assertEqual(unknown.reason, 'unknown_status', 'unknown input should include unknown_status reason');
assertEqual(unknown.networkProbePerformed, false, 'unknown input should not perform network probing');
assertEqual(getI2pStatusSeverity('unexpected_status'), 'unknown', 'unknown severity helper should fall back');
assert(unknown.advancedDiagnostics.length > 0, 'unknown input should include advanced diagnostics');

const routerReachable = mapLocalRouterReachability({
  host: '127.0.0.1',
  port: 7657,
  reachable: true
});

assertEqual(routerReachable.status, 'router_reachable', 'loopback reachable input should map to router_reachable');
assertEqual(routerReachable.severity, 'ok', 'loopback reachable input should be ok');
assertEqual(routerReachable.networkProbePerformed, false, 'reachability mapper should not perform probing');

const routerUnreachable = mapLocalRouterReachability({
  host: 'localhost',
  port: 7657,
  reachable: false
});

assertEqual(
  routerUnreachable.status,
  'router_unreachable',
  'loopback unreachable input should map to router_unreachable'
);
assertEqual(routerUnreachable.severity, 'warning', 'loopback unreachable input should be warning');

const routerMisconfiguredHost = mapLocalRouterReachability({
  host: 'example.com',
  port: 7657,
  reachable: true
});

assertEqual(
  routerMisconfiguredHost.status,
  'router_misconfigured',
  'non-loopback host should map to router_misconfigured'
);
assertEqual(routerMisconfiguredHost.severity, 'error', 'non-loopback host should be error');
assertEqual(
  routerMisconfiguredHost.reason,
  'router_host_not_loopback',
  'non-loopback router host should include router_host_not_loopback reason'
);

const routerMisconfiguredPort = mapLocalRouterReachability({
  host: '::1',
  port: 0,
  reachable: true
});

assertEqual(
  routerMisconfiguredPort.status,
  'router_misconfigured',
  'invalid port should map to router_misconfigured'
);
assertEqual(routerMisconfiguredPort.severity, 'error', 'invalid port should be error');
assertEqual(
  routerMisconfiguredPort.reason,
  'router_port_invalid',
  'invalid router port should include router_port_invalid reason'
);

const samReady = mapLocalSamReadiness({
  host: '127.0.0.1',
  port: 7656,
  sessionReady: true
});

assertEqual(samReady.status, 'sam_session_ready', 'loopback SAM ready input should map to sam_session_ready');
assertEqual(samReady.severity, 'ok', 'loopback SAM ready input should be ok');
assertEqual(samReady.networkProbePerformed, false, 'SAM mapper should not perform probing');

const samUnavailable = mapLocalSamReadiness({
  host: 'localhost',
  port: 7656,
  sessionReady: false
});

assertEqual(
  samUnavailable.status,
  'sam_session_unavailable',
  'loopback SAM unavailable input should map to sam_session_unavailable'
);
assertEqual(samUnavailable.severity, 'warning', 'loopback SAM unavailable input should be warning');

const samMisconfiguredHost = mapLocalSamReadiness({
  host: '10.0.0.5',
  port: 7656,
  sessionReady: true
});

assertEqual(
  samMisconfiguredHost.status,
  'sam_misconfigured',
  'non-loopback SAM host should map to sam_misconfigured'
);
assertEqual(samMisconfiguredHost.severity, 'error', 'non-loopback SAM host should be error');
assertEqual(
  samMisconfiguredHost.reason,
  'sam_host_not_loopback',
  'non-loopback SAM host should include sam_host_not_loopback reason'
);

const samMisconfiguredPort = mapLocalSamReadiness({
  host: '::1',
  port: 99999,
  sessionReady: true
});

assertEqual(
  samMisconfiguredPort.status,
  'sam_misconfigured',
  'invalid SAM port should map to sam_misconfigured'
);
assertEqual(samMisconfiguredPort.severity, 'error', 'invalid SAM port should be error');
assertEqual(
  samMisconfiguredPort.reason,
  'sam_port_invalid',
  'invalid SAM port should include sam_port_invalid reason'
);

const transportReady = mapLocalTransportReadiness({
  host: '127.0.0.1',
  port: 7658,
  transportReady: true
});

assertEqual(
  transportReady.status,
  'transport_ready',
  'loopback selected transport ready input should map to transport_ready'
);
assertEqual(transportReady.severity, 'ok', 'loopback selected transport ready input should be ok');
assertEqual(transportReady.networkProbePerformed, false, 'selected transport mapper should not perform probing');

const transportUnavailable = mapLocalTransportReadiness({
  host: 'localhost',
  port: 7658,
  transportReady: false
});

assertEqual(
  transportUnavailable.status,
  'transport_unavailable',
  'loopback selected transport unavailable input should map to transport_unavailable'
);
assertEqual(
  transportUnavailable.severity,
  'warning',
  'loopback selected transport unavailable input should be warning'
);

const transportMisconfiguredHost = mapLocalTransportReadiness({
  host: 'remote.example',
  port: 7658,
  transportReady: true
});

assertEqual(
  transportMisconfiguredHost.status,
  'transport_misconfigured',
  'non-loopback selected transport host should map to transport_misconfigured'
);
assertEqual(
  transportMisconfiguredHost.severity,
  'error',
  'non-loopback selected transport host should be error'
);
assertEqual(
  transportMisconfiguredHost.reason,
  'transport_host_not_loopback',
  'non-loopback selected transport host should include transport_host_not_loopback reason'
);

const transportMisconfiguredPort = mapLocalTransportReadiness({
  host: '::1',
  port: -1,
  transportReady: true
});

assertEqual(
  transportMisconfiguredPort.status,
  'transport_misconfigured',
  'invalid selected transport port should map to transport_misconfigured'
);
assertEqual(
  transportMisconfiguredPort.severity,
  'error',
  'invalid selected transport port should be error'
);
assertEqual(
  transportMisconfiguredPort.reason,
  'transport_port_invalid',
  'invalid selected transport port should include transport_port_invalid reason'
);

const allReady = composeLocalI2pReadiness({
  router: {
    host: '127.0.0.1',
    port: 7657,
    reachable: true
  },
  sam: {
    host: '127.0.0.1',
    port: 7656,
    sessionReady: true
  },
  transport: {
    host: '127.0.0.1',
    port: 7658,
    transportReady: true
  }
});

assertEqual(allReady.status, 'ready', 'all ready loopback inputs should compose to ready');
assertEqual(allReady.severity, 'ok', 'all ready loopback inputs should compose to ok severity');
assertEqual(allReady.networkProbePerformed, false, 'aggregate readiness should not perform probing');

const composedRouterMisconfigured = composeLocalI2pReadiness({
  router: {
    host: 'remote.example',
    port: 7657,
    reachable: true
  },
  sam: {
    host: '127.0.0.1',
    port: 7656,
    sessionReady: true
  },
  transport: {
    host: '127.0.0.1',
    port: 7658,
    transportReady: true
  }
});

assertEqual(
  composedRouterMisconfigured.status,
  'router_misconfigured',
  'aggregate readiness should fail closed on router misconfiguration first'
);

const composedSamUnavailable = composeLocalI2pReadiness({
  router: {
    host: '127.0.0.1',
    port: 7657,
    reachable: true
  },
  sam: {
    host: 'localhost',
    port: 7656,
    sessionReady: false
  },
  transport: {
    host: '127.0.0.1',
    port: 7658,
    transportReady: true
  }
});

assertEqual(
  composedSamUnavailable.status,
  'sam_session_unavailable',
  'aggregate readiness should return SAM unavailable when router is ready but SAM is not'
);

const composedTransportUnavailable = composeLocalI2pReadiness({
  router: {
    host: '127.0.0.1',
    port: 7657,
    reachable: true
  },
  sam: {
    host: 'localhost',
    port: 7656,
    sessionReady: true
  },
  transport: {
    host: 'localhost',
    port: 7658,
    transportReady: false
  }
});

assertEqual(
  composedTransportUnavailable.status,
  'transport_unavailable',
  'aggregate readiness should return transport unavailable when router and SAM are ready'
);

const readySummary = formatBeginnerReadinessSummary(allReady);
assert(
  readySummary.includes('Local readiness check: ready.'),
  'ready summary should include a beginner-facing ready prefix'
);
assert(
  readySummary.includes('Router, SAM, and selected transport are in a usable local state.'),
  'ready summary should include a clear all-ready message'
);

const blockedSummary = formatBeginnerReadinessSummary(composedTransportUnavailable);
assert(
  blockedSummary.includes('Selected transport unavailable'),
  'blocked summary should include the blocking status label'
);
assert(
  blockedSummary.includes('Next: Confirm the selected local transport is enabled and ready on loopback, then check status again.'),
  'blocked summary should include the next action guidance'
);

const unknownSummary = formatBeginnerReadinessSummary(unknown);
assert(
  unknownSummary.includes('Local readiness check: unknown.'),
  'unknown summary should include an unknown prefix'
);
assert(
  unknownSummary.includes('Verify your local status source and try again.'),
  'unknown summary should include a beginner-safe recovery hint'
);

assert(isI2pStatus('ready'), 'ready should be recognized as an I2P status');
assert(!isI2pStatus('unexpected_status'), 'unexpected_status should not be recognized');
assert(isLoopbackHost('localhost'), 'localhost should be recognized as a loopback host');
assert(isLoopbackHost('127.0.0.1'), '127.0.0.1 should be recognized as a loopback host');
assert(isLoopbackHost('::1'), '::1 should be recognized as a loopback host');
assert(!isLoopbackHost('example.com'), 'example.com should not be recognized as a loopback host');
assert(isValidLocalRouterPort(7657), '7657 should be a valid local router port');
assert(!isValidLocalRouterPort(0), 'port zero should be invalid');
assert(!isValidLocalRouterPort(70000), 'port greater than 65535 should be invalid');
assert(!isValidLocalRouterPort(7657.5), 'non-integer port should be invalid');
assert(isValidLocalSamPort(7656), '7656 should be a valid local SAM port');
assert(!isValidLocalSamPort(0), 'SAM port zero should be invalid');
assert(!isValidLocalSamPort(70000), 'SAM port greater than 65535 should be invalid');
assert(isValidLocalTransportPort(7658), '7658 should be a valid local selected transport port');
assert(!isValidLocalTransportPort(0), 'selected transport port zero should be invalid');
assert(!isValidLocalTransportPort(70000), 'selected transport port greater than 65535 should be invalid');

assert(!isSafeDiagnosticText('private keys should not appear'), 'private key text should be unsafe');
assert(!isSafeDiagnosticText('raw traffic logs should not appear'), 'raw traffic log text should be unsafe');

const redacted = redactDiagnosticText(
  'private key: abc123 router credentials: hunter2 token=secret-value abcdefghijklmnopqrstuvwxyz234567abcdefghijklmnopqrst.b32.i2p'
);

assert(!redacted.includes('abc123'), 'redaction should remove private key values');
assert(!redacted.includes('hunter2'), 'redaction should remove router credential values');
assert(!redacted.includes('secret-value'), 'redaction should remove token values');
assert(redacted.includes('[REDACTED]'), 'redaction should mark sensitive key-value text');
assert(redacted.includes('[REDACTED_I2P_DESTINATION]'), 'redaction should mark destination-like values');

assertThrows(
  () => assertSafeDiagnosticText('router credentials should not appear'),
  'unsafe diagnostic text should throw'
);
