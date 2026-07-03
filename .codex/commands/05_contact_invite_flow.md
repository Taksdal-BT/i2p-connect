# Prompt 05: Contact Invite Flow

Read `AGENTS.md`, `docs/SECURITY_MODEL.md`, `product/MVP_SCOPE.md`, and current `src` code.

Goal:
Implement the first versioned contact invite payload model.

Tasks:

1. Create `src/contacts/`.
2. Define invite payload v1 with only public/shareable fields.
3. Include:
   - `version`
   - `displayName`
   - `publicContactId`
   - `createdAt`
   - optional `note`
4. Add parse and validate functions.
5. Add safe export function.
6. Add trust warning text:
   - Only add contacts you trust.
   - An invite does not prove real-world identity.
7. Add tests for:
   - valid invite
   - malformed invite
   - unknown version
   - secret redaction
   - unsafe extra fields rejection or stripping
8. Do not create public contact directory.
9. Do not store contact graph in cloud services.
10. Run full validation.

Output:

- changed files
- invite format
- security notes
- validation results
- next task
