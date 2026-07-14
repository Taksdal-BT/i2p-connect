import { OutboxQueue, type QueueFsAdapter } from '../../src/messages/queue';
import type { MessageEnvelope } from '../../src/messages/schema';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}. Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}.`);
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

class InMemoryFsAdapter implements QueueFsAdapter {
  private readonly files = new Map<string, string>();

  readFileSync(path: string, encoding: 'utf-8'): string {
    void encoding;

    const value = this.files.get(path);
    if (value === undefined) {
      const missing = new Error('File not found.') as Error & { code: string };
      missing.code = 'ENOENT';
      throw missing;
    }

    return value;
  }

  writeFileSync(path: string, data: string, encoding: 'utf-8'): void {
    void encoding;
    this.files.set(path, data);
  }
}

function createEnvelope(id: string): MessageEnvelope {
  return {
    id,
    recipientDestination: 'b32destinationexample.b32.i2p',
    payload: 'aGVsbG8=',
    timestamp: 1751986800000
  };
}

const persistencePath = 'queue-state.json';
const fsAdapter = new InMemoryFsAdapter();

const queue = new OutboxQueue(fsAdapter, persistencePath);
const envelopeA = createEnvelope('123e4567-e89b-42d3-a456-426614174000');

const queued = queue.enqueue(envelopeA);
assertEqual(queued.status, 'QUEUED', 'enqueue should move envelope to QUEUED');

const sending = queue.markSending(envelopeA.id);
assertEqual(sending.status, 'SENDING', 'markSending should move QUEUED message to SENDING');

const delivered = queue.processAck(envelopeA.id);
assertEqual(delivered.status, 'DELIVERED', 'processAck should move SENDING message to DELIVERED');

assertThrows(
  () => queue.processAck('123e4567-e89b-42d3-a456-426614174999'),
  'processing ACK for unknown id should throw safe error'
);

const queueForPersistence = new OutboxQueue(fsAdapter, persistencePath);
const envelopeQueued = createEnvelope('123e4567-e89b-42d3-a456-426614174001');
const envelopeFailed = createEnvelope('123e4567-e89b-42d3-a456-426614174002');
const envelopeSending = createEnvelope('123e4567-e89b-42d3-a456-426614174003');

queueForPersistence.enqueue(envelopeQueued);
queueForPersistence.enqueue(envelopeFailed);
queueForPersistence.failMessage(envelopeFailed.id, 'transport timeout');
queueForPersistence.enqueue(envelopeSending);
queueForPersistence.markSending(envelopeSending.id);
queueForPersistence.saveToDisk();

const recoveredQueue = new OutboxQueue(fsAdapter, persistencePath);
recoveredQueue.loadFromDisk();

const recoveredQueued = recoveredQueue.getById(envelopeQueued.id);
assert(recoveredQueued !== undefined, 'queued record should be restored from disk');
assertEqual(recoveredQueued?.status, 'QUEUED', 'queued record should remain QUEUED after restore');

const recoveredFailed = recoveredQueue.getById(envelopeFailed.id);
assert(recoveredFailed !== undefined, 'failed record should be restored from disk');
assertEqual(recoveredFailed?.status, 'FAILED', 'failed record should remain FAILED after restore');
assertEqual(recoveredFailed?.reason, 'transport timeout', 'failed record should preserve failure reason');

const recoveredSending = recoveredQueue.getById(envelopeSending.id);
assert(recoveredSending !== undefined, 'sending record should be restored from disk');
assertEqual(
  recoveredSending?.status,
  'QUEUED',
  'sending record should revert to QUEUED during crash recovery'
);
