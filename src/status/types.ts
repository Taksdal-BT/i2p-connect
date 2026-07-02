export const I2P_STATUS_VALUES = [
  'ready',
  'starting',
  'router_not_found',
  'proxy_unavailable',
  'sam_unavailable',
  'tunnel_unknown',
  'advanced_diagnostics_available'
] as const;

export type I2pStatus = (typeof I2P_STATUS_VALUES)[number];

export type I2pStatusSeverity = 'ok' | 'warning' | 'error' | 'unknown';

export interface I2pStatusInput {
  status: I2pStatus | string;
}

export interface BeginnerI2pStatus {
  status: I2pStatus | 'unknown';
  severity: I2pStatusSeverity;
  label: string;
  diagnosticMessage: string;
  nextAction: string;
  networkProbePerformed: false;
}
