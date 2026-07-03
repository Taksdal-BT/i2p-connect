import type { MessageStatus, MessageValidationIssue, PrivateMessage } from './types';
import { validatePrivateMessage } from './messageValidation';

const ALLOWED_TRANSITIONS: Record<MessageStatus, MessageStatus[]> = {
  draft: ['queued', 'failed'],
  queued: ['sent', 'failed'],
  sent: ['received', 'failed'],
  received: [],
  failed: []
};

export function canTransitionMessageStatus(from: MessageStatus, to: MessageStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function transitionMessageStatus(
  message: PrivateMessage,
  nextStatus: MessageStatus,
  now: () => Date = () => new Date()
): PrivateMessage {
  if (!canTransitionMessageStatus(message.status, nextStatus)) {
    const issue: MessageValidationIssue = {
      field: 'transition',
      code: 'transition.invalid',
      message: `Cannot transition message from ${message.status} to ${nextStatus}.`
    };
    throw new Error(`Invalid message transition: ${issue.code}`);
  }

  const updatedMessage: PrivateMessage = {
    ...message,
    status: nextStatus,
    updatedAt: now().toISOString()
  };

  const validation = validatePrivateMessage(updatedMessage);
  if (!validation.valid) {
    throw new Error(`Invalid private message: ${validation.issues.map((issue) => issue.code).join(', ')}`);
  }

  return updatedMessage;
}
