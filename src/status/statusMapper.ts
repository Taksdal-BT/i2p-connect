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
  type I2pStatusReason,
  type LocalI2pReadinessInput,
  type LocalRouterReachabilityInput,
  type LocalSamReadinessInput,
  type LocalTransportReadinessInput,
  type I2pStatusInput,
  type I2pStatusSeverity
} from './types';

const STATUS_SEVERITY: Record<I2pStatus, I2pStatusSeverity> = {
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

const STATUS_LABELS: Record<I2pStatus, string> = {
  ready: 'Ready',
  starting: 'Starting',
  router_not_found: 'Router not found',
  router_reachable: 'Router reachable',
  router_unreachable: 'Router unreachable',
  router_misconfigured: 'Router misconfigured',
  sam_session_ready: 'SAM session ready',
  sam_session_unavailable: 'SAM session unavailable',
  sam_misconfigured: 'SAM misconfigured',
  transport_ready: 'Selected transport ready',
  transport_unavailable: 'Selected transport unavailable',
  transport_misconfigured: 'Selected transport misconfigured',
  proxy_unavailable: 'Proxy unavailable',
  sam_unavailable: 'SAM unavailable',
  tunnel_unknown: 'Tunnel state unknown',
  advanced_diagnostics_available: 'Advanced diagnostics available'
};

const STATUS_SUMMARIES: Record<I2pStatus, string> = {
  ready: 'The local status model can continue with implemented and tested features.',
  starting: 'Local I2P-related services may still be starting.',
  router_not_found: 'No local router status is available to this model.',
  router_reachable: 'A supplied localhost-only router result indicates the local router is reachable.',
  router_unreachable: 'A supplied localhost-only router result indicates the local router is not reachable yet.',
  router_misconfigured: 'The supplied router endpoint is not a safe localhost-only configuration for this product.',
  sam_session_ready: 'A supplied localhost-only SAM result indicates a local SAM session is ready.',
  sam_session_unavailable: 'A supplied localhost-only SAM result indicates the local SAM session is not ready yet.',
  sam_misconfigured: 'The supplied SAM endpoint is not a safe localhost-only configuration for this product.',
  transport_ready: 'A supplied localhost-only selected transport result indicates local transport readiness.',
  transport_unavailable: 'A supplied localhost-only selected transport result indicates local transport is not ready yet.',
  transport_misconfigured: 'The supplied selected transport endpoint is not a safe localhost-only configuration for this product.',
  proxy_unavailable: 'The supplied status says the local proxy is unavailable.',
  sam_unavailable: 'The supplied status says SAM is unavailable.',
  tunnel_unknown: 'The supplied status does not establish tunnel readiness.',
  advanced_diagnostics_available: 'Additional local diagnostics can be reviewed safely after redaction.'
};

const STATUS_NEXT_ACTIONS: Record<I2pStatus, string> = {
  ready: 'Continue only with features that have implementation and tests.',
  starting: 'Wait and check local status again.',
  router_not_found: 'Install or start a local I2P router, then check status again.',
  router_reachable: 'Continue with the next localhost-only readiness check or feature gate.',
  router_unreachable: 'Confirm the local router is running on loopback, then check status again.',
  router_misconfigured: 'Use localhost, 127.0.0.1, or ::1 with a valid local router port before continuing.',
  sam_session_ready: 'Continue with the next localhost-only transport readiness gate.',
  sam_session_unavailable: 'Confirm local SAM is enabled and ready on loopback, then check status again.',
  sam_misconfigured: 'Use localhost, 127.0.0.1, or ::1 with a valid local SAM port before continuing.',
  transport_ready: 'Continue with the next local feature gate that depends on selected transport readiness.',
  transport_unavailable: 'Confirm the selected local transport is enabled and ready on loopback, then check status again.',
  transport_misconfigured: 'Use localhost, 127.0.0.1, or ::1 with a valid local selected transport port before continuing.',
  proxy_unavailable: 'Review local proxy settings before continuing.',
  sam_unavailable: 'Review local SAM settings before continuing.',
  tunnel_unknown: 'Review local tunnel setup before relying on this state.',
  advanced_diagnostics_available: 'Open local diagnostics and review safe setup details.'
};

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

const STATUS_REASONS: Record<I2pStatus, I2pStatusReason> = {
  ready: 'none',
  starting: 'none',
  router_not_found: 'none',
  router_reachable: 'none',
  router_unreachable: 'none',
  router_misconfigured: 'router_host_not_loopback',
  sam_session_ready: 'none',
  sam_session_unavailable: 'none',
  sam_misconfigured: 'sam_host_not_loopback',
  transport_ready: 'none',
  transport_unavailable: 'none',
  transport_misconfigured: 'transport_host_not_loopback',
  proxy_unavailable: 'none',
  sam_unavailable: 'none',
  tunnel_unknown: 'none',
  advanced_diagnostics_available: 'none'
};

export function isI2pStatus(value: string): value is I2pStatus {
  return I2P_STATUS_VALUES.includes(value as I2pStatus);
}

export function isLoopbackHost(host: string): boolean {
  return LOOPBACK_HOSTS.has(host.trim().toLowerCase());
}

export function isValidLocalRouterPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

export function isValidLocalSamPort(port: number): boolean {
  return isValidLocalRouterPort(port);
}

export function isValidLocalTransportPort(port: number): boolean {
  return isValidLocalRouterPort(port);
}

export function getI2pStatusSeverity(status: I2pStatus | string): I2pStatusSeverity {
  if (!isI2pStatus(status)) {
    return 'unknown';
  }

  return STATUS_SEVERITY[status];
}

export function mapLocalRouterReachability(
  input: LocalRouterReachabilityInput
): BeginnerI2pStatus {
  if (!isLoopbackHost(input.host)) {
    return mapI2pStatus({ status: 'router_misconfigured', localOnlyNote: 'router_host_not_loopback' });
  }

  if (!isValidLocalRouterPort(input.port)) {
    return mapI2pStatus({ status: 'router_misconfigured', localOnlyNote: 'router_port_invalid' });
  }

  return mapI2pStatus(input.reachable ? 'router_reachable' : 'router_unreachable');
}

export function mapLocalSamReadiness(input: LocalSamReadinessInput): BeginnerI2pStatus {
  if (!isLoopbackHost(input.host)) {
    return mapI2pStatus({ status: 'sam_misconfigured', localOnlyNote: 'sam_host_not_loopback' });
  }

  if (!isValidLocalSamPort(input.port)) {
    return mapI2pStatus({ status: 'sam_misconfigured', localOnlyNote: 'sam_port_invalid' });
  }

  return mapI2pStatus(input.sessionReady ? 'sam_session_ready' : 'sam_session_unavailable');
}

export function mapLocalTransportReadiness(
  input: LocalTransportReadinessInput
): BeginnerI2pStatus {
  if (!isLoopbackHost(input.host)) {
    return mapI2pStatus({
      status: 'transport_misconfigured',
      localOnlyNote: 'transport_host_not_loopback'
    });
  }

  if (!isValidLocalTransportPort(input.port)) {
    return mapI2pStatus({ status: 'transport_misconfigured', localOnlyNote: 'transport_port_invalid' });
  }

  return mapI2pStatus(input.transportReady ? 'transport_ready' : 'transport_unavailable');
}

export function composeLocalI2pReadiness(input: LocalI2pReadinessInput): BeginnerI2pStatus {
  const routerStatus = mapLocalRouterReachability(input.router);
  if (routerStatus.status !== 'router_reachable') {
    return routerStatus;
  }

  const samStatus = mapLocalSamReadiness(input.sam);
  if (samStatus.status !== 'sam_session_ready') {
    return samStatus;
  }

  const transportStatus = mapLocalTransportReadiness(input.transport);
  if (transportStatus.status !== 'transport_ready') {
    return transportStatus;
  }

  return mapI2pStatus('ready');
}

export function formatBeginnerReadinessSummary(status: BeginnerI2pStatus): string {
  if (status.status === 'ready') {
    return 'Local readiness check: ready. Router, SAM, and selected transport are in a usable local state.';
  }

  if (status.status === 'unknown') {
    return 'Local readiness check: unknown. Verify your local status source and try again.';
  }

  return `Local readiness check: ${status.label}. ${status.summary} Next: ${status.nextAction}`;
}

export function mapI2pStatus(input: I2pStatus | I2pStatusInput | string): BeginnerI2pStatus {
  const suppliedStatus = typeof input === 'string' ? input : input.status;
  const suppliedNote = typeof input === 'string' ? undefined : input.localOnlyNote;

  if (!isI2pStatus(suppliedStatus)) {
    return {
      status: 'unknown',
      severity: 'unknown',
      reason: 'unknown_status',
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
    reason: (suppliedNote as I2pStatusReason | undefined) ?? STATUS_REASONS[suppliedStatus],
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
