import { describe, expect, it } from "vitest";

import { normalizeText } from "@/lib/evaluation/normalize";
import { DETEKTOR, RULES } from "@/lib/evaluation/rules";
import {
  BAND,
  KATEGORI_RULE,
  KEKUATAN,
  TIPE_RULE,
} from "@/lib/evaluation/types";
import type { KonteksDeteksi, RegionalWage } from "@/lib/evaluation/types";

const ID_RUJUKAN_SAHSIH: readonly string[] = [
  "uu-13-2003-pasal-5",
  "uu-13-2003-pasal-6",
  "permenaker-18-2024",
  "se-menaker-m6-hk04-v-2025",
  "uu-27-2022",
  "uu-18-2017",
  "kep-230-men-2003",
];

const UMP_CONTOH: RegionalWage = {
  provinsi: "DKI Jakarta",
  upahBulanan: 5_000_000,
  tahun: 2026,
};

function konteks(
  teks: string,
  tambahan: Partial<KonteksDeteksi> = {},
): KonteksDeteksi {
  return {
    teks: normalizeText(teks),
    teksMentah: teks,
    provinsi: null,
    gajiBulanan: null,
    upahMinimum: null,
    ...tambahan,
  };
}

function cariDetektor(ruleId: string) {
  const detektor = DETEKTOR.find((d) => d.ruleId === ruleId);
  if (detektor === undefined) {
    throw new Error(`Detektor untuk ${ruleId} tidak ditemukan`);
  }
  return detektor;
}

describe("metadata aturan", () => {
  it("memuat tepat 17 aturan", () => {
    expect(RULES).toHaveLength(17);
  });

  it("memiliki id aturan yang unik", () => {
    const ids = RULES.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("urutan detektor sejajar dengan urutan aturan", () => {
    expect(DETEKTOR.map((d) => d.ruleId)).toEqual(RULES.map((r) => r.id));
  });

  it.each([...RULES])("$id memiliki metadata yang valid", (rule) => {
    expect(rule.judul.trim().length).toBeGreaterThan(0);
    expect(rule.deskripsi.trim().length).toBeGreaterThan(0);
    expect(KEKUATAN).toContain(rule.kekuatan);
    expect(KATEGORI_RULE).toContain(rule.kategori);
    expect(TIPE_RULE).toContain(rule.tipe);
    expect(Number.isInteger(rule.bobot)).toBe(true);
    expect(rule.bobot).toBeGreaterThanOrEqual(1);
    expect(rule.bobot).toBeLessThanOrEqual(10);

    if (rule.hasilJikaCocok !== null) {
      expect(BAND).toContain(rule.hasilJikaCocok);
    }

    expect(rule.rujukanHukumIds.length).toBe(new Set(rule.rujukanHukumIds).size);
    for (const id of rule.rujukanHukumIds) {
      expect(ID_RUJUKAN_SAHSIH).toContain(id);
    }

    for (const frasa of rule.pola) {
      expect(frasa.trim().length).toBeGreaterThan(0);
      expect(frasa).toBe(frasa.toLowerCase());
    }

    if (rule.tipe === "ambang") {
      expect(rule.ambangBatas).not.toBeNull();
    } else {
      expect(rule.ambangBatas).toBeNull();
    }
  });

  it("ambang upah_dibawah_umr bernilai 1", () => {
    const rule = RULES.find((r) => r.id === "upah_dibawah_umr");
    expect(rule?.ambangBatas).toBe(1);
  });

  it("ambang gaji_tidak_wajar_tinggi bernilai 40 juta", () => {
    const rule = RULES.find((r) => r.id === "gaji_tidak_wajar_tinggi");
    expect(rule?.ambangBatas).toBe(40_000_000);
  });
});

describe("detektor per aturan", () => {
  describe("upah_dibawah_umr", () => {
    it("menandai gaji di bawah upah minimum", () => {
      const hasil = cariDetektor("upah_dibawah_umr").deteksi(
        konteks("gaji Rp 4.000.000", {
          gajiBulanan: 4_000_000,
          upahMinimum: UMP_CONTOH,
        }),
      );
      expect(hasil).toHaveLength(2);
      expect(hasil[0].startsWith("upah ")).toBe(true);
      expect(hasil[1].startsWith("minimum ")).toBe(true);
    });

    it("tidak menandai gaji sama dengan upah minimum", () => {
      expect(
        cariDetektor("upah_dibawah_umr").deteksi(
          konteks("gaji Rp 5.000.000", {
            gajiBulanan: 5_000_000,
            upahMinimum: UMP_CONTOH,
          }),
        ),
      ).toEqual([]);
    });

    it("tidak menandai bila data gaji tidak lengkap", () => {
      expect(
        cariDetektor("upah_dibawah_umr").deteksi(konteks("gaji menarik")),
      ).toEqual([]);
    });
  });

  describe("waktu_kerja_berlebih", () => {
    it("menandai jam kerja berlebihan", () => {
      expect(
        cariDetektor("waktu_kerja_berlebih").deteksi(
          konteks("jam kerja 12 jam setiap hari"),
        ),
      ).toEqual(["12 jam"]);
    });

    it("tidak menandai jam kerja wajar", () => {
      expect(
        cariDetektor("waktu_kerja_berlebih").deteksi(
          konteks("jam kerja 8 jam per hari"),
        ),
      ).toEqual([]);
    });
  });

  describe("pungutan_biaya", () => {
    it("menandai permintaan biaya dari pelamar", () => {
      expect(
        cariDetektor("pungutan_biaya").deteksi(
          konteks("wajib bayar biaya administrasi pendaftaran"),
        ),
      ).toEqual(["biaya administrasi", "wajib bayar"]);
    });

    it("tidak menandai bila ada penolakan biaya tanpa penegasan", () => {
      expect(
        cariDetektor("pungutan_biaya").deteksi(
          konteks("ada deposit tapi seluruh proses gratis dan tanpa biaya"),
        ),
      ).toEqual([]);
    });

    it("tetap menandai bila penegasan biaya hadir", () => {
      const hasil = cariDetektor("pungutan_biaya").deteksi(
        konteks("gratis, tetapi wajib bayar deposit"),
      );
      expect(hasil).toContain("deposit");
    });
  });

  describe("penempatan_luar_negeri_nonresmi", () => {
    it("menandai penempatan luar negeri tanpa jalur resmi", () => {
      expect(
        cariDetektor("penempatan_luar_negeri_nonresmi").deteksi(
          konteks("penempatan ke jepang, siapkan paspor dan visa"),
        ),
      ).toEqual(["jepang", "paspor", "visa"]);
    });

    it("tidak menandai tanpa penanda penempatan", () => {
      expect(
        cariDetektor("penempatan_luar_negeri_nonresmi").deteksi(
          konteks("kesempatan kerja di jepang"),
        ),
      ).toEqual([]);
    });
  });

  describe("gaji_tidak_wajar_tinggi", () => {
    it("menandai gaji sangat tinggi", () => {
      const hasil = cariDetektor("gaji_tidak_wajar_tinggi").deteksi(
        konteks("gaji Rp 45.000.000"),
      );
      expect(hasil).toHaveLength(1);
      expect(hasil[0].startsWith("gaji ")).toBe(true);
    });

    it("tidak menandai gaji wajar", () => {
      expect(
        cariDetektor("gaji_tidak_wajar_tinggi").deteksi(
          konteks("gaji Rp 10.000.000"),
        ),
      ).toEqual([]);
    });

    it("menandai gaji 25 juta tanpa syarat pengalaman", () => {
      const hasil = cariDetektor("gaji_tidak_wajar_tinggi").deteksi(
        konteks("gaji Rp 25.000.000 tanpa pengalaman"),
      );
      expect(hasil).toHaveLength(2);
    });

    it("tidak menandai gaji 25 juta tanpa penanda", () => {
      expect(
        cariDetektor("gaji_tidak_wajar_tinggi").deteksi(
          konteks("gaji Rp 25.000.000"),
        ),
      ).toEqual([]);
    });
  });

  describe("kontak_whatsapp_saja", () => {
    it("menandai lowongan dengan nomor telepon saja", () => {
      expect(
        cariDetektor("kontak_whatsapp_saja").deteksi(
          konteks("hubungi 081234567890"),
        ),
      ).toEqual(["081234567890"]);
    });

    it("tidak menandai bila ada email resmi", () => {
      expect(
        cariDetektor("kontak_whatsapp_saja").deteksi(
          konteks("hubungi 081234567890 atau email hr@gmail.com"),
        ),
      ).toEqual([]);
    });

    it("tidak menandai tanpa nomor telepon", () => {
      expect(
        cariDetektor("kontak_whatsapp_saja").deteksi(
          konteks("hubungi kami via email"),
        ),
      ).toEqual([]);
    });
  });

  describe("email_gratis", () => {
    it("menandai email domain gratis", () => {
      expect(
        cariDetektor("email_gratis").deteksi(konteks("kirim cv ke hr@gmail.com")),
      ).toEqual(["gmail.com"]);
    });

    it("tidak menandai email domain resmi", () => {
      expect(
        cariDetektor("email_gratis").deteksi(
          konteks("kirim cv ke hr@perusahaan.co.id"),
        ),
      ).toEqual([]);
    });
  });

  describe("tanpa_nama_perusahaan", () => {
    it("menandai teks tanpa nama perusahaan", () => {
      expect(
        cariDetektor("tanpa_nama_perusahaan").deteksi(
          konteks("kami mencari koki berpengalaman"),
        ),
      ).toEqual(["nama perusahaan tidak disebutkan"]);
    });

    it("tidak menandai teks dengan bentuk badan usaha", () => {
      expect(
        cariDetektor("tanpa_nama_perusahaan").deteksi(
          konteks("PT Maju mencari koki berpengalaman"),
        ),
      ).toEqual([]);
    });

    it("tidak menandai bila konteks memuat nama perusahaan", () => {
      expect(
        cariDetektor("tanpa_nama_perusahaan").deteksi(
          konteks("kami mencari koki berpengalaman", {
            perusahaan: "PT Maju Jaya",
          }),
        ),
      ).toEqual([]);
    });
  });

  describe("minta_dokumen_sensitif_dini", () => {
    it("menandai dokumen pribadi diminta sebelum seleksi", () => {
      const hasil = cariDetektor("minta_dokumen_sensitif_dini").deteksi(
        konteks("kirim scan ktp sebelum wawancara"),
      );
      expect(hasil.length).toBeGreaterThan(0);
      expect(hasil).toContain("scan ktp");
    });

    it("tidak menandai dokumen tanpa penanda waktu dini", () => {
      expect(
        cariDetektor("minta_dokumen_sensitif_dini").deteksi(
          konteks("kirim scan ktp setelah diterima"),
        ),
      ).toEqual([]);
    });

    it("tidak menandai penanda waktu tanpa dokumen", () => {
      expect(
        cariDetektor("minta_dokumen_sensitif_dini").deteksi(
          konteks("sebelum wawancara bawa berkas lamaran"),
        ),
      ).toEqual([]);
    });
  });

  describe("diterima_tanpa_seleksi", () => {
    it("menandai janji diterima langsung", () => {
      expect(
        cariDetektor("diterima_tanpa_seleksi").deteksi(
          konteks("langsung diterima tanpa interview"),
        ),
      ).toEqual(["langsung diterima", "tanpa interview"]);
    });

    it("tidak menandai seleksi yang jelas", () => {
      expect(
        cariDetektor("diterima_tanpa_seleksi").deteksi(
          konteks("proses seleksi ketat bertahap"),
        ),
      ).toEqual([]);
    });
  });

  describe("tekanan_mendesak", () => {
    it("menandai dorongan keputusan cepat", () => {
      expect(
        cariDetektor("tekanan_mendesak").deteksi(
          konteks("kuota terbatas, buruan daftar"),
        ),
      ).toEqual(["kuota terbatas", "buruan"]);
    });

    it("tidak menandai teks netral", () => {
      expect(
        cariDetektor("tekanan_mendesak").deteksi(
          konteks("daftar kapan saja sesuai kenyamanan"),
        ),
      ).toEqual([]);
    });
  });

  describe("diskriminasi_gender_usia", () => {
    it("menandai syarat gender", () => {
      expect(
        cariDetektor("diskriminasi_gender_usia").deteksi(
          konteks("hanya pria yang diterima"),
        ),
      ).toEqual(["hanya pria"]);
    });

    it("tidak menandai teks inklusif", () => {
      expect(
        cariDetektor("diskriminasi_gender_usia").deteksi(
          konteks("kami menerima semua latar belakang"),
        ),
      ).toEqual([]);
    });
  });

  describe("skema_komisi_berantai", () => {
    it("menandai penanda kuat skema berantai", () => {
      expect(
        cariDetektor("skema_komisi_berantai").deteksi(
          konteks("ikut skema mlm passive income"),
        ),
      ).toEqual(["mlm", "passive income"]);
    });

    it("tidak menandai satu sinyal saja", () => {
      expect(
        cariDetektor("skema_komisi_berantai").deteksi(
          konteks("ikutan tanpa modal"),
        ),
      ).toEqual([]);
    });

    it("menandai dua sinyal atau lebih", () => {
      expect(
        cariDetektor("skema_komisi_berantai").deteksi(
          konteks("tanpa modal ajak teman"),
        ),
      ).toEqual(["tanpa modal", "ajak teman"]);
    });
  });

  describe("upah_tidak_diungkap", () => {
    it("menandai teks tanpa nominal upah", () => {
      expect(
        cariDetektor("upah_tidak_diungkap").deteksi(
          konteks("gaji menarik untuk kandidat terbaik"),
        ),
      ).toEqual(["nominal upah tidak disebutkan"]);
    });

    it("tidak menandai bila nominal upah disebutkan", () => {
      expect(
        cariDetektor("upah_tidak_diungkap").deteksi(
          konteks("gaji Rp 5.000.000 per bulan"),
        ),
      ).toEqual([]);
    });

    it("tidak menandai bila upah mengacu umr", () => {
      expect(
        cariDetektor("upah_tidak_diungkap").deteksi(
          konteks("upah sesuai umr setempat"),
        ),
      ).toEqual([]);
    });
  });

  describe("lokasi_tidak_jelas", () => {
    it("menandai teks tanpa lokasi", () => {
      expect(
        cariDetektor("lokasi_tidak_jelas").deteksi(
          konteks("kami mencari koki berpengalaman untuk dapur"),
        ),
      ).toEqual(["lokasi kerja tidak disebutkan"]);
    });

    it("tidak menandai bila provinsi dikenali", () => {
      expect(
        cariDetektor("lokasi_tidak_jelas").deteksi(
          konteks("kami mencari koki berpengalaman untuk dapur", {
            provinsi: "DKI Jakarta",
          }),
        ),
      ).toEqual([]);
    });

    it("tidak menandai kerja jarak jauh", () => {
      expect(
        cariDetektor("lokasi_tidak_jelas").deteksi(
          konteks("posisi remote untuk desainer grafis"),
        ),
      ).toEqual([]);
    });
  });

  describe("lembur_tanpa_batas", () => {
    it("menandai penanda lembur berkelanjutan", () => {
      expect(
        cariDetektor("lembur_tanpa_batas").deteksi(
          konteks("shift malam dan siap lembur kapan saja"),
        ),
      ).toEqual(["siap lembur kapan saja", "shift malam"]);
    });

    it("tidak menandai lembur yang dibayar", () => {
      expect(
        cariDetektor("lembur_tanpa_batas").deteksi(
          konteks("lembur dibayar sesuai ketentuan"),
        ),
      ).toEqual([]);
    });
  });

  describe("rekrut_via_dm_samar", () => {
    it("menandai arahan ke pesan pribadi", () => {
      expect(
        cariDetektor("rekrut_via_dm_samar").deteksi(
          konteks("kirim dm instagram untuk info"),
        ),
      ).toEqual(["dm instagram", "kirim dm"]);
    });

    it("tidak menandai kanal resmi", () => {
      expect(
        cariDetektor("rekrut_via_dm_samar").deteksi(
          konteks("kirim email ke hrd@perusahaan.co.id"),
        ),
      ).toEqual([]);
    });
  });
});
