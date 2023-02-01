import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useBlurOnLocationChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    const activeEl = document.activeElement;
    if (activeEl) activeEl.blur();
  }, [pathname]);
}
