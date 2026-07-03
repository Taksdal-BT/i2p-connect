# Supabase Extension Plan

Supabase is an optional future extension layer for non-sensitive I2P Connect metadata. It must never become required for core local communication.

This plan does not create a Supabase project, live migrations, policies, functions, seed data, or credentials.

## Allowed Future Tables

| Table | Purpose | Sensitive data allowed |
| --- | --- | --- |
| `public_docs_index` | Public documentation search/index metadata. | No. |
| `onboarding_missions_public` | Public onboarding mission catalog and copy. | No. |
| `release_claims` | Release claim inventory, review status, and evidence links. | No. |
| `sanitized_metrics_events` | Opt-in aggregate or sanitized product metrics. | No. |
| `community_resources` | Public community resources, links, and descriptions. | No. |
| `education_workshops` | Public workshop metadata and learning resources. | No. |

Allowed tables may contain public slugs, titles, descriptions, non-sensitive tags, public URLs, timestamps, review status, and sanitized aggregate counts. They must not contain user communication contents or private I2P identity material.

## Forbidden Data Classes

Supabase must not store:

- private messages
- private I2P keys
- private destinations
- contact graphs
- raw router logs
- unredacted telemetry
- deanonymizing metadata
- invite secrets
- router credentials
- signing keys
- service role keys in client code
- sensitive headers
- plaintext message bodies

If a proposed column could reconstruct who communicates with whom, where a private destination lives, what a user said, or how to identify a user's router setup, it is out of scope.

## Future Folder Structure

If Supabase is introduced later, use this structure:

```text
supabase/
  migrations/
  policies/
  functions/
  seed/
```

Expected contents:

- `supabase/migrations/`: schema migrations for non-sensitive tables only.
- `supabase/policies/`: documented Row Level Security policies and rationale.
- `supabase/functions/`: optional server-side functions that never expose service role keys to clients.
- `supabase/seed/`: public seed data only, such as docs links or workshop metadata.

Do not create these folders until a future PR implements the optional Supabase layer.

## RLS Requirements

Every exposed table must have Row Level Security enabled before use.

Minimum policy expectations:

- `public_docs_index`: public read, restricted write.
- `onboarding_missions_public`: public read, restricted write.
- `release_claims`: public read for approved claim metadata, restricted write.
- `sanitized_metrics_events`: insert only through approved server-side or carefully scoped client paths; reads restricted to aggregate-safe views.
- `community_resources`: public read, restricted write.
- `education_workshops`: public read, restricted write.

Any table with write access from clients must document abuse controls, accepted fields, validation rules, and why the data class is non-sensitive.

## Secret Key Rules

- Use publishable keys only in frontend or client code.
- Keep service role keys server-side only.
- Do not commit `.env` files, service keys, access tokens, database passwords, signing keys, or API keys.
- Use `.env.example` for variable names only if configuration is introduced later.
- Do not log service role keys, JWTs, request authorization headers, or sensitive row payloads.

## Rollback Notes

Any future Supabase implementation PR must include rollback notes:

- migrations that can be reverted safely
- tables and policies created by the PR
- functions created by the PR
- seed data created by the PR
- data classes confirmed excluded
- any manual cleanup steps

Rollback must not require deleting local user identity material, private messages, private destinations, or router data because those data classes must never be stored in Supabase.

## Advisor And Review Checklist

Before enabling a Supabase-backed feature:

- Confirm every exposed table has RLS enabled.
- Confirm no forbidden data classes appear in table names, column names, seed data, test fixtures, logs, or docs examples.
- Confirm client code uses publishable keys only.
- Confirm service role keys are server-only.
- Confirm migrations and rollback notes exist.
- Confirm docs explain that Supabase is optional and non-sensitive only.
- Run Supabase security and performance advisors if a project exists.
- Run `.\scripts\local-release-verify.ps1`.
- Run `.\scripts\check-release-claims.ps1`.

## Current Non-Implementation

This repository currently has no Supabase project, migrations, policies, functions, seed data, credentials, or live integration. Core local status, identity, invite, and message domain models remain local TypeScript logic.
