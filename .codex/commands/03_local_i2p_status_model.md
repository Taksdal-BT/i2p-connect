# Prompt 03: Local I2P Status Model

Read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY_MODEL.md`, `docs/RESPONSIBLE_USE.md`, `product/MVP_SCOPE.md`, and existing `src/status` code.

Goal:
Implement the first local I2P status model without real network probing.

Tasks:

1. Expand status domain types.
2. Add safe status severity:
   - `ok`
   - `warning`
   - `error`
   - `unknown`
3. Add beginner-friendly status copy.
4. Add advanced diagnostic copy with no sensitive data.
5. Add redaction utility for future diagnostics.
6. Add tests for:
   - every status state
   - severity mapping
   - redaction
   - unknown status fallback
7. Do not probe ports yet.
8. Do not expose router console.
9. Do not log secrets.
10. Update docs with current limitations.
11. Run:
    - `npm run check`
    - `npm run build`
    - `npm test`
    - `.\scripts\local-release-verify.ps1`
    - `.\scripts\check-release-claims.ps1`

Output:

- changed files
- status model summary
- validation results
- OpSec notes
- next PR-sized task
