import { useState, useEffect, useCallback } from "react";
import { throttle } from "lodash-es";

export default function useScrollAware({ threshold = 200 } = {}) {
  const [top, setTop] = useState(true);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset ?? document.documentElement.scrollTop;
    setTop(scrollTop < threshold);
  }, [threshold]);

  useEffect(() => {
    const throttled = throttle(handleScroll, 500);
    window.addEventListener("scroll", throttled);
    return () => {
      window.removeEventListener("scroll", throttled);
      throttled.cancel();
    };
  }, [handleScroll]);

  return { top };
}
