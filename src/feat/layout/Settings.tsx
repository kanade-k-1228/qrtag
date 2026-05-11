import { useAtom } from "jotai";
import { type FC, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Field, Section } from "../form";
import { type Layout, layoutAtom } from ".";

export const LayoutSettings: FC = () => {
  const [layout, setLayout] = useAtom(layoutAtom);
  const patch = useCallback(
    (p: Partial<Layout>) => setLayout((s) => ({ ...s, ...p })),
    [setLayout],
  );

  return (
    <Section title="Layout">
      <Field label="Columns">
        <Input
          type="number"
          value={layout.col}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) patch({ col: Math.max(1, Math.round(n)) });
          }}
          step={1}
          min={1}
          className="h-9 text-right tabular-nums"
        />
      </Field>
      <Field label="Page padding [mm]">
        <Input
          type="number"
          value={layout.pad}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) patch({ pad: n });
          }}
          step={1}
          min={0}
          className="h-9 text-right tabular-nums"
        />
      </Field>
      <Field label="Gap between tags [mm]">
        <Input
          type="number"
          value={layout.gap}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) patch({ gap: n });
          }}
          step={1}
          min={0}
          className="h-9 text-right tabular-nums"
        />
      </Field>
    </Section>
  );
};
