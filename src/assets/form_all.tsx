import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { okregiSejm } from '../numeryokregow';

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

type FormAllProps = {
  onChange?: (values: Record<string, string>) => void;
  values?: Record<string, string>;
};

export function FormAll({ values: initialValues = {}, onChange }: FormAllProps) {
  const [values, setValues] = useState<Record<string, string>>({
    imiona: '',
    nazwisko: '',
    imie_nazwisko_rodzica: '',
    preferowane_imiona: '',
    preferowane_nazwisko: '',
    pesel: '',
    zaimki: '',
    telefon: '',
    email: '',
    wojewodztwo: '',
    nr_okregu: '',
    uczelnia: '',
    kod_pocztowy: '',
    miejscowosc: '',
    powiat: '',
    ulica: '',
    ...initialValues
  });

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [postalSuggestions, setPostalSuggestions] = useState<any[]>([]);
  const [showPostalSuggestions, setShowPostalSuggestions] = useState(false);

  const notifyParent = (updated: Record<string, string>) => {
    if (onChange) onChange(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...values, [name]: value };
    setValues(updated);
    notifyParent(updated);

    if (name === 'miejscowosc') {
      setShowSuggestions(false);
    }
    if (name === 'kod_pocztowy') {
      setShowPostalSuggestions(false);
    }
  };

  // react-query will handle fetching and caching. We'll watch the debounced input below.

  const handleSelectSuggestion = (item: any) => {
    const updated = { ...values };
    if (item.nazwa) updated.miejscowosc = item.nazwa;
    // powiat may be an object ({ nazwa }) or a string
    if (item.powiat) {
      if (typeof item.powiat === 'string') updated.powiat = item.powiat;
      else if (item.powiat.nazwa) updated.powiat = item.powiat.nazwa;
    }
    // wojewodztwo may be nested under powiat or present as a string
    if (item.wojewodztwo) {
      if (typeof item.wojewodztwo === 'string') updated.wojewodztwo = item.wojewodztwo;
      else if (item.wojewodztwo.nazwa) updated.wojewodztwo = item.wojewodztwo.nazwa;
    } else if (item.powiat && item.powiat.wojewodztwo) {
      if (typeof item.powiat.wojewodztwo === 'string') updated.wojewodztwo = item.powiat.wojewodztwo;
      else if (item.powiat.wojewodztwo.nazwa) updated.wojewodztwo = item.powiat.wojewodztwo.nazwa;
    }
    if (item.kodPocztowy) updated.kod_pocztowy = item.kodPocztowy;
    setValues(updated);
    notifyParent(updated);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  // postal suggestions handled by react-query below

  const handleSelectPostal = (p: any) => {
    // p: { kodPocztowy, miejscowosc, raw }
    // Use postal suggestion's powiat/wojewodztwo if available
    const updated = { ...values, kod_pocztowy: p.kodPocztowy, miejscowosc: p.miejscowosc };
  if (p.powiat) (updated as Record<string, string>)['powiat'] = String(p.powiat ?? '');
  if (p.wojewodztwo) (updated as Record<string, string>)['wojewodztwo'] = String(p.wojewodztwo ?? '');
    setValues(updated);
    notifyParent(updated);
    setPostalSuggestions([]);
    setShowPostalSuggestions(false);
  };

  useEffect(() => {
    return () => {
      // cleanup handled by react-query
    };
  }, []);

  // --- react-query hooks ---
  const debouncedMiejscowosc = useDebounce(values.miejscowosc, 400);
  const { data: rspoData = [] } = useQuery<any[], Error>({
    queryKey: ['rspo', debouncedMiejscowosc],
    queryFn: async () => {
      const q = String(debouncedMiejscowosc || '').trim();
      if (!q) return [];
      const url = `https://api-rspo.men.gov.pl/api/gminy/?nazwa=${encodeURIComponent(q)}`;
      const res = await fetch(url, { headers: { accept: 'application/ld+json' } });
      if (!res.ok) return [];
      const json = await res.json();
      const members = json?.['hydra:member'] ?? (Array.isArray(json) ? json : []);
      return Array.isArray(members) ? members.slice(0, 10) : [];
    },
    enabled: !!debouncedMiejscowosc,
  });

  useEffect(() => {
    // Only update suggestions if the data changed to avoid unnecessary setState loops
    const makeKey = (arr: any[]) => arr.map((it: any, i: number) => (it?.['@id'] ?? it?.nazwa ?? JSON.stringify(it) ?? i)).join('|');
    const newKey = Array.isArray(rspoData) && rspoData.length ? makeKey(rspoData as any[]) : '';
    // store last key in ref to avoid triggering effect by local state changes
    if (!(FormAll as any)._lastRspoKey) (FormAll as any)._lastRspoKey = { current: '' };
    const lastKeyRef = (FormAll as any)._lastRspoKey as { current: string };
    if (newKey) {
      if (lastKeyRef.current !== newKey) {
        lastKeyRef.current = newKey;
        setSuggestions(rspoData as any[]);
        setShowSuggestions(true);
      }
    } else {
      if (lastKeyRef.current !== '') {
        lastKeyRef.current = '';
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  }, [rspoData]);

  const debouncedKod = useDebounce(values.kod_pocztowy, 400);
  const { data: postalData = [] } = useQuery<any[], Error>({
    queryKey: ['postal', debouncedKod],
    queryFn: async () => {
      const code = String(debouncedKod || '').trim();
      const postalRegex = /^\d{2}-\d{3}$/;
      if (!code || !postalRegex.test(code)) return [];
      const url = `https://kodpocztowy.intami.pl/api/${encodeURIComponent(code)}`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      if (!res.ok) return [];
      const data = await res.json();
      let items: any[] = [];
      if (Array.isArray(data)) items = data;
      else if (data && typeof data === 'object') {
        if (Array.isArray((data as any).places)) items = (data as any).places;
        else items = [data];
      }
      const normalized = items.map((it: any) => ({
        kodPocztowy: code,
        miejscowosc: it.miejscowosc ?? it.nazwa ?? it.name ?? (it.gmina ?? ''),
        powiat: (it.powiat && (it.powiat.nazwa ?? it.powiat.name)) ?? (it.powiat ?? ''),
        wojewodztwo: (it.powiat && it.powiat.wojewodztwo && (it.powiat.wojewodztwo.nazwa ?? it.powiat.wojewodztwo.name)) ?? (it.wojewodztwo ?? ''),
        raw: it
      }));
      return normalized.slice(0, 20);
    },
    enabled: !!debouncedKod,
  });

  useEffect(() => {
    // Only update postal suggestions when the normalized results actually change
    const makeKeyP = (arr: any[]) => arr.map((it: any, i: number) => (it?.kodPocztowy ?? it?.miejscowosc ?? JSON.stringify(it) ?? i)).join('|');
    const newPK = Array.isArray(postalData) && postalData.length ? makeKeyP(postalData as any[]) : '';
    if (!(FormAll as any)._lastPostalKey) (FormAll as any)._lastPostalKey = { current: '' };
    const lastPRef = (FormAll as any)._lastPostalKey as { current: string };
    if (newPK) {
      if (lastPRef.current !== newPK) {
        lastPRef.current = newPK;
        setPostalSuggestions(postalData as any[]);
        setShowPostalSuggestions(true);
      }
    } else {
      if (lastPRef.current !== '') {
        lastPRef.current = '';
        setPostalSuggestions([]);
        setShowPostalSuggestions(false);
      }
    }
  }, [postalData]);

  // Map powiat name to nr_okregu using okregiSejm.
  // Debounce powiat to avoid rapid updates and infinite loops.
  const debouncedPowiat = useDebounce(values.powiat, 800);
  const lastMappedPowiat = useRef<string | null>(null);
  useEffect(() => {
    const p = String(debouncedPowiat || '').trim().toLowerCase();
    if (!p) return;
    // Avoid remapping the same powiat repeatedly
    if (lastMappedPowiat.current === p) return;

    let found: number | null = null;
    for (const okreg of okregiSejm) {
      // check powiaty array
      if (okreg.powiaty && okreg.powiaty.some((pp) => String(pp || '').toLowerCase() === p)) {
        found = okreg.nr;
        break;
      }
      // also check miastaPrawaPow for matches (normalize lowercase)
      if (okreg.miastaPrawaPow && okreg.miastaPrawaPow.some((m) => String(m || '').toLowerCase() === p)) {
        found = okreg.nr;
        break;
      }
    }

    if (found !== null) {
      // only update if different
      if (String(values.nr_okregu || '') !== String(found)) {
        const updated = { ...values, nr_okregu: String(found) };
        lastMappedPowiat.current = p;
        setValues(updated);
        notifyParent(updated);
      }
    }
  }, [debouncedPowiat]);

  return (
    <form>
      <ul className="fa-form-list">
        <li>
          <label>Imię / imiona<br />
            <input type="text" name="imiona" required value={values.imiona} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Nazwisko<br />
            <input type="text" name="nazwisko" required value={values.nazwisko} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Preferowane imię / imiona<br />
            <input type="text" name="preferowane_imiona" value={values.preferowane_imiona} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Preferowane nazwisko<br />
            <input type="text" name="preferowane_nazwisko" value={values.preferowane_nazwisko} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Numer PESEL<br />
            <input type="text" name="pesel" maxLength={11} value={values.pesel} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Używane zaimki<br />
            <input type="text" name="zaimki" value={values.zaimki} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Numer telefonu<br />
            <input type="tel" name="telefon" value={values.telefon} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Adres poczty elektronicznej (e-mail)<br />
            <input type="email" name="email" value={values.email} onChange={handleChange} />
          </label>
        </li>
        <li className="fa-row fa-kod">
          <label>Kod pocztowy<br />
            <input autoComplete="off" type="text" name="kod_pocztowy" value={values.kod_pocztowy} onChange={handleChange} />
          </label>
          {showPostalSuggestions && postalSuggestions.length > 0 && (
                  <ul className="fa-suggestions fa-suggestions-postal">
                    {postalSuggestions.map((p, idx) => (
                      <li key={p.kodPocztowy + '_' + idx} className="fa-suggestion" onMouseDown={(e) => { e.preventDefault(); handleSelectPostal(p); }}>
                        <div className="fa-suggestion-title">{p.kodPocztowy} — {p.miejscowosc}</div>
                        <div className="fa-suggestion-sub">{p.powiat ?? ''} — {p.wojewodztwo ?? ''}</div>
                      </li>
                    ))}
                  </ul>
          )}
        </li>

        <li className="fa-row fa-miejscowosc">
          <label>Miejscowość<br />
            <input autoComplete="off" type="text" name="miejscowosc" value={values.miejscowosc} onChange={handleChange} />
          </label>
          {showSuggestions && suggestions.length > 0 && (
            <ul className="fa-suggestions fa-suggestions-miejscowosc">
              {suggestions.map((s, idx) => (
                <li key={s['@id'] ?? idx} className="fa-suggestion" onMouseDown={(e) => { e.preventDefault(); handleSelectSuggestion(s); }}>
                  <div className="fa-suggestion-title">{s.nazwa}</div>
                  <div className="fa-suggestion-sub">{s.powiat?.nazwa ?? ''} — {s.powiat?.wojewodztwo?.nazwa ?? ''}</div>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <label>Województwo<br />
            <input type="text" name="wojewodztwo" value={values.wojewodztwo} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Numer okręgu do Sejmu<br />
            <input type="text" name="nr_okregu" value={values.nr_okregu} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Uczelnia/szkoła (jeśli pobierasz naukę)<br />
            <input type="text" name="uczelnia" value={values.uczelnia} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Powiat<br />
            <input type="text" name="powiat" value={values.powiat} onChange={handleChange} />
          </label>
        </li>
        <li>
          <label>Ulica i numer domu/lokalu<br />
            <input type="text" name="ulica" value={values.ulica} onChange={handleChange} />
          </label>
        </li>
      </ul>
    </form>
  );
}
 