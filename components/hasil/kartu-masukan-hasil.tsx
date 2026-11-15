"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";

import {
  ALASAN_MASUKAN,
  KETERANGAN_ALASAN_MASUKAN,
  LABEL_ALASAN_MASUKAN,
  kunciSimpananMasukan,
  type AlasanMasukan,
} from "@/lib/api/masukan";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

type Status = "siap" | "mengirim" | "terkirim" | "galat";

/** Apakah masukan untuk sesi ini sudah pernah dikirim di peramban ini. */
function sudahKirim(checkId: string): boolean {
  try {
    return (
      window.sessionStorage.getItem(kunciSimpananMasukan(checkId)) !== null
    );
  } catch {
    return false;
  }
}

function langgananKosong(): () => void {
  return () => {};
}

/**
 * Kartu "Hasil ini keliru?" di halaman hasil.
 *
 * Pengguna memilih satu alasan kategorikal (dan opsional satu temuan) lalu
 * mengirimnya ke server. Tidak ada catatan bebas: hanya kategori yang dikirim,
 * sehingga teks iklan pengguna tetap tidak pernah tersimpan. Bila server tidak
 * dapat menyimpan, kartu menampilkan galat dan pengguna dapat mencoba lagi.
 */
export function KartuMasukanHasil({
  hasil,
  id,
}: {
  hasil: HasilEvaluasi;
  id: string;
}) {
  const [alasan, setAlasan] = useState<AlasanMasukan | "">("");
  const [ruleCode, setRuleCode] = useState("");
  const [status, setStatus] = useState<Status>("siap");
  const [pesanGalat, setPesanGalat] = useState("");

  // Penanda "sudah dikirim" dibaca lewat useSyncExternalStore: snapshot server
  // selalu false, lalu setelah hidrasi dibaca dari sessionStorage — sehingga
  // render awal cocok dengan server dan tidak ada ketidakcocokan hidrasi.
  const sudahDikirim = useSyncExternalStore(
    langgananKosong,
    () => sudahKirim(id),
    () => false,
  );

  const mengirim = status === "mengirim";
  const terkirim = status === "terkirim" || sudahDikirim;

  async function kirim(peristiwa: FormEvent<HTMLFormElement>) {
    peristiwa.preventDefault();
    if (!alasan || mengirim) return;

    setStatus("mengirim");
    setPesanGalat("");

    try {
      const respons = await fetch("/api/masukan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          checkId: id,
          alasan,
          ...(ruleCode ? { ruleCode } : {}),
        }),
      });

      if (!respons.ok) {
        let pesan = "Masukan belum dapat dikirim. Coba lagi nanti.";
        try {
          const data = (await respons.json()) as { error?: string };
          if (data.error) pesan = data.error;
        } catch {
          // Pakai pesan bawaan bila body galat tidak dapat dibaca.
        }
        setPesanGalat(pesan);
        setStatus("galat");
        return;
      }

      try {
        window.sessionStorage.setItem(kunciSimpananMasukan(id), alasan);
      } catch {
        // sessionStorage dapat tidak tersedia; status tetap terkirim.
      }
      setStatus("terkirim");
    } catch {
      setPesanGalat("Tidak dapat menghubungi server. Periksa koneksi Anda.");
      setStatus("galat");
    }
  }

  return (
    <section
      aria-labelledby="bagian-masukan-hasil"
      className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9"
    >
      <h2
        id="bagian-masukan-hasil"
        className="text-xl font-bold text-slate-950 sm:text-2xl"
      >
        Hasil ini keliru?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
        Bila pemeriksaan tidak sesuai dengan iklan, beri tahu kami. Masukan
        hanya berisi pilihan kategori — bukan teks iklan Anda — dan tanpa data
        pribadi.
      </p>

      {terkirim ? (
        <div className="mt-5 rounded-2xl border border-green-200 bg-green-50/80 p-5 text-sm">
          <p className="font-bold text-green-900">
            Terima kasih, masukan Anda tercatat.
          </p>
          <p className="mt-1 leading-relaxed text-green-800">
            Masukan ini membantu kami meninjau aturan pemeriksaan. Hasil
            evaluasi di atas tetap seperti semula.
          </p>
        </div>
      ) : (
        <form data-testid="form-masukan" onSubmit={kirim} className="mt-5">
          <fieldset disabled={mengirim}>
            <legend className="text-sm font-bold text-slate-900">
              Bagian mana yang keliru?
            </legend>
            <div className="mt-3 flex flex-col gap-2.5">
              {ALASAN_MASUKAN.map((kode) => (
                <label
                  key={kode}
                  htmlFor={`alasan-${kode}`}
                  className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 transition-all hover:border-slate-300 has-checked:border-blue-300 has-checked:bg-blue-50/70"
                >
                  <input
                    type="radio"
                    id={`alasan-${kode}`}
                    name="alasan-masukan"
                    value={kode}
                    data-testid={`alasan-${kode}`}
                    checked={alasan === kode}
                    onChange={() => setAlasan(kode)}
                    className="mt-0.5 size-4 shrink-0 border-slate-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/40"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      {LABEL_ALASAN_MASUKAN[kode]}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                      {KETERANGAN_ALASAN_MASUKAN[kode]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {hasil.temuan.length > 0 && (
            <div className="mt-5">
              <label
                htmlFor="pilih-temuan-masukan"
                className="text-sm font-semibold text-slate-900"
              >
                Temuan mana yang keliru?{" "}
                <span className="font-normal text-slate-500">(opsional)</span>
              </label>
              <select
                id="pilih-temuan-masukan"
                data-testid="pilih-temuan-masukan"
                value={ruleCode}
                onChange={(peristiwa) => setRuleCode(peristiwa.target.value)}
                disabled={mengirim}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/30"
              >
                <option value="">Seluruh hasil / tidak spesifik</option>
                {hasil.temuan.map((temuan) => (
                  <option key={temuan.ruleId} value={temuan.ruleId}>
                    {temuan.judul}
                  </option>
                ))}
              </select>
            </div>
          )}

          {status === "galat" && pesanGalat && (
            <p
              data-testid="pesan-galat-masukan"
              role="alert"
              className="mt-4 text-sm font-medium text-rose-700"
            >
              {pesanGalat}
            </p>
          )}

          <button
            type="submit"
            data-testid="tombol-kirim-masukan"
            disabled={!alasan || mengirim}
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
              !alasan || mengirim
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-slate-950 text-white hover:bg-slate-800"
            }`}
          >
            {mengirim ? "Mengirim…" : "Kirim masukan"}
          </button>
        </form>
      )}

      <p
        data-testid="status-masukan"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {mengirim
          ? "Mengirim masukan…"
          : terkirim
            ? "Masukan terkirim."
            : status === "galat"
              ? pesanGalat
              : ""}
      </p>
    </section>
  );
}
