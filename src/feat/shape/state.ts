import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { SHAPE_DEFAULTS, type ShapeProps } from ".";

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

export const shapeAtom = atomWithStorage<ShapeProps>(`qrtag:shape`, {
  shape: "square",
  size: 28,
  width: 40,
  height: 40,
  corner: 3,
  tagHoleRadius: 2,
  tagHoleOffset: 4,
}, shapeStorage);
