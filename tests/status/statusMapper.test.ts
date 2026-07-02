import { isSafeDiagnosticText, assertSafeDiagnosticText } from '../../src/status/diagnostics';
import { mapI2pStatus, isI2pStatus } from '../../src/status/statusMapper';
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
  assert(mapped.diagnosticMessage.length > 0, `${status} should have a diagnostic message`);
  assert(mapped.nextAction.length > 0, `${status} should have a next action`);
  assertEqual(mapped.networkProbePerformed, false, `${status} should not perform network probing`);
  assert(isSafeDiagnosticText(mapped.diagnosticMessage), `${status} diagnostic should be safe`);
}

const unknown = mapI2pStatus('unexpected_status');
assertEqual(unknown.status, 'unknown', 'unknown input should fall back to unknown status');
assertEqual(unknown.severity, 'unknown', 'unknown input should have unknown severity');
assertEqual(unknown.networkProbePerformed, false, 'unknown input should not perform network probing');

assert(isI2pStatus('ready'), 'ready should be recognized as an I2P status');
assert(!isI2pStatus('unexpected_status'), 'unexpected_status should not be recognized');

assert(!isSafeDiagnosticText('private keys should not appear'), 'private key text should be unsafe');
assert(!isSafeDiagnosticText('raw traffic logs should not appear'), 'raw traffic log text should be unsafe');
assertThrows(
  () => assertSafeDiagnosticText('router credentials should not appear'),
  'unsafe diagnostic text should throw'
);
