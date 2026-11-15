/**
 * Pemeriksaan kontak dan domain iklan lowongan.
 *
 * 100% deterministik dan murni: keluarannya hanya bergantung pada isi teks
 * dan nama perusahaan yang diketik pengguna — tidak ada akses jaringan,
 * Date.now(), atau Math.random(). Dijalankan di peramban sebagai petunjuk
 * pendamping; hasilnya BUKAN vonis "penipuan" atau "asli", dan tidak pernah
 * menggantikan keputusan pengguna.
 *
 * Modul ini tidak mengubah skor evaluasi; ia hanya memperlihatkan apa yang
 * sudah tertangkap dari teks (email, nomor telepon, situs) beserta
 * kesesuaiannya dengan nama perusahaan bila pengguna mengisinya.
 */

import {
  DOMAIN_EMAIL_GRATIS,
  POLA_EMAIL,
  POLA_SITUS,
  POLA_TELEPON,
} from "./rules";
import { normalizeText } from "./normalize";

const REGEX_EMAIL_GLOBAL = new RegExp(POLA_EMAIL.source, "gi");
const REGEX_SITUS_UTUH = /(?:https?:\/\/|www\.)[^\s<>()"']+/gi;

/** Hal-hal yang bukan bagian dari domain acuan saat deduplikasi. */
const KARAKTER_UJUNG_BUANG = /[.,;:!?)\]]+$/;

/** Kata bentuk badan usaha — bukan nama usaha itu sendiri. */
const KATA_BADAN_USAHA = new Set([
  "pt",
  "cv",
  "ud",
  "tbk",
  "persero",
  "koperasi",
  "yayasan",
  "firma",
]);

export interface EmailDikenali {
  /** Alamat sebagaimana tertulis (huruf kecil). */
  alamat: string;
  /** Domain setelah @, huruf kecil. */
  domain: string;
  /** Apakah domain tercantum di daftar layanan email gratis. */
  domainGratis: boolean;
  /**
   * Apakah domain menyerupai nama perusahaan yang diketik pengguna.
   * `null` bila nama perusahaan kosong (belum bisa dibandingkan).
   */
  menyerupaiPerusahaan: boolean | null;
}

export interface AnalisisKontak {
  /** Seluruh email unik yang tertangkap, urut kemunculan. */
  email: readonly EmailDikenali[];
  /** Nomor telepon (bentuk rapat: tanpa spasi/titik/tanda hubung). */
  telepon: readonly string[];
  /** Situs/URL sebagaimana tertulis. */
  situs: readonly string[];
  /** Ada nomor telepon tetapi tidak ada email maupun situs. */
  hanyaTelepon: boolean;
  /** Ada minimal satu email berdomain layanan gratis. */
  domainGratis: boolean;
}

/** Token nama usaha: huruf kecil, tanpa kata bentuk badan usaha. */
export function tokenNamaPerusahaan(perusahaan: string): string[] {
  return normalizeText(perusahaan)
    .split(/[^a-z0-9]+/u)
    .filter((token) => token.length >= 3 && !KATA_BADAN_USAHA.has(token));
}

export function domainDariEmail(alamat: string): string {
  return alamat.slice(alamat.lastIndexOf("@") + 1).toLowerCase();
}

export function domainGratis(domain: string): boolean {
  const bersih = domain.toLowerCase().replace(/^www\./, "");
  return DOMAIN_EMAIL_GRATIS.some((milik) => milik === bersih);
}

/**
 * Apakah domain email menyerupai nama perusahaan.
 *
 * Perbandingan bersifat substring pada domain tanpa titik, sehingga
 * subdomain (mis. `karir.nusantara.co.id`) tetap terhitung. Token dengan
 * panjang >= 4 yang cukup khas dipakai; bila seluruh token pendek (< 4
 * huruf), kecocokan mengharuskan SEMUA token muncul agar tidak terlalu longgar.
 *
 * Mengembalikan `null` bila nama perusahaan kosong / tak menyisakan token.
 */
export function domainMenyerupaiPerusahaan(
  domain: string,
  perusahaan: string,
): boolean | null {
  const token = tokenNamaPerusahaan(perusahaan);
  if (token.length === 0) return null;

  const d = domain
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\./g, "");

  const panjang = token.filter((t) => t.length >= 4);
  if (panjang.length > 0) {
    return panjang.some((t) => d.includes(t));
  }
  return token.every((t) => d.includes(t));
}

/** Semua email unik di teks (huruf kecil, tanpa titik uji di ujung). */
export function ekstrakEmail(teks: string): string[] {
  const hasil: string[] = [];
  const terlihat = new Set<string>();
  for (const cocok of teks.matchAll(REGEX_EMAIL_GLOBAL)) {
    const alamat = cocok[0].replace(KARAKTER_UJUNG_BUANG, "").toLowerCase();
    if (alamat && !terlihat.has(alamat)) {
      terlihat.add(alamat);
      hasil.push(alamat);
    }
  }
  return hasil;
}

/** Nomor telepon unik di teks, dalam bentuk rapat. */
export function ekstrakTelepon(teks: string): string[] {
  // Rapatkan dulu: 0812-9876-5432 → 081298765432 (sama seperti mesin evaluasi).
  const rapat = teks.replace(/[\s().-]/g, "");
  const hasil: string[] = [];
  const terlihat = new Set<string>();
  for (const cocok of rapat.matchAll(POLA_TELEPON)) {
    const nomor = cocok[0];
    if (!terlihat.has(nomor)) {
      terlihat.add(nomor);
      hasil.push(nomor);
    }
  }
  return hasil;
}

/** Situs/URL unik di teks, sebagaimana tertulis. */
export function ekstrakSitus(teks: string): string[] {
  const hasil: string[] = [];
  const terlihat = new Set<string>();
  for (const cocok of teks.matchAll(REGEX_SITUS_UTUH)) {
    const situs = cocok[0].replace(KARAKTER_UJUNG_BUANG, "");
    if (situs && !terlihat.has(situs)) {
      terlihat.add(situs);
      hasil.push(situs);
    }
  }
  return hasil;
}

/**
 * Analisis kontak lengkap atas teks iklan.
 *
 * `perusahaan` opsional; isi bila pengguna mengetik nama perusahaan agar
 * kesesuaian domain email dapat ditampilkan.
 */
export function analisisKontak(teks: string, perusahaan = ""): AnalisisKontak {
  const emailAlamat = ekstrakEmail(teks);
  const telepon = ekstrakTelepon(teks);
  const situs = ekstrakSitus(teks);

  const email = emailAlamat.map((alamat) => {
    const domain = domainDariEmail(alamat);
    return {
      alamat,
      domain,
      domainGratis: domainGratis(domain),
      menyerupaiPerusahaan: domainMenyerupaiPerusahaan(domain, perusahaan),
    };
  });

  return {
    email,
    telepon,
    situs,
    hanyaTelepon:
      telepon.length > 0 && email.length === 0 && situs.length === 0,
    domainGratis: email.some((e) => e.domainGratis),
  };
}

/** Apakah teks memuat setidaknya satu kontak yang dikenali. */
export function adaKontak(teks: string): boolean {
  return (
    ekstrakEmail(teks).length > 0 ||
    ekstrakTelepon(teks).length > 0 ||
    POLA_SITUS.test(teks)
  );
}
