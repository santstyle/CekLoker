import { describe, expect, it } from "vitest";

import {
  LABEL_RUJUKAN,
  URL_RUJUKAN,
  VERIFIKASI_RUJUKAN,
  labelVerifikasiRujukan,
  verifikasiRujukan,
} from "@/lib/evaluation/rujukan";

/**
 * Uji kejujuran verifikasi rujukan hukum.
 *
 * Yang diuji bukan "apakah undang-undangnya benar" (itu tugas verifikasi
 * manual terhadap teks resmi), melainkan: antarmuka tidak pernah mengklaim
 * "terverifikasi" tanpa bukti berupa tanggal, dan setiap rujukan yang
 * dipakai mesin selalu punya status verifikasi yang terdaftar.
 */

describe("kelengkapan VERIFIKASI_RUJUKAN", () => {
  it("mencakup setiap id di URL_RUJUKAN", () => {
    for (const id of Object.keys(URL_RUJUKAN)) {
      expect(
        VERIFIKASI_RUJUKAN[id],
        `id ${id} dipakai URL_RUJUKAN tapi belum terdaftar di VERIFIKASI_RUJUKAN`,
      ).toBeDefined();
    }
  });

  it("mencakup setiap id di LABEL_RUJUKAN", () => {
    for (const id of Object.keys(LABEL_RUJUKAN)) {
      expect(
        VERIFIKASI_RUJUKAN[id],
        `id ${id} dipakai LABEL_RUJUKAN tapi belum terdaftar di VERIFIKASI_RUJUKAN`,
      ).toBeDefined();
    }
  });

  it("tidak punya entri yatim tanpa tautan", () => {
    for (const id of Object.keys(VERIFIKASI_RUJUKAN)) {
      expect(
        URL_RUJUKAN[id],
        `id ${id} ada di VERIFIKASI_RUJUKAN tapi tidak punya URL_RUJUKAN`,
      ).toBeDefined();
    }
  });
});

describe("konsistensi entri verifikasi", () => {
  it("tanggal verifikasi (bila ada) memakai format ISO YYYY-MM-DD", () => {
    for (const [id, entri] of Object.entries(VERIFIKASI_RUJUKAN)) {
      if (entri.tanggalVerifikasi !== null) {
        expect(
          entri.tanggalVerifikasi,
          `tanggalVerifikasi ${id} bukan ISO`,
        ).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("setiap entri punya catatan pemeriksaan yang tidak kosong", () => {
    for (const [id, entri] of Object.entries(VERIFIKASI_RUJUKAN)) {
      expect(
        entri.catatan.trim().length,
        `catatan ${id} kosong`,
      ).toBeGreaterThan(0);
    }
  });

  it("entri yang mengklaim terverifikasi wajib punya tanggal", () => {
    for (const [id, entri] of Object.entries(VERIFIKASI_RUJUKAN)) {
      if (!entri.perluVerifikasi) {
        expect(
          entri.tanggalVerifikasi,
          `${id} ditandai terverifikasi tanpa tanggal`,
        ).not.toBeNull();
      }
    }
  });
});

describe("verifikasiRujukan", () => {
  it("mengembalikan entri terdaftar apa adanya", () => {
    for (const id of Object.keys(VERIFIKASI_RUJUKAN)) {
      expect(verifikasiRujukan(id)).toEqual(VERIFIKASI_RUJUKAN[id]);
    }
  });

  it("id tak dikenal diperlakukan sebagai BELUM terverifikasi, tidak pernah terverifikasi", () => {
    const status = verifikasiRujukan("uu-fiktif-1234");
    expect(status.perluVerifikasi).toBe(true);
    expect(status.tanggalVerifikasi).toBeNull();
    expect(status.catatan.length).toBeGreaterThan(0);
  });
});

describe("labelVerifikasiRujukan", () => {
  it("id tak dikenal ditampilkan sebagai 'Belum diverifikasi'", () => {
    expect(labelVerifikasiRujukan("uu-fiktif-1234")).toBe("Belum diverifikasi");
  });

  it("tidak pernah mengklaim 'Terakhir diverifikasi' tanpa tanggal terverifikasi", () => {
    for (const id of Object.keys(VERIFIKASI_RUJUKAN)) {
      const label = labelVerifikasiRujukan(id);
      const entri = VERIFIKASI_RUJUKAN[id];
      if (label.startsWith("Terakhir diverifikasi: ")) {
        expect(
          entri.perluVerifikasi,
          `${id} mengklaim terverifikasi padahal perluVerifikasi`,
        ).toBe(false);
        expect(entri.tanggalVerifikasi).toBe(
          label.slice("Terakhir diverifikasi: ".length),
        );
      } else {
        expect(label).toBe("Belum diverifikasi");
        expect(entri.perluVerifikasi || !entri.tanggalVerifikasi).toBe(true);
      }
    }
  });
});
