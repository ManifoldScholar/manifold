import { useEffect } from "react";
import { useLocation } from "react-router";

export default function useBlurOnLocationChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    const activeEl = document.activeElement;
    if (activeEl) activeEl.blur();
  }, [pathname]);
}
