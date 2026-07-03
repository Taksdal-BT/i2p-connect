# Prompt 02: TypeScript Skeleton

Read `AGENTS.md`, `docs/DECISIONS/ADR-0002-runtime-stack.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY_MODEL.md`, and `product/MVP_SCOPE.md`.

Goal:
Add the smallest TypeScript package skeleton for I2P Connect local status logic.

Tasks:

1. Add `package.json`.
2. Add `tsconfig.json`.
3. Add minimal test setup.
4. Create:
   - `src/status/types.ts`
   - `src/status/statusMapper.ts`
   - `src/status/diagnostics.ts`
   - `tests/status/statusMapper.test.ts`
5. Implement pure functions only.
6. Do not perform real network probing yet.
7. Do not add UI.
8. Do not add Supabase.
9. Do not add I2P transport.
10. Add status states:
    - `ready`
    - `starting`
    - `router_not_found`
    - `proxy_unavailable`
    - `sam_unavailable`
    - `tunnel_unknown`
    - `advanced_diagnostics_available`
11. Add beginner-friendly labels and safe diagnostic messages.
12. Ensure diagnostics never include:
    - private destinations
    - private keys
    - router credentials
    - message contents
    - raw traffic logs
13. Update `scripts/local-release-verify.ps1` so it runs npm validation when `package.json` exists.
14. Run:
    - `npm install`
    - `npm run check`
    - `npm run build`
    - `npm test`
    - `.\scripts\local-release-verify.ps1`
    - `.\scripts\check-release-claims.ps1`

Output:

- changed files
- validation results
- implementation notes
- security notes
- next PR-sized task
