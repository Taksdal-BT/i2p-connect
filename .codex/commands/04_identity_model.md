# Prompt 04: Identity Model

Read `AGENTS.md`, `docs/SECURITY_MODEL.md`, `docs/RESPONSIBLE_USE.md`, `product/MVP_SCOPE.md`, and current `src` code.

Goal:
Create a local-first identity model for I2P Connect.

Tasks:

1. Create `src/identity/`.
2. Add identity types:
   - `localProfileId`
   - `displayName`
   - `publicContactId` placeholder
   - `createdAt`
   - `updatedAt`
   - `backupWarningAcknowledged`
3. Add safe serialization function that excludes secrets.
4. Add validation for display name and public contact id placeholder.
5. Add tests for:
   - identity creation
   - invalid identity
   - display-safe serialization
   - secret redaction
6. Do not implement private key storage yet.
7. Do not use Supabase.
8. Do not sync identity material externally.
9. Update `docs/SECURITY_MODEL.md` with current identity boundary.
10. Run full validation.

Output:

- changed files
- identity model summary
- secret-handling notes
- validation results
- next task
