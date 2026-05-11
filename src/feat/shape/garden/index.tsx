import { Field, NumberInput, Section } from "../../form";
import { fx, type ShapeModule } from "..";

export interface GardenProps {
  shape: "garden";
  size: number;
  width: number;
  height: number;
  corner: number;
  stemTop: number;
  stemBottom: number;
  stemHeight: number;
}

export const gardenModule: ShapeModule<GardenProps> = {
  kind: "garden",
  label: "Garden",
  default: {
    shape: "garden",
    size: 22,
    width: 28,
    height: 42,
    corner: 2,
    stemTop: 20,
    stemBottom: 12,
    stemHeight: 30,
  },
  size: (s) => [s.width, s.height + s.stemHeight],
  qrBox: (s) => ({ x: (s.width - s.size) / 2, y: (s.height - s.size) / 2, size: s.size }),
  Outline: ({ shape, color, stroke }) => {
    const { width, height, corner, stemTop, stemBottom, stemHeight } = shape;
    return (
      <g fill="none" stroke={color} strokeWidth={fx(stroke)}>
        <path d={outlinePath(width, height, corner, stemTop, stemBottom, stemHeight)} />
      </g>
    );
  },
  Fields: ({ shape, onChange }) => (
    <>
      <Section title="Head dimensions [mm]">
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
      <Section title="Trapezoidal stem [mm]">
        <Field label="Top width">
          <NumberInput
            value={shape.stemTop}
            onChange={(n) => onChange({ stemTop: n })}
            step={0.5}
            min={1}
          />
        </Field>
        <Field label="Bottom width">
          <NumberInput
            value={shape.stemBottom}
            onChange={(n) => onChange({ stemBottom: n })}
            step={0.5}
            min={1}
          />
        </Field>
        <Field label="Height">
          <NumberInput
            value={shape.stemHeight}
            onChange={(n) => onChange({ stemHeight: n })}
            step={0.5}
            min={1}
          />
        </Field>
      </Section>
    </>
  ),
};

const outlinePath = (
  width: number,
  height: number,
  corner: number,
  stemTop: number,
  stemBottom: number,
  stemHeight: number,
): string => {
  const r = Math.min(corner, width / 2, height / 2);
  const stemTopL = (width - stemTop) / 2;
  const stemTopR = stemTopL + stemTop;
  const stemBotL = (width - stemBottom) / 2;
  const stemBotR = stemBotL + stemBottom;
  const botY = height + stemHeight;
  return [
    `M ${r} 0`,
    `H ${width - r}`,
    `Q ${width} 0 ${width} ${r}`,
    `V ${height - r}`,
    `Q ${width} ${height} ${width - r} ${height}`,
    `H ${stemTopR}`,
    `L ${stemBotR} ${botY}`,
    `H ${stemBotL}`,
    `L ${stemTopL} ${height}`,
    `H ${r}`,
    `Q 0 ${height} 0 ${height - r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    "Z",
  ].join(" ");
};
