import Link from "next/link";

const NAV = [
  { href: "/cek", label: "Cek Lowongan" },
  { href: "/edukasi", label: "Edukasi" },
  { href: "/metodologi", label: "Metodologi" },
  { href: "/tentang", label: "Tentang" },
];

export default function LayoutPublik({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            CekLoker
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {NAV.map((butir) => (
              <Link
                key={butir.href}
                href={butir.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                {butir.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-10">{children}</div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            CekLoker memberikan rentang risiko berbasis aturan, bukan vonis.
            Keputusan akhir tetap di tangan Anda — verifikasi selalu ke sumber
            resmi.
          </p>
          <p className="mt-1">
            Teks lowongan yang Anda tempel tidak disimpan di server.
          </p>
        </div>
      </footer>
    </div>
  );
}
