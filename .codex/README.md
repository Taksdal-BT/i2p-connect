# Codex Workspace

This directory contains task prompts and a lightweight task board for building I2P Connect in small, reviewable PRs.

Use these prompts as starting points, not as permission to overclaim implementation.

Runnable command prompts live in `.codex/commands/`.

List available commands:

```powershell
.\scripts\codex\list-prompts.ps1
```

Create a reviewable task run bundle:

```powershell
.\scripts\codex\run-codex-task.ps1 -Prompt .codex\commands\01_runtime_stack_adr.md
```

Always run:

```powershell
.\scripts\local-release-verify.ps1
```
