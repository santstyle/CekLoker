import { describe, expect, it } from "vitest";

import { WILAYAH_KAB_KOTA } from "@/lib/evaluation/wilayah";
import { matchProvinsi, PROVINSI } from "@/lib/evaluation/provinces";

describe("WILAYAH_KAB_KOTA", () => {
  it("memuat tepat 514 kabupaten/kota", () => {
    expect(WILAYAH_KAB_KOTA).toHaveLength(514);
  });

  it("kode wilayah unik dan terdiri dari 4 digit", () => {
    const kode = WILAYAH_KAB_KOTA.map((w) => w.kode);
    expect(new Set(kode).size).toBe(kode.length);
    for (const satu of kode) {
      expect(satu).toMatch(/^\d{4}$/);
    }
  });

  it("kode wilayah terurut menaik", () => {
    const kode = WILAYAH_KAB_KOTA.map((w) => w.kode);
    const terurut = [...kode].sort();
    expect(kode).toEqual(terurut);
  });

  it("nama selalu diawali Kabupaten atau Kota", () => {
    for (const wilayah of WILAYAH_KAB_KOTA) {
      expect(
        wilayah.nama.startsWith("Kabupaten ") ||
          wilayah.nama.startsWith("Kota "),
        `nama tak lazim: ${wilayah.nama}`,
      ).toBe(true);
    }
  });

  it("nama unik", () => {
    const nama = WILAYAH_KAB_KOTA.map((w) => w.nama);
    expect(new Set(nama).size).toBe(nama.length);
  });

  it("setiap provinsi induk terdaftar di PROVINSI", () => {
    const sah = new Set<string>(PROVINSI);
    for (const wilayah of WILAYAH_KAB_KOTA) {
      expect(
        sah.has(wilayah.provinsi),
        `provinsi tak dikenal: ${wilayah.provinsi} (${wilayah.nama})`,
      ).toBe(true);
    }
  });

  it("enam kabupaten/kota Sorong cs berada di Papua Barat Daya", () => {
    const pbd = WILAYAH_KAB_KOTA.filter(
      (w) => w.provinsi === "Papua Barat Daya",
    ).map((w) => w.nama);
    expect(pbd.sort()).toEqual(
      [
        "Kabupaten Maybrat",
        "Kabupaten Raja Ampat",
        "Kabupaten Sorong",
        "Kabupaten Sorong Selatan",
        "Kabupaten Tambrauw",
        "Kota Sorong",
      ].sort(),
    );
  });

  it("kabupaten Fakfak memakai ejaan resmi (satu kata)", () => {
    const fakfak = WILAYAH_KAB_KOTA.find((w) => w.nama.includes("Fakfak"));
    expect(fakfak?.nama).toBe("Kabupaten Fakfak");
    expect(fakfak?.provinsi).toBe("Papua Barat");
  });

  it("Kabupaten Timor Tengah Selatan tercatat dengan prefiks benar", () => {
    const tts = WILAYAH_KAB_KOTA.find((w) =>
      w.nama.includes("Timor Tengah Selatan"),
    );
    expect(tts?.nama).toBe("Kabupaten Timor Tengah Selatan");
    expect(tts?.provinsi).toBe("Nusa Tenggara Timur");
  });
});

describe("alias kab/kota pada matchProvinsi", () => {
  it("mengenali nama telanjang yang unik", () => {
    expect(matchProvinsi("Tual")).toBe("Maluku");
    expect(matchProvinsi("sorong")).toBe("Papua Barat Daya");
    expect(matchProvinsi("Mimika")).toBe("Papua Tengah");
    expect(matchProvinsi("Merauke")).toBe("Papua Selatan");
  });

  it("nama telanjang yang ambigu tidak dipakai (banjar)", () => {
    expect(matchProvinsi("Banjar")).toBeNull();
    expect(matchProvinsi("Kota Banjar")).toBe("Jawa Barat");
    expect(matchProvinsi("Kabupaten Banjar")).toBe("Kalimantan Selatan");
  });

  it("nama berprefiks selalu dikenali", () => {
    expect(matchProvinsi("Kabupaten Sorong")).toBe("Papua Barat Daya");
    expect(matchProvinsi("Kota Sorong")).toBe("Papua Barat Daya");
    expect(matchProvinsi("Kabupaten Manokwari")).toBe("Papua Barat");
  });

  it("tetap membedakan Papua Barat dengan Papua Barat Daya", () => {
    expect(matchProvinsi("Papua Barat Daya")).toBe("Papua Barat Daya");
    expect(matchProvinsi("Papua Barat")).toBe("Papua Barat");
    expect(matchProvinsi("manokwari")).toBe("Papua Barat");
  });
});
