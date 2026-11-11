# Panduan Kontribusi

Terima kasih tertarik berkontribusi pada CekLoker. Dokumen ini menjelaskan cara menyiapkan lingkungan pengembangan, konvensi yang berlaku, dan alur pengiriman perubahan.

## Prasyarat

- Node.js versi 20 atau lebih baru — lihat [`.nvmrc`](.nvmrc). Jalankan `nvm use` bila memakai nvm.
- pnpm — aktifkan lewat corepack:

  ```bash
  corepack enable
  ```

- Salin contoh variabel lingkungan lalu isi nilainya:

  ```bash
  cp .env.example .env
  ```

## Menyiapkan Proyek

1. Klon repositori dan masuk ke direktorinya.
2. Pasang dependensi dengan lockfile yang terkunci:

   ```bash
   pnpm install --frozen-lockfile
   ```

3. Jalankan server pengembangan:

   ```bash
   pnpm dev
   ```

   Buka <http://localhost:3000>.

## Variabel Lingkungan

Semua variabel dibaca lewat `lib/env.ts` dan divalidasi dengan Zod saat pertama kali dibutuhkan. Aplikasi gagal cepat dengan pesan kesalahan dalam Bahasa Indonesia bila ada nilai yang tidak valid.

| Variabel                | Wajib             | Keterangan                                               |
| ----------------------- | ----------------- | -------------------------------------------------------- |
| `DATABASE_URL`          | Ya (mulai Fase 1) | Connection string Neon Postgres pooled                   |
| `GEMINI_API_KEY`        | Tidak             | Kunci Google Gemini untuk fallback ekstraksi AI          |
| `AI_EXTRACTION_ENABLED` | Tidak             | `"true"`/`"1"` mengaktifkan ekstraksi AI; bawaan `false` |
| `ADMIN_EMAIL`           | Tidak             | Email admin untuk panel administrasi                     |
| `ADMIN_PASSWORD_HASH`   | Tidak             | Hash kata sandi admin                                    |
| `AUTH_SECRET`           | Tidak             | Rahasia untuk menandatangani sesi admin                  |
| `NEXT_PUBLIC_SITE_URL`  | Tidak             | URL publik situs; bawaan `http://localhost:3000`         |

Jangan pernah commit file `.env`. Hanya `.env.example` yang boleh masuk repositori.

## Perintah Pengembangan

| Perintah            | Fungsi                          |
| ------------------- | ------------------------------- |
| `pnpm dev`          | Server pengembangan             |
| `pnpm build`        | Build produksi                  |
| `pnpm start`        | Jalankan hasil build produksi   |
| `pnpm lint`         | ESLint                          |
| `pnpm typecheck`    | TypeScript tanpa emit           |
| `pnpm test`         | Vitest sekali jalan             |
| `pnpm test:watch`   | Vitest mode pantau              |
| `pnpm format`       | Prettier tulis ulang semua file |
| `pnpm format:check` | Prettier periksa tanpa menulis  |
| `pnpm db:generate`  | Buat migrasi Drizzle dari skema |
| `pnpm db:migrate`   | Terapkan migrasi Drizzle        |
| `pnpm db:studio`    | Buka Drizzle Studio             |

## Struktur Direktori

```
app/                 # Rute dan komponen App Router
  (public)/          # Halaman publik
  api/health/        # Endpoint kesehatan layanan
lib/
  env.ts             # Validasi variabel lingkungan (Zod)
  db/
    client.ts        # Klien Drizzle (Neon serverless)
    schema.ts        # Definisi skema database
tests/
  unit/              # Pengujian unit Vitest
.github/workflows/   # Pipeline CI
```

## Konvensi

- Bahasa antarmuka dan dokumentasi: Bahasa Indonesia. Nama kode dan pesan commit type prefix: Inggris.
- Commit mengikuti [Conventional Commits](https://www.conventionalcommits.org/id/) — contoh: `feat: tambah evaluasi rentang risiko`, `fix: perbaiki deteksi upah di bawah minimum`.
- Sebelum mengirim perubahan, pastikan semua gerbang lolos:

  ```bash
  pnpm format
  pnpm typecheck
  pnpm lint
  pnpm test
  ```

- Tulis pengujian untuk logika baru — terutama logika evaluasi, yang harus deterministik dan dapat diuji.
- Jangan menonaktifkan aturan ESLint atau TypeScript untuk melewati kesalahan.

## Alur Kontribusi

1. Fork repositori dan buat cabang dari `main`.
2. Kerjakan perubahan dalam commit atomik.
3. Pastikan `pnpm format && pnpm typecheck && pnpm lint && pnpm test` lolos lokal.
4. Kirim pull request dengan deskripsi perubahan dan daftar periksa pada template PR.
5. CI harus hijau sebelum pull request dapat digabungkan.

## Dukungan

Temukan bug atau punya ide fitur? Buka issue dengan deskripsi lengkap dan langkah reproduksi bila relevan.
