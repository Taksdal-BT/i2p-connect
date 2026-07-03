# Contributing

Thanks for helping build I2P Connect.

## Ground Rules

- Read `AGENTS.md` before making changes.
- Keep changes PR-sized and reviewable.
- Do not add runtime dependencies in the foundation phase.
- Do not commit secrets or sensitive I2P material.
- Do not expose I2P router/admin/control ports publicly.
- Do not make unsupported security, anonymity, encryption, video, SASE, or zero-trust claims.
- Update docs when changing product direction, security boundaries, or release claims.

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
- no secrets, credentials, private keys, service role keys, or API keys are included
- no private I2P destinations, private messages, raw router logs, contact graphs, or sensitive headers are included
- no I2P router/admin/control ports are exposed publicly
- no unsupported anonymity, encryption, delivery, video, SASE, or zero-trust claims were added
- docs were updated for behavior, validation, security boundaries, integrations, or release-facing claims
- Supabase or other cloud services are not used for sensitive I2P data
- known limitations and next PR-sized task are stated

## Issue Types

Use the GitHub issue templates for:

- feature requests
- OpSec review
- documentation work
- release claim review
