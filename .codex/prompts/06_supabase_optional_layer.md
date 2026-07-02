# Prompt 06: Supabase Optional Layer

Design an optional Supabase-backed metadata layer for non-sensitive data only.

Allowed use:

- public docs index
- release dashboard
- sanitized opt-in metrics
- onboarding mission catalog
- community resources
- education/workshop metadata

Forbidden use:

- private messages
- private I2P destinations
- private keys
- raw router logs
- contact graph
- unredacted telemetry
- deanonymizing metadata

Add schema docs, migrations, RLS, rollback notes, and validation if this layer is implemented later.
