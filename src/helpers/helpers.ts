import fillDeklaracjaPdf from './fillDeklaracjaPdf';
import { fillRodoPdf } from './fillRodoPdf';
import { fillZgodaRodzicaPdf } from './fillZgodaRodzicaPdf';

export default fillDeklaracjaPdf;
export { fillRodoPdf, fillZgodaRodzicaPdf };

/**
 * Helper to generate a PDF using the provided fill function, then trigger download.
 * kept here as a small utility (used by Over14/Over16)
 */
export async function generateAndDownloadPdf(
  fillFn: (...args: any[]) => Promise<Blob>,
  args: any[],
  filename: string
) {
  const blob = await fillFn(...args);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


