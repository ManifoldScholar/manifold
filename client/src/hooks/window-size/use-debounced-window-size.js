import { useState, useEffect } from "react";
import debounce from "lodash.debounce";

export default function useWindowSize(wait = 200, maxWait = 500) {
  const [dims, setDims] = useState();

  useEffect(() => {
    const handleResize = () => {
      setDims({ width: window.innerWidth, height: window.innerHeight });
    };
    const debouncedResize = debounce(handleResize, wait, {
      leading: false,
      trailing: true,
      maxWait
    });
    if (window) {
      window.addEventListener("resize", debouncedResize);
      return () => window.removeEventListener("resize", debouncedResize);
    }
  }, [wait, maxWait]);

  return dims;
}
