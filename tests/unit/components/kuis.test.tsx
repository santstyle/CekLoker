// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { KuisEdukasi } from "@/components/edukasi/kuis";
import { pilihSoalKuis, SOAL_PER_KUIS } from "@/lib/edukasi/kuis";

const SEED = 1;

/**
 * Memasang seed kuis lewat URL sebelum render agar set soal deterministik.
 * Kuis membaca `?set=` saat mount dan tidak pernah menulis URL sendiri.
 */
function pasangSeed(seed: number) {
  window.history.replaceState({}, "", `/?set=${seed}`);
}

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

/** Mengambil grup (fieldset) untuk nomor soal tertentu. */
function grupSoal(nomor: number) {
  return screen.getByRole("group", {
    name: new RegExp(`Soal ${nomor} dari ${SOAL_PER_KUIS}`),
  });
}

async function jawabSemua(
  user: ReturnType<typeof userEvent.setup>,
  indeksPilihan: (soal: ReturnType<typeof pilihSoalKuis>[number]) => number,
) {
  const setSoal = pilihSoalKuis(SEED);
  for (let i = 0; i < setSoal.length; i += 1) {
    const butir = setSoal[i];
    await user.click(
      within(grupSoal(i + 1)).getByRole("radio", {
        name: butir.pilihan[indeksPilihan(butir)],
      }),
    );
  }
}

describe("KuisEdukasi", () => {
  it("merender satu set soal sesuai seed dan menonaktifkan tombol hasil", () => {
    pasangSeed(SEED);
    render(<KuisEdukasi />);

    const setSoal = pilihSoalKuis(SEED);
    expect(screen.getAllByRole("group")).toHaveLength(SOAL_PER_KUIS);
    for (const butir of setSoal) {
      expect(screen.getByText(butir.pertanyaan)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeDisabled();
  });

  it("memilih set soal berbeda untuk seed berbeda", () => {
    pasangSeed(1);
    const { unmount } = render(<KuisEdukasi />);
    const pertanyaanSeed1 = screen
      .getAllByRole("group")
      .map((grup) => grup.querySelector("p")?.textContent ?? "");
    unmount();

    pasangSeed(2);
    render(<KuisEdukasi />);
    const pertanyaanSeed2 = screen
      .getAllByRole("group")
      .map((grup) => grup.querySelector("p")?.textContent ?? "");

    expect(pertanyaanSeed1).not.toEqual(pertanyaanSeed2);
  });

  it("menampilkan catatan refleksi diri dan pemilihan soal acak", () => {
    pasangSeed(SEED);
    render(<KuisEdukasi />);

    expect(screen.getByText(/refleksi diri/i)).toBeInTheDocument();
    expect(screen.getByText("7 soal acak")).toBeInTheDocument();
    expect(
      screen.getByText(/tidak dikirim atau disimpan/i),
    ).toBeInTheDocument();
  });

  it("mengaktifkan tombol hasil setelah seluruh soal terjawab", async () => {
    pasangSeed(SEED);
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (butir) => butir.jawaban);
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeEnabled();
  });

  it("menampilkan hasil sempurna saat seluruh jawaban benar", async () => {
    pasangSeed(SEED);
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (butir) => butir.jawaban);
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));

    const status = screen.getByRole("status");
    expect(within(status).getByText(/Skor 100%/)).toBeInTheDocument();
    expect(within(status).getByText(/Sangat Baik/i)).toBeInTheDocument();
    expect(
      within(status).getByText(new RegExp(`/ ${SOAL_PER_KUIS} benar`)),
    ).toBeInTheDocument();
  });

  it("menunjukkan jawaban benar dan penjelasan untuk soal yang salah", async () => {
    pasangSeed(SEED);
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (butir) => (butir.jawaban === 0 ? 1 : 0));
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));

    const status = screen.getByRole("status");
    expect(within(status).getAllByText(/Jawaban benar:/)).toHaveLength(
      SOAL_PER_KUIS,
    );
    const setSoal = pilihSoalKuis(SEED);
    if (setSoal.some((butir) => butir.rujukan)) {
      expect(within(status).getAllByText(/Rujukan:/).length).toBeGreaterThan(0);
    }
  });

  it("mengembalikan ke keadaan awal saat Ulangi Kuis ditekan", async () => {
    pasangSeed(SEED);
    const user = userEvent.setup();
    render(<KuisEdukasi />);

    await jawabSemua(user, (butir) => butir.jawaban);
    await user.click(screen.getByRole("button", { name: /Lihat Hasil/i }));
    await user.click(screen.getByRole("button", { name: /Ulangi Kuis/i }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lihat Hasil/i })).toBeDisabled();
  });
});
