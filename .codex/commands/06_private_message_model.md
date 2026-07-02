# Prompt 06: Private Message Model

Read `AGENTS.md`, `docs/SECURITY_MODEL.md`, `docs/RESPONSIBLE_USE.md`, `product/MVP_SCOPE.md`, and current `src` code.

Goal:
Create a local-only private message domain model without claiming working I2P transport.

Tasks:

1. Create `src/messages/`.
2. Add message types:
   - `messageId`
   - `conversationId`
   - `senderPublicId`
   - `recipientPublicId`
   - `encryptedPayloadPlaceholder`
   - `status`: `draft`, `queued`, `sent`, `received`, `failed`
   - `createdAt`
   - `updatedAt`
3. Add status transition helpers.
4. Add redacted logging helpers.
5. Add tests for:
   - message creation
   - invalid recipient
   - status transitions
   - redaction
6. Do not implement real encryption yet.
7. Do not claim full E2EE.
8. Do not implement I2P transport yet.
9. Do not store messages in Supabase.
10. Update docs to state current limitations clearly.
11. Run full validation.

Output:

- changed files
- message model summary
- privacy boundary
- validation results
- next task
