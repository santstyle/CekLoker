// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { KuisEdukasi } from "@/components/edukasi/kuis";
import { KUIS_PERTANYAAN } from "@/lib/edukasi/kuis";

afterEach(cleanup);

const TOTAL = KUIS_PERTANYAAN.length;

async function jawabSemua(
  user: ReturnType<typeof userEvent.setup>,
  indeksPilihan: (soal: (typeof KUIS_PERTANYAAN)[number]) => number,
) {
  for (const soal of KUIS_PERTANYAAN) {
    await user.click(
      screen.getByRole("radio", { name: soal.pilihan[indeksPilihan(soal)] }),
    );
  }
}

describe("KuisEdukasi", () => {
  it("merender seluruh soal dan menonaktifkan tombol hasil sebelum semua terjawab", () => {
    render(<KuisEdukasi />);

    for (const soal of KUIS_PERTANYAAN) {
      expect(screen.getByText(soal.pertanyaan)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeDisabled();
  });

  it("mengaktifkan tombol hasil setelah seluruh soal terjawab", async () => {
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    for (const soal of KUIS_PERTANYAAN) {
      await user.click(
        screen.getByRole("radio", { name: soal.pilihan[soal.jawaban] }),
      );
    }
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeEnabled();
  });

  it("menampilkan hasil sempurna saat seluruh jawaban benar", async () => {
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (soal) => soal.jawaban);
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));

    const status = screen.getByRole("status");
    expect(within(status).getByText(/Skor 100%/)).toBeInTheDocument();
    expect(within(status).getByText(/Sangat Baik/i)).toBeInTheDocument();
    expect(
      within(status).getByText(new RegExp(`/ ${TOTAL} benar`)),
    ).toBeInTheDocument();
  });

  it("menunjukkan jawaban benar dan penjelasan untuk soal yang salah", async () => {
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (soal) => (soal.jawaban === 0 ? 1 : 0));
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));

    const status = screen.getByRole("status");
    expect(within(status).getAllByText(/Jawaban benar:/)).toHaveLength(TOTAL);
    expect(within(status).getAllByText(/Rujukan:/).length).toBeGreaterThan(0);
  });

  it("mengembalikan ke keadaan awal saat Ulangi Kuis ditekan", async () => {
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (soal) => soal.jawaban);
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));
    await user.click(screen.getByRole("button", { name: /Ulangi Kuis/i }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeDisabled();
  });
});
