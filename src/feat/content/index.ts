import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { nanoid } from "nanoid";

export const contentAtom = atomWithStorage<Contents>(`qrtag:content`, {
  content: "uuid",
  base: "",
  idlen: 32,
  count: 12,
});

export const urlsAtom = atom((get) => contents(get(contentAtom)));

export type Contents = ContentList | ContentUUID;

interface ContentList {
  content: "list";
  bodys: string[];
}

interface ContentUUID {
  content: "uuid";
  base: string;
  idlen: number;
  count: number;
}

export const contents = (c: Contents): string[] => {
  switch (c.content) {
    case "list":
      return c.bodys;
    case "uuid":
      return Array.from({ length: c.count }, () => `${c.base}/${nanoid(c.idlen)}`);
  }
};
