# Security Policy

I2P Connect currently has local TypeScript domain models for status, identity metadata, contact invites, and private message state. These models do not probe routers, open network connections, implement real encryption, create private keys, send messages, store messages in Supabase, or claim delivery.

## Reporting Security Issues

Do not post secrets, private destinations, credentials, private messages, raw router logs, contact graphs, or deanonymizing metadata in public issues.

Use private vulnerability reporting through GitHub Security Advisories.

If GitHub private reporting is unavailable, use a private maintainer channel and include only sanitized reproduction details.

Placeholder for encrypted reporting:

- PGP key id: `REPLACE_WITH_PROJECT_KEY_ID`
- contact: `security@i2p-connect.example`

## Current Scope

Security review currently covers:

- doctrine and release claim boundaries
- documentation accuracy
- GitHub issue/workflow hygiene
- validation scripts
- prevention of accidental secret inclusion
- local-only TypeScript domain models
- redacted views and log-safety helpers

## What Counts As A Vulnerability

Examples that should be reported privately:

- bypassing loopback-only guards for router, SAM, or transport integration
- state-changing route behavior that bypasses authentication, CSRF, or scope checks
- exposure of secrets, private destinations, private messages, or raw router logs in logs, exports, or diagnostics
- privilege escalation through packaging, install scripts, startup services, or firewall rule modifications
- claim boundary violations that represent security guarantees not enforced by implementation

## Out Of Scope

Examples that are generally out of scope unless combined with a project bug:

- physical access to an unlocked device
- full operating-system compromise, kernel malware, keyloggers, or hostile endpoint agents
- vulnerabilities in upstream I2P software that are not caused by this repository
- generic local swap or pagefile behavior controlled by the operating system
- denial-of-service from intentionally malformed local test input when no confidentiality/integrity boundary is crossed

## Coordinated Disclosure Process

- maintainers acknowledge report receipt as soon as practical
- maintainers triage severity and reproduction scope
- maintainers coordinate a fix and safe release notes
- reporters are credited when requested and when safe
- avoid public zero-day disclosure in issue trackers before mitigation exists

Future runtime releases must add supported versions, disclosure handling, dependency policy, cryptographic review expectations, and platform-specific security notes.

## Non-Claims

Guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised in this foundation. Any future claim must be backed by implementation, tests, and documentation.
