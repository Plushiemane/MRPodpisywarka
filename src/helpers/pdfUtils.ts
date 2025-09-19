import { PDFDocument, StandardFonts } from 'pdf-lib';
import { ensureFontkit, registerUbuntuOn, getFontkit } from './pdfFonts';

/**
 * Load PDF template bytes from a URL or accept ArrayBuffer directly.
 */
export async function loadTemplateBytes(templatePath: string | ArrayBuffer) {
  if (typeof templatePath === 'string') {
    const res = await fetch(templatePath);
    if (!res.ok) throw new Error('Failed to fetch template');
    return res.arrayBuffer();
  }
  return templatePath as ArrayBuffer;
}

/**
 * Ensure fonts are prepared and embedded on pdfDoc.
 * Returns { font, ubuntuFont } where ubuntuFont may be used for updateFieldAppearances.
 */
export async function prepareFonts(pdfDoc: PDFDocument, preferredFontUrl?: string) {
  const ubuntuFont = await registerUbuntuOn(pdfDoc);
  let font: any = ubuntuFont || null;

  const tryEmbed = async (url?: string) => {
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    await ensureFontkit();
    if (getFontkit()) pdfDoc.registerFontkit(getFontkit());
    return await pdfDoc.embedFont(ab as any);
  };

  if (!font && preferredFontUrl) font = await tryEmbed(preferredFontUrl);
  if (!font) font = await tryEmbed('/assets/NotoSans-Regular.ttf');
  if (!font) font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  return { font, ubuntuFont };
}
