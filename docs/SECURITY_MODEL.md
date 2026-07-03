# Security Model

This file defines security boundaries for the greenfield foundation.

## Current State

The repository now includes a minimal TypeScript local status model and a local-first identity model. Status code maps supplied local status values to beginner-friendly copy, severity, and safe diagnostics. Identity code creates and validates local profile metadata only.

The current runtime code does not probe ports, open network connections, connect to SAM, inspect I2PTunnel, access the router console, send messages, generate private keys, store private key material, or sync data externally.

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
