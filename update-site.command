#!/bin/bash
# update-site.command — Barbara’s Academy of Dance site updater
# Double-click after downloading a site update zip from Claude to ~/Downloads.
# It copies the new pages in, commits, and pushes — Vercel redeploys automatically.
set -e
cd "$(dirname "$0")"
REPO="$(pwd)"

GIT="$(command -v git || true)"
if [ -z "$GIT" ]; then
  GIT="/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin/git"
fi
if [ ! -x "$GIT" ]; then
  echo "Could not find git. Install GitHub Desktop or Xcode command line tools."
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi

# Newest matching zip in Downloads
ZIP="$(ls -t "$HOME/Downloads"/barbaras-site*.zip "$HOME/Downloads"/Barbara*Website*.zip 2>/dev/null | head -1 || true)"
if [ -z "$ZIP" ]; then
  echo "No update zip found in ~/Downloads."
  echo "(Looking for barbaras-site*.zip or Barbara's Academy of Dance Website*.zip)"
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi
echo "Using: $(basename "$ZIP")"
rm -rf /tmp/barbaras-update && mkdir -p /tmp/barbaras-update
unzip -oq "$ZIP" -d /tmp/barbaras-update
rm -rf /tmp/barbaras-update/__MACOSX

# Site root = folder holding the shallowest .html file (zip may wrap files in a folder)
FIRST="$(find /tmp/barbaras-update -name '*.html' | awk -F/ '{print NF"\t"$0}' | sort -n | head -1 | cut -f2-)"
if [ -z "$FIRST" ]; then
  echo "No site files found in the download."
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi
SRC="$(dirname "$FIRST")"

COUNT=0
while IFS= read -r -d '' f; do
  rel="${f#$SRC/}"
  mkdir -p "$REPO/$(dirname "$rel")"; cp "$f" "$REPO/$rel"
  echo "  updated: $rel"
  COUNT=$((COUNT+1))
done < <(find "$SRC" -type f \( -name '*.html' -o -name '*.js' -o -name '*.pdf' -o -name '*.png' -o -name '*.jpg' -o -name '*.jpeg' -o -name '*.webp' -o -name '*.ico' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' -o -name '*.ics' -o -name '*.command' \) -print0)
chmod +x "$REPO/update-site.command" 2>/dev/null || true

"$GIT" add -A
if "$GIT" diff --cached --quiet; then
  echo "Files are identical to what's already live — nothing to update."
  read -n 1 -s -r -p "Press any key to close..."; exit 0
fi
"$GIT" commit -m "Site update $(date '+%Y-%m-%d %H:%M')"

"$GIT" pull --rebase --autostash || true
if "$GIT" push; then
  echo ""
  echo "✅ Pushed $COUNT files. Vercel is redeploying — check barbarasdancestudio.com in ~1 minute."
  mkdir -p "$HOME/Downloads/Installed site updates"
  mv "$ZIP" "$HOME/Downloads/Installed site updates/" 2>/dev/null || true
else
  echo ""
  echo "Commit made, but push needs GitHub Desktop. Opening it now —"
  echo "just click 'Push origin' at the top."
  open -a "GitHub Desktop" . || true
fi
read -n 1 -s -r -p "Press any key to close..."
