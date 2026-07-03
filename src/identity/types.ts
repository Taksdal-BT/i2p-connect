export interface LocalIdentity {
  localProfileId: string;
  displayName: string;
  publicContactId: string;
  createdAt: string;
  updatedAt: string;
  backupWarningAcknowledged: boolean;
}

export interface CreateLocalIdentityInput {
  displayName: string;
  publicContactId?: string;
  backupWarningAcknowledged?: boolean;
}

export interface LocalIdentityFactoryOptions {
  now?: () => Date;
  localProfileIdFactory?: () => string;
  publicContactIdFactory?: () => string;
}

export interface SafeLocalIdentityView {
  localProfileId: string;
  displayName: string;
  publicContactId: string;
  createdAt: string;
  updatedAt: string;
  backupWarningAcknowledged: boolean;
  privateKeyStored: false;
  cloudSynced: false;
  i2pIdentityCreated: false;
}

export interface IdentityValidationIssue {
  field: keyof LocalIdentity | 'input';
  code: string;
  message: string;
}

export interface IdentityValidationResult {
  valid: boolean;
  issues: IdentityValidationIssue[];
}
