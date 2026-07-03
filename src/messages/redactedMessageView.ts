import { redactDiagnosticText } from '../status/diagnostics';
import type { PrivateMessage, RedactedPrivateMessageView } from './types';

const MESSAGE_SECRET_FIELDS = new Set([
  'encryptedPayloadPlaceholder',
  'plaintext',
  'body',
  'messageBody',
  'privateKey',
  'privateDestination',
  'routerCredentials',
  'rawRouterLogs',
  'serviceRoleKey',
  'apiKey',
  'token',
  'secret'
]);

export function redactMessageLogText(value: string): string {
  return redactDiagnosticText(value);
}

export function toRedactedPrivateMessageView(message: PrivateMessage): RedactedPrivateMessageView {
  return {
    messageId: message.messageId,
    conversationId: message.conversationId,
    senderPublicId: message.senderPublicId,
    recipientPublicId: message.recipientPublicId,
    status: message.status,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    payloadRedacted: true,
    payloadEncryptedByThisModule: false,
    transportSent: false,
    deliveryConfirmed: false,
    fullE2eeClaimed: false
  };
}

export function stripMessageSecrets(value: Record<string, unknown>): Record<string, unknown> {
  const safeValue: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    if (MESSAGE_SECRET_FIELDS.has(key)) {
      continue;
    }

    safeValue[key] = typeof entry === 'string' ? redactMessageLogText(entry) : entry;
  }

  return safeValue;
}
