import { validatePrivateMessage } from './messageValidation';
import type { CreatePrivateMessageInput, PrivateMessage, PrivateMessageFactoryOptions } from './types';

let generatedMessageIdCounter = 0;

function nextMessageId(): string {
  generatedMessageIdCounter += 1;
  const counter = generatedMessageIdCounter.toString(36).padStart(8, '0');
  const timestamp = Date.now().toString(36);
  return `msg_${timestamp}_${counter}`;
}

export function createPrivateMessage(
  input: CreatePrivateMessageInput,
  options: PrivateMessageFactoryOptions = {}
): PrivateMessage {
  const now = options.now?.() ?? new Date();
  const timestamp = now.toISOString();
  const message: PrivateMessage = {
    messageId: options.messageIdFactory?.() ?? nextMessageId(),
    conversationId: input.conversationId,
    senderPublicId: input.senderPublicId,
    recipientPublicId: input.recipientPublicId,
    encryptedPayloadPlaceholder: input.encryptedPayloadPlaceholder,
    status: 'draft',
    createdAt: timestamp,
    updatedAt: timestamp
  };

  const validation = validatePrivateMessage(message);
  if (!validation.valid) {
    throw new Error(`Invalid private message: ${validation.issues.map((issue) => issue.code).join(', ')}`);
  }

  return message;
}
