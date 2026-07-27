#!/usr/bin/env bash
set -euo pipefail

WIKI_DIR="${1:-$HOME/wiki/raw/Project ideas 1}"
OUTPUT_FILE="src/data/projects.yaml"

if [ ! -d "$WIKI_DIR" ]; then
  echo "Error: Wiki directory not found at $WIKI_DIR" >&2
  exit 1
fi

echo "Seeding $OUTPUT_FILE from $WIKI_DIR..."

{
  echo "# Seeded from wiki on $(date -I)"
  echo ""
  echo "---"

  id=1
  for category_dir in "$WIKI_DIR"/*/; do
    [ -d "$category_dir" ] || continue
    category=$(basename "$category_dir")
    category_lower=$(echo "$category" | tr '[:upper:]' '[:lower:]')

    if [[ ! "$category_lower" =~ ^(fun|learning|useful)$ ]]; then
      continue
    fi

    for file in "$category_dir"*.md; do
      [ -f "$file" ] || continue

      filename=$(basename "$file" .md)
      title="$filename"

      # Try to extract first H1
      h1=$(grep -m1 '^# ' "$file" 2>/dev/null | sed 's/^# //' || true)
      if [ -n "$h1" ]; then
        title="$h1"
      fi

      # Read first non-empty, non-header line as description candidate
      description=$(grep -v '^#\|^$' "$file" | head -n1 || true)
      description=$(echo "$description" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
      if [ ${#description} -gt 120 ]; then
        description="${description:0:117}..."
      fi

      # Compute relative path from repo root
      rel_path="${WIKI_DIR/#$HOME\/}"

      echo ""
      echo "- id: $id"
      echo "  title: \"$title\""
      echo "  status: backlog"
      echo "  category: $category_lower"
      echo "  tech: []"
      echo "  description: \"$description\""
      echo "  github: null"
      echo "  source: \"$rel_path\""

      id=$((id + 1))
    done
  done
} > "$OUTPUT_FILE"

echo "Done. Seeded $((id - 1)) projects into $OUTPUT_FILE"
