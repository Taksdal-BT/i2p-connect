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
    $RunDir = Join-Path $RunsDir "$Stamp-list-prompts"
    New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

    return (Join-Path $RunDir 'run.log')
}

try {
    $RepoRoot = Get-RepoRoot
    $LogFile = New-RunLog -RepoRoot $RepoRoot
    $CommandsDir = Join-Path $RepoRoot '.codex\commands'

    if (-not (Test-Path -LiteralPath $CommandsDir -PathType Container)) {
        throw "Prompt directory not found: $CommandsDir"
    }

    Write-RunLog -LogFile $LogFile -Message "Repository: $RepoRoot"
    Write-RunLog -LogFile $LogFile -Message "Prompt directory: $CommandsDir"

    $PromptFiles = @(Get-ChildItem -LiteralPath $CommandsDir -Filter '*.md' -File | Sort-Object Name)
    if ($PromptFiles.Count -eq 0) {
        throw 'No Codex command prompt files found.'
    }

    Write-RunLog -LogFile $LogFile -Message ''
    Write-RunLog -LogFile $LogFile -Message 'Available Codex command prompts:'

    foreach ($PromptFile in $PromptFiles) {
        if (-not (Test-Path -LiteralPath $PromptFile.FullName -PathType Leaf)) {
            throw "Prompt file disappeared while listing: $($PromptFile.FullName)"
        }

        $Title = Get-Content -LiteralPath $PromptFile.FullName -TotalCount 1
        if ([string]::IsNullOrWhiteSpace($Title)) {
            $Title = $PromptFile.BaseName
        }

        Write-RunLog -LogFile $LogFile -Message (" - {0}: {1}" -f $PromptFile.BaseName, $Title.TrimStart('#').Trim())
    }

    Write-RunLog -LogFile $LogFile -Message ''
    Write-RunLog -LogFile $LogFile -Message "Log written to $LogFile"
}
catch {
    $SafeError = Protect-LogText $_.Exception.Message
    Write-Error $SafeError
    exit 1
}
