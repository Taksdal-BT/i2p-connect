import { OutboxQueue, type QueueFsAdapter } from '../../src/messages/queue';
import type { MessageEnvelope } from '../../src/messages/schema';
import { OutboxWorker, type SamSession, type SamStream } from '../../src/transport/worker';

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForCondition(
  condition: () => boolean,
  timeoutMs: number,
  intervalMs: number,
  failureMessage: string
): Promise<void> {
  const started = Date.now();

  while (Date.now() - started <= timeoutMs) {
    if (condition()) {
      return;
    }

    await sleep(intervalMs);
  }

  throw new Error(failureMessage);
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

class Deferred<T> {
  readonly promise: Promise<T>;

  private resolvePromise!: (value: T) => void;

  constructor() {
    this.promise = new Promise<T>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  resolve(value: T): void {
    this.resolvePromise(value);
  }
}

class MockSamStream implements SamStream {
  writes: string[] = [];
  closeCalls = 0;

  constructor(
    private readonly ackPromise: Promise<boolean>,
    private readonly failOnWrite = false
  ) {}

  async write(data: string): Promise<void> {
    if (this.failOnWrite) {
      throw new Error('connection refused');
    }

    this.writes.push(data);
  }

  async waitForAck(messageId: string): Promise<boolean> {
    void messageId;
    return this.ackPromise;
  }

  async close(): Promise<void> {
    this.closeCalls += 1;
  }
}

class MockSamSession implements SamSession {
  openCalls = 0;

  constructor(
    private readonly streamFactory: () => SamStream,
    private readonly failOnOpen = false
  ) {}

  async openStream(destination: string): Promise<SamStream> {
    void destination;
    this.openCalls += 1;

    if (this.failOnOpen) {
      throw new Error('router refused connection');
    }

    return this.streamFactory();
  }
}

function createEnvelope(id: string): MessageEnvelope {
  return {
    id,
    recipientDestination: 'b32destinationexample.b32.i2p',
    payload: 'aGVsbG8=',
    timestamp: Date.now()
  };
}

const fsAdapter = new InMemoryFsAdapter();

async function main(): Promise<void> {
  const sendingQueue = new OutboxQueue(fsAdapter, 'worker-sending.json');
  const sendingEnvelope = createEnvelope('223e4567-e89b-42d3-a456-426614174000');
  sendingQueue.enqueue(sendingEnvelope);
  const pendingAck = new Deferred<boolean>();
  const sendingStream = new MockSamStream(pendingAck.promise);
  const sendingWorker = new OutboxWorker(
    sendingQueue,
    new MockSamSession(() => sendingStream),
    { pollIntervalMs: 2000, ackTimeoutMs: 1000 }
  );

  sendingWorker.start();

  await waitForCondition(
    () => sendingQueue.getById(sendingEnvelope.id)?.status === 'SENDING',
    500,
    10,
    'worker should pick queued message and mark as SENDING'
  );

  pendingAck.resolve(true);

  await waitForCondition(
    () => sendingQueue.getById(sendingEnvelope.id)?.status === 'DELIVERED',
    500,
    10,
    'message should eventually be delivered in sending test'
  );

  sendingWorker.stop();

  const successQueue = new OutboxQueue(fsAdapter, 'worker-success.json');
  const successEnvelope = createEnvelope('323e4567-e89b-42d3-a456-426614174000');
  successQueue.enqueue(successEnvelope);
  const successStream = new MockSamStream(Promise.resolve(true));
  const successWorker = new OutboxWorker(
    successQueue,
    new MockSamSession(() => successStream),
    { ackTimeoutMs: 100 }
  );

  await successWorker.processMessage(successEnvelope);

  assertEqual(
    successQueue.getById(successEnvelope.id)?.status,
    'DELIVERED',
    'successful stream and ACK should set DELIVERED'
  );
  assertEqual(successStream.closeCalls, 1, 'successful send should close stream exactly once');

  const failureQueue = new OutboxQueue(fsAdapter, 'worker-failure.json');
  const failureEnvelope = createEnvelope('423e4567-e89b-42d3-a456-426614174000');
  failureQueue.enqueue(failureEnvelope);
  const failureWorker = new OutboxWorker(
    failureQueue,
    new MockSamSession(() => new MockSamStream(Promise.resolve(true)), true),
    { ackTimeoutMs: 100 }
  );

  await failureWorker.processMessage(failureEnvelope);

  assertEqual(
    failureQueue.getById(failureEnvelope.id)?.status,
    'FAILED',
    'stream open failure should set FAILED'
  );
  assertEqual(
    failureQueue.getById(failureEnvelope.id)?.reason,
    'STREAM_FAILED',
    'stream open failure should set safe failure reason'
  );

  const timeoutQueue = new OutboxQueue(fsAdapter, 'worker-timeout.json');
  const timeoutEnvelope = createEnvelope('523e4567-e89b-42d3-a456-426614174000');
  timeoutQueue.enqueue(timeoutEnvelope);
  const neverAckStream = new MockSamStream(new Promise<boolean>(() => {}));
  const timeoutWorker = new OutboxWorker(
    timeoutQueue,
    new MockSamSession(() => neverAckStream),
    { ackTimeoutMs: 20 }
  );

  await timeoutWorker.processMessage(timeoutEnvelope);

  assertEqual(
    timeoutQueue.getById(timeoutEnvelope.id)?.status,
    'FAILED',
    'ack timeout should set FAILED'
  );
  assertEqual(
    timeoutQueue.getById(timeoutEnvelope.id)?.reason,
    'STREAM_FAILED',
    'ack timeout should use safe stream failure reason'
  );
  assert(neverAckStream.closeCalls >= 1, 'timeout path should close stream');
}

void main();
