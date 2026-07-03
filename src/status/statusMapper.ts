import {
  ADVANCED_DIAGNOSTICS,
  SAFE_DIAGNOSTIC_MESSAGES,
  UNKNOWN_STATUS_DIAGNOSTIC,
  assertSafeDiagnosticText
} from './diagnostics';
import {
  I2P_STATUS_VALUES,
  type BeginnerI2pStatus,
  type I2pStatus,
  type I2pStatusInput,
  type I2pStatusSeverity
} from './types';

const STATUS_SEVERITY: Record<I2pStatus, I2pStatusSeverity> = {
  ready: 'ok',
  starting: 'warning',
  router_not_found: 'error',
  proxy_unavailable: 'warning',
  sam_unavailable: 'warning',
  tunnel_unknown: 'unknown',
  advanced_diagnostics_available: 'unknown'
};

const STATUS_LABELS: Record<I2pStatus, string> = {
  ready: 'Ready',
  starting: 'Starting',
  router_not_found: 'Router not found',
  proxy_unavailable: 'Proxy unavailable',
  sam_unavailable: 'SAM unavailable',
  tunnel_unknown: 'Tunnel state unknown',
  advanced_diagnostics_available: 'Advanced diagnostics available'
};

const STATUS_SUMMARIES: Record<I2pStatus, string> = {
  ready: 'The local status model can continue with implemented and tested features.',
  starting: 'Local I2P-related services may still be starting.',
  router_not_found: 'No local router status is available to this model.',
  proxy_unavailable: 'The supplied status says the local proxy is unavailable.',
  sam_unavailable: 'The supplied status says SAM is unavailable.',
  tunnel_unknown: 'The supplied status does not establish tunnel readiness.',
  advanced_diagnostics_available: 'Additional local diagnostics can be reviewed safely after redaction.'
};

const STATUS_NEXT_ACTIONS: Record<I2pStatus, string> = {
  ready: 'Continue only with features that have implementation and tests.',
  starting: 'Wait and check local status again.',
  router_not_found: 'Install or start a local I2P router, then check status again.',
  proxy_unavailable: 'Review local proxy settings before continuing.',
  sam_unavailable: 'Review local SAM settings before continuing.',
  tunnel_unknown: 'Review local tunnel setup before relying on this state.',
  advanced_diagnostics_available: 'Open local diagnostics and review safe setup details.'
};

export function isI2pStatus(value: string): value is I2pStatus {
  return I2P_STATUS_VALUES.includes(value as I2pStatus);
}

export function getI2pStatusSeverity(status: I2pStatus | string): I2pStatusSeverity {
  if (!isI2pStatus(status)) {
    return 'unknown';
  }

  return STATUS_SEVERITY[status];
}

export function mapI2pStatus(input: I2pStatus | I2pStatusInput | string): BeginnerI2pStatus {
  const suppliedStatus = typeof input === 'string' ? input : input.status;

  if (!isI2pStatus(suppliedStatus)) {
    return {
      status: 'unknown',
      severity: 'unknown',
      label: 'Status unknown',
      summary: 'The supplied status is not part of the current local status model.',
      diagnosticMessage: assertSafeDiagnosticText(UNKNOWN_STATUS_DIAGNOSTIC),
      advancedDiagnostics: ADVANCED_DIAGNOSTICS.unknown.map((diagnostic) => ({
        ...diagnostic,
        detail: assertSafeDiagnosticText(diagnostic.detail)
      })),
      nextAction: 'Check the local status source and try again.',
      networkProbePerformed: false
    };
  }

  return {
    status: suppliedStatus,
    severity: STATUS_SEVERITY[suppliedStatus],
    label: STATUS_LABELS[suppliedStatus],
    summary: STATUS_SUMMARIES[suppliedStatus],
    diagnosticMessage: assertSafeDiagnosticText(SAFE_DIAGNOSTIC_MESSAGES[suppliedStatus]),
    advancedDiagnostics: ADVANCED_DIAGNOSTICS[suppliedStatus].map((diagnostic) => ({
      ...diagnostic,
      detail: assertSafeDiagnosticText(diagnostic.detail)
    })),
    nextAction: STATUS_NEXT_ACTIONS[suppliedStatus],
    networkProbePerformed: false
  };
}
