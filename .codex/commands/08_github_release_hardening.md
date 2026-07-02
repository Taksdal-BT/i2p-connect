# Prompt 08: GitHub Release Hardening

Read `AGENTS.md`, `SECURITY.md`, `ROADMAP.md`, `scripts/check-release-claims.ps1`, and `scripts/local-release-verify.ps1`.

Goal:
Harden GitHub workflow and release-readiness checks.

Tasks:

1. Review `.github/workflows/`.
2. Ensure validation runs on:
   - `push`
   - `pull_request`
3. Add or update `docs/VALIDATION.md`.
4. Add `docs/CLAIMS_REGISTER.md` if useful.
5. Document forbidden release claims.
6. Add PR checklist section to `CONTRIBUTING.md`:
   - validation run
   - no secrets
   - no unsafe I2P port exposure
   - no unsupported anonymity/encryption/video claims
   - docs updated
7. Do not add product runtime code.
8. Run full validation.

Output:

- changed files
- validation coverage
- claim safety summary
- validation results
- next task
