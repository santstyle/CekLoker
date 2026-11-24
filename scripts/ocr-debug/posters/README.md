# Poster uji OCR

Tambahkan poster baru dengan konvensi:

- `<nama>.jpg/.png/.webp`: gambar poster
- `<nama>.txt`: teks yang seharusnya terbaca (ground truth), satu baris per baris poster
- `<nama>.meta.json` (opsional): kategori, jenisPoster, kolomPenting

Jalankan benchmark: `pnpm ocr:bench` (atau `node scripts/ocr-debug/benchmark.mjs`).

Catatan: poster asli bisa memuat nomor telepon dan email orang sungguhan. Jangan commit gambar poster tanpa izin.
