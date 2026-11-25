"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { teksBermakna } from "@/lib/ocr/kualitas";
import {
  ambangOtsu,
  binarisasiTerbalik,
  histogramLuminansi,
  luminansi,
  pereganganKontras,
  prosesPiksel,
  prosesPikselBradley,
} from "@/lib/ocr/pra-proses";

interface UnggahPosterProps {
  onTeksTerbaca: (teks: string) => void;
  onMulaiMemproses?: () => void;
  disabled?: boolean;
}

const MAKSIMAL_UKURAN_BYTE = 8 * 1024 * 1024; // 8 MB
const TIPE_MIME_DIIZINKAN = ["image/png", "image/jpeg", "image/webp"];
const LEBAR_TARGET = 1500; // piksel; di bawah ini gambar di-upscale
const SKALA_MAKS = 3;

/**
 * Melakukan pra-proses gambar pada elemen canvas: upscale proporsional,
 * bingkai putih, grayscale luminan, lalu biner Otsu (ambang menyesuaikan
 * histogram gambar) supaya Tesseract membaca teks poster berlatar warna.
 * Mengembalikan data URL hasil canvas; bila canvas 2D tidak tersedia,
 * mengembalikan berkas asli (Blob) yang juga bisa dibaca oleh Tesseract.
 */
async function praProsesGambar(
  file: Blob,
  mode: string,
): Promise<string | Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const ctx = document.createElement("canvas").getContext("2d");

      if (!ctx) {
        // Bukan URL yang sudah dicabut — kembalikan berkas asli.
        resolve(file);
        return;
      }

      const skala = Math.min(Math.max(LEBAR_TARGET / img.width, 1), SKALA_MAKS);
      const lebar = Math.round(img.width * skala);
      const tinggi = Math.round(img.height * skala);

      // Bingkai putih 2% (maks 120px): segmentasi Tesseract lebih stabil
      // bila teks bukan menempel tepi.
      const bingkai = Math.min(
        120,
        Math.max(20, Math.round(Math.min(lebar, tinggi) * 0.02)),
      );

      const canvas = document.createElement("canvas");
      canvas.width = lebar + bingkai * 2;
      canvas.height = tinggi + bingkai * 2;
      const konteks = canvas.getContext("2d");

      if (!konteks) {
        resolve(file);
        return;
      }

      konteks.fillStyle = "#ffffff";
      konteks.fillRect(0, 0, canvas.width, canvas.height);
      konteks.drawImage(img, bingkai, bingkai, lebar, tinggi);

      try {
        const imgData = konteks.getImageData(0, 0, canvas.width, canvas.height);
        if (mode === "otsuTerbalik") {
          const jumlahPiksel = imgData.width * imgData.height;
          const abu = luminansi(imgData.data, jumlahPiksel);
          const ambang = ambangOtsu(histogramLuminansi(abu), jumlahPiksel);
          binarisasiTerbalik(imgData.data, abu, ambang);
        } else if (mode === "bradley") {
          prosesPikselBradley({
            data: imgData.data,
            width: imgData.width,
            height: imgData.height,
          });
        } else if (mode === "kontras") {
          const jumlahPiksel = imgData.width * imgData.height;
          const abu = luminansi(imgData.data, jumlahPiksel);
          pereganganKontras(imgData.data, abu);
        } else {
          prosesPiksel({
            data: imgData.data,
            width: imgData.width,
            height: imgData.height,
          });
        }
        konteks.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        // Canvas bermasalah di tengah jalan; biarkan Tesseract membaca berkas asli.
        resolve(file);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gagal membaca berkas gambar"));
    };

    img.src = url;
  });
}

export function UnggahPoster({
  onTeksTerbaca,
  onMulaiMemproses,
  disabled = false,
}: UnggahPosterProps) {
  const [sedangMemproses, setSedangMemproses] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pesanStatus, setPesanStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pratinjauUrl, setPratinjauUrl] = useState<string | null>(null);
  const [teleponHasil, setTeleponHasil] = useState<string[]>([]);
  const [emailHasil, setEmailHasil] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prosesGambar = useCallback(
    async (file: Blob) => {
      if (disabled || sedangMemproses) return;

      // Validasi ukuran
      if (file.size > MAKSIMAL_UKURAN_BYTE) {
        setPesanStatus(
          "Ukuran berkas terlalu besar (maksimal 8 MB). Coba kompres gambar atau tempel teks lowongan secara manual.",
        );
        return;
      }

      // Validasi tipe
      if (file.type && !TIPE_MIME_DIIZINKAN.includes(file.type)) {
        setPesanStatus(
          "Format berkas tidak didukung (gunakan PNG, JPEG, atau WebP). Atau tempel teks lowongan secara manual.",
        );
        return;
      }

      setPesanStatus(null);
      setSedangMemproses(true);
      setProgress(5);
      onMulaiMemproses?.();
      setPratinjauUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });

      try {
        setPesanStatus("Mengoptimalkan kontras gambar untuk pembacaan...");
        const hasilPraProses = await praProsesGambar(file, "otsu");
        setProgress(20);

        setPesanStatus("Memuat mesin pembaca teks OCR...");
        let teksHasil = "";
        try {
          const { createWorker } = await import("tesseract.js");
          const { PSM } = await import("tesseract.js");

          const buatWorker = async () => {
            const worker = await createWorker(["ind", "eng"], 1, {
              workerPath: "/tesseract/worker.min.js",
              corePath: "/tesseract",
              langPath: "/tesseract",
              logger: (m) => {
                if (m.status === "recognizing text") {
                  const p = Math.round(20 + m.progress * 75);
                  setProgress(p);
                  setPesanStatus(
                    `Membaca teks dari poster... (${Math.round(m.progress * 100)}%)`,
                  );
                }
              },
            });
            return worker;
          };

          const jalankanPass = async (mode: unknown) => {
            const worker = await buatWorker();
            try {
              await worker.setParameters({
                tessedit_pageseg_mode: mode as never,
              });
              const { data } = await worker.recognize(hasilPraProses);
              const baris = String(data.text ?? "")
                .split("\n")
                .map((t: string, i: number) => ({
                  teks: t.trim(),
                  keyakinan: Number(data.confidence ?? 80),
                  bbox: { x0: 0, y0: i, x1: 0, y1: i },
                }));
              return {
                baris,
                rata: baris.length
                  ? baris.reduce(
                      (s: number, b: { keyakinan: number }) => s + b.keyakinan,
                      0,
                    ) / baris.length
                  : 0,
              };
            } finally {
              await worker.terminate();
            }
          };

          const hasilAuto = await jalankanPass(PSM.AUTO);
          const hasilSparse = await jalankanPass(PSM.SPARSE_TEXT);
          const { rataKeyakinan, urutkanDanSaringBaris } =
            await import("@/lib/ocr/baris-ocr");
          const skorAuto =
            hasilAuto.baris.reduce(
              (s: number, b: { teks: string }) =>
                s + (b.teks.match(/[A-Za-z0-9]/g)?.length ?? 0),
              0,
            ) * rataKeyakinan(hasilAuto.baris);
          const skorSparse =
            hasilSparse.baris.reduce(
              (s: number, b: { teks: string }) =>
                s + (b.teks.match(/[A-Za-z0-9]/g)?.length ?? 0),
              0,
            ) * rataKeyakinan(hasilSparse.baris);
          const terpilih = skorSparse > skorAuto ? hasilSparse : hasilAuto;

          const teksSaring = urutkanDanSaringBaris(terpilih.baris, 35);
          const pakaiFallback =
            teksSaring.replace(/[^A-Za-z0-9]/g, "").length < 30;
          teksHasil = pakaiFallback
            ? terpilih.baris.map((b: { teks: string }) => b.teks).join("\n")
            : teksSaring;

          if (pakaiFallback) {
            setPesanStatus(
              "Hasil pindai kurang bersih, periksa dan koreksi teks di bawah.",
            );
          } else {
            setPesanStatus("Teks berhasil diekstraksi dari poster!");
          }
        } finally {
          // pastikan proses selesai
        }

        setProgress(100);

        if (!teksBermakna(teksHasil)) {
          setPesanStatus(
            "Teks poster tidak dapat terbaca dengan jelas. Coba unggah versi yang lebih jelas, atau ketik/tempel teks lowongan secara manual.",
          );
        } else {
          setPesanStatus("Teks berhasil diekstraksi dari poster!");
          const polaEmail = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
          const emailTerdeteksi = [
            ...new Set(teksHasil.match(polaEmail) ?? []),
          ];
          const polaTelepon = /(?:\+62|62|0)8[1-9][0-9]{7,11}/g;
          const rapat = teksHasil.replace(/[\s().-]/g, "");
          const teleponTerdeteksi = [
            ...new Set(rapat.match(polaTelepon) ?? []),
          ];
          setTeleponHasil(teleponTerdeteksi);
          setEmailHasil(emailTerdeteksi);
          onTeksTerbaca(teksHasil);
        }
      } catch {
        setPesanStatus(
          "Terjadi kendala saat memproses gambar poster. Coba unggah versi yang lebih jelas, atau tempel teks lowongan secara manual.",
        );
      } finally {
        setSedangMemproses(false);
      }
    },
    [disabled, sedangMemproses, onMulaiMemproses, onTeksTerbaca],
  );

  // Listener paste (Ctrl + V) pada jendela
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      if (disabled || sedangMemproses) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            prosesGambar(file);
            break;
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [disabled, sedangMemproses, prosesGambar]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      prosesGambar(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      prosesGambar(file);
    }
  }

  async function muatContohPoster() {
    if (sedangMemproses) return;
    try {
      setPesanStatus("Mengambil contoh poster lowongan...");
      const respons = await fetch("/contoh-poster-lowongan.png");
      const blob = await respons.blob();
      prosesGambar(blob);
    } catch {
      setPesanStatus("Gagal memuat contoh poster.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || sedangMemproses}
      />

      {/* Dropzone Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!sedangMemproses) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!sedangMemproses && !disabled) {
            fileInputRef.current?.click();
          }
        }}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 ${
          isDragging
            ? "border-aksen bg-aksen/5 ring-4 ring-aksen/10"
            : "border-line bg-cream/60 hover:border-aksen/50 hover:bg-cream"
        } ${disabled || sedangMemproses ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-line bg-white text-aksen shadow-xs transition-transform group-hover:scale-105">
            <svg
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-bold text-ink">
              Unggah Poster Lowongan Kerja
            </p>
            <p className="text-xs text-muted">
              Tarik gambar ke sini, tempel dari clipboard (Ctrl+V), atau{" "}
              <span className="font-semibold text-aksen underline">
                pilih berkas
              </span>
            </p>
            <p className="text-[11px] text-muted">
              Format PNG, JPG, WebP (Maksimal 8 MB &bull; Diproses 100% di
              peramban)
            </p>
          </div>
        </div>

        {/* Progress Bar & Status */}
        {sedangMemproses && (
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-1.5 flex items-center justify-between gap-3 font-mono text-[0.65rem] font-semibold text-muted">
              <span>{pesanStatus}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aksen to-sky-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Pratinjau gambar */}
      {pratinjauUrl && (
        <div className="rounded-2xl border border-line bg-cream/50 p-3">
          <p className="mb-2 text-[0.65rem] font-semibold text-muted">
            Pratinjau gambar
          </p>
          <img
            src={pratinjauUrl}
            alt="Pratinjau poster"
            className="max-h-64 w-full rounded-xl object-contain"
          />
        </div>
      )}

      {/* Banner hasil pindai */}
      {!sedangMemproses && pratinjauUrl && (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900"
        >
          Hasil pindai bisa kurang akurat. Periksa teks di bawah, terutama nomor
          telepon, lalu koreksi jika perlu.
          {teleponHasil.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {teleponHasil.map((n) => (
                <li key={n} className="font-mono">
                  {n} — periksa nomor ini
                </li>
              ))}
            </ul>
          )}
          {emailHasil.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {emailHasil.map((e) => (
                <li key={e} className="font-mono">
                  {e} — periksa email ini
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Action / Help strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted">Belum punya poster?</span>
        <button
          type="button"
          onClick={muatContohPoster}
          disabled={sedangMemproses || disabled}
          className="cursor-pointer font-bold text-aksen transition-colors hover:text-aksen-pekat hover:underline disabled:opacity-50"
        >
          Coba Ekstrak Contoh Poster Lowongan &rarr;
        </button>
      </div>

      {pesanStatus && !sedangMemproses && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-line bg-cream/60 p-3 text-xs text-muted"
        >
          {pesanStatus}
        </div>
      )}
    </div>
  );
}
