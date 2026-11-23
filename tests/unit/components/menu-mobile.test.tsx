// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { MenuMobile } from "@/components/situs/menu-mobile";

afterEach(cleanup);

describe("MenuMobile", () => {
  it("tampilkan Sumber, Uji Konsistensi di daftar mobile", async () => {
    const user = userEvent.setup();
    render(<MenuMobile />);

    const tombol = screen.getByRole("button", { name: /menu navigasi/i });
    await user.click(tombol);

    const nav = screen.getByRole("navigation", { name: /navigasi mobile/i });

    expect(nav.querySelector('a[href="/sumber"]')).toBeInTheDocument();
    expect(nav.querySelector('a[href="/uji-akurasi"]')).toBeInTheDocument();
    expect(nav.querySelector('a[href="/tren"]')).not.toBeInTheDocument();
  });

  it("daftar mobile juga memuat Tentang dan link Bantuan", async () => {
    const user = userEvent.setup();
    render(<MenuMobile />);

    const tombol = screen.getByRole("button", { name: /menu navigasi/i });
    await user.click(tombol);

    const nav = screen.getByRole("navigation", { name: /navigasi mobile/i });
    expect(nav.querySelector('a[href="/tentang"]')).toBeInTheDocument();
    expect(screen.getByText("Sudah terlanjur? Bantuan")).toBeInTheDocument();
  });
});
