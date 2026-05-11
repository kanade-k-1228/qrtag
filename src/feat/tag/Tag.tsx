import type { FC } from "react";
import { fx, getModule, type ShapeProps } from "../shape";
import type { Logo, StyleSetting } from "./state";
import { type QrMatrix, truncateMiddle } from "./util";

export const Tag: FC<{
  shape: ShapeProps;
  url: string;
  matrix: QrMatrix;
  laser: StyleSetting;
  stroke: number;
  logo: Logo;
}> = ({ shape, url, matrix, laser, stroke, logo }) => {
  const mod = getModule(shape.shape);
  const box = mod.qrBox(shape);
  const cellSize = box.size / matrix.size;
  const labelMaxChars = Math.max(10, Math.floor(mod.size(shape)[0] / 0.7));

  return (
    <>
      <text x={0} y={-0.5} fontFamily="monospace" fontSize={1.2} fill={laser.commentColor}>
        {truncateMiddle(url, labelMaxChars)}
      </text>

      <mod.Outline shape={shape} color={laser.cuttingColor} stroke={stroke} />

      <g fill={laser.patternColor} stroke="none" transform={`translate(${fx(box.x)} ${fx(box.y)})`}>
        {matrix.cells.map(({ x, y }) => (
          <rect
            key={`${x}-${y}`}
            x={fx(x * cellSize)}
            y={fx(y * cellSize)}
            width={fx(cellSize)}
            height={fx(cellSize)}
          />
        ))}
      </g>

      {logo.src && (
        <LogoOverlay
          src={logo.src}
          sizeRatio={logo.sizeRatio}
          qrSize={box.size}
          qrX={box.x}
          qrY={box.y}
        />
      )}
    </>
  );
};

const LogoOverlay: FC<{
  src: string;
  sizeRatio: number;
  qrSize: number;
  qrX: number;
  qrY: number;
}> = ({ src, sizeRatio, qrSize, qrX, qrY }) => {
  const size = qrSize * Math.max(0.05, Math.min(0.5, sizeRatio));
  const lx = qrX + (qrSize - size) / 2;
  const ly = qrY + (qrSize - size) / 2;
  return (
    <>
      <rect x={fx(lx)} y={fx(ly)} width={fx(size)} height={fx(size)} fill="white" />
      <image
        href={src}
        x={fx(lx)}
        y={fx(ly)}
        width={fx(size)}
        height={fx(size)}
        preserveAspectRatio="xMidYMid meet"
      />
    </>
  );
};
