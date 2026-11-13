"use client";

import type { ChangeEvent, KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/components/ui/cn";
import {
  cariOpsiLokasi,
  filterOpsiLokasi,
  lokasiDikenali,
  type OpsiLokasi,
} from "@/lib/evaluation/lokasi";

interface PilihLokasiProps {
  id: string;
  nilai: string;
  onUbah: (nilai: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const KELAS_INPUT =
  "w-full rounded-xl border border-line bg-cream/60 py-3.5 pr-11 pl-4 text-sm text-ink transition-all duration-200 placeholder:text-slate-400 focus:border-aksen focus:bg-paper focus:ring-4 focus:ring-aksen/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-base";

/**
 * Pemilih lokasi dengan saran yang mengikuti ketikan.
 *
 * Daftar saran hanya berisi lokasi yang dikenali mesin evaluasi, sehingga
 * pilihan yang sah selalu dapat dibandingkan dengan batas upah minimum
 * daerah. Teks bebas yang tidak dikenali akan dikembalikan ke pilihan sah
 * terakhir saat kolom kehilangan fokus.
 */
export function PilihLokasi({
  id,
  nilai,
  onUbah,
  disabled = false,
  placeholder,
}: PilihLokasiProps) {
  const [terbuka, setTerbuka] = useState(false);
  const [sorotan, setSorotan] = useState(-1);

  const pembungkusRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nilaiValidRef = useRef(nilai);

  const idDaftar = `${id}-daftar`;
  const idOpsi = (indeks: number) => `${id}-opsi-${indeks}`;

  const hasil = useMemo(() => filterOpsiLokasi(nilai), [nilai]);
  const sorotanAman = sorotan >= 0 && sorotan < hasil.length ? sorotan : -1;
  const adaIsi = nilai.trim().length > 0;

  // Simpan nilai sah terakhir agar teks tak dikenal bisa dikembalikan.
  useEffect(() => {
    if (nilai === "" || cariOpsiLokasi(nilai) || lokasiDikenali(nilai)) {
      nilaiValidRef.current = nilai;
    }
  }, [nilai]);

  // Tutup daftar saat pengguna mengeklik di luar komponen.
  useEffect(() => {
    if (!terbuka) return;
    function tanganiKlikLuar(peristiwa: PointerEvent) {
      if (
        pembungkusRef.current &&
        !pembungkusRef.current.contains(peristiwa.target as Node)
      ) {
        setTerbuka(false);
        setSorotan(-1);
      }
    }
    document.addEventListener("pointerdown", tanganiKlikLuar);
    return () => document.removeEventListener("pointerdown", tanganiKlikLuar);
  }, [terbuka]);

  function pilih(opsi: OpsiLokasi) {
    onUbah(opsi.nilai);
    setTerbuka(false);
    setSorotan(-1);
    inputRef.current?.focus();
  }

  function kosongkan() {
    onUbah("");
    setTerbuka(false);
    setSorotan(-1);
    inputRef.current?.focus();
  }

  function tanganiPerubahan(peristiwa: ChangeEvent<HTMLInputElement>) {
    onUbah(peristiwa.target.value);
    setTerbuka(true);
    setSorotan(-1);
  }

  function tanganiFokus() {
    if (disabled) return;
    setTerbuka(true);
    setSorotan(-1);
  }

  function tanganiBlur() {
    setTerbuka(false);
    setSorotan(-1);

    const teks = nilai.trim();
    if (!teks) {
      if (nilai !== "") onUbah("");
      return;
    }

    const opsi = cariOpsiLokasi(teks);
    if (opsi) {
      if (opsi.nilai !== nilai) onUbah(opsi.nilai);
      return;
    }

    if (lokasiDikenali(teks)) return;

    // Teks tidak dikenali: kembalikan ke pilihan sah terakhir (bisa kosong).
    onUbah(nilaiValidRef.current);
  }

  function tanganiTombol(peristiwa: KeyboardEvent<HTMLInputElement>) {
    if (peristiwa.key === "ArrowDown") {
      peristiwa.preventDefault();
      if (!terbuka) {
        setTerbuka(true);
        return;
      }
      setSorotan((sebelum) =>
        Math.min(sebelum < 0 ? 0 : sebelum + 1, hasil.length - 1),
      );
      return;
    }

    if (peristiwa.key === "ArrowUp") {
      if (!terbuka) return;
      peristiwa.preventDefault();
      setSorotan((sebelum) => Math.max(sebelum - 1, 0));
      return;
    }

    if (peristiwa.key === "Home") {
      if (!terbuka) return;
      peristiwa.preventDefault();
      setSorotan(0);
      return;
    }

    if (peristiwa.key === "End") {
      if (!terbuka) return;
      peristiwa.preventDefault();
      setSorotan(hasil.length - 1);
      return;
    }

    if (peristiwa.key === "Enter") {
      if (terbuka && sorotanAman >= 0) {
        peristiwa.preventDefault();
        pilih(hasil[sorotanAman]);
      }
      return;
    }

    if (peristiwa.key === "Escape") {
      if (!terbuka) return;
      peristiwa.preventDefault();
      setTerbuka(false);
      setSorotan(-1);
    }
  }

  return (
    <div ref={pembungkusRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        role="combobox"
        aria-expanded={terbuka}
        aria-controls={terbuka && hasil.length > 0 ? idDaftar : undefined}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-activedescendant={
          sorotanAman >= 0 ? idOpsi(sorotanAman) : undefined
        }
        autoComplete="off"
        value={nilai}
        disabled={disabled}
        placeholder={placeholder}
        onChange={tanganiPerubahan}
        onFocus={tanganiFokus}
        onBlur={tanganiBlur}
        onKeyDown={tanganiTombol}
        className={KELAS_INPUT}
      />

      {adaIsi && (
        <button
          type="button"
          aria-label="Kosongkan lokasi"
          onMouseDown={(peristiwa) => peristiwa.preventDefault()}
          onClick={kosongkan}
          className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      {terbuka && (
        <div className="absolute z-20 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-line bg-paper shadow-xl shadow-slate-900/5">
          {hasil.length > 0 ? (
            <ul
              id={idDaftar}
              role="listbox"
              aria-label="Pilihan lokasi"
              className="py-1"
            >
              {hasil.map((opsi, indeks) => (
                <li
                  key={`${opsi.jenis}-${opsi.nilai}`}
                  id={idOpsi(indeks)}
                  role="option"
                  aria-selected={sorotanAman === indeks}
                  onMouseDown={(peristiwa) => peristiwa.preventDefault()}
                  onClick={() => pilih(opsi)}
                  onMouseEnter={() => setSorotan(indeks)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm",
                    sorotanAman === indeks
                      ? "bg-aksen/8 text-aksen-pekat"
                      : "text-ink/80 hover:bg-cream",
                  )}
                >
                  <span className="font-medium">{opsi.label}</span>
                  <span className="shrink-0 font-mono text-[0.65rem] text-muted">
                    {opsi.jenis === "provinsi" ? "Provinsi" : opsi.provinsi}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-muted">
              Lokasi tidak dikenali. Ketik nama kota atau provinsi, atau
              kosongkan kolom ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
