import type { Metadata } from "next";
import Link from "next/link";

import { Kepala } from "@/components/situs/kepala";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/situs/reveal";
import { metadataHalaman } from "@/lib/situs";
import { Checklist24Jam } from "./checklist-24jam";
import { PenunjukKanal } from "./penunjuk-kanal";
import { PenyusunKronologi } from "./penyusun-kronologi";

export const metadata: Metadata = metadataHalaman({
  judul: "Bantuan Korban Penipuan Lowongan",
  deskripsi:
    "Langkah praktis 24 jam pertama, daftar kanal lapor resmi, dan penyusun kronologi jika Anda merasa telah menjadi korban penipuan lowongan kerja. CekLoker bukan lembaga pelaporan dan tidak mengirim laporan atas nama Anda.",
  jalur: "/bantuan",
});

export default function HalamanBantuan() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Bantuan · Tanpa vonis"
        judul={
          <>
            Sudah terlanjur tertipu? Ini langkah yang bisa Anda
            <br />
            <span className="teks-gradasi-terang">ambil.</span>
          </>
        }
        deskripsi="Jika Anda merasa telah menjadi korban penipuan lowongan kerja, halaman ini memberikan checklist praktis, daftar kanal lapor resmi, dan alat menyusun kronologi. Semua diproses di peramban Anda — data tidak keluar dari perangkat."
      />

      <Container className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-16">
          {/* Pengantar */}
          <Reveal>
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs sm:p-9">
              <p className="text-sm leading-relaxed text-slate-700">
                CekLoker bukan lembaga pelaporan dan bukan nasihat hukum. Kami tidak
                mengirim laporan atas nama Anda. Informasi di bawah ini disusun dari
                sumber sekunder yang perlu diverifikasi; gunakan sebaik-baiknya dan
                segera hubungi bank/polisi bila ada uang tertipu.
              </p>
            </div>
          </Reveal>

          {/* 1. Checklist 24 Jam */}
          <Reveal delay={40}>
            <section aria-labelledby="checklist-heading" className="flex flex-col gap-6">
              <h2
                id="checklist-heading"
                className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
              >
                1. Checklist 24 Jam Pertama
              </h2>
              <p className="text-sm text-muted">
                Pilih situasi Anda, lalu ikuti langkah-langkah yang sesuai.
              </p>
              <Checklist24Jam />
            </section>
          </Reveal>

          {/* 2. Penunjuk Kanal */}
          <Reveal delay={80}>
            <section aria-labelledby="kanal-heading" className="flex flex-col gap-6">
              <h2
                id="kanal-heading"
                className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
              >
                2. Ke Mana Harus Melapor
              </h2>
              <p className="text-sm text-muted">
                Pilih jenis kasus untuk melihat kanal yang relevan beserta bukti
                yang perlu disiapkan.
              </p>
              <PenunjukKanal />
            </section>
          </Reveal>

          {/* 3. Penyusun Kronologi */}
          <Reveal delay={120}>
            <section aria-labelledby="kronologi-heading" className="flex flex-col gap-6">
              <h2
                id="kronologi-heading"
                className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl"
              >
                3. Susun Kronologi
              </h2>
              <p className="text-sm text-muted">
                Isi formulir untuk menghasilkan teks kronologi rapi yang siap
                disalin atau diunduh.
              </p>
              <PenyusunKronologi />
            </section>
          </Reveal>

          {/* Catatan jujur */}
          <Reveal delay={160}>
            <div className="rounded-3xl border border-amber-200/80 bg-amber-50/70 p-7 text-sm leading-relaxed text-slate-700 sm:p-9">
              <span className="font-bold text-amber-900">Catatan: </span>
              Beberapa kanal (mis. CekRekening.id) tidak mengembalikan uang atau
              membekukan rekening; urusan tersebut lewat bank/penyedia e-wallet
              Anda. CekLoker tidak menjamin hasil pelaporan.
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cek"
                className="rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Kembali ke Cek Lowongan
              </Link>
              <Link
                href="/edukasi"
                className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
              >
                Pelajari Ciri-ciri Modus Penipuan
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}