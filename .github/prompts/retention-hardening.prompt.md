# Objective

Harden the retention cleanup system.

# Instructions

Inspect the current retention implementation and tests.

Add or improve coverage for:

1. Invalid retention-hour values
2. Zero, negative, fractional, and extremely large values
3. Cleanup during concurrent writes
4. Locked files
5. Partially written files
6. Clock changes
7. Symlink traversal
8. Path-boundary enforcement
9. Cleanup metrics that avoid sensitive filenames
10. Graceful shutdown of cleanup intervals

# Constraints

- Do not delete outside the configured data directory.
- Do not log sensitive message or identity data.
- Do not change retention semantics without documenting the change.
- Prefer small, testable helper functions.
- Use dependency injection for filesystem and clock logic where practical.

# Required validation

Run:

```bash
npm run check
npm test
npm run build
```

# Output

Summarize:

- Files changed
- Tests added
- Edge cases covered
- Remaining risks
