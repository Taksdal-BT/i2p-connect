# Objective

Act as a strict security engineer reviewing this repository.

# Scope

Review the authentication, session, CSRF, authorization, route-policy, logging, retention, import/export, and local-network exposure logic.

# Instructions

1. Inspect the relevant server, security, route, config, and test files.
2. Build an endpoint inventory.
3. For every endpoint, determine:
   - Authentication requirement
   - CSRF requirement
   - Authorization scope
   - Input validation
   - Rate-limit requirement
   - Audit-log requirement
4. Identify missing or inconsistent controls.
5. Look specifically for:
   - Timing attacks
   - Session fixation
   - Missing session invalidation
   - Missing CSRF tokens
   - Authorization bypass
   - Host-header or DNS-rebinding risk
   - Unsafe localhost assumptions
   - Path traversal
   - Symlink traversal
   - Sensitive logging
   - Unsafe retention cleanup
6. Do not modify files yet.

# Output format

Return a markdown table:

| Severity | Area | File | Finding | Risk | Recommended fix | Test required |
|---|---|---|---|---|---|---|

Then provide:

- Top 5 fixes in priority order
- Files that need tests
- Any claim in docs/CLAIMS_REGISTER.md that appears unsupported
