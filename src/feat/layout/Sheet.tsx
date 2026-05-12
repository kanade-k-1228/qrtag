import { useAtomValue } from "jotai";
import { Children, type FC, type ReactNode } from "react";
import { urlsAtom } from "../content";
import { fx, size } from "../shape";
import { shapeAtom } from "../shape/state";
import { Tag } from "../tag";
import { styleAtom } from "../tag/state";
import { type Layout, layoutAtom } from ".";

export const Sheet: FC = () => {
  const urls = useAtomValue(urlsAtom);
  const shape = useAtomValue(shapeAtom);
  const layout = useAtomValue(layoutAtom);
  const laser = useAtomValue(styleAtom);

  const [width, height] = size(shape);
  const { pageW, pageH } = computeGrid(layout, width, height, urls.length);
  const stroke = laser.stroke;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${fx(pageW)}mm`}
      height={`${fx(pageH)}mm`}
      viewBox={`0 0 ${fx(pageW)} ${fx(pageH)}`}
    >
      <title>QR tag sheet</title>
      <Layouter>
        {urls.map((url) => (
          <Tag key={url} url={url} stroke={stroke} />
        ))}
      </Layouter>
    </svg>
  );
};

export const Layouter: FC<{ children: ReactNode }> = ({ children }) => {
  const shape = useAtomValue(shapeAtom);
  const layout = useAtomValue(layoutAtom);
  const [cellWidth, cellHeight] = size(shape);
  const cellW = cellWidth + layout.gap;
  const cellH = cellHeight + layout.gap;
  return (
    <>
      {Children.map(children, (child, i) => {
        const col = i % layout.col;
        const row = Math.floor(i / layout.col);
        const ox = layout.pad + col * cellW;
        const oy = layout.pad + row * cellH;
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: grid position is the identity
          <g key={i} transform={`translate(${fx(ox)} ${fx(oy)})`}>
            {child}
          </g>
        );
      })}
    </>
  );
};

export const computeGrid = (
  layout: Layout,
  cellWidth: number,
  cellHeight: number,
  count: number,
): { pageW: number; pageH: number } => {
  const cellW = cellWidth + layout.gap;
  const cellH = cellHeight + layout.gap;
  const rows = Math.max(1, Math.ceil(count / Math.max(1, layout.col)));
  const pageW = layout.pad * 2 + (layout.col - 1) * cellW + cellWidth;
  const pageH = layout.pad * 2 + (rows - 1) * cellH + cellHeight;
  return { pageW, pageH };
};
