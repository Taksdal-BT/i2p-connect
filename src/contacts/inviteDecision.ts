import {
  CONTACT_INVITE_TRUST_WARNINGS,
  type InviteVerificationDecision,
  type InviteVerificationDecisionInput
} from './types';

function normalizeAcknowledgements(value: readonly string[] | undefined): Set<string> {
  if (value === undefined) {
    return new Set<string>();
  }

  return new Set(value.map((entry) => entry.trim()));
}

export function evaluateInviteVerificationDecision(
  input: InviteVerificationDecisionInput = {}
): InviteVerificationDecision {
  const acknowledgedSet = normalizeAcknowledgements(input.acknowledgedWarnings);
  const acknowledgedWarnings = CONTACT_INVITE_TRUST_WARNINGS.filter((warning) =>
    acknowledgedSet.has(warning)
  );
  const missingWarnings = CONTACT_INVITE_TRUST_WARNINGS.filter(
    (warning) => !acknowledgedSet.has(warning)
  );

  if (acknowledgedWarnings.length === 0) {
    return {
      allowed: false,
      code: 'verification_ack_required',
      missingWarnings,
      acknowledgedWarnings,
      message: 'Invite verification requires acknowledging trust warnings before continuing.'
    };
  }

  if (missingWarnings.length > 0) {
    return {
      allowed: false,
      code: 'verification_missing_ack',
      missingWarnings,
      acknowledgedWarnings,
      message: 'Invite verification is blocked until all trust warnings are acknowledged.'
    };
  }

  return {
    allowed: true,
    code: 'verification_ready',
    missingWarnings,
    acknowledgedWarnings,
    message: 'Invite verification is ready to continue with acknowledged trust warnings.'
  };
}
