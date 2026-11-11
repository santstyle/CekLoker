<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CekLoker — Panduan Agen

## Ringkasan Proyek

CekLoker menilai iklan lowongan kerja Indonesia terhadap standar ketenagakerjaan dan indikator penipuan. Hasil berupa rentang risiko deterministik (rendah / perlu dicek / tinggi) dengan alasan, bukti, rujukan hukum, dan saran — tanpa vonis "penipuan" atau "asli". Fase 0 berisi fondasi; logika evaluasi menyusul di fase berikutnya.

## Perintah Pengembangan

- `pnpm install --frozen-lockfile` — pasang dependensi
- `pnpm dev` — server pengembangan
- `pnpm build` — build produksi
- `pnpm typecheck` — TypeScript tanpa emit
- `pnpm lint` — ESLint
- `pnpm test` — Vitest sekali jalan
- `pnpm format` — Prettier tulis ulang
- `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:studio` — migrasi Drizzle

## Struktur Direktori

- `app/` — rute App Router; `app/(public)/page.tsx` halaman publik; `app/api/health/route.ts` kesehatan layanan
- `lib/env.ts` — validasi variabel lingkungan (Zod, pesan kesalahan Bahasa Indonesia)
- `lib/db/client.ts` — klien Drizzle Neon serverless (lazy, cache global)
- `lib/db/schema.ts` — definisi skema database (kosong pada Fase 0)
- `tests/unit/` — pengujian unit Vitest
- `.github/workflows/ci.yml` — CI: lint, typecheck, test, build, deteksi kebocoran rahasia

## Konvensi

- TypeScript strict; dilarang `as any`, `@ts-ignore`, atau menonaktifkan aturan linter
- Validasi semua input dengan Zod; jangan hardcode rahasia
- Bahasa UI, dokumen, dan deskripsi commit: Indonesia; type prefix commit: Inggris (Conventional Commits)
- Tulis pengujian dulu untuk logika evaluasi — hasil harus deterministik
- Jangan menyimpan teks lowongan pengguna (privasi)
- Rujukan hukum hanya dari sumber resmi (UU, Permenaker, KEP, SE) — jangan mengarang data hukum

## JANGAN

- Jangan memberi vonis "penipuan/palsu/asli" pada hasil evaluasi
- Jangan memanggil Gemini dari sisi klien — ekstraksi AI hanya di server, dan hanya opsional
- Jangan mengubah blok `nextjs-agent-rules` di atas — blok itu ditulis ulang oleh `next dev`
- Jangan commit `.env` — hanya `.env.example`
