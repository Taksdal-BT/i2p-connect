import type { IdentityValidationIssue, IdentityValidationResult, LocalIdentity } from './types';

const MAX_DISPLAY_NAME_LENGTH = 80;
const LOCAL_PROFILE_ID_PATTERN = /^local_[a-z0-9_-]{8,64}$/;
const PUBLIC_CONTACT_ID_PATTERN = /^contact_[a-z0-9_-]{8,96}$/;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;

export function validateDisplayName(displayName: string): IdentityValidationIssue[] {
  const trimmed = displayName.trim();
  const issues: IdentityValidationIssue[] = [];

  if (trimmed.length === 0) {
    issues.push({
      field: 'displayName',
      code: 'display_name.required',
      message: 'Display name is required.'
    });
  }

  if (trimmed.length > MAX_DISPLAY_NAME_LENGTH) {
    issues.push({
      field: 'displayName',
      code: 'display_name.too_long',
      message: `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`
    });
  }

  if (CONTROL_CHARACTER_PATTERN.test(displayName)) {
    issues.push({
      field: 'displayName',
      code: 'display_name.control_character',
      message: 'Display name must not contain control characters.'
    });
  }

  return issues;
}

export function validateLocalProfileId(localProfileId: string): IdentityValidationIssue[] {
  if (!LOCAL_PROFILE_ID_PATTERN.test(localProfileId)) {
    return [
      {
        field: 'localProfileId',
        code: 'local_profile_id.invalid',
        message: 'Local profile id must be a local placeholder id.'
      }
    ];
  }

  return [];
}

export function validatePublicContactId(publicContactId: string): IdentityValidationIssue[] {
  if (!PUBLIC_CONTACT_ID_PATTERN.test(publicContactId)) {
    return [
      {
        field: 'publicContactId',
        code: 'public_contact_id.invalid',
        message: 'Public contact id must be a shareable placeholder id.'
      }
    ];
  }

  return [];
}

export function validateLocalIdentity(identity: LocalIdentity): IdentityValidationResult {
  const issues = [
    ...validateLocalProfileId(identity.localProfileId),
    ...validateDisplayName(identity.displayName),
    ...validatePublicContactId(identity.publicContactId)
  ];

  if (Number.isNaN(Date.parse(identity.createdAt))) {
    issues.push({
      field: 'createdAt',
      code: 'created_at.invalid',
      message: 'Created timestamp must be an ISO timestamp.'
    });
  }

  if (Number.isNaN(Date.parse(identity.updatedAt))) {
    issues.push({
      field: 'updatedAt',
      code: 'updated_at.invalid',
      message: 'Updated timestamp must be an ISO timestamp.'
    });
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
