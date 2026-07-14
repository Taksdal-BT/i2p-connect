# Releases

This document explains how to verify I2P Connect release artifacts.

## What Is Published

Each release includes:

- installer or package artifacts
- `SHA256SUMS.txt`
- optional detached GPG signature `SHA256SUMS.txt.asc` when signing keys are available

## Verify SHA-256 Checksums

After downloading release files and `SHA256SUMS.txt`, verify hashes.

On Linux or macOS:

```bash
sha256sum -c SHA256SUMS.txt
```

On Windows PowerShell:

```powershell
Get-Content .\SHA256SUMS.txt | ForEach-Object {
  $parts = $_ -split '\s{2,}', 2
  $expected = $parts[0].Trim()
  $filePath = $parts[1].Trim()
  $actual = (Get-FileHash -Algorithm SHA256 -Path $filePath).Hash
  if ($actual -ne $expected) {
    throw "Checksum mismatch for $filePath"
  }
}
```

## Verify Publisher Identity With GPG

If `SHA256SUMS.txt.asc` is published:

1. Import the project public key.
2. Verify the detached signature.

```bash
gpg --import i2p-connect-public-key.asc
gpg --verify SHA256SUMS.txt.asc SHA256SUMS.txt
```

A valid signature means the checksum file was signed by the expected key holder.

## Security Note

Checksums and signatures help verify artifact integrity and publisher identity. They do not guarantee a binary is free from vulnerabilities, exploitation paths, or local runtime compromise.

## Reproducible Build Context

The release workflow sets `SOURCE_DATE_EPOCH` from the Git commit timestamp and uses `npm ci` with pinned Node.js to reduce nondeterministic build output.
