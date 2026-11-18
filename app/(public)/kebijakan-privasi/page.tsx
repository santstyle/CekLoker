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

const DIPERBARUI = "18 November 2026";

export default function HalamanKebijakanPrivasi() {
  return (
    <HalamanLegal
      judul="Kebijakan Privasi"
      ringkasan="Kami merancang CekLoker agar dapat digunakan tanpa menyerahkan identitas maupun isi lowongan yang Anda periksa. Halaman ini menjelaskan data apa yang diproses, apa yang dicatat di sisi server, dan apa yang tidak."
      diperbarui={DIPERBARUI}
    >
      <BagianLegal judul="Prinsip Utama">
        <p>
          CekLoker menganalisis teks iklan lowongan kerja yang Anda tempel untuk
          menghasilkan rentang risiko. Teks lowongan tersebut hanya diproses
          saat itu juga di server kami dan{" "}
          <strong className="font-semibold text-slate-800">
            tidak pernah ditulis ke basis data maupun berkas log
          </strong>
          . Yang dicatat hanyalah metadata agregat yang anonim (lihat bagian di
          bawah). Log kesalahan sisi server hanya berisi nama dan kode
          kesalahan, bukan isi lowongan Anda.
        </p>
      </BagianLegal>

      <BagianLegal judul="Alur Data (Langkah demi Langkah)">
        <ol className="flex list-decimal flex-col gap-2 pl-5">
          <li>
            <strong className="font-semibold text-slate-800">
              Anda mengisi formulir di peramban.
            </strong>{" "}
            Teks lowongan, provinsi (opsional), dan nama perusahaan (opsional)
            diketik di halaman /cek. Poster yang Anda unggah tidak pernah
            diunggah ke server; pembacaan poster (OCR) berjalan di perangkat
            Anda.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">
              Pemeriksaan kontak dijalankan di peramban.
            </strong>{" "}
            Email, nomor telepon, situs, dan kesesuaian domain email dengan nama
            perusahaan hanya dianalisis di perangkat Anda — tanpa permintaan
            jaringan ke mana pun.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">
              Permintaan evaluasi dikirim ke server.
            </strong>{" "}
            Isinya hanya: teks lowongan, provinsi (bila diisi), dan penanda
            apakah nama perusahaan diisi — bukan nama perusahaannya sendiri.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">
              Server menghitung hasil saat itu juga.
            </strong>{" "}
            Mesin deterministik membaca teks dan menghasilkan rentang risiko
            beserta alasan. Tidak ada hasil antara yang disimpan; yang dicatat
            ke basis data hanyalah metadata agregat (lihat di bawah).
          </li>
          <li>
            <strong className="font-semibold text-slate-800">
              Hasil dikirim ke peramban Anda.
            </strong>{" "}
            Hasil disimpan di penyimpanan sesi peramban (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">
              sessionStorage
            </code>
            ) agar dapat Anda buka kembali selama tab terbuka. Data ini hilang
            saat tab ditutup, dan tidak dapat dibaca oleh situs lain.
          </li>
          <li>
            <strong className="font-semibold text-slate-800">
              Laporan PDF dibuat di peramban.
            </strong>{" "}
            Seluruh penyusunan berkas PDF berlangsung di perangkat Anda; teks
            dan hasil tidak dikirim ke pihak ketiga untuk membuatnya.
          </li>
        </ol>
      </BagianLegal>

      <BagianLegal judul="Data yang Tidak Kami Kumpulkan">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Teks lengkap atau sebagian iklan lowongan kerja.</li>
          <li>Nama, nomor telepon, surel, atau identitas pribadi Anda.</li>
          <li>
            Nama perusahaan yang Anda ketik (nilai namanya) — yang dikirim ke
            server hanyalah penanda bahwa kolom tersebut diisi atau tidak.
          </li>
          <li>Berkas poster lowongan yang Anda unggah untuk dibaca.</li>
          <li>
            Jenis jawaban bebas apa pun dalam masukan Anda; masukan dibatasi
            pada alasan pilihan dari daftar tetap.
          </li>
        </ul>
      </BagianLegal>

      <BagianLegal judul="Data Agregat yang Dicatat Server">
        <p>
          Untuk memantau kesehatan layanan dan kualitas aturan, kami mencatat
          metadata agregat yang bersifat anonim. Data tersebut meliputi:
        </p>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Pengenal acak sekali pakai untuk setiap evaluasi.</li>
          <li>Waktu pencatatan (dicanangkan oleh basis data).</li>
          <li>Wilayah yang dipilih, bila Anda mengisinya.</li>
          <li>Rentang risiko, skor, dan kode aturan yang terpicu.</li>
          <li>
            Penanda apakah bantuan AI dipakai (selalu tidak — lihat di bawah).
          </li>
          <li>Panjang teks masukan (dalam karakter, bukan isinya).</li>
          <li>
            Alasan masukan kategorikal atas hasil evaluasi (pilihan dari daftar
            tetap, mis. &quot;temuan keliru&quot;), bersama kode aturan yang
            dirujuk bila Anda memilih satu — tanpa catatan bebas.
          </li>
        </ul>
        <p>
          Data agregat ini tidak memuat isi lowongan dan tidak dipakai untuk
          mengidentifikasi siapa pun.
        </p>
        <p>
          Selain itu, pembatas laju (rate limit) menahan lonjakan permintaan
          dengan menyimpan alamat klien sebagai kunci sementara{" "}
          <em>di memori proses</em> — bukan di basis data, tidak ditulis ke log,
          dan otomatis kadaluarsa. Alamat tersebut tidak pernah dikaitkan dengan
          isi lowongan atau hasil evaluasi.
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
        <p>
          Halaman{" "}
          <Link
            href="/bantuan"
            className="font-semibold text-blue-600 underline-offset-4 hover:underline"
          >
            bantuan korban
          </Link>{" "}
          bekerja dengan prinsip yang sama: pilihan situasi pada checklist 24
          jam tersimpan di peramban Anda dan dapat dihapus lewat tombol
          &quot;Hapus semua data&quot;. Seluruh isi kronologi diproses dan
          disimpan hanya di perangkat Anda — tidak pernah dikirim ke server.
        </p>
      </BagianLegal>

      <BagianLegal judul="Ekstraksi AI (Belum Tersedia)">
        <p>
          Saat ini CekLoker{" "}
          <strong className="font-semibold text-slate-800">
            tidak menjalankan model AI mana pun
          </strong>
          . Seluruh evaluasi dilakukan oleh mesin aturan deterministik di
          server. Sebagian konfigurasi internal menyediakan kunci API model
          bahasa secara opsional, tetapi kunci tersebut tidak dipakai oleh kode
          mana pun saat ini — tidak ada teks Anda yang dikirim ke penyedia pihak
          ketiga.
        </p>
        <p>
          Apabila ekstraksi bantuan AI ditambahkan di kemudian hari, halaman ini
          akan diperbarui lebih dulu untuk menjelaskan apa yang dikirim, ke
          mana, dan bagaimana cara menolaknya.
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
