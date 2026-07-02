[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateNotNullOrEmpty()]
    [string]$Prompt,

    [switch]$InvokeCodex,

    [ValidateNotNullOrEmpty()]
    [string]$CodexCommand = 'codex',

    [string[]]$CodexArguments = @('exec')
)

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

function Resolve-CommandPrompt {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$PromptName
    )

    $CommandsDir = Join-Path $RepoRoot '.codex\commands'
    if (-not (Test-Path -LiteralPath $CommandsDir -PathType Container)) {
        throw "Prompt directory not found: $CommandsDir"
    }

    if ($PromptName -match '(^|[\\/])\.\.([\\/]|$)') {
        throw 'Prompt path must stay under .codex/commands.'
    }

    if ([System.IO.Path]::IsPathRooted($PromptName)) {
        $Candidate = $PromptName
    }
    elseif ($PromptName -match '[\\/]') {
        $Candidate = Join-Path $RepoRoot $PromptName
    }
    else {
        $FileName = $PromptName
        if (-not $FileName.EndsWith('.md', [System.StringComparison]::OrdinalIgnoreCase)) {
            $FileName = "$FileName.md"
        }

        $Candidate = Join-Path $CommandsDir $FileName
    }

    if (-not $Candidate.EndsWith('.md', [System.StringComparison]::OrdinalIgnoreCase)) {
        $Candidate = "$Candidate.md"
    }

    if (-not (Test-Path -LiteralPath $Candidate -PathType Leaf)) {
        throw "Prompt file not found: $Candidate"
    }

    $ResolvedPrompt = (Resolve-Path -LiteralPath $Candidate).Path
    $ResolvedCommandsDir = (Resolve-Path -LiteralPath $CommandsDir).Path
    $CommandsPrefix = $ResolvedCommandsDir.TrimEnd([System.IO.Path]::DirectorySeparatorChar, [System.IO.Path]::AltDirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
    if (-not $ResolvedPrompt.StartsWith($CommandsPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Resolved prompt escaped .codex/commands.'
    }

    return $ResolvedPrompt
}

function New-RunContext {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$PromptFile
    )

    $RunsDir = Join-Path $RepoRoot '.codex\runs'
    New-Item -ItemType Directory -Force -Path $RunsDir | Out-Null

    $Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $SafePromptName = [System.IO.Path]::GetFileNameWithoutExtension($PromptFile) -replace '[^A-Za-z0-9_.-]', '_'
    $RunDir = Join-Path $RunsDir "$Stamp-$SafePromptName"
    New-Item -ItemType Directory -Force -Path $RunDir | Out-Null

    return [pscustomobject]@{
        RunDir = $RunDir
        LogFile = Join-Path $RunDir 'run.log'
        TaskFile = Join-Path $RunDir 'task-prompt.txt'
    }
}

function New-TaskPrompt {
    param(
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$PromptFile,
        [Parameter(Mandatory = $true)][string]$TaskFile
    )

    $PromptText = Get-Content -LiteralPath $PromptFile -Raw
    $TaskText = @"
# Codex Task Run

Repository: $RepoRoot
Prompt file: $PromptFile

## Safety Guard

- Stay inside this repository unless the operator explicitly says otherwise.
- Do not run destructive git operations.
- Do not push, tag, publish, or open a pull request from this task runner.
- Do not print, log, or commit secrets, private destinations, router credentials, private keys, raw router logs, or message bodies.
- Keep claims measured. Guaranteed anonymity, full E2EE, SASE, zero-trust, and real-time video are not promised.
- Run `.\scripts\local-release-verify.ps1` and `.\scripts\check-release-claims.ps1` before completion.

## Task Prompt

$PromptText
"@

    Set-Content -LiteralPath $TaskFile -Value $TaskText -Encoding UTF8
}

function Invoke-CodexTask {
    param(
        [Parameter(Mandatory = $true)][string]$CodexExecutable,
        [string[]]$CodexArguments = @(),
        [Parameter(Mandatory = $true)][string]$TaskFile,
        [Parameter(Mandatory = $true)][string]$RepoRoot,
        [Parameter(Mandatory = $true)][string]$LogFile
    )

    $CommandInfo = Get-Command $CodexExecutable -ErrorAction SilentlyContinue
    if ($null -eq $CommandInfo) {
        throw "Codex command not found: $CodexExecutable. Re-run without -InvokeCodex to create a reviewable task file only."
    }

    Write-RunLog -LogFile $LogFile -Message "Invoking Codex command: $($CommandInfo.Source)"
    Write-RunLog -LogFile $LogFile -Message 'Using stdin for the task prompt so the prompt body is not echoed as a command-line argument.'

    Push-Location $RepoRoot
    try {
        $TaskText = Get-Content -LiteralPath $TaskFile -Raw
        $global:LASTEXITCODE = 0
        $Output = $TaskText | & $CommandInfo.Source @CodexArguments 2>&1
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
        throw "Codex command failed with exit code $ExitCode."
    }
}

try {
    $RepoRoot = Get-RepoRoot
    $PromptFile = Resolve-CommandPrompt -RepoRoot $RepoRoot -PromptName $Prompt
    $RunContext = New-RunContext -RepoRoot $RepoRoot -PromptFile $PromptFile

    New-TaskPrompt -RepoRoot $RepoRoot -PromptFile $PromptFile -TaskFile $RunContext.TaskFile

    Write-RunLog -LogFile $RunContext.LogFile -Message "Repository: $RepoRoot"
    Write-RunLog -LogFile $RunContext.LogFile -Message "Prompt: $PromptFile"
    Write-RunLog -LogFile $RunContext.LogFile -Message "Run directory: $($RunContext.RunDir)"
    Write-RunLog -LogFile $RunContext.LogFile -Message "Task file: $($RunContext.TaskFile)"
    Write-RunLog -LogFile $RunContext.LogFile -Message 'This runner does not run destructive git operations and does not push.'

    if ($InvokeCodex.IsPresent) {
        Invoke-CodexTask -CodexExecutable $CodexCommand -CodexArguments $CodexArguments -TaskFile $RunContext.TaskFile -RepoRoot $RepoRoot -LogFile $RunContext.LogFile
        Write-RunLog -LogFile $RunContext.LogFile -Message 'Codex task invocation completed.'
    }
    else {
        Write-RunLog -LogFile $RunContext.LogFile -Message 'Preview mode complete. Review the task file, then re-run with -InvokeCodex to invoke an installed Codex CLI.'
    }
}
catch {
    $SafeError = Protect-LogText $_.Exception.Message
    Write-Error $SafeError
    exit 1
}
