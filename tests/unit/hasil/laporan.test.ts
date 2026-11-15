import { describe, expect, it } from "vitest";

import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { BAND, type Band, type HasilEvaluasi } from "@/lib/evaluation/types";
import {
  bagiHalaman,
  bangunLaporan,
  bungkusTeks,
  levelDariBand,
  namaBerkasLaporan,
  nomorLaporan,
  statusDariRuleId,
  type OpsiTataLetak,
} from "@/lib/hasil/laporan";

const SEKARANG = new Date(2026, 10, 15, 14, 32, 0);

function hasilContoh(band: Band, skor: number): HasilEvaluasi {
  return {
    band,
    skor,
    temuan: [
      {
        ruleId: "pungutan_biaya",
        judul: "Pungutan biaya kepada pelamar",
        kategori: "upah",
        kekuatan: "kuat",
        faktor: 1.5,
        kontribusi: 15,
        bukti: ["biaya administrasi Rp150.000", "sebelum tes"],
        penjelasan: "Pelamar diminta membayar biaya.",
      },
      {
        ruleId: "upah_dibawah_umr",
        judul: "Upah di bawah ketentuan minimum",
        kategori: "upah",
        kekuatan: "kuat",
        faktor: 1.5,
        kontribusi: 15,
        bukti: ["Rp 1.000.000"],
        penjelasan: "Upah di bawah upah minimum provinsi.",
      },
      {
        ruleId: "email_gratis",
        judul: "Kontak memakai email gratis",
        kategori: "kontak",
        kekuatan: "lemah",
        faktor: 0.5,
        kontribusi: 3,
        bukti: ["mitra.niaga@gmail.com"],
        penjelasan: "Kontak memakai domain email gratis.",
      },
    ],
    saran: ["Verifikasi kanal resmi perusahaan."],
    ringkasan: "Ada indikator perlu dicek: Kompensasi & Upah.",
    versi: "uji-1.0.0",
  };
}

describe("lib/hasil/laporan.ts", () => {
  describe("levelDariBand", () => {
    it("selalu sama dengan label band yang tampil di layar", () => {
      for (const band of BAND) {
        expect(levelDariBand(band)).toBe(LABEL_BAND[band]);
      }
    });
  });

  describe("statusDariRuleId", () => {
    it("memetakan status dari aturan, bukan menebak", () => {
      expect(statusDariRuleId("pungutan_biaya")).toBe("Menyimpang");
      expect(statusDariRuleId("upah_dibawah_umr")).toBe("Perlu dicek");
      expect(statusDariRuleId("email_gratis")).toBe("Perlu dicek");
      expect(statusDariRuleId("aturan_tidak_dikenal")).toBe("Perlu dicek");
    });
  });

  describe("bangunLaporan", () => {
    it("menyalin level, skor, dan jumlah temuan apa adanya dari hasil", () => {
      for (const band of BAND) {
        const hasil = hasilContoh(band, 42);
        const laporan = bangunLaporan(hasil, {
          id: "sesi-1",
          sekarang: SEKARANG,
        });

        expect(laporan.level).toBe(LABEL_BAND[band]);
        expect(laporan.band).toBe(band);
        expect(laporan.skor).toBe(hasil.skor);
        expect(laporan.jumlah.total).toBe(hasil.temuan.length);
        expect(laporan.temuan).toHaveLength(hasil.temuan.length);
        expect(laporan.versiMesin).toBe(hasil.versi);
      }
    });

    it("menghitung hitungan status temuan dari hasil", () => {
      const laporan = bangunLaporan(hasilContoh("perlu_dicek", 33), {
        id: "sesi-2",
        sekarang: SEKARANG,
      });

      expect(laporan.jumlah).toEqual({
        total: 3,
        menyimpang: 1,
        perluDicek: 2,
        sesuai: 0,
      });
    });

    it("menghilangkan kutipan iklan dari seluruh bagian saat opsi mati", () => {
      const laporan = bangunLaporan(hasilContoh("tinggi", 60), {
        id: "sesi-3",
        sekarang: SEKARANG,
      });

      expect(laporan.sertakanKutipan).toBe(false);
      for (const temuan of laporan.temuan) {
        expect(temuan.kutipan).toBeUndefined();
      }
      const seluruh = JSON.stringify(laporan);
      expect(seluruh).not.toContain("biaya administrasi");
      expect(seluruh).not.toContain("Rp150.000");
    });

    it("menyertakan kutipan iklan hanya saat opsi menyala", () => {
      const laporan = bangunLaporan(hasilContoh("tinggi", 60), {
        id: "sesi-4",
        sertakanKutipan: true,
        sekarang: SEKARANG,
      });

      expect(laporan.sertakanKutipan).toBe(true);
      expect(laporan.temuan[0].kutipan).toContain(
        "biaya administrasi Rp150.000",
      );
      // Tanda kutip tipografis, bukan kutip lurus.
      expect(laporan.temuan[0].kutipan).toMatch(/^\u201c.*\u201d$/);
    });

    it("mengisi meta hanya bila nilainya ada dan tidak kosong", () => {
      const tanpa = bangunLaporan(hasilContoh("rendah", 0), {
        id: "sesi-5",
        meta: { posisi: "   ", lokasi: "" },
        sekarang: SEKARANG,
      });
      expect(tanpa.posisi).toBeUndefined();
      expect(tanpa.lokasi).toBeUndefined();

      const dengan = bangunLaporan(hasilContoh("rendah", 0), {
        id: "sesi-6",
        meta: {
          posisi: "Staff Admin",
          lokasi: "Jakarta Selatan",
          sumber: "Teks yang ditempel",
        },
        sekarang: SEKARANG,
      });
      expect(dengan.posisi).toBe("Staff Admin");
      expect(dengan.lokasi).toBe("Jakarta Selatan");
      expect(dengan.sumber).toBe("Teks yang ditempel");
      expect(dengan.upah).toBeUndefined();
      expect(dengan.contohPesan).toContain("Staff Admin");
    });

    it("memakai langkah dan ringkasan sesuai level", () => {
      const tinggi = bangunLaporan(hasilContoh("tinggi", 60), {
        id: "sesi-7",
        sekarang: SEKARANG,
      });
      const rendah = bangunLaporan(hasilContoh("rendah", 0), {
        id: "sesi-8",
        sekarang: SEKARANG,
      });

      expect(tinggi.langkah.length).toBeGreaterThan(rendah.langkah.length);
      expect(tinggi.ringkasanLevel).not.toBe(rendah.ringkasanLevel);
    });

    it("membuat nomor laporan format CL-YYYY-NNNN di perangkat", () => {
      const laporan = bangunLaporan(hasilContoh("rendah", 0), {
        id: "sesi-9",
        sekarang: SEKARANG,
        acak: () => 0.0042,
      });
      expect(laporan.nomor).toBe("CL-2026-0042");
    });
  });

  describe("namaBerkasLaporan", () => {
    it("mengikuti pola cekloker-laporan-YYYYMMDD-HHmm.pdf", () => {
      const nama = namaBerkasLaporan(SEKARANG);
      expect(nama).toBe("cekloker-laporan-20261115-1432.pdf");
      expect(nama).toMatch(/^cekloker-laporan-\d{8}-\d{4}\.pdf$/);
    });
  });

  describe("nomorLaporan", () => {
    it("selalu empat digit dengan awalan tahun", () => {
      expect(nomorLaporan(SEKARANG, () => 0)).toBe("CL-2026-0000");
      expect(nomorLaporan(SEKARANG, () => 0.9999)).toBe("CL-2026-9999");
    });
  });

  describe("bungkusTeks", () => {
    const tataLetak: OpsiTataLetak = {
      lebarKonten: 100,
      // Lebar tiap karakter tetap: 5 pt per karakter.
      ukurTeks: (teks) => teks.length * 5,
    };

    it("membungkus pada batas lebar tanpa memotong kata", () => {
      const baris = bungkusTeks("satu dua tiga empat lima", 10, 50, tataLetak);
      expect(baris).toEqual(["satu dua", "tiga empat", "lima"]);
    });

    it("memotong paksa kata yang lebih panjang dari satu baris", () => {
      const baris = bungkusTeks("abcdefghij", 10, 25, tataLetak);
      expect(baris.join("")).toBe("abcdefghij");
      expect(baris.every((isi) => isi.length <= 5)).toBe(true);
    });

    it("mengembalikan daftar kosong untuk teks kosong", () => {
      expect(bungkusTeks("   ", 10, 45, tataLetak)).toEqual([]);
    });
  });

  describe("bagiHalaman", () => {
    it("tidak pernah memotong satu elemen antar halaman", () => {
      const tinggi = [100, 120, 80, 140, 60, 200, 90];
      const kapasitas = 250;
      const halaman = bagiHalaman(tinggi, kapasitas);

      // Setiap elemen muncul tepat sekali, urutannya tetap.
      const datar = halaman.flat();
      expect(datar).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(new Set(datar).size).toBe(tinggi.length);

      // Total tinggi tiap halaman tidak melebihi kapasitas, kecuali halaman
      // yang memuat satu elemen tunggal yang memang lebih tinggi.
      for (const isi of halaman) {
        const total = isi.reduce(
          (jumlah, indeks) => jumlah + tinggi[indeks],
          0,
        );
        if (isi.length > 1) {
          expect(total).toBeLessThanOrEqual(kapasitas);
        }
      }
    });

    it("meletakkan elemen raksasa pada halamannya sendiri", () => {
      const tinggi = [50, 500, 50];
      const halaman = bagiHalaman(tinggi, 200);
      expect(halaman).toEqual([[0], [1], [2]]);
    });

    it("mengembalikan daftar kosong untuk masukan kosong", () => {
      expect(bagiHalaman([], 200)).toEqual([]);
    });
  });
});
