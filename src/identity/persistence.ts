import type { LocalIdentity } from './types';

export interface LocalIdentityPersistenceContract {
  save(identity: LocalIdentity): LocalIdentity;
  getByLocalProfileId(localProfileId: string): LocalIdentity | undefined;
  list(): LocalIdentity[];
  deleteByLocalProfileId(localProfileId: string): boolean;
}

export function assertLocalIdentityPersistenceContract(
  value: unknown
): asserts value is LocalIdentityPersistenceContract {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Identity persistence contract must be an object.');
  }

  const candidate = value as Record<string, unknown>;
  const requiredMethods = [
    'save',
    'getByLocalProfileId',
    'list',
    'deleteByLocalProfileId'
  ] as const;

  for (const method of requiredMethods) {
    if (typeof candidate[method] !== 'function') {
      throw new Error(`Identity persistence contract is missing method: ${method}`);
    }
  }
}