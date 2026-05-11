import { useAtom } from "jotai";
import { type FC, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Field, Section } from "../form";
import { type StyleSetting, styleAtom } from "./state";

export const StyleSettings: FC = () => {
  const [style, setStyle] = useAtom(styleAtom);
  const patch = useCallback(
    (p: Partial<StyleSetting>) => setStyle((s) => ({ ...s, ...p })),
    [setStyle],
  );

  return (
    <Section title="Settings">
      <Field label="Stroke width [mm]">
        <Input
          type="number"
          value={style.stroke}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) patch({ stroke: n });
          }}
          step={0.05}
          min={0.01}
          className="h-9 text-right tabular-nums"
        />
      </Field>
      <ColorRow
        label="Cutting color"
        value={style.cuttingColor}
        onChange={(v) => patch({ cuttingColor: v })}
      />
      <ColorRow
        label="Pattern color"
        value={style.patternColor}
        onChange={(v) => patch({ patternColor: v })}
      />
      <ColorRow
        label="Comment color"
        value={style.commentColor}
        onChange={(v) => patch({ commentColor: v })}
      />
    </Section>
  );
};

const ColorRow: FC<{ label: string; value: string; onChange: (v: string) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <Field label={label}>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value.toLowerCase()}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        className="h-8 w-12 cursor-pointer rounded-md border border-input bg-background"
      />
      <span className="font-mono text-xs uppercase text-muted-foreground">{value}</span>
    </div>
  </Field>
);
