import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SHAPE_DEFAULTS, type ShapeProps } from "../shape";

const isShapeProps = (v: unknown): v is ShapeProps => {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  if (o.shape !== "square" && o.shape !== "garden") return false;
  const defaults = SHAPE_DEFAULTS[o.shape] as unknown as Record<string, unknown>;
  return Object.keys(defaults).every((k) => typeof o[k] === typeof defaults[k]);
};

const shapeStorage = (() => {
  const base = createJSONStorage<ShapeProps>(() => localStorage);
  return {
    ...base,
    getItem: (key: string, init: ShapeProps) => {
      const v = base.getItem(key, init);
      return isShapeProps(v) ? v : init;
    },
  };
})();

export const shapeAtom = atomWithStorage<ShapeProps>(
  `qrtag:shape`,
  SHAPE_DEFAULTS.square,
  shapeStorage,
);

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
