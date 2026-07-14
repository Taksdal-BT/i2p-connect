#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LINUX_ARTIFACT_ROOT="$REPO_ROOT/dist/linux"
CHECKSUM_PATH="$LINUX_ARTIFACT_ROOT/SHA256SUMS.txt"

new_deterministic_placeholder_installer() {
  local root_path="$1"
  mkdir -p "$root_path"
  local placeholder_path="$root_path/i2p-connect-linux-installer-placeholder.txt"
  cat > "$placeholder_path" <<'EOF'
I2P Connect Linux Packaging Placeholder
This placeholder exists because electron-builder is not installed in this workspace yet.
Install electron-builder and rerun scripts/build-linux.sh to produce real AppImage and deb artifacts.
EOF
}

cd "$REPO_ROOT"
npm run build

mkdir -p "$LINUX_ARTIFACT_ROOT"

can_use_electron_builder=false
if command -v npx >/dev/null 2>&1; then
  if npx --no-install electron-builder --version >/dev/null 2>&1; then
    can_use_electron_builder=true
  fi
fi

if [[ "$can_use_electron_builder" == "true" ]]; then
  npx --no-install electron-builder --config build/linux-config.json --linux
else
  echo "electron-builder is not installed locally; generating deterministic placeholder artifact for scaffold validation."
  new_deterministic_placeholder_installer "$LINUX_ARTIFACT_ROOT"
fi

mapfile -t installer_artifacts < <(find "$LINUX_ARTIFACT_ROOT" -type f \( -name '*.AppImage' -o -name '*.deb' -o -name '*.txt' \) ! -name 'SHA256SUMS.txt' | sort)

if [[ "${#installer_artifacts[@]}" -eq 0 ]]; then
  echo "No Linux installer artifacts were found to hash." >&2
  exit 1
fi

(
  cd "$LINUX_ARTIFACT_ROOT"
  for artifact in "${installer_artifacts[@]}"; do
    relative_path="${artifact#$LINUX_ARTIFACT_ROOT/}"
    sha256sum "$relative_path"
  done
) > "$CHECKSUM_PATH"

# TODO: CI release stage should generate detached signature for checksum publication.
# Example: gpg --detach-sign --armor "$CHECKSUM_PATH"

echo "Linux packaging artifacts prepared in $LINUX_ARTIFACT_ROOT"
echo "SHA-256 checksum file written to $CHECKSUM_PATH"
