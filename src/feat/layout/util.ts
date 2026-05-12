import { type ReactElement, useCallback } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export const useDownload = (filename: string, render: () => ReactElement) =>
  useCallback(() => {
    const svg = renderToStaticMarkup(render());
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [filename, render]);
