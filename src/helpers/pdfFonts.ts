import { PDFDocument } from 'pdf-lib';

export const UBUNTU_URL = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';

let _fontkit: any = null;
let _ubuntuBytes: ArrayBuffer | null = null;

export async function ensureFontkit(): Promise<void> {
  if (_fontkit && _ubuntuBytes) return;
  try {
    const fk = await import('@pdf-lib/fontkit');
    _fontkit = fk?.default ?? fk;
  } catch {
    _fontkit = null;
  }
  if (!_ubuntuBytes) {
    const r = await fetch(UBUNTU_URL);
    if (r.ok) _ubuntuBytes = await r.arrayBuffer();
  }
}

export async function registerUbuntuOn(pdfDoc: PDFDocument) {
  await ensureFontkit();
  if (_fontkit) {
    pdfDoc.registerFontkit(_fontkit);
  }
  if (_ubuntuBytes) {
    return await pdfDoc.embedFont(_ubuntuBytes as any);
  }
  return null;
}

// For internal use in helpers.ts
export function getFontkit() {
  return _fontkit;
}
