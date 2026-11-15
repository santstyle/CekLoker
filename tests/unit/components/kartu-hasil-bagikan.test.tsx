// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { KartuHasilBagikan } from "@/components/hasil/kartu-hasil-bagikan";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

afterEach(cleanup);

function hasilContoh(): HasilEvaluasi {
  return {
    band: "perlu_dicek",
    skor: 72,
    temuan: [],
    saran: [],
    ringkasan: "Rentang risiko terkendala: Kompensasi & Upah. Skor 72/100.",
    versi: "",
  };
}

describe("KartuHasilBagikan", () => {
  it("menampilkan heading, ringkasan, skor, dan tiga tombol", async () => {
    render(<KartuHasilBagikan hasil={hasilContoh()} id="sesi-01" />);

    expect(
      screen.getByRole("heading", { name: /Bagikan dan cetak hasil/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Rentang risiko terkendala/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Skor 72\/100/i)).toHaveLength(2);

    const tombolBagikan = screen.getByTestId("tombol-bagikan");
    expect(tombolBagikan).toBeEnabled();

    const tombolUnduh = screen.getByTestId("tombol-unduh-pdf");
    expect(tombolUnduh).toBeEnabled();

    const tombolCetak = screen.getByTestId("tombol-cetak");
    expect(tombolCetak).toBeEnabled();
  });

  it("mengubah status tombol Unduh menjadi 'menyiapkan' setelah diklik", async () => {
    const user = userEvent.setup();
    render(<KartuHasilBagikan hasil={hasilContoh()} id="sesi-02" />);

    const tombolUnduh = screen.getByTestId("tombol-unduh-pdf");

    await user.click(tombolUnduh);
    // Setelah diklik komponen masuk ke state "menyiapkan" dan tombol disabled.
    expect(tombolUnduh).toBeDisabled();
  });
});
