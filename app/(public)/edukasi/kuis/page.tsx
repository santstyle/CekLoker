import type { Metadata } from "next";

import { KuisEdukasi } from "@/components/edukasi/kuis";
import { Container } from "@/components/ui/container";
import { Kepala } from "@/components/situs/kepala";
import { Reveal } from "@/components/situs/reveal";
import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Kuis Hak Kerja",
  deskripsi:
    "Kuis mandiri untuk menguji pemahaman Anda mengenai hak dasar pekerja dan pola lowongan kerja berisiko. Berjalan sepenuhnya di peramban tanpa menyimpan jawaban.",
  jalur: "/edukasi/kuis",
});

export default function HalamanKuisEdukasi() {
  return (
    <div className="bg-cream">
      <Kepala
        kicker="Kuis Mandiri"
        judul={
          <>
            Ukur pemahaman Anda,{" "}
            <span className="teks-gradasi-terang">tanpa vonis apa pun.</span>
          </>
        }
        deskripsi="Tujuh soal singkat seputar hak kerja dan pola rekrutmen berisiko. Jawaban tidak dikirim ke server mana pun dan tidak disimpan."
      />

      <Container className="pb-16 sm:pb-20">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <Reveal>
            <p className="text-sm leading-relaxed text-muted">
              Kuis ini hanya untuk refleksi diri. Nilai yang muncul bukan
              penilaian atas diri Anda, melainkan pengingat mana pola yang sudah
              dikenali dan mana yang perlu dipelajari ulang.
            </p>
          </Reveal>

          <Reveal>
            <KuisEdukasi />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
