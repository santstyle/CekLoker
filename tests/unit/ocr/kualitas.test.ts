import { describe, expect, it } from "vitest";

import {
  barisBermakna,
  gabungkanTeks,
  normalisasiBaris,
  PANJANG_MINIMUM,
  teksBermakna,
} from "@/lib/ocr/kualitas";

describe("lib/ocr/kualitas", () => {
  describe("teksBermakna", () => {
    it("menolak teks di bawah panjang minimum", () => {
      expect(teksBermakna("abc")).toBe(false);
      expect(teksBermakna("a".repeat(PANJANG_MINIMUM))).toBe(true);
      expect(teksBermakna("   \n  ")).toBe(false);
    });
  });

  describe("normalisasiBaris", () => {
    it("meringkas spasi dan menurunkan huruf besar", () => {
      expect(normalisasiBaris("  STAFF   ADMINISTRASI ")).toBe(
        "staff administrasi",
      );
    });
  });

  describe("barisBermakna", () => {
    it("membuang baris kosong, simbol lepas, dan alnum di bawah 3", () => {
      for (const sampah of [
        "",
        " ",
        "I<",
        "K2",
        "9",
        "(Re",
        "av",
        "Ny",
        "As",
        "da",
        "GI",
        "~~",
        "J =",
        ". Oo",
        "Xd »",
        "ap J3",
        "5 PR",
        "13",
      ]) {
        expect(
          barisBermakna(sampah),
          `seharusnya buang: ${JSON.stringify(sampah)}`,
        ).toBe(false);
      }
    });

    it("membuang sup simbol walau panjang", () => {
      expect(barisBermakna("g D t Ki)")).toBe(false);
      expect(barisBermakna("~~ ~ « » » « ~~")).toBe(false);
      expect(barisBermakna("00 LX) ( J] ")).toBe(false);
    });

    it("mempertahankan konten poster padat khas BUMN", () => {
      for (const bermakna of [
        "REKRUTMEN EKSTERNAL",
        "TINGKAT SLTA, D3 DAN D4/S1",
        "TAHUN 2026",
        "PT KERETA API INDONESIA",
        "(PERSERO) GROUP",
        "Mulai Registrasi:",
        "4 September 2026",
        "7-10 September 2026",
        "Website resmi rekrutmen",
        "KAI Group:",
        "karier.kai.id",
        "tidak dipungut biaya",
        "Waspada Penipuan!",
        "Services Bandara Commuter Logistik Properti",
        "000009 keretaapikita kai.id",
        "~ or « REKRUTMEN EKSTERNAL",
        "— I - 7) 4 September 2026",
        "( | pel Apply Lamaran:",
      ]) {
        expect(
          barisBermakna(bermakna),
          `seharusnya simpan: ${JSON.stringify(bermakna)}`,
        ).toBe(true);
      }
    });
  });

  describe("gabungkanTeks", () => {
    it("mempertahankan urutan dokumen teks utama lebih dulu", () => {
      const hasil = gabungkanTeks("Baris satu\nBaris dua", "Baris tiga");
      expect(hasil).toBe("Baris satu\nBaris dua\nBaris tiga");
    });

    it("membuang duplikat ternormalisasi (case & spasi)", () => {
      const hasil = gabungkanTeks(
        "DIBUTUHKAN\nPT Contoh Makmur",
        "dibutuhkan\nPT  Contoh   Makmur\nUpah Rp 2.000.000",
      );
      expect(hasil).toBe("DIBUTUHKAN\nPT Contoh Makmur\nUpah Rp 2.000.000");
    });

    it("membuang baris kosong dan hanya berisi spasi", () => {
      const hasil = gabungkanTeks(
        "PT Contoh\n\n   \nMakmur",
        "\nUpah Rp 2.000.000\n",
      );
      expect(hasil).toBe("PT Contoh\nMakmur\nUpah Rp 2.000.000");
    });

    it("mengembalikan string kosong bila keduanya kosong", () => {
      expect(gabungkanTeks("", "")).toBe("");
      expect(gabungkanTeks("\n\n", "   ")).toBe("");
    });

    it("mencakup kasus: AUTO melewatkan headline, SPARSE_TEXT menangkap", () => {
      // Skenario nyata poster: pass AUTO tidak memuat "DIBUTUHKAN";
      // pass kedua menemukannya dan ditambahkan tanpa dobel.
      const passAuto = "PT Contoh Makmur\nUpah Rp 4.500.000";
      const passSparse = "DIBUTUHKAN\nPT CONTOH MAKMUR\nUpah Rp 4.500.000";
      const hasil = gabungkanTeks(passAuto, passSparse);
      expect(hasil).toContain("DIBUTUHKAN");
      expect(hasil).toContain("Upah Rp 4.500.000");
      // "PT CONTOH MAKMUR" ternormalisasi sama dengan "PT Contoh Makmur"
      expect(
        hasil.split("\n").filter((b) => /contoh makmur/i.test(b)),
      ).toHaveLength(1);
    });

    it("membuang sampah pass SPARSE_TEXT dari poster padat asli", () => {
      // Baris hasil OCR nyata poster rekrutmen BUMN (dua pass digabung):
      // sampah dari tekstur/logo/QR ikut terbaca. Saringan harus membuang
      // semuanya tanpa menyentuh baris konten.
      const passAuto = [
        "REKRUTMEN EKSTERNAL",
        "TINGKAT SLTA, D3 DAN D4/S1",
        "TAHUN 2026",
        "PT KERETA API INDONESIA",
        "(PERSERO) GROUP",
        "Mulai Registrasi:",
        "4 September 2026",
        "Apply Lamaran:",
        "7-10 September 2026",
        "Website resmi rekrutmen",
        "KAI Group:",
        "karier.kai.id",
        "tidak dipungut biaya",
        "Waspada Penipuan!",
      ].join("\n");
      const passSparse = [
        "PA Danantara",
        "v",
        "K2",
        "9",
        "OPEN",
        "Ny",
        "REKRUTMEN EKSTERNAL",
        "I<",
        ", KAI",
        "4",
        "TAHUN 2026",
        "av",
        "As",
        "(Re",
        "13",
        "7-10 September 2026",
        "5 PR",
        "s Tau",
        "1",
        "apapun!",
        "da",
        "GI",
      ].join("\n");
      const hasil = gabungkanTeks(passAuto, passSparse);
      const baris = hasil.split("\n");
      // Tidak ada baris sampah pendek/simbol yang lolos.
      expect(baris).not.toContain("K2");
      expect(baris).not.toContain("(Re");
      expect(baris).not.toContain("5 PR");
      expect(baris).not.toContain("I<");
      expect(baris).not.toContain("GI");
      // Seluruh frasa kunci konten tetap utuh, tanpa dobel.
      for (const frasa of [
        "REKRUTMEN EKSTERNAL",
        "TINGKAT SLTA, D3 DAN D4/S1",
        "TAHUN 2026",
        "PT KERETA API INDONESIA",
        "(PERSERO) GROUP",
        "Mulai Registrasi:",
        "4 September 2026",
        "Apply Lamaran:",
        "7-10 September 2026",
        "Website resmi rekrutmen",
        "KAI Group:",
        "karier.kai.id",
        "tidak dipungut biaya",
        "Waspada Penipuan!",
      ]) {
        expect(hasil).toContain(frasa);
      }
      expect(
        baris.filter((b) => normalisasiBaris(b) === "tahun 2026"),
      ).toHaveLength(1);
    });
  });
});
