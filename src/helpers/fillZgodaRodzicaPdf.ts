import { PDFDocument } from 'pdf-lib';
import { loadTemplateBytes, prepareFonts } from './pdfUtils';

export async function fillZgodaRodzicaPdf(
  templatePath: string | ArrayBuffer,
  childName: string,
  miejscowosc?: string,
  opts?: { fontUrl?: string; debug?: boolean; parentName?: string; tickWizerunek?: boolean; tickRodo?: boolean }
) {
  const existingPdfBytes = await loadTemplateBytes(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes as ArrayBuffer);
  const form = pdfDoc.getForm();

  const { font, ubuntuFont } = await prepareFonts(pdfDoc, opts?.fontUrl);



  const d = new Date();
  const formatted = `${miejscowosc ?? ''}${miejscowosc ? ', ' : ''}${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  // try a few likely names
  for (const name of ['Miejscowosc_i_data_wypelnienia', 'Miejscowosc']) {
    try { form.getTextField(name).setText(formatted); break; } catch {}
  }

  try { form.getTextField('Dane_dziecka').setText(childName ?? ''); } catch {}
  if (opts?.parentName) try { form.getTextField('Imie_nazwisko_rodzica').setText(opts.parentName); } catch {}

  const tick = (name: string) => { try { form.getCheckBox(name).check(); } catch {} };
  if (opts?.tickWizerunek ?? true) tick('Niepelnoletni_wizerunek_check');
  if (opts?.tickRodo ?? true) tick('Niepelnoletni_rodo_check');

  try { form.updateFieldAppearances((ubuntuFont || font) as any); } catch {}
  try { form.flatten(); } catch {}

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
