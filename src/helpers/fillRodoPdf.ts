import { PDFDocument } from 'pdf-lib';
import { loadTemplateBytes, prepareFonts } from './pdfUtils';

export async function fillRodoPdf(
  templatePath: string | ArrayBuffer,
  childName: string,
  parentName: string,
  miejscowosc?: string,
  opts?: { fontUrl?: string; debug?: boolean; tickWizerunek?: boolean; tickRodo?: boolean; preferAdult?: boolean }
) {
  const existingPdfBytes = await loadTemplateBytes(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes as ArrayBuffer);
  const form = pdfDoc.getForm();

  const { font, ubuntuFont } = await prepareFonts(pdfDoc, opts?.fontUrl);

  const safeSet = (name: string, text: string) => { try { form.getTextField(name).setText(text); } catch {} };

  const d = new Date();
  const formatted = `${miejscowosc ?? ''}${miejscowosc ? ', ' : ''}${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  safeSet('Miejscowosc_i_data_wypelnienia', formatted);

  if (!opts?.preferAdult) {
    safeSet('Imie_nazwisko_rodzica', parentName ?? '');

    const childCandidates = ['Dane_dziecka', 'Imie_nazwisko_dziecka', 'imie_nazwisko_dziecka', 'Imie_Imiona_urzad'];
    for (const cn of childCandidates) {
      try {
        const tf = form.getTextField(cn);
        if (cn === 'Imie_Imiona_urzad') {
          const parts = String(childName ?? '').trim().split(/\s+/);
          const first = parts.slice(0, -1).join(' ') || parts[0] || '';
          const last = parts.length > 1 ? parts[parts.length - 1] : '';
          tf.setText(first);
          try { form.getTextField('Nazwisko').setText(last); } catch {}
        } else {
          tf.setText(childName ?? '');
        }
        break;
      } catch {}
    }
  }

  const tick = (name: string) => { try { form.getCheckBox(name).check(); } catch {} };
  if (opts?.tickWizerunek ?? true) tick(opts?.preferAdult ? 'Pelnoletni_wizerunek_check' : 'Niepelnoletni_wizerunek_check');
  if (opts?.tickRodo ?? true) tick(opts?.preferAdult ? 'Pelnoletni_rodo_check' : 'Niepelnoletni_rodo_check');

  if (opts?.preferAdult) {
    safeSet('Imie_nazwisko', parentName ?? childName ?? '');
    if (opts?.tickWizerunek ?? true) tick('Pelnoletni_wizerunek_check');
    if (opts?.tickRodo ?? true) tick('Pelnoletni_rodo_check');
  }

  try { form.updateFieldAppearances((ubuntuFont || font) as any); } catch {}
  try { form.flatten(); } catch {}

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
