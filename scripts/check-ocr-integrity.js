const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const expected = {
  'src/ocr/tesseract.min.js': 'A8E29918D098B2B06E1012BDAEFFB4AEC0445C5D5654709023E0BD1F442A80E8',
  'src/ocr/worker.min.js': 'ACA1229639FC9907D86F96E825955A2B7C5716D17F3BC3ACD71F9C7AB66181FC',
  'src/ocr/tesseract-core.wasm.js': '2B8C8C92B8788807061FB4BB16C5ACDF000C149E100255F879F78D2C58CA9969',
  'src/ocr/eng.traineddata.gz': 'ED350F3752F81EE8F38769EDC14D92D997DABABE23B565C59879372CC46A2468',
  'src/ocr/ocrad.js': 'EFCAA129E524217FFD21BD26DBD9A091C30B7B3E20EE9AB77BE4C4A9F3FB9DB8',
};

for (const [relativePath, expectedHash] of Object.entries(expected)) {
  const file = path.join(__dirname, '..', relativePath);
  const actualHash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
  if (actualHash !== expectedHash) {
    throw new Error(`OCR integrity mismatch: ${relativePath}`);
  }
}

console.log(`OCR integrity verified: ${Object.keys(expected).length} bundled assets.`);
