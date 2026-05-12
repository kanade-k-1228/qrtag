import { atomWithStorage } from "jotai/utils";

export interface Logo {
  src: string | null;
  sizeRatio: number;
}

export const logoAtom = atomWithStorage<Logo>(`qrtag:logo`, { src: "", sizeRatio: 0.22 });

export interface StyleSetting {
  stroke: number;
  cuttingColor: string;
  patternColor: string;
  commentColor: string;
}

export const styleAtom = atomWithStorage<StyleSetting>(`qrtag:style`, {
  stroke: 0.15,
  cuttingColor: "#FF0000",
  patternColor: "#000000",
  commentColor: "#999999",
});
