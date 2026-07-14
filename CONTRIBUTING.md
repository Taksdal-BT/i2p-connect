# Contributing

Thanks for helping build I2P Connect.

## Contributing In 60 Seconds

From a fresh clone:

```powershell
npm ci
.\scripts\local-release-verify.ps1
```

Fast local loop while editing:

```powershell
npm run check
npm run build
npm test
```

If `node` or `npm` is missing, install Node.js 22 or newer and reopen the shell.

## Ground Rules

- Read `AGENTS.md` before making changes.
- Keep changes PR-sized and reviewable.
- Design for fail-closed behavior and paranoia by default.
- Do not add runtime dependencies without explicit justification and review.
- Do not commit secrets or sensitive I2P material.
- Do not expose I2P router/admin/control ports publicly.
- Do not make unsupported security, anonymity, encryption, video, SASE, or zero-trust claims.
- Update docs when changing product direction, security boundaries, or release claims.

## Fail-Closed Contribution Rules

- Every state-changing behavior must document authentication, CSRF, authorization scopes, input validation, rate limits, and audit expectations.
- Pull requests that add or change state transitions must include negative or security tests, not only happy-path tests.
- If a security policy decision is unknown for sensitive behavior, the contribution must fail closed and block merge until resolved.
- New route definitions must preserve loopback-first assumptions and must not imply external network exposure by default.

## Dependency Policy

Any new dependency request must include:

- why existing platform or standard library options are insufficient
- security and maintenance risk review
- version pinning strategy
- removal or rollback plan if risk posture changes

## Validation

Before opening a PR, run:

```powershell
.\scripts\local-release-verify.ps1
```

Include validation results and known limitations in the PR summary.

For TypeScript changes, also run or confirm that local release verification ran:

```powershell
npm run check
npm run build
npm test
```

## Pull Request Checklist

Before requesting review, confirm:

- validation commands were run and results are included
- state-changing changes include negative or security tests
- no secrets, credentials, private keys, service role keys, or API keys are included
- no private I2P destinations, private messages, raw router logs, contact graphs, or sensitive headers are included
- no I2P router/admin/control ports are exposed publicly
- no unsupported anonymity, encryption, delivery, video, SASE, or zero-trust claims were added
- route policy decisions are explicit for authentication, CSRF, scopes, input validation, rate limits, and audit behavior
- docs were updated for behavior, validation, security boundaries, integrations, or release-facing claims
- Supabase or other cloud services are not used for sensitive I2P data
- new dependencies include explicit security and maintenance justification
- known limitations and next PR-sized task are stated

## Issue Types

Use the GitHub issue templates for:

- feature requests
- OpSec review
- documentation work
- release claim review
