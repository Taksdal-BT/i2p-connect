# Pull Request

## Summary

Describe the change and why it is needed.

## Security Matrix Checklist (Required)

- [ ] Authentication decision is explicit for every affected state-changing route.
- [ ] CSRF decision is explicit for every browser-accessible state-changing route.
- [ ] Authorization scopes are explicit and least-privilege.
- [ ] Input validation, rate-limit, and audit decisions are explicit.
- [ ] Loopback binding assumptions are preserved; no silent external listener exposure.

## Fail-Closed Checklist (Required)

- [ ] Negative or security tests were added or updated for changed state transitions.
- [ ] Unknown policy decisions for sensitive behavior are not introduced.
- [ ] No secrets, private destinations, private messages, or raw router logs are logged or committed.
- [ ] No unsupported security claims were added.

## Dependency Review (Required if dependencies changed)

- [ ] No new dependencies were added.
- [ ] If dependencies were added, justification and risk review are included.

## Validation Evidence

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run build` (if relevant)
- [ ] `./scripts/local-release-verify.ps1` (if relevant)

Paste command outputs or summarize pass/fail for each command.

## Limitations and Follow-Up

State known limitations and the next PR-sized task.
