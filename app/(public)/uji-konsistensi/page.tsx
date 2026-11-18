import type { Metadata } from "next";
import Link from "next/link";

import { Kepala } from "@/components/situs/kepala";
import { Reveal } from "@/components/situs/reveal";
import { Container } from "@/components/ui/container";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { KASUS_ACUAN } from "@/lib/evaluation/kasus-acuan";
import type { Band } from "@/lib/evaluation/types";
import { ujiKonsistensi } from "@/lib/evaluation/uji-konsistensi";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Uji Konsistensi",
  deskripsi:
    "CekLoker menguji mesin evaluasinya terhadap himpunan kasus acuan dan menampilkan hasilnya terbuka: rentang, skor, dan aturan per kasus.",
  jalur: "/uji-konsistensi",
});

const GAYA_BAND: Record<Band, string> = {
  rendah: "bg-blue-50 text-blue-800 border-blue-200",
  perlu_dicek: "bg-amber-50 text-amber-800 border-amber-200",
  tinggi: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function HalamanUjiKonsistensi() {
  const ringkasan = ujiKonsistensi();

  return (
    <div className="bg-cream">
      <Kepala
        kicker="Uji Konsistensi · Terbuka"
        judul={
          <>
            Diuji terbuka,{" "}
            <span className="teks-gradasi-terang">bukan diklaim.</span>
          </>
        }
        deskripsi="Setiap versi mesin evaluasi diuji terhadap himpunan kasus acuan. Halaman ini menampilkan hasilnya apa adanya — termasuk bila ada kasus yang keluarannya berbeda dari acuan."
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-16 sm:gap-20">
          {/* Ringkasan */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Ringkasan Hasil
                </h2>
                <p className="text-sm text-muted">
                  Mesin evaluasi versi {ringkasan.versi} diuji terhadap{" "}
                  {ringkasan.total} kasus acuan:{" "}
                  <strong className="text-slate-900">
                    {ringkasan.jumlahCocok}/{ringkasan.total} konsisten dengan
                    acuan
                  </strong>
                  .
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Total Kasus
                  </span>
                  <p className="mt-2 text-4xl font-black text-slate-950">
                    {ringkasan.total}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Contoh iklan sintetis dengan rentang, skor, dan aturan yang
                    sudah dikunci.
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                    Konsisten
                  </span>
                  <p className="mt-2 text-4xl font-black text-emerald-900">
                    {ringkasan.jumlahCocok}
                    <span className="text-xl font-bold">
                      /{ringkasan.total}
                    </span>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                    Kasus yang keluarannya sama persis dengan nilai acuan.
                  </p>
                </div>

                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs">
                  <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                    Deterministik
                  </span>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    v{ringkasan.versi}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Masukan yang sama selalu menghasilkan keluaran yang sama.
                  </p>
                </div>
              </div>
            </section>
          </Reveal>

          {/* Per rentang */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Konsistensi per Rentang Risiko
                </h2>
                <p className="text-sm text-muted">
                  Sebaran kasus acuan pada tiap rentang risiko.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {ringkasan.perBand.map((butir) => (
                  <div
                    key={butir.band}
                    className={`rounded-3xl border p-6 shadow-xs ${GAYA_BAND[butir.band]}`}
                  >
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {LABEL_BAND[butir.band]}
                    </span>
                    <p className="mt-2 text-2xl font-black">
                      {butir.cocok}/{butir.total}
                    </p>
                    <p className="mt-1 text-xs font-semibold">
                      {butir.cocok === butir.total
                        ? "Seluruh kasus konsisten"
                        : `${butir.total - butir.cocok} kasus tidak konsisten`}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* Evaluasi dengan iklan nyata */}
          <Reveal>
            <section className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50/60 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-black tracking-tight text-amber-950">
                  Evaluasi dengan iklan nyata
                </h2>
                <span className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[0.7rem] font-bold tracking-wider text-amber-800 uppercase">
                  Belum dilakukan
                </span>
              </div>
              <p className="text-sm leading-relaxed text-amber-950">
                Seluruh {ringkasan.total} kasus di halaman ini adalah contoh
                sintetis yang ditulis untuk pengujian — bukan iklan lowongan
                pengguna. CekLoker belum menguji mesinnya terhadap iklan nyata:
                pengujian semacam itu hanya dapat dilakukan dengan persetujuan
                pemilik iklan lewat kanal opt-in, atau oleh pihak independen.
                Karena itu tidak ada klaim seberapa sering mesin ini benar pada
                iklan di lapangan — hanya konsistensi terhadap kasus acuan.
              </p>
            </section>
          </Reveal>

          {/* Ketidakkonsistenan */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Kasus yang Tidak Konsisten
                </h2>
                <p className="text-sm text-muted">
                  Bila ada, bagian ini menampilkan kasus yang keluarannya
                  berbeda dari acuan.
                </p>
              </div>

              {ringkasan.tidakCocok.length === 0 ? (
                <div
                  data-testid="tanpa-ketidakcocokan"
                  className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 text-sm leading-relaxed text-emerald-900"
                >
                  Tidak ada ketidakkonsistenan. Seluruh {ringkasan.total} kasus
                  acuan menghasilkan rentang, skor, dan aturan sesuai yang
                  dikunci.
                </div>
              ) : (
                <div
                  data-testid="daftar-ketidakcocokan"
                  className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-xs"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-rose-100 bg-rose-50/70">
                          <th className="p-4 font-bold text-rose-900">Kasus</th>
                          <th className="p-4 font-bold text-rose-900">
                            Rentang acuan
                          </th>
                          <th className="p-4 font-bold text-rose-900">
                            Rentang aktual
                          </th>
                          <th className="p-4 font-bold text-rose-900">
                            Skor (acuan / aktual)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-rose-100">
                        {ringkasan.tidakCocok.map((butir) => (
                          <tr key={butir.id}>
                            <td className="p-4 align-top font-mono text-xs text-slate-700">
                              {butir.id}
                            </td>
                            <td className="p-4 align-top text-slate-700">
                              {LABEL_BAND[butir.expectedBand]}
                            </td>
                            <td className="p-4 align-top font-semibold text-rose-800">
                              {LABEL_BAND[butir.band]}
                            </td>
                            <td className="p-4 align-top text-slate-700">
                              {butir.expectedSkor} / {butir.skor}
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

          {/* Daftar kasus */}
          <Reveal>
            <section className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Daftar {ringkasan.total} Kasus Acuan
                </h2>
                <p className="text-sm text-muted">
                  Setiap kasus menyebut apa yang diuji dan keluaran yang
                  diharapkan.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="p-4 font-bold text-slate-900">Kasus</th>
                        <th className="p-4 font-bold text-slate-900">
                          Yang diuji
                        </th>
                        <th className="p-4 font-bold text-slate-900">
                          Rentang
                        </th>
                        <th className="p-4 font-bold text-slate-900">Skor</th>
                        <th className="p-4 font-bold text-slate-900">Aturan</th>
                        <th className="p-4 font-bold text-slate-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ringkasan.kasus.map((butir) => (
                        <tr
                          key={butir.id}
                          className="transition-colors hover:bg-slate-50/50"
                        >
                          <td className="p-4 align-top font-mono text-xs text-slate-700">
                            {butir.id}
                          </td>
                          <td className="max-w-xs p-4 align-top text-slate-600">
                            {butir.catatan}
                          </td>
                          <td className="p-4 align-top">
                            <span
                              className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${GAYA_BAND[butir.expectedBand]}`}
                            >
                              {LABEL_BAND[butir.expectedBand]}
                            </span>
                          </td>
                          <td className="p-4 align-top text-slate-700">
                            {butir.expectedSkor}
                          </td>
                          <td className="p-4 align-top text-slate-700">
                            {butir.expectedRuleIds.length}
                          </td>
                          <td className="p-4 align-top">
                            {butir.cocok ? (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-emerald-700">
                                Konsisten
                              </span>
                            ) : (
                              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap text-rose-700">
                                Tidak konsisten
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
                Seluruh teks pada halaman ini adalah contoh sintetis yang
                ditulis untuk pengujian — bukan iklan lowongan pengguna.
                Himpunan acuan berisi {KASUS_ACUAN.length} kasus; jumlahnya
                boleh bertambah seiring bertambahnya aturan yang diuji.
              </p>
            </section>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/metodologi"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:border-slate-400"
              >
                <span>Lihat Metodologi</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/cek"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                <span>Uji dengan Lowongan Anda</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
