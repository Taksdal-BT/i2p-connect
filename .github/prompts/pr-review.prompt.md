# Objective

Review the current staged or branch changes as a strict senior engineer.

# Instructions

1. Compare changes against .github/copilot-instructions.md and AGENTS.md.
2. Check for:
   - Security regressions
   - Privacy regressions
   - Missing tests
   - Overbroad claims
   - Unnecessary dependencies
   - Unsafe logging
   - Unsafe network exposure
   - Weak error handling
   - Poor naming or unclear boundaries
3. Inspect documentation changes.
4. Verify that claims match implementation and tests.
5. Do not modify files.

# Output format

## Summary

Briefly state whether the PR is safe to merge.

## Required fixes

| Severity | File | Issue | Required fix |
|---|---|---|---|

## Suggested improvements

| File | Suggestion | Why |
|---|---|---|

## Validation checklist

- [ ] npm run check
- [ ] npm run build
- [ ] npm test
- [ ] release verification, if relevant
- [ ] docs updated
- [ ] claims register updated
