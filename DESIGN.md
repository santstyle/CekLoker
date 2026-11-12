# CekLoker — Design System

Dokumen ini adalah kontrak visual. Setiap komponen, halaman, dan perubahan gaya
harus mengikuti token dan aturan di sini. Bila sebuah keputusan tidak tercakup,
tambahkan aturannya ke dokumen ini lebih dulu, baru terapkan ke kode.

Referensi rasa: tipografi tebal, kontras keras, cream–ink–lime, sudut membulat,
dan bayangan padat. Referensi hanya memberi arah visual — struktur, komposisi,
copy, dan komponen CekLoker dirancang sendiri. **Bukan remake, bukan klon.**

## 1. Prinsip

1. **Alat, bukan iklan.** Halaman harus terasa seperti instrumen yang bisa
   dipercaya: rapi, tenang, mudah dipindai. Bukan landing page startup.
2. **Kontras keras, bukan gradient lembut.** Batas 2px, bayangan padat, warna
   blok. Kejujuran visual untuk alat yang menilai risiko.
3. **Warna menandai makna, bukan dekorasi.** Lime hanya untuk aksi utama dan
   penanda merek. Warna risiko khusus untuk band risiko.
4. **Tanpa vonis.** Tidak ada elemen visual yang menghakimi (tengkorak, sirene,
   warna alarm penuh layar). Bahasa visual menyatakan "perlu diperiksa".
5. **Satu sistem.** Tidak ada kelas Tailwind warna ad-hoc di komponen. Semua
   warna, radius, dan bayangan berasal dari token.

## 2. Palet

| Nama token  | Nilai     | Pemakaian                                        |
| ----------- | --------- | ------------------------------------------------ |
| `ink`       | `#122922` | Teks utama, border, permukaan gelap, nav aktif   |
| `ink-deep`  | `#0a0f0d` | Judul, bayangan padat, teks di atas lime         |
| `lime`      | `#d6ee30` | CTA utama, eyebrow, sorotan, seleksi teks        |
| `cream`     | `#f3f6f2` | Permukaan kartu, header lengket, section band    |
| `paper`     | `#ffffff` | Latar halaman                                    |
| `muted`     | `#4a5a52` | Teks sekunder, keterangan, metadata              |
| `line`      | `#cfd9cf` | Garis pemisah halus (bukan border kartu)         |

Rasio kontras terukur: `ink` di atas putih 15,4:1; `muted` 7,3:1;
`ink-deep` di atas `lime` 14,8:1. Semua lolos WCAG AA untuk teks normal.

### Band risiko (semantik, tidak boleh dipakai untuk hal lain)

| Band        | Teks      | Latar     | Border    | Kontras |
| ----------- | --------- | --------- | --------- | ------- |
| `rendah`    | `#14532d` | `#e6f3e6` | `#1f6b3f` | 7,9:1   |
| `sedang`    | `#6b3f00` | `#fdf0d5` | `#8a5200` | 7,8:1   |
| `tinggi`    | `#7a1d14` | `#fbe6e4` | `#a02c1c` | 8,7:1   |

Aturan: band risiko **selalu** tampil sebagai pasangan teks + label, tidak
pernah hanya warna. Lime tidak pernah menandai band. Hijau band `rendah`
berbeda dari lime aksen — jangan disamakan.

## 3. Tipografi

Keluarga: **Inter Tight** (variabel, subset `latin`, `display: swap`), diakses
lewat `--font-sans`. Fallback `ui-sans-serif, system-ui, sans-serif`.

Bobot 800 untuk semua judul dan eyebrow; 400–500 untuk teks isi. Tracking
judul negatif dan rapat — ciri utama sistem ini.

| Kelas       | 375–1279px              | ≥1280px                   | Catatan                    |
| ----------- | ----------------------- | ------------------------- | -------------------------- |
| `.t-display`| 40px / 1.04 / −0.03em   | 58,88px / 1.04 / −0.03em  | H1 hero, satu per halaman  |
| `.t-h2`     | 34px / 1.04 / −0.03em   | 53,76px / 1.04 / −0.03em  | Judul section              |
| `.t-h3`     | 26px / 1.04 / −0.03em   | 26px / 1.04 / −0.03em     | Judul kartu                |
| `.t-eyebrow`| 11,5px / 800 / +0,1em   | idem                      | Uppercase, warna `ink`/lime|
| `.t-body`   | 16px / 1.55             | 16px / 1.55               | Teks isi                   |
| `.t-small`  | 14px / 1.5              | 14px / 1.5                | Metadata, bantuan form     |
| `.t-mono`   | 13px / 1.6              | idem                      | Kutipan bukti, kode aturan |

Aturan: maksimal tiga tingkat judul per halaman. Jangan memakai `font-semibold`
sebagai pengganti `.t-h3`. Jangan menambah bobot 900.

## 4. Spasi & layout

- Container: `max-width: 72rem` (1152px), padding horizontal 20px (mobile)
  hingga 32px (≥768px).
- Padding section vertikal: **52px** (mobile) / **76px** (≥768px).
- Jarak antar-blok dalam satu section: 20px (rapat), 32px (normal), 48px (longgar).
- Grid kartu: 1 kolom < 640px, 2 kolom ≥ 640px, 3 kolom ≥ 1024px. `gap: 20px`.
- Lebar baca teks panjang: `max-width: 62ch`.
- Header tinggi 57px (mobile) / 61px (≥1024px); sticky dengan latar
  `rgba(243,246,242,0.96)` + `backdrop-filter: blur(8px)`.

## 5. Radius, border, bayangan

| Elemen              | Radius | Border            | Bayangan                                   |
| ------------------- | ------ | ----------------- | ------------------------------------------ |
| Kartu               | 16px   | `2px solid ink`   | `6px 6px 0 0 rgba(10,15,13,0.16)`          |
| Kartu unggulan      | 16px   | `2px solid ink`   | `8px 8px 0 0 rgba(10,15,13,0.55)`          |
| Tombol pil (CTA)    | 999px  | `2px solid ink-deep` | `4px 4px 0 0 ink-deep`                  |
| Input / textarea    | 12px   | `2px solid line`  | tidak ada; fokus → border `ink` + ring lime|
| Badge / chip        | 999px  | `1px solid` sesuai band | tidak ada                            |

Aturan: bayangan selalu **padat tanpa blur** untuk elemen interaktif; blur
hanya untuk bayangan ambient kartu besar. Tidak ada `box-shadow` kombinasi
lebih dari dua lapis.

## 6. Komponen

### Tombol

- **Primer**: latar `lime`, teks `ink-deep`, pil, border 2px, hard shadow.
  Hover: `translate(-1px,-1px)` + shadow 5px. Active: `translate(2px,2px)` +
  shadow 0.
- **Sekunder**: latar `paper`, teks `ink`, border 2px `ink`, pil, hard shadow.
- **Hantu**: teks `ink`, underline saat hover, tanpa border.
- Semua tombol minimal 44×44px area sentuh. Label berupa kata kerja
  ("Periksa lowongan", bukan "Submit").

### Kartu

Latar `cream`, border 2px `ink`, radius 16px, hard shadow. Judul di dalam
memakai `.t-h3`. Isi memakai `.t-body` warna `ink`; metadata `.t-small` `muted`.
Kartu tidak boleh bersarang lebih dari satu tingkat.

### Eyebrow

Huruf kapital, `.t-eyebrow`, warna `ink`. Di atas judul section, jarak 10px.
Boleh diberi penanda kecil (garis 24×2px lime) di sebelah kiri.

### Band risiko

Baris ringkas: chip label + satu kalimat penjelasan. Chip memakai pasangan
warna band di atas. Pada halaman hasil, band risiko tampil sebagai blok besar
dengan latar warna band, label band sebagai `.t-h3`, dan skor sebagai angka
`.t-display`.

### Form

Label di atas input, `.t-small` bobot 500 warna `ink`. Textarea/input radius
12px, border 2px `line`, latar `paper`, padding 12–14px. Fokus: border `ink`,
ring 3px `lime` dengan offset 2px. Pesan galat: `.t-small` warna `#7a1d14`,
didahului ikon teks "Galat:". Tidak ada placeholder yang menggantikan label.

### Navigasi

Tautan `.t-small` bobot 500, warna `ink`; tautan aktif bergaris bawah 2px
`ink` (atau latar `ink` + teks `cream` pada versi chip). Jangan memakai
dropdown. Mobile: tautan tetap terlihat, `flex-wrap`, tanpa hamburger pada
fase ini.

### Footer

Latar `cream`, border atas 2px `ink`, teks `.t-small` `muted`, dua paragraf
maksimal. Tidak ada tautan sosial.

## 7. Motion

- Durasi 120–180ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Hanya properti `transform`, `opacity`, `box-shadow`, dan warna.
- Tidak ada animasi masuk otomatis pada konten utama (menghalangi pembacaan
  dan mengurangi performa). Animasi hanya sebagai umpan balik interaksi.
- Wajib menghormati `prefers-reduced-motion: reduce` → semua transisi 0ms.

## 8. Aksesibilitas

- Kontras teks minimal 4,5:1; target 7:1 untuk teks isi.
- Fokus terlihat pada semua elemen interaktif: `outline: 2px solid ink`,
  `outline-offset: 2px`, tidak pernah `outline: none` tanpa pengganti.
- Area sentuh minimal 44×44px.
- Status dinamis (memeriksa, hasil OCR, galat) diumumkan lewat `aria-live`.
- Judul halaman berurutan (h1 → h2 → h3), tidak melompati tingkat.
- Teks tidak boleh satu-satunya pembawa makna; selalu ada label.

## 9. Larangan

- Jangan menyalin layout, urutan section, atau copy dari situs referensi.
- Jangan memakai gradient, glassmorphism, glow, atau neon.
- Jangan memakai lebih dari satu keluarga font.
- Jangan memakai `text-zinc-*`, `bg-zinc-*`, `dark:` — mode gelap tidak ada.
- Jangan memakai lime untuk status risiko atau pesan galat.
- Jangan memakai animasi yang menunda kemunculan konten.
- Jangan menaruh lebih dari satu CTA primer dalam satu viewport.

## 10. Peta implementasi

| Token / aturan   | Lokasi |
| ---------------- | ------ |
| Warna & bayangan | `app/globals.css` → `:root` (primitif `--ck-*`) + `@theme inline` (pemetaan utilitas) |
| Skala tipografi  | `app/globals.css` → `@layer components` (`.t-*`) |
| Font             | `app/layout.tsx` (`Inter_Tight`, `--font-inter-tight`) |
| Primitif UI      | `components/ui/` |
| Kerangka publik  | `app/(public)/layout.tsx` |

Setiap penambahan komponen baru harus memakai token di atas. Bila butuh nilai
baru, tambahkan ke tabel di dokumen ini pada commit yang sama.
