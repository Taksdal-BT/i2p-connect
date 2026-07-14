$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$RepoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$WindowsArtifactRoot = Join-Path $RepoRoot 'dist/win'
$ChecksumPath = Join-Path $WindowsArtifactRoot 'SHA256SUMS.txt'

function Test-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)][string]$Name
    )

    return $null -ne (Get-Command -Name $Name -ErrorAction SilentlyContinue)
}

function New-DeterministicPlaceholderInstaller {
    param(
        [Parameter(Mandatory = $true)][string]$RootPath
    )

    New-Item -ItemType Directory -Path $RootPath -Force | Out-Null
    $PlaceholderPath = Join-Path $RootPath 'i2p-connect-windows-installer-placeholder.txt'
    @(
        'I2P Connect Windows Packaging Placeholder',
        'This placeholder exists because electron-builder is not installed in this workspace yet.',
        'Install electron-builder and rerun scripts/build-windows.ps1 to produce a real NSIS installer.'
    ) | Set-Content -LiteralPath $PlaceholderPath -Encoding utf8

    return $PlaceholderPath
}

Push-Location $RepoRoot
try {
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }

    New-Item -ItemType Directory -Path $WindowsArtifactRoot -Force | Out-Null

    $canUseElectronBuilder = $false
    if (Test-CommandAvailable -Name 'npx') {
        & npx --no-install electron-builder --version *> $null
        $canUseElectronBuilder = $LASTEXITCODE -eq 0
    }

    if ($canUseElectronBuilder) {
        & npx --no-install electron-builder --config build/win-config.json --win nsis
        if ($LASTEXITCODE -ne 0) {
            exit $LASTEXITCODE
        }

        # TODO: CI release stage should invoke signtool here against generated installer artifacts.
        # Example: signtool sign /fd SHA256 /a /tr http://timestamp.digicert.com /td SHA256 <installer-path>
    }
    else {
        Write-Host 'electron-builder is not installed locally; generating deterministic placeholder artifact for scaffold validation.'
        [void](New-DeterministicPlaceholderInstaller -RootPath $WindowsArtifactRoot)
    }

    $installerArtifacts = @(Get-ChildItem -Path $WindowsArtifactRoot -File -Recurse |
        Where-Object { $_.Extension -in '.exe', '.msi', '.txt' -and $_.Name -ne 'SHA256SUMS.txt' } |
        Sort-Object FullName)

    if ($installerArtifacts.Count -eq 0) {
        throw 'No Windows installer artifacts were found to hash.'
    }

    $hashLines = @()
    foreach ($artifact in $installerArtifacts) {
        $hash = Get-FileHash -LiteralPath $artifact.FullName -Algorithm SHA256
        $relativePath = [System.IO.Path]::GetRelativePath($WindowsArtifactRoot, $artifact.FullName)
        $hashLines += "$($hash.Hash)  $relativePath"
    }

    Set-Content -LiteralPath $ChecksumPath -Value $hashLines -Encoding utf8

    Write-Host "Windows packaging artifacts prepared in $WindowsArtifactRoot"
    Write-Host "SHA-256 checksum file written to $ChecksumPath"

    if ($LASTEXITCODE -ne 0) {
        $global:LASTEXITCODE = 0
    }
}
finally {
    Pop-Location
}
