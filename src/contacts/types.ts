export const CONTACT_INVITE_VERSION = 1;

export const CONTACT_INVITE_TRUST_WARNINGS = [
  'Only add contacts you trust.',
  'An invite does not prove real-world identity.'
] as const;

export interface ContactInviteV1 {
  version: typeof CONTACT_INVITE_VERSION;
  displayName: string;
  publicContactId: string;
  createdAt: string;
  note?: string;
}

export interface CreateContactInviteInput {
  displayName: string;
  publicContactId: string;
  note?: string;
}

export interface ContactInviteFactoryOptions {
  now?: () => Date;
}

export interface SafeContactInviteView {
  version: typeof CONTACT_INVITE_VERSION;
  displayName: string;
  publicContactId: string;
  createdAt: string;
  note?: string;
  trustWarnings: readonly string[];
  privateKeyIncluded: false;
  privateDestinationIncluded: false;
  routerMetadataIncluded: false;
  contactGraphIncluded: false;
  identityProofClaimed: false;
}

export interface ContactInviteValidationIssue {
  field: keyof ContactInviteV1 | 'payload' | 'extraFields';
  code: string;
  message: string;
}

export interface ContactInviteValidationResult {
  valid: boolean;
  issues: ContactInviteValidationIssue[];
}

export type ContactInviteParseResult =
  | {
      ok: true;
      invite: ContactInviteV1;
      issues: [];
    }
  | {
      ok: false;
      issues: ContactInviteValidationIssue[];
    };

export type InviteVerificationDecisionCode =
  | 'verification_ready'
  | 'verification_ack_required'
  | 'verification_missing_ack';

export interface InviteVerificationDecision {
  allowed: boolean;
  code: InviteVerificationDecisionCode;
  missingWarnings: readonly string[];
  acknowledgedWarnings: readonly string[];
  message: string;
}

export interface InviteVerificationDecisionInput {
  acknowledgedWarnings?: readonly string[];
}
