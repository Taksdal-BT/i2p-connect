import { validatePublicContactId } from '../identity/identityValidation';
import { MESSAGE_STATUS_VALUES, type MessageValidationIssue, type MessageValidationResult, type PrivateMessage } from './types';

const MESSAGE_ID_PATTERN = /^msg_[a-z0-9_-]{8,80}$/;
const CONVERSATION_ID_PATTERN = /^conv_[a-z0-9_-]{8,80}$/;
const PLACEHOLDER_PATTERN = /^placeholder_[a-z0-9_-]{8,120}$/;

export function isMessageStatus(value: string): boolean {
  return MESSAGE_STATUS_VALUES.includes(value as (typeof MESSAGE_STATUS_VALUES)[number]);
}

export function validateMessageId(messageId: string): MessageValidationIssue[] {
  if (!MESSAGE_ID_PATTERN.test(messageId)) {
    return [
      {
        field: 'messageId',
        code: 'message_id.invalid',
        message: 'Message id must be a local placeholder id.'
      }
    ];
  }

  return [];
}

export function validateConversationId(conversationId: string): MessageValidationIssue[] {
  if (!CONVERSATION_ID_PATTERN.test(conversationId)) {
    return [
      {
        field: 'conversationId',
        code: 'conversation_id.invalid',
        message: 'Conversation id must be a local placeholder id.'
      }
    ];
  }

  return [];
}

export function validateEncryptedPayloadPlaceholder(value: string): MessageValidationIssue[] {
  if (!PLACEHOLDER_PATTERN.test(value)) {
    return [
      {
        field: 'encryptedPayloadPlaceholder',
        code: 'payload_placeholder.invalid',
        message: 'Payload placeholder must be a local placeholder id, not message contents.'
      }
    ];
  }

  return [];
}

function mapPublicContactIssue(field: 'senderPublicId' | 'recipientPublicId', codePrefix: string) {
  return (issue: { code: string; message: string }): MessageValidationIssue => ({
    field,
    code: `${codePrefix}.${issue.code}`,
    message: issue.message
  });
}

export function validatePrivateMessage(message: PrivateMessage): MessageValidationResult {
  const issues: MessageValidationIssue[] = [
    ...validateMessageId(message.messageId),
    ...validateConversationId(message.conversationId),
    ...validatePublicContactId(message.senderPublicId).map(mapPublicContactIssue('senderPublicId', 'sender')),
    ...validatePublicContactId(message.recipientPublicId).map(mapPublicContactIssue('recipientPublicId', 'recipient')),
    ...validateEncryptedPayloadPlaceholder(message.encryptedPayloadPlaceholder)
  ];

  if (message.senderPublicId === message.recipientPublicId) {
    issues.push({
      field: 'recipientPublicId',
      code: 'recipient.same_as_sender',
      message: 'Recipient must be different from sender.'
    });
  }

  if (!isMessageStatus(message.status)) {
    issues.push({
      field: 'status',
      code: 'status.invalid',
      message: 'Message status is not supported.'
    });
  }

  if (Number.isNaN(Date.parse(message.createdAt))) {
    issues.push({
      field: 'createdAt',
      code: 'created_at.invalid',
      message: 'Created timestamp must be an ISO timestamp.'
    });
  }

  if (Number.isNaN(Date.parse(message.updatedAt))) {
    issues.push({
      field: 'updatedAt',
      code: 'updated_at.invalid',
      message: 'Updated timestamp must be an ISO timestamp.'
    });
  }

  return {
    valid: issues.length === 0,
    issues
  };
}
