import { useEffect } from "react";

// Track all active body classes
const activeClasses = new Set();

const updateBodyClass = () => {
  if (typeof document !== "undefined") {
    document.body.className = Array.from(activeClasses)
      .join(" ")
      .trim();
  }
};

export default function useBodyClass(className) {
  useEffect(() => {
    if (!className) return;

    activeClasses.add(className);
    updateBodyClass();

    return () => {
      activeClasses.delete(className);
      updateBodyClass();
    };
  }, [className]);
}
