import type { FC, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Field: FC<{ label: ReactNode; className?: string; children: ReactNode }> = ({
  label,
  className,
  children,
}) => (
  <Label
    className={cn("grid grid-cols-[10rem_minmax(0,1fr)] items-center gap-2 font-normal", className)}
  >
    <span className="text-muted-foreground">{label}</span>
    {children}
  </Label>
);

export const Section: FC<{ title: ReactNode; children: ReactNode }> = ({ title, children }) => (
  <section className="flex flex-col gap-2">
    <div className="mt-4">
      <h3 className="pb-1 text-sm font-semibold">{title}</h3>
      <Separator />
    </div>
    {children}
  </section>
);

export const NumberInput: FC<{
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
}> = ({ value, onChange, step, min }) => (
  <Input
    type="number"
    value={value}
    onChange={(e) => {
      const n = Number(e.target.value);
      if (Number.isFinite(n)) onChange(n);
    }}
    step={step}
    min={min}
    className="h-9 text-right tabular-nums"
  />
);
