# Changelog Katalog Aturan Evaluasi

Riwayat perubahan **katalog aturan** CekLoker: daftar aturan, bobot, ambang,
dan rujukan hukum yang dipakai mesin evaluasi. Perbaikan mesin yang tidak
mengubah katalog aturan tidak dicatat di sini.

## Cara membaca

- Setiap entri memakai format `## [versi] - YYYY-MM-DD`.
- Entri **paling atas** wajib sama dengan `VERSI_ATURAN` dan `DIPERBARUI_ATURAN`
  di `lib/evaluation/versi.ts`. Tes penjaga akan gagal bila keduanya tidak
  sinkron, sehingga halaman publik tidak pernah menampilkan versi yang salah.
- Versi mengikuti semver sederhana:
  - **MAJOR** — aturan dihapus, digabung, atau ambang/bobot diubah sehingga
    hasil evaluasi untuk teks yang sama dapat berpindah rentang.
  - **MINOR** — aturan baru ditambahkan, atau rujukan hukum baru disertakan.
  - **PATCH** — perbaikan redaksi judul/deskripsi, perbaikan rujukan hukum, atau
    penyempurnaan pola tanpa mengubah perilaku penilaian secara umum.

## [1.0.0] - 2026-11-16

Rilis awal katalog aturan.

- 17 aturan aktif mencakup kategori upah, kontak, identitas perusahaan, data
  pribadi, prosedur rekrutmen, tekanan waktu, diskriminasi, penempatan kerja,
  dan indikator lain.
- Setiap aturan memiliki bobot, kekuatan indikator, serta rujukan hukum resmi
  (UU, Permenaker, dan peraturan terkait) yang ditampilkan pada halaman hasil.
- Aturan perbandingan upah minimum disiapkan, tetapi belum menilai karena data
  upah resmi belum tersedia; statusnya ditandai jelas di halaman metodologi.
