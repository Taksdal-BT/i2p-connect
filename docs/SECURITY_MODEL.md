# Security Model

This file defines security boundaries for the greenfield foundation.

## Current State

The repository now includes a minimal TypeScript local status model, a local-first identity model, a versioned contact invite model, a local-only private message domain model, and a fail-closed route policy contract layer for future server routes. Status code maps supplied local status values to beginner-friendly copy, severity, and safe diagnostics. Identity code creates and validates local profile metadata only. Contact invite code exports public/shareable contact metadata only. Message code models local message state only.

The current runtime code does not probe ports, open network connections, connect to SAM, inspect I2PTunnel, access the router console, send messages, implement real encryption, generate private keys, store private key material, create contact directories, sync contact graphs, store messages in Supabase, or sync data externally.

The route policy layer defines explicit security decisions and a startup guard for future endpoints. The local route registration layer now provides placeholder route metadata for future endpoint implementation, but it does not provide active HTTP, WebSocket, IPC, or local admin handlers yet.

## Sensitive Data

Treat the following as sensitive:

- private I2P keys
- private destinations
- private messages
- router logs
- contact graphs
- invite secrets
- router credentials
- signing keys
- API keys
- service role keys
- raw telemetry
- deanonymizing metadata

## Storage Boundary

Sensitive communication data stays local by default. Cloud services must not store private I2P keys, private destinations, private messages, router logs, or contact graphs.

The current identity model stores only local profile metadata: `localProfileId`, `displayName`, `publicContactId`, timestamps, and backup warning state. It does not create or store private I2P keys, private destinations, invite secrets, contact graphs, or transport credentials.

Safe identity serialization must exclude secret-like fields and mark that no private key is stored, no cloud sync happened, and no real I2P identity has been created.

The current contact invite model exports only version, display name, public contact id, creation timestamp, and an optional note. It rejects unknown versions and extra fields, and safe invite views state that no private key, private destination, router metadata, contact graph, or real-world identity proof is included.

The current message model stores only local domain fields and an `encryptedPayloadPlaceholder`. The placeholder is not real encryption. Redacted message views omit payload placeholders and explicitly state that this module did not encrypt the payload, send transport data, confirm delivery, and does not claim full E2EE.

## Network Boundary

Future runtime code must:

- use localhost-bound I2P router integration by default
- avoid public exposure of I2P router/admin/control ports
- avoid clearnet fallback for private communication unless a user explicitly chooses it and sees the risk
- report measured status instead of broad privacy labels

## Logging Boundary

Logs may include coarse local readiness state and sanitized error categories.

Logs must not include private keys, private destinations, message bodies, invite secrets, contact lists, router credentials, raw router logs, sensitive headers, or deanonymizing metadata.

The current TypeScript status model includes a local redaction utility for future diagnostics. Redaction is a guardrail only; sensitive values should not be collected or passed to diagnostics by default.

## Claim Boundary

Guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised in this foundation. Future claims require implementation, tests, documentation, and validation.
