// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Memuat from "@/app/(public)/loading";

afterEach(cleanup);

describe("Memuat (loading skeleton)", () => {
  it("menampilkan placeholder aksesibilitas dan bukan teks 'Memuat konten…'", () => {
    render(<Memuat />);

    expect(screen.queryByText("Memuat konten…")).not.toBeInTheDocument();
    expect(screen.queryByText("Memuat konten...")).not.toBeInTheDocument();

    // Elemen dengan aria-busy tetap tampil sebagai indikator loading.
    const kontainer = screen.getByTestId("loading-skeleton");
    expect(kontainer).toHaveAttribute("aria-busy", "true");
    expect(kontainer).toHaveAttribute("aria-live", "polite");
  });
});
