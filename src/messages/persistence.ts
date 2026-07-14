import type { MessageStatus, PrivateMessage } from './types';

export interface LocalMessageStoreContract {
  save(message: PrivateMessage): PrivateMessage;
  getByMessageId(messageId: string): PrivateMessage | undefined;
  listByConversationId(conversationId: string): PrivateMessage[];
  updateStatus(messageId: string, nextStatus: MessageStatus, updatedAt: string): PrivateMessage;
  deleteByMessageId(messageId: string): boolean;
}

export function assertLocalMessageStoreContract(
  value: unknown
): asserts value is LocalMessageStoreContract {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Message store contract must be an object.');
  }

  const candidate = value as Record<string, unknown>;
  const requiredMethods = [
    'save',
    'getByMessageId',
    'listByConversationId',
    'updateStatus',
    'deleteByMessageId'
  ] as const;

  for (const method of requiredMethods) {
    if (typeof candidate[method] !== 'function') {
      throw new Error(`Message store contract is missing method: ${method}`);
    }
  }
}
