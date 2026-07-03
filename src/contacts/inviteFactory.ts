import { CONTACT_INVITE_VERSION, type ContactInviteFactoryOptions, type ContactInviteV1, type CreateContactInviteInput } from './types';
import { exportContactInvite } from './safeInviteView';
import { validateContactInvitePayload } from './inviteValidation';

export function createContactInvite(
  input: CreateContactInviteInput,
  options: ContactInviteFactoryOptions = {}
): ContactInviteV1 {
  const now = options.now?.() ?? new Date();
  const invite: ContactInviteV1 = {
    version: CONTACT_INVITE_VERSION,
    displayName: input.displayName.trim(),
    publicContactId: input.publicContactId,
    createdAt: now.toISOString()
  };

  if (input.note !== undefined) {
    invite.note = input.note.trim();
  }

  const safeInvite = exportContactInvite(invite);
  const validation = validateContactInvitePayload(safeInvite);
  if (!validation.valid) {
    throw new Error(`Invalid contact invite: ${validation.issues.map((issue) => issue.code).join(', ')}`);
  }

  return safeInvite;
}
