# Threat Model

This document defines the current threat boundaries for I2P Connect.

## Security Goal

Protect local-first privacy boundaries and prevent accidental exposure of sensitive communication data while the project remains in a contract-first implementation phase.

## Assets To Protect

- private I2P keys
- private destinations
- private messages and message payloads
- contact graph metadata
- router credentials
- raw router diagnostics and logs
- signing keys and release credentials

## Trust Boundaries

- local process boundary between app logic and host operating system
- route policy boundary for authentication, CSRF, scope checks, and audit decisions
- packaging boundary between source, build artifacts, checksums, and signatures
- integration boundary that forbids sensitive cloud storage classes

## Threats We Mitigate

Current controls are designed to mitigate:

- accidental or unauthorized local API state changes through missing auth, CSRF, or scope checks
- unsafe route policy drift by startup and matrix validation requirements
- accidental log leakage of secret-like values through redaction and safe-view contracts
- accidental external exposure by preserving loopback-first assumptions and explicit non-claims
- installer and release tampering risk through reproducible artifact and checksum/signature scaffolding

## Threats We Do Not Mitigate

This project does not currently mitigate:

- compromised operating systems, kernel-level malware, or keyloggers
- physical access attacks against unlocked devices
- vulnerabilities in upstream I2P network software not caused by this repository
- side-channel attacks in hardware, firmware, or host virtualization stacks
- guaranteed anonymity, full E2EE, or transport confidentiality claims not yet implemented and tested

## Contributor Decision Filter

A change is out of policy and should be rejected or redesigned if it:

- stores private messages, private keys, private destinations, router logs, or contact graphs in cloud services
- introduces silent network listeners, background services, or automatic firewall changes
- weakens explicit route policy decisions for auth, CSRF, scopes, validation, rate limits, or audit
- adds release-facing security claims stronger than implementation and tests support

## Review Checklist Mapping

For security-sensitive pull requests, reviewers should verify:

- threat boundary impact is documented
- negative tests exist for failure and abuse cases
- no new secret exposure paths are introduced
- claim language remains honest and bounded
