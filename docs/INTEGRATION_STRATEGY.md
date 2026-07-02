# Integration Strategy

I2P Connect starts as a clean product foundation. Integrations come after the local-first core is clear.

## I2P Integration

Future runtime code should integrate with a local I2P router through localhost-bound APIs or transports. Router/admin/control ports must not be exposed publicly.

Initial measured states may include:

- router not configured
- router unreachable
- router reachable
- SAM session ready
- transport error

These states may become release-facing only after implementation and tests exist.

## I2P_knoks Relationship

`I2P_knoks` may become a future Android host, companion app, or integration testbed. This repository should remain greenfield and must not copy old `product/i2p-connect` paths from that repo.

## Supabase And Cloud Services

Supabase is optional and non-sensitive only. See `docs/SUPABASE_BOUNDARY.md`.

## Future Host Apps

Host apps should consume I2P Connect through small documented modules or APIs after runtime code exists. Host apps must preserve local-first storage, sanitized diagnostics, and measured release claims.
