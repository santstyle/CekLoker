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
        deskripsi="Tujuh soal pilihan dari bank soal seputar hak kerja dan pola rekrutmen berisiko, dipilih acak tiap sesi. Jawaban tidak dikirim ke server mana pun dan tidak disimpan."
      />

      <Container className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <KuisEdukasi />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
