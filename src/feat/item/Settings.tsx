import { useAtom } from "jotai";
import { type FC, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Section } from "../form";
import { itemAtom } from ".";

export const ItemSettings: FC = () => {
  const [item, setItem] = useAtom(itemAtom);

  return (
    <Section title="Tag content">
      <Field label="Mode">
        <Select
          value={item.item}
          onValueChange={(mode) =>
            setItem(
              mode === "list"
                ? { item: "list", bodys: [] }
                : { item: "uuid", base: "", idlen: 32, count: 12 },
            )
          }
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uuid">Auto-generated</SelectItem>
            <SelectItem value="list">Provide URLs</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {item.item === "uuid" ? (
        <>
          <Field label="Base URL">
            <Input
              type="text"
              value={item.base}
              onChange={(e) => setItem({ ...item, base: e.target.value })}
              className="h-9"
            />
          </Field>
          <Field label="ID length (nanoid)">
            <Input
              type="number"
              value={item.idlen}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) setItem({ ...item, idlen: Math.max(1, Math.round(n)) });
              }}
              min={1}
              step={1}
              className="h-9 text-right tabular-nums"
            />
          </Field>
          <Field label="Count">
            <Input
              type="number"
              value={item.count}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isFinite(n)) setItem({ ...item, count: Math.max(1, Math.round(n)) });
              }}
              min={1}
              step={1}
              className="h-9 text-right tabular-nums"
            />
          </Field>
        </>
      ) : (
        <UrlListTextArea
          value={item.bodys.join("\n")}
          onChange={(text) =>
            setItem({
              ...item,
              bodys: text
                .split(/\r?\n/)
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      )}
    </Section>
  );
};

const UrlListTextArea: FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [local, setLocal] = useState(value);
  useEffect(() => {
    setLocal(value);
  }, [value]);
  return (
    <Label className="flex flex-col gap-1 font-normal">
      <span className="text-muted-foreground">URL list (one URL per line)</span>
      <textarea
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          if (local !== value) onChange(local);
        }}
        rows={8}
        wrap="soft"
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [overflow-wrap:anywhere]"
      />
      <span className="text-xs text-muted-foreground">Applied on blur</span>
    </Label>
  );
};
