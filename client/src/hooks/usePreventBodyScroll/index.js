/* This hook is based on and significantly borrows from the fix Reakit is implementing for their v2 release. See: https://github.com/ariakit/ariakit/pull/1271/files  */

import { useState, useLayoutEffect, useEffect } from "react";

const scrollLockStyles = {
  overflow: "hidden",
  scrollbarGutter: "stable",
  position: "absolute",
  width: "100%"
};

export default function usePreventBodyScroll(active = false) {
  const isBrowser =
    typeof window !== "undefined" && !!window.document?.createElement;
  const safeEffect = isBrowser ? useLayoutEffect : useEffect;

  const [baseStyles, setBaseStyles] = useState({});

  safeEffect(() => {
    setBaseStyles(document.body?.style.cssText ?? {});
  }, []);

  safeEffect(() => {
    const { body } = document;

    if (!body) return () => {};

    Object.assign(body.style, active ? scrollLockStyles : baseStyles);

    return () => (body.style.cssText = baseStyles);
  }, [active]);
}
