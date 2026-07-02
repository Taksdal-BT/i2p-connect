# ADR-0001: Greenfield Repository

## Status

Accepted.

## Context

I2P Connect needs a clean foundation for doctrine, security boundaries, onboarding, validation, and Codex task prompts before runtime code is added.

Previous concepts exist in related work, including `I2P_knoks`, but this repository should remain greenfield.

## Decision

Initialize `Taksdal-BT/i2p-connect` as a documentation-only foundation. Do not copy old `product/i2p-connect` paths from `I2P_knoks`.

Use previous concepts only as inspiration while defining fresh repository structure, validation, and operating rules.

## Consequences

- The first PR contains no runtime dependencies.
- Release claims are constrained before implementation starts.
- Optional integrations are bounded before they exist.
- Future runtime work can proceed through smaller, safer PRs.
