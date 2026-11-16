"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import {
  bacaStatus,
  hitungLangkah,
  KUNCI_CHECKLIST,
  PILIHAN_SITUASI,
  simpanStatus,
  type IdSituasi,
  type StatusChecklist,
} from "@/lib/bantuan/checklist";

/**
 * Checklist 24 jam pertama. Seluruh status hanya di sessionStorage
 * peramban pengguna; tidak ada request jaringan. Tombol "Hapus semua
 * data" menghapus status checklist dari sessionStorage.
 *
 * Penyimpanan dibaca lewat useSyncExternalStore: snapshot server selalu
 * kosong, lalu setelah hidrasi dibaca dari sessionStorage — render awal
 * cocok dengan server, tanpa efek samping sinkron di dalam useEffect.
 */

/** Cache pembacaan sessionStorage agar snapshot selalu stabil. */
let cacheChecklist: string | null | undefined;
const pendengarChecklist = new Set<() => void>();

function bacaDariStorage(): string | null {
  if (cacheChecklist === undefined) {
    try {
      cacheChecklist = window.sessionStorage.getItem(KUNCI_CHECKLIST);
    } catch {
      // sessionStorage tidak tersedia; perlakukan sebagai kosong.
      cacheChecklist = null;
    }
  }
  return cacheChecklist;
}

function bacaKlien(): string | null {
  return bacaDariStorage();
}

function bacaServer(): string | null {
  return null;
}

function langganan(pendengar: () => void): () => void {
  pendengarChecklist.add(pendengar);
  return () => {
    pendengarChecklist.delete(pendengar);
  };
}

/** Menulis storage + cache, lalu memberitahu langganan. */
function tulisChecklist(mentah: string | null): void {
  cacheChecklist = mentah;
  try {
    if (mentah === null) {
      window.sessionStorage.removeItem(KUNCI_CHECKLIST);
    } else {
      window.sessionStorage.setItem(KUNCI_CHECKLIST, mentah);
    }
  } catch {
    // sessionStorage tidak tersedia; status tetap diperbarui di memori.
  }
  for (const pendengar of pendengarChecklist) pendengar();
}

const STATUS_AWAL: StatusChecklist = { situasi: [], selesai: [] };

export function Checklist24Jam() {
  const mentah = useSyncExternalStore(
    langganan,
    bacaKlien,
    bacaServer,
  );
  // Perubahan lokal menimpa hasil bacaan storage sampai tombol hapus
  // dipakai; null berarti belum ada perubahan sejak dimuat.
  const [statusLokal, setStatusLokal] = useState<StatusChecklist | null>(null);

  const status = useMemo<StatusChecklist>(
    () => statusLokal ?? bacaStatus(mentah) ?? STATUS_AWAL,
    [statusLokal, mentah],
  );

  const { situasi, selesai } = status;

  function simpan(perubahan: (sebelumnya: StatusChecklist) => StatusChecklist) {
    const berikutnya = perubahan(status);
    tulisChecklist(simpanStatus(berikutnya));
    setStatusLokal(berikutnya);
  }

  const ubahSituasi = (id: IdSituasi, aktif: boolean) =>
    simpan((sebelumnya) => ({
      ...sebelumnya,
      situasi: aktif
        ? sebelumnya.situasi.includes(id)
          ? sebelumnya.situasi
          : [...sebelumnya.situasi, id]
        : sebelumnya.situasi.filter((s) => s !== id),
    }));

  const ubahLangkah = (idLangkah: string, aktif: boolean) =>
    simpan((sebelumnya) => ({
      ...sebelumnya,
      selesai: aktif
        ? sebelumnya.selesai.includes(idLangkah)
          ? sebelumnya.selesai
          : [...sebelumnya.selesai, idLangkah]
        : sebelumnya.selesai.filter((s) => s !== idLangkah),
    }));

  function hapusSemuaData() {
    tulisChecklist(null);
    setStatusLokal(STATUS_AWAL);
  }

  const jawaban: Partial<Record<IdSituasi, boolean>> = {};
  for (const s of situasi) jawaban[s] = true;
  const langkah = hitungLangkah(jawaban);

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">
          Pilih semua situasi yang terjadi:
        </legend>
        <div className="mt-3 flex flex-col gap-2.5">
          {PILIHAN_SITUASI.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={situasi.includes(p.id)}
                onChange={(e) => ubahSituasi(p.id, e.target.checked)}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
        <h3 className="text-base font-bold text-slate-950">
          Langkah yang sesuai untuk Anda
        </h3>
        {langkah.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            Pilih situasi di atas untuk melihat langkah yang sesuai.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {langkah.map((l) => {
              const centang = selesai.includes(l.id);
              return (
                <li
                  key={l.id}
                  className={
                    centang
                      ? "rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3"
                      : "rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3"
                  }
                >
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={centang}
                      onChange={(e) => ubahLangkah(l.id, e.target.checked)}
                    />
                    <span
                      className={
                        centang
                          ? "text-sm text-emerald-900 line-through"
                          : "text-sm text-slate-700"
                      }
                    >
                      {l.teks}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={hapusSemuaData}
          className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-red-200 bg-white px-5 py-2 text-xs font-bold text-red-700 transition-colors hover:bg-red-50"
        >
          Hapus semua data
        </button>
        <p className="mt-1.5 text-xs text-slate-600">
          Menghapus status checklist dari peramban ini. Tidak ada data yang
          dikirim ke server.
        </p>
      </div>
    </div>
  );
}
