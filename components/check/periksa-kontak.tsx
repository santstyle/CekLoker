"use client";

import { useMemo } from "react";

import { analisisKontak } from "@/lib/evaluation/kontak-domain";

/**
 * Pemeriksaan kontak & domain — berjalan sepenuhnya di peramban.
 *
 * Tidak ada permintaan jaringan: analisis dilakukan dari teks yang diketik
 * pengguna dan nama perusahaan (opsional). Hasilnya berupa petunjuk
 * pendamping, bukan vonis.
 */
export function PeriksaKontak({
  teks,
  perusahaan,
}: {
  teks: string;
  perusahaan: string;
}) {
  const analisis = useMemo(
    () => analisisKontak(teks, perusahaan),
    [teks, perusahaan],
  );

  const adaIsian = teks.trim().length >= 20;

  if (!adaIsian) return null;

  const kosong =
    analisis.email.length === 0 &&
    analisis.telepon.length === 0 &&
    analisis.situs.length === 0;

  return (
    <section
      id="periksa-kontak"
      aria-labelledby="judul-periksa-kontak"
      className="mt-4 rounded-2xl border border-line bg-cream/50 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="judul-periksa-kontak"
          className="text-xs font-bold tracking-wide text-ink uppercase"
        >
          Pemeriksaan kontak & domain
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[0.6rem] font-semibold tracking-wide text-muted uppercase">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          </svg>
          Di peramban · tanpa jaringan
        </span>
      </div>

      {kosong ? (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          Belum ada kontak tertangkap dari teks. Tambahkan cara menghubungi
          perekrut untuk hasil pemeriksaan lebih lengkap.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3 text-xs leading-relaxed">
          {analisis.email.length > 0 && (
            <div>
              <p className="font-semibold text-ink">
                Email terdeteksi ({analisis.email.length})
              </p>
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {analisis.email.map((item) => (
                  <li
                    key={item.alamat}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <span className="rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[0.7rem] text-ink">
                      {item.alamat}
                    </span>
                    {item.domainGratis ? (
                      <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[0.62rem] font-semibold text-rose-800">
                        Domain layanan gratis
                      </span>
                    ) : item.menyerupaiPerusahaan === true ? (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[0.62rem] font-semibold text-emerald-800">
                        Domain menyerupai nama perusahaan
                      </span>
                    ) : item.menyerupaiPerusahaan === false ? (
                      <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[0.62rem] font-semibold text-amber-800">
                        Domain tidak menyerupai nama perusahaan
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-line bg-paper px-2 py-0.5 text-[0.62rem] font-semibold text-muted">
                        Bukan domain layanan gratis
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analisis.telepon.length > 0 && (
            <div>
              <p className="font-semibold text-ink">
                Nomor telepon terdeteksi ({analisis.telepon.length})
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {analisis.telepon.map((nomor) => (
                  <li
                    key={nomor}
                    className="rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[0.7rem] text-ink"
                  >
                    {nomor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analisis.situs.length > 0 && (
            <div>
              <p className="font-semibold text-ink">
                Situs terdeteksi ({analisis.situs.length})
              </p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {analisis.situs.map((situs) => (
                  <li
                    key={situs}
                    className="rounded-lg border border-line bg-paper px-2 py-1 font-mono text-[0.7rem] break-all text-ink"
                  >
                    {situs}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analisis.hanyaTelepon && (
            <p
              role="status"
              className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 size-4 shrink-0"
              >
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
              <span>
                Kontak hanya berupa nomor telepon. Verifikasi identitas
                perusahaan lewat situs resmi atau kanal terdaftar sebelum
                mengirim data pribadi.
              </span>
            </p>
          )}
        </div>
      )}
    </section>
  );
}
