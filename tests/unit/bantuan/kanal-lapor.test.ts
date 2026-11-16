import { describe, expect, it } from "vitest";

import { CANAL_BY_ID, KANAL_LAPOR } from "@/lib/kanal-lapor";

describe("lib/kanal-lapor.ts", () => {
  it("setiap kanal memiliki field wajib", () => {
    for (const k of KANAL_LAPOR) {
      expect(k.id).toBeTruthy();
      expect(k.id.length).toBeGreaterThan(0);
      expect(k.url).toBeDefined();
      expect(k.cara).toBeDefined();
      expect(k.jenis_kasus).toBeDefined();
      expect(k.catatan).toBeDefined();
      expect(k.perlu_verifikasi).toBeDefined();
      expect(k.tanggal_verifikasi).toBeDefined();
      expect(k.sumber_info).toBeDefined();
    }
  });

  it("setiap id unik", () => {
    const ids = KANAL_LAPOR.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("CANAL_BY_ID berisi semua kanal", () => {
    expect(CANAL_BY_ID.size).toBe(KANAL_LAPOR.length);
    for (const k of KANAL_LAPOR) {
      expect(CANAL_BY_ID.get(k.id)).toBe(k);
    }
  });

  it("kanal dengan url 'TODO' tidak punya tautan resmi", () => {
    const todoKanal = KANAL_LAPOR.filter((k) => k.url === "TODO");
    expect(todoKanal.length).toBeGreaterThan(0);
    for (const k of todoKanal) {
      expect(k.url).toBe("TODO");
      // Kanal dengan url TODO wajib punya telepon atau whatsapp
      expect(k.telepon || k.whatsapp).toBeTruthy();
    }
  });

  it("pemetaan jenis_kasus ke kanal benar", () => {
    // CekRekening.id untuk rekening_penipu
    const cekrekening = KANAL_LAPOR.find((k) => k.id === "cekrekening");
    expect(cekrekening).toBeTruthy();
    expect(cekrekening!.jenis_kasus).toContain("rekening_penipu");

    // AduanNomor.id untuk nomor_penipu
    const aduannomor = KANAL_LAPOR.find((k) => k.id === "aduannomor");
    expect(aduannomor).toBeTruthy();
    expect(aduannomor!.jenis_kasus).toContain("nomor_penipu");

    // AduanKonten.id untuk lowongan_palsu
    const aduankonten = KANAL_LAPOR.find((k) => k.id === "aduankonten");
    expect(aduankonten).toBeTruthy();
    expect(aduankonten!.jenis_kasus).toContain("lowongan_palsu");

    // Polisi-siber untuk lowongan_palsu, biaya_dimuka, data_pribadi_bocor
    const polisi = KANAL_LAPOR.find((k) => k.id === "polisi-siber");
    expect(polisi).toBeTruthy();
    expect(polisi!.jenis_kasus).toContain("lowongan_palsu");
    expect(polisi!.jenis_kasus).toContain("biaya_dimuka");
    expect(polisi!.jenis_kasus).toContain("data_pribadi_bocor");

    // KP2MI untuk lowongan_luar_negeri
    const kp2mi = KANAL_LAPOR.find((k) => k.id === "kp2mi");
    expect(kp2mi).toBeTruthy();
    expect(kp2mi!.jenis_kasus).toContain("lowongan_luar_negeri");

    // Bank untuk rekening_penipu dan biaya_dimuka
    const bank = KANAL_LAPOR.find((k) => k.id === "bank");
    expect(bank).toBeTruthy();
    expect(bank!.jenis_kasus).toContain("rekening_penipu");
    expect(bank!.jenis_kasus).toContain("biaya_dimuka");
  });

  it("kanal dengan perlu_verifikasi false tidak perlu tanggal verifikasi", () => {
    const bank = KANAL_LAPOR.find((k) => k.id === "bank");
    expect(bank).toBeTruthy();
    expect(bank!.perlu_verifikasi).toBe(false);
  });

  it("semua kanal dengan perlu_verifikasi true memiliki sumber_info", () => {
    for (const k of KANAL_LAPOR) {
      if (k.perlu_verifikasi) {
        expect(k.sumber_info.length).toBeGreaterThan(0);
      }
    }
  });

  it("tidak ada kanal yang mengandung frasa 'laporkan ke' dalam field id", () => {
    for (const k of KANAL_LAPOR) {
      expect(k.id).not.toMatch(/laporkan\s+ke/i);
    }
  });
});