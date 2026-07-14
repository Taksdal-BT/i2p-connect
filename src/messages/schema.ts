export type MessageStatus = 'DRAFT' | 'QUEUED' | 'SENDING' | 'DELIVERED' | 'FAILED';

export interface MessageEnvelope {
  id: string;
  recipientDestination: string;
  payload: string;
  timestamp: number;
}

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BASE64_PATTERN = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export function isUuidV4(value: string): boolean {
  return UUID_V4_PATTERN.test(value);
}

export function isBase64Payload(value: string): boolean {
  return value.length > 0 && BASE64_PATTERN.test(value);
}

export function assertMessageEnvelope(value: unknown): asserts value is MessageEnvelope {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Message envelope must be an object.');
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.id !== 'string' || !isUuidV4(candidate.id)) {
    throw new Error('Message envelope id must be a UUIDv4 string.');
  }

  if (typeof candidate.recipientDestination !== 'string' || candidate.recipientDestination.length === 0) {
    throw new Error('Message envelope recipient destination is required.');
  }

  if (typeof candidate.payload !== 'string' || !isBase64Payload(candidate.payload)) {
    throw new Error('Message envelope payload must be a base64 string.');
  }

  if (typeof candidate.timestamp !== 'number' || !Number.isFinite(candidate.timestamp)) {
    throw new Error('Message envelope timestamp must be a finite number.');
  }
}
