import { useState } from 'react';
import { FormAll } from './assets/form_all';
import fillDeklaracjaPdf, { fillZgodaRodzicaPdf, fillRodoPdf, generateAndDownloadPdf } from './helpers/helpers';
import { ensureFontkit } from './helpers/pdfFonts';
import pdfTemplateUrl from './assets/Deklaracja_czlonkowska.pdf?url';
import consentParentUrl from './assets/Zgoda_rodzica_na_czlonkostwo.pdf?url';
import consentRodoUrl from './assets/Zgoda_na_przetwarzanie_danych_osobowych.pdf?url';

export default function Over14() {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function handleFormChange(values: Partial<typeof formValues>) {
    setFormValues(values as Record<string, any>);
    console.log(values);
  }

  async function handleGeneratePdf() {
    setError(null);
    setLoading(true);
    try {
      const templatePath = String(pdfTemplateUrl);
      await ensureFontkit();
      await generateAndDownloadPdf(
        fillDeklaracjaPdf,
        [templatePath, formValues, { fillZgodaRodzica: true, fontUrl: '/assets/NotoSans-Regular.ttf' }],
        'Deklaracja_filled.pdf'
      );
    } catch (e: any) {
      console.error(e);
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadParentConsent() {
    setError(null);
    setLoading(true);
    try {
      const childName = `${formValues.imiona ?? ''} ${formValues.nazwisko ?? ''}`.trim();
      const miejsc = String(formValues['miejscowosc'] ?? formValues['Miejscowosc'] ?? '');
      await ensureFontkit();
      const parentFull = String(formValues['imie_nazwisko_rodzica'] ?? '');
      await generateAndDownloadPdf(
        fillZgodaRodzicaPdf,
        [
          String(consentParentUrl),
          childName,
          miejsc,
          { fontUrl: '/assets/NotoSans-Regular.ttf', debug: true, parentName: parentFull, tickWizerunek: true, tickRodo: true }
        ],
        'Zgoda_rodzica_filled.pdf'
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
      const miejsc = String(formValues['miejscowosc'] ?? formValues['Miejscowosc'] ?? '');
      const parentFull = String(formValues['imie_nazwisko_rodzica'] ?? '');
      const childName = `${formValues.imiona ?? ''} ${formValues.nazwisko ?? ''}`.trim();
      await ensureFontkit();
      await generateAndDownloadPdf(
        fillRodoPdf,
        [
          String(consentRodoUrl),
          childName,
          parentFull,
          miejsc,
          { fontUrl: '/assets/NotoSans-Regular.ttf', debug: true, preferAdult: false, tickWizerunek: true, tickRodo: true }
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
        <h2>Formularz dla osób powyżej 14 lat</h2>
        <FormAll onChange={handleFormChange} />
        <div style={{ marginTop: 8 }}>
          <label>Imię i nazwisko rodzica/opiekuna prawnego<br />
            <input type="text" name="imie_nazwisko_rodzica" value={formValues['imie_nazwisko_rodzica'] ?? ''} onChange={(e) => handleFormChange({ ...(formValues), imie_nazwisko_rodzica: e.target.value })} />
          </label>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="btn-row">
            <button className="btn-primary" onClick={handleGeneratePdf} disabled={loading || !isComplete(formValues)}>
              {loading ? 'Generowanie...' : 'Generuj Deklarację'}
            </button>
            <button className="btn-primary" onClick={handleDownloadParentConsent} disabled={loading || !formValues.imiona || !formValues.nazwisko}>
              {loading ? 'Generowanie...' : 'Pobierz Zgodę rodzica'}
            </button>
            <button className="btn-primary" onClick={handleDownloadRodo} disabled={loading || !formValues.imie_nazwisko_rodzica || !formValues.imiona || !formValues.nazwisko}>
              {loading ? 'Generowanie...' : 'Pobierz Zgodę RODO'}
            </button>
          </div>
          {error && <div style={{ color: 'crimson' }}>Błąd: {error}</div>}
        </div>
      </div>
    </>
  );
}
