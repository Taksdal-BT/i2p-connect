$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$Failures = [System.Collections.Generic.List[string]]::new()

$RiskPatterns = @(
    @{ Name = 'Zoom-like real-time video claim'; Pattern = '(?i)\bZoom[- ]like\s+real[- ]time\s+video\b|\breal[- ]time\s+video\b|\bZoom\s+clone\b' },
    @{ Name = 'guaranteed anonymity claim'; Pattern = '(?i)\bguaranteed\s+anonymity\b' },
    @{ Name = 'full E2EE claim'; Pattern = '(?i)\bfull\s+E2EE\b' },
    @{ Name = 'SASE claim'; Pattern = '(?i)\bSASE\b' },
    @{ Name = 'zero-trust claim'; Pattern = '(?i)\bzero[- ]trust\b' }
)

$AllowedContextPattern = '(?i)\b(not implemented|future|experimental|rejected|limited|not promised|does not promise|do not promise|must not promise|not a|unless implemented|until implemented|before implementation|without implementation|unsupported|avoid|prohibited|non-goal|non-claim|not claim|does not claim|do not claim|must not claim)\b'

$ScannedFiles = Get-ChildItem -LiteralPath $RepoRoot -Recurse -File |
    Where-Object {
        $_.FullName -notmatch '\\.git\\' -and
        $_.Extension.ToLowerInvariant() -in @('.md', '.json')
    }

foreach ($File in $ScannedFiles) {
    $RelativeFile = [System.IO.Path]::GetRelativePath($RepoRoot, $File.FullName)
    $Lines = Get-Content -LiteralPath $File.FullName

    for ($Index = 0; $Index -lt $Lines.Count; $Index++) {
        $Line = $Lines[$Index]
        foreach ($Risk in $RiskPatterns) {
            if ($Line -match $Risk.Pattern -and $Line -notmatch $AllowedContextPattern) {
                [void]$Failures.Add("${RelativeFile}:$($Index + 1) contains unsupported $($Risk.Name): $Line")
            }
        }
    }
}

if ($Failures.Count -gt 0) {
    Write-Host 'Release claim check failed:'
    foreach ($Failure in $Failures) {
        Write-Host " - $Failure"
    }
    exit 1
}

Write-Host 'Release claim check passed.'
