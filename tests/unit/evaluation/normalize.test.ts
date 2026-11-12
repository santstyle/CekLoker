import { describe, expect, it } from "vitest";

import {
  containsAny,
  containsPhrase,
  extractSalaries,
  formatRupiah,
  normalizeText,
} from "@/lib/evaluation/normalize";

type KasusNormalisasi = {
  nama: string;
  masukan: string;
  harapan: string;
};

/**
 * Catatan: `extractSalaries` tidak menormalkan teks lebih dulu. Masukan pada
 * tabel ini sengaja sudah huruf kecil agar yang diuji adalah pembacaan angka,
 * bukan normalisasi.
 */
type KasusFrasa = {
  nama: string;
  teks: string;
  frasa: string;
  harapan: boolean;
};

type KasusKandidat = {
  nama: string;
  teks: string;
  kandidat: readonly string[];
  harapan: string[];
};

type KasusNominal = {
  nama: string;
  masukan: string;
  harapan: number[];
};

type KasusFormat = {
  nama: string;
  masukan: number;
  harapan: string;
};

const KASUS_NORMALISASI: readonly KasusNormalisasi[] = [
  {
    nama: "memangkas spasi berlebih dan huruf besar",
    masukan: "  HALO   Dunia  ",
    harapan: "halo dunia",
  },
  { nama: "membuang emoji", masukan: "😀 Halo", harapan: "halo" },
  {
    nama: "membuang emoji beserta warna kulit",
    masukan: "👍🏽 Siap",
    harapan: "siap",
  },
  { nama: "menyeragamkan ligatur", masukan: "ﬁle", harapan: "file" },
  {
    nama: "menyeragamkan huruf lebar penuh",
    masukan: "Ｈａｌｏ",
    harapan: "halo",
  },
  {
    nama: "membuang zero width space",
    masukan: "\u200Bhalo",
    harapan: "halo",
  },
  {
    nama: "mengganti karakter tak terlihat di tengah kata",
    masukan: "a\u200Bb",
    harapan: "a b",
  },
  {
    nama: "merapikan tab dan baris baru",
    masukan: "Gaji\t5\njuta",
    harapan: "gaji 5 juta",
  },
  { nama: "mengosongkan teks berisi spasi", masukan: "   ", harapan: "" },
  { nama: "mengosongkan teks kosong", masukan: "", harapan: "" },
];

const KASUS_FRASA: readonly KasusFrasa[] = [
  {
    nama: "cocok pada teks yang sudah dinormalisasi",
    teks: normalizeText("Harga barang"),
    frasa: "harga",
    harapan: true,
  },
  {
    nama: "tidak cocok pada potongan kata",
    teks: "harga",
    frasa: "rga",
    harapan: false,
  },
  {
    nama: "tidak cocok di dalam deretan angka",
    teks: "15jt",
    frasa: "5jt",
    harapan: false,
  },
  {
    nama: "cocok saat diapit tanda baca",
    teks: "(harga)",
    frasa: "harga",
    harapan: true,
  },
  {
    nama: "menormalkan frasa pencarian",
    teks: "harga",
    frasa: "  HARGA  ",
    harapan: true,
  },
  {
    nama: "tidak menormalkan teks yang dicari",
    teks: "HARGA",
    frasa: "harga",
    harapan: false,
  },
  {
    nama: "mencocokkan frasa dua kata",
    teks: "lowongan kerja sama",
    frasa: "kerja sama",
    harapan: true,
  },
  {
    nama: "tidak mencocokkan frasa dua kata yang menyatu",
    teks: "kerjasama",
    frasa: "kerja sama",
    harapan: false,
  },
  {
    nama: "menolak frasa kosong",
    teks: "harga",
    frasa: "",
    harapan: false,
  },
  {
    nama: "menolak frasa berisi spasi saja",
    teks: "harga",
    frasa: "   ",
    harapan: false,
  },
];

const KASUS_KANDIDAT: readonly KasusKandidat[] = [
  {
    nama: "mengikuti urutan kandidat, bukan urutan teks",
    teks: normalizeText("Butuh modal dan biaya"),
    kandidat: ["biaya", "modal", "mahal"],
    harapan: ["biaya", "modal"],
  },
  {
    nama: "mengembalikan daftar kosong bila tidak ada yang cocok",
    teks: normalizeText("Gaji kompetitif"),
    kandidat: ["modal", "deposit"],
    harapan: [],
  },
  {
    nama: "mengembalikan daftar kosong bila kandidat kosong",
    teks: normalizeText("Gaji kompetitif"),
    kandidat: [],
    harapan: [],
  },
  {
    nama: "mempertahankan bentuk kandidat asli",
    teks: normalizeText("Wajib bayar biaya administrasi"),
    kandidat: ["Biaya Administrasi", "wajib bayar"],
    harapan: ["Biaya Administrasi", "wajib bayar"],
  },
];

const KASUS_NOMINAL: readonly KasusNominal[] = [
  {
    nama: "membaca rupiah bertitik ribuan",
    masukan: "rp 1.500.000",
    harapan: [1500000],
  },
  {
    nama: "membaca rupiah dengan titik setelah rp",
    masukan: "rp. 5.000.000",
    harapan: [5000000],
  },
  {
    nama: "membaca magnitude juta",
    masukan: "rp 5 juta",
    harapan: [5000000],
  },
  {
    nama: "membaca desimal koma dengan magnitude",
    masukan: "rp 1,5 juta",
    harapan: [1500000],
  },
  {
    nama: "membaca nominal tepat pada batas bawah",
    masukan: "rp 300.000",
    harapan: [300000],
  },
  {
    nama: "membaca magnitude ribu",
    masukan: "rp 300 rb",
    harapan: [300000],
  },
  {
    nama: "membaca rentang magnitude dengan tanda hubung",
    masukan: "rp 5 juta - 7 juta",
    harapan: [5000000, 7000000],
  },
  {
    nama: "membaca rentang dengan s/d",
    masukan: "rp 1 juta s/d 2 juta",
    harapan: [1000000, 2000000],
  },
  {
    nama: "membaca rentang dengan sampai",
    masukan: "rp 1.000.000 sampai 2.000.000",
    harapan: [1000000, 2000000],
  },
  {
    nama: "membaca rentang dengan hingga",
    masukan: "rp 2.000.000 hingga 3.000.000",
    harapan: [2000000, 3000000],
  },
  {
    nama: "membaca rentang rupiah berulang",
    masukan: "rp 1 juta - rp 2 juta",
    harapan: [1000000, 2000000],
  },
  {
    nama: "membaca rentang tanpa satuan mata uang di awal",
    masukan: "rp 300.000 - 500.000",
    harapan: [300000, 500000],
  },
  {
    nama: "mengurutkan rentang terbalik secara menaik",
    masukan: "rp 1.000.000 - 500.000",
    harapan: [500000, 1000000],
  },
  {
    nama: "membaca nominal tanpa awalan rp",
    masukan: "gaji 5 juta",
    harapan: [5000000],
  },
  {
    nama: "membaca magnitude tanpa spasi",
    masukan: "rp 5jt",
    harapan: [5000000],
  },
  {
    nama: "menghapus duplikat nominal yang sama",
    masukan: "rp 5 juta dan rp 5.000.000",
    harapan: [5000000],
  },
  {
    nama: "mengurutkan beberapa nominal menaik",
    masukan: "rp 7 juta, rp 5 juta",
    harapan: [5000000, 7000000],
  },
  {
    nama: "membaca dua nominal terpisah dalam satu teks",
    masukan: "gaji rp 3.000.000, tunjangan rp 500.000",
    harapan: [500000, 3000000],
  },
  {
    nama: "membulatkan pecahan rupiah",
    masukan: "rp 1.500.000,50",
    harapan: [1500001],
  },
  {
    nama: "membaca desimal di bawah satu juta",
    masukan: "rp 0,5 juta",
    harapan: [500000],
  },
  {
    nama: "membaca nominal tepat pada batas atas",
    masukan: "rp 5.000.000.000",
    harapan: [5000000000],
  },
  {
    nama: "menyaring nominal di bawah batas bawah",
    masukan: "rp 299.999",
    harapan: [],
  },
  {
    nama: "menyaring nominal di atas batas atas",
    masukan: "rp 6 miliar",
    harapan: [],
  },
  {
    nama: "menyaring nominal terlalu kecil",
    masukan: "rp 5 rb",
    harapan: [],
  },
  {
    nama: "mengabaikan satuan k yang rawan salah tafsir",
    masukan: "gaji 500k",
    harapan: [],
  },
  {
    nama: "mengabaikan satuan m yang rawan salah tafsir",
    masukan: "gaji 5m",
    harapan: [],
  },
  {
    nama: "mengabaikan nomor telepon",
    masukan: "hubungi 081234567890",
    harapan: [],
  },
  {
    nama: "mengabaikan usia",
    masukan: "usia 25 tahun",
    harapan: [],
  },
  {
    nama: "menyaring angka bertitik yang terbaca terlalu kecil",
    masukan: "rp 12.345",
    harapan: [],
  },
  {
    nama: "peka huruf besar pada awalan rp",
    masukan: "Rp 1.500.000",
    harapan: [],
  },
];

const KASUS_FORMAT: readonly KasusFormat[] = [
  { nama: "memformat nominal umum", masukan: 1500000, harapan: "Rp1.500.000" },
  { nama: "memformat nominal seribu", masukan: 1000, harapan: "Rp1.000" },
  { nama: "memformat nominal di bawah seribu", masukan: 999, harapan: "Rp999" },
  { nama: "memformat nol", masukan: 0, harapan: "Rp0" },
  {
    nama: "memformat nominal miliaran",
    masukan: 1_000_000_000,
    harapan: "Rp1.000.000.000",
  },
  {
    nama: "memformat nominal negatif",
    masukan: -1500000,
    harapan: "-Rp1.500.000",
  },
  {
    nama: "membulatkan pecahan ke atas",
    masukan: 1500000.6,
    harapan: "Rp1.500.001",
  },
  {
    nama: "membulatkan pecahan kecil ke bawah",
    masukan: 1234.5,
    harapan: "Rp1.235",
  },
  {
    nama: "tidak memunculkan tanda negatif untuk nol",
    masukan: -0.4,
    harapan: "Rp0",
  },
];

describe("normalizeText", () => {
  it.each(KASUS_NORMALISASI)("menyeragamkan teks: $nama", ({
    masukan,
    harapan,
  }) => {
    expect(normalizeText(masukan)).toBe(harapan);
  });

  it("idempoten saat dipanggil berulang", () => {
    const masukan = "  Ｈａｌｏ 😀   Dunia\tKerja  ";
    const sekali = normalizeText(masukan);
    expect(normalizeText(sekali)).toBe(sekali);
  });
});

describe("containsPhrase", () => {
  it.each(KASUS_FRASA)("mencocokkan frasa: $nama", ({
    teks,
    frasa,
    harapan,
  }) => {
    expect(containsPhrase(teks, frasa)).toBe(harapan);
  });

  it("hasilnya konsisten pada pemanggilan berulang", () => {
    const hasil = Array.from({ length: 5 }, () =>
      containsPhrase("biaya administrasi", "biaya administrasi"),
    );
    expect(hasil).toEqual([true, true, true, true, true]);
  });
});

describe("containsAny", () => {
  it.each(KASUS_KANDIDAT)("mengumpulkan frasa cocok: $nama", ({
    teks,
    kandidat,
    harapan,
  }) => {
    expect(containsAny(teks, kandidat)).toEqual(harapan);
  });

  it("memerlukan teks yang sudah dinormalisasi", () => {
    expect(containsAny("Biaya", ["biaya"])).toEqual([]);
  });
});

describe("extractSalaries", () => {
  it.each(KASUS_NOMINAL)("membaca nominal: $nama", ({
    masukan,
    harapan,
  }) => {
    expect(extractSalaries(masukan)).toEqual(harapan);
  });

  it("memberi hasil sama pada pemanggilan berulang", () => {
    const pertama = extractSalaries("rp 1.500.000");
    const kedua = extractSalaries("rp 1.500.000");
    expect(pertama).toEqual([1500000]);
    expect(kedua).toEqual(pertama);
  });

  it("bekerja pada keluaran normalizeText", () => {
    expect(extractSalaries(normalizeText("ＲＰ 5 JUTA"))).toEqual([5000000]);
  });
});

describe("formatRupiah", () => {
  it.each(KASUS_FORMAT)("memformat nominal: $nama", ({
    masukan,
    harapan,
  }) => {
    expect(formatRupiah(masukan)).toBe(harapan);
  });

  it("tidak bergantung pada locale sistem", () => {
    expect(formatRupiah(2500000)).toBe("Rp2.500.000");
  });
});
