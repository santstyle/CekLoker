// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Navigasi } from "@/components/situs/navigasi";

afterEach(cleanup);

describe("Navigasi (desktop)", () => {
  it("menampilkan tombol Transparansi dan item Cek Lowongan / Edukasi / Metodologi", () => {
    render(<Navigasi />);

    expect(
      screen.getByRole("button", { name: /transparansi/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Cek Lowongan" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edukasi" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Metodologi" }),
    ).toBeInTheDocument();
  });

  it("dropdown Transparansi memuat Sumber, Uji Konsistensi", async () => {
    const user = userEvent.setup();
    render(<Navigasi />);

    const tombol = screen.getByRole("button", { name: /transparansi/i });
    expect(tombol).toHaveAttribute("aria-expanded", "false");

    await user.click(tombol);
    expect(tombol).toHaveAttribute("aria-expanded", "true");

    const menu = screen.getByRole("menu", { name: /transparansi/i });
    expect(
      within(menu).getByRole("menuitem", { name: "Sumber" }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "Uji Konsistensi" }),
    ).toBeInTheDocument();
    expect(
      within(menu).queryByRole("menuitem", { name: "Tren" }),
    ).not.toBeInTheDocument();
  });

  it("Escape menutup dropdown Transparansi", async () => {
    const user = userEvent.setup();
    render(<Navigasi />);

    const tombol = screen.getByRole("button", { name: /transparansi/i });
    await user.click(tombol);
    expect(tombol).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(tombol).toHaveAttribute("aria-expanded", "false");
  });
});
