import { PDFDocument } from 'pdf-lib';
import { loadTemplateBytes, prepareFonts } from './pdfUtils';

type Values = Record<string, unknown>;

export default async function fillDeklaracjaPdf(templatePath: string | ArrayBuffer, values: Values, opts?: { fillZgodaRodzica?: boolean; fontUrl?: string }) {
  const existingPdfBytes = await loadTemplateBytes(templatePath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes as ArrayBuffer);
  const form = pdfDoc.getForm();

  const { font, ubuntuFont } = await prepareFonts(pdfDoc, opts?.fontUrl);

  const safeSet = (name: string, text: string) => {
    try { form.getTextField(name).setText(text); } catch {}
  };

  const map: Record<string, string> = {
    miejscowosc_i_data_wypelnienia: 'Miejscowosc_i_data_wypelnienia',
    imiona: 'Imie_Imiona_urzad',
    nazwisko: 'Nazwisko',
    preferowane_imiona: 'Imie_Imiona_preferowane',
    preferowane_nazwisko: 'Nazwisko_preferowane',
    zaimki: 'Zaimki',
    numer_telefonu: 'Numer_telefonu',
    telefon: 'Numer_telefonu',
    numer_telefonu_alias: 'Numer_telefonu',
    adres_email: 'Adres_e_mail',
    email: 'Adres_e_mail',
    e_mail: 'Adres_e_mail',
    wojewodztwo: 'Wojewodztwo',
    uczelnia: 'Uczelnia_Szkola',
    kod_pocztowy: 'Kod_pocztowy',
    miejscowosc: 'Miejscowosc',
    powiat: 'Powiat',
    ulica: 'Ulica_i_numer',
  };

  for (const [key, pdfName] of Object.entries(map)) {
    const v = values[key] ?? values[key.toLowerCase()] ?? '';
    if (!v) continue;
    safeSet(pdfName, String(v));
  }

  // Miejscowosc + date
  {
    const miejsc = String(values['miejscowosc'] ?? values['Miejscowosc'] ?? '');
    const d = new Date();
    const formatted = `${miejsc}${miejsc ? ', ' : ''}${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    safeSet('Miejscowosc_i_data_wypelnienia', formatted);
  }

  // PESEL digits
  {
    const pesel = String(values['pesel'] ?? values['PESEL'] ?? '');
    for (let i = 0; i < pesel.length && i <= 10; i++) safeSet(`PESEL_${i}`, pesel[i] ?? '');
  }

  // SEJM two-char fields
  {
    const sejm = String(values['nr_okregu'] ?? values['nr_okregu_alias'] ?? values['sejm'] ?? values['SEJM'] ?? '').trim();
    for (let i = 0; i < 2; i++) safeSet(`SEJM_${i}`, sejm[i] ?? '');
  }

  // checkboxes
  try { form.getCheckBox('Check_rodo').check(); } catch {}
  try {
    const zgoda = Boolean(opts?.fillZgodaRodzica ?? values['zgoda_rodzica'] ?? values['Check_zgoda_rodzica'] ?? false);
    const cb = form.getCheckBox('Check_zgoda_rodzica');
    if (zgoda) cb.check(); else cb.uncheck();
  } catch {}

  // update appearances and flatten
  try { form.updateFieldAppearances((ubuntuFont || font) as any); } catch {}
  try { form.flatten(); } catch {}

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
