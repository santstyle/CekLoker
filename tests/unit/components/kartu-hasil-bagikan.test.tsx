// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KartuHasilBagikan } from "@/components/hasil/kartu-hasil-bagikan";
import type { HasilEvaluasi } from "@/lib/evaluation/types";
import type { OpsiLaporanPdf } from "@/lib/hasil/pdf";

const unduhLaporanPdf = vi.fn<
  (hasil: HasilEvaluasi, opsi: OpsiLaporanPdf) => Promise<void>
>(async () => {});

vi.mock("@/lib/hasil/pdf", () => ({
  unduhLaporanPdf: (hasil: HasilEvaluasi, opsi: OpsiLaporanPdf) =>
    unduhLaporanPdf(hasil, opsi),
}));

beforeEach(() => {
  unduhLaporanPdf.mockClear();
});

afterEach(cleanup);

function hasilContoh(): HasilEvaluasi {
  return {
    band: "perlu_dicek",
    skor: 42,
    temuan: [],
    saran: [],
    ringkasan: "Rentang risiko terkendala: Kompensasi & Upah. Skor 42/100.",
    versi: "",
  };
}

describe("KartuHasilBagikan", () => {
  it("menampilkan heading, skor, tiga tombol, dan opsi kutipan yang mati", () => {
    render(<KartuHasilBagikan hasil={hasilContoh()} id="sesi-01" />);

    expect(
      screen.getByRole("heading", { name: /Laporan PDF & cetak hasil/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Skor 42\/100/)).toBeInTheDocument();
    expect(
      screen.getByText(/Estimasi risiko deterministik berbasis teks/i),
    ).toBeInTheDocument();

    expect(screen.getByTestId("tombol-unduh-pdf")).toBeEnabled();
    expect(screen.getByTestId("tombol-bagikan")).toBeEnabled();
    expect(screen.getByTestId("tombol-cetak")).toBeEnabled();

    const centang = screen.getByTestId("centang-kutipan");
    expect(centang).not.toBeChecked();
    expect(
      screen.getByLabelText(/Sertakan kutipan dari iklan/i),
    ).toBeInTheDocument();
  });

  it("memanggil pembuat laporan tanpa kutipan saat opsi dibiarkan mati", async () => {
    const user = userEvent.setup();
    render(
      <KartuHasilBagikan
        hasil={hasilContoh()}
        id="sesi-02"
        meta={{ lokasi: "Jakarta Selatan" }}
      />,
    );

    await user.click(screen.getByTestId("tombol-unduh-pdf"));

    expect(unduhLaporanPdf).toHaveBeenCalledTimes(1);
    const [, opsi] = unduhLaporanPdf.mock.calls[0];
    expect(opsi).toMatchObject({
      id: "sesi-02",
      sertakanKutipan: false,
      meta: { lokasi: "Jakarta Selatan" },
    });
  });

  it("meneruskan opsi kutipan saat kotak centang dinyalakan", async () => {
    const user = userEvent.setup();
    render(<KartuHasilBagikan hasil={hasilContoh()} id="sesi-03" />);

    await user.click(screen.getByTestId("centang-kutipan"));
    await user.click(screen.getByTestId("tombol-unduh-pdf"));

    expect(unduhLaporanPdf).toHaveBeenCalledTimes(1);
    const [, opsi] = unduhLaporanPdf.mock.calls[0];
    expect(opsi).toMatchObject({ sertakanKutipan: true });
  });

  it("menonaktifkan tombol selama laporan disiapkan", async () => {
    const user = userEvent.setup();
    let selesai: (() => void) | undefined;
    unduhLaporanPdf.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          selesai = resolve;
        }),
    );

    render(<KartuHasilBagikan hasil={hasilContoh()} id="sesi-04" />);

    await user.click(screen.getByTestId("tombol-unduh-pdf"));

    expect(screen.getByTestId("tombol-unduh-pdf")).toBeDisabled();
    expect(screen.getByTestId("tombol-unduh-pdf")).toHaveTextContent(
      /Menyiapkan PDF/i,
    );

    selesai?.();
  });
});
