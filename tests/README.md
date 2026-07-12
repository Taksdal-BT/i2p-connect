# Tests

This directory contains the first TypeScript runtime tests.

Current scope:

- local status mapping
- severity mapping
- unknown status fallback
- safe diagnostic guardrails
- advanced diagnostic copy
- diagnostic redaction utility
- local identity creation and validation
- safe identity serialization
- contact invite creation, parsing, validation, and safe export
- local private message creation, validation, transitions, and redacted views
- route policy coverage validation, fail-closed startup guard tests, and route security matrix generation tests
- local route registry integration tests without opening network listeners

Future tests should cover local I2P readiness behavior, identity storage, contact invites, message storage, log sanitization, and optional integration boundaries as those features are implemented.
