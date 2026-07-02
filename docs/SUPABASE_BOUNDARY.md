# Supabase Boundary

Supabase is optional for I2P Connect and must be limited to non-sensitive data.

## Allowed Supabase Use

Supabase may be used for:

- public docs index
- release dashboard
- sanitized opt-in metrics
- onboarding mission catalog
- community resources
- education/workshop metadata

## Forbidden Supabase Use

Supabase must not store:

- private messages
- private I2P destinations
- private keys
- raw router logs
- contact graph
- unredacted telemetry
- deanonymizing metadata

## Required Controls If Added Later

If Supabase is introduced, the PR must include:

- schema documentation
- migrations
- Row Level Security for exposed tables
- publishable keys only in client code
- service role keys only in server-side or trusted automation contexts
- rollback notes
- validation that sensitive data classes are excluded

Supabase must never become required for core local communication.
