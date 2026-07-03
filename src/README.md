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
- no router probing
- no SAM, proxy, or I2PTunnel probing
- no private key generation or storage
- no contact directory or contact graph sync
- no I2P transport
- no UI
- no Supabase or cloud sync
