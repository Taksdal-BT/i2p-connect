$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$ClaimCheck = Join-Path $PSScriptRoot 'check-release-claims.ps1'
$OnboardingMissions = Join-Path $RepoRoot 'product/onboarding_missions.json'
$PackageJson = Join-Path $RepoRoot 'package.json'
$WindowsBuildScript = Join-Path $PSScriptRoot 'build-windows.ps1'
$LinuxBuildScript = Join-Path $PSScriptRoot 'build-linux.sh'

function Test-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)][string]$Name
    )

    return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
}

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
    'docs/SUPABASE_EXTENSION_PLAN.md',
    'docs/CODEX_HOST_SETUP.md',
    'docs/VALIDATION.md',
    'docs/CLAIMS_REGISTER.md',
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

if (Test-Path -LiteralPath $PackageJson -PathType Leaf) {
    if (-not (Test-CommandAvailable -Name 'node')) {
        Write-Host 'Node.js is required for local validation when package.json exists. Install Node.js 22 or newer, reopen the shell, and rerun .\scripts\local-release-verify.ps1.'
        exit 1
    }

    if (-not (Test-CommandAvailable -Name 'npm')) {
        Write-Host 'npm is required for local validation when package.json exists. Install the Node.js toolchain, reopen the shell, and rerun .\scripts\local-release-verify.ps1.'
        exit 1
    }

    Push-Location $RepoRoot
    try {
        $NpmValidationCommands = @(
            @('run', 'check'),
            @('run', 'build'),
            @('test')
        )

        foreach ($CommandArguments in $NpmValidationCommands) {
            $CommandText = "npm $($CommandArguments -join ' ')"
            Write-Host "Running $CommandText"
            & npm @CommandArguments
            if ($LASTEXITCODE -ne 0) {
                exit $LASTEXITCODE
            }
        }
    }
    finally {
        Pop-Location
    }

    if ($IsLinux -and (Test-Path -LiteralPath $LinuxBuildScript -PathType Leaf)) {
        Write-Host 'Running Linux packaging artifact verification'
        if (-not (Test-CommandAvailable -Name 'bash')) {
            Write-Host 'Linux packaging verification requires bash.'
            exit 1
        }

        Push-Location $RepoRoot
        try {
            & bash './scripts/build-linux.sh'
            if ($LASTEXITCODE -ne 0) {
                exit $LASTEXITCODE
            }
        }
        finally {
            Pop-Location
        }
    }
    elseif ($IsWindows -and (Test-Path -LiteralPath $WindowsBuildScript -PathType Leaf)) {
        Write-Host 'Running Windows packaging artifact verification'
        & $WindowsBuildScript
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }
    }
    elseif ($IsWindows) {
        Write-Host 'Linux packaging verification skipped on Windows host.'
    }
    elseif ($IsLinux) {
        Write-Host 'Linux packaging verification skipped because scripts/build-linux.sh is missing.'
    }
}

Write-Host 'git diff --check passed.'
Write-Host 'Required file check passed.'
Write-Host 'Onboarding mission JSON validation passed.'
if (Test-Path -LiteralPath $PackageJson -PathType Leaf) {
    Write-Host 'npm validation passed.'
    if ($IsLinux -and (Test-Path -LiteralPath $LinuxBuildScript -PathType Leaf)) {
        Write-Host 'Linux packaging artifact verification passed.'
    }
    elseif ($IsWindows -and (Test-Path -LiteralPath $WindowsBuildScript -PathType Leaf)) {
        Write-Host 'Windows packaging artifact verification passed.'
    }
}
Write-Host 'Local release verification passed.'
