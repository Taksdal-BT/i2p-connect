import { validateDisplayName, validatePublicContactId } from '../identity/identityValidation';
import {
  CONTACT_INVITE_VERSION,
  type ContactInviteV1,
  type ContactInviteParseResult,
  type ContactInviteValidationIssue,
  type ContactInviteValidationResult
} from './types';

const MAX_INVITE_NOTE_LENGTH = 240;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;
const ALLOWED_INVITE_FIELDS = new Set(['version', 'displayName', 'publicContactId', 'createdAt', 'note']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mapIdentityIssue(issue: { field: string; code: string; message: string }): ContactInviteValidationIssue {
  return {
    field: issue.field === 'displayName' || issue.field === 'publicContactId' ? issue.field : 'payload',
    code: issue.code,
    message: issue.message
  };
}

function validateNote(note: unknown): ContactInviteValidationIssue[] {
  if (note === undefined) {
    return [];
  }

  if (typeof note !== 'string') {
    return [
      {
        field: 'note',
        code: 'note.invalid_type',
        message: 'Invite note must be a string when present.'
      }
    ];
  }

  const issues: ContactInviteValidationIssue[] = [];
  if (note.length > MAX_INVITE_NOTE_LENGTH) {
    issues.push({
      field: 'note',
      code: 'note.too_long',
      message: `Invite note must be ${MAX_INVITE_NOTE_LENGTH} characters or fewer.`
    });
  }

  if (CONTROL_CHARACTER_PATTERN.test(note)) {
    issues.push({
      field: 'note',
      code: 'note.control_character',
      message: 'Invite note must not contain control characters.'
    });
  }

  return issues;
}

export function validateContactInvitePayload(value: unknown): ContactInviteValidationResult {
  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [
        {
          field: 'payload',
          code: 'payload.invalid',
          message: 'Invite payload must be an object.'
        }
      ]
    };
  }

  const issues: ContactInviteValidationIssue[] = [];
  const extraFields = Object.keys(value).filter((field) => !ALLOWED_INVITE_FIELDS.has(field));
  if (extraFields.length > 0) {
    issues.push({
      field: 'extraFields',
      code: 'payload.extra_fields',
      message: `Invite payload contains non-public fields: ${extraFields.join(', ')}.`
    });
  }

  if (value.version !== CONTACT_INVITE_VERSION) {
    issues.push({
      field: 'version',
      code: 'version.unsupported',
      message: 'Invite version is not supported.'
    });
  }

  if (typeof value.displayName !== 'string') {
    issues.push({
      field: 'displayName',
      code: 'display_name.invalid_type',
      message: 'Invite display name must be a string.'
    });
  } else {
    issues.push(...validateDisplayName(value.displayName).map(mapIdentityIssue));
  }

  if (typeof value.publicContactId !== 'string') {
    issues.push({
      field: 'publicContactId',
      code: 'public_contact_id.invalid_type',
      message: 'Invite public contact id must be a string.'
    });
  } else {
    issues.push(...validatePublicContactId(value.publicContactId).map(mapIdentityIssue));
  }

  if (typeof value.createdAt !== 'string' || Number.isNaN(Date.parse(value.createdAt))) {
    issues.push({
      field: 'createdAt',
      code: 'created_at.invalid',
      message: 'Invite created timestamp must be an ISO timestamp.'
    });
  }

  issues.push(...validateNote(value.note));

  return {
    valid: issues.length === 0,
    issues
  };
}

export function parseContactInvite(value: string | unknown): ContactInviteParseResult {
  let payload: unknown = value;

  if (typeof value === 'string') {
    try {
      payload = JSON.parse(value) as unknown;
    } catch {
      return {
        ok: false,
        issues: [
          {
            field: 'payload',
            code: 'payload.malformed_json',
            message: 'Invite payload is not valid JSON.'
          }
        ]
      };
    }
  }

  const validation = validateContactInvitePayload(payload);
  if (!validation.valid || !isRecord(payload)) {
    return {
      ok: false,
      issues: validation.issues
    };
  }

  const invite: ContactInviteV1 = {
    version: CONTACT_INVITE_VERSION,
    displayName: payload.displayName as string,
    publicContactId: payload.publicContactId as string,
    createdAt: payload.createdAt as string
  };

  if (typeof payload.note === 'string') {
    invite.note = payload.note;
  }

  return {
    ok: true,
    invite,
    issues: []
  };
}
