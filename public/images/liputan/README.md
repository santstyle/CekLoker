# Ilustrasi kartu liputan ("Dari lapangan")

4 ilustrasi di folder ini tersambung ke kartu liputan di beranda (`app/(public)/page.tsx`) melalui `next/image`. Ilustrasi dibuat dengan AI sebagai aset sendiri (bebas dipakai, tanpa lisensi pihak ketiga). Untuk mengganti, timpa file dengan nama yang sama lalu perbarui baris "Sumber" bila gambarnya berbeda.

## Nama file & sumber

| File         | Tema kartu               | Sumber                                            |
| ------------ | ------------------------ | ------------------------------------------------- |
| kasus-01.jpg | Tribratanews Polda Jabar | Panel AI: iklan kerja online + stempel PENIPUAN   |
| kasus-02.jpg | Liputan6.com             | Panel AI: surat lowongan PT POS Indonesia (PALSU) |
| kasus-03.jpg | CNBC Indonesia           | Panel AI: lowongan LinkedIn (WASPADA PENIPUAN)    |
| kasus-04.jpg | detikFinance             | Panel AI: iklan admin e-commerce (PENIPUAN)       |

## Spesifikasi

- Rasio **16:9 landscape**, 1536×864 px, format JPEG (kualitas ±86, mozjpeg + penajaman ringan)
- Sumber: kolase AI 1536×1024, dipotong 4 panel lalu di-upscale ±2× (lanczos + penajaman); gutter antar-panel dihindari agar tidak ada garis putih di tepi
- Kartu tampil penuh (container "penuh" ≈ 25vw di desktop) — gambar dilayani `next/image` dengan `quality={85}` dan `sizes` 25vw/50vw/100vw
- Chip "ILUSTRASI" pada kartu dipertahankan; nama PT/merek dan stempel PALSU/PENIPUAN adalah peraga fiktif, bukan dokumentasi kasus nyata
