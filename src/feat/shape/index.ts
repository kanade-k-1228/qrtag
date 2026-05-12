import type { FC } from "react";
import { type GardenProps, gardenModule } from "./garden";
import { type SquareProps, squareModule } from "./square";

export const fx = (n: number) => Number(n.toFixed(4));

export type ShapeProps = SquareProps | GardenProps;
export type ShapeKind = ShapeProps["shape"];

export interface ShapeModule<P extends ShapeProps> {
  kind: P["shape"];
  label: string;
  default: P;
  size: (s: P) => [number, number];
  qrbox: (s: P) => { x: number; y: number; size: number };
  outline: FC<{ stroke: number }>;
  config: FC;
}

type AnyModule = ShapeModule<ShapeProps>;

const MODULES: Record<ShapeKind, AnyModule> = {
  square: squareModule as unknown as AnyModule,
  garden: gardenModule as unknown as AnyModule,
};

export const getModule = (kind: ShapeKind): AnyModule => MODULES[kind];

export const SHAPE_OPTIONS: { value: ShapeKind; label: string }[] = (
  Object.keys(MODULES) as ShapeKind[]
).map((k) => ({ value: k, label: MODULES[k].label }));

export const SHAPE_DEFAULTS: { [K in ShapeKind]: Extract<ShapeProps, { shape: K }> } = {
  square: squareModule.default,
  garden: gardenModule.default,
};

export const size = (s: ShapeProps) => getModule(s.shape).size(s);
export const qrBox = (s: ShapeProps) => getModule(s.shape).qrbox(s);
