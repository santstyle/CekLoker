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
      ekstrakEmail("Hubungi HRD@Contoh.Co.Id atau hr@example.com"),
    ).toEqual(["hrd@contoh.co.id", "hr@example.com"]);
  });

  it("membuang titik di ujung alamat", () => {
    expect(ekstrakEmail("kirim ke a@b.co.id.")).toEqual(["a@b.co.id"]);
  });

  it("mengabaikan kemunculan ganda", () => {
    expect(ekstrakEmail("a@b.co.id dan A@B.co.id")).toEqual(["a@b.co.id"]);
  });

  it("mengembalikan kosong bila tidak ada email", () => {
    expect(ekstrakEmail("tanpa kontak sama sekali")).toEqual([]);
  });
});

describe("ekstrakTelepon", () => {
  it("merapikan nomor yang terputus tanda hubung dan spasi", () => {
    expect(ekstrakTelepon("Hubungi 0812-9876-5432 atau 0813 123 4567")).toEqual(
      ["081298765432", "08131234567"],
    );
  });

  it("mengenali awalan +62", () => {
    expect(ekstrakTelepon("WhatsApp +62 812-9876-5432")).toEqual([
      "+6281298765432",
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
        "Lamar via https://karir.contoh.co.id/page atau www.cekloker.id",
      ),
    ).toEqual(["https://karir.contoh.co.id/page", "www.cekloker.id"]);
  });

  it("membuang tanda baca di ujung URL", () => {
    expect(ekstrakSitus("kunjungi https://contoh.co.id.")).toEqual([
      "https://contoh.co.id",
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
    expect(domainGratis("nusantaraberkat.co.id")).toBe(false);
    expect(domainGratis("contoh.go.id")).toBe(false);
  });

  it("membandingkan tanpa awalan www dan huruf kecil", () => {
    expect(domainGratis("WWW.Gmail.COM")).toBe(true);
  });
});

describe("tokenNamaPerusahaan", () => {
  it("membuang kata bentuk badan usaha dan token pendek", () => {
    expect(tokenNamaPerusahaan("PT Nusantara Berkat Abadi (Persero)")).toEqual([
      "nusantara",
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
        "nusantaraberkat.co.id",
        "PT Nusantara Berkat Abadi",
      ),
    ).toBe(true);
  });

  it("cocok pada subdomain", () => {
    expect(
      domainMenyerupaiPerusahaan("karir.nusantara.co.id", "PT Nusantara"),
    ).toBe(true);
  });

  it("tidak cocok bila tidak ada kaitan", () => {
    expect(
      domainMenyerupaiPerusahaan("gmail.com", "PT Nusantara Berkat Abadi"),
    ).toBe(false);
  });

  it("mengembalikan null bila nama perusahaan kosong", () => {
    expect(domainMenyerupaiPerusahaan("nusantara.co.id", "")).toBeNull();
    expect(domainMenyerupaiPerusahaan("nusantara.co.id", "PT")).toBeNull();
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
      "Lamar ke hrd@nusantaraberkat.co.id atau 0812-9876-5432, www.nusantara.co.id",
      "PT Nusantara Berkat Abadi",
    );

    expect(hasil.email).toHaveLength(1);
    expect(hasil.email[0].domain).toBe("nusantaraberkat.co.id");
    expect(hasil.email[0].domainGratis).toBe(false);
    expect(hasil.email[0].menyerupaiPerusahaan).toBe(true);
    expect(hasil.telepon).toEqual(["081298765432"]);
    expect(hasil.situs).toEqual(["www.nusantara.co.id"]);
    expect(hasil.hanyaTelepon).toBe(false);
    expect(hasil.domainGratis).toBe(false);
  });

  it("menandai email layanan gratis", () => {
    const hasil = analisisKontak("Kirim lamaran ke rekrut@gmail.com");
    expect(hasil.email[0].domainGratis).toBe(true);
    expect(hasil.domainGratis).toBe(true);
  });

  it("menandai hanyaTelepon bila hanya ada nomor", () => {
    const hasil = analisisKontak("Hubungi 0812-9876-5432 segera.");
    expect(hasil.hanyaTelepon).toBe(true);
    expect(hasil.email).toEqual([]);
    expect(hasil.situs).toEqual([]);
  });

  it("bukan hanyaTelepon bila ada email", () => {
    const hasil = analisisKontak(
      "Hubungi 0812-9876-5432 atau email hr@firma.co.id",
    );
    expect(hasil.hanyaTelepon).toBe(false);
  });

  it("menyerupaiPerusahaan null bila nama perusahaan tidak diisi", () => {
    const hasil = analisisKontak("hubungi hr@firma.co.id");
    expect(hasil.email[0].menyerupaiPerusahaan).toBeNull();
  });
});

describe("adaKontak", () => {
  it("benar bila ada email, telepon, atau situs", () => {
    expect(adaKontak("email a@b.co.id")).toBe(true);
    expect(adaKontak("telepon 0812-3456-7890")).toBe(true);
    expect(adaKontak("buka www.contoh.co.id")).toBe(true);
  });

  it("salah bila teks tanpa kontak", () => {
    expect(adaKontak("hanya deskripsi jabatan tanpa kontak")).toBe(false);
  });
});

describe("domainDariEmail", () => {
  it("mengambil domain setelah @ dalam huruf kecil", () => {
    expect(domainDariEmail("HRD@ContoH.Co.Id")).toBe("contoh.co.id");
  });
});
