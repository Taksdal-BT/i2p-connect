# Security Policy

I2P Connect currently has local TypeScript domain models for status, identity metadata, contact invites, and private message state. These models do not probe routers, open network connections, implement real encryption, create private keys, send messages, store messages in Supabase, or claim delivery.

## Reporting Security Issues

Do not post secrets, private destinations, credentials, private messages, raw router logs, contact graphs, or deanonymizing metadata in public issues.

Use private vulnerability reporting through GitHub if it is enabled. If it is not enabled, contact the maintainer through a private channel and share only sanitized details needed to reproduce the issue.

## Current Scope

Security review currently covers:

- doctrine and release claim boundaries
- documentation accuracy
- GitHub issue/workflow hygiene
- validation scripts
- prevention of accidental secret inclusion
- local-only TypeScript domain models
- redacted views and log-safety helpers

Future runtime releases must add supported versions, disclosure handling, dependency policy, cryptographic review expectations, and platform-specific security notes.

## Non-Claims

Guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised in this foundation. Any future claim must be backed by implementation, tests, and documentation.
