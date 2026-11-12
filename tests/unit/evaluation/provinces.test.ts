import { describe, expect, it } from "vitest";

import { matchProvinsi, PROVINSI, type Provinsi } from "@/lib/evaluation/provinces";

describe("PROVINSI", () => {
  it("memuat 38 provinsi tanpa duplikasi", () => {
    expect(PROVINSI).toHaveLength(38);
    expect(new Set(PROVINSI).size).toBe(PROVINSI.length);
  });

  it("setiap nama provinsi dikenali sebagai dirinya sendiri", () => {
    for (const provinsi of PROVINSI) {
      expect(matchProvinsi(provinsi)).toBe(provinsi);
    }
  });
});

type KasusProvinsi = {
  nama: string;
  masukan: string;
  harapan: Provinsi;
};

const KASUS_PROVINSI: readonly KasusProvinsi[] = [
  { nama: "nama resmi DKI Jakarta", masukan: "DKI Jakarta", harapan: "DKI Jakarta" },
  { nama: "kota Jakarta", masukan: "Jakarta Selatan", harapan: "DKI Jakarta" },
  { nama: "singkatan jkt", masukan: "JKT", harapan: "DKI Jakarta" },
  { nama: "singkatan dki", masukan: "dki", harapan: "DKI Jakarta" },
  { nama: "jabodetabek", masukan: "Jabodetabek", harapan: "DKI Jakarta" },
  { nama: "kota Bandung", masukan: "Kota Bandung", harapan: "Jawa Barat" },
  { nama: "Bandung dengan provinsi", masukan: "Bandung, Jawa Barat", harapan: "Jawa Barat" },
  { nama: "singkatan jabar", masukan: "Jabar", harapan: "Jawa Barat" },
  { nama: "kota Bekasi", masukan: "Bekasi", harapan: "Jawa Barat" },
  { nama: "kota Depok", masukan: "Depok", harapan: "Jawa Barat" },
  { nama: "kota Bogor", masukan: "Bogor", harapan: "Jawa Barat" },
  { nama: "kota Surabaya", masukan: "Surabaya", harapan: "Jawa Timur" },
  { nama: "singkatan jatim", masukan: "jatim", harapan: "Jawa Timur" },
  { nama: "kota Malang", masukan: "Malang", harapan: "Jawa Timur" },
  { nama: "singkatan jateng", masukan: "Jateng", harapan: "Jawa Tengah" },
  { nama: "kota Semarang", masukan: "Semarang", harapan: "Jawa Tengah" },
  { nama: "kota Solo", masukan: "Solo", harapan: "Jawa Tengah" },
  { nama: "kota Surakarta", masukan: "Surakarta", harapan: "Jawa Tengah" },
  { nama: "nama resmi DI Yogyakarta", masukan: "DI Yogyakarta", harapan: "DI Yogyakarta" },
  { nama: "sebutan Jogja", masukan: "Jogja", harapan: "DI Yogyakarta" },
  { nama: "kota Yogyakarta", masukan: "Yogyakarta", harapan: "DI Yogyakarta" },
  { nama: "kota Denpasar", masukan: "Denpasar", harapan: "Bali" },
  { nama: "nama resmi Bali", masukan: "Bali", harapan: "Bali" },
  { nama: "kota Mataram", masukan: "Mataram", harapan: "Nusa Tenggara Barat" },
  { nama: "singkatan ntb", masukan: "NTB", harapan: "Nusa Tenggara Barat" },
  { nama: "singkatan ntt", masukan: "NTT", harapan: "Nusa Tenggara Timur" },
  { nama: "kota Kupang", masukan: "Kupang", harapan: "Nusa Tenggara Timur" },
  { nama: "kota Medan", masukan: "Medan", harapan: "Sumatera Utara" },
  { nama: "singkatan sumut", masukan: "Sumut", harapan: "Sumatera Utara" },
  { nama: "kota Padang", masukan: "Padang", harapan: "Sumatera Barat" },
  { nama: "kota Palembang", masukan: "Palembang", harapan: "Sumatera Selatan" },
  { nama: "kota Pekanbaru", masukan: "Pekanbaru", harapan: "Riau" },
  { nama: "kota Banda Aceh", masukan: "Banda Aceh", harapan: "Aceh" },
  { nama: "kota Batam", masukan: "Batam", harapan: "Kepulauan Riau" },
  { nama: "kota Tanjungpinang", masukan: "Tanjungpinang", harapan: "Kepulauan Riau" },
  { nama: "kota Pangkalpinang", masukan: "Pangkalpinang", harapan: "Kepulauan Bangka Belitung" },
  { nama: "kota Bandar Lampung", masukan: "Bandar Lampung", harapan: "Lampung" },
  { nama: "kota Tangerang", masukan: "Tangerang", harapan: "Banten" },
  { nama: "kota Serang", masukan: "Serang", harapan: "Banten" },
  { nama: "kota Pontianak", masukan: "Pontianak", harapan: "Kalimantan Barat" },
  { nama: "kota Banjarmasin", masukan: "Banjarmasin", harapan: "Kalimantan Selatan" },
  { nama: "kota Balikpapan", masukan: "Balikpapan", harapan: "Kalimantan Timur" },
  { nama: "kota Samarinda", masukan: "Samarinda", harapan: "Kalimantan Timur" },
  { nama: "kota Tarakan", masukan: "Tarakan", harapan: "Kalimantan Utara" },
  { nama: "singkatan kaltim", masukan: "Kaltim", harapan: "Kalimantan Timur" },
  { nama: "kota Manado", masukan: "Manado", harapan: "Sulawesi Utara" },
  { nama: "kota Palu", masukan: "Palu", harapan: "Sulawesi Tengah" },
  { nama: "kota Makassar", masukan: "Makassar", harapan: "Sulawesi Selatan" },
  { nama: "kota Kendari", masukan: "Kendari", harapan: "Sulawesi Tenggara" },
  { nama: "kota Gorontalo", masukan: "Gorontalo", harapan: "Gorontalo" },
  { nama: "kota Mamuju", masukan: "Mamuju", harapan: "Sulawesi Barat" },
  { nama: "kota Ambon", masukan: "Ambon", harapan: "Maluku" },
  { nama: "kota Ternate", masukan: "Ternate", harapan: "Maluku Utara" },
  { nama: "kota Jayapura", masukan: "Jayapura", harapan: "Papua" },
  { nama: "kota Manokwari", masukan: "Manokwari", harapan: "Papua Barat" },
  { nama: "kota Sorong", masukan: "Sorong", harapan: "Papua Barat Daya" },
  { nama: "kota Timika", masukan: "Timika", harapan: "Papua Tengah" },
  { nama: "kota Wamena", masukan: "Wamena", harapan: "Papua Pegunungan" },
  { nama: "kota Merauke", masukan: "Merauke", harapan: "Papua Selatan" },
  { nama: "huruf besar", masukan: "SURABAYA", harapan: "Jawa Timur" },
  { nama: "tanda baca", masukan: "Surabaya.", harapan: "Jawa Timur" },
  { nama: "spasi berlebih dan emoji", masukan: "  😀 Jakarta   Pusat  ", harapan: "DKI Jakarta" },
];

describe("matchProvinsi", () => {
  it.each(KASUS_PROVINSI)("mengenali lokasi: $nama", ({ masukan, harapan }) => {
    expect(matchProvinsi(masukan)).toBe(harapan);
  });

  it("mengembalikan null untuk masukan kosong", () => {
    expect(matchProvinsi(null)).toBeNull();
    expect(matchProvinsi(undefined)).toBeNull();
    expect(matchProvinsi("")).toBeNull();
    expect(matchProvinsi("   ")).toBeNull();
  });

  it("mengembalikan null untuk lokasi yang tidak dikenali", () => {
    expect(matchProvinsi("Antah Berantah")).toBeNull();
    expect(matchProvinsi("Work from home")).toBeNull();
    expect(matchProvinsi("12345")).toBeNull();
  });

  it("tidak menyerempet alias di dalam kata lain", () => {
    expect(matchProvinsi("Balikpapan")).not.toBe("Bali");
    expect(matchProvinsi("palung")).toBeNull();
  });

  it("memilih alias terpanjang agar Papua Barat Daya tidak menjadi Papua Barat", () => {
    expect(matchProvinsi("Papua Barat Daya")).toBe("Papua Barat Daya");
    expect(matchProvinsi("Papua Barat")).toBe("Papua Barat");
    expect(matchProvinsi("Papua")).toBe("Papua");
  });

  it("memilih alias terpanjang untuk Kepulauan Riau dan Maluku Utara", () => {
    expect(matchProvinsi("Kepulauan Riau")).toBe("Kepulauan Riau");
    expect(matchProvinsi("Riau")).toBe("Riau");
    expect(matchProvinsi("Maluku Utara")).toBe("Maluku Utara");
    expect(matchProvinsi("Maluku")).toBe("Maluku");
  });

  it("mengenali nama resmi dan singkatan Kepulauan Bangka Belitung", () => {
    expect(matchProvinsi("Kepulauan Bangka Belitung")).toBe("Kepulauan Bangka Belitung");
    expect(matchProvinsi("Babel")).toBe("Kepulauan Bangka Belitung");
    expect(matchProvinsi("Bangka Belitung")).toBeNull();
  });

  it("hanya mengembalikan nilai yang ada di daftar PROVINSI", () => {
    for (const { masukan, harapan } of KASUS_PROVINSI) {
      const hasil = matchProvinsi(masukan);
      expect(hasil).toBe(harapan);
      expect(PROVINSI).toContain(hasil);
    }
  });

  it("deterministik pada pemanggilan berulang", () => {
    const pertama = matchProvinsi("Kota Bandung, Jawa Barat");
    for (let ulang = 0; ulang < 5; ulang += 1) {
      expect(matchProvinsi("Kota Bandung, Jawa Barat")).toBe(pertama);
    }
  });
});
