"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UnggahPosterProps {
  onTeksTerbaca: (teks: string) => void;
  onMulaiMemproses?: () => void;
  disabled?: boolean;
}

const MAKSIMAL_UKURAN_BYTE = 8 * 1024 * 1024; // 8 MB
const TIPE_MIME_DIIZINKAN = ["image/png", "image/jpeg", "image/webp"];

/**
 * Melakukan pra-proses gambar pada elemen canvas (grayscale & penajaman kontras)
 * untuk meningkatkan akurasi pembacaan karakter Tesseract OCR.
 * Mengembalikan data URL hasil canvas; bila canvas 2D tidak tersedia,
 * mengembalikan berkas asli (Blob) yang juga bisa dibaca oleh Tesseract.
 */
async function praProsesGambar(file: Blob): Promise<string | Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        // Bukan URL yang sudah dicabut — kembalikan berkas asli.
        resolve(file);
        return;
      }

      // Skala 2x jika gambar di bawah 1600px untuk meningkatkan ketajaman OCR
      const skala = img.width < 1600 ? 1.8 : 1;
      canvas.width = Math.round(img.width * skala);
      canvas.height = Math.round(img.height * skala);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Konversi grayscale & kontras biner adaptif
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Formula luminans
          const abu = 0.299 * r + 0.587 * g + 0.114 * b;
          // Penajaman kontras
          const kontras = abu > 130 ? 255 : abu < 90 ? 0 : abu;
          data[i] = kontras;
          data[i + 1] = kontras;
          data[i + 2] = kontras;
        }

        ctx.putImageData(imgData, 0, 0);
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const prosesGambar = useCallback(
    async (file: Blob) => {
      if (disabled || sedangMemproses) return;

      // Validasi ukuran
      if (file.size > MAKSIMAL_UKURAN_BYTE) {
        setPesanStatus(
          "Ukuran berkas terlalu besar. Maksimal ukuran adalah 8 MB.",
        );
        return;
      }

      // Validasi tipe
      if (file.type && !TIPE_MIME_DIIZINKAN.includes(file.type)) {
        setPesanStatus(
          "Format berkas tidak didukung. Harap gunakan PNG, JPEG, atau WebP.",
        );
        return;
      }

      setPesanStatus(null);
      setSedangMemproses(true);
      setProgress(5);
      onMulaiMemproses?.();

      try {
        setPesanStatus("Mengoptimalkan kontras gambar untuk pembacaan...");
        const hasilPraProses = await praProsesGambar(file);
        setProgress(20);

        setPesanStatus("Memuat mesin pembaca teks OCR...");
        const { createWorker } = await import("tesseract.js");

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

        let teksHasil = "";
        try {
          const { data } = await worker.recognize(hasilPraProses);
          teksHasil = data.text.trim();
        } finally {
          // Pastikan worker OCR selalu dimatikan, walau recognize gagal.
          await worker.terminate();
        }

        setProgress(100);

        if (!teksHasil || teksHasil.length < 15) {
          setPesanStatus(
            "Teks poster tidak dapat terbaca dengan jelas. Anda dapat mengetik atau menempel isi lowongan secara manual.",
          );
        } else {
          setPesanStatus("Teks berhasil diekstraksi dari poster!");
          onTeksTerbaca(teksHasil);
        }
      } catch {
        setPesanStatus(
          "Terjadi kendala saat memproses gambar poster. Silakan coba lagi atau tempel teks langsung.",
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
            ? "border-blue-500 bg-blue-50/60 ring-4 ring-blue-500/10"
            : "border-slate-200/90 bg-slate-50/50 hover:border-blue-500/50 hover:bg-slate-50"
        } ${disabled || sedangMemproses ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-blue-600 shadow-xs transition-transform group-hover:scale-105">
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
            <p className="text-sm font-bold text-slate-900">
              Unggah Poster Lowongan Kerja
            </p>
            <p className="text-xs text-slate-500">
              Tarik gambar ke sini, tempel dari clipboard (Ctrl+V), atau{" "}
              <span className="font-semibold text-blue-600 underline">
                pilih berkas
              </span>
            </p>
            <p className="text-[11px] text-slate-400">
              Format PNG, JPG, WebP (Maksimal 8 MB &bull; Diproses 100% di
              peramban)
            </p>
          </div>
        </div>

        {/* Progress Bar & Status */}
        {sedangMemproses && (
          <div className="mt-4 w-full max-w-xs">
            <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>{pesanStatus}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action / Help strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500">Belum punya poster?</span>
        <button
          type="button"
          onClick={muatContohPoster}
          disabled={sedangMemproses || disabled}
          className="cursor-pointer font-bold text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50"
        >
          Coba Ekstrak Contoh Poster Lowongan &rarr;
        </button>
      </div>

      {pesanStatus && !sedangMemproses && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
        >
          {pesanStatus}
        </div>
      )}
    </div>
  );
}
