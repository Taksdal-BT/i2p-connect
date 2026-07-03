# CI Troubleshooting

This page documents GitHub Actions startup failures that happen before repository validation commands can run.

## Startup Failure With No Jobs

If GitHub shows `startup_failure` with `jobs_total=0`, no logs, and no check-runs, treat it as a workflow startup, indexing, policy, or syntax problem before treating it as a TypeScript or test failure.

That failure shape means GitHub did not start a runner job. Local commands can still pass because the workflow never reached checkout, npm, or PowerShell script execution.

## Manual GitHub UI Checks

Open:

```text
https://github.com/Taksdal-BT/i2p-connect/actions
```

Check:

- Actions are enabled for the repository.
- Organization policy allows GitHub-hosted Actions for this repository.
- `Validation` and `Release Claims` appear in the workflow list after the workflow files are on the default branch.
- Workflow files do not show a syntax error banner.
- Pull request checks are real workflow jobs, not only `startup_failure` entries.

## Workflow Shape

Repository workflows should remain simple and explicit:

- files live under `.github/workflows/`
- files use `.yml` or `.yaml`
- each workflow has a `name`
- each workflow has `push`, `pull_request`, and `workflow_dispatch` triggers
- each workflow defines at least one job
- each job has `runs-on`
- each job has `steps`
- scripts run with `pwsh` when they invoke repository PowerShell files

## Current Workflows

`validation.yml` runs on `ubuntu-latest` with Node.js 22:

- `npm ci`
- `npm run check`
- `npm run build`
- `npm test`
- `./scripts/local-release-verify.ps1` through `pwsh`

`release-claims.yml` runs:

- `./scripts/check-release-claims.ps1` through `pwsh`

## Local Confirmation

Before pushing a workflow fix, run:

```powershell
npm run check
npm run build
npm test
.\scripts\local-release-verify.ps1
.\scripts\check-release-claims.ps1
```

Do not merge a pull request while GitHub still reports startup failures for required validation.
