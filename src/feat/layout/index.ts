import { atomWithStorage } from "jotai/utils";

export const layoutAtom = atomWithStorage<Layout>(`qrtag:layout`, { col: 4, gap: 5, pad: 10 });

export interface Layout {
  col: number;
  gap: number;
  pad: number;
}
