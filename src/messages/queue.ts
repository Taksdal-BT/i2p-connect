import { assertMessageEnvelope, type MessageEnvelope, type MessageStatus } from './schema';

export interface QueueRecord {
  envelope: MessageEnvelope;
  status: MessageStatus;
  reason?: string;
  updatedAt: number;
}

interface StoredQueueState {
  version: 1;
  records: QueueRecord[];
}

export interface QueueFsAdapter {
  readFileSync(path: string, encoding: 'utf-8'): string;
  writeFileSync(path: string, data: string, encoding: 'utf-8'): void;
}

function isSafeReason(reason: string): boolean {
  return reason.trim().length > 0 && reason.length <= 280;
}

function createSafeMissingMessageError(): Error {
  return new Error('Message queue item was not found.');
}

export class OutboxQueue {
  private readonly records = new Map<string, QueueRecord>();

  constructor(
    private readonly fsAdapter: QueueFsAdapter,
    private readonly storagePath: string
  ) {}

  enqueue(envelope: MessageEnvelope): QueueRecord {
    assertMessageEnvelope(envelope);

    const record: QueueRecord = {
      envelope,
      status: 'QUEUED',
      updatedAt: Date.now()
    };

    this.records.set(envelope.id, record);
    return record;
  }

  markSending(id: string): QueueRecord {
    return this.transition(id, ['QUEUED'], 'SENDING');
  }

  processAck(id: string): QueueRecord {
    return this.transition(id, ['QUEUED', 'SENDING'], 'DELIVERED');
  }

  failMessage(id: string, reason: string): QueueRecord {
    const record = this.records.get(id);
    if (record === undefined) {
      throw createSafeMissingMessageError();
    }

    if (!isSafeReason(reason)) {
      throw new Error('Message failure reason must be non-empty and short.');
    }

    const next: QueueRecord = {
      ...record,
      status: 'FAILED',
      reason,
      updatedAt: Date.now()
    };

    this.records.set(id, next);
    return next;
  }

  getById(id: string): QueueRecord | undefined {
    return this.records.get(id);
  }

  list(): QueueRecord[] {
    return Array.from(this.records.values());
  }

  saveToDisk(): void {
    const state: StoredQueueState = {
      version: 1,
      records: this.list()
    };

    this.fsAdapter.writeFileSync(this.storagePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  loadFromDisk(): void {
    let raw = '';

    try {
      raw = this.fsAdapter.readFileSync(this.storagePath, 'utf-8');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
        return;
      }

      throw new Error('Unable to read message queue persistence data.');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('Unable to parse message queue persistence data.');
    }

    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error('Queue persistence data must be an object.');
    }

    const candidate = parsed as Record<string, unknown>;
    if (candidate.version !== 1 || !Array.isArray(candidate.records)) {
      throw new Error('Queue persistence data has an unsupported format.');
    }

    const nextRecords = new Map<string, QueueRecord>();

    for (const value of candidate.records) {
      if (typeof value !== 'object' || value === null) {
        throw new Error('Queue persistence contains an invalid record.');
      }

      const record = value as Partial<QueueRecord>;
      assertMessageEnvelope(record.envelope);

      if (
        record.status !== 'DRAFT' &&
        record.status !== 'QUEUED' &&
        record.status !== 'SENDING' &&
        record.status !== 'DELIVERED' &&
        record.status !== 'FAILED'
      ) {
        throw new Error('Queue persistence contains an invalid message status.');
      }

      if (typeof record.updatedAt !== 'number' || !Number.isFinite(record.updatedAt)) {
        throw new Error('Queue persistence contains an invalid update timestamp.');
      }

      if (record.reason !== undefined && typeof record.reason !== 'string') {
        throw new Error('Queue persistence contains an invalid failure reason.');
      }

      const recoveredStatus: MessageStatus = record.status === 'SENDING' ? 'QUEUED' : record.status;

      const recovered: QueueRecord = {
        envelope: record.envelope,
        status: recoveredStatus,
        updatedAt: record.updatedAt,
        ...(record.reason !== undefined ? { reason: record.reason } : {})
      };

      nextRecords.set(record.envelope.id, recovered);
    }

    this.records.clear();
    for (const [id, record] of nextRecords) {
      this.records.set(id, record);
    }
  }

  private transition(id: string, allowedFrom: MessageStatus[], nextStatus: MessageStatus): QueueRecord {
    const record = this.records.get(id);
    if (record === undefined) {
      throw createSafeMissingMessageError();
    }

    if (!allowedFrom.includes(record.status)) {
      throw new Error(`Message queue transition not allowed from ${record.status} to ${nextStatus}.`);
    }

    const next: QueueRecord = {
      ...record,
      status: nextStatus,
      updatedAt: Date.now(),
      ...(nextStatus === 'FAILED' ? { reason: record.reason } : {})
    };

    this.records.set(id, next);
    return next;
  }
}
