# Prompt 00: Commit Foundation

You are working in the Taksdal-BT/i2p-connect repository.

Goal:
Review and prepare the greenfield foundation for the first commit.

Tasks:

1. Read `AGENTS.md`, `README.md`, `DIGITAL_AUTONOMY_DOCTRINE.md`, `PRODUCT_BRIEF.md`, `ROADMAP.md`, `docs/SECURITY_MODEL.md`, `docs/RESPONSIBLE_USE.md`, and `product/MVP_SCOPE.md`.
2. Verify this is a documentation-only foundation.
3. Check for:
   - accidental secrets
   - unsafe claims
   - broken markdown links where obvious
   - duplicate/conflicting doctrine text
   - references to old I2P_knoks product paths
4. Do not add runtime dependencies.
5. Do not add product implementation.
6. Run:
   - `.\scripts\local-release-verify.ps1`
   - `.\scripts\check-release-claims.ps1`

Output:

- recommended commit title
- changed files, if any
- validation results
- risk notes
- next PR-sized task
