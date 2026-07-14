export const I2P_STATUS_VALUES = [
  'ready',
  'starting',
  'router_not_found',
  'router_reachable',
  'router_unreachable',
  'router_misconfigured',
  'sam_session_ready',
  'sam_session_unavailable',
  'sam_misconfigured',
  'transport_ready',
  'transport_unavailable',
  'transport_misconfigured',
  'proxy_unavailable',
  'sam_unavailable',
  'tunnel_unknown',
  'advanced_diagnostics_available'
] as const;

export type I2pStatus = (typeof I2P_STATUS_VALUES)[number];

export type I2pStatusSeverity = 'ok' | 'warning' | 'error' | 'unknown';

export type I2pStatusReason =
  | 'none'
  | 'unknown_status'
  | 'router_host_not_loopback'
  | 'router_port_invalid'
  | 'sam_host_not_loopback'
  | 'sam_port_invalid'
  | 'transport_host_not_loopback'
  | 'transport_port_invalid';

export interface I2pStatusCopy {
  label: string;
  summary: string;
  nextAction: string;
}

export interface I2pAdvancedDiagnostic {
  code: string;
  title: string;
  detail: string;
  safeToShow: true;
}

export interface I2pStatusInput {
  status: I2pStatus | string;
  localOnlyNote?: string;
}

export interface LocalRouterReachabilityInput {
  host: string;
  port: number;
  reachable: boolean;
}

export interface LocalSamReadinessInput {
  host: string;
  port: number;
  sessionReady: boolean;
}

export interface LocalTransportReadinessInput {
  host: string;
  port: number;
  transportReady: boolean;
}

export interface LocalI2pReadinessInput {
  router: LocalRouterReachabilityInput;
  sam: LocalSamReadinessInput;
  transport: LocalTransportReadinessInput;
}

export interface BeginnerI2pStatus {
  status: I2pStatus | 'unknown';
  severity: I2pStatusSeverity;
  reason: I2pStatusReason;
  label: string;
  summary: string;
  diagnosticMessage: string;
  advancedDiagnostics: I2pAdvancedDiagnostic[];
  nextAction: string;
  networkProbePerformed: false;
}
