import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ALT_GAMBAR_OG,
  ambilUrlSitus,
  DESKRIPSI_SITUS,
  HALAMAN_PUBLIK,
  metadataHalaman,
  NAMA_SITUS,
} from "@/lib/situs";

describe("metadataHalaman", () => {
  const metadata = metadataHalaman({
    judul: "Metodologi",
    deskripsi: "Cara skor dihitung.",
    jalur: "/metodologi",
  });

  it("memakai judul halaman apa adanya agar template root menambahkannya", () => {
    expect(metadata.title).toBe("Metodologi");
  });

  it("menetapkan canonical sesuai jalur", () => {
    expect(metadata.alternates?.canonical).toBe("/metodologi");
  });

  it("menyusun kartu Open Graph dengan gambar bawaan", () => {
    const gambar = JSON.stringify(metadata.openGraph?.images);
    expect(metadata.openGraph?.title).toBe("Metodologi");
    expect(metadata.openGraph?.description).toBe("Cara skor dihitung.");
    expect(metadata.openGraph?.siteName).toBe(NAMA_SITUS);
    expect(gambar).toContain("/opengraph-image");
    expect(gambar).toContain(ALT_GAMBAR_OG);
  });

  it("menyusun kartu Twitter dengan gambar bawaan", () => {
    const twitter = JSON.stringify(metadata.twitter);
    expect(twitter).toContain("summary_large_image");
    expect(twitter).toContain("/twitter-image");
    expect(twitter).toContain("Metodologi");
  });
});

describe("ambilUrlSitus", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("memakai NEXT_PUBLIC_SITE_URL bila valid", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://cekloker.id");
    expect(ambilUrlSitus().toString()).toBe("https://cekloker.id/");
  });

  it("jatuh ke domain produksi bila variabel kosong", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(ambilUrlSitus().origin).toBe("https://ceklokerkita.vercel.app");
  });

  it("jatuh ke domain produksi bila variabel tidak valid", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "bukan-url");
    expect(ambilUrlSitus().origin).toBe("https://ceklokerkita.vercel.app");
  });
});

describe("HALAMAN_PUBLIK", () => {
  it("tidak memuat jalur duplikat", () => {
    const jalur = HALAMAN_PUBLIK.map((halaman) => halaman.jalur);
    expect(new Set(jalur).size).toBe(jalur.length);
  });

  it("mencakup beranda, cek, dan seluruh dokumen legal", () => {
    const jalur = HALAMAN_PUBLIK.map((halaman) => halaman.jalur);
    expect(jalur).toContain("/");
    expect(jalur).toContain("/cek");
    expect(jalur).toContain("/kebijakan-privasi");
    expect(jalur).toContain("/syarat-ketentuan");
    expect(jalur).toContain("/disclaimer");
  });

  it("memakai deskripsi situs yang konsisten", () => {
    expect(DESKRIPSI_SITUS).toContain(NAMA_SITUS);
  });
});
