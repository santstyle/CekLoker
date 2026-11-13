import { describe, expect, it } from "vitest";

import {
  cariOpsiLokasi,
  filterOpsiLokasi,
  lokasiDikenali,
  OPSI_LOKASI,
} from "@/lib/evaluation/lokasi";
import { matchProvinsi, PROVINSI } from "@/lib/evaluation/provinces";

describe("OPSI_LOKASI", () => {
  it("memuat setiap provinsi resmi sebagai opsi provinsi", () => {
    for (const provinsi of PROVINSI) {
      const opsi = OPSI_LOKASI.find(
        (kandidat) =>
          kandidat.nilai === provinsi && kandidat.jenis === "provinsi",
      );
      expect(opsi, `provinsi ${provinsi} tidak ditemukan`).toBeDefined();
      expect(opsi?.provinsi).toBe(provinsi);
    }
  });

  it("tidak memiliki nilai yang duplikat", () => {
    const nilai = OPSI_LOKASI.map((opsi) => opsi.nilai);
    expect(new Set(nilai).size).toBe(nilai.length);
  });

  it("setiap opsi dikenali matchProvinsi sesuai provinsi induknya", () => {
    for (const opsi of OPSI_LOKASI) {
      expect(matchProvinsi(opsi.nilai), `nilai ${opsi.nilai}`).toBe(
        opsi.provinsi,
      );
    }
  });

  it("menyimpan kunci pencarian yang sudah dinormalisasi", () => {
    for (const opsi of OPSI_LOKASI) {
      expect(opsi.kunci).toBe(opsi.kunci.toLowerCase().trim());
      expect(opsi.kunci.length).toBeGreaterThan(0);
    }
  });

  it("tidak menduplikasi kota yang namanya sama dengan provinsi", () => {
    const gorontalo = OPSI_LOKASI.filter((opsi) => opsi.label === "Gorontalo");
    expect(gorontalo).toHaveLength(1);
    expect(gorontalo[0].jenis).toBe("provinsi");
  });

  it("memuat kota administratif Jakarta dan Tangerang Selatan", () => {
    for (const label of [
      "Jakarta Pusat",
      "Jakarta Timur",
      "Tangerang Selatan",
    ]) {
      const opsi = OPSI_LOKASI.find((kandidat) => kandidat.label === label);
      expect(opsi, `${label} tidak ditemukan`).toBeDefined();
      expect(opsi?.jenis).toBe("kota");
    }
  });
});

describe("filterOpsiLokasi", () => {
  it("mengembalikan seluruh opsi saat kueri kosong", () => {
    expect(filterOpsiLokasi("")).toHaveLength(OPSI_LOKASI.length);
    expect(filterOpsiLokasi("   ")).toHaveLength(OPSI_LOKASI.length);
  });

  it("tidak membedakan huruf besar dan kecil", () => {
    const kecil = filterOpsiLokasi("bandung").map((opsi) => opsi.label);
    const besar = filterOpsiLokasi("BANDUNG").map((opsi) => opsi.label);
    expect(kecil).toContain("Bandung");
    expect(besar).toEqual(kecil);
  });

  it("menemukan kota berdasarkan namanya", () => {
    const label = filterOpsiLokasi("surabaya").map((opsi) => opsi.label);
    expect(label).toContain("Surabaya");
  });

  it("menemukan provinsi berdasarkan nama resminya", () => {
    const label = filterOpsiLokasi("Jawa Barat").map((opsi) => opsi.label);
    expect(label).toContain("Jawa Barat");
  });

  it("menemukan provinsi berdasarkan singkatannya", () => {
    expect(filterOpsiLokasi("jatim").map((opsi) => opsi.label)).toContain(
      "Jawa Timur",
    );
    expect(filterOpsiLokasi("jkt").map((opsi) => opsi.label)).toContain(
      "DKI Jakarta",
    );
    expect(filterOpsiLokasi("sulsel").map((opsi) => opsi.label)).toContain(
      "Sulawesi Selatan",
    );
  });

  it("mengembalikan daftar kosong untuk kueri tak dikenal", () => {
    expect(filterOpsiLokasi("antah berantah")).toEqual([]);
    expect(filterOpsiLokasi("zzzzz")).toEqual([]);
    expect(filterOpsiLokasi("12345")).toEqual([]);
  });

  it("mendahulukan opsi yang labelnya berawalan kueri", () => {
    const hasil = filterOpsiLokasi("jakarta");
    expect(hasil[0].label).toBe("Jakarta Barat");
    const indeksProvinsi = hasil.findIndex(
      (opsi) => opsi.label === "DKI Jakarta",
    );
    expect(indeksProvinsi).toBeGreaterThan(0);
  });

  it("deterministik pada pemanggilan berulang", () => {
    const pertama = filterOpsiLokasi("ban");
    for (let ulang = 0; ulang < 5; ulang += 1) {
      expect(filterOpsiLokasi("ban").map((opsi) => opsi.nilai)).toEqual(
        pertama.map((opsi) => opsi.nilai),
      );
    }
  });
});

describe("cariOpsiLokasi", () => {
  it("menemukan opsi dengan label persis", () => {
    expect(cariOpsiLokasi("Bandung")?.nilai).toBe("Bandung");
    expect(cariOpsiLokasi("bandung")?.label).toBe("Bandung");
    expect(cariOpsiLokasi("DKI Jakarta")?.jenis).toBe("provinsi");
  });

  it("mengembalikan undefined untuk masukan kosong atau tak dikenal", () => {
    expect(cariOpsiLokasi("")).toBeUndefined();
    expect(cariOpsiLokasi("   ")).toBeUndefined();
    expect(cariOpsiLokasi("Antah Berantah")).toBeUndefined();
  });
});

describe("lokasiDikenali", () => {
  it("menandai lokasi yang dikenali mesin evaluasi", () => {
    expect(lokasiDikenali("Bandung")).toBe(true);
    expect(lokasiDikenali("jakarta")).toBe(true);
    expect(lokasiDikenali("Jawa Timur")).toBe(true);
  });

  it("menandai teks acak sebagai tidak dikenali", () => {
    expect(lokasiDikenali("asdfgh")).toBe(false);
    expect(lokasiDikenali("")).toBe(false);
    expect(lokasiDikenali("kota antah berantah")).toBe(false);
  });
});
