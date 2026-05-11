import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { nanoid } from "nanoid";

export const itemAtom = atomWithStorage<Items>(`qrtag:item`, {
  item: "uuid",
  base: "",
  idlen: 32,
  count: 12,
});

export const urls = atom((get) => items(get(itemAtom)));

export type Items = ItemList | ItemUUID;

interface ItemList {
  item: "list";
  bodys: string[];
}

interface ItemUUID {
  item: "uuid";
  base: string;
  idlen: number;
  count: number;
}

export const items = (items: Items): string[] => {
  switch (items.item) {
    case "list":
      return items.bodys;
    case "uuid":
      return Array.from({ length: items.count }, () => `${items.base}/${nanoid(items.idlen)}`);
  }
};
