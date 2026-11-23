// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { Navigasi } from "@/components/situs/navigasi";

afterEach(cleanup);

describe("Navigasi (desktop)", () => {
  it("menampilkan item navigasi utama secara rata", () => {
    render(<Navigasi />);

    expect(
      screen.getByRole("link", { name: "Cek Lowongan" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Edukasi" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Metodologi" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sumber" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Uji Konsistensi" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tentang" })).toBeInTheDocument();
  });

  it("tidak menampilkan tombol atau menu dropdown Transparansi", () => {
    render(<Navigasi />);

    expect(
      screen.queryByRole("button", { name: /transparansi/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("menu", { name: /transparansi/i }),
    ).not.toBeInTheDocument();
  });

  it("menyertakan link Bantuan", () => {
    render(<Navigasi />);

    expect(screen.getByText("Sudah terlanjur? Bantuan")).toBeInTheDocument();
  });
});
