# Foto kartu liputan ("Dari lapangan")

4 foto di folder ini tersambung ke kartu liputan di beranda (`app/(public)/page.tsx`) melalui `next/image`. Semua foto berlisensi bebas dari Pexels (bebas dipakai komersial, boleh dimodifikasi, tanpa kewajiban atribusi — kredit tetap dicantumkan sebagai rujukan). Untuk mengganti foto, timpa file dengan nama yang sama lalu perbarui baris "Sumber" bila fotonya berbeda.

## Nama file & sumber

| File         | Tema kartu               | Foto oleh       | Tautan sumber                          |
| ------------ | ------------------------ | --------------- | -------------------------------------- |
| kasus-01.jpg | Tribratanews Polda Jabar | Sanket Mishra   | https://www.pexels.com/photo/17888111/ |
| kasus-02.jpg | Liputan6.com             | Ylanite Koppens | https://www.pexels.com/photo/1906606/  |
| kasus-03.jpg | CNBC Indonesia           | Vitaly Gariev   | https://www.pexels.com/photo/22046216/ |
| kasus-04.jpg | detikFinance             | Julio Lopez     | https://www.pexels.com/photo/29502375/ |

## Spesifikasi

- Rasio **16:9 landscape**, 2048×1152 px, format JPEG (kualitas ±86, mozjpeg + penajaman ringan)
- Kartu tampil penuh (container "penuh" ≈ 25vw di desktop) — gambar dilayani `next/image` dengan `quality={85}` dan `sizes` 25vw/50vw/100vw agar tidak di-upscale
- Foto stok berlisensi Pexels — bebas pakai komersial, tanpa kewajiban kredit
- Foto harus terbaca sebagai **ilustrasi** kasus, bukan dokumentasi asli; chip "ILUSTRASI" pada kartu dipertahankan
