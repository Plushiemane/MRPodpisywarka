import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function listFields() {
  const p = path.resolve('./src/assets/Zgoda_na_przetwarzanie_danych_osobowych.pdf');
  const bytes = await fs.readFile(p);
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log('Found', fields.length, 'fields:');
  for (const f of fields) {
    try {
      const name = f.getName?.() ?? '<unknown>';
      console.log('-', name);
    } catch (e) {
      console.log('- <error reading name>');
    }
  }
}

listFields().catch(err => { console.error(err); process.exit(1); });
