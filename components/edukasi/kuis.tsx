"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type SubmitEvent,
} from "react";

import { cn } from "@/components/ui/cn";
import {
  KATEGORI_KUIS,
  pilihSoalKuis,
  SOAL_PER_KUIS,
  nilaiKuis,
} from "@/lib/edukasi/kuis";

/**
 * Mengambil seed soal dari URL (`?set=`) agar set soal dapat diulang, atau
 * membuat seed acak baru. Kuis tidak pernah menulis URL sendiri.
 */
function ambilSeedAwal(): number {
  if (typeof window === "undefined") return 0;
  try {
    const nilai = new URLSearchParams(window.location.search).get("set");
    if (nilai !== null) {
      const angka = Number(nilai);
      if (Number.isFinite(angka)) return Math.trunc(angka);
    }
  } catch {
    // URL tidak dapat dibaca — jatuh ke seed acak di bawah.
  }
  return buatSeedAcak();
}

function buatSeedAcak(): number {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] ?? 0;
  }
  return Math.floor(Math.random() * 4294967296);
}

/** Seed yang dipakai saat render server, agar hidrasi tidak berbeda. */
const SEED_SERVER = 0;

let seedKlien: number | null = null;
let kunciSeedKlien = "";

const pendengarSeed = new Set<() => void>();

function kunciLokasi(): string {
  if (typeof window === "undefined") return "";
  return window.location.search;
}

/**
 * Snapshot seed sisi klien. Nilainya di-cache per URL agar stabil selama
 * satu sesi, dan dihitung ulang bila URL berubah (mis. `?set=` lain).
 */
function bacaSeedKlien(): number {
  const kunci = kunciLokasi();
  if (seedKlien === null || kunciSeedKlien !== kunci) {
    seedKlien = ambilSeedAwal();
    kunciSeedKlien = kunci;
  }
  return seedKlien;
}

function bacaSeedServer(): number {
  return SEED_SERVER;
}

function langgananSeed(pendengar: () => void): () => void {
  pendengarSeed.add(pendengar);
  return () => {
    pendengarSeed.delete(pendengar);
  };
}

/** Mengganti seed aktif, mis. saat pengguna menekan "Ulangi Kuis". */
function tetapkanSeed(seed: number): void {
  seedKlien = seed;
  kunciSeedKlien = kunciLokasi();
  for (const pendengar of pendengarSeed) pendengar();
}

/**
 * Kuis edukasi — berjalan sepenuhnya di peramban.
 *
 * Tidak ada permintaan jaringan dan tidak ada jawaban yang disimpan atau
 * dikirim. Hasil hanya dipakai untuk refleksi diri, bukan vonis apa pun.
 */
export function KuisEdukasi() {
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [terkirim, setTerkirim] = useState(false);
  // Seed dipilih di klien lewat store eksternal agar render server tetap
  // deterministik dan hidrasi tidak berbeda.
  const seed = useSyncExternalStore(
    langgananSeed,
    bacaSeedKlien,
    bacaSeedServer,
  );
  const hasilRef = useRef<HTMLDivElement>(null);

  const soal = useMemo(() => pilihSoalKuis(seed), [seed]);

  const deretJawaban = useMemo(
    () => soal.map((butir) => jawaban[butir.id]),
    [jawaban, soal],
  );
  const hasil = useMemo(
    () => nilaiKuis(deretJawaban, soal),
    [deretJawaban, soal],
  );
  const lengkap = deretJawaban.every((j) => typeof j === "number");

  // Saat hasil ditampilkan, pindahkan fokus ke sana agar pembaca layar
  // dan pengguna keyboard langsung mendengar ringkasan nilai.
  useEffect(() => {
    if (terkirim) {
      hasilRef.current?.focus();
    }
  }, [terkirim]);

  function pilih(soalId: string, indeks: number) {
    if (terkirim) return;
    setJawaban((sebelumnya) => ({ ...sebelumnya, [soalId]: indeks }));
  }

  function tanganiKirim(peristiwa: SubmitEvent<HTMLFormElement>) {
    peristiwa.preventDefault();
    if (!lengkap || terkirim) return;
    setTerkirim(true);
  }

  function ulangi() {
    setJawaban({});
    setTerkirim(false);
    tetapkanSeed(buatSeedAcak());
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3.5 text-sm leading-relaxed text-muted sm:px-5">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="mt-0.5 size-4 shrink-0 text-aksen"
        >
          <path
            fillRule="evenodd"
            d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a1 1 0 0 0 0 2v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1H9Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="min-w-0">
          Kuis ini hanya untuk refleksi diri, bukan penilaian atas Anda. Tiap
          sesi menyajikan{" "}
          <strong className="font-semibold text-slate-800">
            {SOAL_PER_KUIS} soal acak
          </strong>{" "}
          dari bank soal — susunannya bisa berbeda dari sesi sebelumnya, dan
          jawaban tidak dikirim atau disimpan.
        </p>
      </div>
      <form onSubmit={tanganiKirim} noValidate>
        <div className="flex flex-col gap-8">
          {soal.map((butir, nomorSoal) => {
            const dipilih = jawaban[butir.id];
            return (
              <fieldset
                key={butir.id}
                disabled={terkirim}
                className="min-w-0 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7"
              >
                {/*
                 * Nomor soal sengaja dipindah ke dalam isi kartu. Elemen
                 * <legend> tidak mengikuti padding fieldset di sebagian
                 * peramban sehingga teks soal panjang bisa melewati tepi
                 * kartu. Legend tetap ada (khusus pembaca layar) agar
                 * kelompok pilihan radio punya nama yang jelas.
                 */}
                <legend className="sr-only">
                  Soal {nomorSoal + 1} dari {soal.length}
                </legend>

                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
                  >
                    {nomorSoal + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-base leading-snug font-bold break-words text-slate-950 sm:text-lg">
                    {butir.pertanyaan}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {butir.pilihan.map((teks, indeks) => {
                    const idOpsi = `${butir.id}-p-${indeks}`;
                    const merupakanJawaban = indeks === butir.jawaban;
                    const dipilihUser = dipilih === indeks;

                    const kelasAktif = terkirim
                      ? merupakanJawaban
                        ? "border-emerald-300 bg-emerald-50/70"
                        : dipilihUser
                          ? "border-rose-300 bg-rose-50/70"
                          : "border-slate-200/90 bg-white"
                      : dipilihUser
                        ? "border-aksen bg-blue-50/60 ring-4 ring-aksen/10"
                        : "border-slate-200/90 bg-white hover:border-slate-300";

                    return (
                      <label
                        key={idOpsi}
                        htmlFor={idOpsi}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed transition-colors",
                          kelasAktif,
                          terkirim && !merupakanJawaban && !dipilihUser
                            ? "text-slate-500"
                            : "text-slate-700",
                        )}
                      >
                        <input
                          type="radio"
                          id={idOpsi}
                          name={butir.id}
                          value={indeks}
                          checked={dipilihUser}
                          onChange={() => pilih(butir.id, indeks)}
                          className="mt-0.5 size-4 accent-[#0f172a]"
                        />
                        <span className="min-w-0 flex-1 break-words">
                          {teks}
                        </span>
                        {terkirim && merupakanJawaban && (
                          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wide whitespace-nowrap text-emerald-900 uppercase">
                            Benar
                          </span>
                        )}
                        {terkirim && dipilihUser && !merupakanJawaban && (
                          <span className="shrink-0 rounded-full bg-rose-100 px-2.5 py-0.5 text-[0.65rem] font-bold tracking-wide whitespace-nowrap text-rose-900 uppercase">
                            Belum tepat
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={!lengkap || terkirim}
            className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full bg-ink px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-deep disabled:pointer-events-none disabled:opacity-40"
          >
            Lihat Hasil
          </button>
          <p className="text-xs text-muted">
            Jawab seluruh soal untuk melihat hasil.
          </p>
        </div>
      </form>

      {terkirim && (
        <div
          ref={hasilRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="flex min-w-0 scroll-mt-24 flex-col gap-6 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-bold tracking-wider text-muted uppercase">
              Hasil Kuis
            </p>
            <p className="text-4xl font-black text-slate-950">
              {hasil.benar}
              <span className="text-2xl font-bold text-slate-400">
                {" "}
                / {soal.length} benar
              </span>
            </p>
            <p className="text-sm text-slate-600">
              Skor {hasil.skorPersen}% — {KATEGORI_KUIS[hasil.kategori]}
            </p>
          </div>

          {hasil.kosong > 0 && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-950">
              {hasil.kosong} soal belum dijawab sehingga tidak dihitung benar.
            </p>
          )}

          <ol className="flex flex-col gap-4">
            {soal.map((butir, indeks) => {
              const dipilih = deretJawaban[indeks];
              const tepat = dipilih === butir.jawaban;
              return (
                <li
                  key={butir.id}
                  className={cn(
                    "min-w-0 rounded-2xl border p-5",
                    tepat
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-rose-200 bg-rose-50/50",
                  )}
                >
                  <p className="text-sm font-bold break-words text-slate-950">
                    <span className="text-slate-500">Soal {indeks + 1} · </span>
                    {tepat ? "Benar" : "Belum tepat"} — {butir.pertanyaan}
                  </p>
                  {!tepat && (
                    <p className="mt-1 text-sm break-words text-slate-700">
                      Jawaban benar:{" "}
                      <strong>{butir.pilihan[butir.jawaban]}</strong>
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed break-words text-slate-600">
                    {butir.penjelasan}
                  </p>
                  {butir.rujukan && (
                    <p className="mt-2 text-xs font-semibold break-words text-slate-500">
                      Rujukan: {butir.rujukan}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={ulangi}
              className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Ulangi Kuis
            </button>
            <Link
              href="/edukasi"
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold text-ink transition-colors hover:text-ink-deep"
            >
              Kembali ke Edukasi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
