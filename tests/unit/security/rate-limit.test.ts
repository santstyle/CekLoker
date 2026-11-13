import { describe, expect, it } from "vitest";

import {
  ambilKunciKlien,
  buatPembatasJendelaTetap,
} from "@/lib/security/rate-limit";

/** Sumber waktu palsu yang bisa dimajukan manual. */
function jamPalsu(mulai = 0) {
  let waktu = mulai;
  return {
    sekarang: () => waktu,
    majukan: (ms: number) => {
      waktu += ms;
    },
  };
}

describe("buatPembatasJendelaTetap", () => {
  it("mengizinkan permintaan selama kuota belum habis", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 3,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
    const ketiga = pembatas.periksa("klien-a");
    expect(ketiga.diizinkan).toBe(true);
    expect(ketiga.sisa).toBe(0);
  });

  it("menolak permintaan setelah kuota terlampaui", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 2,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    pembatas.periksa("klien-a");
    pembatas.periksa("klien-a");
    const ditolak = pembatas.periksa("klien-a");

    expect(ditolak.diizinkan).toBe(false);
    expect(ditolak.sisa).toBe(0);
    expect(ditolak.batas).toBe(2);
  });

  it("melaporkan sisa kuota yang menurun", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 4,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    expect(pembatas.periksa("klien-a").sisa).toBe(3);
    expect(pembatas.periksa("klien-a").sisa).toBe(2);
    expect(pembatas.periksa("klien-a").sisa).toBe(1);
    expect(pembatas.periksa("klien-a").sisa).toBe(0);
  });

  it("memisahkan kuota antar klien", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 1,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
    expect(pembatas.periksa("klien-a").diizinkan).toBe(false);
    expect(pembatas.periksa("klien-b").diizinkan).toBe(true);
  });

  it("mengembalikan kuota setelah jendela berakhir", () => {
    const jam = jamPalsu();
    const pembatas = buatPembatasJendelaTetap({
      batas: 1,
      jendelaMs: 60_000,
      sekarang: jam.sekarang,
    });

    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
    expect(pembatas.periksa("klien-a").diizinkan).toBe(false);

    jam.majukan(60_000);

    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
  });

  it("menghitung resetDetik dari sisa jendela berjalan", () => {
    const jam = jamPalsu();
    const pembatas = buatPembatasJendelaTetap({
      batas: 5,
      jendelaMs: 30_000,
      sekarang: jam.sekarang,
    });

    expect(pembatas.periksa("klien-a").resetDetik).toBe(30);

    jam.majukan(10_000);
    expect(pembatas.periksa("klien-a").resetDetik).toBe(20);
  });

  it("tidak menurunkan resetDetik di bawah nol", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 5,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    expect(pembatas.periksa("klien-a").resetDetik).toBeGreaterThanOrEqual(0);
  });

  it("mengosongkan seluruh catatan", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 1,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    pembatas.periksa("klien-a");
    expect(pembatas.periksa("klien-a").diizinkan).toBe(false);

    pembatas.kosongkan();

    expect(pembatas.periksa("klien-a").diizinkan).toBe(true);
  });

  it("memulai jendela baru per klien tanpa saling memengaruhi", () => {
    const pembatas = buatPembatasJendelaTetap({
      batas: 1,
      jendelaMs: 60_000,
      sekarang: () => 0,
    });

    expect(pembatas.periksa("klien-a").resetDetik).toBe(60);
    expect(pembatas.periksa("klien-b").resetDetik).toBe(60);
  });
});

describe("ambilKunciKlien", () => {
  function permintaanDengan(headers: Record<string, string>): Request {
    return new Request("https://cekloker.example/api/evaluasi", {
      method: "POST",
      headers,
    });
  }

  it("memakai entri terakhir dari x-forwarded-for (ditulis proxy, bukan klien)", () => {
    const request = permintaanDengan({
      "x-forwarded-for": "203.0.113.7, 70.41.3.18, 150.172.238.178",
    });

    expect(ambilKunciKlien(request)).toBe("150.172.238.178");
  });

  it("memangkas spasi dan entri kosong pada x-forwarded-for", () => {
    const request = permintaanDengan({
      "x-forwarded-for": " ,  198.51.100.4  ",
    });
    expect(ambilKunciKlien(request)).toBe("198.51.100.4");
  });

  it("memakai x-real-ip bila x-forwarded-for tidak ada", () => {
    const request = permintaanDengan({ "x-real-ip": "192.0.2.10" });
    expect(ambilKunciKlien(request)).toBe("192.0.2.10");
  });

  it("mengabaikan x-forwarded-for kosong dan beralih ke x-real-ip", () => {
    const request = permintaanDengan({
      "x-forwarded-for": "   ",
      "x-real-ip": "192.0.2.11",
    });

    expect(ambilKunciKlien(request)).toBe("192.0.2.11");
  });

  it("memakai penanda umum bila tidak ada header alamat", () => {
    expect(ambilKunciKlien(permintaanDengan({}))).toBe("tanpa-identitas");
  });
});
