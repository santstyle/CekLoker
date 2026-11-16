"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { cn } from "@/components/ui/cn";
import { KATEGORI_KUIS, KUIS_PERTANYAAN, nilaiKuis } from "@/lib/edukasi/kuis";

/**
 * Kuis edukasi — berjalan sepenuhnya di peramban.
 *
 * Tidak ada permintaan jaringan dan tidak ada jawaban yang disimpan atau
 * dikirim. Hasil hanya dipakai untuk refleksi diri, bukan vonis apa pun.
 */
export function KuisEdukasi() {
  const [jawaban, setJawaban] = useState<Record<string, number>>({});
  const [terkirim, setTerkirim] = useState(false);
  const hasilRef = useRef<HTMLDivElement>(null);

  const deretJawaban = useMemo(
    () => KUIS_PERTANYAAN.map((soal) => jawaban[soal.id]),
    [jawaban],
  );
  const hasil = useMemo(() => nilaiKuis(deretJawaban), [deretJawaban]);
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

  function tanganiKirim(peristiwa: FormEvent<HTMLFormElement>) {
    peristiwa.preventDefault();
    if (!lengkap || terkirim) return;
    setTerkirim(true);
  }

  function ulangi() {
    setJawaban({});
    setTerkirim(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={tanganiKirim} noValidate>
        <div className="flex flex-col gap-8">
          {KUIS_PERTANYAAN.map((soal, nomorSoal) => {
            const dipilih = jawaban[soal.id];
            return (
              <fieldset
                key={soal.id}
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
                  Soal {nomorSoal + 1} dari {KUIS_PERTANYAAN.length}
                </legend>

                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white"
                  >
                    {nomorSoal + 1}
                  </span>
                  <p className="min-w-0 flex-1 text-base leading-snug font-bold break-words text-slate-950 sm:text-lg">
                    {soal.pertanyaan}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  {soal.pilihan.map((teks, indeks) => {
                    const idOpsi = `${soal.id}-p-${indeks}`;
                    const merupakanJawaban = indeks === soal.jawaban;
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
                          name={soal.id}
                          value={indeks}
                          checked={dipilihUser}
                          onChange={() => pilih(soal.id, indeks)}
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
            Jawab seluruh soal untuk melihat hasil. Kuis berjalan sepenuhnya di
            peramban — tidak ada jawaban yang dikirim atau disimpan.
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
                / {KUIS_PERTANYAAN.length} benar
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
            {KUIS_PERTANYAAN.map((soal, indeks) => {
              const dipilih = deretJawaban[indeks];
              const tepat = dipilih === soal.jawaban;
              return (
                <li
                  key={soal.id}
                  className={cn(
                    "min-w-0 rounded-2xl border p-5",
                    tepat
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-rose-200 bg-rose-50/50",
                  )}
                >
                  <p className="text-sm font-bold break-words text-slate-950">
                    <span className="text-slate-500">Soal {indeks + 1} · </span>
                    {tepat ? "Benar" : "Belum tepat"} — {soal.pertanyaan}
                  </p>
                  {!tepat && (
                    <p className="mt-1 text-sm break-words text-slate-700">
                      Jawaban benar:{" "}
                      <strong>{soal.pilihan[soal.jawaban]}</strong>
                    </p>
                  )}
                  <p className="mt-2 text-sm leading-relaxed break-words text-slate-600">
                    {soal.penjelasan}
                  </p>
                  {soal.rujukan && (
                    <p className="mt-2 text-xs font-semibold break-words text-slate-500">
                      Rujukan: {soal.rujukan}
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
