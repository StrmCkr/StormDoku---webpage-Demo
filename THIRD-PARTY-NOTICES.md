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

## tesseract.js-core

- Package: `tesseract.js-core`
- Version: `5.1.1`
- File: `src/ocr/tesseract-core.wasm.js`
- Source: https://github.com/naptha/tesseract.js-core/
- License: Apache License 2.0

## English OCR data

- File: `src/ocr/eng.traineddata.gz`
- Data source: https://github.com/tesseract-ocr/tessdata/
- Download endpoint used for this copy: https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz
- License: Apache License 2.0

The bundled files are distributed unmodified. The applicable license text is
included in `src/ocr/LICENSE-APACHE-2.0.txt`.

## Ocrad.js

- Package: `ocrad.js`
- Version: `0.25` source build
- File: `src/ocr/ocrad.js`
- Source: https://github.com/antimatter15/ocrad.js/
- License: GNU General Public License v3.0 or later

Ocrad.js is used as the direct `file://` fallback because it runs on the main
page without a Web Worker or external language-data fetch. The license text is
included in `src/ocr/LICENSE-OCRAD-GPL-3.0.txt`.
