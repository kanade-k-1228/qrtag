import { useAtom } from "jotai";
import { type FC, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Section } from "../form";
import { type Logo, logoAtom } from "./state";

export const LogoSettings: FC = () => {
  const [logo, setLogo] = useAtom(logoAtom);
  const patch = useCallback((p: Partial<Logo>) => setLogo((s) => ({ ...s, ...p })), [setLogo]);

  return (
    <Section title="Logo">
      <Field label="Center logo">
        <div className="flex items-center gap-2">
          {logo.src ? (
            <>
              <img
                src={logo.src}
                alt=""
                className="h-8 w-8 rounded-md border border-input object-contain"
              />
              <Button type="button" variant="outline" size="sm" onClick={() => patch({ src: "" })}>
                Clear
              </Button>
            </>
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => patch({ src: reader.result as string });
                reader.readAsDataURL(file);
              }}
              className="h-9 text-xs"
            />
          )}
        </div>
      </Field>
      {logo.src && (
        <Field label="Size [% of QR]">
          <Input
            type="number"
            value={Math.round(logo.sizeRatio * 100)}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) patch({ sizeRatio: Math.max(5, Math.min(50, n)) / 100 });
            }}
            step={1}
            min={5}
            className="h-9 text-right tabular-nums"
          />
        </Field>
      )}
    </Section>
  );
};
