# Third-Party Notices

StormDoku includes the following locally bundled OCR assets under `src/ocr/`.
They are used by the optional **Scan Image** feature and are distributed with
the project so the feature works without a network connection.

## Tesseract.js

- Package: `tesseract.js`
- Version: `5.1.1`
- Files: `src/ocr/tesseract.min.js`, `src/ocr/worker.min.js`
- Source: https://github.com/naptha/tesseract.js/
- License: Apache License 2.0

SHA-256:

- `src/ocr/tesseract.min.js`: `A8E29918D098B2B06E1012BDAEFFB4AEC0445C5D5654709023E0BD1F442A80E8`
- `src/ocr/worker.min.js`: `ACA1229639FC9907D86F96E825955A2B7C5716D17F3BC3ACD71F9C7AB66181FC`

## tesseract.js-core

- Package: `tesseract.js-core`
- Version: `5.1.1`
- File: `src/ocr/tesseract-core.wasm.js`
- Source: https://github.com/naptha/tesseract.js-core/
- License: Apache License 2.0

SHA-256: `2B8C8C92B8788807061FB4BB16C5ACDF000C149E100255F879F78D2C58CA9969`

## English OCR data

- File: `src/ocr/eng.traineddata.gz`
- Data source: https://github.com/tesseract-ocr/tessdata/
- Download endpoint used for this copy: https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz
- License: Apache License 2.0

SHA-256: `ED350F3752F81EE8F38769EDC14D92D997DABABE23B565C59879372CC46A2468`

The bundled files are distributed unmodified. The applicable license text is
included in `src/ocr/LICENSE-APACHE-2.0.txt`.

## Ocrad.js

- Package: `ocrad.js`
- Version: `0.25` source build
- File: `src/ocr/ocrad.js`
- Source: https://github.com/antimatter15/ocrad.js/
- License: GNU General Public License v3.0 or later

SHA-256: `EFCAA129E524217FFD21BD26DBD9A091C30B7B3E20EE9AB77BE4C4A9F3FB9DB8`

Ocrad.js is used as the direct `file://` fallback because it runs on the main
page without a Web Worker or external language-data fetch. The license text is
included in `src/ocr/LICENSE-OCRAD-GPL-3.0.txt`.
