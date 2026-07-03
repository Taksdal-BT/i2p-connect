import { validateDisplayName, validateLocalIdentity, validatePublicContactId } from './identityValidation';
import type { CreateLocalIdentityInput, LocalIdentity, LocalIdentityFactoryOptions } from './types';

let generatedIdCounter = 0;

function nextPlaceholderId(prefix: 'local' | 'contact'): string {
  generatedIdCounter += 1;
  const counter = generatedIdCounter.toString(36).padStart(8, '0');
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${counter}`;
}

export function createLocalIdentity(
  input: CreateLocalIdentityInput,
  options: LocalIdentityFactoryOptions = {}
): LocalIdentity {
  const displayName = input.displayName.trim();
  const localProfileId = options.localProfileIdFactory?.() ?? nextPlaceholderId('local');
  const publicContactId = input.publicContactId ?? options.publicContactIdFactory?.() ?? nextPlaceholderId('contact');
  const now = options.now?.() ?? new Date();
  const timestamp = now.toISOString();

  const inputIssues = [
    ...validateDisplayName(displayName),
    ...validatePublicContactId(publicContactId)
  ];

  if (inputIssues.length > 0) {
    throw new Error(`Invalid identity input: ${inputIssues.map((issue) => issue.code).join(', ')}`);
  }

  const identity: LocalIdentity = {
    localProfileId,
    displayName,
    publicContactId,
    createdAt: timestamp,
    updatedAt: timestamp,
    backupWarningAcknowledged: input.backupWarningAcknowledged ?? false
  };

  const validation = validateLocalIdentity(identity);
  if (!validation.valid) {
    throw new Error(`Invalid local identity: ${validation.issues.map((issue) => issue.code).join(', ')}`);
  }

  return identity;
}
