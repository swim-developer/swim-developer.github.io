#!/bin/bash
set -euo pipefail

DECK="/Users/marcelosales/RedHat/rhone/presentations/SFG-SLIDE-DECK.md"
SVG_DIR="/Users/marcelosales/RedHat/rhone/presentations/slides/svg"
IMG_DIR="/Users/marcelosales/RedHat/rhone/presentations/slides/images"

mkdir -p "$SVG_DIR" "$IMG_DIR"

SLIDE_NAME=""
IN_SVG=false
SVG_CONTENT=""
COUNT=0

while IFS= read -r line; do
  if [[ "$line" =~ ^##\ SLIDE\ (.+) ]]; then
    raw="${BASH_REMATCH[1]}"
    SLIDE_NAME=$(echo "$raw" | sed 's/ — /--/g; s/[^a-zA-Z0-9_-]/-/g; s/--*/-/g; s/-$//g' | tr '[:upper:]' '[:lower:]')
  fi

  if [[ "$line" == '```svg' ]]; then
    IN_SVG=true
    SVG_CONTENT=""
    continue
  fi

  if $IN_SVG; then
    if [[ "$line" == '```' ]]; then
      IN_SVG=false
      COUNT=$((COUNT + 1))
      PADDED=$(printf "%02d" $COUNT)
      FILENAME="slide-${PADDED}-${SLIDE_NAME}"

      echo "$SVG_CONTENT" > "${SVG_DIR}/${FILENAME}.svg"
      echo "Extracted: ${FILENAME}.svg"
    else
      SVG_CONTENT="${SVG_CONTENT}${line}
"
    fi
  fi
done < "$DECK"

echo ""
echo "Total SVGs extracted: $COUNT"
echo ""
echo "Converting to PNG with rsvg-convert (2x scale for retina)..."
echo ""

for svg_file in "${SVG_DIR}"/*.svg; do
  base=$(basename "$svg_file" .svg)
  rsvg-convert -w 2560 -h 1440 --background-color=transparent "$svg_file" -o "${IMG_DIR}/${base}.png"
  echo "Converted: ${base}.png"
done

echo ""
echo "Done. $COUNT PNGs in ${IMG_DIR}/"
