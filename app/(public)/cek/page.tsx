"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { kunciSimpananHasil, type ResponsEvaluasi } from "@/lib/api/evaluasi";

const MINIMAL_KARAKTER = 30;

export default function HalamanCek() {
  const router = useRouter();
  const [teks, setTeks] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [mengirim, setMengirim] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  const panjangTeks = teks.trim().length;
  const bolehKirim = panjangTeks >= MINIMAL_KARAKTER && !mengirim;

  async function kirim(peristiwa: React.FormEvent<HTMLFormElement>) {
    peristiwa.preventDefault();
    setMengirim(true);
    setPesan(null);

    try {
      const respons = await fetch("/api/evaluasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teksLowongan: teks,
          ...(lokasi.trim() ? { lokasi: lokasi.trim() } : {}),
        }),
      });
      const data: unknown = await respons.json();

      if (!respons.ok) {
        const pesanGagal =
          (data as { error?: string }).error ??
          "Terjadi kendala saat memeriksa lowongan. Coba lagi.";
        setPesan(pesanGagal);
        setMengirim(false);
        return;
      }

      const { id, hasil } = data as ResponsEvaluasi;
      window.sessionStorage.setItem(
        kunciSimpananHasil(id),
        JSON.stringify({ id, hasil }),
      );
      router.push(`/hasil/${id}`);
    } catch {
      setPesan(
        "Tidak dapat menghubungi layanan. Periksa koneksi internet lalu coba lagi.",
      );
      setMengirim(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Periksa lowongan
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Tempel teks iklan lowongan apa adanya. CekLoker tidak menyimpan teks
          Anda; hasil tersimpan sementara di peramban ini.
        </p>
      </section>

      <form onSubmit={kirim} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="teks-lowongan"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Teks lowongan
          </label>
          <textarea
            id="teks-lowongan"
            value={teks}
            onChange={(perubahan) => setTeks(perubahan.target.value)}
            rows={12}
            required
            placeholder="Tempel isi iklan lowongan di sini, termasuk posisi, gaji, jam kerja, dan cara kontak."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <p
            className={`text-xs ${
              panjangTeks >= MINIMAL_KARAKTER
                ? "text-zinc-500 dark:text-zinc-400"
                : "text-amber-700 dark:text-amber-400"
            }`}
          >
            {panjangTeks} karakter (minimal {MINIMAL_KARAKTER})
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="lokasi"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Lokasi (opsional)
          </label>
          <input
            id="lokasi"
            type="text"
            value={lokasi}
            onChange={(perubahan) => setLokasi(perubahan.target.value)}
            placeholder="Contoh: Jakarta"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Membantu mesin mengenali provinsi untuk perbandingan upah minimum.
          </p>
        </div>

        {pesan ? (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {pesan}
          </p>
        ) : null}

        <div>
          <button
            type="submit"
            disabled={!bolehKirim}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {mengirim ? "Memeriksa..." : "Periksa Lowongan"}
          </button>
        </div>
      </form>
    </div>
  );
}
