# AGENTS.md

This is the persistent operating contract for Codex and other agents working in I2P Connect.

## Required Reading

Before changing product, security, onboarding, architecture, release claims, or future runtime code, inspect:

1. `README.md`
2. `DIGITAL_AUTONOMY_DOCTRINE.md`
3. `PRODUCT_BRIEF.md`
4. `ROADMAP.md`
5. `docs/ARCHITECTURE.md`
6. `docs/SECURITY_MODEL.md`
7. `docs/RESPONSIBLE_USE.md`
8. `docs/SUPABASE_BOUNDARY.md`
9. Relevant files for the task

If a required file is missing, report it and continue only from confirmed local context.

## Operating Rules

- Inspect before editing.
- Make PR-sized changes.
- Keep this foundation documentation-only until runtime work is explicitly requested.
- Do not copy old `product/i2p-connect` paths from `I2P_knoks`; use previous concepts only as inspiration.
- Preserve unrelated local changes.
- Never commit secrets, private keys, private destinations, router credentials, API keys, signing keys, message bodies, raw router logs, or sensitive headers.
- Never expose I2P router/admin/control ports publicly.
- Never make unsupported or not implemented claims about anonymity, encryption, video capability, SASE, zero-trust, or release readiness.
- Prefer measured language such as "router reachable", "SAM session ready", "message queued", "local preview", "experimental", and "not externally audited".
- Update documentation when security boundaries, integrations, onboarding, or release-facing claims change.
- Run validation before reporting completion.

## Doctrine Lock

I2P Connect should make digital autonomy feel normal, hopeful, useful, calm, and community-driven.

Prefer:

- privacy as dignity
- responsible use
- open-source trust
- local-first architecture
- simple onboarding
- honest limitations
- least-privilege integration

Avoid:

- fear-based messaging
- conspiracy framing
- criminal symbolism
- hacker-only aesthetics
- unsupported security claims
- real-time video is not promised
- guaranteed anonymity is not promised

## Security Boundaries

Sensitive data must stay local by default:

- private I2P keys
- private destinations
- private messages
- router logs
- contact graphs
- router credentials
- invite secrets
- raw telemetry

Supabase and other cloud services are optional future layers for non-sensitive data only. See `docs/SUPABASE_BOUNDARY.md`.

## Validation

Run:

```powershell
.\scripts\local-release-verify.ps1
```

Final summaries must include changed files, validation commands and results, known limitations, and the next recommended PR-sized task.
