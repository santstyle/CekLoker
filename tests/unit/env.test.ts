import { describe, expect, it } from "vitest";

import { getEnv, parseEnv, requireEnv } from "@/lib/env";

describe("parseEnv", () => {
  it("memberi nilai default untuk input kosong", () => {
    const env = parseEnv({});
    expect(env.DATABASE_URL).toBeUndefined();
    expect(env.GEMINI_API_KEY).toBeUndefined();
    expect(env.AI_EXTRACTION_ENABLED).toBe(false);
  });

  it("memangkas spasi di sekitar nilai string", () => {
    const env = parseEnv({ DATABASE_URL: "  postgres://contoh  " });
    expect(env.DATABASE_URL).toBe("postgres://contoh");
  });

  it("mengubah teks berisi spasi menjadi undefined", () => {
    const env = parseEnv({ DATABASE_URL: "   " });
    expect(env.DATABASE_URL).toBeUndefined();
  });

  it.each(["true", "1", "TRUE"])("membaca boolean benar dari %s", (raw) => {
    const env = parseEnv({ AI_EXTRACTION_ENABLED: raw });
    expect(env.AI_EXTRACTION_ENABLED).toBe(true);
  });

  it.each(["false", "0", "FALSE"])("membaca boolean salah dari %s", (raw) => {
    const env = parseEnv({ AI_EXTRACTION_ENABLED: raw });
    expect(env.AI_EXTRACTION_ENABLED).toBe(false);
  });

  it("menolak nilai boolean yang tidak dikenal", () => {
    expect(() => parseEnv({ AI_EXTRACTION_ENABLED: "yes" })).toThrow(
      /AI_EXTRACTION_ENABLED/,
    );
  });

  it("menolak URL yang tidak valid", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "bukan-url" })).toThrow(
      /NEXT_PUBLIC_SITE_URL/,
    );
  });

  it("menormalkan URL yang valid", () => {
    const env = parseEnv({ NEXT_PUBLIC_SITE_URL: "https://cekloker.id" });
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://cekloker.id/");
  });
});

describe("getEnv", () => {
  it("menyimpan hasil parse di cache global", () => {
    const first = getEnv();
    const second = getEnv();
    expect(second).toBe(first);
  });
});

describe("requireEnv", () => {
  it("melempar galat bila variabel wajib kosong", () => {
    expect(() => requireEnv("DATABASE_URL", parseEnv({}))).toThrow(
      /DATABASE_URL wajib diisi/,
    );
  });

  it("mengembalikan nilai bila variabel wajib terisi", () => {
    const env = parseEnv({ DATABASE_URL: "postgres://contoh" });
    expect(requireEnv("DATABASE_URL", env)).toBe("postgres://contoh");
  });
});
