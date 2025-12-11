import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import useScrollToTop from "./useScrollToTop";

export default function useReaderLocationChange(dispatch) {
  useScrollToTop();

  const location = useLocation();
  const prevRef = useRef(location);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = location;
    if (prev === location) return;

    dispatch({ type: "PANELS_HIDE_ALL" });
  }, [location, dispatch]);
}
