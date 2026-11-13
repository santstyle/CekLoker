import type { Metadata } from "next";
import Link from "next/link";

import { BagianLegal, HalamanLegal } from "@/components/situs/halaman-legal";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Kebijakan Privasi",
  deskripsi:
    "Bagaimana CekLoker menangani data: teks lowongan tidak pernah disimpan, hasil evaluasi hanya tersimpan di peramban Anda, dan metadata agregat bersifat anonim.",
  jalur: "/kebijakan-privasi",
});

const DIPERBARUI = "13 November 2026";

export default function HalamanKebijakanPrivasi() {
  return (
    <HalamanLegal
      judul="Kebijakan Privasi"
      ringkasan="Kami merancang CekLoker agar dapat digunakan tanpa menyerahkan identitas maupun isi lowongan yang Anda periksa. Halaman ini menjelaskan data apa yang diproses dan apa yang tidak kami simpan."
      diperbarui={DIPERBARUI}
    >
      <BagianLegal judul="Prinsip Utama">
        <p>
          CekLoker menganalisis teks iklan lowongan kerja yang Anda tempel untuk
          menghasilkan rentang risiko. Teks lowongan tersebut{" "}
          <strong className="font-semibold text-slate-800">
            tidak pernah disimpan
          </strong>{" "}
          di basis data kami. Evaluasi berlangsung saat itu juga, lalu teksnya
          dilepas dari memori server.
        </p>
      </BagianLegal>

      <BagianLegal judul="Data yang Tidak Kami Kumpulkan">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Teks lengkap atau sebagian iklan lowongan kerja.</li>
          <li>Nama, nomor telepon, surel, atau identitas pribadi Anda.</li>
          <li>Berkas poster lowongan yang Anda unggah untuk dibaca.</li>
        </ul>
      </BagianLegal>

      <BagianLegal judul="Data Agregat yang Dicatat">
        <p>
          Untuk memantau kesehatan layanan dan kualitas aturan, kami mencatat
          metadata agregat yang bersifat anonim dan tidak dapat ditelusuri ke
          pengguna tertentu. Metadata tersebut meliputi:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Pengenal acak sekali pakai untuk setiap evaluasi.</li>
          <li>Wilayah yang dipilih, bila Anda mengisinya.</li>
          <li>Rentang risiko, skor, dan kode aturan yang terpicu.</li>
          <li>
            Penanda apakah ekstraksi bantuan AI dipakai, serta panjang teks
            masukan.
          </li>
        </ul>
        <p>
          Data agregat ini tidak memuat isi lowongan dan tidak dipakai untuk
          mengidentifikasi siapa pun.
        </p>
      </BagianLegal>

      <BagianLegal judul="Penyimpanan di Peramban Anda">
        <p>
          Hasil evaluasi hanya disimpan sementara di penyimpanan sesi peramban (
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
            sessionStorage
          </code>
          ) agar dapat Anda buka kembali selama sesi berlangsung. Data ini
          berada di perangkat Anda, bukan di server kami, dan akan hilang saat
          tab ditutup.
        </p>
      </BagianLegal>

      <BagianLegal judul="Bantuan Ekstraksi AI (Opsional)">
        <p>
          Bila diaktifkan oleh pengelola layanan, teks lowongan dapat dikirim ke
          penyedia model bahasa untuk membantu membaca poster atau teks tak
          terstruktur. Proses ini hanya berjalan di sisi server, bersifat
          opsional, dan tetap tidak menyimpan teks lowongan di basis data kami.
        </p>
      </BagianLegal>

      <BagianLegal judul="Cookie dan Analitik">
        <p>
          CekLoker tidak memasang cookie pelacakan maupun alat analitik pihak
          ketiga untuk mengikuti perilaku Anda di luar layanan ini.
        </p>
      </BagianLegal>

      <BagianLegal judul="Perubahan Kebijakan">
        <p>
          Kebijakan ini dapat diperbarui seiring perkembangan layanan. Tanggal
          pembaruan tercantum di bagian atas halaman. Penggunaan layanan setelah
          pembaruan berarti Anda menyetujui versi terbaru.
        </p>
      </BagianLegal>

      <BagianLegal judul="Kontak">
        <p>
          Pertanyaan atau keberatan terkait privasi dapat disampaikan melalui{" "}
          <Link
            href="https://github.com/santstyle/CekLoker/issues"
            className="font-semibold text-blue-600 underline-offset-4 hover:underline"
          >
            isu pada repositori CekLoker
          </Link>
          . Kami membalas sebaik mungkin sesuai kapasitas tim.
        </p>
      </BagianLegal>
    </HalamanLegal>
  );
}
