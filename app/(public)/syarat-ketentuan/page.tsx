import type { Metadata } from "next";
import Link from "next/link";

import { BagianLegal, HalamanLegal } from "@/components/situs/halaman-legal";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Syarat & Ketentuan",
  deskripsi:
    "Ketentuan penggunaan layanan CekLoker: batas tanggung jawab, penggunaan yang wajar, dan sifat hasil evaluasi sebagai alat bantu skrining awal.",
  jalur: "/syarat-ketentuan",
});

const DIPERBARUI = "13 November 2026";

export default function HalamanSyaratKetentuan() {
  return (
    <HalamanLegal
      judul="Syarat &amp; Ketentuan"
      ringkasan="Dengan mengakses dan menggunakan CekLoker, Anda menyetujui ketentuan berikut. Mohon dibaca sebelum mengandalkan hasil evaluasi untuk mengambil keputusan."
      diperbarui={DIPERBARUI}
    >
      <BagianLegal judul="Sifat Layanan">
        <p>
          CekLoker adalah alat bantu skrining awal yang menilai teks iklan
          lowongan kerja terhadap sejumlah indikator ketenagakerjaan dan pola
          rekrutmen berisiko. Hasilnya berupa rentang risiko, kutipan bukti, dan
          rujukan regulasi resmi.
        </p>
        <p>
          CekLoker{" "}
          <strong className="font-semibold text-slate-800">
            bukan layanan nasihat hukum
          </strong>{" "}
          dan bukan pengganti konsultasi dengan advokat, serikat pekerja, atau
          instansi resmi.
        </p>
      </BagianLegal>

      <BagianLegal judul="Tanpa Vonis">
        <p>
          CekLoker tidak menetapkan bahwa sebuah lowongan
          &ldquo;penipuan&rdquo;, &ldquo;palsu&rdquo;, maupun
          &ldquo;asli&rdquo;. Rentang risiko bersifat indikatif dan bergantung
          sepenuhnya pada teks yang Anda masukkan. Keputusan akhir tetap berada
          di tangan Anda.
        </p>
      </BagianLegal>

      <BagianLegal judul="Tanggung Jawab Pengguna">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>
            Anda bertanggung jawab atas teks yang dimasukkan dan berhak
            memasukkannya.
          </li>
          <li>
            Anda wajib memverifikasi temuan ke sumber resmi, seperti instansi
            ketenagakerjaan, sebelum bertindak.
          </li>
          <li>
            Anda tidak menggunakan layanan untuk menuduh, mencemarkan, atau
            merugikan pihak lain secara melawan hukum.
          </li>
        </ul>
      </BagianLegal>

      <BagianLegal judul="Penggunaan yang Wajar">
        <p>
          Dilarang menyalahgunakan layanan, termasuk upaya mengganggu
          ketersediaan, melakukan pemindaian otomatis secara berlebihan, atau
          memakai layanan untuk aktivitas yang melanggar hukum.
        </p>
      </BagianLegal>

      <BagianLegal judul="Batasan Tanggung Jawab">
        <p>
          Layanan disediakan &ldquo;sebagaimana adanya&rdquo; tanpa jaminan
          keakuratan, kelengkapan, atau kesesuaian untuk tujuan tertentu. Sejauh
          diizinkan hukum, CekLoker dan pengelolanya tidak bertanggung jawab
          atas kerugian yang timbul dari penggunaan atau ketidakmampuan
          menggunakan layanan.
        </p>
      </BagianLegal>

      <BagianLegal judul="Hak Kekayaan Intelektual">
        <p>
          Kode sumber CekLoker dirilis dengan lisensi MIT. Nama, logo, dan
          identitas merek CekLoker tetap milik pengelolanya. Rujukan hukum
          dikutip dari sumber resmi dan tetap menjadi milik penerbitnya.
        </p>
      </BagianLegal>

      <BagianLegal judul="Perubahan Ketentuan">
        <p>
          Ketentuan ini dapat diubah sewaktu-waktu. Versi terbaru selalu
          tercantum di halaman ini beserta tanggal pembaruannya.
        </p>
      </BagianLegal>

      <BagianLegal judul="Kontak">
        <p>
          Pertanyaan mengenai ketentuan ini dapat disampaikan melalui{" "}
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
