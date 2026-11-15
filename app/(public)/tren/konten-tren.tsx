import { connection } from "next/server";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/situs/reveal";
import { getDb } from "@/lib/db/client";
import { checks } from "@/lib/db/schema";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { RULES } from "@/lib/evaluation/rules";
import type { Band } from "@/lib/evaluation/types";
import {
  BATAS_MIN_SAMPEL,
  aturanTeratas,
  ringkasanTren,
  trenBulanan,
  trenWilayah,
  type BarisTrenMentah,
} from "@/lib/tren/agregat";

const GAYA_BAND: Record<Band, string> = {
  rendah: "bg-blue-50 text-blue-800 border-blue-200",
  perlu_dicek: "bg-amber-50 text-amber-800 border-amber-200",
  tinggi: "bg-rose-50 text-rose-800 border-rose-200",
};

function bandDariDb(nilai: string): Band {
  if (nilai === "rendah" || nilai === "tinggi") return nilai;
  return "perlu_dicek";
}

/**
 * Baca baris agregat dari basis data. Mengembalikan null bila basis data
 * tidak tersedia — halaman tetap tampil dengan empty state, bukan error.
 */
async function ambilBaris(): Promise<BarisTrenMentah[] | null> {
  try {
    const baris = await getDb().select().from(checks);
    return baris.map((baris) => ({
      dibuatPada: baris.createdAt,
      region: baris.region,
      band: bandDariDb(baris.band),
      kodeAturan: baris.triggeredRuleCodes,
    }));
  } catch (galat) {
    console.warn("[tren] agregat tidak dapat dimuat:", galat);
    return null;
  }
}

export default async function KontenTren() {
  // Cache Components: tandai komponen ini berjalan pada waktu permintaan.
  // Di luar try/catch agar sinyal "dynamic hole" tidak tertelan — shell
  // statis tetap diprerender, isi dashboard dialirkan saat permintaan.
  await connection();

  const mentah = await ambilBaris();

  const judulAturan: Record<string, string> = {};
  for (const aturan of RULES) judulAturan[aturan.id] = aturan.judul;

  const ringkasan = mentah ? ringkasanTren(mentah) : null;
  const dataTren =
    mentah && ringkasan && ringkasan.total >= BATAS_MIN_SAMPEL
      ? {
          ringkasan,
          bulanan: trenBulanan(mentah),
          aturan: aturanTeratas(mentah, judulAturan),
          wilayah: trenWilayah(mentah),
        }
      : null;

  return (
    <Container className="py-16 sm:py-20">
      {dataTren === null ? (
        <div
          data-testid="tren-belum-cukup"
          className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-3xl border border-line bg-paper p-8 shadow-xs"
        >
          <span className="font-mono text-[0.6rem] font-semibold tracking-[0.22em] text-muted uppercase">
            Sampel belum cukup
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">
            Tren menyala setelah 10 pemeriksaan
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Dashboard ini baru menampilkan angka bila minimal {BATAS_MIN_SAMPEL}{" "}
            pemeriksaan tercatat. Sampel yang lebih sedikit sengaja
            disembunyikan agar segelintir data tidak dikira tren.
          </p>
          <p className="text-sm leading-relaxed text-slate-700">
            {mentah === null
              ? "Sumber data sementara belum dapat diakses; coba muat ulang beberapa saat lagi."
              : "Masing-masing rentang, bulan, aturan, dan wilayah juga disembunyikan secara bertingkat dengan ambang yang sama."}
          </p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-5xl flex-col gap-16">
          {/* Ringkasan */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Ringkasan Pemeriksaan
                </h2>
                <p className="text-sm text-muted">
                  Seluruh {dataTren.ringkasan.total} pemeriksaan yang tercatat,
                  tanpa identitas pengguna.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-4">
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Total
                  </span>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {dataTren.ringkasan.total}
                  </p>
                </div>
                <div className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-blue-700 uppercase">
                    Rendah
                  </span>
                  <p className="mt-2 text-4xl font-black text-blue-950">
                    {dataTren.ringkasan.persenRendah}%
                  </p>
                  <p className="mt-1 text-xs text-blue-800">
                    {dataTren.ringkasan.rendah} pemeriksaan
                  </p>
                </div>
                <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                    Perlu dicek
                  </span>
                  <p className="mt-2 text-4xl font-black text-amber-950">
                    {dataTren.ringkasan.persenPerluDicek}%
                  </p>
                  <p className="mt-1 text-xs text-amber-800">
                    {dataTren.ringkasan.perluDicek} pemeriksaan
                  </p>
                </div>
                <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-rose-700 uppercase">
                    Tinggi
                  </span>
                  <p className="mt-2 text-4xl font-black text-rose-950">
                    {dataTren.ringkasan.persenTinggi}%
                  </p>
                  <p className="mt-1 text-xs text-rose-800">
                    {dataTren.ringkasan.tinggi} pemeriksaan
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Per bulan */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Distribusi per Bulan
                </h2>
                <p className="text-sm text-muted">
                  Dikelompokkan menurut bulan (UTC); bulan dengan kurang dari{" "}
                  {BATAS_MIN_SAMPEL} sampel disembunyikan.
                </p>
              </div>

              {dataTren.bulanan.length === 0 ? (
                <p className="rounded-3xl border border-line bg-paper p-6 text-sm leading-relaxed text-slate-700">
                  Belum ada bulan dengan minimal {BATAS_MIN_SAMPEL} sampel.
                </p>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                      <caption className="sr-only">
                        Distribusi rentang risiko per bulan
                      </caption>
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80">
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Bulan
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Pemeriksaan
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Rendah
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Perlu dicek
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Tinggi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dataTren.bulanan.map((bulan) => (
                          <tr key={bulan.kunci}>
                            <th
                              scope="row"
                              className="p-4 align-top font-semibold text-slate-900"
                            >
                              {bulan.label}
                              <span
                                aria-hidden="true"
                                className="mt-1 flex h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-slate-100"
                              >
                                <span
                                  className="bg-blue-400"
                                  style={{
                                    width: `${(bulan.rendah / bulan.total) * 100}%`,
                                  }}
                                />
                                <span
                                  className="bg-amber-400"
                                  style={{
                                    width: `${(bulan.perluDicek / bulan.total) * 100}%`,
                                  }}
                                />
                                <span
                                  className="bg-rose-400"
                                  style={{
                                    width: `${(bulan.tinggi / bulan.total) * 100}%`,
                                  }}
                                />
                              </span>
                            </th>
                            <td className="p-4 align-top text-slate-700 tabular-nums">
                              {bulan.total}
                            </td>
                            <td className="p-4 align-top text-blue-900 tabular-nums">
                              {bulan.rendah}
                            </td>
                            <td className="p-4 align-top text-amber-900 tabular-nums">
                              {bulan.perluDicek}
                            </td>
                            <td className="p-4 align-top text-rose-900 tabular-nums">
                              {bulan.tinggi}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </Reveal>

          {/* Aturan paling sering menyala */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Aturan yang Paling Sering Menyala
                </h2>
                <p className="text-sm text-muted">
                  Sepuluh terbanyak dari seluruh pemeriksaan tercatat; satu
                  pemeriksaan dapat menyalakan lebih dari satu aturan.
                </p>
              </div>

              {dataTren.aturan.length === 0 ? (
                <p className="rounded-3xl border border-line bg-paper p-6 text-sm text-slate-700">
                  Belum ada aturan yang tercatat.
                </p>
              ) : (
                <ol className="flex flex-col gap-3">
                  {dataTren.aturan.map((butir, indeks) => {
                    const maksimum = dataTren.aturan[0]?.jumlah ?? 1;
                    return (
                      <li
                        key={butir.kode}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
                      >
                        <span
                          aria-hidden="true"
                          className="w-6 text-right font-mono text-xs text-slate-400 tabular-nums"
                        >
                          {indeks + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {butir.judul ?? butir.kode}
                          </p>
                          <div
                            aria-hidden="true"
                            className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
                          >
                            <div
                              className="h-full bg-aksen"
                              style={{
                                width: `${(butir.jumlah / maksimum) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold whitespace-nowrap text-slate-600 tabular-nums">
                          {butir.jumlah}×
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </Reveal>

          {/* Sebaran wilayah */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Sebaran per Wilayah
                </h2>
                <p className="text-sm text-muted">
                  Wilayah dengan minimal {BATAS_MIN_SAMPEL} sampel; di bawah itu
                  disembunyikan. Band dominan menunjukkan rentang terbanyak di
                  wilayah tersebut.
                </p>
              </div>

              {dataTren.wilayah.length === 0 ? (
                <p className="rounded-3xl border border-line bg-paper p-6 text-sm leading-relaxed text-slate-700">
                  Belum ada wilayah dengan minimal {BATAS_MIN_SAMPEL} sampel.
                </p>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                      <caption className="sr-only">
                        Sebaran rentang risiko per wilayah
                      </caption>
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/80">
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Wilayah
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Pemeriksaan
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Band dominan
                          </th>
                          <th
                            scope="col"
                            className="p-4 font-bold text-slate-900"
                          >
                            Porsi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {dataTren.wilayah.map((butir) => (
                          <tr key={butir.wilayah}>
                            <th
                              scope="row"
                              className="p-4 align-top font-semibold text-slate-900"
                            >
                              {butir.wilayah}
                            </th>
                            <td className="p-4 align-top text-slate-700 tabular-nums">
                              {butir.total}
                            </td>
                            <td className="p-4 align-top">
                              <span
                                className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${GAYA_BAND[butir.bandDominan]}`}
                              >
                                {LABEL_BAND[butir.bandDominan]}
                              </span>
                            </td>
                            <td className="p-4 align-top text-slate-700 tabular-nums">
                              {butir.persenDominan}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </Reveal>

          <p className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
            Seluruh angka pada halaman ini adalah data agregat anonim dari
            pemeriksaan sebelumnya. Tidak ada teks iklan, nama, kontak, atau
            hasil individual yang ditampilkan.
          </p>
        </div>
      )}
    </Container>
  );
}
