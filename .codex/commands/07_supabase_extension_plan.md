# Prompt 07: Supabase Extension Plan

Read `AGENTS.md`, `docs/SUPABASE_BOUNDARY.md`, `docs/SECURITY_MODEL.md`, and `docs/INTEGRATION_STRATEGY.md`.

Goal:
Prepare an optional Supabase extension plan for non-sensitive data only.

Tasks:

1. Create `docs/SUPABASE_EXTENSION_PLAN.md`.
2. Define allowed future tables:
   - `public_docs_index`
   - `onboarding_missions_public`
   - `release_claims`
   - `sanitized_metrics_events`
   - `community_resources`
   - `education_workshops`
3. Define forbidden data classes:
   - private messages
   - private I2P keys
   - private destinations
   - contact graphs
   - raw router logs
   - unredacted telemetry
4. Propose future folder structure:
   - `supabase/migrations/`
   - `supabase/policies/`
   - `supabase/functions/`
   - `supabase/seed/`
5. Add RLS requirements for every exposed table.
6. Add server-only secret key rules.
7. Add rollback and advisor checklist.
8. Do not create live migrations yet.
9. Do not create Supabase project.
10. Do not add credentials.
11. Run full validation.

Output:

- changed files
- allowed/forbidden Supabase use
- security notes
- validation results
- next PR-sized task
