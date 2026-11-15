import { describe, expect, it } from "vitest";

import {
  LABEL_STATUS_VERIFIKASI,
  STATUS_VERIFIKASI,
  statusVerifikasi,
  urlTerverifikasi,
} from "@/lib/verifikasi";

describe("statusVerifikasi", () => {
  it("terverifikasi hanya bila URL dan tanggal verifikasi sama-sama terisi", () => {
    expect(
      statusVerifikasi({
        url: "https://contoh.go.id",
        tanggalVerifikasi: "2026-01-01",
      }),
    ).toBe("terverifikasi");
  });

  it("perlu verifikasi bila salah satu masih kosong", () => {
    expect(statusVerifikasi({ url: "https://contoh.go.id" })).toBe(
      "perlu_verifikasi",
    );
    expect(statusVerifikasi({ tanggalVerifikasi: "2026-01-01" })).toBe(
      "perlu_verifikasi",
    );
    expect(statusVerifikasi({})).toBe("perlu_verifikasi");
    expect(
      statusVerifikasi({ url: null, tanggalVerifikasi: "2026-01-01" }),
    ).toBe("perlu_verifikasi");
  });

  it("mengabaikan URL atau tanggal berupa spasi", () => {
    expect(
      statusVerifikasi({ url: "   ", tanggalVerifikasi: "2026-01-01" }),
    ).toBe("perlu_verifikasi");
    expect(
      statusVerifikasi({ url: "https://contoh.go.id", tanggalVerifikasi: " " }),
    ).toBe("perlu_verifikasi");
  });

  it("tidak tergoda URL berupa string kosong", () => {
    expect(statusVerifikasi({ url: "", tanggalVerifikasi: "2026-01-01" })).toBe(
      "perlu_verifikasi",
    );
  });
});

describe("urlTerverifikasi", () => {
  it("mengembalikan URL bila sumber lengkap", () => {
    expect(
      urlTerverifikasi({
        url: "https://contoh.go.id",
        tanggalVerifikasi: "2026-01-01",
      }),
    ).toBe("https://contoh.go.id");
  });

  it("mengembalikan null bila sumber belum lengkap", () => {
    expect(urlTerverifikasi({ url: "https://contoh.go.id" })).toBeNull();
    expect(urlTerverifikasi({})).toBeNull();
  });
});

describe("konstanta status", () => {
  it("STATUS_VERIFIKASI berisi dua status", () => {
    expect(STATUS_VERIFIKASI).toEqual(["terverifikasi", "perlu_verifikasi"]);
  });

  it("LABEL_STATUS_VERIFIKASI memetakan kedua status", () => {
    expect(LABEL_STATUS_VERIFIKASI.terverifikasi).toBe("Terverifikasi");
    expect(LABEL_STATUS_VERIFIKASI.perlu_verifikasi).toBe("Perlu verifikasi");
  });
});
