import { describe, expect, it } from "vitest";

import { ringkasGalat } from "@/lib/security/log";

describe("ringkasGalat", () => {
  it("menulis nama kelas dan kode galat, tanpa pesan", () => {
    const galat = Object.assign(
      new Error(
        "query gagal: INSERT INTO checks (region) VALUES ('DKI Jakarta')",
      ),
      {
        code: "23505",
      },
    );

    const hasil = ringkasGalat(galat);

    expect(hasil).toBe("Error kode=23505");
    expect(hasil).not.toContain("query");
    expect(hasil).not.toContain("INSERT");
    expect(hasil).not.toContain("DKI Jakarta");
  });

  it("mempertahankan nama kelas galat kustom yang aman", () => {
    class PostgresError extends Error {
      override readonly name = "PostgresError";
    }
    const galat = Object.assign(new PostgresError("nilai rahasia 12.345.678"), {
      code: "42P01",
    });

    expect(ringkasGalat(galat)).toBe("PostgresError kode=42P01");
  });

  it("mengabaikan kode yang mengandung karakter mencurigakan", () => {
    const galat = Object.assign(new Error("boom"), {
      code: "23505 'teks iklan pengguna'",
    });

    expect(ringkasGalat(galat)).toBe("Error");
  });

  it("mengabaikan nama kelas yang mengandung spasi atau karakter aneh", () => {
    const galat = new Error("boom");
    Object.defineProperty(galat, "name", {
      value: "Error teks iklan pengguna",
    });

    expect(ringkasGalat(galat)).toBe("Error");
  });

  it("menangani nilai non-Error", () => {
    expect(ringkasGalat("string biasa")).toBe("GalatTidakDikenal");
    expect(ringkasGalat(undefined)).toBe("GalatTidakDikenal");
    expect(ringkasGalat({ message: "teks iklan pengguna" })).toBe(
      "GalatTidakDikenal",
    );
  });

  it("mengabaikan kode yang terlalu panjang", () => {
    const galat = Object.assign(new Error("boom"), {
      code: "K".repeat(33),
    });

    expect(ringkasGalat(galat)).toBe("Error");
  });
});
