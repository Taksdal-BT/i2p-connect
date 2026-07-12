# Source

This directory contains the first TypeScript runtime skeleton for I2P Connect.

Current scope:

- pure local status mapping under `src/status/`
- beginner-friendly labels
- severity and summary copy
- safe diagnostic messages
- advanced diagnostic copy
- redaction utility for future diagnostics
- local identity metadata under `src/identity/`
- safe identity views that exclude secret-like fields
- public/shareable contact invite payloads under `src/contacts/`
- trust warning copy for invite acceptance
- local-only private message domain model under `src/messages/`
- redacted message views that omit payload placeholders
- route security policy contracts and fail-closed startup guard under `src/security/`
- local route definition registry for future endpoint layers under `src/server/`
- no router probing
- no SAM, proxy, or I2PTunnel probing
- no private key generation or storage
- no real encryption implementation
- no message transport or delivery claims
- no Supabase message storage
- no contact directory or contact graph sync
- no I2P transport
- no UI
- no Supabase or cloud sync
