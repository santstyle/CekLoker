import { cn } from "@/components/ui/cn";
import { LABEL_BAND } from "@/lib/evaluation/evaluate";
import { bandDariSkor } from "@/lib/evaluation/score";
import type { Band } from "@/lib/evaluation/types";
import type { ContohLaporan } from "@/lib/hero-contoh";

/**
 * Gaya aksen per band, diselaraskan dengan `components/ui/lencana.tsx` agar
 * warna di beranda sama dengan warna lencana di halaman hasil.
 */
const AKSEN_BAND: Record<Band, { label: string; stempel: string }> = {
  rendah: { label: "text-blue-800", stempel: "text-blue-700" },
  perlu_dicek: { label: "text-amber-800", stempel: "text-amber-700" },
  tinggi: { label: "text-rose-800", stempel: "text-rose-700" },
};

/**
 * Rotasi ringan hanya di layar lebar. Di ponsel kartu tegak agar nyaman
 * digeser dan dibaca.
 */
const ROTASI = [
  "lg:rotate-[-1.4deg]",
  "lg:-mt-3 lg:rotate-[0.7deg]",
  "lg:mt-2 lg:rotate-[-0.6deg]",
];

export function KartuContohLaporan({
  contoh,
  indeks,
}: {
  contoh: ContohLaporan;
  indeks: number;
}) {
  const bandSkor = bandDariSkor(contoh.hasil.skor);
  const aksen = AKSEN_BAND[bandSkor];
  const kosong = contoh.hasil.temuan.length === 0;

  return (
    <li
      className={cn(
        "kartu-bingkai-gradasi w-[78vw] max-w-[340px] shrink-0 snap-center rounded-2xl p-5 shadow-[0_30px_60px_-22px_rgb(15_23_42/0.45)] transition-transform duration-300 lg:w-auto lg:max-w-none lg:hover:rotate-0",
        ROTASI[indeks],
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2.5 font-mono text-[0.56rem] font-semibold tracking-[0.18em] text-ink uppercase">
        <span>CekLoker · Laporan</span>
        <span className="text-muted normal-case">No. {contoh.nomor}</span>
      </div>

      <p className="mt-3 text-[0.95rem] leading-snug font-semibold text-ink">
        {contoh.posisi}
      </p>
      <p className="font-mono text-[0.6rem] tracking-[0.14em] text-muted uppercase">
        {contoh.lokasi}
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.72rem]">
        <div>
          <dt className="font-mono text-[0.5rem] tracking-[0.16em] text-muted uppercase">
            Sumber
          </dt>
          <dd className="font-medium text-ink">{contoh.sumber}</dd>
        </div>
        <div>
          <dt className="font-mono text-[0.5rem] tracking-[0.16em] text-muted uppercase">
            Upah
          </dt>
          <dd className="font-medium text-ink">{contoh.upah}</dd>
        </div>
      </dl>

      <div className="mt-3.5 flex items-end justify-between gap-3 border-y border-slate-100 py-3">
        <div>
          <p className="font-mono text-[0.5rem] tracking-[0.16em] text-muted uppercase">
            Skor risiko
          </p>
          <p className="mt-1 font-display text-[2.6rem] leading-none font-extrabold text-ink tabular-nums">
            {contoh.hasil.skor}
            <span className="text-base font-medium text-muted">/100</span>
          </p>
        </div>
        <span
          className={cn("stempel mb-1 rotate-[-6deg]", aksen.stempel)}
          aria-label={`Rentang risiko berbasis skor: ${LABEL_BAND[bandSkor]}`}
        >
          {LABEL_BAND[bandSkor]}
        </span>
      </div>

      {contoh.penentuBand ? (
        <p className="mt-2 font-mono text-[0.56rem] leading-relaxed tracking-[0.1em] text-muted uppercase">
          Rentang dinaikkan ke {LABEL_BAND[contoh.hasil.band]} oleh indikator penentu, bukan skor
        </p>
      ) : null}

      {kosong ? (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2.5 text-[0.68rem] leading-snug text-slate-600">
          {contoh.hasil.ringkasan}
        </p>
      ) : (
        <>
          <ol className="mt-3 space-y-1.5 text-[0.68rem] leading-snug text-slate-600">
            {contoh.temuanTampil.map((judul, urutan) => (
              <li key={judul} className="flex gap-1.5">
                <span
                  className={cn(
                    "shrink-0 font-mono text-[0.58rem] font-semibold tracking-[0.1em]",
                    aksen.label,
                  )}
                >
                  #{String(urutan + 1).padStart(2, "0")}
                </span>
                <span>{judul}</span>
              </li>
            ))}
          </ol>
          {contoh.sisaTemuan > 0 ? (
            <p className="mt-2 font-mono text-[0.56rem] tracking-[0.12em] text-muted uppercase">
              +{contoh.sisaTemuan} indikator lain
            </p>
          ) : null}
        </>
      )}
    </li>
  );
}
