"use client";

import { useState } from "react";

import { KANAL_LAPOR, type DataKanalLapor } from "@/lib/kanal-lapor";

/**
 * Penunjuk kanal lapor untuk /bantuan.
 *
 * Semua data kanal berasal dari lib/kanal-lapor (sumber sekunder;
 * perlu_verifikasi: true sampai diverifikasi sendiri oleh pemilik).
 * URL "TODO" tidak pernah dirender sebagai tautan. Setiap kanal menampilkan
 * status verifikasinya secara jujur.
 */

type IdKategori =
  | "biaya_dimuka"
  | "rekening_penipu"
  | "nomor_penipu"
  | "lowongan_palsu"
  | "lowongan_luar_negeri"
  | "data_pribadi_bocor";

interface PilihanKategori {
  id: IdKategori;
  judul: string;
  keterangan: string;
}

export const PILIHAN_KATEGORI: readonly PilihanKategori[] = [
  {
    id: "biaya_dimuka",
    judul: "Diminta membayar di muka",
    keterangan: "Biaya admin, pelatihan, jaminan, atau sejenisnya",
  },
  {
    id: "rekening_penipu",
    judul: "Rekening penipu",
    keterangan: "Nomor rekening tujuan yang tidak resmi",
  },
  {
    id: "nomor_penipu",
    judul: "Nomor penipu",
    keterangan: "Telepon atau WhatsApp mencurigakan",
  },
  {
    id: "lowongan_palsu",
    judul: "Iklan atau akun mencurigakan",
    keterangan: "Di media sosial atau marketplace",
  },
  {
    id: "lowongan_luar_negeri",
    judul: "Lowongan luar negeri",
    keterangan: "Calo atau agen penempatan luar negeri",
  },
  {
    id: "data_pribadi_bocor",
    judul: "Data pribadi sudah terkirim",
    keterangan: "KTP, ijazah, atau data rekening",
  },
] as const;

function labelVerifikasi(kanal: DataKanalLapor): string {
  if (kanal.perlu_verifikasi) {
    return "Belum diverifikasi";
  }
  return kanal.tanggal_verifikasi
    ? `Terakhir diverifikasi: ${kanal.tanggal_verifikasi}`
    : "Belum diverifikasi";
}

function kanalRelevan(id: IdKategori): DataKanalLapor[] {
  return KANAL_LAPOR.filter((k) => k.jenis_kasus.includes(id));
}

export function PenunjukKanal() {
  const [dipilih, setDipilih] = useState<IdKategori | null>(null);
  const [tersalin, setTersalin] = useState<string | null>(null);

  async function salinTeks(teks: string, deskripsi: string) {
    try {
      await navigator.clipboard.writeText(teks);
    } catch {
      // Cadangan bila Clipboard API tidak tersedia.
      const area = document.createElement("textarea");
      area.value = teks;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setTersalin(deskripsi);
    window.setTimeout(() => setTersalin(null), 2000);
  }

  const kanal = dipilih ? kanalRelevan(dipilih) : [];

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900">
          Pilih jenis kasus yang paling mendekati:
        </legend>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {PILIHAN_KATEGORI.map((p) => {
            const aktif = dipilih === p.id;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={aktif}
                onClick={() => setDipilih(aktif ? null : p.id)}
                className={`cursor-pointer rounded-2xl border px-4 py-3 text-left transition-colors ${
                  aktif
                    ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-600/20"
                    : "border-slate-200/80 bg-white hover:bg-slate-50"
                }`}
              >
                <span className="block text-sm font-bold text-slate-900">
                  {p.judul}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {p.keterangan}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {dipilih && (
        <div aria-live="polite">
          {kanal.length === 0 ? (
            <p className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-sm leading-relaxed text-slate-700">
              Belum ada kanal resmi terverifikasi untuk kasus ini. Segera
              hubungi bank Anda dan ambil langkah pencegahan di checklist.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {kanal.map((k) => (
                <li
                  key={k.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-950">
                        {k.nama}
                      </p>
                      {k.cara ? (
                        <p className="mt-0.5 text-xs text-slate-500">
                          Cara: {k.cara}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-[0.65rem] font-bold tracking-[0.12em] text-amber-800 uppercase">
                      {labelVerifikasi(k)}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {k.url && k.url !== "TODO" ? (
                      <a
                        href={k.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-800 transition-colors hover:bg-blue-100"
                      >
                        Buka situs <span aria-hidden="true">↗</span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-amber-800 uppercase">
                        Tautan resmi belum tersedia
                      </span>
                    )}
                    {k.telepon ? (
                      <button
                        type="button"
                        onClick={() => salinTeks(k.telepon!, `${k.id}-telepon`)}
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        {tersalin === `${k.id}-telepon`
                          ? "Tersalin!"
                          : `Telepon ${k.telepon}`}
                        {tersalin === `${k.id}-telepon` ? null : (
                          <span aria-hidden="true">⧉</span>
                        )}
                      </button>
                    ) : null}
                    {k.whatsapp ? (
                      <button
                        type="button"
                        onClick={() => salinTeks(k.whatsapp!, `${k.id}-wa`)}
                        className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100"
                      >
                        {tersalin === `${k.id}-wa`
                          ? "Tersalin!"
                          : `WhatsApp ${k.whatsapp}`}
                        {tersalin === `${k.id}-wa` ? null : (
                          <span aria-hidden="true">⧉</span>
                        )}
                      </button>
                    ) : null}
                  </div>

                  {k.catatan ? (
                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {k.catatan}
                    </p>
                  ) : null}
                  {k.syarat_bukti && k.syarat_bukti.length > 0 ? (
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Bukti yang perlu disiapkan:{" "}
                      </span>
                      {k.syarat_bukti.join(", ")}.
                    </p>
                  ) : null}
                  {k.perlu_verifikasi && k.tanggal_verifikasi ? (
                    <p className="mt-2 text-[0.65rem] leading-relaxed text-slate-600">
                      Terakhir diverifikasi: {k.tanggal_verifikasi}
                    </p>
                  ) : (
                    <p className="mt-2 text-[0.65rem] leading-relaxed text-slate-600">
                      Informasi ini dari sumber sekunder dan belum diverifikasi;
                      konfirmasi melalui situs resmi instansi.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="text-xs leading-relaxed text-slate-600">
        Catatan jujur: kanal tertentu (mis. CekRekening.id) tidak
        mengembalikan uang atau membekukan rekening; urusan uang dan
        pemblokiran transaksi sebaiknya lewat bank atau penyedia e-wallet
        Anda. CekLoker bukan lembaga pelaporan dan bukan nasihat hukum.
      </p>
    </div>
  );
}