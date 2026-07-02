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

## Issue Types

Use the GitHub issue templates for:

- feature requests
- OpSec review
- documentation work
- release claim review
