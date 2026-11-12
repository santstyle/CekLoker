"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { kunciSimpananHasil } from "@/lib/api/evaluasi";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import type {
  Band,
  HasilEvaluasi,
  Kekuatan,
  KategoriRule,
} from "@/lib/evaluation/types";

const GAYA_BAND: Record<Band, string> = {
  rendah: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  perlu_dicek:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  tinggi: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
};

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

const LABEL_KEKUATAN: Record<Kekuatan, string> = {
  lemah: "Lemah",
  sedang: "Sedang",
  kuat: "Kuat",
};

/** Cache agar getSnapshot mengembalikan referensi yang stabil per id. */
const CACHE_HASIL = new Map<string, HasilEvaluasi | null>();

function bacaHasilSesi(id: string): HasilEvaluasi | null {
  const tercache = CACHE_HASIL.get(id);
  if (tercache !== undefined) {
    return tercache;
  }
  let hasil: HasilEvaluasi | null = null;
  try {
    const mentah = window.sessionStorage.getItem(kunciSimpananHasil(id));
    if (mentah) {
      const terurai = JSON.parse(mentah) as { hasil?: HasilEvaluasi };
      if (terurai.hasil && terurai.hasil.band) {
        hasil = terurai.hasil;
      }
    }
  } catch {
    hasil = null;
  }
  CACHE_HASIL.set(id, hasil);
  return hasil;
}

function langgananKosong(): () => void {
  return () => {};
}

export default function KontenHasil() {
  const { id } = useParams<{ id: string }>();
  const hasil = useSyncExternalStore<HasilEvaluasi | null | undefined>(
    langgananKosong,
    () => bacaHasilSesi(id),
    () => undefined,
  );

  if (hasil === undefined) {
    return <p className="text-zinc-600 dark:text-zinc-400">Memuat hasil...</p>;
  }

  if (hasil === null) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hasil tidak ditemukan
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Hasil disimpan sementara di peramban yang sama tempat pemeriksaan
          dilakukan. Jika Anda membuka tautan ini dari peramban lain atau
          setelah menutup sesi, hasilnya sudah tidak tersedia. Silakan periksa
          kembali lowongannya.
        </p>
        <div>
          <Link
            href="/cek"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Periksa Lowongan Lain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <span
          className={`inline-flex w-fit items-center rounded-full px-4 py-1.5 text-sm font-semibold ${GAYA_BAND[hasil.band]}`}
        >
          Rentang risiko: {LABEL_BAND[hasil.band]}
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hasil pemeriksaan
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Skor risiko {hasil.skor} dari 100 · Mesin pemeriksaan versi{" "}
          {hasil.versi}
        </p>
        <p className="max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
          {hasil.ringkasan}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Temuan
        </h2>
        {hasil.temuan.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            Tidak ditemukan indikator bermasalah pada teks lowongan. Rentang
            rendah bukan jaminan — tetap verifikasi perusahaan dan kondisi
            kerja ke sumber resmi.
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {hasil.temuan.map((temuan) => (
              <li
                key={temuan.ruleId}
                className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {temuan.judul}
                  </p>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Kontribusi skor: +{temuan.kontribusi}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                    {LABEL_KATEGORI[temuan.kategori]}
                  </span>
                  <span className="rounded-full border border-zinc-300 px-2.5 py-0.5 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                    Kekuatan: {LABEL_KEKUATAN[temuan.kekuatan]}
                  </span>
                </div>
                {temuan.bukti.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                      Bukti
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {temuan.bukti.map((bukti, indeksBukti) => (
                        <li
                          key={`${temuan.ruleId}-${indeksBukti}`}
                          className="rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                        >
                          &ldquo;{bukti}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {temuan.penjelasan}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Saran langkah berikutnya
        </h2>
        {hasil.saran.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tidak ada saran khusus. Ikuti daftar periksa pada halaman Edukasi
            sebelum melamar.
          </p>
        ) : (
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {hasil.saran.map((saran, indeksSaran) => (
              <li key={`${saran}-${indeksSaran}`}>{saran}</li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-50">
          Catatan penting
        </p>
        <p className="mt-1">
          Hasil ini berupa rentang risiko, bukan vonis atas keaslian lowongan.
          CekLoker juga tidak menyimpan teks lowongan Anda. Verifikasi selalu
          ke kanal resmi perusahaan, dan laporkan ke instansi ketenagakerjaan
          bila Anda menemukan pelanggaran.
        </p>
      </section>

      <div>
        <Link
          href="/cek"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Periksa Lowongan Lain
        </Link>
      </div>
    </div>
  );
}
