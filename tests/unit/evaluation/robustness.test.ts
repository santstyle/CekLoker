import { describe, expect, it } from "vitest";

import {
  evaluasiLowongan,
  skemaInputEvaluasi,
} from "@/lib/evaluation/evaluate";
import { normalizeText } from "@/lib/evaluation/normalize";

/**
 * Pengujian ketahanan terhadap masukan tak biasa.
 *
 * Berkas ini TIDAK mengunci nilai acuan evaluator (itu tugas kasus acuan);
 * tujuannya mengunci perilaku batas: normalisasi, validasi skema, dan
 * determinisme pada teks sangat panjang. Satu kasus — leetspeak — sengaja
 * mendokumentasikan keterbatasan mesin saat ini.
 */

const TEKS_LEETSPEAK =
  "PT Contoh Abadi Makmur membuka lowongan Staff Administrasi. b1aya administrasi Rp 150.000 wajib ditanggung pelamar. Gaji Rp 6.500.000 per bulan. Kirim CV ke hrd@contoh-abadimakmur.example.";

const TEKS_PANJANG =
  "PT Contoh Solusi Panjang mencari Staff Administrasi Kantor. Detail peran meliputi pengarsipan dokumen harian, penjadwalan meeting, pengelolaan surat masuk dan keluar, pembelian alat tulis kantor, serta pelaporan bulanan kepada kepala divisi. Kami menyediakan lingkungan kerja yang kondusif, jenjang karier jelas, cuti tahunan, THR, dan pelatihan rutin. Gaji Rp 7.000.000 per bulan. Kirim CV ke hrd@contoh-solusipanjang.example beserta portofolio dan kontak referensi. " +
  "Isi tambahan ini sengaja memperpanjang teks jauh melewati panjang iklan normal tanpa menambah kata kunci apa pun. ".repeat(
    60,
  );

describe("leetspeak (kesengajaan mendominasi mesin)", () => {
  it("dokumentasi keterbatasan: 'b1aya' tidak terbaca sebagai 'biaya' — skor 0, rendah, tanpa temuan", () => {
    // KETERBATASAN MESIN SAAT INI: mesin tidak melakukan transliterasi leetspeak
    // (b1aya -> biaya), sehingga pungutan biaya yang ditulis dengan angka
    // lolos tanpa temuan. Tes ini SENGAJA mengunci perilaku itu apa adanya
    // agar terlihat bila mesin diperbaiki di kemudian hari — bukan untuk
    // mengesahkan lolosnya penipuan leetspeak. Bila mesin mulai mendeteksi
    // transliterasi, tes ini gagal dan harus diperbarui ke nilai baru.
    const hasil = evaluasiLowongan({
      teksLowongan: TEKS_LEETSPEAK,
      lokasi: "Jakarta",
    });
    expect(hasil.skor).toBe(0);
    expect(hasil.band).toBe("rendah");
    expect(hasil.temuan).toEqual([]);
  });
});

describe("normalisasi terhadap trik karakter", () => {
  it("zero-width space di tengah frasa tetap terbaca sebagai frasa utuh", () => {
    expect(normalizeText("biaya\u200Badministrasi")).toBe("biaya administrasi");
  });

  it("emoji di tengah frasa tidak memutus pembacaan frasa", () => {
    expect(normalizeText("biaya 💰 administrasi")).toBe("biaya administrasi");
  });

  it("karakter hiasi (BOM, variasi selektor) diabaikan sepenuhnya", () => {
    expect(normalizeText("\uFEFFbiaya\uFE0F administrasi")).toBe(
      "biaya administrasi",
    );
  });
});

describe("skema masukan evaluasi", () => {
  it("menolak teks lowongan lebih dari 20.000 karakter", () => {
    const hasil = skemaInputEvaluasi.safeParse({
      teksLowongan: "a".repeat(20_001),
    });
    expect(hasil.success).toBe(false);
  });

  it("menerima teks tepat 30 karakter", () => {
    const hasil = skemaInputEvaluasi.safeParse({
      teksLowongan: "a".repeat(30),
    });
    expect(hasil.success).toBe(true);
  });

  it("menolak teks di bawah 30 karakter", () => {
    const hasil = skemaInputEvaluasi.safeParse({
      teksLowongan: "a".repeat(29),
    });
    expect(hasil.success).toBe(false);
  });
});

describe("determinisme pada teks sangat panjang", () => {
  it("dua pemanggilan menghasilkan keluaran yang identik", () => {
    const masukan = {
      teksLowongan: TEKS_PANJANG,
      lokasi: "Jakarta",
    };
    const pertama = evaluasiLowongan(masukan);
    const kedua = evaluasiLowongan(masukan);
    expect(pertama).toEqual(kedua);
  });

  it("teks di atas 4.000 karakter tidak menimbulkan temuan palsu", () => {
    const hasil = evaluasiLowongan({
      teksLowongan: TEKS_PANJANG,
      lokasi: "Jakarta",
    });
    expect(hasil.skor).toBe(0);
    expect(hasil.band).toBe("rendah");
    expect(hasil.temuan).toEqual([]);
  });
});
