import { createPrivateMessage } from '../../src/messages/messageFactory';
import { validatePrivateMessage } from '../../src/messages/messageValidation';
import { canTransitionMessageStatus, transitionMessageStatus } from '../../src/messages/messageTransitions';
import {
  redactMessageLogText,
  stripMessageSecrets,
  toRedactedPrivateMessageView
} from '../../src/messages/redactedMessageView';

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

const createdAt = new Date('2026-07-03T09:00:00.000Z');
const message = createPrivateMessage(
  {
    conversationId: 'conv_private01',
    senderPublicId: 'contact_sender01',
    recipientPublicId: 'contact_recipient01',
    encryptedPayloadPlaceholder: 'placeholder_payload01'
  },
  {
    now: () => createdAt,
    messageIdFactory: () => 'msg_private01'
  }
);

assertEqual(message.messageId, 'msg_private01', 'message should use supplied message id');
assertEqual(message.conversationId, 'conv_private01', 'message should use supplied conversation id');
assertEqual(message.senderPublicId, 'contact_sender01', 'message should include sender public id');
assertEqual(message.recipientPublicId, 'contact_recipient01', 'message should include recipient public id');
assertEqual(message.status, 'draft', 'new message should start as draft');
assertEqual(message.createdAt, createdAt.toISOString(), 'message should include created timestamp');
assertEqual(message.updatedAt, createdAt.toISOString(), 'message should include updated timestamp');

const validation = validatePrivateMessage(message);
assert(validation.valid, 'created message should validate');
assertEqual(validation.issues.length, 0, 'created message should have no validation issues');

assertThrows(
  () =>
    createPrivateMessage({
      conversationId: 'conv_private01',
      senderPublicId: 'contact_sender01',
      recipientPublicId: 'bad-recipient',
      encryptedPayloadPlaceholder: 'placeholder_payload01'
    }),
  'invalid recipient should throw'
);

assertThrows(
  () =>
    createPrivateMessage({
      conversationId: 'conv_private01',
      senderPublicId: 'contact_sender01',
      recipientPublicId: 'contact_sender01',
      encryptedPayloadPlaceholder: 'placeholder_payload01'
    }),
  'recipient matching sender should throw'
);

assertThrows(
  () =>
    createPrivateMessage({
      conversationId: 'conv_private01',
      senderPublicId: 'contact_sender01',
      recipientPublicId: 'contact_recipient01',
      encryptedPayloadPlaceholder: 'hello plaintext'
    }),
  'plaintext payload placeholder should throw'
);

assert(canTransitionMessageStatus('draft', 'queued'), 'draft should transition to queued');
assert(canTransitionMessageStatus('queued', 'sent'), 'queued should transition to sent');
assert(canTransitionMessageStatus('sent', 'received'), 'sent should transition to received');
assert(!canTransitionMessageStatus('draft', 'sent'), 'draft should not transition directly to sent');
assert(!canTransitionMessageStatus('received', 'queued'), 'received should not transition back to queued');

const queued = transitionMessageStatus(message, 'queued', () => new Date('2026-07-03T09:01:00.000Z'));
assertEqual(queued.status, 'queued', 'message should transition to queued');
assertEqual(queued.updatedAt, '2026-07-03T09:01:00.000Z', 'transition should update timestamp');

const sent = transitionMessageStatus(queued, 'sent', () => new Date('2026-07-03T09:02:00.000Z'));
assertEqual(sent.status, 'sent', 'message should transition to sent local state');

const received = transitionMessageStatus(sent, 'received', () => new Date('2026-07-03T09:03:00.000Z'));
assertEqual(received.status, 'received', 'message should transition to received local state');

assertThrows(
  () => transitionMessageStatus(message, 'received', () => new Date('2026-07-03T09:04:00.000Z')),
  'invalid transition should throw'
);

const redactedView = toRedactedPrivateMessageView(message);
assertEqual(redactedView.payloadRedacted, true, 'redacted view should mark payload as redacted');
assertEqual(redactedView.payloadEncryptedByThisModule, false, 'redacted view should not claim encryption');
assertEqual(redactedView.transportSent, false, 'redacted view should not claim transport send');
assertEqual(redactedView.deliveryConfirmed, false, 'redacted view should not claim delivery');
assertEqual(redactedView.fullE2eeClaimed, false, 'redacted view should not claim full E2EE');
assert(!('encryptedPayloadPlaceholder' in redactedView), 'redacted view should not expose payload placeholder');

const stripped = stripMessageSecrets({
  messageId: 'msg_private01',
  encryptedPayloadPlaceholder: 'placeholder_payload01',
  plaintext: 'hello',
  messageBody: 'secret body',
  privateKey: 'abc123',
  display: 'token=secret-value'
});

assertEqual(stripped.messageId, 'msg_private01', 'safe log object should keep message id');
assert(!('encryptedPayloadPlaceholder' in stripped), 'safe log object should strip payload placeholder');
assert(!('plaintext' in stripped), 'safe log object should strip plaintext');
assert(!('messageBody' in stripped), 'safe log object should strip message body');
assert(!('privateKey' in stripped), 'safe log object should strip private key');
assertEqual(stripped.display, 'token=[REDACTED]', 'safe log object should redact secret-shaped values');

const redactedLog = redactMessageLogText('private destination: abc123 token=secret-value');
assert(!redactedLog.includes('abc123'), 'message log redaction should remove private destination value');
assert(!redactedLog.includes('secret-value'), 'message log redaction should remove token value');
