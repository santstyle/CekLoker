// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { KartuMasukanHasil } from "@/components/hasil/kartu-masukan-hasil";
import { ALASAN_MASUKAN, kunciSimpananMasukan } from "@/lib/api/masukan";
import type { HasilEvaluasi } from "@/lib/evaluation/types";

const fetchMock =
  vi.fn<(input: string, init?: RequestInit) => Promise<Response>>();

function respons(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

beforeEach(() => {
  fetchMock.mockReset();
  window.sessionStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function hasilContoh(temuan: HasilEvaluasi["temuan"] = []): HasilEvaluasi {
  return {
    band: "perlu_dicek",
    skor: 42,
    temuan,
    saran: [],
    ringkasan: "Rentang risiko terkendala: Kompensasi & Upah. Skor 42/100.",
    versi: "uji",
  };
}

const TEMUAN_UPAH: HasilEvaluasi["temuan"][number] = {
  ruleId: "upah_dibawah_umr",
  judul: "Upah di bawah UMR",
  kategori: "upah",
  kekuatan: "kuat",
  faktor: 1.5,
  kontribusi: 15,
  bukti: ["Rp 1.000.000"],
  penjelasan: "Upah di bawah upah minimum.",
};

describe("KartuMasukanHasil", () => {
  it("menampilkan heading, lima alasan, dan tombol kirim nonaktif", () => {
    render(
      <KartuMasukanHasil hasil={hasilContoh([TEMUAN_UPAH])} id="sesi-01" />,
    );

    expect(
      screen.getByRole("heading", { name: /Hasil ini keliru\?/i }),
    ).toBeInTheDocument();

    for (const kode of ALASAN_MASUKAN) {
      expect(screen.getByTestId(`alasan-${kode}`)).toBeInTheDocument();
    }

    expect(screen.getByTestId("tombol-kirim-masukan")).toBeDisabled();
  });

  it("menyembunyikan pemilih temuan bila tidak ada temuan", () => {
    render(<KartuMasukanHasil hasil={hasilContoh()} id="sesi-02" />);

    expect(
      screen.queryByTestId("pilih-temuan-masukan"),
    ).not.toBeInTheDocument();
  });

  it("menampilkan pemilih temuan dan mengirim masukan tanpa temuan", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(respons(201, { ok: true }));

    render(
      <KartuMasukanHasil hasil={hasilContoh([TEMUAN_UPAH])} id="sesi-03" />,
    );

    expect(screen.getByTestId("pilih-temuan-masukan")).toBeInTheDocument();

    await user.click(screen.getByTestId("alasan-temuan_keliru"));
    expect(screen.getByTestId("tombol-kirim-masukan")).toBeEnabled();
    await user.click(screen.getByTestId("tombol-kirim-masukan"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/masukan");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      checkId: "sesi-03",
      alasan: "temuan_keliru",
    });

    await waitFor(() =>
      expect(screen.getByTestId("status-masukan")).toHaveTextContent(
        /Masukan terkirim/i,
      ),
    );
    expect(screen.queryByTestId("form-masukan")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem(kunciSimpananMasukan("sesi-03"))).toBe(
      "temuan_keliru",
    );
  });

  it("menyertakan ruleCode temuan yang dipilih", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(respons(201, { ok: true }));

    render(
      <KartuMasukanHasil hasil={hasilContoh([TEMUAN_UPAH])} id="sesi-04" />,
    );

    await user.click(screen.getByTestId("alasan-temuan_keliru"));
    await user.selectOptions(
      screen.getByTestId("pilih-temuan-masukan"),
      "upah_dibawah_umr",
    );
    await user.click(screen.getByTestId("tombol-kirim-masukan"));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toMatchObject({
      ruleCode: "upah_dibawah_umr",
    });
  });

  it("menampilkan pesan galat dari server", async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValue(
      respons(503, { error: "Masukan belum dapat disimpan. Coba lagi nanti." }),
    );

    render(<KartuMasukanHasil hasil={hasilContoh()} id="sesi-05" />);

    await user.click(screen.getByTestId("alasan-alasan_lain"));
    await user.click(screen.getByTestId("tombol-kirim-masukan"));

    const galat = await screen.findByTestId("pesan-galat-masukan");
    expect(galat).toHaveTextContent(/belum dapat disimpan/i);
    // Form tetap ada agar pengguna dapat mencoba lagi.
    expect(screen.getByTestId("form-masukan")).toBeInTheDocument();
  });

  it("menampilkan galat jaringan saat fetch ditolak", async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValue(new Error("jaringan mati"));

    render(<KartuMasukanHasil hasil={hasilContoh()} id="sesi-06" />);

    await user.click(screen.getByTestId("alasan-temuan_terlewat"));
    await user.click(screen.getByTestId("tombol-kirim-masukan"));

    const galat = await screen.findByTestId("pesan-galat-masukan");
    expect(galat).toHaveTextContent(/Tidak dapat menghubungi server/i);
  });

  it("menampilkan status terkirim bila sesi sudah pernah mengirim", async () => {
    window.sessionStorage.setItem(
      kunciSimpananMasukan("sesi-07"),
      "temuan_keliru",
    );

    render(<KartuMasukanHasil hasil={hasilContoh()} id="sesi-07" />);

    await waitFor(() =>
      expect(screen.getByTestId("status-masukan")).toHaveTextContent(
        /Masukan terkirim/i,
      ),
    );
    expect(screen.queryByTestId("form-masukan")).not.toBeInTheDocument();
  });
});
