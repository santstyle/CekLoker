import { describe, expect, it } from "vitest";

import { KANAL_RESMI, LANGKAH_SELANJUTNYA } from "@/lib/langkah-selanjutnya";
import type { Band } from "@/lib/evaluation/types";
import {
  LABEL_STATUS_VERIFIKASI,
  statusVerifikasi,
  urlTerverifikasi,
} from "@/lib/verifikasi";

const BAND: readonly Band[] = ["rendah", "perlu_dicek", "tinggi"];

describe("LANGKAH_SELANJUTNYA", () => {
  it("mencakup ketiga band risiko", () => {
    for (const band of BAND) {
      expect(LANGKAH_SELANJUTNYA[band]).toBeDefined();
    }
  });

  it("setiap band punya tindakan dan template pesan yang tidak kosong", () => {
    for (const band of BAND) {
      expect(LANGKAH_SELANJUTNYA[band].tindakan.length).toBeGreaterThan(0);
      expect(LANGKAH_SELANJUTNYA[band].templatePesan.length).toBeGreaterThan(0);
    }
  });

  it("konten berbeda antar level risiko", () => {
    const template = BAND.map((b) => LANGKAH_SELANJUTNYA[b].templatePesan);
    const tindakan = BAND.map((b) => LANGKAH_SELANJUTNYA[b].tindakan.join("|"));

    expect(new Set(template).size).toBe(BAND.length);
    expect(new Set(tindakan).size).toBe(BAND.length);
  });

  it("band tinggi menekankan berhenti dan menyimpan bukti", () => {
    const teks = LANGKAH_SELANJUTNYA.tinggi.tindakan.join(" ").toLowerCase();
    expect(teks).toContain("berhenti");
    expect(teks).toContain("bukti");
  });

  it("tidak pernah menuduh perusahaan sebagai penipu", () => {
    for (const band of BAND) {
      const gabungan = [
        ...LANGKAH_SELANJUTNYA[band].tindakan,
        LANGKAH_SELANJUTNYA[band].templatePesan,
      ]
        .join(" ")
        .toLowerCase();

      expect(gabungan).not.toContain("penipu");
      expect(gabungan).not.toContain("penipuan");
      expect(gabungan).not.toContain("penipu.");
    }
  });
});

describe("KANAL_RESMI", () => {
  it("memiliki empat kanal resmi", () => {
    expect(KANAL_RESMI).toHaveLength(4);
  });

  it("seluruh kanal belum punya url maupun tanggal verifikasi", () => {
    for (const kanal of KANAL_RESMI) {
      expect(kanal.url).toBeNull();
      expect(kanal.tanggalVerifikasi).toBeNull();
    }
  });

  it("seluruh kanal berstatus perlu_verifikasi menurut aturan bersama", () => {
    for (const kanal of KANAL_RESMI) {
      expect(statusVerifikasi(kanal)).toBe("perlu_verifikasi");
      expect(urlTerverifikasi(kanal)).toBeNull();
      expect(LABEL_STATUS_VERIFIKASI[statusVerifikasi(kanal)]).toBe(
        "Perlu verifikasi",
      );
    }
  });

  it("id kanal unik", () => {
    const id = KANAL_RESMI.map((k) => k.id);
    expect(new Set(id).size).toBe(id.length);
  });

  it("setiap kanal punya nama dan keterangan", () => {
    for (const kanal of KANAL_RESMI) {
      expect(kanal.nama.length).toBeGreaterThan(0);
      expect(kanal.keterangan.length).toBeGreaterThan(0);
    }
  });
});
