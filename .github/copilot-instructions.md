# Copilot Instructions for i2p-connect

## Project identity

This repository builds i2p-connect: a local-first, privacy-preserving communication tool intended to integrate safely with I2P. Treat this project as security-sensitive software.

The highest priorities are:

1. User safety
2. Privacy preservation
3. Local-first operation
4. Explicit consent before network exposure
5. Correctness over speed
6. Test-backed changes
7. Clear documentation of security claims and limitations

Do not imply anonymity, end-to-end security, or production readiness unless the claim is already documented and verified by tests or release evidence.

## Coding standards

- Use TypeScript where applicable.
- Prefer explicit types for exported functions, public interfaces, route handlers, and security-critical code.
- Use async and await rather than raw promise chains.
- Avoid global mutable state unless there is a clear lifecycle owner.
- Keep functions small and testable.
- Prefer dependency injection for filesystem, clock, transport, and network-facing logic.
- Do not add unnecessary dependencies.
- Do not introduce large frameworks without explicit approval.
- Avoid clever abstractions in security-sensitive code.
- Fail closed, not open.

## Security rules

Every state-changing route must have:

- Authentication decision
- CSRF decision
- Authorization scope
- Input validation
- Rate-limit decision
- Audit decision

If any of these are missing, do not implement the feature until the gap is addressed.

Never log:

- Private I2P destinations
- Identity secrets
- Session tokens
- CSRF tokens
- Message contents
- Contact secrets
- Backup passphrases
- Raw encrypted private-key material

All sensitive deletion, cleanup, import, export, and backup logic must protect against:

- Path traversal
- Symlink traversal
- Partial writes
- Concurrent writes
- Clock changes
- Invalid configuration
- Excessive retention periods
- Accidental deletion outside the configured data directory

## I2P and networking rules

- Do not expose services on 0.0.0.0 by default.
- Bind local services to loopback unless a user explicitly enables external access.
- Treat localhost ports such as 7657, 4444, 7658, 7650, 8787, and 5173 as protected or sensitive.
- Do not assume the I2P router is installed, running, healthy, or reachable.
- Distinguish router-not-installed, router-stopped, SAM-disabled, SAM-unreachable, warming-up, connected, and degraded states.
- Never silently install, start, or expose network services.
- Never bypass I2P transport by falling back to clearnet unless explicitly requested by the user and documented as unsafe.

## Testing rules

Every meaningful change must include or update tests.

Required checks before completion:

```bash
npm run check
npm run build
npm test
```

If the repository contains a local release verification script, also run it:

```powershell
.\scripts\local-release-verify.ps1
```

Do not claim success unless checks actually ran and passed.

If a test cannot be run, state exactly why and what manual verification remains.

## Documentation rules

Update documentation when behavior changes.

Security-relevant changes may require updates to:

- README.md
- ROADMAP.md
- SECURITY.md
- docs/ARCHITECTURE.md
- docs/SECURITY_MODEL.md
- docs/VALIDATION.md
- docs/CLAIMS_REGISTER.md
- .codex/TASK_BOARD.md
- AGENTS.md

The claims register must not contain claims that are stronger than the implementation and tests support.

## Agent behavior

Before large edits, present a plan.

Pause and ask for approval before:

- Adding dependencies
- Modifying database schema
- Changing cryptographic formats
- Changing identity storage
- Changing transport behavior
- Deleting files
- Rewriting large modules
- Changing public APIs
- Altering CI/CD or release packaging
- Enabling external network exposure

For complex work:

1. Inspect relevant files first.
2. Summarize the current implementation.
3. Propose a minimal plan.
4. Make one coherent change at a time.
5. Run targeted tests.
6. Run full validation.
7. Summarize changed files, risks, and remaining work.
