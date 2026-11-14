# Ilustrasi liputan ("Dari lapangan")

Masukkan 4 gambar ilustrasi ke folder ini, lalu beri tahu tim — gambar akan disambungkan ke kartu liputan di beranda (menggantikan ilustrasi SVG sementara di `components/situs/ilustrasi-kasus.tsx`).

## Nama file wajib

```
kasus-01.png   → Tribratanews Polda Jabar
kasus-02.png   → Liputan6.com
kasus-03.png   → CNBC Indonesia
kasus-04.png   → detikFinance
```

PNG atau WebP, ukuran besar boleh (akan dikompresi otomatis oleh `next/image`).

## Spesifikasi

- Rasio **16:9 landscape**, minimal ±1536×864 px
- Gaya flat editorial konsisten: latar navy gelap `#0F172A`, palet azure `#2563EB` + sky `#7DD3FC`, aksen amber `#D97706` hanya untuk tanda peringatan
- **Tanpa teks, huruf, angka, logo, atau merek apa pun** — AI sering mengacaukan teks, dan merek pihak lain tidak boleh ikut tampil
- Tanpa wajah manusia sungguhan — siluet abstrak saja
- Ilustrasi harus dibaca sebagai **ilustrasi** (bukan foto artikel); chip "ILUSTRASI" pada kartu dipertahankan

## Prompt siap pakai

Blok gaya (tempel di akhir setiap prompt):

```
Modern flat editorial illustration for a professional news magazine, deep navy background (#0F172A), azure blue (#2563EB) and soft sky blue (#7DD3FC) palette with a single subtle amber (#D97706) warning accent, soft radial glow, subtle film grain texture, smooth gradients, minimal geometric shapes, no text, no letters, no numbers, no logos, no brand marks, no photorealism, abstract human silhouettes only, wide 16:9 cinematic composition, centered subject with breathing room, premium fintech-editorial poster style.
```

Adegan per kartu:

- **01** — `A giant glowing smartphone hovering in the center, bright chat bubbles with menacing glow rising from its screen, desperate abstract human silhouettes reaching toward the phone from below, a glowing warning shield floating above it, faint red and blue police siren light glow in the upper corner.`
- **02** — `A postal delivery van in silhouette driving toward the viewer, a giant torn paper flyer with a bold red X strike across it floating in the air, an open envelope and parcel boxes scattered, a magnifying glass hovering over the scene.`
- **03** — `A laptop viewed from an angle displaying an abstract identity card with a faceless avatar silhouette, a broken chain link splitting apart beside the screen, a magnifying glass scanning the profile card, a faint red warning glow around the avatar.`
- **04** — `A hand holding a smartphone showing a chat conversation with glowing bubbles, floating coins circling the phone, a shopping cart and a small parcel box beside it, a small amber caution triangle in the corner of the screen.`
