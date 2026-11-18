import { describe, expect, it } from "vitest";

import {
  CONTOH_LOWONGAN_MENCURIGAKAN,
  CONTOH_LOWONGAN_WAJAR,
  LOKASI_CONTOH,
} from "@/lib/contoh-lowongan";
import { evaluasiLowongan } from "@/lib/evaluation/evaluate";

describe("contoh iklan di halaman /cek", () => {
  it("contoh risiko rendah menghasilkan band rendah tanpa temuan", () => {
    const hasil = evaluasiLowongan({
      teksLowongan: CONTOH_LOWONGAN_WAJAR,
      lokasi: LOKASI_CONTOH.wajar,
    });

    expect(hasil.temuan).toEqual([]);
    expect(hasil.band).toBe("rendah");
    expect(hasil.skor).toBe(0);
  });

  it("contoh risiko tinggi tidak menghasilkan band rendah", () => {
    const hasil = evaluasiLowongan({
      teksLowongan: CONTOH_LOWONGAN_MENCURIGAKAN,
      lokasi: LOKASI_CONTOH.mencurigakan,
    });

    expect(hasil.temuan.length).toBeGreaterThan(0);
    expect(hasil.band).not.toBe("rendah");
  });
});
