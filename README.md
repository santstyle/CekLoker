# CekLoker

[![CI](https://github.com/santstyle/CekLoker/actions/workflows/ci.yml/badge.svg)](https://github.com/santstyle/CekLoker/actions/workflows/ci.yml)

CekLoker membantu pencari kerja di Indonesia menilai iklan lowongan kerja sebelum melamar. Tempel teks lowongan, dan CekLoker menandai indikator mencurigakan serta membandingkannya dengan standar ketenagakerjaan — mulai dari upah minimum, batas jam lembur, hingga pola penipuan rekrutmen yang sering muncul.

CekLoker tidak memberikan vonis. Hasil evaluasi disajikan sebagai rentang risiko beserta alasan, bukti yang ditemukan, rujukan regulasi yang relevan, dan saran langkah selanjutnya. Keputusan akhir tetap di tangan pengguna.

## Rentang Risiko

Setiap evaluasi menghasilkan salah satu dari tiga rentang:

- **Rendah** — tidak ditemukan indikator bermasalah pada teks lowongan.
- **Perlu dicek** — ada indikator yang perlu dikonfirmasi langsung ke perusahaan atau melalui sumber resmi.
- **Tinggi** — ditemukan kombinasi indikator yang sering muncul pada penipuan rekrutmen.

Rentang ditentukan secara deterministik dari pemeriksaan berbasis aturan, bukan opini model. Setiap temuan disertai kutipan dari teks lowongan sebagai bukti.

## Status Proyek

**Fase 0 — fondasi proyek.** Fitur evaluasi lowongan menyusul. Saat ini repositori berisi kerangka aplikasi, konfigurasi alat, validasi variabel lingkungan, fondasi akses database, dan pipeline CI.

Rencana fitur yang menyusul:

- Evaluasi teks lowongan terhadap pemeriksaan ketenagakerjaan dan indikator penipuan
- Rentang risiko deterministik dengan alasan, bukti, dan rujukan hukum
- Halaman edukasi tentang hak pekerja dan pola penipuan rekrutmen
- Panel administrasi untuk mengelola basis pengetahuan pemeriksaan

## Teknologi

- [Next.js](https://nextjs.org) dengan App Router dan TypeScript strict
- [Tailwind CSS](https://tailwindcss.com) untuk antarmuka
- [Drizzle ORM](https://orm.drizzle.team) dengan Neon Postgres serverless
- [Zod](https://zod.dev) untuk validasi input dan konfigurasi
- [Vitest](https://vitest.dev) untuk pengujian
- pnpm sebagai manajer paket

## Privasi

CekLoker tidak menyimpan teks lowongan yang Anda tempel. Evaluasi berjalan atas permintaan tanpa menyimpan isi lowongan ke penyimpanan permanen.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

## Pengembangan

Panduan menyiapkan lingkungan pengembangan, konvensi kode, dan alur kontribusi tersedia di [CONTRIBUTING.md](CONTRIBUTING.md).
