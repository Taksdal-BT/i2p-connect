import { createContactInvite } from '../../src/contacts/inviteFactory';
import { evaluateInviteVerificationDecision } from '../../src/contacts/inviteDecision';
import { parseContactInvite, validateContactInvitePayload } from '../../src/contacts/inviteValidation';
import {
  exportContactInvite,
  redactInviteText,
  stripUnsafeInviteFields,
  toSafeContactInviteView
} from '../../src/contacts/safeInviteView';
import { CONTACT_INVITE_TRUST_WARNINGS } from '../../src/contacts/types';

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

const fixedDate = new Date('2026-07-03T08:00:00.000Z');
const invite = createContactInvite(
  {
    displayName: '  Jarle  ',
    publicContactId: 'contact_publicid01',
    note: 'Workshop contact'
  },
  {
    now: () => fixedDate
  }
);

assertEqual(invite.version, 1, 'invite should use v1');
assertEqual(invite.displayName, 'Jarle', 'invite should trim display name');
assertEqual(invite.publicContactId, 'contact_publicid01', 'invite should include public contact id');
assertEqual(invite.createdAt, fixedDate.toISOString(), 'invite should include created timestamp');
assertEqual(invite.note, 'Workshop contact', 'invite should include safe note');

const validation = validateContactInvitePayload(invite);
assert(validation.valid, 'valid invite should validate');
assertEqual(validation.issues.length, 0, 'valid invite should have no issues');

const parsed = parseContactInvite(JSON.stringify(invite));
assert(parsed.ok, 'valid JSON invite should parse');
if (parsed.ok) {
  assertEqual(parsed.invite.publicContactId, invite.publicContactId, 'parsed invite should preserve public contact id');
}

const malformed = parseContactInvite('{not json');
assert(!malformed.ok, 'malformed JSON should fail');
if (!malformed.ok) {
  assertEqual(malformed.issues[0]?.code, 'payload.malformed_json', 'malformed JSON should report parse issue');
}

const unknownVersion = parseContactInvite({
  ...invite,
  version: 2
});
assert(!unknownVersion.ok, 'unknown invite version should fail');
if (!unknownVersion.ok) {
  assert(
    unknownVersion.issues.some((issue) => issue.code === 'version.unsupported'),
    'unknown version should report unsupported version'
  );
}

assertThrows(
  () => createContactInvite({ displayName: '', publicContactId: 'contact_publicid01' }),
  'empty display name should throw'
);

assertThrows(
  () => createContactInvite({ displayName: 'Jarle', publicContactId: 'bad-destination.b32.i2p' }),
  'invalid public contact id should throw'
);

const unsafeExtraFields = validateContactInvitePayload({
  ...invite,
  privateKey: 'abc123',
  privateDestination: 'destination',
  contactGraph: ['contact_publicid02']
});
assert(!unsafeExtraFields.valid, 'extra unsafe fields should fail validation');
assert(
  unsafeExtraFields.issues.some((issue) => issue.code === 'payload.extra_fields'),
  'extra unsafe fields should report extra_fields'
);

const stripped = stripUnsafeInviteFields({
  ...invite,
  privateKey: 'abc123',
  privateDestination: 'destination',
  routerMetadata: 'router',
  note: 'token=secret-value'
});

assert(!('privateKey' in stripped), 'safe invite object should strip privateKey');
assert(!('privateDestination' in stripped), 'safe invite object should strip privateDestination');
assert(!('routerMetadata' in stripped), 'safe invite object should strip routerMetadata');
assertEqual(stripped.note, 'token=[REDACTED]', 'safe invite object should redact note');

const exported = exportContactInvite({
  ...invite,
  displayName: 'Jarle private key: abc123',
  note: 'router credentials: hunter2'
});
assert(!exported.displayName.includes('abc123'), 'safe export should redact display name secret values');
assert(!exported.displayName.includes('private key'), 'safe export should redact sensitive display labels');
assert(!exported.note?.includes('hunter2'), 'safe export should redact note secret values');
assert(!exported.note?.includes('router credentials'), 'safe export should redact sensitive note labels');

const redacted = redactInviteText('private destination: abc123');
assert(!redacted.includes('abc123'), 'invite text redaction should remove sensitive values');
assert(!redacted.includes('private destination'), 'invite text redaction should remove sensitive labels');

const safeView = toSafeContactInviteView(invite);
assertEqual(safeView.privateKeyIncluded, false, 'safe view should state no private key is included');
assertEqual(safeView.privateDestinationIncluded, false, 'safe view should state no private destination is included');
assertEqual(safeView.routerMetadataIncluded, false, 'safe view should state no router metadata is included');
assertEqual(safeView.contactGraphIncluded, false, 'safe view should state no contact graph is included');
assertEqual(safeView.identityProofClaimed, false, 'safe view should not claim real-world identity proof');
assert(
  safeView.trustWarnings.includes(CONTACT_INVITE_TRUST_WARNINGS[0]),
  'safe view should include trust warning'
);
assert(
  safeView.trustWarnings.includes(CONTACT_INVITE_TRUST_WARNINGS[1]),
  'safe view should include real-world identity warning'
);

const verificationRequiresAck = evaluateInviteVerificationDecision();
assertEqual(verificationRequiresAck.allowed, false, 'verification should block without acknowledgements');
assertEqual(
  verificationRequiresAck.code,
  'verification_ack_required',
  'verification should require acknowledgements when none are supplied'
);
assertEqual(
  verificationRequiresAck.missingWarnings.length,
  CONTACT_INVITE_TRUST_WARNINGS.length,
  'verification should mark all warnings missing with no acknowledgements'
);

const verificationMissingAck = evaluateInviteVerificationDecision({
  acknowledgedWarnings: [CONTACT_INVITE_TRUST_WARNINGS[0]]
});
assertEqual(verificationMissingAck.allowed, false, 'verification should block when acknowledgements are partial');
assertEqual(
  verificationMissingAck.code,
  'verification_missing_ack',
  'verification should flag missing acknowledgements for partial acknowledgement'
);
assertEqual(
  verificationMissingAck.missingWarnings.length,
  1,
  'verification should report a single missing warning with one acknowledgement'
);

const verificationReady = evaluateInviteVerificationDecision({
  acknowledgedWarnings: CONTACT_INVITE_TRUST_WARNINGS
});
assertEqual(verificationReady.allowed, true, 'verification should allow when all warnings are acknowledged');
assertEqual(verificationReady.code, 'verification_ready', 'verification should report ready with full acknowledgement');
assertEqual(verificationReady.missingWarnings.length, 0, 'verification should have no missing warnings when ready');
