import { useAtom } from "jotai";
import type { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Section } from "../form";
import { getModule, SHAPE_DEFAULTS, SHAPE_OPTIONS } from "../shape";
import { shapeAtom } from "./state";

export const ShapeSettings: FC = () => {
  const [shape, setShape] = useAtom(shapeAtom);
  const mod = getModule(shape.shape);

  return (
    <>
      <Section title="Shape">
        <Field label="Kind">
          <Select
            value={shape.shape}
            onValueChange={(kind) => setShape(SHAPE_DEFAULTS[kind as keyof typeof SHAPE_DEFAULTS])}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHAPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Section>

      <mod.Fields
        shape={shape}
        onChange={(patch) => setShape({ ...shape, ...patch } as typeof shape)}
      />
    </>
  );
};
