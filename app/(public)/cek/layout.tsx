import type { Metadata } from "next";

import { metadataHalaman } from "@/lib/situs";

export const metadata: Metadata = metadataHalaman({
  judul: "Cek Lowongan",
  deskripsi:
    "Tempel teks iklan lowongan kerja untuk menilai indikator risiko terhadap standar ketenagakerjaan Indonesia. Teks Anda tidak disimpan di server.",
  jalur: "/cek",
});

export default function LayoutCek({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
