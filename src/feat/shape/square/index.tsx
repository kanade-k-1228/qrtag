import { Field, NumberInput, Section } from "../../form";
import { fx, type ShapeModule } from "..";

export interface SquareProps {
  shape: "square";
  size: number;
  width: number;
  height: number;
  corner: number;
  tagHoleRadius: number;
  tagHoleOffset: number;
}

export const squareModule: ShapeModule<SquareProps> = {
  kind: "square",
  label: "Square",
  default: {
    shape: "square",
    size: 28,
    width: 40,
    height: 40,
    corner: 3,
    tagHoleRadius: 2,
    tagHoleOffset: 4,
  },
  size: (s) => [s.width, s.height],
  qrBox: (s) => ({ x: (s.width - s.size) / 2, y: (s.height - s.size) / 2, size: s.size }),
  Outline: ({ shape, color, stroke }) => {
    const { width: w, height: h, corner, tagHoleRadius: hr, tagHoleOffset: ho } = shape;
    return (
      <g fill="none" stroke={color} strokeWidth={fx(stroke)}>
        <path d={outlinePath(w, h, corner)} />
        <circle cx={fx(ho)} cy={fx(ho)} r={fx(hr)} />
      </g>
    );
  },
  Fields: ({ shape, onChange }) => (
    <>
      <Section title="Dimensions [mm]">
        <Field label="Width">
          <NumberInput
            value={shape.width}
            onChange={(n) => onChange({ width: n })}
            step={0.5}
            min={5}
          />
        </Field>
        <Field label="Height">
          <NumberInput
            value={shape.height}
            onChange={(n) => onChange({ height: n })}
            step={0.5}
            min={5}
          />
        </Field>
        <Field label="QR size">
          <NumberInput
            value={shape.size}
            onChange={(n) => onChange({ size: n })}
            step={0.5}
            min={5}
          />
        </Field>
        <Field label="Corner radius">
          <NumberInput
            value={shape.corner}
            onChange={(n) => onChange({ corner: n })}
            step={0.1}
            min={0}
          />
        </Field>
      </Section>
      <Section title="Hole [mm]">
        <Field label="Hole radius">
          <NumberInput
            value={shape.tagHoleRadius}
            onChange={(n) => onChange({ tagHoleRadius: n })}
            step={0.1}
            min={0.1}
          />
        </Field>
        <Field label="Hole offset">
          <NumberInput
            value={shape.tagHoleOffset}
            onChange={(n) => onChange({ tagHoleOffset: n })}
            step={0.5}
            min={1}
          />
        </Field>
      </Section>
    </>
  ),
};

const outlinePath = (w: number, h: number, corner: number): string => {
  const r = Math.min(corner, w / 2, h / 2);
  return [
    `M ${r} 0`,
    `H ${w - r}`,
    `Q ${w} 0 ${w} ${r}`,
    `V ${h - r}`,
    `Q ${w} ${h} ${w - r} ${h}`,
    `H ${r}`,
    `Q 0 ${h} 0 ${h - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
};
