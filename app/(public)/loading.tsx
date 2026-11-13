import { Container } from "@/components/ui/container";

export default function Memuat() {
  return (
    <div
      className="bg-white py-16 sm:py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <Container>
        <span className="sr-only">Memuat konten…</span>
        <div className="mx-auto flex max-w-4xl animate-pulse flex-col gap-6">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 rounded-2xl bg-slate-200" />
          <div className="h-4 w-full rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 rounded-full bg-slate-100" />
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
            <div className="h-40 rounded-3xl bg-slate-100" />
          </div>
        </div>
      </Container>
    </div>
  );
}
