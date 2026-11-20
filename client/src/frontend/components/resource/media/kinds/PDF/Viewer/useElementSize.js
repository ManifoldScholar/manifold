import { useEffect, useState } from "react";

/**
 * Tracks the content box size of the element held by `ref`, in CSS pixels.
 * Updates are coalesced to one per animation frame.
 */
export default function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    let frame;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setSize(prev =>
          prev.width === width && prev.height === height
            ? prev
            : { width, height }
        );
      });
    });
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
