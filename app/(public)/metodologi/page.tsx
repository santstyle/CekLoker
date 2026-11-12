import Link from "next/link";

import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { BATAS_BAND } from "@/lib/evaluation/score";
import { KEKUATAN_NILAI, type KategoriRule } from "@/lib/evaluation/types";
import { RULES } from "@/lib/evaluation/rules";

const LABEL_KATEGORI: Record<KategoriRule, string> = {
  upah: "Upah",
  kontak: "Kontak",
  identitas: "Identitas",
  dokumen: "Dokumen",
  seleksi: "Seleksi",
  tekanan: "Tekanan",
  diskriminasi: "Diskriminasi",
  penempatan: "Penempatan",
  lainnya: "Lainnya",
};

const LABEL_KEKUATAN = {
  lemah: "Lemah (×0,5)",
  sedang: "Sedang (×1)",
  kuat: "Kuat (×1,5)",
} as const;

export const metadata = {
  title: "Metodologi — CekLoker",
};

export default function HalamanMetodologi() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Metodologi
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          CekLoker bekerja dengan pemeriksaan berbasis aturan yang
          deterministik: masukan yang sama selalu menghasilkan rentang dan skor
          yang sama. Tidak ada model AI yang menyimpulkan hasil pada versi
          ini.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Alur pemeriksaan
        </h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            Teks lowongan dinormalisasi (huruf kecil, spasi, dan angka
            dibersihkan) tanpa mengubah makna.
          </li>
          <li>
            Setiap aturan memeriksa teks: aturan bertipe{" "}
            <em>pola</em> mencari kata kunci, aturan bertipe{" "}
            <em>ambang</em> membandingkan angka seperti upah terhadap batas
            resmi.
          </li>
          <li>
            Aturan yang cocok menjadi temuan dengan bukti berupa kutipan pendek
            dari teks.
          </li>
          <li>
            Skor dihitung dari jumlah kontribusi seluruh temuan, dibulatkan,
            dan dibatasi maksimal 100.
          </li>
          <li>
            Rentang ditentukan dari skor dan dapat ditegakkan oleh aturan
            tertentu yang mewajibkan rentang minimum.
          </li>
        </ol>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Rumus skor
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Kontribusi tiap temuan = bobot aturan (1&ndash;10) × faktor kekuatan.
          Faktor kekuatan: Lemah {KEKUATAN_NILAI.lemah}, Sedang{" "}
          {KEKUATAN_NILAI.sedang}, Kuat {KEKUATAN_NILAI.kuat}.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Rentang risiko
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">
              {LABEL_BAND.rendah}
            </p>
            <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
              Skor di bawah {BATAS_BAND.perluDicek}
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="font-semibold text-amber-900 dark:text-amber-200">
              {LABEL_BAND.perlu_dicek}
            </p>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
              Skor {BATAS_BAND.perluDicek}&ndash;
              {BATAS_BAND.tinggi - 1}
            </p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="font-semibold text-red-900 dark:text-red-200">
              {LABEL_BAND.tinggi}
            </p>
            <p className="mt-2 text-sm text-red-800 dark:text-red-300">
              Skor {BATAS_BAND.tinggi} ke atas
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Beberapa aturan memiliki ketentuan{" "}
          <em>hasilJikaCocok</em>: bila cocok, rentang minimum langsung
          ditegakkan meskipun skor total masih rendah.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Daftar aturan
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Terdapat {RULES.length} aturan aktif. Rujukan hukum berupa id
          regulasi resmi (UU, Permenaker, KEP, atau SE).
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-700">
                <th className="py-2 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Aturan
                </th>
                <th className="py-2 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Kategori
                </th>
                <th className="py-2 pr-4 font-semibold text-zinc-900 dark:text-zinc-50">
                  Kekuatan
                </th>
                <th className="py-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  Rujukan
                </th>
              </tr>
            </thead>
            <tbody>
              {RULES.map((aturan) => (
                <tr
                  key={aturan.id}
                  className="border-b border-zinc-200 dark:border-zinc-800"
                >
                  <td className="py-2 pr-4 align-top text-zinc-700 dark:text-zinc-300">
                    {aturan.judul}
                  </td>
                  <td className="py-2 pr-4 align-top text-zinc-600 dark:text-zinc-400">
                    {LABEL_KATEGORI[aturan.kategori]}
                  </td>
                  <td className="py-2 pr-4 align-top text-zinc-600 dark:text-zinc-400">
                    {LABEL_KEKUATAN[aturan.kekuatan]}
                  </td>
                  <td className="py-2 align-top font-mono text-xs text-zinc-500 dark:text-zinc-500">
                    {aturan.rujukanHukumIds.length > 0
                      ? aturan.rujukanHukumIds.join(", ")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Perbandingan upah minimum sudah terpasang dalam aturan; pembandingnya
          baru aktif setelah data upah resmi dimuat ke basis pengetahuan.
        </p>
      </section>

      <div>
        <Link
          href="/cek"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Periksa Lowongan
        </Link>
      </div>
    </div>
  );
}
