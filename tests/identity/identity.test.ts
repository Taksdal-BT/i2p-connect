import { createLocalIdentity } from '../../src/identity/identityFactory';
import {
  validateDisplayName,
  validateLocalIdentity,
  validatePublicContactId
} from '../../src/identity/identityValidation';
import {
  redactIdentityText,
  stripIdentitySecrets,
  toSafeLocalIdentityView
} from '../../src/identity/safeIdentityView';

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertThrows(action: () => void, message: string): void {
  try {
    action();
  } catch {
    return;
  }

  throw new Error(message);
}

const fixedDate = new Date('2026-07-03T07:00:00.000Z');
const identity = createLocalIdentity(
  {
    displayName: '  Jarle  ',
    publicContactId: 'contact_publicid01',
    backupWarningAcknowledged: true
  },
  {
    now: () => fixedDate,
    localProfileIdFactory: () => 'local_profile01'
  }
);

assertEqual(identity.localProfileId, 'local_profile01', 'identity should use supplied local profile id');
assertEqual(identity.displayName, 'Jarle', 'identity should trim display name');
assertEqual(identity.publicContactId, 'contact_publicid01', 'identity should use supplied contact id');
assertEqual(identity.createdAt, fixedDate.toISOString(), 'identity should use supplied created timestamp');
assertEqual(identity.updatedAt, fixedDate.toISOString(), 'identity should use supplied updated timestamp');
assertEqual(identity.backupWarningAcknowledged, true, 'identity should store backup warning state');

const validation = validateLocalIdentity(identity);
assert(validation.valid, 'created identity should validate');
assertEqual(validation.issues.length, 0, 'created identity should not have validation issues');

assertThrows(
  () => createLocalIdentity({ displayName: '', publicContactId: 'contact_publicid01' }),
  'empty display name should throw'
);

assertThrows(
  () => createLocalIdentity({ displayName: 'Jarle', publicContactId: 'bad-destination.b32.i2p' }),
  'invalid public contact id should throw'
);

assert(validateDisplayName('A'.repeat(81)).length > 0, 'long display name should be invalid');
assert(validatePublicContactId('contact_publicid01').length === 0, 'placeholder contact id should validate');
assert(validatePublicContactId('private-destination').length > 0, 'private-looking contact id should fail');

const safeView = toSafeLocalIdentityView({
  ...identity,
  displayName: 'Jarle private key: abc123'
});

assertEqual(safeView.localProfileId, identity.localProfileId, 'safe view should include local profile id');
assertEqual(safeView.publicContactId, identity.publicContactId, 'safe view should include public contact id');
assert(!safeView.displayName.includes('abc123'), 'safe view should redact secret-shaped display text');
assertEqual(safeView.privateKeyStored, false, 'safe view should state no private key is stored');
assertEqual(safeView.cloudSynced, false, 'safe view should state no cloud sync happened');
assertEqual(safeView.i2pIdentityCreated, false, 'safe view should not claim a real I2P identity exists');

const stripped = stripIdentitySecrets({
  localProfileId: 'local_profile01',
  privateKey: 'abc123',
  privateDestination: 'destination',
  routerCredentials: 'creds',
  displayName: 'Jarle token=secret-value'
});

assertEqual(stripped.localProfileId, 'local_profile01', 'safe object should preserve non-secret fields');
assert(!('privateKey' in stripped), 'safe object should strip privateKey');
assert(!('privateDestination' in stripped), 'safe object should strip privateDestination');
assert(!('routerCredentials' in stripped), 'safe object should strip routerCredentials');
assertEqual(stripped.displayName, 'Jarle token=[REDACTED]', 'safe object should redact secret text');

const redacted = redactIdentityText('service role key: abc123');
assert(!redacted.includes('abc123'), 'identity redaction should remove service role key values');
