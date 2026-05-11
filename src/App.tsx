import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { itemAtom, items } from "./feat/item";
import { ItemSettings } from "./feat/item/Settings";
import { layoutAtom } from "./feat/layout";
import { LayoutSettings } from "./feat/layout/Settings";
import { computeGrid, Sheet } from "./feat/layout/Sheet";
import { size as shapeSize } from "./feat/tag";
import { LogoSettings } from "./feat/tag/LogoSettings";
import { ShapeSettings } from "./feat/tag/Settings";
import { StyleSettings } from "./feat/tag/StyleSettings";
import { logoAtom, shapeAtom, styleAtom } from "./feat/tag/state";
import { useQrMatrices } from "./feat/tag/util";
import { download } from "./util";

export const App = () => {
  const item = useAtomValue(itemAtom);
  const shape = useAtomValue(shapeAtom);
  const layout = useAtomValue(layoutAtom);
  const logo = useAtomValue(logoAtom);
  const laser = useAtomValue(styleAtom);

  const urls = useMemo(() => items(item), [item]);
  const matrices = useQrMatrices(urls);

  const [bboxW, bboxH] = shapeSize(shape);
  const { pageW, pageH } = computeGrid(layout, bboxW, bboxH, urls.length);

  const onDownload = useCallback(() => {
    const svg = renderToStaticMarkup(
      <Sheet
        shape={shape}
        layout={layout}
        laser={laser}
        logo={logo}
        urls={urls}
        matrices={matrices}
      />,
    );
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`], {
      type: "image/svg+xml;charset=utf-8",
    });
    download(blob, "qrtag.svg");
  }, [laser, layout, logo, matrices, shape, urls]);

  return (
    <div className="flex h-screen flex-col print:block print:h-auto">
      <header className="flex shrink-0 items-center gap-3 border-b bg-background p-3 print:hidden">
        <Button type="button" onClick={onDownload}>
          Download SVG
        </Button>
        <Button type="button" variant="outline" onClick={() => globalThis.window?.print()}>
          Print
        </Button>
        <span className="text-xs text-muted-foreground">
          {urls.length} tags / {pageW.toFixed(1)} × {pageH.toFixed(1)} mm
        </span>
      </header>

      <div className="flex min-h-0 flex-1 print:block">
        <aside className="flex w-96 shrink-0 flex-col border-r bg-background print:hidden">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-2 p-3 text-sm">
              <ItemSettings />
              <ShapeSettings />
              <LayoutSettings />
              <StyleSettings />
              <LogoSettings />
            </div>
          </ScrollArea>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto p-4 print:overflow-visible print:p-0">
          <div className="inline-block bg-white ring-1 ring-border print:bg-transparent print:ring-0">
            <Sheet
              shape={shape}
              layout={layout}
              laser={laser}
              logo={logo}
              urls={urls}
              matrices={matrices}
              onScreen
            />
          </div>
        </main>
      </div>
    </div>
  );
};
