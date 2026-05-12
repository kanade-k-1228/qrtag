import { useAtom, useAtomValue } from "jotai";
import { Field, NumberInput, Section } from "../../form";
import { styleAtom } from "../../tag/state";
import { fx, type ShapeModule } from "..";
import { shapeAtom } from "../state";

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
  qrbox: (s) => ({ x: (s.width - s.size) / 2, y: (s.height - s.size) / 2, size: s.size }),
  outline: ({ stroke }) => {
    const shape = useAtomValue(shapeAtom) as GardenProps;
    const laser = useAtomValue(styleAtom);
    const { width, height, corner, stemTop, stemBottom, stemHeight } = shape;
    return (
      <g fill="none" stroke={laser.cuttingColor} strokeWidth={fx(stroke)}>
        <path d={outlinePath(width, height, corner, stemTop, stemBottom, stemHeight)} />
      </g>
    );
  },
  config: () => {
    const [shape, setShape] = useAtom(shapeAtom);
    const s = shape as GardenProps;
    const onChange = (patch: Partial<GardenProps>) => setShape({ ...s, ...patch });
    return (
      <>
        <Section title="Head dimensions [mm]">
          <Field label="Width">
            <NumberInput
              value={s.width}
              onChange={(n) => onChange({ width: n })}
              step={0.5}
              min={5}
            />
          </Field>
          <Field label="Height">
            <NumberInput
              value={s.height}
              onChange={(n) => onChange({ height: n })}
              step={0.5}
              min={5}
            />
          </Field>
          <Field label="QR size">
            <NumberInput
              value={s.size}
              onChange={(n) => onChange({ size: n })}
              step={0.5}
              min={5}
            />
          </Field>
          <Field label="Corner radius">
            <NumberInput
              value={s.corner}
              onChange={(n) => onChange({ corner: n })}
              step={0.1}
              min={0}
            />
          </Field>
        </Section>
        <Section title="Trapezoidal stem [mm]">
          <Field label="Top width">
            <NumberInput
              value={s.stemTop}
              onChange={(n) => onChange({ stemTop: n })}
              step={0.5}
              min={1}
            />
          </Field>
          <Field label="Bottom width">
            <NumberInput
              value={s.stemBottom}
              onChange={(n) => onChange({ stemBottom: n })}
              step={0.5}
              min={1}
            />
          </Field>
          <Field label="Height">
            <NumberInput
              value={s.stemHeight}
              onChange={(n) => onChange({ stemHeight: n })}
              step={0.5}
              min={1}
            />
          </Field>
        </Section>
      </>
    );
  },
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
