import type { ReactNode } from "react";

export default function TemplatePublik({ children }: { children: ReactNode }) {
  return <div className="transisi-halaman">{children}</div>;
}
