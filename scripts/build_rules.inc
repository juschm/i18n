#!/usr/bin/false
# -*- mode: sh; -*- vim: set filetype=sh:
#
# To be sourced and NOT to be run directly.

if [[ -z "$BUILD_DIR" ]]; then
  echo Error: BUILD_DIR is not set.
  exit 1
fi

run_tsc() {
  ./node_modules/.bin/tsc \
      --noEmitOnError \
      --target ES5 \
      --module commonjs \
      --declaration \
      --sourceMap \
      --noLib \
      ./node_modules/typescript/bin/lib.es6.d.ts \
      ./typings/node/node.d.ts \
      --rootDir "$PWD" \
      --outDir "$BUILD_DIR" \
      "$@"
}

run_browserify_with_minify() {
  [[ -z "$IN" ]]  && { echo  IN is not set. ; exit 1 ; }
  [[ -z "$OUT" ]] && { echo OUT is not set. ; exit 1 ; }
  ./node_modules/.bin/browserify \
      "$IN" \
      --debug \
      -p [minifyify --map "$OUT.map" --output "$OUT.map" ] \
      -o "$OUT"

  # Fix up recursive source-maps with sorcery.
  # sorcery has an issue where it can't seem to get the relative path right so we
  # have to do this trickery to fix it.
  local BASENAME="${OUT//*\//}"
  cp "$OUT" "./$BASENAME" && \
    ./node_modules/.bin/sorcery -i "$BASENAME" -o "$OUT" && \
    rm "./$BASENAME"
}
