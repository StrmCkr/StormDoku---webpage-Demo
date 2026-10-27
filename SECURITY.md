# Security Notes

## Local processing

StormDoku is a browser-first application. The optional Scan Image feature
processes the selected image in the browser and does not upload it to a
StormDoku server. OCR assets are bundled in `src/ocr/` and loaded only when
the feature is used.

## Dependency integrity

OCR versions are pinned in `index.html` and documented in
`THIRD-PARTY-NOTICES.md`, including SHA-256 hashes for the bundled assets.
Changes to those assets should update the notices and be reviewed together.

## Content Security Policy

`index.html` applies a CSP covering the bundled scripts, local OCR assets,
same-origin workers, and Blob workers used by direct `file://` execution. The
application JavaScript and stylesheet are loaded as same-origin external
resources, so no inline-script or inline-style allowance is required.

## Offline OCR CSP exception

The bundled Ocrad fallback is a generated OCR runtime that binds compiled
functions through `eval()`. The page CSP therefore includes `script-src
'unsafe-eval'` so direct `file://` OCR remains operational. Tesseract does not
use this fallback permission.
