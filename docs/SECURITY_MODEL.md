# Security Model

This file defines security boundaries for the greenfield foundation.

## Current State

No runtime code exists yet. The current security model is a set of constraints for future implementation.

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

## Network Boundary

Future runtime code must:

- use localhost-bound I2P router integration by default
- avoid public exposure of I2P router/admin/control ports
- avoid clearnet fallback for private communication unless a user explicitly chooses it and sees the risk
- report measured status instead of broad privacy labels

## Logging Boundary

Logs may include coarse local readiness state and sanitized error categories.

Logs must not include private keys, private destinations, message bodies, invite secrets, contact lists, router credentials, raw router logs, sensitive headers, or deanonymizing metadata.

## Claim Boundary

Guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised in this foundation. Future claims require implementation, tests, documentation, and validation.
