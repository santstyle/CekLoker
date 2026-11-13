import type { Metadata } from "next";
import Link from "next/link";

import { BagianLegal, HalamanLegal } from "@/components/situs/halaman-legal";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Disclaimer",
  deskripsi:
    "CekLoker adalah alat bantu skrining, bukan penentu kebenaran. Pahami batas, keterbatasan, dan cara memakai hasil evaluasi secara bertanggung jawab.",
  jalur: "/disclaimer",
});

const DIPERBARUI = "13 November 2026";

export default function HalamanDisclaimer() {
  return (
    <HalamanLegal
      judul="Disclaimer"
      ringkasan="Halaman ini menegaskan batas layanan CekLoker agar hasil evaluasi dipakai secara bijak dan tidak disalahartikan sebagai putusan final."
      diperbarui={DIPERBARUI}
    >
      <BagianLegal judul="Bukan Putusan Final">
        <p>
          CekLoker hanya menandai indikator risiko berdasarkan teks lowongan
          yang Anda masukkan. Hasilnya{" "}
          <strong className="font-semibold text-slate-800">
            bukan bukti, bukan tuduhan, dan bukan putusan
          </strong>{" "}
          bahwa sebuah lowongan benar atau salah. Sebuah iklan dengan rentang
          risiko tinggi belum tentu melanggar hukum, dan sebaliknya.
        </p>
      </BagianLegal>

      <BagianLegal judul="Bukan Nasihat Hukum">
        <p>
          Informasi rujukan hukum disajikan sebagai bahan pembelajaran umum.
          CekLoker tidak memberikan nasihat hukum dan tidak menggantikan
          konsultasi dengan advokat, serikat pekerja, atau instansi
          ketenagakerjaan resmi.
        </p>
      </BagianLegal>

      <BagianLegal judul="Keterbatasan Analisis">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            Analisis terbatas pada isi teks yang dimasukkan; informasi di luar
            teks tidak dapat dinilai.
          </li>
          <li>
            Teks yang ambigu, tidak lengkap, atau memakai bahasa campuran dapat
            menurunkan ketepatan hasil.
          </li>
          <li>
            Rentang risiko dihitung oleh aturan deterministik, bukan verifikasi
            lapangan terhadap perusahaan.
          </li>
        </ul>
      </BagianLegal>

      <BagianLegal judul="Verifikasi ke Sumber Resmi">
        <p>
          Selalu konfirmasi temuan ke sumber resmi, misalnya Dinas Tenaga Kerja
          setempat, Kementerian Ketenagakerjaan, atau kanal resmi perusahaan,
          sebelum mengambil keputusan atau melaporkan sesuatu.
        </p>
      </BagianLegal>

      <BagianLegal judul="Tanggung Jawab Pengguna">
        <p>
          Segala keputusan yang Anda ambil berdasarkan hasil evaluasi adalah
          tanggung jawab Anda sepenuhnya. CekLoker tidak bertanggung jawab atas
          kerugian yang timbul dari penggunaan atau penafsiran hasil.
        </p>
      </BagianLegal>

      <BagianLegal judul="Kontak">
        <p>
          Bila Anda menemukan kekeliruan rujukan atau perilaku layanan yang
          mencurigakan, laporkan melalui{" "}
          <Link
            href="https://github.com/santstyle/CekLoker/issues"
            className="font-semibold text-blue-600 underline-offset-4 hover:underline"
          >
            isu pada repositori CekLoker
          </Link>
          .
        </p>
      </BagianLegal>
    </HalamanLegal>
  );
}
