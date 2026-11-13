// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { PilihLokasi } from "@/components/check/pilih-lokasi";

afterEach(cleanup);

/** Pembungkus terkendali agar nilai dapat diperiksa setelah interaksi. */
function Harness({ awal = "" }: { awal?: string }) {
  const [nilai, setNilai] = useState(awal);

  return (
    <div>
      <label htmlFor="lokasi">Lokasi</label>
      <PilihLokasi id="lokasi" nilai={nilai} onUbah={setNilai} />
      <output data-testid="nilai">{nilai}</output>
    </div>
  );
}

function nilaiTersimpan() {
  return screen.getByTestId("nilai").textContent;
}

describe("PilihLokasi", () => {
  it("menampilkan saran yang mengikuti ketikan", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Jawa");

    const daftar = screen.getByRole("listbox");
    expect(within(daftar).getByText("Jawa Barat")).toBeInTheDocument();
    expect(within(daftar).getByText("Jawa Timur")).toBeInTheDocument();
    expect(within(daftar).queryByText("Papua")).not.toBeInTheDocument();
  });

  it("menandai combobox terbuka lewat aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");

    await user.click(input);
    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("memilih opsi saat diklik dan menutup daftar", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    await user.type(input, "Jawa");

    await user.click(screen.getByText("Jawa Barat"));

    expect(nilaiTersimpan()).toBe("Jawa Barat");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("memilih opsi lewat navigasi keyboard", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.type(input, "Jawa");

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { selected: true })).toBeInTheDocument();

    await user.keyboard("{Enter}");

    // Opsi pertama untuk kueri "Jawa" adalah "Jawa Barat".
    expect(nilaiTersimpan()).toBe("Jawa Barat");
  });

  it("menutup daftar saat menekan Escape", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("menampilkan pesan bantuan saat tidak ada lokasi cocok", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.type(screen.getByRole("combobox"), "zzz");

    expect(screen.getByText(/Lokasi tidak dikenali/)).toBeInTheDocument();
  });

  it("mengosongkan nilai lewat tombol kosongkan", async () => {
    const user = userEvent.setup();
    render(<Harness awal="Bandung" />);

    await user.click(screen.getByRole("button", { name: "Kosongkan lokasi" }));

    expect(nilaiTersimpan()).toBe("");
  });

  it("mempertahankan lokasi yang dikenali saat kehilangan fokus", async () => {
    const user = userEvent.setup();
    render(<Harness awal="Bandung" />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.tab();

    expect(nilaiTersimpan()).toBe("Bandung");
  });

  it("membuang teks tak dikenal saat kehilangan fokus", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const input = screen.getByRole("combobox");
    await user.type(input, "kota entah berantah");
    await user.tab();

    expect(nilaiTersimpan()).toBe("");
    expect(input).toHaveValue("");
  });
});
