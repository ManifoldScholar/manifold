import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function useScrollToTop() {
  const location = useLocation();
  const prevRef = useRef(location);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = location;
    if (prev === location) return;

    const hashed = location.hash !== "";
    const noScroll = location.state?.noScroll === true;

    if (!hashed && !noScroll) {
      window.scrollTo(0, 0);
    }
  }, [location]);
}
