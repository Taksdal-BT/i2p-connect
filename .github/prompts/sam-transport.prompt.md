# Objective

Implement or improve the real I2P SAM transport lifecycle.

# Instructions

Inspect existing transport, status, identity, and message modules before editing.

Design the smallest safe implementation that supports:

1. SAM endpoint detection
2. SAM handshake
3. Session creation
4. Clean shutdown
5. Router unavailable state
6. SAM disabled or unreachable state
7. Reconnect with bounded exponential backoff
8. No reconnect storms
9. Message send failure reporting
10. Mockable transport tests

# Constraints

- Do not bypass I2P with clearnet fallback.
- Do not expose services beyond loopback.
- Do not log private destinations or message contents.
- Do not change cryptographic formats without approval.
- Keep router status separate from application identity status.

# Stop conditions

Ask for approval before:

- Adding dependencies
- Changing message-envelope format
- Changing identity storage
- Adding bundled router behavior
- Modifying release packaging

# Required validation

Run targeted transport tests first, then:

```bash
npm run check
npm test
npm run build
```

# Output

Provide:

- Implementation summary
- State-machine summary
- Tests added
- Manual I2P router test steps
- Remaining limitations
