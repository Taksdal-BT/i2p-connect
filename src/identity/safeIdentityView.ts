import { redactDiagnosticText } from '../status/diagnostics';
import type { LocalIdentity, SafeLocalIdentityView } from './types';

const SECRET_LIKE_FIELDS = new Set([
  'privateKey',
  'privateDestination',
  'routerCredentials',
  'messageBody',
  'rawRouterLogs',
  'inviteSecret',
  'serviceRoleKey',
  'apiKey',
  'token',
  'secret'
]);

export function redactIdentityText(value: string): string {
  return redactDiagnosticText(value);
}

export function toSafeLocalIdentityView(identity: LocalIdentity): SafeLocalIdentityView {
  return {
    localProfileId: identity.localProfileId,
    displayName: redactIdentityText(identity.displayName),
    publicContactId: identity.publicContactId,
    createdAt: identity.createdAt,
    updatedAt: identity.updatedAt,
    backupWarningAcknowledged: identity.backupWarningAcknowledged,
    privateKeyStored: false,
    cloudSynced: false,
    i2pIdentityCreated: false
  };
}

export function stripIdentitySecrets(value: Record<string, unknown>): Record<string, unknown> {
  const safeValue: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (SECRET_LIKE_FIELDS.has(key)) {
      continue;
    }

    safeValue[key] = typeof entry === 'string' ? redactIdentityText(entry) : entry;
  }

  return safeValue;
}
