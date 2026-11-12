# CekLoker — Design System

Dokumen ini adalah kontrak visual. Setiap komponen, halaman, dan perubahan gaya
harus mengikuti token dan aturan di sini. Bila sebuah keputusan visual belum tercakup,
tambahkan aturannya ke dokumen ini terlebih dahulu, baru terapkan ke kode.

Arah visual: **Modern, Clean, Elegan**. Terinspirasi dari standar desain produk modern
(Linear, Stripe, Supabase, dan referensi Ailene.id) yang mengedepankan keterbacaan,
kelembutan bayangan, presisi garis, dan rasa percaya bagi pencari kerja Indonesia.
**Bukan remake mentah, bukan klon.**

## 1. Prinsip

1. **Simple, Clean, Modern.** Antarmuka terasa lapang, tenang, dan bersih. Tidak kaku,
   tidak memakai garis hitam tebal retro yang memberatkan pandangan.
2. **Presisi & Kelembutan Visual.** Border 1px yang halus (`border-line`), bayangan difus
   bertingkat (`shadow-kartu` ambient elevation), dan sudut membulat yang nyaman (`rounded-2xl`).
3. **Warna Menandai Makna.** Aksen emerald/lime melambangkan keamanan kerja dan pertumbuhan
   (SDG 8 Decent Work). Warna risiko (merah, amber, hijau) hanya untuk klasifikasi band risiko.
4. **Tanpa Vonis.** Tidak ada ikon atau elemen visual yang menghakimi secara berlebihan.
   Bahasa visual mengarahkan pengguna untuk mengecek dan memverifikasi secara mandiri.
5. **Satu Sistem Terpadu.** Semua warna, radius, dan bayangan berasal dari token sistem
   via utilitas Tailwind murni tanpa kelas ad-hoc.

## 2. Palet

| Nama token  | Nilai     | Pemakaian                                        |
| ----------- | --------- | ------------------------------------------------ |
| `ink`       | `#0f172a` | Slate 900: Teks utama, judul, permukaan kontras  |
| `ink-deep`  | `#020617` | Slate 950: Aksen gelap pekat, hover tombol       |
| `lime`      | `#10b981` | Emerald 500: Aksen modern, titik status, sorotan |
| `cream`     | `#f8fafc` | Slate 50: Latar section sekunder, input surface  |
| `paper`     | `#ffffff` | Pure white: Latar halaman utama, kartu           |
| `muted`     | `#64748b` | Slate 500: Teks sekunder, deskripsi, metadata    |
| `line`      | `#e2e8f0` | Slate 200: Garis batas halus dan presisi         |

### Band risiko (semantik, khusus hasil evaluasi)

| Band        | Teks      | Latar     | Border    |
| ----------- | --------- | --------- | --------- |
| `rendah`    | `#166534` | `#f0fdf4` | `#bbf7d0` |
| `perlu_dicek`| `#92400e`| `#fffbeb` | `#fde68a` |
| `tinggi`    | `#991b1b` | `#fef2f2` | `#fecaca` |

Aturan: Band risiko selalu tampil dengan teks label dan indikator titik (dot) status.

## 3. Tipografi

Keluarga: **Inter Tight** (variabel, subset `latin`, `display: swap`), diakses lewat `--font-sans`. Fallback `ui-sans-serif, system-ui, sans-serif`.

| Utilitas                    | Mobile                  | Desktop (≥1280px)         | Catatan                    |
| --------------------------- | ----------------------- | ------------------------- | -------------------------- |
| `text-display`              | 38px / 1.1 / −0.03em    | 56px / 1.08 / −0.035em    | H1 hero, judul utama       |
| `text-h2`                   | 30px / 1.15 / −0.025em  | 44px / 1.12 / −0.03em     | Judul section              |
| `text-h3`                   | 20px / 1.3 / −0.015em   | 20px / 1.3 / −0.015em     | Judul kartu                |
| `text-brand`                | 20px / 1 / −0.03em      | idem                      | Wordmark logo              |
| `text-eyebrow`              | 12px / 1.4 / +0.05em    | idem                      | Label pill modern          |
| `text-body`                 | 16px / 1.6              | 16px / 1.6                | Teks isi paragraf          |
| `text-small`                | 14px / 1.5              | 14px / 1.5                | Metadata, bantuan form     |
| `text-mono`                 | 13px / 1.6              | idem                      | Kutipan bukti, kode aturan |

## 4. Spasi & Layout

- Container: `max-width: 72rem` (1152px), padding horizontal 20px (mobile) hingga 32px (desktop).
- Padding section vertikal: 64px (mobile) / 96px (desktop).
- Spacing grid kartu: `gap: 24px`.
- Lebar baca teks panjang: `max-width: 58ch – 62ch`.
- Header: Sticky dengan tinggi 60px (mobile) / 68px (desktop), berlatar `bg-paper/85` dan `backdrop-blur-md`.

## 5. Radius, Border, & Bayangan

| Elemen              | Radius | Border                | Bayangan                                       |
| ------------------- | ------ | --------------------- | ---------------------------------------------- |
| Kartu               | 20px   | `1px solid line`      | `0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)` |
| Kartu unggulan      | 20px   | `1px solid emerald/30`| `0 4px 6px rgba(0,0,0,0.04), 0 20px 32px rgba(0,0,0,0.08)`|
| Tombol pil (CTA)    | 9999px | tidak ada / subtle    | `0 1px 2px rgba(0,0,0,0.06)`, hover: `0 4px 14px` |
| Input / textarea    | 12px   | `1px solid line`      | tidak ada; fokus: ring 4px lime/20             |
| Badge / Lencana     | 9999px | `1px solid` band      | soft ambient chip                              |

## 6. Komponen

### Tombol
- **Primer**: Latar `bg-ink`, teks `text-paper`, rounded-full, bayangan lembut. Hover: translate-y ringan + bayangan meluas.
- **Sekunder**: Latar `bg-paper`, teks `text-ink`, border `border-line`, rounded-full.
- **Hantu**: Teks `text-muted`, hover teks `text-ink`, tanpa border.

### Kartu
Latar `bg-paper`, border halus `border-line/80`, sudut melengkung 20px (`rounded-kartu`), bayangan melayang lembut (`shadow-kartu`). Hover transisi halus.

### Eyebrow
Pill badge modern berbingkai tipis dengan dot indikator hijau berkedip halus (`animate-pulse`).

### Form
Input dan textarea dengan sudut melengkung 12px, border halus, latar `cream/30`, dan transisi fokus ber-ring lembut.

## 7. Aksesibilitas & Etika
- Kontras teks minimal 4,5:1 (WCAG AA) dan target 7:1 untuk teks utama.
- Fokus terlihat jelas dengan ring kontras.
- Tidak ada klaim bahwa teks lowongan disimpan di server.
- Tidak ada vonis "palsu/asli/penipuan" pada hasil evaluasi deterministik.
