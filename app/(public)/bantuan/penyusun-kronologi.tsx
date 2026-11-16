"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import {
  bangunKronologi,
  namaBerkasKronologi,
  PILIHAN_BUKTI,
  type HasilRingkas,
  type LangkahKronologi,
} from "@/lib/bantuan/kronologi";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";

interface TemuanTemplate {
  id: string;
  tanggal: string;
  deskripsi: string;
}

interface HasilSesi {
  label: string;
  ringkasan: HasilRingkas;
}

/**
 * Entri hasil pemeriksaan tersimpan di sessionStorage (`cekloker-hasil-*`).
 * Dibaca lewat useSyncExternalStore: snapshot server selalu null, lalu
 * setelah hidrasi dibaca sekali dari sessionStorage sehingga render awal
 * cocok dengan server tanpa efek samping sinkron.
 */
interface EntriHasilMentah {
  kunci: string;
  mentah: string;
}

let cacheEntri: EntriHasilMentah | null | undefined;

function cariEntri(): EntriHasilMentah | null {
  if (cacheEntri === undefined) {
    cacheEntri = null;
    try {
      for (let i = 0; i < window.sessionStorage.length; i += 1) {
        const kunci = window.sessionStorage.key(i);
        if (!kunci || !kunci.startsWith("cekloker-hasil-")) continue;
        const mentah = window.sessionStorage.getItem(kunci);
        if (!mentah) continue;
        try {
          const parsed = JSON.parse(mentah) as { hasil?: unknown };
          if (parsed?.hasil) cacheEntri = { kunci, mentah };
        } catch {
          // Lewati entri yang tidak bisa diurai.
        }
      }
    } catch {
      // sessionStorage tidak tersedia; biarkan cache bernilai null.
    }
  }
  return cacheEntri;
}

function bacaEntriKlien(): EntriHasilMentah | null {
  return cariEntri();
}

function bacaEntriServer(): EntriHasilMentah | null {
  return null;
}

// Tidak ada sumber yang menulis entri dari halaman ini; langganan kosong.
function langgananKosong(): () => void {
  return () => undefined;
}

function ringkasHasil(entri: EntriHasilMentah | null): HasilSesi | null {
  if (!entri) return null;
  try {
    const parsed = JSON.parse(entri.mentah) as {
      hasil?: { skor?: unknown; band?: unknown; temuan?: unknown };
    };
    const h = parsed?.hasil;
    if (!h || typeof h.skor !== "number" || typeof h.band !== "string") {
      return null;
    }
    const band = h.band as keyof typeof LABEL_BAND;
    if (!LABEL_BAND[band]) return null;
    const temuan = Array.isArray(h.temuan)
      ? h.temuan.flatMap((t: unknown) =>
          typeof t === "object" && t !== null && "judul" in t
            ? [String((t as { judul: unknown }).judul)]
            : [],
        )
      : [];
    return {
      label: `Pemeriksaan (rentang ${LABEL_BAND[band]})`,
      ringkasan: {
        skor: h.skor,
        band,
        labelBand: LABEL_BAND[band],
        temuan,
      },
    };
  } catch {
    return null;
  }
}

function bacaKutipan(entri: EntriHasilMentah | null): readonly string[] {
  if (!entri) return [];
  try {
    const parsed = JSON.parse(entri.mentah) as {
      hasil?: { temuan?: unknown };
    };
    const temuan = parsed?.hasil?.temuan;
    if (!Array.isArray(temuan)) return [];
    return temuan.flatMap((t: unknown) =>
      typeof t === "object" && t !== null && "bukti" in t
        ? (t as { bukti: unknown }).bukti instanceof Array
          ? (t as { bukti: unknown[] }).bukti.map(String)
          : []
        : [],
    );
  } catch {
    return [];
  }
}

/**
 * Penyusun kronologi (/bantuan). Semua proses di peramban: tidak ada
 * request jaringan yang membawa isi formulir. Teks hasil hanya disimpan
 * di perangkat pengguna (clipboard atau berkas .txt unduhan).
 */
export function PenyusunKronologi() {
  const [tanggalKejadian, setTanggalKejadian] = useState("");
  const [platform, setPlatform] = useState("");
  const [pihak, setPihak] = useState("");
  const [kontak, setKontak] = useState("");
  const [rekening, setRekening] = useState("");
  const [nominal, setNominal] = useState("");
  const [langkah, setLangkah] = useState<TemuanTemplate[]>([
    { id: "1", tanggal: "", deskripsi: "" },
  ]);
  const [bukti, setBukti] = useState<string[]>([]);
  const [lampirkanHasil, setLampirkanHasil] = useState(true);
  const [sertakanKutipan, setSertakanKutipan] = useState(false);
  const [tersalin, setTersalin] = useState(false);

  const entri = useSyncExternalStore(
    langgananKosong,
    bacaEntriKlien,
    bacaEntriServer,
  );
  const hasilSesi = useMemo(() => ringkasHasil(entri), [entri]);
  const kutipanIklan = useMemo(() => bacaKutipan(entri), [entri]);

  const teksKronologi = useMemo(() => {
    const langkahIsi: LangkahKronologi[] = langkah
      .filter((l) => l.deskripsi.trim().length > 0)
      .map((l) => ({ tanggal: l.tanggal, deskripsi: l.deskripsi }));

    return bangunKronologi({
      tanggalKejadian,
      platform,
      pihak,
      kontak,
      rekening,
      nominal,
      langkah: langkahIsi,
      bukti,
      // Lampirkan ringkasan hasil pemeriksaan bila ada dan pengguna
      // mencentangnya. Tanpa kutipan iklan di sini — kutipan hanya
      // disisipkan di teksKronologiFinal bila sertakanKutipan menyala.
      ringkasanHasil: hasilSesi && lampirkanHasil ? hasilSesi.ringkasan : null,
    });
  }, [
    tanggalKejadian,
    platform,
    pihak,
    kontak,
    rekening,
    nominal,
    langkah,
    bukti,
    hasilSesi,
    lampirkanHasil,
  ]);

  // Temuan dengan kutipan iklan bila dicentang diserahkan ke bangunKronologi:
  // kutipan hanya ditambahkan atas pilihan eksplisit pengguna.
  const teksKronologiFinal = useMemo(() => {
    if (
      !hasilSesi ||
      !lampirkanHasil ||
      !sertakanKutipan ||
      kutipanIklan.length === 0
    ) {
      return teksKronologi;
    }
    const tambahan = `\n\nKutipan bukti iklan (atas pilihan Anda):\n${kutipanIklan
      .map((k) => `- ${k}`)
      .join("\n")}`;
    return `${teksKronologi}${tambahan}`;
  }, [teksKronologi, hasilSesi, lampirkanHasil, sertakanKutipan, kutipanIklan]);

  function tambahLangkah() {
    setLangkah((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tanggal: "", deskripsi: "" },
    ]);
  }

  function hapusLangkah(id: string) {
    setLangkah((prev) => {
      if (prev.length <= 1) {
        return [{ id: crypto.randomUUID(), tanggal: "", deskripsi: "" }];
      }
      return prev.filter((l) => l.id !== id);
    });
  }

  function ubahLangkah(
    id: string,
    bagian: "tanggal" | "deskripsi",
    nilai: string,
  ) {
    setLangkah((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [bagian]: nilai } : l)),
    );
  }

  function ubahBukti(item: string, aktif: boolean) {
    setBukti((prev) =>
      aktif
        ? prev.includes(item)
          ? prev
          : [...prev, item]
        : prev.filter((b) => b !== item),
    );
  }

  async function salinTeks() {
    try {
      await navigator.clipboard.writeText(teksKronologiFinal);
    } catch {
      const area = document.createElement("textarea");
      area.value = teksKronologiFinal;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setTersalin(true);
    window.setTimeout(() => setTersalin(false), 2000);
  }

  function unduhTeks() {
    const blob = new Blob([teksKronologiFinal], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = namaBerkasKronologi();
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formulir */}
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-800">
              Tanggal kejadian pertama
            </span>
            <input
              type="date"
              value={tanggalKejadian}
              max="2050-12-31"
              onChange={(e) => setTanggalKejadian(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-800">
              Platform / sumber iklan
            </span>
            <input
              type="text"
              maxLength={120}
              placeholder="Mis. Instagram, Jobstreet, grup WhatsApp"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-800">
              Pihak yang mengaku perusahaan
            </span>
            <input
              type="text"
              maxLength={160}
              placeholder="Nama perusahaan / perekrut yang mengaku"
              value={pihak}
              onChange={(e) => setPihak(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold text-slate-800">
              Kontak pelaku (telepon / email / akun)
            </span>
            <input
              type="text"
              maxLength={200}
              placeholder="Mis. 0811-0000-0000, akun terverifikasi, email, akun sosial media"
              value={kontak}
              onChange={(e) => setKontak(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-800">
              Nomor rekening tujuan{" "}
              <span className="text-slate-600">(opsional)</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={32}
              placeholder="Mis. 0000000000"
              value={rekening}
              onChange={(e) => setRekening(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-800">
              Nominal kerugian{" "}
              <span className="text-slate-600">(opsional)</span>
            </span>
            <input
              type="text"
              maxLength={64}
              placeholder="Mis. Rp2.000.000"
              value={nominal}
              onChange={(e) => setNominal(e.target.value)}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
            />
          </label>
        </div>

        {/* Urutan kejadian */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-semibold text-slate-800">
            Urutan kejadian (beranggal)
          </legend>
          {langkah.map((item) => (
            <div
              key={item.id}
              className="grid gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 sm:grid-cols-[auto_1fr_auto] sm:items-end"
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-[0.7rem] font-medium text-slate-500">
                  Tanggal
                </span>
                <input
                  type="date"
                  value={item.tanggal}
                  max="2050-12-31"
                  onChange={(e) =>
                    ubahLangkah(item.id, "tanggal", e.target.value)
                  }
                  className="min-h-10 rounded-xl border border-slate-300 px-3 text-xs text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[0.7rem] font-medium text-slate-500">
                  Kejadian
                </span>
                <input
                  type="text"
                  maxLength={240}
                  placeholder="Mis. Saya menghubungi nomor ini dan dia meminta biaya administrasi"
                  value={item.deskripsi}
                  onChange={(e) =>
                    ubahLangkah(item.id, "deskripsi", e.target.value)
                  }
                  className="min-h-10 rounded-xl border border-slate-300 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => hapusLangkah(item.id)}
                className="min-h-10 cursor-pointer rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={tambahLangkah}
            className="self-start text-xs font-semibold text-blue-700 transition-colors hover:text-blue-800"
          >
            + Tambah urutan kejadian
          </button>
        </fieldset>

        {/* Bukti yang dimiliki */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-semibold text-slate-800">
            Bukti yang dimiliki
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PILIHAN_BUKTI.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-xs leading-snug text-slate-700 transition-colors hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={bukti.includes(item)}
                  onChange={() => ubahBukti(item, !bukti.includes(item))}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Lampirkan hasil pemeriksaan */}
        {hasilSesi && (
          <fieldset className="flex flex-col gap-2 rounded-2xl border border-blue-200/70 bg-blue-50/50 p-4">
            <legend className="text-xs font-semibold text-blue-900">
              Lampirkan hasil pemeriksaan sebelumnya (opsional)
            </legend>
            <label className="flex cursor-pointer items-start gap-2 text-xs leading-snug text-slate-700">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={lampirkanHasil}
                onChange={(e) => setLampirkanHasil(e.target.checked)}
              />
              <span>
                {hasilSesi.label} — skor dan nama temuan akan disertakan. Tanpa
                kutipan iklan, kecuali Anda centang di bawah.
              </span>
            </label>
            {lampirkanHasil && (
              <label className="ml-6 flex cursor-pointer items-start gap-2 text-xs leading-snug text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={sertakanKutipan}
                  onChange={(e) => setSertakanKutipan(e.target.checked)}
                />
                <span>Sertakan juga kutipan bukti iklan di kronologi</span>
              </label>
            )}
          </fieldset>
        )}
      </form>

      {/* Hasil */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
          Teks kronologi (diproses di perangkat Anda)
        </h3>
        <pre
          aria-label="Hasil teks kronologi"
          className="min-h-72 flex-1 overflow-auto rounded-2xl border border-slate-200/80 bg-slate-950 p-4 font-mono text-[0.72rem] leading-relaxed whitespace-pre-wrap text-slate-100"
        >
          {teksKronologiFinal}
        </pre>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={salinTeks}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-slate-950 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800"
          >
            {tersalin ? "✓ Tersalin!" : "Salin teks"}
          </button>
          <button
            type="button"
            onClick={unduhTeks}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100"
          >
            Unduh sebagai teks <span aria-hidden="true">↓</span>
          </button>
        </div>
        <p className="text-xs leading-relaxed text-slate-600">
          Teks ini hanya ada di perangkat Anda. CekLoker tidak menyimpan isi
          kronologi di server.
        </p>
      </div>
    </div>
  );
}
