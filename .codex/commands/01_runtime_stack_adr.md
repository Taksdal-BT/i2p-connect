# Prompt 01: Runtime Stack ADR

Read the repository foundation.

Goal:
Choose and document the initial runtime stack for I2P Connect.

Tasks:

1. Create `docs/DECISIONS/ADR-0002-runtime-stack.md`.
2. Compare:
   - TypeScript local package first
   - Kotlin/Android first
   - Go service first
   - Rust service first
   - Electron/Tauri shell first
3. Recommend one initial M1 path.
4. Prioritize:
   - smallest safe implementation
   - fast tests
   - local-first privacy
   - easy Codex iteration
   - future I2P SAM/I2PTunnel integration
   - future I2P_knoks integration
   - no premature UI complexity
5. Update `ROADMAP.md` and `.codex/TASK_BOARD.md`.
6. Do not add runtime dependencies.
7. Run:
   - `.\scripts\local-release-verify.ps1`
   - `.\scripts\check-release-claims.ps1`

Recommendation:
TypeScript local package first.

Output:

- selected stack
- rejected alternatives
- changed files
- validation results
- next PR-sized implementation task
