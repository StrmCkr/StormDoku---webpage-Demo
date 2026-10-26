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
application script is covered by a matching nonce. The inline stylesheet still
uses `unsafe-inline` because the current page keeps its complete CSS in the
document; moving that stylesheet to an external file is the next step if a
fully strict style policy is required.
