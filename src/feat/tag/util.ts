import { create } from "qrcode";

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

export const qrModuleRects = (url: string) => {
  const matrix = create(url, { errorCorrectionLevel: "H" });
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
