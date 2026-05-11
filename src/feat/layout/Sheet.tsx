import { Children, type FC, type ReactNode } from "react";
import { fx, type ShapeProps, size } from "../shape";
import { Tag } from "../tag";
import type { Logo, StyleSetting } from "../tag/state";
import type { QrMatrix } from "../tag/util";
import type { Layout } from ".";
import { SCREEN_STROKE } from "./util";

export const Sheet: FC<{
  shape: ShapeProps;
  layout: Layout;
  laser: StyleSetting;
  logo: Logo;
  urls: string[];
  matrices: QrMatrix[];
  onScreen?: boolean;
}> = ({ shape, layout, laser, logo, urls, matrices, onScreen }) => {
  const [width, height] = size(shape);
  const { pageW, pageH } = computeGrid(layout, width, height, urls.length);
  const stroke = onScreen ? SCREEN_STROKE : laser.stroke;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${fx(pageW)}mm`}
      height={`${fx(pageH)}mm`}
      viewBox={`0 0 ${fx(pageW)} ${fx(pageH)}`}
    >
      <title>QR tag sheet</title>
      <Layouter layout={layout} cellWidth={width} cellHeight={height}>
        {urls.map((url, i) => (
          <Tag
            key={url}
            shape={shape}
            url={url}
            matrix={matrices[i]}
            laser={laser}
            stroke={stroke}
            logo={logo}
          />
        ))}
      </Layouter>
    </svg>
  );
};

export const Layouter: FC<{
  layout: Layout;
  cellWidth: number;
  cellHeight: number;
  children: ReactNode;
}> = ({ layout, cellWidth, cellHeight, children }) => {
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
