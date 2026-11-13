"use client";

import Link from "next/link";
import { useEffect } from "react";

import "./globals.css";

export default function GalatGlobal({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        <main className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="flex max-w-xl flex-col items-center text-center">
            <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              Galat aplikasi
            </p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl">
              CekLoker gagal dimuat
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Terjadi kendala teknis pada kerangka aplikasi. Silakan muat ulang
              halaman; bila masalah berlanjut, kembali ke beranda beberapa saat
              lagi.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => retry()}
                className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 select-none hover:bg-blue-700 hover:shadow"
              >
                Coba lagi
              </button>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 select-none hover:bg-slate-50 hover:text-slate-900"
              >
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
