# Objective

Prepare a release-readiness report for i2p-connect.

# Instructions

1. Inspect package.json, scripts, CI workflows, release scripts, docs, and tests.
2. Run or identify the correct validation commands.
3. Verify:
   - Clean install
   - Type check
   - Build
   - Test suite
   - Local release verification
   - Claims-register consistency
   - Security documentation consistency
   - No obvious secrets in tracked files
   - No unsupported privacy or security claims
4. Do not create a release unless explicitly instructed.

# Output format

## Release readiness

State one of:

- Ready
- Ready with warnings
- Not ready

## Evidence

| Check | Result | Evidence |
|---|---|---|

## Blockers

| Severity | Blocker | Required action |
|---|---|---|

## Recommended next release tag

Suggest a semver tag only if the project appears ready.
