# Verifikasi Rujukan Hukum

Status setiap sumber hukum yang dipakai CekLoker, beserta cara memeriksanya.
Dokumen ini adalah sumber kebenaran untuk klaim "terverifikasi" di antarmuka —
jangan pernah menandai sumber terverifikasi tanpa mengikuti proses di bawah.

**Status per 18 November 2026: belum satu pun sumber di bawah diverifikasi ulang
oleh pemilik CekLoker terhadap teks resmi terbaru.** Karena itu seluruh rujukan
ditampilkan sebagai "Belum diverifikasi" di /metodologi dan /sumber, dan
`tanggalVerifikasi` pada `lib/evaluation/rujukan.ts` serta kartu di
`app/(public)/sumber/page.tsx` bernilai `null`.

## Tabel status verifikasi

| Id rujukan (mesin)    | Dipakai oleh aturan               | Teks yang harus diperiksa                                                                                                                                                 | Sumber resmi                 | Status                                        |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | --------------------------------------------- |
| `uu-13-2003-pasal-5`  | `diskriminasi_gender_usia`        | Bunyi pasal terkini setelah perubahan UU 11/2020 jo. UU 6/2023                                                                                                            | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `uu-13-2003-pasal-6`  | `diskriminasi_gender_usia`        | Sama seperti di atas                                                                                                                                                      | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `uu-13-2003-pasal-38` | `pungutan_biaya`                  | Sama seperti di atas; periksa kaitan pasal dengan larangan pungutan/biaya penempatan                                                                                      | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `uu-13-2003-pasal-77` | `waktu_kerja_berlebih`            | Sama seperti di atas (waktu kerja)                                                                                                                                        | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `uu-13-2003-pasal-78` | `lembur_tanpa_batas`              | Sama seperti di atas (lembur)                                                                                                                                             | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `uu-13-2003-pasal-89` | `upah_dibawah_umr`                | Sama seperti di atas (upah minimum)                                                                                                                                       | peraturan.go.id — UU 13/2003 | Belum diverifikasi                            |
| `permenaker-39-2016`  | `pungutan_biaya`                  | Relevansi terhadap aturan pungutan biaya — **sangat diragukan**; Permenaker 39/2016 mengatur Persyaratan dan Tatacara PKWT, bukan larangan biaya                          | jdih.kemnaker.go.id          | Belum diverifikasi — kandidat diganti/dihapus |
| `uu-27-2022`          | `minta_dokumen_sensitif_dini`     | UU 27/2022 = Pelindungan Data Pribadi; periksa kaitannya dengan indikator permintaan dokumen lebih awal (PDP mengatur pemrosesan data, bukan "larangan memungut dokumen") | peraturan.go.id — UU 27/2022 | Belum diverifikasi                            |
| `uu-18-2017`          | `penempatan_luar_negeri_nonresmi` | Bunyi terkini dan kaitannya dengan indikator penempatan luar negeri nonresmi                                                                                              | peraturan.go.id — UU 18/2017 | Belum diverifikasi                            |

### Sumber pendukung (tidak dirujuk mesin, ditampilkan di /sumber)

| Daftar di /sumber                            | Sumber resmi        | Status             |
| -------------------------------------------- | ------------------- | ------------------ |
| UU 13/2003 (pasal 5, 6, 38, 77, 78, 89)      | peraturan.go.id     | Belum diverifikasi |
| UU 27/2022 (Pelindungan Data Pribadi)        | peraturan.go.id     | Belum diverifikasi |
| UU 18/2017 (Pekerja Migran Indonesia)        | peraturan.go.id     | Belum diverifikasi |
| Permenaker 7/2013 (Upah Minimum)             | jdih.kemnaker.go.id | Belum diverifikasi |
| Permenaker 39/2016 (PKWT)                    | jdih.kemnaker.go.id | Belum diverifikasi |
| PP 36/2021 (Pengupahan)                      | peraturan.go.id     | Belum diverifikasi |
| KEP Menaker 226/2019 (Pedoman Penetapan UMP) | jdih.kemnaker.go.id | Belum diverifikasi |
| SE Menaker 1/2020 (Pelaksanaan Upah Minimum) | jdih.kemnaker.go.id | Belum diverifikasi |

## Perbaikan yang sudah diterapkan (18 Nov 2026)

- **Kesalahan identitas UU 27/2022 diperbaiki**: entri di `app/(public)/sumber/page.tsx`
  sebelumnya menulis "UU No. 27 Tahun 2022 tentang Pelindungan Pekerja Migran" —
  itu salah; UU 27/2022 adalah Undang-Undang Pelindungan Data Pribadi. Entri
  dikoreksi menjadi "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi".
- **Status verifikasi kini tampil**: "Belum diverifikasi" / "Terakhir
  diverifikasi: <tanggal>" ditampilkan per rujukan di /metodologi (kolom
  Rujukan Hukum) dan /sumber (kartu sumber + tabel rujukan per aturan), serta
  di catatan Metodologi halaman /sumber.
- Semua entri `VERIFIKASI_RUJUKAN` (`lib/evaluation/rujukan.ts`) dan
  `SUMBER_HUKUM` (`app/(public)/sumber/page.tsx`) diberi `tanggalVerifikasi: null`
  dan `perluVerifikasi: true` — jujur: belum ada bukti pemeriksaan teks pasal.

## Catatan hukum yang perlu diperhatikan saat verifikasi

1. **UU 13/2003 telah berubah.** UU Cipta Kerja No. 11 Tahun 2020 diputus
   inkonstitusional bersyarat oleh Mahkamah Konstitusi (Putusan 91/PUU-XVIII/2020,
   25 Nov 2021), lalu Perpu 2/2022 disahkan menjadi **UU 6/2023**. Pasal-pasal
   yang dirujuk CekLoker (5, 6, 38, 77, 78, 89) harus diperiksa terhadap bunyi
   **UU 6/2023**, bukan UU 13/2003 asli. Dokumen "terverifikasi" harus menyebut
   versi mana yang diperiksa.
2. **UU 27/2022 ≠ UU Pekerja Migran.** Pastikan tidak ada lagi sisa rujukan yang
   mengaitkan UU 27/2022 dengan penempatan tenaga kerja luar negeri.
3. **Permenaker 39/2016** kemungkinan besar rujukan yang salah untuk aturan
   `pungutan_biaya` — PKWT ≠ pungutan biaya. Verifikator harus memutuskan:
   ganti dengan peraturan yang tepat (mis. aturan tentang biaya penempatan
   tenaga kerja) atau hapus rujukannya. Jangan menghapus indikator tanpa
   keputusan pemilik; catat hasilnya di dokumen ini.
4. **UU 18/2017** menggantikan UU 39/2004; pastikan pasal yang relevan untuk
   indikator luar negeri dirujuk dengan benar.

## Proses menandai sumber terverifikasi

1. Buka teks resmi (peraturan.go.id atau jdih.kemnaker.go.id) dan baca bunyi
   pasal yang dipakai indikator — bukan sekadar halaman judul.
2. Periksa status keberlakuan terhadap perubahan terbaru (lihat catatan 1–4
   di atas).
3. Isi `tanggalVerifikasi` (ISO YYYY-MM-DD) dan set `perluVerifikasi: false`
   pada entri yang sama di `VERIFIKASI_RUJUKAN` (`lib/evaluation/rujukan.ts`)
   dan/atau `SUMBER_HUKUM` (`app/(public)/sumber/page.tsx`) — **dalam satu
   suntingan**.
4. Perbarui dokumen ini: pindahkan baris ke status "Terverifikasi" dengan
   tanggal dan catatan singkat temuannya.
5. Jalankan `pnpm periksa:tautan` untuk memastikan tautan masih hidup.
6. UI akan otomatis menampilkan "Terakhir diverifikasi: <tanggal>".

## Pemeriksa tautan

```
pnpm periksa:tautan
```

Membaca seluruh URL `https://…` dari `lib/evaluation/rujukan.ts` dan
`app/(public)/sumber/page.tsx`, lalu memeriksanya (HEAD, fallback GET). Skrip
ini **tidak** menandai apa pun terverifikasi — hanya memeriksa bahwa tautan
masih bisa dibuka. Skrip butuh akses jaringan; jalankan di lingkungan yang
bisa menghubungi peraturan.go.id dan jdih.kemnaker.go.id. Status keluaran:
0 = semua tautan OK (2xx/3xx), 1 = ada yang gagal.
