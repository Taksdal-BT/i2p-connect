$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Protect-LogText {
    param(
        [AllowNull()][object]$InputObject
    )

    if ($null -eq $InputObject) {
        return ''
    }

    $Text = [string]$InputObject
    $Redactions = @(
        @{ Pattern = '(?i)(api[_-]?key\s*[:=]\s*)[^\s,''"]+'; Replacement = '$1[REDACTED]' },
        @{ Pattern = '(?i)(service[_-]?role[_-]?key\s*[:=]\s*)[^\s,''"]+'; Replacement = '$1[REDACTED]' },
        @{ Pattern = '(?i)(secret\s*[:=]\s*)[^\s,''"]+'; Replacement = '$1[REDACTED]' },
        @{ Pattern = '(?i)(token\s*[:=]\s*)[^\s,''"]+'; Replacement = '$1[REDACTED]' },
        @{ Pattern = 'sk-[A-Za-z0-9_-]{12,}'; Replacement = 'sk-[REDACTED]' }
    )

    foreach ($Redaction in $Redactions) {
        $Text = [regex]::Replace($Text, $Redaction.Pattern, $Redaction.Replacement)
    }

    return $Text
}

function Write-RunLog {
    param(
        [Parameter(Mandatory = $true)][string]$LogFile,
        [AllowEmptyString()]
        [Parameter(Mandatory = $true)][string]$Message
    )

    $SafeMessage = Protect-LogText $Message
    Add-Content -LiteralPath $LogFile -Value $SafeMessage -Encoding UTF8
    Write-Host $SafeMessage
}

function Get-RepoRoot {
    $Root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
    $RequiredPaths = @(
        'AGENTS.md',
        'README.md',
        '.git',
        '.codex',
        'scripts/local-release-verify.ps1',
        'scripts/check-release-claims.ps1'
    )

    foreach ($RelativePath in $RequiredPaths) {
        $Path = Join-Path $Root $RelativePath
        if (-not (Test-Path -LiteralPath $Path)) {
            throw "Repository root verification failed. Missing $RelativePath under $Root."
        }
    }

    return $Root
}

function New-RunLog {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot
    )

    $RunsDir = Join-Path $RepoRoot '.codex\runs'
    New-Item -ItemType Directory -Force -Path $RunsDir | Out-Null

    $Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $RunDir = Join-Path $RunsDir "$Stamp-validation"
    New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

    return (Join-Path $RunDir 'run.log')
}

function Invoke-LoggedValidation {
    param(
        [Parameter(Mandatory = $true)][string]$ScriptPath,
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$LogFile
    )

    if (-not (Test-Path -LiteralPath $ScriptPath -PathType Leaf)) {
        throw "Validation script not found: $ScriptPath"
    }

    $Name = [System.IO.Path]::GetFileName($ScriptPath)
    Write-RunLog -LogFile $LogFile -Message "Running $Name"

    Push-Location $RepoRoot
    try {
        $global:LASTEXITCODE = 0
        $Output = & $ScriptPath 2>&1
        $Succeeded = $?
        $ExitCode = $global:LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    foreach ($Line in @($Output)) {
        Write-RunLog -LogFile $LogFile -Message ([string]$Line)
    }

    if (-not $Succeeded -or $ExitCode -ne 0) {
        throw "$Name failed with exit code $ExitCode."
    }

    Write-RunLog -LogFile $LogFile -Message "$Name passed."
}

try {
    $RepoRoot = Get-RepoRoot
    $LogFile = New-RunLog -RepoRoot $RepoRoot

    Write-RunLog -LogFile $LogFile -Message "Repository: $RepoRoot"
    Write-RunLog -LogFile $LogFile -Message 'Validation logs are redacted for common secret patterns.'

    Invoke-LoggedValidation -ScriptPath (Join-Path $RepoRoot 'scripts\local-release-verify.ps1') -RepoRoot $RepoRoot -LogFile $LogFile
    Invoke-LoggedValidation -ScriptPath (Join-Path $RepoRoot 'scripts\check-release-claims.ps1') -RepoRoot $RepoRoot -LogFile $LogFile

    Write-RunLog -LogFile $LogFile -Message "Validation complete. Log written to $LogFile"
}
catch {
    $SafeError = Protect-LogText $_.Exception.Message
    Write-Error $SafeError
    exit 1
}
