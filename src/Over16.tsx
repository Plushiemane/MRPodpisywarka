import { useState } from 'react';
import { FormAll } from './assets/form_all';
import fillDeklaracjaPdf, { fillRodoPdf, generateAndDownloadPdf } from './helpers/helpers';
import { ensureFontkit } from './helpers/pdfFonts';
import pdfTemplateUrl from './assets/Deklaracja_czlonkowska.pdf?url';
import consentRodoUrl from './assets/Zgoda_na_przetwarzanie_danych_osobowych.pdf?url';

export default function Over16() {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFormChange(values: Partial<typeof formValues>) {
    setFormValues(values as Record<string, any>);
    console.log(values);
  }

  const requiredFields = [
    'imiona','nazwisko','preferowane_imiona','preferowane_nazwisko','pesel','zaimki',
    'telefon','email','wojewodztwo','nr_okregu','uczelnia','kod_pocztowy','miejscowosc','powiat','ulica'
  ];

  const isComplete = (vals: Record<string, any>) => {
    for (const k of requiredFields) {
      const v = vals[k] ?? vals[k.toLowerCase()] ?? '';
      if (String(v).trim() === '') return false;
    }
    return true;
  };

  async function handleGeneratePdf() {
    setError(null);
    setLoading(true);
    try {
      const templatePath = String(pdfTemplateUrl);
      await ensureFontkit();
      await generateAndDownloadPdf(
        fillDeklaracjaPdf,
        [templatePath, formValues, { fillZgodaRodzica: false, fontUrl: '/assets/NotoSans-Regular.ttf' }],
        'Deklaracja_filled.pdf'
      );
    } catch (e: any) {
      console.error(e);
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadRodo() {
    setError(null);
    setLoading(true);
    try {
      const childName = `${formValues.imiona ?? ''} ${formValues.nazwisko ?? ''}`.trim();
      const miejsc = String(formValues['miejscowosc'] ?? formValues['Miejscowosc'] ?? '');
      await ensureFontkit();
      await generateAndDownloadPdf(
        fillRodoPdf,
        [
          String(consentRodoUrl),
          childName,
          childName,
          miejsc,
          { fontUrl: '/assets/NotoSans-Regular.ttf', debug: true, preferAdult: true, tickWizerunek: true, tickRodo: true }
        ],
        'Zgoda_RODO_filled.pdf'
      );
    } catch (e: any) {
      console.error(e);
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <h2>Formularz dla osób powyżej 16 lat</h2>
        <FormAll onChange={handleFormChange} />
        <div style={{ marginTop: 12 }}>
          <div style={{ marginTop: 12 }} className="btn-row">
            <button className="btn-primary" onClick={handleGeneratePdf} disabled={loading || !isComplete(formValues)}>{loading ? 'Generowanie...' : 'Generuj PDF'}</button>
            <button className="btn-primary" onClick={handleDownloadRodo} disabled={loading || !formValues.imiona || !formValues.nazwisko}>{loading ? 'Generowanie...' : 'Pobierz Zgodę RODO'}</button>
          </div>
          {error && <div style={{ color: 'crimson' }}>Błąd: {error}</div>}
        </div>
      </div>
    </>
  );
}
