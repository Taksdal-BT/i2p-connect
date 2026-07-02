# Codex Host Setup

This repository is intended to work well with Codex on a Windows PowerShell host.

## Local Assumptions

- Shell: PowerShell
- Validation entrypoint: `.\scripts\local-release-verify.ps1`
- Runtime code: not present yet
- Dependencies: none in the foundation phase

## Agent Flow

1. Inspect relevant docs and current git status.
2. Make PR-sized changes.
3. Avoid secrets and sensitive I2P material.
4. Run local verification.
5. Report changed files, validation results, limitations, and next task.

## Future Runtime Setup

When runtime code is added, this document should include stack-specific setup, build commands, test commands, and local I2P router setup notes.
