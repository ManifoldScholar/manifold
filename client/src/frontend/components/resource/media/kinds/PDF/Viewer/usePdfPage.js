import { useEffect, useRef, useState } from "react";

/**
 * Renders page `pageNumber` of `pdf` into `canvasRef`, scaled to fit `size`
 * (width only, or width and height when `contain` is true) at the device
 * pixel ratio. Returns `{ rendering, error }`.
 */
export default function usePdfPage({
  pdf,
  pageNumber,
  canvasRef,
  size,
  contain
}) {
  const [state, setState] = useState({ rendering: true, error: null });
  // pdf.js refuses a second render on a canvas until the first has settled.
  const settled = useRef(Promise.resolve());

  const { width, height } = size;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!pdf || !canvas || !width || (contain && !height)) return undefined;

    let cancelled = false;
    let renderTask;

    const render = async () => {
      await settled.current;
      if (cancelled) return;
      const page = await pdf.getPage(pageNumber);
      if (cancelled) return;

      const natural = page.getViewport({ scale: 1 });
      const scale = contain
        ? Math.min(width / natural.width, height / natural.height)
        : width / natural.width;
      const ratio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: scale * ratio });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.inlineSize = `${viewport.width / ratio}px`;
      canvas.style.blockSize = `${viewport.height / ratio}px`;

      setState(prev => (prev.rendering ? prev : { ...prev, rendering: true }));
      renderTask = page.render({ canvas, viewport });
      settled.current = renderTask.promise.catch(() => {});
      await renderTask.promise;
      if (!cancelled) setState({ rendering: false, error: null });
    };

    render().catch(error => {
      if (cancelled || error?.name === "RenderingCancelledException") return;
      setState({ rendering: false, error });
    });

    return () => {
      cancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, [pdf, pageNumber, canvasRef, width, height, contain]);

  return state;
}
