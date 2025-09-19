import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ESM mode __dirname is not available, derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '..', 'public', 'assets');
const outPath = path.join(outDir, 'NotoSans-Regular.ttf');
// Use raw.githubusercontent.com to avoid redirects from github.com
const url = 'https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf';

async function run() {
  try {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    console.log('Downloading', url);
    const file = fs.createWriteStream(outPath);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error('Failed to download font, status:', res.statusCode);
        process.exit(1);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved to', outPath);
      });
    }).on('error', (err) => {
      try { if (fs.existsSync(outPath)) fs.unlinkSync(outPath); } catch (e) { /* ignore */ }
      console.error('Download error', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Unexpected error', err);
    process.exit(1);
  }
}

run();
