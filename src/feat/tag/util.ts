import QRCodeLib from "qrcode";
import { useMemo } from "react";

export interface QrMatrix {
  size: number;
  cells: { x: number; y: number }[];
}

export const truncateMiddle = (s: string, maxChars: number): string => {
  if (s.length <= maxChars) return s;
  const head = Math.floor((maxChars - 1) / 2);
  const tail = maxChars - 1 - head;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
};

export const qrModuleRects = (url: string): QrMatrix => {
  const matrix = QRCodeLib.create(url, { errorCorrectionLevel: "H" });
  const size = matrix.modules.size;
  const data = matrix.modules.data;
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) cells.push({ x, y });
    }
  }
  return { size, cells };
};

export const useQrMatrices = (urls: string[]) =>
  useMemo(() => urls.map((url) => qrModuleRects(url)), [urls]);
