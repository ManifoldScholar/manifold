import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom-v5-compat";
import locationHelper from "helpers/location";

export default function ScrollToTop() {
  const location = useLocation();
  const prevLocationRef = useRef(location);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (!locationHelper.preventsScroll(location)) {
        if (!__BROWSER__) return;
        window.scrollTo(0, 0);
      }
    } else if (
      locationHelper.triggersScrollToTop(location, prevLocationRef.current)
    ) {
      if (!__BROWSER__) return;
      window.scrollTo(0, 0);
    }
    prevLocationRef.current = location;
  }, [location]);

  return null;
}
