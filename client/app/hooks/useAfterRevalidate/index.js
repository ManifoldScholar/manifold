import { useEffect, useRef, useCallback } from "react";
import { useRevalidator } from "react-router";

export default function useAfterRevalidate(callback, skip) {
  const revalidator = useRevalidator();
  const revalidateRef = useRef(null);

  useEffect(() => {
    if (skip) return;
    if (revalidateRef.current === "init" && revalidator.state === "loading") {
      revalidateRef.current = "run";
      return;
    }
    if (revalidateRef.current === "run" && revalidator.state === "idle") {
      callback();
      revalidateRef.current = null;
    }
  }, [revalidator, skip, callback]);

  const setIsRevalidating = useCallback(val => {
    if (val) return (revalidateRef.current = "init");
    revalidateRef.current = null;
  }, []);

  return [revalidateRef.current !== null, setIsRevalidating];
}
