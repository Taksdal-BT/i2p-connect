import type { MessageEnvelope } from '../messages/schema';
import { OutboxQueue } from '../messages/queue';

export interface SamStream {
  write(data: string): Promise<void> | void;
  waitForAck(messageId: string): Promise<boolean>;
  close(): Promise<void> | void;
}

export interface SamSession {
  openStream(destination: string): Promise<SamStream>;
}

export interface OutboxWorkerOptions {
  pollIntervalMs?: number;
  ackTimeoutMs?: number;
  now?: () => number;
  setIntervalFn?: typeof setInterval;
  clearIntervalFn?: typeof clearInterval;
  setTimeoutFn?: typeof setTimeout;
  clearTimeoutFn?: typeof clearTimeout;
}

const DEFAULT_POLL_INTERVAL_MS = 5000;
const DEFAULT_ACK_TIMEOUT_MS = 30000;

export class OutboxWorker {
  private timer: ReturnType<typeof setInterval> | undefined;
  private readonly inFlightMessageIds = new Set<string>();

  private readonly pollIntervalMs: number;
  private readonly ackTimeoutMs: number;
  private readonly setIntervalFn: typeof setInterval;
  private readonly clearIntervalFn: typeof clearInterval;
  private readonly setTimeoutFn: typeof setTimeout;
  private readonly clearTimeoutFn: typeof clearTimeout;

  constructor(
    private readonly queue: OutboxQueue,
    private readonly samSession: SamSession,
    options: OutboxWorkerOptions = {}
  ) {
    this.pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
    this.ackTimeoutMs = options.ackTimeoutMs ?? DEFAULT_ACK_TIMEOUT_MS;
    this.setIntervalFn = options.setIntervalFn ?? setInterval;
    this.clearIntervalFn = options.clearIntervalFn ?? clearInterval;
    this.setTimeoutFn = options.setTimeoutFn ?? setTimeout;
    this.clearTimeoutFn = options.clearTimeoutFn ?? clearTimeout;
  }

  start(): void {
    if (this.timer !== undefined) {
      return;
    }

    void this.pollQueuedMessages();

    this.timer = this.setIntervalFn(() => {
      void this.pollQueuedMessages();
    }, this.pollIntervalMs);
  }

  stop(): void {
    if (this.timer !== undefined) {
      this.clearIntervalFn(this.timer);
      this.timer = undefined;
    }
  }

  async processMessage(envelope: MessageEnvelope): Promise<void> {
    if (this.inFlightMessageIds.has(envelope.id)) {
      return;
    }

    this.inFlightMessageIds.add(envelope.id);

    try {
      this.queue.markSending(envelope.id);

      const stream = await this.samSession.openStream(envelope.recipientDestination);

      try {
        await stream.write(JSON.stringify(envelope));

        const acked = await this.waitForAckWithTimeout(stream, envelope.id);
        if (!acked) {
          throw new Error('ACK_TIMEOUT');
        }

        this.queue.processAck(envelope.id);
      } finally {
        await stream.close();
      }
    } catch {
      this.queue.failMessage(envelope.id, 'STREAM_FAILED');
    } finally {
      this.inFlightMessageIds.delete(envelope.id);
    }
  }

  private async pollQueuedMessages(): Promise<void> {
    for (const record of this.queue.list()) {
      if (record.status !== 'QUEUED') {
        continue;
      }

      void this.processMessage(record.envelope);
    }
  }

  private waitForAckWithTimeout(stream: SamStream, messageId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const timeoutId = this.setTimeoutFn(() => {
        reject(new Error('ACK_TIMEOUT'));
      }, this.ackTimeoutMs);

      void stream
        .waitForAck(messageId)
        .then((result) => {
          this.clearTimeoutFn(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          this.clearTimeoutFn(timeoutId);
          reject(error);
        });
    });
  }
}
