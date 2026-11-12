# CekLoker

<p align="center">
  <img src="CekLoker%20Job%20Safety%20Banner.png" alt="CekLoker Job Safety Banner" width="100%" />
</p>

[![CI](https://github.com/santstyle/CekLoker/actions/workflows/ci.yml/badge.svg)](https://github.com/santstyle/CekLoker/actions/workflows/ci.yml)

CekLoker membantu pencari kerja di Indonesia menilai iklan lowongan kerja sebelum melamar. Tempel teks lowongan, dan CekLoker menandai indikator risiko serta membandingkannya dengan standar ketenagakerjaan — mulai dari upah minimum, batas jam lembur, hingga pola rekrutmen berisiko.

CekLoker tidak memberikan vonis "penipuan" atau "asli". Hasil evaluasi disajikan sebagai rentang risiko beserta alasan, bukti yang ditemukan, rujukan regulasi resmi yang relevan, dan saran langkah selanjutnya. Keputusan akhir tetap di tangan pengguna.

## Rentang Risiko

Setiap evaluasi menghasilkan salah satu dari tiga rentang:

- **Rendah** — tidak ditemukan indikator bermasalah pada teks lowongan.
- **Perlu dicek** — ada indikator yang perlu dikonfirmasi langsung ke perusahaan atau melalui sumber resmi.
- **Tinggi** — ditemukan kombinasi indikator risiko yang sering muncul pada lowongan bermasalah.

Rentang ditentukan secara deterministik dari pemeriksaan berbasis aturan, bukan opini model AI. Setiap temuan disertai kutipan dari teks lowongan sebagai bukti.

## Status Proyek

- Evaluasi teks lowongan terhadap pemeriksaan ketenagakerjaan dan indikator risiko (aktif)
- Rentang risiko deterministik dengan alasan, bukti, dan rujukan hukum resmi (aktif)
- Antarmuka publik dengan sistem desain utilitas Tailwind murni (aktif)
- Halaman edukasi hak pekerja dan panduan verifikasi mandiri (aktif)
- Alur pembacaan poster lowongan (OCR peramban)

## Teknologi

- [Next.js](https://nextjs.org) dengan App Router dan TypeScript strict
- [Tailwind CSS](https://tailwindcss.com) v4 untuk antarmuka
- [Drizzle ORM](https://orm.drizzle.team) dengan Neon Postgres serverless
- [Zod](https://zod.dev) untuk validasi input dan konfigurasi
- [Vitest](https://vitest.dev) untuk pengujian
- pnpm sebagai manajer paket

## Privasi

CekLoker tidak menyimpan teks lowongan yang Anda tempel di server. Sistem hanya menyimpan penilaian dan kutipan bukti singkat yang diperlukan agar hasil evaluasi dapat dibuka kembali lewat peramban Anda.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](LICENSE).

## Pengembangan

Panduan menyiapkan lingkungan pengembangan, konvensi kode, dan alur kontribusi tersedia di [CONTRIBUTING.md](CONTRIBUTING.md).
