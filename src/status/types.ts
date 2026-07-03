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

export interface BeginnerI2pStatus {
  status: I2pStatus | 'unknown';
  severity: I2pStatusSeverity;
  label: string;
  summary: string;
  diagnosticMessage: string;
  advancedDiagnostics: I2pAdvancedDiagnostic[];
  nextAction: string;
  networkProbePerformed: false;
}
