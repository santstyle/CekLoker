import { describe, expect, it } from "vitest";

import {
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

    it("mengabaikan baris kosong dan hanya berisi spasi", () => {
      const hasil = gabungkanTeks("A\n\n   \nB", "\nC\n");
      expect(hasil).toBe("A\nB\nC");
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
  });
});
