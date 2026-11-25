# Phase 1 Audit — `/cek` Flow (Before Changes)

**Baseline commit:** `main` / `431dd05` (PR #77 merged)  
**Date:** 2026-11-24  
**Scope:** `/cek` page, poster OCR upload, text paste, result display, mobile behavior (375 px)  
**Out of scope:** scoring logic, sector detection, internal OCR pipeline, other pages, global styles

---

## 1. Minimum Steps / Clicks per Input Path

| Path                            | Current Steps (clicks)                                                                              | Target Steps (clicks)                               | Notes                                                  |
| ------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| **Poster Upload** (file picker) | 5: Click dropzone → pick file → wait OCR → see text in textarea → click "Periksa lowongan sekarang" | 2: Pick file → wait OCR (auto-submit)               | User must click submit after OCR finishes              |
| **Poster Drag & Drop**          | 4: Drag file onto dropzone → wait OCR → see text → click submit                                     | 2: Drop file → wait OCR (auto-submit)               | Same as upload                                         |
| **Clipboard Paste (Ctrl+V)**    | 4: Focus page → Ctrl+V → wait OCR → see text → click submit                                         | 2: Ctrl+V → wait OCR (auto-submit)                  | Global listener works; no extra click should be needed |
| **Text Paste (manual)**         | 3: Click "Tempel Teks Iklan" tab → paste text → click submit                                        | 2: Paste text → click submit (explicit button kept) | Explicit button kept per requirements                  |

---

## 2. Required vs Optional Fields

| Field                                   | Current State                                 | Required?              | Notes                                                               |
| --------------------------------------- | --------------------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Teks iklan lowongan (textarea)          | Always visible, `required` attr, min 30 chars | **Yes** (min 30 chars) | Only true required field                                            |
| Lokasi penempatan (PilihLokasi)         | Always visible, labeled "Opsional"            | No                     | Free text allowed but reverts on blur if unrecognized               |
| Jenis pemberi kerja (segmented buttons) | Always visible, 4 options                     | No                     | Defaults to "Otomatis"                                              |
| Nama perusahaan / usaha (input)         | Always visible, labeled "Opsional"            | No                     | Autofilled from OCR/text; `manualEditNama` flag protects user edits |
| PeriksaKontak component                 | Renders when text ≥ 20 chars                  | N/A                    | Informational only                                                  |

**Finding:** All optional fields are always visible, creating form comprehension overhead for new users.

---

## 3. Confusion Points, Dead Ends, Technical Terms, Unclear Errors, Empty Results

| Issue                                             | Location                                                         | Severity | Description                                                                                                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No auto-submit after OCR**                      | `page.tsx` + `unggah-poster.tsx`                                 | High     | User sees extracted text but must manually click submit; no indication that OCR is "done and ready"                                                                                       |
| **Two accuracy warnings**                         | `page.tsx` (lines 378-405) + `unggah-poster.tsx` (lines 436-462) | Medium   | Duplicate "Hasil pindai bisa kurang akurat" messages; one in amber banner (UnggahPoster), one in blue box (page)                                                                          |
| **Unreadable poster error lacks escape path**     | `unggah-poster.tsx` line 258-260                                 | High     | Message: "Teks poster tidak dapat terbaca dengan jelas. Anda dapat mengetik atau menempel isi lowongan secara manual." — but textarea is not focused/ready; user must switch tab manually |
| **Unsupported/too-large file errors are generic** | `unggah-poster.tsx` lines 138-151                                | Medium   | States limits but doesn't guide to text tab or offer immediate alternative                                                                                                                |
| **No cancel/replace during OCR**                  | `unggah-poster.tsx`                                              | Medium   | Dropzone becomes `pointer-events-none` while processing; user cannot swap image mid-process                                                                                               |
| **No staged progress feedback**                   | `unggah-poster.tsx` lines 182-184                                | Medium   | Shows "Membaca teks dari poster... (N%)" but no step count (e.g., "2/4") or long-running indicator                                                                                        |
| **Stale results after text edit**                 | `page.tsx`                                                       | Medium   | Editing textarea after OCR does not invalidate prior result; if user navigates back, old result may appear valid                                                                          |
| **"Bersihkan" button clears OCR source flag**     | `page.tsx` lines 446-459                                         | Low      | Clears `sumberOcr` but doesn't reset `jenisPemberiKerja` or `lokasi`                                                                                                                      |
| **Technical term "OCR" in user-facing text**      | Multiple                                                         | Low      | "Pindai Poster (OCR)", "Teks hasil bacaan mesin (OCR)" — acceptable but could be simpler                                                                                                  |
| **Empty result dead end on `/hasil/<id>`**        | `konten-hasil.tsx` lines 155-196                                 | Medium   | "Sesi Tidak Ditemukan" with hard-nav link; no soft reset option                                                                                                                           |

---

## 4. Mobile Issues (375 px)

| Issue                               | Location                     | Severity | Description                                                                                                       |
| ----------------------------------- | ---------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| **File input lacks `capture` hint** | `unggah-poster.tsx` line 345 | High     | `accept="image/png,image/jpeg,image/webp"` without `capture="environment"` — mobile may not offer camera directly |
| **Drag-drop not usable on mobile**  | `unggah-poster.tsx`          | Expected | Drag-drop desktop-only; clipboard paste works but not obvious                                                     |
| **Tap targets**                     | Various                      | Medium   | Some buttons (tab pills, segmented controls) may be < 44 px height                                                |
| **Primary action reachability**     | `page.tsx`                   | Low      | Submit button at bottom of long form; may require scroll on mobile                                                |
| **Horizontal scroll risk**          | `page.tsx` grid layout       | Low      | `lg:grid-cols-12` with fixed gaps; need verification at 360-390 px                                                |

---

## 5. Processes Running Without Feedback

| Process                                 | Current Feedback                                                    | Gap                                                  |
| --------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------- |
| Image preprocessing (contrast, upscale) | "Mengoptimalkan kontras gambar untuk pembacaan..." (single message) | No step indicator; user doesn't know how many stages |
| Tesseract worker loading                | "Memuat mesin pembaca teks OCR..."                                  | No progress; can take several seconds on first load  |
| OCR recognition (dual pass)             | "Membaca teks dari poster... (N%)"                                  | Percentage only; no stage count (pass 1/2)           |
| API evaluation call                     | Button shows "Sedang memeriksa..." + spinner                        | Adequate for this step                               |
| Result page load                        | Spinner "Memuat analisis hasil evaluasi..."                         | Adequate                                             |

---

## Before/After Step-Click Comparison (Target for Phase 2)

| Path            | Before (clicks) | After (clicks) | Change                                             |
| --------------- | --------------- | -------------- | -------------------------------------------------- |
| Poster upload   | 5               | 2              | -3 (auto-submit after OCR)                         |
| Drag & drop     | 4               | 2              | -2 (auto-submit after OCR)                         |
| Clipboard paste | 4               | 2              | -2 (auto-submit after OCR)                         |
| Text paste      | 3               | 2              | -1 (keep explicit button, enabled only when valid) |

---

## Summary of Key Findings

1. **Poster/clipboard paths require manual submit after OCR** — biggest friction for new users
2. **Optional fields always visible** — adds cognitive load; should be collapsed by default
3. **No cancel/replace during OCR** — user stuck if wrong image uploaded
4. **Duplicate accuracy warnings** — confusing; consolidate to one brief notice
5. **Error messages lack actionable escape paths** — especially unreadable poster
6. **Mobile file input missing camera/gallery hint** — `capture` attribute needed
7. **No staged progress (step count)** — user sees % but not "where am I in the process"
8. **Stale result risk on text edit** — no invalidation/visual marker after OCR
9. **"Periksa lowongan lain" only on result page** — should also be on `/cek` for one-tap reset

---

## Files Audited (Read-Only)

- `app/(public)/cek/page.tsx` (657 lines)
- `components/check/unggah-poster.tsx` (488 lines)
- `app/(public)/hasil/[id]/konten-hasil.tsx` (624 lines)
- `tests/e2e/alur-cek.spec.ts` (139 lines)
- Referenced: `lib/ocr/kualitas.ts`, `lib/cek/ekstrak-nama-usaha.ts`, `app/api/evaluasi/route.ts`, `components/check/periksa-kontak.tsx`, `components/check/pilih-lokasi.tsx`, `lib/api/evaluasi.ts`, `lib/evaluation/evaluate.ts`, `lib/contoh-lowongan.ts`
