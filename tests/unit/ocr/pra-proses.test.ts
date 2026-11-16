import { describe, expect, it } from "vitest";

import {
  ambangOtsu,
  binarisasi,
  histogramLuminansi,
  luminansi,
  prosesPiksel,
} from "@/lib/ocr/pra-proses";

describe("lib/ocr/pra-proses", () => {
  describe("luminansi", () => {
    it("menghitung luminansi BT.601 untuk piksel primer", () => {
      const rgba = new Uint8ClampedArray([
        255,
        0,
        0,
        255, // merah murni
        0,
        255,
        0,
        255, // hijau murni
        0,
        0,
        255,
        255, // biru murni
      ]);
      const abu = luminansi(rgba, 3);
      expect(abu[0]).toBe(Math.round(0.299 * 255));
      expect(abu[1]).toBe(Math.round(0.587 * 255));
      expect(abu[2]).toBe(Math.round(0.114 * 255));
    });

    it("mengabaikan saluran alfa", () => {
      const rgba = new Uint8ClampedArray([10, 20, 30, 0]);
      const abu = luminansi(rgba, 1);
      expect(abu[0]).toBe(Math.round(0.299 * 10 + 0.587 * 20 + 0.114 * 30));
    });
  });

  describe("ambangOtsu", () => {
    it("berada di antara dua moda pada gambar hitam-putih", () => {
      const histogram = new Array<number>(256).fill(0);
      histogram[20] = 500; // teks gelap
      histogram[235] = 500; // latar terang
      const ambang = ambangOtsu(histogram, 1000);
      // Ambang jatuh di antara dua moda (batas atas plateau termasuk).
      expect(ambang).toBeGreaterThanOrEqual(20);
      expect(ambang).toBeLessThan(235);
    });

    it("tidak meledak untuk gambar seragam", () => {
      const histogram = new Array<number>(256).fill(0);
      histogram[128] = 1000;
      const ambang = ambangOtsu(histogram, 1000);
      expect(ambang).toBeGreaterThanOrEqual(0);
      expect(ambang).toBeLessThanOrEqual(255);
    });

    it("mengembalikan 128 untuk larik kosong", () => {
      expect(ambangOtsu(new Array<number>(256).fill(0), 0)).toBe(128);
    });
  });

  describe("histogramLuminansi", () => {
    it("menghitung frekuensi tiap tingkat keabuan", () => {
      const abu = new Uint8ClampedArray([0, 0, 255, 128]);
      const histogram = histogramLuminansi(abu);
      expect(histogram[0]).toBe(2);
      expect(histogram[128]).toBe(1);
      expect(histogram[255]).toBe(1);
      expect(histogram.reduce((a, b) => a + b, 0)).toBe(4);
    });
  });

  describe("binarisasi", () => {
    it("membekukan piksel di atas ambang dan menghitamkan sisanya", () => {
      const rgba = new Uint8ClampedArray([200, 200, 200, 255, 10, 10, 10, 255]);
      const abu = new Uint8ClampedArray([200, 10]);
      binarisasi(rgba, abu, 100);
      expect(rgba[0]).toBe(255);
      expect(rgba[1]).toBe(255);
      expect(rgba[4]).toBe(0);
      expect(rgba[7]).toBe(255); // alfa utuh
    });
  });

  describe("prosesPiksel", () => {
    it("menghasilkan teks hitam di latar putih untuk poster gelap-terang", () => {
      // 4x1: dua piksel latar putih, dua piksel teks hitam
      const data = new Uint8ClampedArray([
        255, 255, 255, 255, 255, 255, 255, 255, 0, 0, 0, 255, 0, 0, 0, 255,
      ]);
      const ambang = prosesPiksel({ data, width: 4, height: 1 });
      expect(ambang).toBeGreaterThanOrEqual(0);
      expect(ambang).toBeLessThanOrEqual(255);
      expect(data[0]).toBe(255);
      expect(data[8]).toBe(0);
    });

    it("menyesuaikan ambang untuk latar berwarna (bukan ambang tetap)", () => {
      // Latar biru tua (#0b3d91) dengan teks putih: ambang tetap 130 akan
      // melenyapkan teks; Otsu harus menemukan ambang di antaranya.
      const biruTua = [11, 61, 145];
      const data = new Uint8ClampedArray(8 * 4);
      for (let i = 0; i < 4; i++) {
        data.set([...biruTua, 255], i * 4);
        data.set([255, 255, 255, 255], (i + 4) * 4);
      }
      const ambang = prosesPiksel({ data, width: 8, height: 1 });
      expect(ambang).toBeGreaterThan(0);
      // Latar biru tua jadi hitam, teks putih tetap putih
      expect(data[0]).toBe(0);
      expect(data[16]).toBe(255);
    });
  });
});
