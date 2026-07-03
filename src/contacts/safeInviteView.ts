import { redactDiagnosticText } from '../status/diagnostics';
import {
  CONTACT_INVITE_TRUST_WARNINGS,
  CONTACT_INVITE_VERSION,
  type ContactInviteV1,
  type SafeContactInviteView
} from './types';

const INVITE_SAFE_FIELDS = ['version', 'displayName', 'publicContactId', 'createdAt', 'note'] as const;

const SENSITIVE_LABEL_REDACTIONS = [
  /\bprivate\s+key\b/gi,
  /\bprivate\s+destination\b/gi,
  /\brouter\s+credentials?\b/gi,
  /\bmessage\s+(?:body|content)\b/gi,
  /\braw\s+(?:router\s+)?logs?\b/gi,
  /\bcontact\s+graph\b/gi,
  /\binvite\s+secret\b/gi,
  /\bservice\s+role\s+key\b/gi,
  /\bapi\s+key\b/gi
];

export function redactInviteText(value: string): string {
  return SENSITIVE_LABEL_REDACTIONS.reduce(
    (redactedValue, pattern) => redactedValue.replace(pattern, '[REDACTED_FIELD]'),
    redactDiagnosticText(value)
  );
}

export function exportContactInvite(invite: ContactInviteV1): ContactInviteV1 {
  const safeInvite: ContactInviteV1 = {
    version: CONTACT_INVITE_VERSION,
    displayName: redactInviteText(invite.displayName),
    publicContactId: invite.publicContactId,
    createdAt: invite.createdAt
  };

  if (invite.note !== undefined) {
    safeInvite.note = redactInviteText(invite.note);
  }

  return safeInvite;
}

export function toSafeContactInviteView(invite: ContactInviteV1): SafeContactInviteView {
  const safeInvite = exportContactInvite(invite);
  const view: SafeContactInviteView = {
    version: safeInvite.version,
    displayName: safeInvite.displayName,
    publicContactId: safeInvite.publicContactId,
    createdAt: safeInvite.createdAt,
    trustWarnings: CONTACT_INVITE_TRUST_WARNINGS,
    privateKeyIncluded: false,
    privateDestinationIncluded: false,
    routerMetadataIncluded: false,
    contactGraphIncluded: false,
    identityProofClaimed: false
  };

  if (safeInvite.note !== undefined) {
    view.note = safeInvite.note;
  }

  return view;
}

export function stripUnsafeInviteFields(value: Record<string, unknown>): Record<string, unknown> {
  const safeValue: Record<string, unknown> = {};

  for (const field of INVITE_SAFE_FIELDS) {
    const entry = value[field];
    if (entry === undefined) {
      continue;
    }

    safeValue[field] = typeof entry === 'string' ? redactInviteText(entry) : entry;
  }

  return safeValue;
}
