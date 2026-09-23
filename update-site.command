#!/bin/bash
# update-site.command — Barbara’s Academy of Dance site updater
# Lives in your barbaras-site repo folder. Double-click after downloading a new
# barbaras-site zip from Claude to ~/Downloads. It copies the new pages in,
# commits, and pushes — Vercel redeploys automatically.
set -e
cd "$(dirname "$0")"

# Locate git (falls back to GitHub Desktop's bundled copy)
GIT="$(command -v git || true)"
if [ -z "$GIT" ]; then
  GIT="/Applications/GitHub Desktop.app/Contents/Resources/app/git/bin/git"
fi
if [ ! -x "$GIT" ]; then
  echo "Could not find git. Install GitHub Desktop or Xcode command line tools."
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi

# Find the newest downloaded bundle (zip or unzipped folder)
SRC=""
ZIP="$(ls -t "$HOME/Downloads"/barbaras-site*.zip 2>/dev/null | head -1)"
if [ -n "$ZIP" ]; then
  rm -rf /tmp/barbaras-update && mkdir -p /tmp/barbaras-update
  unzip -oq "$ZIP" -d /tmp/barbaras-update
  SRC=/tmp/barbaras-update
elif [ -d "$HOME/Downloads/barbaras-site" ]; then
  SRC="$HOME/Downloads/barbaras-site"
else
  echo "No barbaras-site zip or folder found in ~/Downloads."
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi

# Copy every page and asset (html, pdf, images) into the repo
COUNT=0
while IFS= read -r -d '' f; do
  rel="${f#$SRC/}"; rel="${rel#barbaras-site/}"; mkdir -p "$(dirname "$rel")"; cp "$f" "$rel"
  echo "  updated: $(basename "$f")"
  COUNT=$((COUNT+1))
done < <(find "$SRC" \( -name '*.html' -o -name '*.js' -o -name '*.pdf' -o -name '*.png' -o -name '*.jpg' -o -name '*.ico' -o -name '*.json' -o -name '*.xml' -o -name '*.txt' -o -name '*.ics' \) -print0)
if [ "$COUNT" -eq 0 ]; then
  echo "No site files found in the download."
  read -n 1 -s -r -p "Press any key to close..."; exit 1
fi

# Commit
"$GIT" add -A
if "$GIT" diff --cached --quiet; then
  echo "Files are identical to what's already live — nothing to update."
  read -n 1 -s -r -p "Press any key to close..."; exit 0
fi
"$GIT" commit -m "Site update $(date '+%Y-%m-%d %H:%M')"

# Pull any remote changes first (so the push isn't rejected), then push
"$GIT" pull --rebase --autostash || true
if "$GIT" push; then
  echo ""
  echo "✅ Pushed. Vercel is redeploying — check barbarasdancestudio.com in ~1 minute."
else
  echo ""
  echo "Commit made, but push needs GitHub Desktop. Opening it now —"
  echo "just click 'Push origin' at the top."
  open -a "GitHub Desktop" . || true
fi
read -n 1 -s -r -p "Press any key to close..."
