import { useEffect } from "react";

const activeClasses = new Set();

const updateHtmlClass = () => {
  if (typeof document !== "undefined") {
    document.documentElement.className = Array.from(activeClasses)
      .join(" ")
      .trim();
  }
};

export default function useHtmlClass(className) {
  useEffect(() => {
    if (!className) return;

    activeClasses.add(className);
    updateHtmlClass();

    return () => {
      activeClasses.delete(className);
      updateHtmlClass();
    };
  }, [className]);
}
