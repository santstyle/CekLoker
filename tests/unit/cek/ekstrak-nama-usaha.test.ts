import { describe, expect, it } from "vitest";

import { ekstrakNamaUsaha } from "@/lib/cek/ekstrak-nama-usaha";

describe("ekstrakNamaUsaha", () => {
  it("PT Maju Sentosa Abadi", () => {
    expect(
      ekstrakNamaUsaha(
        "PT Maju Sentosa Abadi membuka lowongan operator produksi",
      ),
    ).toBe("PT Maju Sentosa Abadi");
  });

  it("Stand Es Teh Segar", () => {
    expect(
      ekstrakNamaUsaha("Dicari penjaga Stand Es Teh Segar, upah Rp80.000/hari"),
    ).toBe("Stand Es Teh Segar");
  });

  it("warung makan -> null", () => {
    expect(
      ekstrakNamaUsaha(
        "Butuh kasir untuk warung makan, hubungi 0812-0000-0003",
      ),
    ).toBeNull();
  });

  it("kedai kami -> null", () => {
    expect(ekstrakNamaUsaha("Dicari barista kedai kami")).toBeNull();
  });

  it("PT/CV saja -> null", () => {
    expect(ekstrakNamaUsaha("Lowongan di PT/CV")).toBeNull();
  });

  it("all caps PT", () => {
    expect(
      ekstrakNamaUsaha(
        "PT MAJU SENTOSA ABADI MEMBUKA LOWONGAN OPERATOR PRODUKSI",
      ),
    ).toBe("PT Maju Sentosa Abadi");
  });

  it("all caps stand", () => {
    expect(
      ekstrakNamaUsaha("DICARI PENJAGA STAND ES TEH SEGAR, UPAH RP80.000/HARI"),
    ).toBe("Stand Es Teh Segar");
  });

  it("nama tidak menyeberang baris ke kolom lain", () => {
    expect(
      ekstrakNamaUsaha("PT CONTOH MAKMUR SENTOSA\nPenempatan: Jakarta Selatan"),
    ).toBe("PT Contoh Makmur Sentosa");
  });

  it("kata kunci sendiri di satu baris tetap mengambil nama di baris berikutnya", () => {
    expect(ekstrakNamaUsaha("PT\nMaju Sentosa Abadi\nGaji Rp5.000.000")).toBe(
      "PT Maju Sentosa Abadi",
    );
  });

  it("OCR cafe in -> null", () => {
    expect(
      ekstrakNamaUsaha(
        "HIRING BARISTA/MATCHARISTA NEW CAFE IN MEKARWANGI KUALIFIKASI 1. Min. lulusan SMA/SMK",
      ),
    ).toBeNull();
  });
});
