# Validation

I2P Connect uses local and GitHub validation to keep release-facing claims grounded in implementation, tests, and documentation.

## Local Validation

Local TypeScript validation requires Node.js 22 or newer with `npm` available on `PATH`.

Install dependencies before running the full gate:

```powershell
npm ci
```

Run the full local gate before opening a pull request:

```powershell
.\scripts\local-release-verify.ps1
```

The local release verification currently checks:

- `git diff --check`
- release claim guardrails through `scripts/check-release-claims.ps1`
- required foundation files
- onboarding mission JSON validity
- `npm run check` when `package.json` exists
- `npm run build` when `package.json` exists
- `npm test` when `package.json` exists

If `node` or `npm` is not available, the script now stops early with an actionable prerequisite message instead of failing later during npm execution.

The npm test suite now includes route policy validation tests that enforce fail-closed policy coverage for sensitive routes in the route registry contract layer.

For TypeScript changes, it is also useful to run the npm commands directly while iterating:

```powershell
npm run check
npm run build
npm test
```

## GitHub Workflow Coverage

`.github/workflows/validation.yml` runs package validation and `.\scripts\local-release-verify.ps1` on:

- `push`
- `pull_request`
- `workflow_dispatch`

`.github/workflows/release-claims.yml` runs `.\scripts\check-release-claims.ps1` on:

- `push`
- `pull_request`
- `workflow_dispatch`

Both workflows use `ubuntu-latest`, `actions/checkout@v4`, and PowerShell Core (`pwsh`) for repository scripts. The validation workflow also uses `actions/setup-node@v4` with Node.js 22 and `npm ci` before running npm checks.

## Release Claim Gate

Run the release claim guard directly when changing README, docs, product copy, issue templates, prompts, or release notes:

```powershell
.\scripts\check-release-claims.ps1
```

The guard rejects unsupported release-facing wording unless the same line clearly limits the claim with language such as `not promised`, `unsupported`, `future`, `experimental`, `unless implemented`, or `must not claim`.

## Required PR Evidence

Every PR should state:

- validation commands run
- pass/fail result for each command
- changed files
- security and OpSec notes
- known limitations
- next PR-sized task

Do not report validation as passing unless the command was actually run.

## Hard Stop Conditions

Stop and request review if a change introduces or suggests:

- public exposure of I2P router/admin/control ports
- secrets, API keys, service role keys, private keys, or router credentials
- private I2P destinations
- private messages or plaintext message bodies in logs
- raw router logs
- contact graph sync
- Supabase or cloud storage of sensitive I2P data
- unsupported anonymity, encryption, delivery, video, SASE, or zero-trust claims
