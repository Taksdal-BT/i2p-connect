import {
  isSafeDiagnosticText,
  assertSafeDiagnosticText,
  redactDiagnosticText
} from '../../src/status/diagnostics';
import { mapI2pStatus, isI2pStatus, getI2pStatusSeverity } from '../../src/status/statusMapper';
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
  proxy_unavailable: 'warning',
  sam_unavailable: 'warning',
  tunnel_unknown: 'unknown',
  advanced_diagnostics_available: 'unknown'
};

for (const status of I2P_STATUS_VALUES) {
  const mapped = mapI2pStatus(status);

  assertEqual(mapped.status, status, `${status} should map to itself`);
  assertEqual(mapped.severity, expectedSeverity[status], `${status} should map to expected severity`);
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
assertEqual(unknown.networkProbePerformed, false, 'unknown input should not perform network probing');
assertEqual(getI2pStatusSeverity('unexpected_status'), 'unknown', 'unknown severity helper should fall back');
assert(unknown.advancedDiagnostics.length > 0, 'unknown input should include advanced diagnostics');

assert(isI2pStatus('ready'), 'ready should be recognized as an I2P status');
assert(!isI2pStatus('unexpected_status'), 'unexpected_status should not be recognized');

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
