import { useEffect, useState } from "react";

/**
 * Returns a `version` number that increments whenever layout inside `element`
 * may have changed, and a `fontsReady` flag that becomes true once web fonts
 * have settled. Use `version` as a dependency of effects that measure DOM
 * positions so that they re-measure after late reflows.
 *
 * `version` increments when:
 *
 * - a ResizeObserver observing `element` fires (including its initial
 *   observation),
 * - the document's FontFaceSet fires `loadingdone`, or
 * - `document.fonts.ready` resolves.
 *
 * Both values are initially `0` and `false`, which is also what is returned
 * during server rendering. No browser globals are accessed during render.
 *
 * @param {Element|null} element - The element whose contents are measured.
 * @returns {{ version: number, fontsReady: boolean }}
 */
export default function useLayoutVersion(element) {
  const [state, setState] = useState({ version: 0, fontsReady: false });

  useEffect(() => {
    if (!element || typeof ResizeObserver === "undefined") return undefined;

    let active = true;
    const observer = new ResizeObserver(() => {
      if (active) setState(s => ({ ...s, version: s.version + 1 }));
    });
    observer.observe(element);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [element]);

  useEffect(() => {
    let active = true;
    const markReady = () => {
      if (active) setState(s => ({ fontsReady: true, version: s.version + 1 }));
    };
    const bump = () => {
      if (active) setState(s => ({ ...s, version: s.version + 1 }));
    };

    const fonts = typeof document !== "undefined" ? document.fonts : undefined;

    if (!fonts) {
      markReady();
      return () => {
        active = false;
      };
    }

    fonts.addEventListener("loadingdone", bump);
    if (fonts.ready) fonts.ready.then(markReady);
    else markReady();

    return () => {
      active = false;
      fonts.removeEventListener("loadingdone", bump);
    };
  }, []);

  return state;
}
