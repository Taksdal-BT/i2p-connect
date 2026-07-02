$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$ClaimCheck = Join-Path $PSScriptRoot 'check-release-claims.ps1'
$OnboardingMissions = Join-Path $RepoRoot 'product/onboarding_missions.json'

Push-Location $RepoRoot
try {
    git diff --check
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}
finally {
    Pop-Location
}

& $ClaimCheck
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$RequiredFiles = @(
    'AGENTS.md',
    'README.md',
    'DIGITAL_AUTONOMY_DOCTRINE.md',
    'PRODUCT_BRIEF.md',
    'SECURITY.md',
    'CONTRIBUTING.md',
    'ROADMAP.md',
    'CODEX_MASTER_PROMPT.md',
    'docs/ARCHITECTURE.md',
    'docs/SECURITY_MODEL.md',
    'docs/RESPONSIBLE_USE.md',
    'docs/INTEGRATION_STRATEGY.md',
    'docs/SUPABASE_BOUNDARY.md',
    'docs/CODEX_HOST_SETUP.md',
    'docs/DECISIONS/ADR-0001-greenfield-repo.md',
    'product/MVP_SCOPE.md',
    'product/UX_ONBOARDING_SPEC.md',
    'product/onboarding_missions.json',
    '.codex/README.md',
    '.codex/TASK_BOARD.md',
    '.codex/prompts/00_repo_foundation.md',
    '.codex/prompts/01_local_i2p_status.md',
    '.codex/prompts/02_identity_model.md',
    '.codex/prompts/03_contact_invites.md',
    '.codex/prompts/04_private_message_mvp.md',
    '.codex/prompts/05_audio_message_prototype.md',
    '.codex/prompts/06_supabase_optional_layer.md',
    '.github/workflows/validation.yml',
    '.github/workflows/release-claims.yml',
    '.github/ISSUE_TEMPLATE/feature_request.md',
    '.github/ISSUE_TEMPLATE/opsec_review.md',
    '.github/ISSUE_TEMPLATE/documentation.md',
    '.github/ISSUE_TEMPLATE/release_claim_review.md',
    'scripts/check-release-claims.ps1',
    'scripts/local-release-verify.ps1',
    'src/README.md',
    'tests/README.md'
)

$Failures = [System.Collections.Generic.List[string]]::new()
foreach ($RelativePath in $RequiredFiles) {
    $Path = Join-Path $RepoRoot $RelativePath
    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        [void]$Failures.Add("Missing required file: $RelativePath")
    }
}

if ($Failures.Count -gt 0) {
    Write-Host 'Required file check failed:'
    foreach ($Failure in $Failures) {
        Write-Host " - $Failure"
    }
    exit 1
}

try {
    $Json = Get-Content -LiteralPath $OnboardingMissions -Raw | ConvertFrom-Json
    if ($null -eq $Json.missions -or @($Json.missions).Count -lt 1) {
        throw 'product/onboarding_missions.json must contain at least one mission.'
    }
}
catch {
    Write-Host "Onboarding mission JSON validation failed: $($_.Exception.Message)"
    exit 1
}

Write-Host 'git diff --check passed.'
Write-Host 'Required file check passed.'
Write-Host 'Onboarding mission JSON validation passed.'
Write-Host 'Local release verification passed.'
