import { ALT_GAMBAR_OG } from "@/lib/situs";

/** Ukuran gambar kartu berbagi (Open Graph / Twitter). */
export const UKURAN_OG = { width: 1200, height: 630 } as const;

export const TIPE_OG = "image/png";

export const ALT_OG = ALT_GAMBAR_OG;

const BIRU = "#2563eb";

/**
 * Elemen JSX untuk `ImageResponse`. Sengaja memakai gaya inline karena
 * `ImageResponse` (satori) hanya mendukung flexbox dan sebagian properti CSS.
 */
export const elemenGambarOg = (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "64px 72px",
      backgroundImage:
        "linear-gradient(135deg, #020617 0%, #0f172a 52%, #1e3a8a 100%)",
      color: "#ffffff",
      fontFamily: "sans-serif",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 60,
          height: 60,
          borderRadius: 18,
          backgroundColor: BIRU,
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        C
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        CekLoker
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div
        style={{
          display: "flex",
          fontSize: 66,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          maxWidth: 940,
        }}
      >
        Deteksi risiko lowongan kerja sebelum melamar
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#cbd5e1",
          maxWidth: 880,
        }}
      >
        Rentang risiko, kutipan bukti, dan rujukan hukum resmi ketenagakerjaan
        Indonesia.
      </div>
    </div>

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 24,
        color: "#94a3b8",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 14,
          height: 14,
          borderRadius: 999,
          backgroundColor: BIRU,
        }}
      />
      <div style={{ display: "flex" }}>
        Deterministik, tanpa vonis, dan tanpa menyimpan teks lowongan Anda
      </div>
    </div>
  </div>
);
