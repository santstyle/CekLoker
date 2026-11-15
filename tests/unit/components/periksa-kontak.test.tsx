// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PeriksaKontak } from "@/components/check/periksa-kontak";

describe("PeriksaKontak", () => {
  it("tidak merender apa pun bila teks sangat pendek", () => {
    const { container } = render(<PeriksaKontak teks="hai" perusahaan="" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("menampilkan catatan bila belum ada kontak tertangkap", () => {
    render(
      <PeriksaKontak
        teks="Ini adalah deskripsi lowongan yang cukup panjang tanpa kontak."
        perusahaan=""
      />,
    );
    expect(
      screen.getByText(/belum ada kontak tertangkap dari teks/i),
    ).toBeInTheDocument();
  });

  it("memberi label domain layanan gratis", () => {
    render(
      <PeriksaKontak
        teks="Kirim lamaran lengkap ke rekrut@gmail.com paling lambat hari ini."
        perusahaan="PT Maju Bersama"
      />,
    );
    expect(screen.getByText("rekrut@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Domain layanan gratis")).toBeInTheDocument();
  });

  it("memberi label domain menyerupai nama perusahaan", () => {
    render(
      <PeriksaKontak
        teks="Lamar ke karir@nusantaraberkat.co.id dengan subjek lamaran Anda sendiri."
        perusahaan="PT Nusantara Berkat Abadi"
      />,
    );
    expect(
      screen.getByText("Domain menyerupai nama perusahaan"),
    ).toBeInTheDocument();
  });

  it("memberi label domain tidak menyerupai nama perusahaan", () => {
    render(
      <PeriksaKontak
        teks="Lamar ke hr@sumberkreasinusantara.co.id dengan subjek lamaran Anda."
        perusahaan="PT Karya Sejahtera Abadi"
      />,
    );
    expect(
      screen.getByText("Domain tidak menyerupai nama perusahaan"),
    ).toBeInTheDocument();
  });

  it("memberi peringatan bila kontak hanya berupa telepon", () => {
    render(
      <PeriksaKontak
        teks="Segera hubungi 0812-9876-5432 untuk bergabung lebih cepat ya."
        perusahaan=""
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      /kontak hanya berupa nomor telepon/i,
    );
    expect(screen.getByText("081298765432")).toBeInTheDocument();
  });

  it("menampilkan situs yang terdeteksi", () => {
    render(
      <PeriksaKontak
        teks="Selengkapnya di https://karir.nusantaraberkat.co.id/lowongan"
        perusahaan=""
      />,
    );
    expect(
      screen.getByText("https://karir.nusantaraberkat.co.id/lowongan"),
    ).toBeInTheDocument();
  });
});
