import { ImageResponse } from "next/og";

import {
  ALT_OG,
  elemenGambarOg,
  TIPE_OG,
  UKURAN_OG,
} from "@/components/situs/gambar-og";

export const alt = ALT_OG;
export const size = UKURAN_OG;
export const contentType = TIPE_OG;

export default function GambarOpenGraph() {
  return new ImageResponse(elemenGambarOg, {
    width: UKURAN_OG.width,
    height: UKURAN_OG.height,
  });
}
