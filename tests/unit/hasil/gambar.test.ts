import { describe, expect, it } from "vitest";

import { namaFileHasil } from "@/lib/hasil/gambar";

describe("lib/hasil/gambar.ts", () => {
  describe("namaFileHasil", () => {
    it("menghasilkan nama dengan band, tanggal, dan potongan id", () => {
      const nama = namaFileHasil({ band: "perlu_dicek", id: "abc123xyz987" });
      expect(nama).toMatch(
        /^cekloker-hasil-perlu_dicek-\d{8}-\d{4}-abc123xy\.png$/,
      );
    });

    it("membuang karakter berbahaya dari id", () => {
      const nama = namaFileHasil({ band: "tinggi", id: "../et cetera" });
      expect(nama).not.toMatch(/[/\\ ]/);
    });

    it("memakai tanggal lokal, bukan UTC", () => {
      const nama = namaFileHasil({ band: "rendah", id: "x" });
      const sekarang = new Date();
      const pad = (nilai: number) => String(nilai).padStart(2, "0");
      const diharapkan = `cekloker-hasil-rendah-${sekarang.getFullYear()}${pad(
        sekarang.getMonth() + 1,
      )}${pad(sekarang.getDate())}-${pad(sekarang.getHours())}${pad(
        sekarang.getMinutes(),
      )}-x.png`;
      expect(nama).toBe(diharapkan);
    });
  });
});
