export const MESSAGE_STATUS_VALUES = ['draft', 'queued', 'sent', 'received', 'failed'] as const;

export type MessageStatus = (typeof MESSAGE_STATUS_VALUES)[number];

export interface PrivateMessage {
  messageId: string;
  conversationId: string;
  senderPublicId: string;
  recipientPublicId: string;
  encryptedPayloadPlaceholder: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrivateMessageInput {
  conversationId: string;
  senderPublicId: string;
  recipientPublicId: string;
  encryptedPayloadPlaceholder: string;
}

export interface PrivateMessageFactoryOptions {
  now?: () => Date;
  messageIdFactory?: () => string;
}

export interface RedactedPrivateMessageView {
  messageId: string;
  conversationId: string;
  senderPublicId: string;
  recipientPublicId: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
  payloadRedacted: true;
  payloadEncryptedByThisModule: false;
  transportSent: false;
  deliveryConfirmed: false;
  fullE2eeClaimed: false;
}

export interface MessageValidationIssue {
  field: keyof PrivateMessage | 'transition';
  code: string;
  message: string;
}

export interface MessageValidationResult {
  valid: boolean;
  issues: MessageValidationIssue[];
}
