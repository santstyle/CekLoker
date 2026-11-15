import { describe, expect, it } from "vitest";

import {
  analisisKontak,
  adaKontak,
  domainDariEmail,
  domainGratis,
  domainMenyerupaiPerusahaan,
  ekstrakEmail,
  ekstrakSitus,
  ekstrakTelepon,
  tokenNamaPerusahaan,
} from "@/lib/evaluation/kontak-domain";

describe("ekstrakEmail", () => {
  it("mengambil seluruh email unik dalam huruf kecil", () => {
    expect(
      ekstrakEmail("Hubungi HRD@Contoh.Example atau hr@example.com"),
    ).toEqual(["hrd@contoh.example", "hr@example.com"]);
  });

  it("membuang titik di ujung alamat", () => {
    expect(ekstrakEmail("kirim ke a@b.example.")).toEqual(["a@b.example"]);
  });

  it("mengabaikan kemunculan ganda", () => {
    expect(ekstrakEmail("a@b.example dan A@B.example")).toEqual([
      "a@b.example",
    ]);
  });

  it("mengembalikan kosong bila tidak ada email", () => {
    expect(ekstrakEmail("tanpa kontak sama sekali")).toEqual([]);
  });
});

describe("ekstrakTelepon", () => {
  it("merapikan nomor yang terputus tanda hubung dan spasi", () => {
    expect(ekstrakTelepon("Hubungi 0812-0000-0000 atau 0813 000 0000")).toEqual(
      ["081200000000", "08130000000"],
    );
  });

  it("mengenali awalan +62", () => {
    expect(ekstrakTelepon("WhatsApp +62 812-0000-0000")).toEqual([
      "+6281200000000",
    ]);
  });

  it("mengabaikan nomor yang terlalu pendek", () => {
    expect(ekstrakTelepon("kode 0812-123")).toEqual([]);
  });
});

describe("ekstrakSitus", () => {
  it("mengambil URL lengkap dan bentuk www", () => {
    expect(
      ekstrakSitus(
        "Lamar via https://karir.contoh.example/page atau www.contoh.example",
      ),
    ).toEqual(["https://karir.contoh.example/page", "www.contoh.example"]);
  });

  it("membuang tanda baca di ujung URL", () => {
    expect(ekstrakSitus("kunjungi https://contoh.example.")).toEqual([
      "https://contoh.example",
    ]);
  });
});

describe("domainGratis", () => {
  it("mengenali domain layanan gratis", () => {
    for (const domain of [
      "gmail.com",
      "yahoo.com",
      "ymail.com",
      "hotmail.com",
      "outlook.com",
      "rocketmail.com",
      "mail.com",
    ]) {
      expect(domainGratis(domain)).toBe(true);
    }
  });

  it("bukan domain gratis bila berbeda", () => {
    expect(domainGratis("contohberkat.example")).toBe(false);
    expect(domainGratis("contoh.go.id")).toBe(false);
  });

  it("membandingkan tanpa awalan www dan huruf kecil", () => {
    expect(domainGratis("WWW.Gmail.COM")).toBe(true);
  });
});

describe("tokenNamaPerusahaan", () => {
  it("membuang kata bentuk badan usaha dan token pendek", () => {
    expect(tokenNamaPerusahaan("PT Contoh Berkat Abadi (Persero)")).toEqual([
      "contoh",
      "berkat",
      "abadi",
    ]);
  });

  it("kosong bila hanya berisi kata badan usaha", () => {
    expect(tokenNamaPerusahaan("PT CV UD TBK")).toEqual([]);
  });

  it("kosong bila nama perusahaan kosong", () => {
    expect(tokenNamaPerusahaan("   ")).toEqual([]);
  });
});

describe("domainMenyerupaiPerusahaan", () => {
  it("cocok bila domain memuat token nama perusahaan", () => {
    expect(
      domainMenyerupaiPerusahaan(
        "contohberkat.example",
        "PT Contoh Berkat Abadi",
      ),
    ).toBe(true);
  });

  it("cocok pada subdomain", () => {
    expect(
      domainMenyerupaiPerusahaan("karir.contoh.example", "PT Contoh"),
    ).toBe(true);
  });

  it("tidak cocok bila tidak ada kaitan", () => {
    expect(
      domainMenyerupaiPerusahaan("gmail.com", "PT Contoh Berkat Abadi"),
    ).toBe(false);
  });

  it("mengembalikan null bila nama perusahaan kosong", () => {
    expect(domainMenyerupaiPerusahaan("contoh.example", "")).toBeNull();
    expect(domainMenyerupaiPerusahaan("contoh.example", "PT")).toBeNull();
  });

  it("menyaratkan seluruh token pendek muncul agar tidak longgar", () => {
    expect(domainMenyerupaiPerusahaan("maju.co.id", "CV Maju")).toBe(true);
    expect(domainMenyerupaiPerusahaan("sejahtera.co.id", "CV Maju")).toBe(
      false,
    );
  });
});

describe("analisisKontak", () => {
  it("merangkum email, telepon, dan situs sekaligus", () => {
    const hasil = analisisKontak(
      "Lamar ke hrd@contohberkat.example atau 0812-0000-0000, www.contoh.example",
      "PT Contoh Berkat Abadi",
    );

    expect(hasil.email).toHaveLength(1);
    expect(hasil.email[0].domain).toBe("contohberkat.example");
    expect(hasil.email[0].domainGratis).toBe(false);
    expect(hasil.email[0].menyerupaiPerusahaan).toBe(true);
    expect(hasil.telepon).toEqual(["081200000000"]);
    expect(hasil.situs).toEqual(["www.contoh.example"]);
    expect(hasil.hanyaTelepon).toBe(false);
    expect(hasil.domainGratis).toBe(false);
  });

  it("menandai email layanan gratis", () => {
    const hasil = analisisKontak("Kirim lamaran ke contoh.rekrutmen@gmail.com");
    expect(hasil.email[0].domainGratis).toBe(true);
    expect(hasil.domainGratis).toBe(true);
  });

  it("menandai hanyaTelepon bila hanya ada nomor", () => {
    const hasil = analisisKontak("Hubungi 0812-0000-0000 segera.");
    expect(hasil.hanyaTelepon).toBe(true);
    expect(hasil.email).toEqual([]);
    expect(hasil.situs).toEqual([]);
  });

  it("bukan hanyaTelepon bila ada email", () => {
    const hasil = analisisKontak(
      "Hubungi 0812-0000-0000 atau email hr@contohfirma.example",
    );
    expect(hasil.hanyaTelepon).toBe(false);
  });

  it("menyerupaiPerusahaan null bila nama perusahaan tidak diisi", () => {
    const hasil = analisisKontak("hubungi hr@contohfirma.example");
    expect(hasil.email[0].menyerupaiPerusahaan).toBeNull();
  });
});

describe("adaKontak", () => {
  it("benar bila ada email, telepon, atau situs", () => {
    expect(adaKontak("email a@b.example")).toBe(true);
    expect(adaKontak("telepon 0812-0000-0000")).toBe(true);
    expect(adaKontak("buka www.contoh.example")).toBe(true);
  });

  it("salah bila teks tanpa kontak", () => {
    expect(adaKontak("hanya deskripsi jabatan tanpa kontak")).toBe(false);
  });
});

describe("domainDariEmail", () => {
  it("mengambil domain setelah @ dalam huruf kecil", () => {
    expect(domainDariEmail("HRD@Contoh.Example")).toBe("contoh.example");
  });
});
